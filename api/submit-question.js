export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        res.status(400).json({ error: 'Eksik alanlar var.' });
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

        const contentB64 = Buffer.from(JSON.stringify(messagesArr, null, 2), 'utf-8').toString('base64');

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
