// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import RiskRating from '@/components/risk-rating/RiskRating.vue';

Vue.use(Vuetify);

describe('RiskRating.vue', () => {
    it('should render Risk Rating', () => {
        const wrapper = shallowMount(RiskRating);
        expect(wrapper.find('.title h2').text()).toBe('Risk & Rating');
    });
});
