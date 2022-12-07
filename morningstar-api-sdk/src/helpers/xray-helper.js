import { get } from 'lodash';

function generateHoldingType(holdings) {
    let holdingType = 'weight';
    const holding = holdings && holdings[0] || {};
    if (holding.holdingType) {
        holdingType = holding.holdingType;
    } else if (holding.amount) {
        holdingType = 'amount';
    } else if (holding.units) {
        holdingType = 'units';
    }
    return holdingType;
}

function updateCashAttributes(requestOptions, holdings) {
    const cashItem = holdings.find(item => item.identifier && item.identifier.toLowerCase().indexOf('cash') > -1);
    if (!cashItem) {
        return;
    }
    const { cashHoldingIdentifier, cashHoldingTypeId, cashSecurityType } = requestOptions;
    cashItem.identifier = cashHoldingIdentifier || cashItem.identifier;
    cashItem.holdingTypeId = cashHoldingTypeId || cashItem.holdingTypeId;
    cashItem.securityType = cashSecurityType || cashItem.securityType;
}

function getIwtPortfolio(portfolio = {}, currencyId, requestOptions) {
    const actualPortfolio = portfolio.current || portfolio.proposed || portfolio;
    const typeMap = {
        amount: 3,
        units: 9,
        weight: 2,
    };
    const holdings = actualPortfolio.holdings || [];
    const holdingType = generateHoldingType(holdings);
    updateCashAttributes(requestOptions, holdings);
    return {
        type: typeMap[holdingType],
        benchmarkId: get(actualPortfolio, 'benchmark.holdings[0].identifier', null),
        currencyId: actualPortfolio.currencyId || currencyId,
        holdings,
        name: actualPortfolio.name,
    };
}

export {
    getIwtPortfolio,
};
