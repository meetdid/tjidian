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

async function run() {
  const targets = await getTargets();
  // 找到 port=8080 的标签页（用户卡在的那个）
  let target = targets.find(t => t.type === 'page' && t.url.includes('_port=8080'));
  if (!target) target = targets.find(t => t.type === 'page' && t.url.includes('_port=3000'));
  if (!target) target = targets.find(t => t.type === 'page');
  
  console.log('使用target URL:', target.url);

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

  await new Promise((r, reject) => {
    ws.addEventListener('open', r);
    ws.addEventListener('error', reject);
  });

  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    console.log('\n=== 导航到代理URL http://127.0.0.1:16000/?_port=3000 ===');
    const nav = await send('Page.navigate', { url: 'http://127.0.0.1:16000/?_port=3000' });
    console.log('导航错误:', nav.errorText || '无');

    await new Promise(r => setTimeout(r, 4000));

    const dom = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        bodyLen: document.body ? document.body.innerHTML.length : 0,
        visibleTextLen: document.body ? document.body.innerText.replace(/\\s/g,'').length : 0
      })`,
      returnByValue: true
    });
    console.log('DOM:', dom.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync('/workspace/screenshot-proxy.png', Buffer.from(shot.data, 'base64'));
    console.log('代理截图保存: /workspace/screenshot-proxy.png');

  } catch(e) {
    console.error('错误:', e);
  } finally {
    ws.close();
  }
}

run().catch(console.error);
