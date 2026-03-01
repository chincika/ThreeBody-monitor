/**
 * 三体监控站 — CORS 代理 Worker
 * 部署到 Cloudflare Workers，解决中国用户无法访问 corsproxy.io 的问题
 *
 * 部署步骤：
 * 1. 登录 https://dash.cloudflare.com
 * 2. 进入 Workers & Pages → Create Worker
 * 3. 将本文件全部内容粘贴到编辑器，点击 Deploy
 * 4. 复制 Worker 的访问地址（格式：https://xxxx.workers.dev）
 * 5. 打开 js/script.js，找到 CUSTOM_PROXY_URL 那一行，填入你的 Worker 地址
 */

export default {
  async fetch(request) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response('Missing ?url= parameter', { status: 400 });
    }

    // 只允许代理三体wiki的API，防止滥用
    const allowed = ['santi.huijiwiki.com'];
    const targetHost = new URL(target).hostname;
    if (!allowed.includes(targetHost)) {
      return new Response('Target not allowed', { status: 403 });
    }

    try {
      // upstream 超时 25 秒（Cloudflare Worker 最大 30 秒）
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);

      const upstream = await fetch(target, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ThreeBodyMonitor/1.0)',
          'Accept': 'application/json',
        },
      });

      clearTimeout(timer);
      const contentType = upstream.headers.get('content-type') || '';
      const body = await upstream.text();

      // 如果返回 HTML（验证页/拦截页），说明 wiki 对境外 IP 做了限制
      if (!contentType.includes('json') && body.trimStart().startsWith('<')) {
        return new Response(
          JSON.stringify({ error: 'wiki_blocked' }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      return new Response(body, {
        status: upstream.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (e) {
      const isTimeout = e.name === 'AbortError';
      return new Response(
        JSON.stringify({ error: isTimeout ? 'upstream timeout' : e.message }),
        {
          status: isTimeout ? 504 : 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
