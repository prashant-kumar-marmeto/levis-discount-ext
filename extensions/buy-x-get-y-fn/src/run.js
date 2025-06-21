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
        cost:
          line.cost.compareAtAmountPerQuantity?.amount ||
          line.cost.amountPerQuantity.amount,
      });
    }
  });

  // Calculate total quantity of all items with the "bxgy" tag
  const totalQuantity = linesWithTag.reduce(
    (acc, line) => acc + line.quantity,
    0
  );

  // linesWithTag.sort((a, b) => a.quantity - b.quantity);
  linesWithTag.sort((a, b) => b.cost - a.cost);

  if (totalQuantity >= 4) {
    // 4 or more different items
    // same item with qty 4
    // one item with some qty and another with some qty
    //orders items
    //  1 2 3 4
    //  1 1 1 2
    //  1 1 2 2

    let targets;

    if (linesWithTag.length >= 2) {
      const lastItem = linesWithTag[linesWithTag.length - 1];
      if (lastItem.quantity >= 2) {
        targets = [
          {
            productVariant: {
              id: lastItem.id,
              quantity: 2,
            },
          },
        ];
      } else {
        targets = linesWithTag.slice(-2).map((line) => ({
          productVariant: {
            id: line.id,
            quantity: 1,
          },
        }));
      }
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
          value: 99.99,
        },
      },
      message: "BUY2GET2",
    });
  }

  return discounts.length > 0
    ? {
        discountApplicationStrategy: DiscountApplicationStrategy.All,
        discounts: discounts,
      }
    : EMPTY_DISCOUNT;
}
