// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import Xray from '@/components/xray/Xray.vue';

Vue.use(Vuetify);

describe('Xray.vue', () => {
    it('should render Xray', () => {
        setTimeout(() => {
            const wrapper = shallowMount(Xray);
            expect(wrapper.find('.title h2').text()).toBe('X-ray');
        });
    });
});
