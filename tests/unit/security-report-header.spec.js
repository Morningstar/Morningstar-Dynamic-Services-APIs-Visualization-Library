// Import
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import { mount } from '@vue/test-utils';
import helper from '@/stories/stories-helper';

// Component
import SecurityReportHeader from '@/components/security-report-header/SecurityReportHeader.vue';

Vue.use(Vuetify);

describe('SecurityReportHeader.vue', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(SecurityReportHeader, {
            propsData: {
                modelData: helper.sampleSecurityDetails,
                fieldDefinitions: [
                    {
                        fieldName: 'id',
                        modelPath: 'Id',
                    },
                    {
                        fieldName: 'isin',
                        modelPath: 'Isin',
                    },
                    {
                        fieldName: 'currency',
                        modelPath: 'Currency.Id',
                    },
                    {
                        fieldName: 'exchange',
                        modelPath: 'Exchange',
                    },
                    {
                        fieldName: 'legalStructure',
                        modelPath: 'LegalStructure',
                    },
                    {
                        fieldName: 'fundBenchmark',
                        modelPath: 'FundBenchmark.0.Name',
                    },
                ],
            },
        });
    });

    it('should render Security Report Header', () => {
        expect(wrapper.find('.title h2').text()).toBe('Security Report Header');
    });
});
