// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import RiskStatistics from '@/components/risk-statistics/RiskStatistics.vue';

Vue.use(Vuetify);

describe('RiskStatistics.vue', () => {
    it('should render Risk Statistics', () => {
        const wrapper = shallowMount(RiskStatistics);
        expect(wrapper.find('.title h2').text()).toBe('Risk Statistics');
    });
});
