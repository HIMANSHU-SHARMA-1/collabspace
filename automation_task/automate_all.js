const { chromium } = require('playwright');
const fs = require('fs');

const existingAccounts = [
  {
    username: 'alex_chen22',
    email: 'alex.chen@university.edu',
    password: 'SecurePassword123!',
    bio: 'Full stack developer with 3 years of experience in React and Node.js.',
    skill: 'React',
    rating: '5',
    project: {
      name: 'EcoTrack AI',
      desc: 'An AI-powered application to track daily carbon footprint and suggest eco-friendly alternatives.',
      reqSkill: 'Node.js',
      size: '4',
      status: 'open'
    }
  },
  {
    username: 'sarah.j.design',
    email: 'sarah.jones@college.edu',
    password: 'DesignRocks456@',
    bio: 'UI/UX Designer focusing on accessible and modern web experiences.',
    skill: 'Figma',
    rating: '5',
    project: {
      name: 'Design System Hub',
      desc: 'A centralized repository for open-source design systems and accessible components.',
      reqSkill: 'Figma',
      size: '3',
      status: 'open'
    }
  },
  {
    username: 'mike_ml_engineer',
    email: 'michael.lee@state.edu',
    password: 'MachineLearning789#',
    bio: 'Data science student passionate about artificial intelligence and deep learning.',
    skill: 'Python',
    rating: '4',
    project: {
      name: 'NeuroPredict',
      desc: 'Machine learning models for predicting neurological anomalies from EEG data.',
      reqSkill: 'Python',
      size: '5',
      status: 'in-progress'
    }
  }
];

const newAccounts = [
  {
    username: 'rahul_sharma99',
    email: 'rahul.sharma99@institute.in',
    password: 'RahulPass2026!',
    bio: 'Backend developer with expertise in Django and PostgreSQL.',
    skill: 'Django',
    rating: '5',
    project: {
      name: 'Django Microservices',
      desc: 'A scalable microservice architecture template for rapid e-commerce deployment.',
      reqSkill: 'PostgreSQL',
      size: '4',
      status: 'open'
    }
  },
  {
    username: 'priya_patel_dev',
    email: 'priya.patel.dev@tech.in',
    password: 'PriyaReact321$',
    bio: 'Frontend specialist building interactive WebGL experiences.',
    skill: 'Three.js',
    rating: '4',
    project: {
      name: 'WebGL Odyssey',
      desc: 'An interactive 3D portfolio template for creative developers.',
      reqSkill: 'Three.js',
      size: '2',
      status: 'open'
    }
  }
];

const allAccounts = [...existingAccounts, ...newAccounts];

(async () => {
  const browser = await chromium.launch();
  
  // 1. Create the new accounts
  for (const acc of newAccounts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log(`Registering new account: ${acc.username}...`);
    
    await page.goto('https://collabspace-five.vercel.app', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Create account' }).click();
    
    await page.fill('#username', acc.username);
    await page.fill('#email', acc.email);
    await page.fill('#password', acc.password);
    await page.fill('#bio', acc.bio);
    
    await page.fill('#skillName', acc.skill);
    await page.fill('#skillRating', String(acc.rating));
    await page.getByRole('button', { name: 'Add Skill' }).click();
    
    await page.getByRole('button', { name: 'Submit Registration' }).click();
    await page.waitForTimeout(2000);
    
    await context.close();
  }

  // 2. Login to all accounts and create projects
  for (const acc of allAccounts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log(`Creating project for: ${acc.username}...`);
    
    await page.goto('https://collabspace-five.vercel.app', { waitUntil: 'networkidle' });
    
    // Login
    await page.fill('input[name="email"]', acc.email);
    await page.fill('input[name="password"]', acc.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL('**/dashboard');
    
    // Go to Create Project
    await page.click('a[href="/create-project"]');
    await page.waitForTimeout(1000);
    
    // Fill in Project details
    await page.fill('#projectname', acc.project.name);
    await page.fill('#description', acc.project.desc);
    
    // Skill
    await page.fill('#skillName', acc.project.reqSkill);
    await page.getByRole('button', { name: 'Add' }).click();
    
    await page.fill('#teamsize', String(acc.project.size));
    await page.selectOption('#status', acc.project.status);
    
    // Submit project
    await page.getByRole('button', { name: 'Create Project' }).click();
    await page.waitForTimeout(2000); // give it time to submit
    
    await context.close();
  }
  
  await browser.close();
  
  // Write everything to D:\memory\credentials.txt
  let credContent = 'Account Credentials & Projects for https://collabspace-five.vercel.app:\n\n';
  for (const acc of allAccounts) {
    credContent += `Username: ${acc.username}\n`;
    credContent += `Email: ${acc.email}\n`;
    credContent += `Password: ${acc.password}\n`;
    credContent += `Bio: ${acc.bio}\n`;
    credContent += `Skill: ${acc.skill} (Rating: ${acc.rating})\n`;
    credContent += `--- Project Details ---\n`;
    credContent += `Project Name: ${acc.project.name}\n`;
    credContent += `Description: ${acc.project.desc}\n`;
    credContent += `Required Skill: ${acc.project.reqSkill}\n`;
    credContent += `Team Size: ${acc.project.size}\n`;
    credContent += `Status: ${acc.project.status}\n`;
    credContent += `======================================\n\n`;
  }
  
  fs.writeFileSync('D:\\memory\\credentials.txt', credContent);
  console.log('Successfully saved updated credentials and projects to D:\\memory\\credentials.txt');
})();
