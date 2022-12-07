Morningstar APIs are available to clients with MaaS based authentication that uses short expiry tokens so as to ensure that premium, real-time data is not accessible by users not entitled to view it. While registering and generating a token is not a difficult task that all our existing clients are already used to, some additional tasks (like sending the token in each API request, handling scenarios where the initially generated token expired during a user session) might not seem simple to clients to implement themselves. These tasks are handled seamlessly in our products and internal frameworks.

The Morningstar APIs SDK aims to provide the same efficient, seamless way of handling tokens and token expiration while wrapping our APIs in simple functional methods that the clients can call to fetch the data they need. The usage would be as simple as including a JS file on the HTML page and then calling exposed methods like initialize and searchSecurities. See usage examples below.

# Usage

 1. Include the SDK javascript file in your HTML page.  
The project builds into a simple JavaScript file that can be included in your application or HTML page.
```HTML
<script src="mstar-apis-sdk.js" />
```
 2. Initialize the SDK  
Parameters common to all API calls like language ID, currency ID, MaaS based authentication token and an API token expiry callback function (used to set a new token when one expires) can be set in a single one time call to avoid repetition using the initialize method of the SDK.
```javascript
window.mstarApisSdk.initialize({
    currencyId: 'GBP',
    langaugeId: 'en-GB',
    token: 'your MAAS token here',
    apiTokenExpiredCallback: function(dataAccessCallback) {
        // code to fetch new MaaS token
        dataAccessCallback('<error if any>', '<your new MaaS token>');
    },
});
```
 3. Fetch data using any of the exposed methods  
For example, to fetch data of a security, we just need to call the `getSecurity` method, and to fetch a list of securities that match a search string typed by a user in an autocomplete or search input field, we just need to call the `searchSecurities` method.
```javascript
window.mstarApisSdk.securityDetails.getSecurity('F0GBR050DD'); // returns a promise
window.mstarApisSdk.screener.searchSecurities('abaco'); // returns a promise
```

 4. Handling promises in JavaScript  
One simple way of handling promises in javascript is to use the `then` method. Another way would be to use `await` keyword.
```javascript
window.mstarApisSdk.securityDetails.getSecurity('F0GBR050DD').then((apiResponse) => {
    console.log('Data for the security received successfully!');
});
```
```javascript
var securityData = await window.mstarApisSdk.securityDetails.getSecurity('F0GBR050DD');
```

 5. Setting common parameters as environment setting  
Consider a scenario where a user wants to call multiple methods of the portfolio analysis API with the same portfolio. The user could call these methods individually with the portfolio object passed in the parameters or the user could also call the changeEnvironment method to set the portfolio as an environment variable for portfolioAnalysis class and then call the methods without it. Our code would internally fetch values from the class' environment variables and merge it with the parameters passed (passed parameters would be given preference while merging).
```javascript
window.mstarApisSdk.portfolioAnalysis.getRiskScore({
    portfolio: //portfolio object here
}).then(apiResponse => console.log);
window.mstarApisSdk.portfolioAnalysis.getEsgPerformance({
    portfolio: //portfolio object here
}).then(apiResponse => console.log);

// The following is equivalent to the code above

window.mstarApisSdk.portfolioAnalysis
    .changeEnvironment({ // Parameters set here would be used by all subsequent portfolioAnalysis methods as default parameters
        portfolio: // portfolio object here
    }) // returns this, allowing chaining
    .getRiskScore()
    .then(apiResponse => console.log);
window.mstarApisSdk.portfolioAnalysis.getEsgPerformance().then(apiResponse => console.log);
```

For documentation and more details around API response structures and data object schemas used, please refer to the [APIs page](https://developer.morningstar.com/apis/getting-started/morningstar-apis) on [Morninstar Developer site](https://developer.morningstar.com/).

# Contribution

The source code of this project is maintained using Git version control. To contribute to this git repository, we recommend developers to fork it, clone the forked repository, commit your changes to the fork-cloned repository and then raise a pull request to the original repository.
## Set up

This is a simple node based project.\
Once you have this repository forked and cloned on your local machine, you may set up the development environment by simply installing the node module dependencies using the command —
```
npm install
```

## Build files

During local development, the files in the `src` folder could be packed into a single JavaScript file using the `build:debug` script.
```
npm run build:debug
```
For production release, use the `build` script.
```
npm run build
```

## Local browser preview and testing

One can use `nodemon` to start a simple local server and host the `index.html` page added in `dist` folder
```
npm run preview
```
Once the express server is up. Open https://localhost:3000/index.html in a web browser on your machine.\
In the browser's developer tools, open console and use the publicly exposed methods —
```
window.mstarApisSdk.initialize({
    apiTokenExpiredCallback: function(dataAccessCallback) {
        console.warn('token expired, pass a new token');
        var token = 'override this with your new token';
        debugger;
        dataAccessCallback(null, token);
    },
    token: 'your MAAS token here',
});
```
```
window.mstarApisSdk.searchSecurities('aba');
```

## Commit message

So that we can confidently use semantic versioning, commit messages must follow one of the standard message formats (note that case is important):

*   `changetype: description` - use this format when making changes to packages, e.g.
    *    major: Public interface of a method updated, breaking change
    *    minor: New method introduced
    *    patch: Bug fix
    *    chore: Clean up with no change to functionality
*   `Update config file` - use this message when updating a top-level file, e.g. .gitignore or .eslintignore
*   `Update readme` - use this message when updating the top-level README.md
