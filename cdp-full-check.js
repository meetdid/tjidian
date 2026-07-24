const http = require('http');
const fs = require('fs');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const pages = JSON.parse(data);
    console.log('当前浏览器标签页:');
    pages.forEach((p, i) => console.log(`  [${i}] ${p.title} | ${p.url}`));
    
    // 使用 about:blank 页面或 _port=3000 页面
    let page = pages.find(p => p.url.includes('_port=3000'));
    if (!page) page = pages.find(p => p.url === 'about:blank');
    if (!page) page = pages[0];
    
    console.log('\n使用页面:', page.url);
    
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let msgId = 1;
    
    function send(method, params = {}) {
      const id = msgId++;
      ws.send(JSON.stringify({ id, method, params }));
      return id;
    }
    
    ws.onopen = () => {
      console.log('CDP已连接，开始导航...');
      send('Page.enable');
      send('Runtime.enable');
      send('Network.enable');
      
      setTimeout(() => {
        // 强制导航到首页
        console.log('导航到: http://127.0.0.1:16000/?_port=3000');
        send('Page.navigate', { url: 'http://127.0.0.1:16000/?_port=3000' });
      }, 300);
    };
    
    let loadFired = false;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.method === 'Network.requestWillBeSent') {
        console.log('[REQ]', msg.params.request.url);
      }
      if (msg.method === 'Network.responseReceived') {
        console.log('[RES]', msg.params.response.status, msg.params.response.url, msg.params.response.mimeType);
      }
      if (msg.method === 'Network.loadingFailed') {
        console.log('[FAIL]', msg.params.errorText, msg.params.url || msg.params.requestId);
      }
      if (msg.method === 'Page.frameNavigated') {
        console.log('[NAV]', msg.params.frame.url);
      }
      if (msg.method === 'Page.loadEventFired' && !loadFired) {
        loadFired = true;
        console.log('[LOAD] 页面加载完成');
        
        setTimeout(() => {
          // 截图
          send('Page.captureScreenshot', { format: 'png' });
          
          // 检查DOM
          send('Runtime.evaluate', {
            expression: `JSON.stringify({
              title: document.title,
              url: location.href,
              readyState: document.readyState,
              bodyChildren: document.body ? document.body.children.length : 0,
              bodyHTML: document.body ? document.body.innerHTML.substring(0, 2000) : 'NONE',
              bodyText: document.body ? document.body.innerText.substring(0, 500) : 'NONE',
              cssRules: Array.from(document.styleSheets).map(s => { try { return s.cssRules.length + ' rules from ' + s.href; } catch(e) { return 'CORS blocked'; } }),
              computedBodyBg: getComputedStyle(document.body).backgroundColor,
              computedBodyColor: getComputedStyle(document.body).color,
              computedBodyDisplay: getComputedStyle(document.body).display,
              viewport: window.innerWidth + 'x' + window.innerHeight,
              scrollHeight: document.body.scrollHeight,
              errors: window.__errors || []
            })`,
            returnByValue: true
          });
        }, 2000);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('[EXCEPTION]', JSON.stringify(msg.params.exceptionDetails));
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || a.description || '').join(' ');
        if (args.includes('error') || args.includes('Error') || args.includes('fail')) {
          console.log('[CONSOLE-ERR]', args);
        }
      }
      
      // 处理截图返回
      if (msg.id && msg.result && msg.result.data) {
        const screenshot = Buffer.from(msg.result.data, 'base64');
        fs.writeFileSync('/workspace/screenshot.png', screenshot);
        console.log('[SCREENSHOT] 已保存到 /workspace/screenshot.png, 大小:', screenshot.length, 'bytes');
      }
      
      // 处理DOM检查返回
      if (msg.id && msg.result && msg.result.result && msg.result.result.value) {
        const val = msg.result.result.value;
        if (val.startsWith('{')) {
          const info = JSON.parse(val);
          console.log('\n=== 页面渲染状态 ===');
          Object.entries(info).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              console.log(`  ${k}:`);
              v.forEach(item => console.log(`    - ${item}`));
            } else {
              console.log(`  ${k}: ${v}`);
            }
          });
        }
      }
    };
    
    ws.onerror = (err) => console.error('WebSocket错误:', err.message || err);
    
    setTimeout(() => {
      console.log('\n完成，退出。');
      process.exit(0);
    }, 8000);
  });
}).on('error', err => console.error('HTTP错误:', err.message));
