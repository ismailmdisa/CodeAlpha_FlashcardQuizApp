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
    '--remote-debugging-port=9224',
    '--window-size=1280,950',
    'http://localhost:8082',
  ]);

  let connected = false;
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const targets = await fetchJson('http://localhost:9224/json');
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

  // 1. Dashboard screenshot
  console.log('Step 1: Dashboard in enlarged phone frame...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/dashboard_in_frame.png');

  // 2. Open Decks Library (CardListModal)
  console.log('Step 2: Clicking Decks Library...');
  await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Decks Library"]');
    if (btn) btn.click();
  })()`);
  await sleep(1000);
  console.log('Step 2: Decks modal open inside phone...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/decks_modal_inside_frame.png');

  // Close Decks modal
  await evalJs(`(() => {
    const closeBtn = document.querySelector('[aria-label="Close modal"]') || Array.from(document.querySelectorAll('*')).find(el => el.textContent === 'Close');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(600);

  // 3. Open Badges Modal
  console.log('Step 3: Clicking Badges tab...');
  await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Badges"]');
    if (btn) btn.click();
  })()`);
  await sleep(1000);
  console.log('Step 3: Badges modal open inside phone...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/badges_modal_inside_frame.png');

  // Close Badges modal
  await evalJs(`(() => {
    const closeBtn = document.querySelector('[aria-label="Close badges"]') || document.querySelector('[aria-label="Close badges cabinet"]');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(600);

  // 4. Open Ranks Modal
  console.log('Step 4: Clicking Ranks tab...');
  await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Leaderboard Ranks"]');
    if (btn) btn.click();
  })()`);
  await sleep(1000);
  console.log('Step 4: Ranks modal open inside phone...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/ranks_modal_inside_frame.png');

  // Close Ranks modal
  await evalJs(`(() => {
    const closeBtn = document.querySelector('[aria-label="Close ranks"]') || document.querySelector('[aria-label="Close leaderboard"]');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(600);

  // 5. Open Add Card Modal
  console.log('Step 5: Clicking + Add button...');
  await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Add new flashcard"]');
    if (btn) btn.click();
  })()`);
  await sleep(1000);
  console.log('Step 5: Add card modal open inside phone...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/docs/screenshots/add_modal_inside_frame.png');

  console.log('All tests completed successfully!');
  browserProc.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
