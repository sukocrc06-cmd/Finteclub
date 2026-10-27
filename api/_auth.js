// Oturum kontrolü: api/admin-login.js'in verdiği imzalı "ftc_admin" cookie'sini doğrular.
// (admin-read/write/upload içindeki kontrolün aynısı.) Dosya adı "_" ile başladığı için
// Vercel bunu ayrı bir API adresi olarak yayınlamaz.
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

export function isAuthorized(req) {
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
