// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import RiskScore from '@/components/risk-score/RiskScore.vue';

Vue.use(Vuetify);

describe('RiskScore.vue', () => {
    it('should render Risk Score', () => {
        const wrapper = shallowMount(RiskScore);
        expect(wrapper.find('.title h2').text()).toBe('Risk Score');
    });
});
