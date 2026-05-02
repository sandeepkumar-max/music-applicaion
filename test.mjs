import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Nav error:', e.message));
  
  // Click on Library tab
  await page.evaluate(() => {
    const navButtons = document.querySelectorAll('.bottom-nav-btn');
    if (navButtons[2]) navButtons[2].click(); // Assuming 3rd is Library
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click on Search tab
  await page.evaluate(() => {
    const navButtons = document.querySelectorAll('.bottom-nav-btn');
    if (navButtons[1]) navButtons[1].click(); // Assuming 2nd is Search
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();
