import BaseClass from "./base-class";
import DataAccess from '../data-access/data-access';
import CostCalculatorApi from "./cost-calculator-api";
import PortfolioAnalysisApi from "./portfolio-analysis-api";
import SecurityDetailsApi from "./security-details-api";
import InvestmentCompareApi from "./investment-compare-api";
import TimeSeriesApi from "./time-series-api";
import ScreenerApi from "./screener-api";
import XrayApi from './xray-api';
import { merge } from '../helpers/utils';

function getPrivateMethods({ _currencyId, _languageId, _environment, apiHelpers, dataAccess }) {
    const methods = {
        initializeSdk({ apiTokenExpiredCallback, currencyId, environment, languageId, token }) {
            _currencyId = currencyId || _currencyId;
            _languageId = languageId || _languageId;
            _environment = environment || _environment;
            dataAccess.initialize({ apiTokenExpiredCallback, token });
            methods.setEnvironment({
                languageId: _languageId,
                currencyId: _currencyId,
                environment: _environment,
            });
        },
        setEnvironment(envParams) {
            Object.keys(apiHelpers).forEach(key => {
                if (apiHelpers[key] && apiHelpers[key] instanceof BaseClass) {
                    apiHelpers[key].changeEnvironment(merge({
                        languageId: _languageId,
                        currencyId: _currencyId,
                        environment: _environment,
                    }, envParams));
                }
            })
        },
    };
    return methods;
}

export default class ApisSdk {
    constructor() {
        // Private properties
        let _currencyId = 'GBP';
        let _environment = 'prod';
        let _languageId = 'en-GB';

        const dataAccess = new DataAccess();

        const apiHelpers = {
            costCalculator: new CostCalculatorApi(dataAccess),
            investmentCompare: new InvestmentCompareApi(dataAccess),
            portfolioAnalysis: new PortfolioAnalysisApi(dataAccess),
            securityDetails: new SecurityDetailsApi(dataAccess),
            screener: new ScreenerApi(dataAccess),
            timeSeries: new TimeSeriesApi(dataAccess),
            xray: new XrayApi(dataAccess),
        };

        const privateMethods = getPrivateMethods({
            _currencyId,
            _environment,
            _languageId,
            apiHelpers,
            dataAccess,
        });

        // Public
        Object.defineProperties(this, {

            /**
             * This is called from inside the apiTokenExpiredCallback. It updates the token stored in SDK and used for all API calls.
             * @callback dataAccessCallback
             * @param {string} error - Error message/code for cases where fetching a new token failed
             * @param {string} token - New valid MaaS token to be used when the existing token is no longer valid
            */

            /**
             * This would be called by the SDK if the token being used is no longer valid. It should fetch a new token and call the dataAccessCallback with it as an argument.
             * @callback apiTokenExpiredCallback
             * @param {dataAccessCallback} dataAccessCallback - The callback function defined in SDK that accepts the new token or an error in case token fetching code failed.
             */

            /**
             * Sets initial values for the SDK to work. To be called before any other methods to fetch data from APIs.
             * @param {object} parameters
             * @param {string} parameters.token - The MaaS token used for authentication by the APIs
             * @param {apiTokenExpiredCallback} parameters.apiTokenExpiredCallback - A function that would be called when the token passed in no longer valid. This function should fetch a new token from the server and pass it as an argument to the callback function it receives as an argument.
             * @param {string} [currencyId=GBP] - The currency ID to be passed in the APIs
             * @param {string} [languageId=en-GB] - The language ID to be passed in the APIs
             */
            initialize: {
                value: params => {
                    return privateMethods.initializeSdk.call(this, params);
                },
                writable: false,
            },
            setEnvironment: {
                value: envParams => {
                    return privateMethods.setEnvironment.call(this, envParams);
                },
                writable: false,
            },
            costCalculator: {
                value: apiHelpers.costCalculator,
                writable: false,
            },
            investmentCompare: {
                value: apiHelpers.investmentCompare,
                writable: false,
            },
            portfolioAnalysis: {
                value: apiHelpers.portfolioAnalysis,
                writable: false,
            },
            securityDetails: {
                value: apiHelpers.securityDetails,
                writable: false,
            },
            screener: {
                value: apiHelpers.screener,
                writable: false,
            },
            timeSeries: {
                value: apiHelpers.timeSeries,
                writable: false,
            },
            xray: {
                value: apiHelpers.xray,
                writable: false,
            },
        });
    }
}
