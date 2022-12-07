// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { shallowMount } from '@vue/test-utils';

// Component
import ProductInvolvement from '@/components/product-involvement/ProductInvolvement.vue';

Vue.use(Vuetify);

describe('ProductInvolvement.vue', () => {
    it('should render Product Involvement', () => {
        const wrapper = shallowMount(ProductInvolvement);
        expect(wrapper.find('.title h2').text()).toBe('Product Involvement');
    });
});
