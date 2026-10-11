const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Starting Chromium...');
  const browserProc = spawn('chromium', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--window-size=430,932',
    'http://localhost:8082',
  ]);

  let connected = false;
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const targets = await fetchJson('http://localhost:9223/json');
      const page = targets.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error('Could not connect to Chromium CDP');
    browserProc.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });

  await new Promise((res) => ws.on('open', res));
  await send('Page.enable');
  await send('Runtime.enable');

  await sleep(3000);

  async function takeScreenshot(filePath) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  async function evalJs(expr) {
    return await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  }

  // 1. Click Badges
  console.log('Clicking Badges tab...');
  const badgesClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Badges"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Badges Click:', badgesClick.result.value);

  await sleep(1200);
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/badges_modal_preview.png');

  // 2. Click a badge inside Badges modal to inspect details
  console.log('Clicking a badge to inspect details...');
  await evalJs(`(() => {
    const cards = Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('Potato No More'));
    if (cards.length > 0) {
      cards[cards.length - 1].click();
      return true;
    }
    return false;
  })()`);
  await sleep(600);
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/badges_detail_preview.png');

  // 3. Close Badges Modal
  console.log('Closing Badges modal...');
  await evalJs(`(() => {
    const closeBtn = document.querySelector('[aria-label="Close badges"]') || document.querySelector('[aria-label="Close badges cabinet"]');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(800);

  // 4. Click Ranks tab
  console.log('Clicking Ranks tab...');
  const ranksClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Leaderboard Ranks"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Ranks Click:', ranksClick.result.value);

  await sleep(1200);
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/ranks_modal_preview.png');

  // 5. Click BRAIN TIERS sub-tab inside Ranks modal
  console.log('Clicking BRAIN TIERS sub-tab...');
  await evalJs(`(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const tiersBtn = all.find(el => el.textContent === 'BRAIN TIERS');
    if (tiersBtn) {
      tiersBtn.click();
      return true;
    }
    return false;
  })()`);
  await sleep(800);
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/brain_tiers_preview.png');

  console.log('All Badges and Ranks tests finished successfully!');
  browserProc.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
