import { v4 as uuid } from 'uuid';

// This is called if the user failed to pass 'apiTokenExpiredCallback' in initialize method.
// It warns the user with details on how the 'apiTokenExpiredCallback' function should look like
const defaultTokenExpiryCallback = () => {
    console.warn(`Seems like you either didn't pass a valid token during initialization or the token expired, and you haven't passed a apiTokenExpiredCallback function (during initialization) that would register your new token. This function would look something like this —
    function(callback) {
        // some API call to fetch the token from server
        callback(error, newToken); // error could be null or any falsy value if you were able to fetch the token successfully
    }`);
}

// The default minimum/maximum times to sleep before retying a request.
// These can be overwritten by the options object passed to fetch.
const defaultRetrySettings = {
    // maximum time to sleep
    maxSleep: 100,
    // minimum time to sleep before retrying a request
    minSleep: 10,
    // a hook that is called on every retry, default to logging.
    // users can pass their own onRetry hook, which receives a reference to the
    // active request; this can be aborted with a reference to the request id
    onRetry: message => console.warn('dataAccess', message),
};

// the named extensions that are supported by this interface
const extensions = ['url', 'timeout', ...Object.keys(defaultRetrySettings)];

// status messages for requests
const REQUEST_ABORTED = 'request aborted';
const REQUEST_PENDING = 'request is pending';
const REQUEST_RETRIED = 'request was retried';
const REQUEST_TIMEOUT = 'request timed out';
// for tokens
const TOKEN_AVAILABLE = 'token is available';
const TOKEN_REHYDRATE = 'awaiting token refresh';
const TOKEN_UNDEFINED = 'token is uninitialized';

// Returns an object containing private methods for the DataAccess class
function getPrivateMethods({ activeRequests, apiTokenExpiredCallback, pool, status, tokenValue }) {
    const methods = {
        abort(request = {}) {
            if (activeRequests.has(request.id)) {
                activeRequests.get(request.id).status = REQUEST_ABORTED;
            } else {
                throw new Error('the promise cannot be aborted');
            }
        },
        awaitFreshToken() {
            status = TOKEN_REHYDRATE;
            apiTokenExpiredCallback(
                (error, newToken) => {
                    // update the token
                    status = error ? TOKEN_UNDEFINED : TOKEN_AVAILABLE;
                    tokenValue = error || newToken;
                    // invoke and drain all pending requests
                    pool.forEach(pendingRequest => {
                        pool.delete(pendingRequest);
                        pendingRequest(error, error ? null : newToken);
                    });
                }
            );
        },
        decorateRequest(request) { // Adds token in the requests authorization headers
            const requestOptions = request.requestOptions || {};
            requestOptions.headers = request.requestOptions.headers || {};
            requestOptions.headers.Authorization = request.token.startsWith('Bearer ') ? request.token : `Bearer ${request.token}`;
            return requestOptions;
        },
        fetchInternal() {
            // did you forget to polyfill?
            if (window.fetch === undefined) {
                throw new Error('window.fetch is undefined');
            }
            return window.fetch;
        },
        getRequest(options, requestId) {
            const { url } = options;
            // get a reference to the active request
            const tracking = activeRequests.get(requestId);
            // copy the options object instead of mutating
            const requestOptions = Object.assign({}, options);
            // options.maxAttempts must be set to trigger retry logic
            if (options.maxAttempts > 0) {
                // apply defaults for min/max sleep and the onRetry hook;
                // this does mutate the options object passed here
                options = Object.assign({}, defaultRetrySettings, options);
            }
            // sanitize the options passed to native fetch
            extensions.forEach(key => {
                delete requestOptions[key];
            });
            // getToken takes a callback, which may be pooled awaiting a token refresh
            return new Promise((resolve, reject) => {
                methods.getToken((error, token) => {
                    // the application has to handle errors getting tokens
                    if (error) {
                        return reject(error);
                    }
                    if (!methods.validateTokenForRequest(token)) {
                        methods.awaitFreshToken();
                        // this condition may be reached before the request is active
                        if (tracking) {
                            tracking.status = REQUEST_RETRIED;
                        }
                        // the getRequest method will call itself until validateTokenForRequest returns true.
                        // this does introduce the potential for an infinite loop.
                        // one way to circumvent this will be to introduce some throttling or maximum retries
                        // in the refreshToken or validateTokenForRequest callbacks.
                        return resolve(methods.getRequest.call(this, options, requestId));
                    }
                    // the client determines how tokens are attached to requests
                    return resolve([
                        url,
                        methods.decorateRequest({
                            token,
                            requestOptions,
                        }),
                    ]);
                });
            });
        },
        getToken(callback) {
            if (status === TOKEN_AVAILABLE) {
                // doesn't know or care if the token is valid
                callback(null, tokenValue);
            } else if (status === TOKEN_REHYDRATE) {
                // await the pending refresh
                pool.add(callback);
            } else {
                // this will surface error messages from refreshToken
                callback(tokenValue);
            }
        },
        registerTokenAndCallbacks(initOptions) {
            if (initOptions.token) {
                tokenValue = initOptions.token;
                status = TOKEN_AVAILABLE;
            }
            if (initOptions.apiTokenExpiredCallback) {
                apiTokenExpiredCallback = initOptions.apiTokenExpiredCallback;
            }
            // make the initial call to get the token
            if (!initOptions.token) {
                methods.awaitFreshToken();
            }
        },
        retry(options, requestId) {
            const { minSleep, maxSleep, maxAttempts } = options;
            // get the active request
            const tracking = activeRequests.get(requestId);
            // what attempt is this?
            const attempt = maxAttempts - tracking.attempts;
            // calculate time for exponential backoff with jitter
            const interval = minSleep || tracking.interval;
            // the value returned is a random number in the range from minSleep to maxSleep
            // see https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter
            tracking.interval = Math.min(maxSleep, interval + Math.random() * (2 ** attempt));
            // decrement the number of attempts remaining
            tracking.attempts -= 1;
            // signal that this request is being retried
            tracking.status = REQUEST_RETRIED;

            return new Promise(resolve => {
                window.setTimeout(() => {
                    // make a new request reusing the existing request id
                    const recycled = this.fetch(options, requestId);

                    // invoke the retry hook - let the client application respond
                    if (options.onRetry && typeof options.onRetry === 'function') {
                        options.onRetry(
                            `request to '${options.url}' failed - ${tracking.attempts} attempts remaining; slept ${interval}ms.`
                        );
                    }

                    // the backoff/jitter helps resolve spikes in traffic when a service needs to scale up
                    resolve(recycled);
                }, interval);
            });
        },
        send(options, id) {
            const fetch = methods.fetchInternal();

            // grab a unique id, or retry using an active request id
            const requestId =
                id && activeRequests.has(id) && activeRequests.get(id).status === REQUEST_RETRIED ? id : uuid();

            // get the validated and/or decorated request object.
            // errors getting the token from the awaitFreshToken callback need to be handled by the application.
            const req = methods.getRequest
                .call(this, options, requestId)
                .then(args => fetch(...args))
                .then(response => {
                    // get a reference to the active request
                    const tracking = activeRequests.get(requestId);
                    // if the request is not aborted or timed out
                    if (tracking.status === REQUEST_PENDING) {
                        // invoke the callback to determine if a token refresh is required
                        // the retry logic should be invoked first
                        if (String(response.status).match(/^[45]/) && tracking.attempts > 0) {
                            // drop the response, and retry the request
                            return methods.retry.call(this, options, requestId);
                        }
                        // clear the timeout, if it exists
                        window.clearTimeout(tracking.timer);
                        // remove the request id from the set of active requests
                        activeRequests.delete(requestId);
                        // proceed as usual
                        return response;
                    }
                    // should this be an error?
                    return Promise.reject(new Error(tracking.status));
                })
                .then(response => {
                    if (response.headers.get('content-type') === 'application/pdf') {
                        return response;
                    }
                    return response.json();
                });

            // update active requests
            if (activeRequests.has(requestId)) {
                activeRequests.get(requestId).status = REQUEST_PENDING;
            } else {
                // track new requests
                activeRequests.set(requestId, {
                    attempts: options.maxAttempts || 0,
                    status: REQUEST_PENDING,
                });
            }

            if (options.timeout) {
                // this can be combined with retry / automatic token-refresh
                methods.setTimer(options.timeout, requestId);
            }

            // return the fetch request amended with a (read-only) id prop
            return Object.defineProperty(req, 'id', {
                value: requestId,
            });
        },
        setTimer(time, requestId) {
            const tracking = activeRequests.get(requestId);
            tracking.timer = window.setTimeout(() => {
                tracking.status = REQUEST_TIMEOUT;
            }, time);
        },
        validateTokenForRequest(token) { // Checks if the token has expired
            try {
                // Get the expiration in seconds and convert to milliseconds
                // Assume token is in the format "Bearer tokenpart1.tokenpart2" where tokenpart2 is encoded "{ exp: n }"
                const expiration = parseInt(JSON.parse(atob(token.replace('Bearer ', '').split('.')[1])).exp, 10) * 1000;
                if (expiration - 60000 > Date.now()) {
                    return true;
                }
                return false;
            } catch (ex) {
                return false;
            }
        },
    };
    return methods;
}

export default class DataAccess {
    constructor() {
        // private props
        const activeRequests = new Map();
        const pool = new Set();
        const status = TOKEN_UNDEFINED;
        const tokenValue = null;
        const apiTokenExpiredCallback = defaultTokenExpiryCallback;

        const privateMethods = getPrivateMethods({
            activeRequests,
            apiTokenExpiredCallback,
            pool,
            status,
            tokenValue,
        });

        // Attach public methods here so that they have access to private methods fetched above
        Object.defineProperties(this, {
            abort: {
                value: request => {
                    return privateMethods.abort.call(this, request);
                },
                writable: true,
            },
            fetch: {
                value: (params = {}, requestId = null) => {
                    return privateMethods.send.call(this, params, requestId);
                },
                writable: true,
            },
            initialize: {
                value: (params = {}) => {
                    return privateMethods.registerTokenAndCallbacks.call(this, params);
                },
                writable: true,
            },
        })
    }
}
