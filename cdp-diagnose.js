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

async function diagnose(target, idx) {
  console.log(`\n========== 标签[${idx}] 诊断 ==========`);
  console.log('URL:', target.url);

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

  const consoleMessages = [];
  const pageErrors = [];
  const requestFailed = [];
  const responseReceived = [];

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending[msg.id]) {
      if (msg.error) pending[msg.id].reject(msg.error);
      else pending[msg.id].resolve(msg.result);
      delete pending[msg.id];
    } else if (msg.method) {
      // 收集事件
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || a.description || '').join(' ');
        consoleMessages.push(`[${msg.params.type}] ${args}`);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        pageErrors.push(JSON.stringify(msg.params.exceptionDetails));
      } else if (msg.method === 'Network.loadingFailed') {
        requestFailed.push(`${msg.params.requestId} ${msg.params.errorText} ${msg.params.type||''}`);
      } else if (msg.method === 'Network.responseReceived') {
        responseReceived.push(`${msg.params.response.status} ${msg.params.response.url}`);
      }
    }
  });

  try {
    await new Promise((r, reject) => {
      ws.addEventListener('open', r);
      ws.addEventListener('error', reject);
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Log.enable');

    // 强制刷新页面，重新捕获所有事件
    console.log('\n--- 刷新页面并捕获所有事件 ---');
    await send('Page.navigate', { url: 'http://localhost:3000/' });

    // 等待页面加载完成
    await new Promise(r => setTimeout(r, 5000));

    console.log('\n--- Network响应列表 ---');
    responseReceived.forEach(r => console.log('  ', r));
    console.log('总请求数:', responseReceived.length);

    console.log('\n--- 失败请求 ---');
    if (requestFailed.length === 0) console.log('  无');
    else requestFailed.forEach(r => console.log('  ', r));

    console.log('\n--- Console消息 ---');
    if (consoleMessages.length === 0) console.log('  无');
    else consoleMessages.forEach(m => console.log('  ', m));

    console.log('\n--- 页面JS异常 ---');
    if (pageErrors.length === 0) console.log('  无');
    else pageErrors.forEach(e => console.log('  ', e));

    // 检查DOM
    const dom = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        url: location.href,
        title: document.title,
        readyState: document.readyState,
        bodyExists: !!document.body,
        bodyChildren: document.body ? document.body.children.length : 0,
        bodyTextLen: document.body ? document.body.innerText.replace(/\\s/g,'').length : 0,
        scrollHeight: document.documentElement.scrollHeight,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        documentHeight: document.documentElement.clientHeight,
        bodyDisplay: document.body ? getComputedStyle(document.body).display : null,
        bodyVisibility: document.body ? getComputedStyle(document.body).visibility : null,
        bodyOpacity: document.body ? getComputedStyle(document.body).opacity : null,
        bodyBg: document.body ? getComputedStyle(document.body).backgroundColor : null,
        htmlBg: getComputedStyle(document.documentElement).backgroundColor,
        bodyOverflow: document.body ? getComputedStyle(document.body).overflow : null,
        htmlOverflow: getComputedStyle(document.documentElement).overflow,
        hasStyle: document.querySelectorAll('link[rel=stylesheet]').length,
        cssRules: (function(){ try { return document.styleSheets[0] ? document.styleSheets[0].cssRules.length : -1; } catch(e){ return 'CORS:'+e.message; } })(),
        mainScript: document.querySelectorAll('script[src]').length
      })`,
      returnByValue: true
    });
    console.log('\n--- DOM详情 ---');
    console.log(dom.result.value);

    // 截图
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = require('fs');
    fs.writeFileSync(`/workspace/diag-tab${idx}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`\n截图: /workspace/diag-tab${idx}.png`);

  } catch(e) {
    console.error('错误:', e.message);
  } finally {
    ws.close();
  }
}

async function main() {
  const targets = await getTargets();
  const pages = targets.filter(t => t.type === 'page' && t.webSocketDebuggerUrl);
  console.log('共', pages.length, '个标签页');
  // 只诊断第一个标签页
  await diagnose(pages[0], 0);
}

main().catch(console.error);
