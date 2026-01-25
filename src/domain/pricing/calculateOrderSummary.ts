import type {
  AppliedPromotion,
  CartLine,
  Coupon,
  Money,
  OrderSummary,
  PricingContext,
  PricingRules,
} from "./types";

const clampMoney = (value: number) => Math.max(0, Math.floor(value));

const sum = (items: CartLine[]) =>
  items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

const eligibleSubtotal = (items: CartLine[], coupon: Coupon) => {
  if (!coupon.eligibleCategories || coupon.eligibleCategories.length === 0) {
    return sum(items);
  }
  const set = new Set(coupon.eligibleCategories);
  return items.reduce((acc, item) => {
    if (item.category && set.has(item.category)) {
      return acc + item.unitPrice * item.quantity;
    }
    return acc;
  }, 0);
};

const calcCouponDiscount = (items: CartLine[], coupon: Coupon) => {
  const eligible = eligibleSubtotal(items, coupon);
  if (eligible <= 0) return 0;

  let discount = 0;
  if (coupon.type === "percent") {
    discount = (eligible * coupon.percent) / 100;
  } else {
    discount = coupon.amount;
  }

  discount = Math.min(discount, eligible);
  if (typeof coupon.maxDiscount === "number") {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  return clampMoney(discount);
};

const calcMaxUsablePoints = (payable: Money, rules: PricingRules) =>
  clampMoney(payable * rules.maxPointRate);

export const calculateOrderSummary = (
  items: CartLine[],
  context: PricingContext,
  rules: PricingRules,
): OrderSummary => {
  const warnings: string[] = [];
  const appliedPromotions: AppliedPromotion[] = [];

  const subtotal = clampMoney(sum(items));
  if (subtotal === 0) {
    return {
      subtotal: 0,
      discountTotal: 0,
      couponDiscount: 0,
      pointsDiscount: 0,
      shippingFee: 0,
      grandTotal: 0,
      appliedPromotions: [],
      warnings: [],
    };
  }

  let couponDiscount = 0;
  const coupon = context.coupon;
  if (coupon) {
    if (
      typeof coupon.minSubtotal === "number" &&
      subtotal < coupon.minSubtotal
    ) {
      warnings.push("쿠폰 최소 주문금액을 충족하지 못했어요.");
    } else {
      couponDiscount = calcCouponDiscount(items, coupon);
      if (couponDiscount > 0) {
        appliedPromotions.push({
          kind: "coupon",
          discount: couponDiscount,
          description:
            coupon.type === "percent"
              ? `${coupon.percent}% 할인 쿠폰`
              : `${coupon.amount.toLocaleString("ko-KR")}원 할인 쿠폰`,
        });
      }
    }
  }

  const discountedSubtotal = clampMoney(subtotal - couponDiscount);

  const shippingFee =
    discountedSubtotal >= rules.freeShippingThreshold
      ? 0
      : rules.baseShippingFee;
  if (shippingFee === 0) {
    appliedPromotions.push({
      kind: "freeShipping",
      discount: rules.baseShippingFee,
      description: "무료배송",
    });
  }

  const payableBeforePoints = clampMoney(discountedSubtotal + shippingFee);
  const requestedPoints = clampMoney(context.pointsToUse ?? 0);
  const maxByRate = calcMaxUsablePoints(payableBeforePoints, rules);

  const pointsDiscount = Math.min(
    requestedPoints,
    clampMoney(context.pointBalance),
    maxByRate,
    payableBeforePoints,
  );

  if (requestedPoints > 0 && pointsDiscount === 0) {
    warnings.push("사용 가능한 포인트가 없어요.");
  }
  if (requestedPoints > maxByRate) {
    warnings.push("포인트 사용 한도에 의해 일부만 적용됐어요.");
  }

  if (pointsDiscount > 0) {
    appliedPromotions.push({
      kind: "points",
      discount: pointsDiscount,
      description: "포인트 사용",
    });
  }

  const discountTotal = clampMoney(couponDiscount + pointsDiscount);
  const grandTotal = clampMoney(payableBeforePoints - pointsDiscount);

  return {
    subtotal,
    discountTotal,
    couponDiscount,
    pointsDiscount,
    shippingFee,
    grandTotal,
    appliedPromotions,
    warnings,
  };
};
