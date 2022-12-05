import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const lowercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const uppercase = 'abcdefghijklmnopqrstuvwxyz';
const special = '!@£$%^&*()';
const numbers = '0123456789';

const getChars = (inputs: string, amount = 10) =>
  new Array(amount)
    .fill('')
    .map((_) => inputs.charAt(Math.floor(Math.random() * inputs.length)))
    .join('');

// Faker was timing out trying to meet the regex, this is faster and reliable
const password = `${getChars(lowercase, 5)}${getChars(uppercase, 5)}${getChars(special, 4)}${getChars(numbers, 5)}`;

const seedCredentials = {
  email: faker.internet.email('e2e', Date.now().toString().slice(-8)),
  password: password,
};

test('it can register and login', async ({ page }) => {
  await page.goto('/register');
  await page.locator('input[placeholder="Enter your email"]').fill(seedCredentials.email);
  await page.locator('input[placeholder="Enter your password"]').fill(seedCredentials.password);
  await page.locator('input[placeholder="Enter your password again"]').fill(seedCredentials.password);

  await page.locator('button[type="submit"]').click();

  await expect(
    page.getByText('You have successfully registered. Please check your email to confirm your account.'),
  ).toBeVisible();

  // TODO Assert wont login because not verified email
  // Then hit e2e endpoint to verify

  await page.goto('/login');
  await page.locator('input[placeholder="Enter your email"]').fill(seedCredentials.email);
  await page.locator('input[placeholder="Enter your password"]').fill(seedCredentials.password);

  await page.locator('button[type="submit"]').click();

  await Promise.all([page.waitForNavigation(), page.locator('button[type="submit"]').click()]);
});
