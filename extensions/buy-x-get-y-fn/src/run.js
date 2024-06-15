// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  const discounts = [];
  const linesWithTag = [];

  input.cart.lines.forEach((line) => {
    if (
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product.hasAnyTag === true
    ) {
      linesWithTag.push({
        id: line.merchandise.id,
        quantity: line.quantity,
      });
    }
  });

  // Calculate total quantity of all items with the "bxgy" tag
  const totalQuantity = linesWithTag.reduce(
    (acc, line) => acc + line.quantity,
    0
  );
  linesWithTag.sort((a, b) => a.quantity - b.quantity);

  if (totalQuantity >= 4) {
    // 4 or more different items
    // same item with qty 4
    // one item with some qty and another with some qty
    //orders items
    //  1 2 3 4
    //  1 1 1 2
    //  1 1 2 2
    let targets;
    if (linesWithTag.length >= 3) {
      targets = linesWithTag
        .reverse()
        .slice(-2)
        .map((line) => ({
          productVariant: {
            id: line.id,
            quantity: 1,
          },
        }));
    }
    // else if (linesWithTag.length >= 3) {}
    else if (linesWithTag.length >= 2) {
      targets = linesWithTag.slice(-1).map((line) => ({
        productVariant: {
          id: line.id,
          quantity: 2,
        },
      }));
    } else {
      // item 1 qty 4+
      targets = linesWithTag.slice(-1).map((line) => ({
        productVariant: {
          id: line.id,
          quantity: 2,
        },
      }));
    }

    discounts.push({
      targets: targets,
      value: {
        percentage: {
          value: 100,
        },
      },
      message: "Buy 2 get 2 free",
    });

    // item 2 qty 4+
    // item 3 qty 4+
  } else if (totalQuantity >= 2) {
    // possibilities
    // 2 different items
    // same item with qty 2
    // 1 1
    // 1 2
    // 1 2 3
    const targets = linesWithTag.slice(-1).map((lineItem) => ({
      productVariant: {
        id: lineItem.id,
        quantity: 1,
      },
    }));

    discounts.push({
      targets: targets,
      value: {
        percentage: {
          value: 100,
        },
      },
      message: "Buy 1 get 1 free",
    });
  }

  return discounts.length > 0
    ? {
        discountApplicationStrategy: DiscountApplicationStrategy.All,
        discounts: discounts,
      }
    : EMPTY_DISCOUNT;
}
