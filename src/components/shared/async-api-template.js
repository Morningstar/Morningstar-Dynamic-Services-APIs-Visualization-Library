import { action } from '@storybook/addon-actions';
import EsgRisk from '@/components/esg-risk/EsgRisk.vue';
import ProductInvolvement from '@/components/product-involvement/ProductInvolvement.vue';
import CarbonScore from '@/components/carbon-score/CarbonScore.vue';
import xrayHelper from '@/components/shared/portfolio-analysis-helper';
import helper from '@/stories/stories-helper';
import { cloneDeep } from 'lodash';
import {
    ApiIntervalValue,
    isApiTimedOut,
    resetApiIntervalValues,
    setApiTimeSinceStart,
} from '@/components/shared/async-api-utility';

const asyncSteps = {
    jobId: {
        title: 'Initiating Request',
        indeterminate: true,
        status: 'pending',
    },
    polling: {
        title: 'Polling Status',
        status: 'notStarted',
    },
    finalResponse: {
        title: 'Loading Preview',
        status: 'notStarted',
    },
};

export default function asyncApiTemplate(mockData, componentTitle = 'Esg Risk', transformRequired = false, apiName = 'sustainability') {
    return (args, { argTypes, loaded }) => {
        const response = {};
        /**
         *  When loaded.useAsyncApi true then storybook loads then Async API with custom loader
         *  otherwise use mock data
         */
        if (loaded?.useAsyncApi) {
            response.useMocks = false;
        } else {
            response.useMocks = true;
            response.modelData = args.modelData;
        }
        let self;
        return {
            props: Object.keys(argTypes),
            components: { EsgRisk, ProductInvolvement, CarbonScore },
            data() {
                return {
                    componentTitle,
                    isPooling: false,
                    asyncSteps: {},
                    showAsyncLoader: false,
                    asyncResponse: {},
                };
            },
            template: `
            <div class="wrapper">
                <div v-if="showAsyncLoader">
                    <v-overlay absolute="absolute" :dark="false">
                        <v-card
                            class="mx-auto"
                            max-width="400"
                            tile
                            loading
                        >
                            <v-list lines="1">
                            <v-card-title>Loading {{ componentTitle }}</v-card-title>
                            <v-list-item
                                v-for="(step, id) in asyncSteps"
                                :key="id"
                                active-class="highlight-step"
                                dense
                                :disabled="step.status === 'notStarted'"
                            >
                                    <v-list-item-content>
                                        <v-list-item-title v-text="step.title"></v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-progress-circular
                                            v-if="step.status === 'pending'"
                                            indeterminate
                                            color="primary"
                                            :size="20"
                                        ></v-progress-circular>
                                        <v-icon v-else-if="step.status === 'notStarted'"
                                                :size="20"
                                                :width="5"
                                                class="text-disabled">mdi-circle-outline</v-icon>
                                        <v-icon v-else
                                            color="success">mdi-check-all</v-icon>
                                    </v-list-item-action>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item>
                                <p class="caption">We are processing your request.</p>
                            </v-list-item>
                        </v-list>
                        </v-card>
                    </v-overlay>
                </div>
                <component
                    v-else
                    :is='getComponentId()'
                    :model-data='asyncResponse'
                    :show-header.prop='true'
                >
                </component>
            </div>`,
            beforeMount() {
                if (response.useMocks) {
                    this.asyncResponse = mockData;
                    action('Component loaded')('Static Data');
                } else {
                    this.showAsyncLoader = true;
                    this.asyncSteps = cloneDeep(asyncSteps);
                    (async () => {
                        const jobApiResponse = await this.getJobIdApiResponse();
                        response.jobId = jobApiResponse.jobId;
                        if (response.jobId) {
                            this.updateLoadingIconStatus();
                            this.getJobStatusApiResponse()
                                .then((resp) => {
                                    response.jobStatusResponse = resp;
                                    this.isPooling = !response.jobStatusResponse;
                                    this.manageJobApiPolling();
                                });
                        } else {
                            response.useMocks = true;
                            this.hideLoaderAndLoadComponent();
                        }
                    })();
                }
            },
            methods: {
                getComponentId() {
                    return componentTitle.replaceAll(' ', '');
                },
                async getJobIdApiResponse() {
                    return window.mstarApisSdk.portfolioAnalysis[`get${this.getComponentId()}Data`](
                        {
                            portfolios: helper.sampleLargePortfolio,
                            languageId: 'en-US',
                            headers: {
                                prefer: 'respond-async',
                            },
                        },
                    ).catch((error) => {
                        console.error(error);
                        response.useMocks = true;
                        this.hideLoaderAndLoadComponent();
                    });
                },
                getJobStatusApiResponse() {
                    this.doNextJobStatusCall = true;
                    return window.mstarApisSdk.common.getJobStatus({
                        jobId: response.jobId,
                    }).then((resp) => resp).catch((error) => {
                        console.error(error);
                        response.useMocks = true;
                    });
                },
                manageJobApiPolling() {
                    self = this;
                    (function pollingJobApi() {
                        self.setModelData();
                        setApiTimeSinceStart();
                        if (self.isPooling) {
                            self.getJobStatusApiResponse(response.jobId).then((resp) => {
                                response.jobStatusResponse = resp;
                                self.timeout = setTimeout(pollingJobApi, ApiIntervalValue);
                            }).catch((error) => {
                                console.error(error);
                                response.useMocks = true;
                            });
                        } else {
                            self.hideLoaderAndLoadComponent();
                        }
                    }());
                },
                updateLoadingIconStatus(completedStep = 'jobId') {
                    if (completedStep === 'jobId') {
                        this.asyncSteps.jobId.status = 'completed';
                        this.asyncSteps.polling.status = 'pending';
                    } else {
                        this.asyncSteps.polling.status = 'completed';
                        this.asyncSteps.finalResponse.status = 'pending';
                    }
                },
                setModelData() {
                    if (isApiTimedOut()
                        || response.useMocks
                        || response.jobStatusResponse?.statusCode === 404) {
                        this.isPooling = false;
                        response.useMocks = true;
                        this.hideLoaderAndLoadComponent();
                    } else this.isPooling = !response.jobStatusResponse?.[apiName];
                },
                hideLoaderAndLoadComponent() {
                    if (response.useMocks) {
                        this.asyncResponse = mockData;
                        action('Component loaded')('Static Data');
                    } else {
                        const [apiResponse] = response.jobStatusResponse[apiName];
                        this.asyncResponse = transformRequired
                            ? xrayHelper[`get${this.getComponentId()}Data`](apiResponse)
                            : apiResponse;
                        action('Component loaded')('API Data');
                    }
                    resetApiIntervalValues();
                    clearTimeout(this.timeout);
                    this.updateLoadingIconStatus('polling');
                    this.asyncSteps.finalResponse.status = 'completed';
                    this.$nextTick(() => {
                        this.showAsyncLoader = false;
                    });
                },
            },
        };
    };
}
