// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import Sustainability from '@/components/sustainability/Sustainability.vue';

Vue.use(Vuetify);

describe('Sustainability.vue', () => {
    it('should render Sustainability', () => {
        const wrapper = shallowMount(Sustainability);
        expect(wrapper.find('.title h2').text()).toBe('Sustainability');
    });
});
