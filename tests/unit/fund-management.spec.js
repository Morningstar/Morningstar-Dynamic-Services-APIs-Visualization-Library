// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import FundManagement from '@/components/fund-management/FundManagement.vue';

Vue.use(Vuetify);

describe('FundManagement.vue', () => {
    it('should render Fund Management', () => {
        const wrapper = shallowMount(FundManagement);
        expect(wrapper.find('.title h2').text()).toBe('Fund Management');
    });
});
