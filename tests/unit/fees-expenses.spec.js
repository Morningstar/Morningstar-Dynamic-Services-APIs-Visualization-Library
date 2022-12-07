// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import FeesExpenses from '@/components/fees-expenses/FeesExpenses.vue';

Vue.use(Vuetify);

describe('FeesExpenses.vue', () => {
    it('should render Fees Expenses', () => {
        const wrapper = shallowMount(FeesExpenses);
        expect(wrapper.find('.title h2').text()).toBe('Fees & Expenses');
    });
});
