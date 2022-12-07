// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import FixedIncomeCountry from '@/components/fixed-income-country/FixedIncomeCountry.vue';

Vue.use(Vuetify);

describe('FixedIncomeCountry.vue', () => {
    it('should render Fixed Income Country', () => {
        const wrapper = shallowMount(FixedIncomeCountry);
        expect(wrapper.find('.title h2').text()).toBe('Fixed Income Country');
    });
});
