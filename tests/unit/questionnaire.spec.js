// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import Questionnaire from '@/components/questionnaire/Questionnaire.vue';

Vue.use(Vuetify);

describe('Questionnaire.vue', () => {
    it('should render Questionnaire', () => {
        setTimeout(() => {
            const wrapper = shallowMount(Questionnaire);
            expect(wrapper.find('.title h2').text()).toBe('Questionnaire');
        });
    });
});
