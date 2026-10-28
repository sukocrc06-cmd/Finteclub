// ============================================================
//  api/admin-upload.js
//  Yetki artık sabit anahtarla değil, api/admin-login.js'in verdiği
//  imzalı oturum cookie'si ile doğrulanır. Kodda hiçbir sır yoktur.
//  Ek olarak ".." içeren yollara karşı koruma eklendi.
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

    const { path, contentBase64, message } = req.body || {};
    const isAllowedFolder = typeof path === 'string' &&
        (path.startsWith('images/') || path.startsWith('dokumanlar/')) &&
        !path.includes('..');
    if (!isAllowedFolder) {
        res.status(400).json({ error: 'Geçersiz dosya yolu. Sadece images/ veya dokumanlar/ klasörlerine yüklenebilir.' });
        return;
    }
    if (!contentBase64) {
        res.status(400).json({ error: 'contentBase64 alanı gerekli.' });
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
        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message || ('Admin panel dosya yüklemesi: ' + path),
                content: contentBase64,
                branch: BRANCH
            })
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || ('HTTP ' + putRes.status));
        }

        res.status(200).json({ success: true, path });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
