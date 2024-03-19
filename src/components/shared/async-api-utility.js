const ApiTimeout = 180000;
const ApiIntervalValue = 5000;
let apiTimeSinceStart = 0;

/**
 * Returns true if API timed out
 */
function isApiTimedOut() {
    return apiTimeSinceStart > ApiTimeout;
}

/**
 * Checks if polling process is complete and cancels api call
 * if job status code is not pending returns false otherwise returns true
 */
function checkApiCallRequired(statusCode) {
    return (statusCode && statusCode === 'pending') || !statusCode;
}

/**
 * reset values for API time since start & interval count to initial as polling process is completed
 * (when success or failure job status API)
 */
function resetApiIntervalValues() {
    apiTimeSinceStart = 0;
}

/**
 *  @param {*} reset - Boolean to reset apiTimeSinceStart
 * Increment value of API start time by interval value, if receives true then reset it to default
 */
function setApiTimeSinceStart(reset = false) {
    apiTimeSinceStart = reset ? 0 : apiTimeSinceStart + ApiIntervalValue;
}

export {
    ApiIntervalValue,
    checkApiCallRequired,
    isApiTimedOut,
    resetApiIntervalValues,
    setApiTimeSinceStart,
};
