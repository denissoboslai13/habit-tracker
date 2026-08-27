import { test, expect } from '@playwright/test';

test('user can register, log in, add rename and delete a habit, add a log, check cascading, and log out', async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  // register
  await page.goto('/register');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Enter your password').fill('somepassword123');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/.*login/);

  // login
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('somepassword123');
  await page.getByRole('button', { name: 'Submit' }).click();

  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/login')),
    page.getByRole('button', { name: 'Submit' }).click(),
  ]);

  console.log('Login status:', response.status());
  const cookies = await page.context().cookies();
  console.log('Cookies after login:', cookies);

  await expect(page).toHaveURL(/.*habits/);

  // dashboard shows empty, and create a new habit
  await expect(page.getByRole('paragraph').getByText('Nothing to see here, for now...')).toBeVisible();
  await page.getByRole('button', { name: 'Create a new habit' }).click();
  await page.getByPlaceholder('Name').fill('Read 20 minutes');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('paragraph').getByText('Read 20 minutes')).toBeVisible();

  await page.getByRole('button', { name: 'showDetail' }).click();

  // detailed logs view
  await expect(page).toHaveURL(/.*habits\/[a-zA-Z0-9-]+/);

  // add a log
  await page.getByRole('button', { name: 'Completed a day?' }).click();
  await page.getByLabel('Completed?').check();
  await page.getByRole('button', { name: 'Submit' }).click();

  // check if todays streak updated
  await expect(page.getByRole('paragraph').getByText('Longest streak: 1')).toBeVisible();

  await page.getByRole('button', { name: 'Home' }).click();

  await expect(page).toHaveURL(/.*habits/);

  // edit habit name
  await page.getByRole('button', { name: 'editName' }).click();
  await page.getByPlaceholder('Name').fill('test wow');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // check if old name disappeared, new name shows
  await expect(page.getByRole('paragraph').getByText('Read 20 minutes')).toBeHidden();
  await expect(page.getByRole('paragraph').getByText('test wow')).toBeVisible();

  // delete a habit
  await page.getByRole('button', { name: 'deleteHabit' }).click();
  await expect(page.getByRole('paragraph').getByText('test wow')).toBeHidden();
  
  // check cascading, shows no logs
  await page.goto('/habits/1');
  await expect(page.getByRole('paragraph').getByText('No logs to see here, for now...')).toBeVisible();

  // logout
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/.*/);
});

test('unauthenticated user is redirected away from habits', async ({ page }) => {
  await page.goto('/habits');
  await expect(page).toHaveURL(/.*login/);
});

test('cant log in with wrong creds', async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Enter your password').fill('somepassword123');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/.*login/);
});