// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const discounts = [];
  const linesWithTag = [];
  const operations = [];

  input.cart.lines.forEach((line) => {
    if (
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.product.hasAnyTag === true
    ) {
      linesWithTag.push({
        cartLineId: line.id,
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

  // if (totalQuantity >= 4) {
  //   // 4 or more different items
  //   // same item with qty 4
  //   // one item with some qty and another with some qty
  //   //orders items
  //   //  1 2 3 4
  //   //  1 1 1 2
  //   //  1 1 2 2

  //   let targets;

  //   if (linesWithTag.length >= 2) {
  //     const lastItem = linesWithTag[linesWithTag.length - 1];
  //     if (lastItem.quantity >= 2) {
  //       targets = [
  //         {
  //           productVariant: {
  //             id: lastItem.id,
  //             quantity: 2,
  //           },
  //         },
  //       ];
  //     } else {
  //       targets = linesWithTag.slice(-2).map((line) => ({
  //         productVariant: {
  //           id: line.id,
  //           quantity: 1,
  //         },
  //       }));
  //     }
  //   } else {
  //     // item 1 qty 4+
  //     targets = linesWithTag.slice(-1).map((line) => ({
  //       productVariant: {
  //         id: line.id,
  //         quantity: 2,
  //       },
  //     }));
  //   }

  //   discounts.push({
  //     targets: targets,
  //     value: {
  //       percentage: {
  //         value: 100,
  //       },
  //     },
  //     message: "BUY2GET2",
  //   });
  // }

  if (totalQuantity >= 4) {
    linesWithTag.forEach((lineItem) => {
      operations.push({
        update: {
          cartLineId: lineItem.cartLineId,
          price: {
            adjustment: {
              fixedPricePerUnit: {
                amount: lineItem.cost,
              },
            },
          },
        },
      });
    });
  }

  console.log(JSON.stringify(operations, null, 20));

  return operations.length > 0 ? { operations: operations } : NO_CHANGES;
}

// {
//   operations: [
//     {
//       update: {
//         cartLineId: "",
//         price: {
//           adjustment: {
//             fixedPricePerUnit: {
//               amount: 1,
//             },
//           },
//         },
//       },
//     },
//   ],
// };
