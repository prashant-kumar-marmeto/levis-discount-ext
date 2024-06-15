## create

```
mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
  discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
    automaticAppDiscount {
      discountId
      appDiscountType {
        appBridge {
          detailsPath
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
- variables
{
  "automaticAppDiscount": {
    "title": "BXGY",
    "functionId": "bcd8d84e-0ab9-4bbc-aeaa-7d6a229bc69c",
    "startsAt": "2024-06-15T08:24:40.924Z",
    "endsAt": null,
    "metafields": {
      "namespace": "$app:bxgy-discount",
      "key": "function-configuration",
      "type":"json",
      "value": "[\"bxgy\"]"
    }
  }
}


//function code
  // item more than 4
  // const ItemQty4 = linesWithTag.find((line) => line.quantity >= 4);
  // const ItemQty2 = linesWithTag.find((line) => line.quantity >= 2);

  // if (linesWithTag.length >= 4) {
  //   const targets = linesWithTag.slice(0, 2).map((line) => ({
  //     productVariant: {
  //       id: line.id,
  //       quantity: 1,
  //     },
  //   }));

  //   discounts.push({
  //     targets: targets,
  //     value: {
  //       percentage: {
  //         value: 100,
  //       },
  //     },
  //     message: "Buy 2 get 2 free",
  //   });
  // } else if (linesWithTag.length >= 2) {
  //   const targets = linesWithTag.slice(0, 1).map((line) => ({
  //     productVariant: {
  //       id: line.id,
  //       quantity: 1,
  //     },
  //   }));

  //   discounts.push({
  //     targets: targets,
  //     value: {
  //       percentage: {
  //         value: 100,
  //       },
  //     },
  //     message: "Buy 1 get 1 free",
  //   });
  // } else if (ItemQty4) {
  //   const targets = [
  //     {
  //       productVariant: {
  //         id: ItemQty4.id,
  //         quantity: 2,
  //       },
  //     },
  //   ];
  //   discounts.push({
  //     targets: targets,
  //     value: {
  //       percentage: {
  //         value: 100,
  //       },
  //     },
  //     message: "Buy 2 get 2 free",
  //   });
  // } else if (ItemQty2) {
  //   const targets = [
  //     {
  //       productVariant: {
  //         id: ItemQty2.id,
  //         quantity: 1,
  //       },
  //     },
  //   ];
  //   discounts.push({
  //     targets: targets,
  //     value: {
  //       percentage: {
  //         value: 100,
  //       },
  //     },
  //     message: "Buy 1 get 1 free",
  //   });
  // }
```
