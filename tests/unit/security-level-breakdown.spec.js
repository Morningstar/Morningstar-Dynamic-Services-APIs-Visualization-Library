// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import SecurityLevelBreakdown from '@/components/security-level-breakdown/SecurityLevelBreakdown.vue';

Vue.use(Vuetify);

describe('SecurityLevelBreakdown.vue', () => {
    it('should render Security Level Breakdown', () => {
        setTimeout(() => {
            const wrapper = shallowMount(SecurityLevelBreakdown);
            expect(wrapper.find('.title h2').text()).toBe('Security Breakdown');
        });
    });
});
