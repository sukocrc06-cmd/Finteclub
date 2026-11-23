// ============================================================
//  functions/api/admin-login.js  (Cloudflare Pages Functions)
//  Sunucu taraflı yönetim paneli girişi.
//
//  Cloudflare'da tanımlanması gereken ortam değişkenleri:
//    ADMIN_CRED_HASH  -> sha256("eposta|sifre") sonucu (64 karakterlik hex)
//    SESSION_SECRET   -> rastgele uzun bir metin (oturum imzası için)
// ============================================================

const COOKIE_NAME = 'ftc_admin';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 saat

function json(body, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...extraHeaders }
    });
}

function setCookie(token) {
    return COOKIE_NAME + '=' + token +
        '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=' + SESSION_TTL_SECONDS;
}

function clearCookie() {
    return COOKIE_NAME + '=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
}

function getCookie(request, name) {
    const raw = request.headers.get('Cookie') || '';
    for (const part of raw.split(';')) {
        const i = part.indexOf('=');
        if (i === -1) continue;
        if (part.slice(0, i).trim() === name) {
            return decodeURIComponent(part.slice(i + 1).trim());
        }
    }
    return null;
}

async function sha256hex(message) {
    const data = new TextEncoder().encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSign(payload, secret) {
    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function safeEqual(a, b) {
    const ha = await sha256hex(String(a));
    const hb = await sha256hex(String(b));
    if (ha.length !== hb.length) return false;
    let diff = 0;
    for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
    return diff === 0;
}

async function createToken(secret) {
    const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
    const nonce = [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
    const payload = exp + '.' + nonce;
    const mac = await hmacSign(payload, secret);
    return payload + '.' + mac;
}

async function verifyToken(token, secret) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [exp, nonce, mac] = parts;
    if (!/^\d+$/.test(exp)) return false;
    const expected = await hmacSign(exp + '.' + nonce, secret);
    if (!(await safeEqual(mac, expected))) return false;
    return Number(exp) > Date.now();
}

export async function onRequest(context) {
    const { request, env } = context;
    const SESSION_SECRET = env.SESSION_SECRET;
    const ADMIN_CRED_HASH = env.ADMIN_CRED_HASH;

    if (!SESSION_SECRET) {
        return json({ error: 'Sunucu yapılandırma hatası: SESSION_SECRET tanımlı değil.' }, 500);
    }

    // ---- Oturum kontrolü ----
    if (request.method === 'GET') {
        const token = getCookie(request, COOKIE_NAME);
        const ok = await verifyToken(token, SESSION_SECRET);
        return json({ authenticated: ok });
    }

    // ---- Çıkış ----
    if (request.method === 'DELETE') {
        return json({ success: true }, 200, { 'Set-Cookie': clearCookie() });
    }

    // ---- Giriş ----
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
    }

    if (!ADMIN_CRED_HASH) {
        return json({ error: 'Sunucu yapılandırma hatası: ADMIN_CRED_HASH tanımlı değil.' }, 500);
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const { email, password } = body;
    const combo = String(email || '').trim() + '|' + String(password || '');
    const attemptHash = await sha256hex(combo);

    if (!(await safeEqual(attemptHash, String(ADMIN_CRED_HASH).trim().toLowerCase()))) {
        await new Promise(r => setTimeout(r, 600));
        return json({ error: 'E-posta veya şifre hatalı.' }, 401);
    }

    const token = await createToken(SESSION_SECRET);
    return json({ success: true }, 200, { 'Set-Cookie': setCookie(token) });
}
