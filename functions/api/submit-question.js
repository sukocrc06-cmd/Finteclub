// ============================================================
//  functions/api/submit-question.js  (Cloudflare Pages Functions)
//  Soru formu — herkese açık, kimlik doğrulama yok.
// ============================================================

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status, headers: { 'Content-Type': 'application/json' }
    });
}

function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

export async function onRequest(context) {
    const { request, env } = context;

    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
    }

    let body;
    try { body = await request.json(); } catch { body = {}; }
    const { name, email, message } = body;

    if (!name || !email || !message) {
        return json({ error: 'Eksik alanlar var.' }, 400);
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const PATH = 'messages.json';
    const BRANCH = 'main';
    const token = env.GITHUB_TOKEN;

    if (!token) {
        return json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' }, 500);
    }

    try {
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}`, 'User-Agent': 'FinTeClub-CF' }
        });

        let messagesArr = [];
        let sha = null;

        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
            const decoded = atob(fileData.content.replace(/\n/g, ''));
            messagesArr = JSON.parse(new TextDecoder().decode(Uint8Array.from(decoded, c => c.charCodeAt(0))));
        } else if (getRes.status !== 404) {
            throw new Error('GitHub okuma hatası: HTTP ' + getRes.status);
        }

        const newMsg = {
            id: 'm' + Date.now(),
            name: String(name).slice(0, 200),
            email: String(email).slice(0, 200),
            subject: 'Bize Soru Sor Formu',
            body: String(message).slice(0, 5000),
            date: new Date().toISOString().slice(0, 10),
            unread: true
        };
        messagesArr.unshift(newMsg);

        const contentB64 = base64Encode(JSON.stringify(messagesArr, null, 2));

        const putBody = {
            message: 'Yeni soru eklendi: ' + newMsg.name,
            content: contentB64,
            branch: BRANCH
        };
        if (sha) putBody.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'FinTeClub-CF'
            },
            body: JSON.stringify(putBody)
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || ('HTTP ' + putRes.status));
        }

        return json({ success: true, id: newMsg.id });
    } catch (e) {
        return json({ error: e.message }, 500);
    }
}
