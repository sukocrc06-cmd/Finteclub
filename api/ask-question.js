// Vercel serverless function: receives "Bize Soru Sor" form submissions and
// commits them to messages.json using a server-side GitHub token, so visitors
// never need write access to the repo themselves.
const REPO = 'sukocrc06-cmd/Finteclub';
const PATH = 'messages.json';
const BRANCH = 'main';

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { name, email, message } = req.body || {};

    if (!name || !email || !message || !String(name).trim() || !String(email).trim() || !String(message).trim()) {
        res.status(400).json({ error: 'Eksik alan' });
        return;
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
        res.status(400).json({ error: 'Alan çok uzun' });
        return;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error('GITHUB_TOKEN ortam değişkeni tanımlı değil');
        res.status(500).json({ error: 'Sunucu yapılandırması eksik' });
        return;
    }

    try {
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}`, 'User-Agent': 'finteclub-ask-question' }
        });

        let messagesArr = [];
        let sha = null;

        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
            messagesArr = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
        } else if (getRes.status !== 404) {
            throw new Error('GitHub GET error: ' + getRes.status);
        }

        messagesArr.unshift({
            id: 'm' + Date.now(),
            name: String(name).trim(),
            email: String(email).trim(),
            subject: 'Bize Soru Sor Formu',
            body: String(message).trim(),
            date: new Date().toISOString().slice(0, 10),
            unread: true
        });

        const updatedContentB64 = Buffer.from(JSON.stringify(messagesArr, null, 2), 'utf-8').toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'finteclub-ask-question'
            },
            body: JSON.stringify({
                message: 'Yeni soru eklendi: ' + String(name).trim(),
                content: updatedContentB64,
                branch: BRANCH,
                ...(sha ? { sha } : {})
            })
        });

        if (!putRes.ok) {
            throw new Error('GitHub PUT error: ' + putRes.status + ' ' + (await putRes.text()));
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('ask-question kayıt hatası:', err);
        res.status(500).json({ error: 'Kayıt başarısız' });
    }
};
