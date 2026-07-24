const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const pages = JSON.parse(data);
    // 找到 _port=3000 页面
    const page = pages.find(p => p.url.includes('_port=3000'));
    if (!page) { console.log('没找到页面'); process.exit(1); }
    
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let msgId = 1;
    
    function send(method, params = {}) {
      const id = msgId++;
      ws.send(JSON.stringify({ id, method, params }));
      return id;
    }
    
    ws.onopen = () => {
      // 重新加载页面并带到最前
      send('Page.enable');
      send('Runtime.enable');
      
      // 先激活这个标签页
      http.get(`http://127.0.0.1:9222/json/activate/${page.id}`, () => {
        console.log('已激活标签页');
      });
      
      // 重新加载
      setTimeout(() => {
        console.log('重新加载页面...');
        send('Page.reload', { ignoreCache: true });
      }, 500);
    };
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired') {
        console.log('页面加载完成');
        setTimeout(() => {
          // 截图并保存
          send('Page.captureScreenshot', { format: 'png' });
        }, 1500);
      }
      if (msg.id && msg.result && msg.result.data) {
        const screenshot = Buffer.from(msg.result.data, 'base64');
        require('fs').writeFileSync('/workspace/screenshot.png', screenshot);
        console.log('截图已保存:', screenshot.length, 'bytes');
      }
    };
    
    setTimeout(() => process.exit(0), 5000);
  });
}).on('error', err => console.error('Error:', err.message));
