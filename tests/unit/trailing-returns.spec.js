// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import TrailingReturns from '@/components/trailing-returns/TrailingReturns.vue';

Vue.use(Vuetify);

describe('TrailingReturns.vue', () => {
    it('should render Trailing Returns', () => {
        setTimeout(() => {
            const wrapper = shallowMount(TrailingReturns);
            expect(wrapper.find('.title h2')
                .text())
                .toBe('Trailing Returns');
        });
    });
});
