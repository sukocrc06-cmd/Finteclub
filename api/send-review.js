import { getDataBranch, readJson, updateJson, isPreview } from './_github.js';

// Denetim kararı: haftalık ekip raporunu onaylar ya da revizyon ister ve
// raporu yükleyen kişiye otomatik mail gönderir.
//
// Güvenlik için bu fonksiyon alıcıyı ya da mail metnini istekten ALMAZ:
//  - Alıcı, site-data.json'da kayıtlı rapordaki yükleyen kişidir.
//  - Bu adres ekip.json'daki bir kulüp üyesine ait olmak zorundadır.
//  - Mail metni burada sabit şablondan üretilir; istekten sadece denetim notu gelir.
//  - Karar verilmiş bir rapor için ikinci kez mail gönderilmez.
//
// Gerçek mail gönderimi varsayılan olarak KAPALIDIR (test modu). Açmak için Vercel
// ayarlarına şu ortam değişkenleri eklenir:
//   MAIL_ENABLED   = true
//   RESEND_API_KEY = (resend.com'dan alınan anahtar)
//   MAIL_FROM      = FinTeClub Denetim <denetim@finteclub.com.tr>   (doğrulanmış alan adı)
// Bunlar eksikse karar yine kaydedilir ama mail gönderilmez, sadece önizlemesi döner.

const DATA_PATH = 'site-data.json';
const EKIP_PATH = 'ekip.json';
const NOTE_MAX = 1000;

const TEAM_NAMES = {
    'yonetim-kurulu': 'Yönetim Kurulu',
    'denetleme-kurulu': 'Denetleme Kurulu',
    'sosyal-medya': 'Sosyal Medya',
    'kurumsal-iletisim': 'Kurumsal İletişim',
    'etkinlik-kurulu': 'Etkinlik Kurulu',
    'yazilim-proje': 'Yazılım & Proje'
};

function teamName(key) {
    return TEAM_NAMES[key] || String(key || '').replace(/-/g, ' ');
}

// "2026-W44" -> "44. hafta (2026)"
function weekLabel(week) {
    const m = /^(\d{4})-W(\d{1,2})$/.exec(String(week || ''));
    return m ? `${Number(m[2])}. hafta (${m[1]})` : String(week || '');
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function buildMail(doc, decision, note) {
    const firstName = String(doc.uploaderName || '').trim().split(/\s+/)[0] || 'Merhaba';
    const team = teamName(doc.team);
    const week = weekLabel(doc.week);
    const title = doc.title || 'Haftalık rapor';
    const lines = [];
    let subject;

    if (decision === 'approved') {
        subject = `${team} – ${week} raporunuz onaylandı`;
        lines.push(`Merhaba ${firstName},`, '', `"${title}" başlıklı ${week} raporunuz Denetleme Kurulu tarafından onaylandı.`);
        if (note) lines.push('', 'Denetim notu:', note);
    } else {
        subject = `${team} – ${week} raporunuz için revizyon gerekiyor`;
        lines.push(`Merhaba ${firstName},`, '', `"${title}" başlıklı ${week} raporunuzda düzeltilmesi gereken noktalar var:`, '', note, '', 'Düzeltilmiş halini yönetim paneline tekrar yükleyebilirsiniz.');
    }
    lines.push('', 'FinTeClub Denetleme Kurulu');

    const text = lines.join('\n');
    const html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a2233">' +
        lines.map(l => (l === '' ? '<br>' : `<div>${escapeHtml(l)}</div>`)).join('') + '</div>';
    return { subject, text, html };
}

async function sendWithResend({ to, subject, text, html }) {
    const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, text, html })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error('Mail gönderilemedi: ' + (data.message || ('HTTP ' + r.status)));
    return data.id || null;
}

function mailEnabled() {
    return process.env.MAIL_ENABLED === 'true' && !!process.env.RESEND_API_KEY && !!process.env.MAIL_FROM;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Diğer admin fonksiyonlarıyla aynı anahtar kontrolü
    const ADMIN_KEY = process.env.ADMIN_API_KEY || 'ftc-admin-9f3a7k2m8x';
    if (req.headers['x-admin-key'] !== ADMIN_KEY) {
        res.status(401).json({ error: 'Yetkisiz erişim.' });
        return;
    }

    const { docId, decision } = req.body || {};
    const note = String((req.body || {}).note || '').trim().slice(0, NOTE_MAX);

    if (typeof docId !== 'string' || !docId) {
        res.status(400).json({ error: 'docId gerekli.' });
        return;
    }
    if (decision !== 'approved' && decision !== 'revision') {
        res.status(400).json({ error: 'Geçersiz karar.' });
        return;
    }
    if (decision === 'revision' && !note) {
        res.status(400).json({ error: 'Revizyon isterken ekibe ne düzeltmesi gerektiğini yazın.' });
        return;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        res.status(500).json({ error: 'Sunucu yapılandırma hatası: GITHUB_TOKEN tanımlı değil.' });
        return;
    }

    try {
        const branch = await getDataBranch(token);

        // Alıcı yalnızca kulüp üyesi olabilir
        const { data: ekip } = await readJson(token, EKIP_PATH, branch);
        const memberEmails = new Set();
        Object.values(ekip || {}).forEach(list => (Array.isArray(list) ? list : []).forEach(m => {
            if (m && m.email) memberEmails.add(String(m.email).trim().toLowerCase());
        }));

        const testMode = !mailEnabled();
        let mail = null;
        let doc = null;

        // 1) Kararı kaydet (rapor hâlâ bekliyorsa). Aynı anda iki kez basılırsa
        //    ikincisi "zaten incelendi" hatası alır, böylece çift mail gitmez.
        await updateJson(token, DATA_PATH, branch, 'Denetim kararı: ' + docId, (data) => {
            const docs = (data && Array.isArray(data.documents)) ? data.documents : [];
            doc = docs.find(d => d.id === docId);
            if (!doc) throw Object.assign(new Error('Rapor bulunamadı.'), { status: 404 });
            if (doc.category !== 'haftalik') throw Object.assign(new Error('Bu doküman denetime gönderilmiş bir haftalık rapor değil.'), { status: 400 });
            if (doc.review && doc.review.status && doc.review.status !== 'pending') {
                throw Object.assign(new Error('Bu rapor zaten incelendi, ekibe ikinci mail gönderilmedi.'), { status: 409 });
            }
            const to = String(doc.uploaderEmail || '').trim().toLowerCase();
            if (!to || !memberEmails.has(to)) {
                throw Object.assign(new Error('Yükleyen kişinin mail adresi Ekip Yönetimi listesinde bulunamadı.'), { status: 400 });
            }
            mail = { to, ...buildMail(doc, decision, note) };
            doc.review = {
                status: decision,
                note,
                decidedAt: new Date().toISOString(),
                mail: { to, subject: mail.subject, text: mail.text, testMode, preview: isPreview() }
            };
        });

        // 2) Maili gönder. Gönderilemezse kararı geri al ki tekrar denenebilsin.
        if (!testMode) {
            try {
                const id = await sendWithResend(mail);
                await updateJson(token, DATA_PATH, branch, 'Denetim maili gönderildi: ' + docId, (data) => {
                    const d = data.documents.find(x => x.id === docId);
                    if (d && d.review && d.review.mail) {
                        d.review.mail.sentAt = new Date().toISOString();
                        d.review.mail.id = id;
                        doc = d;
                    }
                });
            } catch (sendErr) {
                await updateJson(token, DATA_PATH, branch, 'Denetim kararı geri alındı (mail hatası): ' + docId, (data) => {
                    const d = data.documents.find(x => x.id === docId);
                    if (d) d.review = { status: 'pending' };
                }).catch(() => {});
                throw sendErr;
            }
        }

        res.status(200).json({ success: true, testMode, review: doc.review });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
}
