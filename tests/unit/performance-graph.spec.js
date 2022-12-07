// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import PerformanceGraph from '@/components/performance-graph/PerformanceGraph.vue';

Vue.use(Vuetify);

describe('PerformanceGraph.vue', () => {
    it('should render Performance Graph', () => {
        setTimeout(() => {
            const wrapper = shallowMount(PerformanceGraph);
            expect(wrapper.find('.title h2').text()).toBe('Performance Graph');
        });
    });
});
