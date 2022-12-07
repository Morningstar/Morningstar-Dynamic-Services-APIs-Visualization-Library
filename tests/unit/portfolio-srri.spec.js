// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import PortfolioSrri from '@/components/portfolio-srri/PortfolioSrri.vue';

Vue.use(Vuetify);

describe('PortfolioSrri.vue', () => {
    it('should render Portfolio Srri', () => {
        const wrapper = shallowMount(PortfolioSrri);
        expect(wrapper.find('.title h2').text()).toBe('Portfolio SRRI');
    });
});
