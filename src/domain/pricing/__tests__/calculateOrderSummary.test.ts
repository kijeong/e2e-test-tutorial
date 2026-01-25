import { calculateOrderSummary } from "../calculateOrderSummary";
import { defaultPricingRules, percentCoupon } from "../rules";
import type { CartLine, PricingContext } from "../types";

const baseContext = (partial?: Partial<PricingContext>): PricingContext => ({
  now: new Date("2026-01-01T00:00:00.000Z"),
  pointBalance: 0,
  pointsToUse: 0,
  ...partial,
});

describe("calculateOrderSummary", () => {
  test("단일/복수 상품 합계를 계산한다", () => {
    const items: CartLine[] = [
      { productId: "p1", unitPrice: 10_000, quantity: 2 },
      { productId: "p2", unitPrice: 5_000, quantity: 1 },
    ];
    const result = calculateOrderSummary(
      items,
      baseContext(),
      defaultPricingRules,
    );
    expect(result.subtotal).toBe(25_000);
    expect(result.grandTotal).toBe(
      25_000 + defaultPricingRules.baseShippingFee,
    );
  });

  test("정률 쿠폰은 최대 할인 제한을 적용한다", () => {
    const items: CartLine[] = [
      { productId: "p1", unitPrice: 100_000, quantity: 1 },
    ];
    const context = baseContext({
      coupon: percentCoupon({ percent: 10, maxDiscount: 3_000 }),
    });
    const result = calculateOrderSummary(items, context, defaultPricingRules);
    expect(result.couponDiscount).toBe(3_000);
    expect(result.subtotal).toBe(100_000);
    expect(result.grandTotal).toBe(97_000);
  });

  test("무료배송 임계값은 '할인 적용 후' 기준으로 판단한다 (49,999/50,000 경계)", () => {
    const rules = {
      ...defaultPricingRules,
      freeShippingThreshold: 50_000,
      baseShippingFee: 3_000,
    };

    const items: CartLine[] = [
      { productId: "p1", unitPrice: 50_000, quantity: 1 },
    ];
    const coupon = percentCoupon({ percent: 1 }); // 500원 할인 -> 49,500
    const result1 = calculateOrderSummary(
      items,
      baseContext({ coupon }),
      rules,
    );
    expect(result1.shippingFee).toBe(3_000);

    const items2: CartLine[] = [
      { productId: "p1", unitPrice: 50_000, quantity: 1 },
    ];
    const result2 = calculateOrderSummary(items2, baseContext(), rules);
    expect(result2.shippingFee).toBe(0);
  });

  test("포인트 사용은 결제금액의 최대 비율(기본 20%) 및 보유 포인트를 초과할 수 없다", () => {
    const rules = {
      ...defaultPricingRules,
      maxPointRate: 0.2,
      baseShippingFee: 0,
    };
    const items: CartLine[] = [
      { productId: "p1", unitPrice: 100_000, quantity: 1 },
    ];
    const result = calculateOrderSummary(
      items,
      baseContext({ pointBalance: 100_000, pointsToUse: 50_000 }),
      rules,
    );
    expect(result.pointsDiscount).toBe(20_000);
    expect(result.grandTotal).toBe(80_000);
  });

  test("카테고리 한정 쿠폰은 해당 카테고리 상품에만 할인 적용한다", () => {
    const items: CartLine[] = [
      { productId: "p1", unitPrice: 40_000, quantity: 1, category: "Food" },
      { productId: "p2", unitPrice: 60_000, quantity: 1, category: "Home" },
    ];
    const context = baseContext({
      coupon: percentCoupon({ percent: 10, eligibleCategories: ["Food"] }),
    });
    const rules = { ...defaultPricingRules, baseShippingFee: 0 };
    const result = calculateOrderSummary(items, context, rules);
    expect(result.couponDiscount).toBe(4_000);
    expect(result.grandTotal).toBe(96_000);
  });
});
