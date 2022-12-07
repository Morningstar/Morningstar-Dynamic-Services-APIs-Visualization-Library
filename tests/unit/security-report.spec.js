// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import SecurityReport from '@/components/security-report/SecurityReport.vue';

Vue.use(Vuetify);

describe('SecurityReport.vue', () => {
    it('should render Security Report', () => {
        setTimeout(() => {
            const wrapper = shallowMount(SecurityReport);
            expect(wrapper.find('.header-title h2').text()).toBe('Security Report');
        });
    });
});
