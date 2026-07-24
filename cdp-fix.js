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

async function fixTab(target, idx) {
  console.log(`\n[标签${idx}] 修复前 URL: ${target.url}`);
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

    // 导航到正确URL
    const nav = await send('Page.navigate', { url: 'http://localhost:3000/' });
    console.log(`[标签${idx}] 导航结果:`, nav.errorText || '成功');
    await new Promise(r => setTimeout(r, 3000));

    const dom = await send('Runtime.evaluate', {
      expression: `JSON.stringify({url: location.href, title: document.title, bodyLen: document.body ? document.body.innerHTML.length : 0, readyState: document.readyState})`,
      returnByValue: true
    });
    console.log(`[标签${idx}] 修复后:`, dom.result.value);
  } catch(e) {
    console.error(`[标签${idx}] 错误:`, e.message);
  } finally {
    ws.close();
  }
}

async function main() {
  const targets = await getTargets();
  const pages = targets.filter(t => t.type === 'page' && t.webSocketDebuggerUrl);
  console.log('找到', pages.length, '个标签页');
  for (let i = 0; i < pages.length; i++) {
    await fixTab(pages[i], i);
  }
}

main().catch(console.error);
