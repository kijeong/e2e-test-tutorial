import { expect, test } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000";

async function deleteAllByQuery(
  request: APIRequestContext,
  path: string,
): Promise<void> {
  const response = await request.get(`${API_BASE_URL}${path}`);
  const items = (await response.json()) as Array<{ id: string }>;
  const basePath = path.split("?")[0];
  await Promise.all(
    items.map((item) =>
      request.delete(`${API_BASE_URL}${basePath}/${item.id}`),
    ),
  );
}

async function resetCartForUser(request: APIRequestContext, userId: string) {
  await deleteAllByQuery(request, `/cartItems?userId=${userId}`);
}

async function resetOrdersForUser(request: APIRequestContext, userId: string) {
  await deleteAllByQuery(request, `/orders?userId=${userId}`);
}

test("로그인 → 상품 담기 → 구매", async ({ page, request }) => {
  await resetCartForUser(request, "1");
  await resetOrdersForUser(request, "1");

  await page.goto("/login");
  await page.getByTestId("login-email").fill("demo@breeze.com");
  await page.getByTestId("login-password").fill("demo1234");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/products/);

  await page.getByTestId("add-to-cart-1").click();
  await expect(page.getByText("장바구니에 담았어요.")).toBeVisible();

  await page.getByTestId("nav-cart").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByTestId("cart-item")).toHaveCount(1);

  await page.getByTestId("checkout-button").click();
  await expect(page.getByTestId("checkout-button")).toBeDisabled();
  await expect(page.getByText("결제 진행 중...")).toBeVisible();

  await expect(
    page.getByText("주문이 완료되었어요. 감사합니다!"),
  ).toBeVisible();

  // cleanup: keep db.json stable for repeated runs
  await resetCartForUser(request, "1");
  await resetOrdersForUser(request, "1");
});
