// ============================================================
//  api/admin-login.js
//  Sunucu taraflı yönetim paneli girişi.
//
//  Vercel'de tanımlanması gereken ortam değişkenleri:
//    ADMIN_CRED_HASH  -> sha256("eposta|sifre") sonucu (64 karakterlik hex)
//    SESSION_SECRET   -> rastgele uzun bir metin (oturum imzası için)
//
//  POST   /api/admin-login  { email, password }  -> giriş yapar, cookie verir
//  GET    /api/admin-login                       -> oturum geçerli mi? kontrol
//  DELETE /api/admin-login                       -> çıkış yapar, cookie'yi siler
//
//  Not: Burada hiçbir sır sabit olarak yazılı değildir ve bu dosya
//  tarayıcıya hiç gönderilmez; yalnızca sunucuda çalışır.
// ============================================================

import crypto from 'crypto';

const COOKIE_NAME = 'ftc_admin';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 saat

// Uzunluk sızdırmadan sabit zamanlı karşılaştırma:
// iki değeri de önce hash'leyip eşit uzunlukta tamponlar üzerinden karşılaştırır.
function safeEqual(a, b) {
    const ha = crypto.createHash('sha256').update(String(a)).digest();
    const hb = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(ha, hb);
}

function sign(payload, secret) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function createToken(secret) {
    const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
    const nonce = crypto.randomBytes(8).toString('hex');
    const payload = exp + '.' + nonce;
    return payload + '.' + sign(payload, secret);
}

function verifyToken(token, secret) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [exp, nonce, mac] = parts;
    if (!/^\d+$/.test(exp)) return false;
    if (!safeEqual(mac, sign(exp + '.' + nonce, secret))) return false;
    return Number(exp) > Date.now();
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

function setSessionCookie(res, token) {
    res.setHeader('Set-Cookie',
        COOKIE_NAME + '=' + token +
        '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=' + SESSION_TTL_SECONDS);
}

function clearSessionCookie(res) {
    res.setHeader('Set-Cookie',
        COOKIE_NAME + '=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
}

export default async function handler(req, res) {
    const SESSION_SECRET = process.env.SESSION_SECRET;
    const ADMIN_CRED_HASH = process.env.ADMIN_CRED_HASH;

    if (!SESSION_SECRET) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: SESSION_SECRET tanımlı değil.' });
        return;
    }

    // ---- Oturum kontrolü (panel açılışında kullanılır) ----
    if (req.method === 'GET') {
        const token = getCookie(req, COOKIE_NAME);
        res.status(200).json({ authenticated: verifyToken(token, SESSION_SECRET) });
        return;
    }

    // ---- Çıkış ----
    if (req.method === 'DELETE') {
        clearSessionCookie(res);
        res.status(200).json({ success: true });
        return;
    }

    // ---- Giriş ----
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!ADMIN_CRED_HASH) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: ADMIN_CRED_HASH tanımlı değil.' });
        return;
    }

    const { email, password } = req.body || {};
    const combo = String(email || '').trim() + '|' + String(password || '');
    const attemptHash = crypto.createHash('sha256').update(combo).digest('hex');

    if (!safeEqual(attemptHash, String(ADMIN_CRED_HASH).trim().toLowerCase())) {
        // Kaba kuvvet denemelerini yavaşlatmak için kısa bir gecikme.
        await new Promise(r => setTimeout(r, 600));
        res.status(401).json({ error: 'E-posta veya şifre hatalı.' });
        return;
    }

    setSessionCookie(res, createToken(SESSION_SECRET));
    res.status(200).json({ success: true });
}
