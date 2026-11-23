// ============================================================
//  functions/api/submit-membership.js  (Cloudflare Pages Functions)
//  Üyelik başvurusu — herkese açık, kimlik doğrulama yok.
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
    const { firstName, lastName, studentNumber, email, phone, university, faculty, department, grade } = body;

    if (!firstName || !lastName || !/^2\d{10}$/.test(String(studentNumber || ''))) {
        return json({ error: 'İsim, soyisim ve 2 ile başlayan geçerli (11 haneli) bir öğrenci numarası gerekli.' }, 400);
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

        const bodyText =
            'Öğrenci Numarası: ' + String(studentNumber).slice(0, 11) + '\n' +
            'E-posta: ' + String(email || '-').slice(0, 200) + '\n' +
            'Telefon: ' + String(phone || '-').slice(0, 50) + '\n' +
            'Üniversite: ' + String(university || '-').slice(0, 200) + '\n' +
            'Fakülte: ' + String(faculty || '-').slice(0, 200) + '\n' +
            'Bölüm: ' + String(department || '-').slice(0, 200) + '\n' +
            'Sınıf: ' + String(grade || '-').slice(0, 50);

        const newMsg = {
            id: 'm' + Date.now(),
            name: (String(firstName).slice(0, 100) + ' ' + String(lastName).slice(0, 100)).trim(),
            email: String(email || '').slice(0, 200),
            subject: 'Üyelik Ayrıcalığı Başvurusu',
            body: bodyText,
            date: new Date().toISOString().slice(0, 10),
            unread: true
        };
        messagesArr.unshift(newMsg);

        const contentB64 = base64Encode(JSON.stringify(messagesArr, null, 2));

        const putBody = {
            message: 'Yeni üyelik başvurusu: ' + newMsg.name,
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
