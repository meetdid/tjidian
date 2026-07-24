const http = require('http');

function getTargets() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function inspectTab(target, idx) {
  console.log(`\n========== 标签[${idx}] ==========`);
  console.log('URL:', target.url);
  console.log('Title:', target.title);
  
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 0;
  const pending = {};

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++msgId;
      pending[id] = { resolve, reject };
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending[msg.id]) {
      if (msg.error) pending[msg.id].reject(msg.error);
      else pending[msg.id].resolve(msg.result);
      delete pending[msg.id];
    }
  });

  try {
    await new Promise((r, reject) => {
      ws.addEventListener('open', r);
      ws.addEventListener('error', reject);
    });

    await send('Page.enable');
    await send('Runtime.enable');

    // 检查DOM状态
    const dom = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        bodyExists: !!document.body,
        bodyChildren: document.body ? document.body.children.length : 0,
        bodyTextLen: document.body ? document.body.innerText.replace(/\\s/g,'').length : 0,
        bodyFirst200: document.body ? document.body.innerText.substring(0, 200) : 'NO BODY',
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        scrollHeight: document.documentElement ? document.documentElement.scrollHeight : 0,
        bgColor: document.body ? getComputedStyle(document.body).backgroundColor : null,
        bodyDisplay: document.body ? getComputedStyle(document.body).display : null,
        bodyVisibility: document.body ? getComputedStyle(document.body).visibility : null,
        htmlDisplay: document.documentElement ? getComputedStyle(document.documentElement).display : null
      })`,
      returnByValue: true
    });
    console.log('DOM状态:', JSON.stringify(dom.result.value, null, 2));

    // 检查是否有错误
    const err = await send('Runtime.evaluate', {
      expression: `JSON.stringify(window.__caughtErrors || [])`,
      returnByValue: true
    });
    console.log('JS错误:', err.result.value);

    // 截图
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    const fname = `/workspace/screenshot-tab${idx}.png`;
    fs.writeFileSync(fname, Buffer.from(shot.data, 'base64'));
    console.log('截图:', fname, '(', Math.round(shot.data.length * 3/4 / 1024), 'KB)');

  } catch(e) {
    console.error('错误:', e.message);
  } finally {
    ws.close();
  }
}

async function main() {
  const targets = await getTargets();
  const pages = targets.filter(t => t.type === 'page' && t.webSocketDebuggerUrl);
  console.log('共', pages.length, '个页面标签');
  for (let i = 0; i < pages.length; i++) {
    await inspectTab(pages[i], i);
  }
}

main().catch(console.error);
