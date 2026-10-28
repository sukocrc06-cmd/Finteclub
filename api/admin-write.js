// ============================================================
//  api/admin-write.js
//  Yetki artık sabit anahtarla değil, api/admin-login.js'in verdiği
//  imzalı oturum cookie'si ile doğrulanır. Kodda hiçbir sır yoktur.
//  GitHub sha çakışmasına karşı tekrar deneme mantığı aynen korundu.
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
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!isAuthorized(req)) {
        res.status(401).json({ error: 'Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.' });
        return;
    }

    const { path, content, message } = req.body || {};
    const ALLOWED_PATHS = ['site-data.json', 'ekip.json', 'messages.json'];
    if (!ALLOWED_PATHS.includes(path)) {
        res.status(400).json({ error: 'Geçersiz dosya yolu.' });
        return;
    }
    if (content === undefined) {
        res.status(400).json({ error: 'content alanı gerekli.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const BRANCH = 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    async function getSha() {
        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('GitHub sha okuma hatası: HTTP ' + r.status);
        const data = await r.json();
        return data.sha;
    }

    async function putFile(sha, attempt) {
        const contentB64 = Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64');
        const body = {
            message: message || ('Admin panel güncellemesi: ' + path),
            content: contentB64,
            branch: BRANCH
        };
        if (sha) body.sha = sha;

        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!r.ok) {
            const err = await r.json();
            const isShaMismatch = err.message && err.message.includes('does not match');
            if (isShaMismatch && attempt < 4) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
                const freshSha = await getSha();
                return putFile(freshSha, attempt + 1);
            }
            throw new Error(err.message || ('HTTP ' + r.status));
        }
    }

    try {
        const sha = await getSha();
        await putFile(sha, 1);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
