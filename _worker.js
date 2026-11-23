// ============================================================
//  _worker.js — Cloudflare Workers entry point (router)
//  API isteklerini ilgili handler'a yönlendirir,
//  geri kalan her şeyi statik asset olarak sunar.
// ============================================================

import { onRequest as adminLogin } from './functions/api/admin-login.js';
import { onRequest as adminRead } from './functions/api/admin-read.js';
import { onRequest as adminWrite } from './functions/api/admin-write.js';
import { onRequest as adminUpload } from './functions/api/admin-upload.js';
import { onRequest as submitMembership } from './functions/api/submit-membership.js';
import { onRequest as submitQuestion } from './functions/api/submit-question.js';

const routes = {
    '/api/admin-login': adminLogin,
    '/api/admin-read': adminRead,
    '/api/admin-write': adminWrite,
    '/api/admin-upload': adminUpload,
    '/api/submit-membership': submitMembership,
    '/api/submit-question': submitQuestion,
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // API route mu?
        const handler = routes[path];
        if (handler) {
            try {
                return await handler({ request, env, ctx });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Değilse statik dosya sun
        return env.ASSETS.fetch(request);
    }
};
