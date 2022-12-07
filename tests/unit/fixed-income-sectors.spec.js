// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import FixedIncomeSectors from '@/components/fixed-income-sectors/FixedIncomeSectors.vue';

Vue.use(Vuetify);

describe('FixedIncomeSectors.vue', () => {
    it('should render Fixed Income Sectors', () => {
        const wrapper = shallowMount(FixedIncomeSectors);
        expect(wrapper.find('.title h2').text()).toBe('Fixed Income Sectors');
    });
});
