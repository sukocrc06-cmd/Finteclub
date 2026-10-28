// ============================================================
//  api/admin-read.js
//  Yetki artık sabit anahtarla değil, api/admin-login.js'in verdiği
//  imzalı oturum cookie'si ile doğrulanır. Kodda hiçbir sır yoktur.
// ============================================================

import crypto from 'crypto';

const COOKIE_NAME = 'ftc_admin';

function safeEqual(a, b) {
    const ha = crypto.createHash('sha256').update(String(a)).digest();
    const hb = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(ha, hb);
}

function getCookie(req, name) {
    const raw = req.headers.cookie || '';
    for (const part of raw.split(';')) {
        const i = part.indexOf('=');
        if (i === -1) continue;
        if (part.slice(0, i).trim() === name) {
            return decodeURIComponent(part.slice(i + 1).trim());
        }
    }
    return null;
}

function isAuthorized(req) {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return false;
    const token = getCookie(req, COOKIE_NAME);
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [exp, nonce, mac] = parts;
    if (!/^\d+$/.test(exp)) return false;
    const expected = crypto.createHmac('sha256', secret).update(exp + '.' + nonce).digest('hex');
    if (!safeEqual(mac, expected)) return false;
    return Number(exp) > Date.now();
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!isAuthorized(req)) {
        res.status(401).json({ error: 'Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.' });
        return;
    }

    const { path } = req.query || {};
    const ALLOWED_PATHS = ['site-data.json', 'ekip.json', 'messages.json'];
    if (!ALLOWED_PATHS.includes(path)) {
        res.status(400).json({ error: 'Geçersiz dosya yolu.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const BRANCH = 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    try {
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}` }
        });

        if (getRes.status === 404) {
            res.status(200).json({ content: null });
            return;
        }
        if (!getRes.ok) {
            throw new Error('GitHub okuma hatası: HTTP ' + getRes.status);
        }

        const fileData = await getRes.json();
        const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);

        res.status(200).json({ content: parsed });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
