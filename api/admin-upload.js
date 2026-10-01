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

    const { path, contentBase64, message } = req.body || {};
    const isAllowedFolder = typeof path === 'string' && (path.startsWith('images/') || path.startsWith('dokumanlar/'));
    if (!isAllowedFolder) {
        res.status(400).json({ error: 'Geçersiz dosya yolu. Sadece images/ veya dokumanlar/ klasörlerine yüklenebilir.' });
        return;
    }
    if (!contentBase64) {
        res.status(400).json({ error: 'contentBase64 alanı gerekli.' });
        return;
    }

    const REPO = 'sukocrc06-cmd/Finteclub';
    const BRANCH = 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    try {
        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
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

        res.status(200).json({ success: true, path });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
