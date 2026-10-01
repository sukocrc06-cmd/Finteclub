export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ADMIN_KEY = 'ftc-admin-9f3a7k2m8x';
    const providedKey = req.headers['x-admin-key'];
    if (!providedKey || providedKey !== ADMIN_KEY) {
        res.status(401).json({ error: 'Yetkisiz erişim.' });
        return;
    }

    const { path, content, message } = req.body || {};
    const ALLOWED_PATHS = ['site-data.json', 'ekip.json', 'messages.json'];
    if (!ALLOWED_PATHS.includes(path)) {
        res.status(400).json({ error: 'Geçersiz dosya yolu.' });
        return;
    }
    if (content === undefined) {
        res.status(400).json({ error: 'content alanı gerekli.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const BRANCH = 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    async function getSha() {
        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}` }
        });
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('GitHub sha okuma hatası: HTTP ' + r.status);
        const data = await r.json();
        return data.sha;
    }

    async function putFile(sha, attempt) {
        const contentB64 = Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64');
        const body = {
            message: message || ('Admin panel güncellemesi: ' + path),
            content: contentB64,
            branch: BRANCH
        };
        if (sha) body.sha = sha;

        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!r.ok) {
            const err = await r.json();
            const isShaMismatch = err.message && err.message.includes('does not match');
            if (isShaMismatch && attempt < 4) {
                await new Promise(resolve => setTimeout(resolve, attempt * 1500));
                const freshSha = await getSha();
                return putFile(freshSha, attempt + 1);
            }
            throw new Error(err.message || ('HTTP ' + r.status));
        }
    }

    try {
        const sha = await getSha();
        await putFile(sha, 1);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
