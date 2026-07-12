const { chromium } = require('playwright');
const fs = require('fs');

const accounts = [
  {
    username: 'alex_chen22',
    email: 'alex.chen@university.edu',
    password: 'SecurePassword123!',
    bio: 'Full stack developer with 3 years of experience in React and Node.js.',
    skill: 'React',
    rating: '5'
  },
  {
    username: 'sarah.j.design',
    email: 'sarah.jones@college.edu',
    password: 'DesignRocks456@',
    bio: 'UI/UX Designer focusing on accessible and modern web experiences.',
    skill: 'Figma',
    rating: '5'
  },
  {
    username: 'mike_ml_engineer',
    email: 'michael.lee@state.edu',
    password: 'MachineLearning789#',
    bio: 'Data science student passionate about artificial intelligence and deep learning.',
    skill: 'Python',
    rating: '4'
  }
];

(async () => {
  const browser = await chromium.launch();
  
  for (const acc of accounts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log(`Registering ${acc.username}...`);
    
    await page.goto('https://collabspace-five.vercel.app', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Create account' }).click();
    
    await page.fill('#username', acc.username);
    await page.fill('#email', acc.email);
    await page.fill('#password', acc.password);
    await page.fill('#bio', acc.bio);
    
    await page.fill('#skillName', acc.skill);
    await page.fill('#skillRating', acc.rating);
    await page.getByRole('button', { name: 'Add Skill' }).click();
    
    await page.getByRole('button', { name: 'Submit Registration' }).click();
    await page.waitForTimeout(2000);
    
    await context.close();
  }
  
  await browser.close();
  
  // Write to D:\memory\credentials.txt
  let credContent = 'Account Credentials for https://collabspace-five.vercel.app:\n\n';
  for (const acc of accounts) {
    credContent += `Username: ${acc.username}\n`;
    credContent += `Email: ${acc.email}\n`;
    credContent += `Password: ${acc.password}\n`;
    credContent += `Bio: ${acc.bio}\n`;
    credContent += `Skill: ${acc.skill} (Rating: ${acc.rating})\n`;
    credContent += `--------------------------------------\n`;
  }
  
  fs.writeFileSync('D:\\memory\\credentials.txt', credContent);
  console.log('Successfully saved credentials to D:\\memory\\credentials.txt');
})();
