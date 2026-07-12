const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://collabspace-five.vercel.app', { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'alex.chen@university.edu');
  await page.fill('input[name="password"]', 'SecurePassword123!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  await page.waitForURL('**/dashboard');
  
  // Go to create project
  await page.click('a[href="/create-project"]');
  await page.waitForTimeout(2000);
  
  const html = await page.content();
  fs.writeFileSync('create_project.html', html);
  
  await browser.close();
  console.log('Saved create_project.html');
})();
