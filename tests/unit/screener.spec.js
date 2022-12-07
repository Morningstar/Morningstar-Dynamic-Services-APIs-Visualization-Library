// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import Screener from '@/components/screener/Screener.vue';

Vue.use(Vuetify);

describe('Screener.vue', () => {
    it('should render Screener', () => {
        setTimeout(() => {
            const wrapper = shallowMount(Screener);
            expect(wrapper.find('.title h2').text()).toBe('Screener');
        });
    });
});
