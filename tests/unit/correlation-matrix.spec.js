// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import CorrelationMatrix from '@/components/correlation-matrix/CorrelationMatrix.vue';

Vue.use(Vuetify);

describe('correlation-matrix.vue', () => {
    it('should render Correlation-matrix', () => {
        setTimeout(() => {
            const wrapper = shallowMount(CorrelationMatrix);
            expect(wrapper.find('.title h2').text()).toBe('Correlation-matrix');
        })
    });
});
