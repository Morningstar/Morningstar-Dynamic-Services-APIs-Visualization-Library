import { themes } from "@storybook/theming";
import vuetify from "./vuetify_storybook";
import "./mstar-apis-sdk";
import anysort from "anysort";
import "./../src/sass/style.scss";

window.mstarApisSdk.initialize({
    apiTokenExpiredCallback(callback) {
        let token = "";
        try {
            const tokenService = new DevSiteTokenService();
            if ((window.location.pathname.match(/\//g) || []).length > 4) {
                // Story being opened in new tab
                token = window.localStorage.getItem("demoToken");
                if (token) {
                    let expiration;
                    try {
                        expiration = parseInt(JSON.parse(atob(token.split(".")[1])).exp, 10) * 1000;
                    } catch (err) {
                        callback("Invalid token");
                    }
                    if (expiration - 60000 > Date.now()) {
                        callback(null, `Bearer ${token}`);
                    } else {
                        callback("Token expired!");
                    }
                }
            } else {
                // Storybook rendered in developer site
                tokenService.GetDevSiteToken().then((val) => {
                    token = `Bearer ${val}`;
                    callback(null, token);
                });
            }
        } catch (err) {
            // For internal QA, where DevSiteTokenService is not available
            fetch("https://www.us-stg-api.morningstar.com/developer/v1/demo-token")
                .then((response) => response.json())
                .then((data) => {
                    const errorMessage = data.access_token ? null : "Token not valid. Fetch a new token!";
                    token = `Bearer ${data.access_token}`;
                    callback(errorMessage, token);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    },
    token: "token",
    languageId: "en-GB",
    currencyId: "GBP",
});

const globalThemeOverrides = {
    brandTitle: "Morningstar Dynamic Services APIs",
    brandUrl: "./index.html?path=/story/morningstar-introduction--page",
    brandImage: "https://developer.morningstar.com/logo.svg",
    brandTarget: "_self",
    // Typography
    fontBase: '"Roboto Condensed", sans-serif',
};

export const parameters = {
    darkMode: {
        current: "light",
        dark: {
            ...themes.dark,
            ...globalThemeOverrides,
        },
        light: {
            ...themes.light,
            ...globalThemeOverrides,
        },
    },
    options: {
        storySort: (previous, next) => {
            const [previousStory, previousMeta] = previous;
            const [nextStory, nextMeta] = next;

            return anysort(previousMeta.kind, nextMeta.kind, ["Morningstar/Introduction", "Components/**"]);
        },
    },
};

export const decorators = [
    (Story) => ({
        vuetify,
        template: `
    <v-app>
      <v-main>
        <v-container fluid >
          <story/>
        </v-container>
      </v-main>
    </v-app>
    `,
    }),
];
