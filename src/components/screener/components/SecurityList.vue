<template>
    <div class="security-list">
        <!-- Fund Provider -->
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Security List</h2>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="parsedModelData"
            :items-per-page="itemsPerPage"
            :options="options"
            :footer-props="{
                'items-per-page-options': itemsPerPageOptions
            }"
            :must-sort="true"
            :server-items-length="totalPages"
            :loading="loader"
            :single-expand="true"
            sort-by="name"
            item-key="name"
            show-expand
            @update:options="updateOptions"
            @item-expanded="getSecurityReportData"
        >
        <template v-slot:[`item.starRatingM255`]="{ value }">
            <div v-if="value !== '-'" class="ratings">
                <div
                    v-for="rating in value"
                    :key="rating + value"
                    :title="`Morningstar Rating: ${value}`"
                    role="img"
                    class="ratings__star-rating"
                ></div>
            </div>
            <div v-else>{{ value }}</div>
        </template>
        <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">
                <v-lazy
                    v-model="securityDetailsData">
                    <v-skeleton-loader
                        v-if="showSecurityLoader"
                        v-bind="skeletonLoaderAttrs"
                        type="divider, image, divider, list-item-two-line, article"
                        ></v-skeleton-loader>
                    <SecurityReports
                        v-else
                        :show-header="false"
                        :model-data="securityDetailsData"
                        :components-options="securityReportsComponentsOptions"></SecurityReports>
                </v-lazy>
            </td>
        </template>
        </v-data-table>
    </div>
</template>
<script>
import SecurityReports from '@/components/security-report/SecurityReport.vue';

export default {
    name: 'SecurityList',
    components: { SecurityReports },
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: Object,
            default: () => ({}),
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
        /** Show List Columns based on filter definition passed to the Filter component. */
        filterDefinitions: {
            type: Object,
            default: () => ({}),
        },
        /** Show Loader to the data table when API call is done. */
        loader: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            headers: this.filterDefinitions.headers,
            totalPages: this.modelData.total || '',
            itemsPerPage: this.filterDefinitions.itemsPerPage,
            itemsPerPageOptions: this.filterDefinitions.itemsPerPageOptions,
            options: {},
            securityReportsComponentsOptions: {
                sections: [
                    {
                        components: [
                            'performanceGraph',
                            'annualPerformance',
                            'trailingReturns',
                        ],
                    },
                ],
            },
            securityDetailsData: {},
            showSecurityLoader: true,
            skeletonLoaderAttrs: {
                class: 'mt-6 mb-6',
            },
        };
    },
    computed: {
        parsedModelData() {
            const { modelData } = this;
            const { headers } = this.filterDefinitions;
            const listValues = headers.map((header) => header.value);

            this.setPages(modelData);

            return modelData.rows.map((data) => {
                const result = data;
                listValues.forEach((value) => {
                    if (!result[value] && result[value] !== 0) {
                        result[value] = '-';
                    } else if (typeof result[value] !== 'string' && value !== 'starRatingM255') {
                        result[value] = result[value].toFixed(2);
                    }
                });
                return result;
            });
        },
    },
    methods: {
        setPages(data) {
            this.totalPages = data.total;
            this.itemsPerPage = data.pageSize;
        },
        updateOptions(val) {
            const result = {
                sortOrder: (val.sortDesc && val.sortDesc[0]) ? 'desc' : 'asc',
                sortBy: val.sortBy ? val.sortBy[0] : '',
                page: val.page,
                itemsPerPage: val.itemsPerPage,
            };
            this.$emit('updated-options', result);
        },
        getSecurityReportData(data) {
            if (data.value) {
                this.securityDetailsData = {};
                this.showSecurityLoader = true;
                const secId = 'F0GBR050DD'; // ToDo: Actual secId API to fetch data from API will be done in ECCORECS-2766;
                this.$nextTick(() => {
                    this.toggleDisableAction();
                });
                Promise.resolve(
                    window
                        .mstarApisSdk
                        .securityDetails
                        .getSecurityDetails(secId),
                ).then((apiData) => {
                    this.securityDetailsData = apiData;
                    this.showSecurityLoader = false;
                    this.toggleDisableAction();
                }).catch((err) => {
                    console.error(err);
                    this.showSecurityLoader = false;
                    this.toggleDisableAction();
                });
            }
        },
        toggleDisableAction() {
            this.$el.querySelector('.v-data-table__expanded__row').classList.toggle('disable-action');
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.security-list {
    .ratings {
        @include mixin.wal-component-title;
        display: inline-flex;
        margin: map.get(mixin.$wal, "space", "1-and-a-quarter-x");

        &__star-rating {
            @include mixin.applyIcon("@/assets/star_rating.svg");
        }
    }
    .title {
        margin: map.get(mixin.$wal, "space", '1-and-a-quarter-x');
        &__text {
            font-size: map.get(mixin.$wal, space, '2-and-a-quarter-x');
            font-weight: 500;
        }
    }

    .v-data-table__expanded__row, .v-data-table__expanded__row:hover {
        background: mixin.$wal-color-light-blue !important;
        font-weight: mixin.$wal-font-weight-bold;
        color: mixin.$wal-color-white;
        button {
           color: mixin.$wal-color-white
        }
    }

    .disable-action td:first-child{
        cursor: progress;
        button {
            pointer-events: none;
        }
    }
}

</style>
