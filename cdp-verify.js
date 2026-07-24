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
  console.log('Targets数量:', targets.length);
  targets.forEach((t, i) => {
    console.log(`  [${i}] type=${t.type} url=${(t.url||'').substring(0,80)}`);
  });

  let target = targets.find(t => t.type === 'page') || targets[0];
  if (!target || !target.webSocketDebuggerUrl) {
    console.error('没有可用的页面target');
    process.exit(1);
  }

  console.log('\n连接到:', target.webSocketDebuggerUrl);

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

  // 收集console错误
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  await new Promise((r, reject) => {
    ws.addEventListener('open', r);
    ws.addEventListener('error', reject);
  });

  try {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Log.enable');

    await send('Runtime.evaluate', {
      expression: `window.__caughtErrors = []; window.addEventListener('error', function(e){ window.__caughtErrors.push(e.message + ' @ ' + (e.filename||'') + ':' + (e.lineno||0)); });`
    });

    console.log('\n=== 导航到 http://127.0.0.1:3000/ ===');
    const nav = await send('Page.navigate', { url: 'http://127.0.0.1:3000/' });
    console.log('导航frameId:', nav.frameId);
    console.log('导航错误:', nav.errorText || '无');

    // 等待页面加载
    await new Promise(r => setTimeout(r, 4000));

    // 检查DOM
    const dom = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        bodyLen: document.body ? document.body.innerHTML.length : 0,
        visibleTextLen: document.body ? document.body.innerText.replace(/\\s/g,'').length : 0,
        bodyStart: document.body ? document.body.innerText.substring(0, 400) : 'NO BODY',
        h1Count: document.querySelectorAll('h1').length,
        imgCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('link').length,
        scriptCount: document.querySelectorAll('script').length
      })`,
      returnByValue: true
    });
    console.log('\n=== DOM检查 ===');
    console.log(dom.result.value);

    // 检查CSS加载
    const cssCheck = await send('Runtime.evaluate', {
      expression: `(function(){
        var sheets = document.styleSheets;
        var result = [];
        for (var i = 0; i < sheets.length; i++) {
          try {
            var rules = sheets[i].cssRules || sheets[i].rules;
            result.push({href: sheets[i].href, rules: rules ? rules.length : 0});
          } catch(e) {
            result.push({href: sheets[i].href, error: e.message});
          }
        }
        return JSON.stringify(result);
      })()`,
      returnByValue: true
    });
    console.log('\n=== CSS加载 ===');
    console.log(cssCheck.result.value);

    // 截图
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync('/workspace/screenshot-check.png', Buffer.from(shot.data, 'base64'));
    console.log('\n截图已保存: /workspace/screenshot-check.png (' + Math.round(shot.data.length * 3/4 / 1024) + 'KB)');

    // 窗口错误
    const errs = await send('Runtime.evaluate', {
      expression: `JSON.stringify(window.__caughtErrors || [])`,
      returnByValue: true
    });
    console.log('\n=== 窗口错误 ===');
    console.log(errs.result.value);

  } catch(e) {
    console.error('错误:', e);
  } finally {
    ws.close();
  }
}

run().catch(console.error);
