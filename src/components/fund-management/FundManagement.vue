<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Fund Management</h2>
            </v-col>
        </v-row>
        <v-row v-if="Object.keys(parsedModelData).length">
            <v-col
                :sm="getCols(title)"
                :md="getCols(title)"
                :lg="getCols(title)"
                cols="12"
                v-for="(title, index) in Object.keys(parsedModelData)" :key="index">
                <strong class="sub-title">{{ titleMapping[title].title }}</strong>
                <div v-if="titleMapping[title].type === 'array'">
                    <div class="details"
                        v-for="(data, index) in parsedModelData[title]" :key="index">{{data}}
                    </div>
                </div>
                <div v-if="titleMapping[title].type === 'string'"
                    class="details">{{ parsedModelData[title] }}
                </div>
                <div v-if="titleMapping[title].type === 'object'">
                    <div
                        class="details"
                        v-for="(data, index) in Object.keys(parsedModelData[title])" :key="index">
                        <v-icon small class="details">{{ iconMpping[data] }}</v-icon>
                        <span v-if="data !== 'email'" class="details">
                            {{ parsedModelData[title][data] }}
                        </span>
                        <a v-else
                            :href="parsedModelData[title][data]"
                            target="_blank">Company Website
                        </a>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row
            class="text-center"
            v-else
        >
            <v-col>
                No data available
            </v-col>
        </v-row>
    </div>
</template>

<script>
import mapping from '@/components/fund-management/config/mapping.json';
import ComponentMixin from '../component-helper-mixin';

export default {
    mixins: [ComponentMixin],
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: Array,
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            titleMapping: mapping.titleMapping,
            iconMpping: mapping.iconMapping,
        };
    },
    computed: {
        parsedModelData() {
            if (this.modelData) {
                const parsedData = {};
                const data = this.modelData[0] || {};
                parsedData.companyName = data.ProviderCompany?.Name || '-';
                parsedData.fundLaunchDate = this.formatDate(data.InceptionDate) || '-';
                parsedData.headOffice = [
                    data.ProviderCompany?.AddressLine1,
                    data.ProviderCompany?.AddressLine2,
                    data.ProviderCompany?.City,
                    data.ProviderCompany?.Conuntry,
                    data.ProviderCompany?.PostalCode,
                ];
                parsedData.contact = {
                    phone: data.ProviderCompany?.Phone,
                    email: data.ProviderCompany?.Homepage,
                };
                parsedData.domicile = data.Domicile || '-';
                parsedData.ucits = data.FundAttributes?.UCITS ? 'Yes' : 'No';
                if (data.ManagerList?.length) {
                    parsedData.fundManager = `${data.ManagerList[0].GivenName} ${data.ManagerList[0].FamilyName}` || '-';
                    parsedData.managerStartDate = this.formatDate(data.ManagerList[0].StartDate) || '-';
                    parsedData.managerBiography = data.ManagerList[0].ManagerProvidedBiography || '-';
                }
                return parsedData;
            }
            return {};
        },
    },
    methods: {
        getCols(title) {
            return this.titleMapping[title].col || 3;
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;

.sub-title {
    color: mixin.$wal-color-grey !important;
    font-weight: mixin.$wal-font-weight-regular;
}

.details {
    color: mixin.$wal-color-black;
}

a {
    color: mixin.$wal-color-black !important;
    text-decoration: none;
}
</style>
