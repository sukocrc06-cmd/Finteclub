import { getDataBranch } from './_github.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ADMIN_KEY = 'ftc-admin-9f3a7k2m8x';
    const providedKey = req.headers['x-admin-key'];
    if (!providedKey || providedKey !== ADMIN_KEY) {
        res.status(401).json({ error: 'Yetkisiz erişim.' });
        return;
    }

    const { path } = req.query || {};
    const ALLOWED_PATHS = ['site-data.json', 'ekip.json', 'messages.json'];
    if (!ALLOWED_PATHS.includes(path)) {
        res.status(400).json({ error: 'Geçersiz dosya yolu.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    // Canlı sitede 'main'; Vercel önizlemesinde ayrı önizleme veri dalı (bkz. api/_github.js)
    let BRANCH;
    try {
        BRANCH = await getDataBranch(token);
    } catch (e) {
        res.status(500).json({ error: e.message });
        return;
    }

    try {
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
            headers: { Authorization: `token ${token}` }
        });

        if (getRes.status === 404) {
            res.status(200).json({ content: null, branch: BRANCH });
            return;
        }
        if (!getRes.ok) {
            throw new Error('GitHub okuma hatası: HTTP ' + getRes.status);
        }

        const fileData = await getRes.json();
        const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);

        res.status(200).json({ content: parsed, branch: BRANCH });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
