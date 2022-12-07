# Overview

The web-asset-library was developed with the aim to provide easy-to-use set of reusable Web Assets so as to reduce the amount of code written by Morningstar Integrator Partners (MIPs).

These components do not make an API call to fetch the data but instead rely on parent pages or containers to fetch the data and pass it to them. A single API call may bring data for a number of components or a single component may display data coming from a number of APIs (example - Morningstar API + custom client data coming from a different API). The API data thus needs to be filtered, combined, massaged into a format that the component understands/accepts. This conversion of data from one format to another is often referred to as `transformation`.

## Transformation example

Consider the asset allocation component. It displays asset class breakdown of a fund's investment along with its benchmark or category.

The component needs data in the following format —
```json
[
  {
    "breakdownType": "1",
    "assetClass": "US Stocks",
    "net": 44.49892,
    "bmark": "–"
  },
  {
    "breakdownType": "2",
    "assetClass": "Non US Stocks",
    "net": 36.35144,
    "bmark": "–"
  },
  {
    "breakdownType": "3",
    "assetClass": "Bonds",
    "net": 4.96041,
    "bmark": "–"
  },
  {
    "breakdownType": "4",
    "assetClass": "Cash",
    "net": 14.1892,
    "bmark": 100
  },
  {
    "breakdownType": "99",
    "assetClass": "Other",
    "net": 0.00002,
    "bmark": "–"
  }
]
```

But the API response is received in the format —
```json
{
  "status": {
    "detailedStatusMessage": "",
    "statusCode": 200,
    "statusDescription": ""
  },
  "breakdowns": {
    "assetAllocation": [
      {
        "type": "MorningstarEUR3",
        "salePosition": "N",
        "values": {
          "1": 44.49892,
          "2": 36.35144,
          "3": 4.96041,
          "4": 14.1892,
          "99": 0.00002
        }
      },
      {
        "type": "MorningstarEUR3",
        "salePosition": "L",
        "values": {
          "1": 44.49892,
          "2": 36.36983,
          "3": 5.4687,
          "4": 14.1892,
          "99": 0
        }
      },
      {
        "type": "MorningstarEUR3",
        "salePosition": "S",
        "values": {
          "1": 0,
          "2": 0.01838,
          "3": 0.50829,
          "4": 0,
          "99": 0
        }
      }
    ]
  },
  "benchmark": [
    {
      "breakdowns": {
        "assetAllocation": [
          {
            "type": "MorningstarEUR3",
            "salePosition": "N",
            "values": {
              "4": 100
            }
          },
          {
            "type": "MorningstarEUR3",
            "salePosition": "L",
            "values": {
              "4": 100
            }
          }
        ]
      }
    }
  ]
}
```

The API response is _transformed_ into the format understood by the component in its source code using some javascript operations like —
```javascript
      let transformedData = [];
      const assetAllocationBreakdownMapping = { // API response returns numeric values like 1,2,3 which are mapped to English labels here
        1: 'US Stocks',
        2: 'Non US Stocks',
        3: 'Bonds',
        4: 'Cash',
        99: 'Other',
      };
      if (this.modelData) {
        // Pick the object from "assetAllocation" array where salePosition is 'N' (i.e. pick Net values)
        const breakdownValues = this.modelData.breakdowns?.assetAllocation?.find((assetAllocationBreakdown) => assetAllocationBreakdown.salePosition === 'N')?.values;
        const bmarkBreakdownValues = this.modelData.benchmark?.[0].breakdowns?.assetAllocation?.find((assetAllocationBreakdown) => assetAllocationBreakdown.salePosition === 'N')?.values;
        // Combine benchmark and security data into a single format for each asset breakdown class
        transformedData = Object.keys(breakdownValues).map((breakdownType) => ({
          breakdownType,
          assetClass: assetAllocationBreakdownMapping[breakdownType],
          net: breakdownValues[breakdownType],
          bmark: bmarkBreakdownValues[breakdownType] || '–', // Display '–' in the table if there's no value received from API.
        }));
      }
```
