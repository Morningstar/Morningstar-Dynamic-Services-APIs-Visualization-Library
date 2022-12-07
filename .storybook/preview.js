// .storybook/preview.js now looks like this
import vuetify from "./vuetify_storybook";
import "./mstar-apis-sdk";
import anysort from "anysort";
import './../src/sass/style.scss';

window.mstarApisSdk.initialize({
  apiTokenExpiredCallback(callback) {
    let token = "";
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
  },
  token: "token",
  languageId: "en-GB",
  currencyId: "GBP",
});

export const parameters = {
  options: {
    storySort: (previous, next) => {
      const [previousStory, previousMeta] = previous;
      const [nextStory, nextMeta] = next;

      return anysort(previousMeta.kind, nextMeta.kind, [
        "Morningstar/Introduction",
        "Components/**",
      ]);
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
