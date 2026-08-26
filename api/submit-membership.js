export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { firstName, lastName, email, phone, university, faculty, department, grade } = req.body || {};

    if (!firstName || !lastName) {
        res.status(400).json({ error: 'İsim ve soyisim gerekli.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const PATH = 'messages.json';
    const BRANCH = 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    try {
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
            headers: { Authorization: `token ${token}` }
        });

        let messagesArr = [];
        let sha = null;

        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
            const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
            messagesArr = JSON.parse(decoded);
        } else if (getRes.status !== 404) {
            throw new Error('GitHub okuma hatası: HTTP ' + getRes.status);
        }

        const bodyText =
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

        const contentB64 = Buffer.from(JSON.stringify(messagesArr, null, 2), 'utf-8').toString('base64');

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putBody)
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || ('HTTP ' + putRes.status));
        }

        res.status(200).json({ success: true, id: newMsg.id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
