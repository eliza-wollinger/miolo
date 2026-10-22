
const { test, expect } = require('@playwright/test');

test.describe('Miolo - Testes E2E', () => {

  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/miolo/i);

    await expect(
      page.getByRole('button', { name: 'Cupcakes' })
    ).toBeVisible();
  });

  test('deve navegar para o catálogo', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', {
      name: 'Cupcakes'
    }).click();

    await expect(
      page.locator('#catalog')
    ).toHaveClass(/active/);

    await expect(
      page.getByText('Escolha seu vício.')
    ).toBeVisible();
  });

  test('deve navegar para o carrinho', async ({ page }) => {
    await page.goto('/');

    await page.locator('nav [data-page="cart"]').click();

    await expect(
      page.locator('#cart')
    ).toHaveClass(/active/);

    await expect(
      page.locator('#total')
    ).toContainText('R$');
  });

});
