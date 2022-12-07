// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { mount } from '@vue/test-utils';
import sampleStockRegionsData from '@/components/stock-regions/config/sampleStockRegionsData.json';

// Component
import StockRegions from '@/components/stock-regions/StockRegions.vue';

Vue.use(Vuetify);

describe('StockRegions.vue', () => {
    let vuetify; // need for adding mocks
    let wrapper;

    beforeEach(() => {
        vuetify = new Vuetify();
        wrapper = mount(StockRegions, {
            vuetify,
            mocks: {
                $vuetify: { breakpoint: {} },
            },
            propsData: {
                modelData: sampleStockRegionsData,
                fieldDefinitions: [
                    {
                        text: 'Region',
                        value: 'name',
                        width: '50%',
                    },
                    {
                        text: 'Weight %',
                        value: 'portfolio',
                        align: 'end',
                    },
                    {
                        text: 'Benchmark %',
                        value: 'benchmark',
                        align: 'end',
                    },
                ],
            },
        });
    });

    it('should render Stock Regions', () => {
        expect(wrapper.find('.title h2').text()).toBe('Stock Regions');
    });
});
