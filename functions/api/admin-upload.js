// ============================================================
//  functions/api/admin-upload.js  (Cloudflare Pages Functions)
//  ".." içeren yollara karşı koruma korundu.
// ============================================================

const COOKIE_NAME = 'ftc_admin';

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status, headers: { 'Content-Type': 'application/json' }
    });
}

function getCookie(request, name) {
    const raw = request.headers.get('Cookie') || '';
    for (const part of raw.split(';')) {
        const i = part.indexOf('=');
        if (i === -1) continue;
        if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
    }
    return null;
}

async function sha256hex(msg) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
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

async function isAuthorized(request, secret) {
    if (!secret) return false;
    const token = getCookie(request, COOKIE_NAME);
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

    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
    }

    if (!(await isAuthorized(request, env.SESSION_SECRET))) {
        return json({ error: 'Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.' }, 401);
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const { path, contentBase64, message } = body;

    const isAllowedFolder = typeof path === 'string' &&
        (path.startsWith('images/') || path.startsWith('dokumanlar/')) &&
        !path.includes('..');
    if (!isAllowedFolder) {
        return json({ error: 'Geçersiz dosya yolu. Sadece images/ veya dokumanlar/ klasörlerine yüklenebilir.' }, 400);
    }
    if (!contentBase64) {
        return json({ error: 'contentBase64 alanı gerekli.' }, 400);
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const BRANCH = 'main';
    const token = env.GITHUB_TOKEN;

    if (!token) {
        return json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' }, 500);
    }

    try {
        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'FinTeClub-CF'
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

        return json({ success: true, path });
    } catch (e) {
        return json({ error: e.message }, 500);
    }
}
