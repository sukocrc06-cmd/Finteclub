// Ortak GitHub yardımcıları.
// Dosya adı "_" ile başladığı için Vercel bunu ayrı bir API adresi olarak yayınlamaz.

export const REPO = 'sukocrc06-cmd/Finteclub';
export const PRODUCTION_BRANCH = 'main';

// Önizleme (Preview) ortamında yapılan kayıtlar canlı verinin olduğu "main" dalına
// değil, bu ayrı dala yazılır. Böylece önizlemede yapılan denemeler canlı siteyi
// etkilemez ve bu dal hiçbir zaman main ile birleştirilmez.
export const PREVIEW_DATA_BRANCH = process.env.PREVIEW_DATA_BRANCH || 'onizleme-verisi';

export function isPreview() {
    return process.env.VERCEL_ENV === 'preview';
}

function ghHeaders(token) {
    return { Authorization: `token ${token}`, 'Content-Type': 'application/json' };
}

// Canlı sitede (ve yerelde) her zaman "main" döner; davranış öncekiyle aynıdır.
// Önizlemede önizleme veri dalını döner, dal yoksa main'in güncel halinden oluşturur.
export async function getDataBranch(token) {
    if (!isPreview()) return PRODUCTION_BRANCH;

    const refUrl = `https://api.github.com/repos/${REPO}/git/ref/heads/${encodeURIComponent(PREVIEW_DATA_BRANCH)}`;
    const existing = await fetch(refUrl, { headers: ghHeaders(token) });
    if (existing.ok) return PREVIEW_DATA_BRANCH;
    if (existing.status !== 404) throw new Error('Önizleme veri dalı okunamadı: HTTP ' + existing.status);

    const mainRef = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/${PRODUCTION_BRANCH}`, { headers: ghHeaders(token) });
    if (!mainRef.ok) throw new Error('main dalı okunamadı: HTTP ' + mainRef.status);
    const { object } = await mainRef.json();

    const created = await fetch(`https://api.github.com/repos/${REPO}/git/refs`, {
        method: 'POST',
        headers: ghHeaders(token),
        body: JSON.stringify({ ref: `refs/heads/${PREVIEW_DATA_BRANCH}`, sha: object.sha })
    });
    // 422: dal bu arada başka bir istekle oluşturulmuş olabilir, sorun değil.
    if (!created.ok && created.status !== 422) throw new Error('Önizleme veri dalı oluşturulamadı: HTTP ' + created.status);
    return PREVIEW_DATA_BRANCH;
}

// JSON dosyasını okur. Dosya yoksa { data: null, sha: null } döner.
export async function readJson(token, path, branch) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
        headers: ghHeaders(token)
    });
    if (r.status === 404) return { data: null, sha: null };
    if (!r.ok) throw new Error('GitHub okuma hatası: HTTP ' + r.status);
    const file = await r.json();
    return { data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8')), sha: file.sha };
}

// Dosyayı okur, mutate(data) ile değiştirir ve yazar. Başka biri aynı anda yazdıysa
// güncel hali tekrar okuyup değişikliği yeniden uygular (en fazla 4 deneme).
// mutate bir hata fırlatırsa hiçbir şey yazılmaz.
export async function updateJson(token, path, branch, message, mutate) {
    for (let attempt = 1; attempt <= 4; attempt++) {
        const { data, sha } = await readJson(token, path, branch);
        const result = await mutate(data);
        const body = {
            message,
            content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
            branch
        };
        if (sha) body.sha = sha;
        const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: ghHeaders(token),
            body: JSON.stringify(body)
        });
        if (r.ok) return result;
        const err = await r.json().catch(() => ({}));
        const conflict = r.status === 409 || (err.message && err.message.includes('does not match'));
        if (!conflict || attempt === 4) throw new Error(err.message || ('HTTP ' + r.status));
        await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
}
