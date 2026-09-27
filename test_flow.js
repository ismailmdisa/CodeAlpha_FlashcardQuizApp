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
    '--remote-debugging-port=9222',
    '--window-size=430,932',
    'http://localhost:8082',
  ]);

  let connected = false;
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const targets = await fetchJson('http://localhost:9222/json');
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
  console.log('WS Open. Enabling Page and Runtime...');

  await send('Page.enable');
  await send('Runtime.enable');

  // Wait 3s for React Native Web to render completely
  await sleep(3000);

  async function takeScreenshot(filePath) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  async function evalJs(expr) {
    return await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  }

  // Step 1: Confirm Dashboard loaded
  console.log('Step 1: Dashboard loaded. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step1_dashboard.png');

  // Step 2: Click "START QUIZ NOW! 🚀"
  console.log('Step 2: Clicking START QUIZ NOW! button...');
  const startClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Start Quiz Now"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Start Quiz Click Result:', startClick.result.value);

  await sleep(1500);
  console.log('Step 3: In Quiz Arena. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step2_quiz_arena.png');

  // Step 4: Click Peek button to reveal answer
  console.log('Step 4: Clicking card flip button...');
  const flipClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Tap to peek answer"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Flip Click Result:', flipClick.result.value);

  await sleep(1200);
  console.log('Step 5: Card flipped. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step3_card_flipped.png');

  // Step 6: Click Back button to return to Dashboard
  console.log('Step 6: Clicking Back to Dashboard...');
  const backClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Back to Dashboard"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Back Click Result:', backClick.result.value);

  await sleep(1000);
  console.log('Step 7: Back on Dashboard. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step4_back_dashboard.png');

  // Step 8: Click "Decks" library pill
  console.log('Step 8: Clicking Decks Library pill...');
  const decksClick = await evalJs(`(() => {
    const btn = document.querySelector('[aria-label="Decks Library"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Decks Click Result:', decksClick.result.value);

  await sleep(1000);
  console.log('Step 9: Decks Modal open. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step5_decks_modal.png');

  // Step 10: Close Decks Modal and open Add Card Modal
  console.log('Step 10: Closing Decks Modal...');
  const closeClick = await evalJs(`(() => {
    const closeBtn = document.querySelector('[aria-label="Close modal"]');
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Close Modal Click Result:', closeClick.result.value);

  await sleep(1000);

  console.log('Step 11: Clicking Add new flashcard button...');
  const addClick = await evalJs(`(() => {
    const addBtn = document.querySelector('[aria-label="Add new flashcard"]');
    if (addBtn) {
      addBtn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Add Card Click Result:', addClick.result.value);

  await sleep(1000);
  console.log('Step 12: Add Card Modal open. Capturing screenshot...');
  await takeScreenshot('/home/md-ismail-hossen/Desktop/CodeAlpha_FlashcardQuizApp/step6_add_modal.png');

  console.log('All tests completed successfully!');
  browserProc.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
