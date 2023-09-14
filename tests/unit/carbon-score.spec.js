// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import CarbonScore from '@/components/carbon-score/CarbonScore.vue';

Vue.use(Vuetify);

describe('CarbonScore.vue', () => {
    it('should render Carbon-score', () => {
        setTimeout(() => {
            const wrapper = shallowMount(CarbonScore);
            expect(wrapper.find('.title h2').text()).toBe('Carbon Score');
        })
    });
});