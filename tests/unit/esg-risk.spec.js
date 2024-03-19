// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import Sustainability from '@/components/esg-risk/EsgRisk.vue';

Vue.use(Vuetify);

describe('EsgRisk.vue', () => {
    it('should render EsgRisk', () => {
        setTimeout(() => {
            const wrapper = shallowMount(Sustainability);
            expect(wrapper.find('.title h2').text()).toBe('Sustainability Esg Risk');
        });
    });
});
