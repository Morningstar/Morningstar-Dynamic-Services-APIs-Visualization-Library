import Vue from 'vue';
import Vuetify from 'vuetify'; // loads all components
import config from '@/plugins/vuetify'; // basic config with theme
import 'vuetify/dist/vuetify.min.css'; // all the css for components
import '@/sass/style.scss';

Vue.use(Vuetify);

export default new Vuetify(config);
