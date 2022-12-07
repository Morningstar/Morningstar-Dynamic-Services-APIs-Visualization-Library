// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import AssetAllocation from '@/components/asset-allocation/AssetAllocation.vue';

Vue.use(Vuetify);

describe('AssetAllocation.vue', () => {
    it('should render Asset Allocation', () => {
        const wrapper = shallowMount(AssetAllocation);
        expect(wrapper.find('.title h2').text()).toBe('Asset Allocation');
    });
});
