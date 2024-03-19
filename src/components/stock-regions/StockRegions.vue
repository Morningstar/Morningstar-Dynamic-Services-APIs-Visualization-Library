<template>
    <section class="stock-regions">
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2 class="pr-16">Stock Regions</h2>
                <div
                    class="toggle-btn-container mr-3">
                    <v-btn
                        icon
                        small
                        aria-label="Display Table"
                        :class="[{ 'toggle-btn-active': showTable }, 'rounded']"
                        @click="showTable = true"
                    >
                        <v-icon>mdi-table-large</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        small
                        aria-label="Display chart"
                        :class="[{ 'toggle-btn-active': !showTable }, 'rounded']"
                        @click="displayChart"
                    >
                        <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row class="stock-regions-container">
            <v-col lg="12" md="12" v-if="showTable">
                <v-tabs v-model="selectedTab"
                        show-arrows
                        color="#000000"
                        right
                >
                    <v-tab v-for="tab of tabs" :key="tab">
                        {{ stockRegionsMapping.nameMapping[tab] }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="selectedTab">
                    <v-tab-item
                        v-for="tab in tabs"
                        :key="tab">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead class="header">
                                    <tr>
                                        <th
                                            v-for="header in fieldDefinitions"
                                            :key="header.value"
                                            :class="header.value === 'name'
                                                ? 'text-left'
                                                : 'text-right'"
                                            scope="col">
                                                <span class="header__text">
                                                    {{ header.text }}
                                                </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="item in parsedModelData"
                                        :key="item.key"
                                    >
                                        <td class="text-left">
                                            <span
                                                v-if="item.color"
                                                :style="`background-color:${item.color}`"
                                                class="map__color mr-1"
                                            ></span>
                                            {{ stockRegionsMapping.nameMapping[item.name] }}
                                        </td>
                                        <td class="text-right">
                                            {{ item.portfolio }}
                                        </td>
                                        <td
                                            class="text-right"
                                        >
                                            {{ item.benchmark }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
            <v-col lg="12" md="12" v-else>
                <v-row>
                    <v-col lg="10" md="10">
                        <figure>
                            <stock-regions-map-svg
                                id="stockMapSVG"
                                @on-mouse-hover-tooltip="onMouseOverTooltip"
                                @on-mouse-out-tooltip="onMouseOutTooltip"
                            />
                            <figcaption>Stock region map</figcaption>
                        </figure>
                    </v-col>
                    <v-col lg="2" md="2">
                        <section class="legends-details"
                                 aria-hidden="true">
                            <table>
                                <caption>Stock regions legends data</caption>
                                <thead>
                                    <tr>
                                        <th colspan="2">
                                            <em>Weight(%)</em>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(weight, index) of weightBreakpoints"
                                        :key="weight"
                                    >
                                        <td>
                                             <span
                                                 :style=" {
                                                        'background-color': colors[index] }"
                                                 class="color-container"
                                             ></span>
                                        </td>
                                        <td>
                                            <span
                                                class="color-info"
                                            >{{ weightBreakpoints.length - 1 === index
                                                ? '≤' : '<' }}
                                                {{ weight }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="footnote">
                        *Values inside the legends tooltip
                            shows the portfolio weight % for the region.
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-if="showBreakdown">
            <v-btn plain @click="$emit('show-security-level-breakdown', {
                type: 'stock-regions',
                modelData: parsedBreakDownData,
                fields: stockRegionsMapping.breakdownFields.fields,
            })">
                View Details
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-row>
    </section>
</template>

<script>
import { get, lowerFirst } from 'lodash';
import stockRegionsMapping from '@/components/stock-regions/config/mapping.json';
import legendMapping from '@/components/stock-regions/config/legend-mapping.json';
import StockRegionsMapSvg from '@/components/stock-regions/component/stock-regions-map.vue';

export default {
    components: {
        StockRegionsMapSvg,
    },
    props: {
        /** Define the table columns. */
        fieldDefinitions: {
            type: Array,
            default: () => [
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
        /** Accepts the response object returned from API Data Access Library. */
        modelData: [Array, Object],
        /** Toggles security breakdown button. */
        showBreakdown: {
            type: Boolean,
            default: false,
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    watch: {
        modelData() {
            this.createStockRegionsDetailsMap();
            this.updateMap();
        },
    },
    data() {
        return {
            stockRegionsMapping,
            selectedTab: 0,
            tabs: ['americas', 'europe', 'asia'],
            colors: ['#a1c6e3', '#7eb0d8', '#5a9ace', '#3a84c0', '#2f6c9d'],
            weightBreakpoints: [11, 21, 51, 91, 100],
            stockMapSVG: {},
            stockRegionsDetailsMap: {},
            showTable: true,
        };
    },
    computed: {
        isDataAvailable() {
            return (this.modelData?.portfolio?.length || this.modelData?.benchmark?.length);
        },
        parsedModelData() {
            if (this.isDataAvailable) {
                const rawData = this.modelData;
                const portfolioValues = get(rawData, 'portfolio', []);
                const benchmarkValues = get(rawData, 'benchmark', []);
                const mapping = stockRegionsMapping.regions;
                const selectedTab = this.tabs[this.selectedTab];
                this.$emit('tab-change', { tabId: selectedTab });
                const stockRegionsModel = [];
                Object.keys(mapping).forEach((region) => {
                    const data = mapping[region];
                    const regionModel = {};
                    const mappedPortfolioData = portfolioValues.find(
                        (item) => data.name === item.Id,
                    ) || {};
                    const mappedBenchmarkData = benchmarkValues.find(
                        (item) => data.name === item.Id,
                    ) || {};
                    if (selectedTab === region || region === 'notClassified') {
                        regionModel.portfolio = mappedPortfolioData.Value?.toFixed(2) || '-';
                        regionModel.benchmark = mappedBenchmarkData.Value?.toFixed(2) || '-';
                        regionModel.name = lowerFirst(region);
                        if (region === 'notClassified') {
                            regionModel.color = 'null'; // only for alignment purpose
                        }
                        stockRegionsModel.push(regionModel);
                        if (mappedPortfolioData.ExposureItem?.length && selectedTab === region) {
                            mappedPortfolioData.ExposureItem.forEach((subRegion) => {
                                const regionData = {};
                                regionData.name = lowerFirst(
                                    data.subRegions[subRegion.Id]?.region || subRegion.Id,
                                );
                                regionData.portfolio = subRegion?.Value.toFixed(2) || '-';
                                const subRegionBenchmarkObj = mappedBenchmarkData
                                    .ExposureItem?.find(
                                        (item) => subRegion.Id === item.Id,
                                    ) || {};
                                regionData.benchmark = subRegionBenchmarkObj.Value?.toFixed(2) || '-';
                                regionData.color = this.getRegionIconColor(
                                    regionData.portfolio,
                                );
                                stockRegionsModel.push(regionData);
                            });
                        }
                    }
                });
                return stockRegionsModel;
            }
            return [];
        },
        parsedBreakDownData() {
            const { securityBreakdownData } = this.modelData.breakdownData;
            const securityBreakdown = [];
            const portfolioAnalyzed = [];
            if (securityBreakdownData) {
                securityBreakdownData.forEach((security) => {
                    const securityName = security?.Name;
                    const analyzedPercent = security.Analyzed.toFixed(2) * 1;
                    const notAnalyzedPercent = security.NotAnalyzed.toFixed(2) * 1;
                    const weight = security?.Weight;
                    securityBreakdown.push({
                        securityName,
                        ...this.getStockRegionsModel(security),
                        weight,
                    });
                    portfolioAnalyzed.push({
                        securityName,
                        analyzedPercent,
                        notAnalyzedPercent,
                        weight,
                    });
                });

                return {
                    ...this.modelData,
                    securityBreakdown,
                    portfolioAnalyzed,
                };
            }
            return {};
        },
    },
    mounted() {
        this.createStockRegionsDetailsMap();
        if (!this.showTable) {
            this.updateMap();
        }
    },
    methods: {
        rowClass(item) {
            if (this.tabs.includes(item.name)) {
                return 'highlight';
            }
            return '';
        },
        getRegionIconColor(weight) {
            const iconColors = this.colors;
            const { weightBreakpoints } = this;
            const weights = parseInt(weight, 10) || 0;
            for (let i = 0; i < weightBreakpoints.length; i += 1) {
                if (weights % weightBreakpoints[i] === weights) {
                    return iconColors[i];
                }
            }
            return iconColors[weightBreakpoints.length];
        },
        getStockRegionsModel(security) {
            const regions = security.Region;
            const regionsModel = {};
            regions.forEach((region) => {
                regionsModel[lowerFirst(region.Id)] = region.Value?.toFixed(2) || '-';
                if (region.ExposureItem) {
                    region.ExposureItem.forEach((subRegion) => {
                        regionsModel[lowerFirst(subRegion.Id)] = subRegion.Value?.toFixed(2) || '-';
                    });
                }
            });
            return regionsModel;
        },
        createStockRegionsDetailsMap() {
            const portfolioValues = get(this.modelData, 'portfolio', []);
            const mapping = stockRegionsMapping.regions;
            Object.keys(mapping).forEach((region) => {
                const data = mapping[region];
                const mappedPortfolioData = portfolioValues.find(
                    (item) => data.name === item.Id,
                ) || {};
                if (mappedPortfolioData.ExposureItem) {
                    mappedPortfolioData.ExposureItem.forEach((subRegion) => {
                        const name = lowerFirst(data.subRegions[subRegion.Id]?.region
                            || subRegion.Id);
                        const portfolio = subRegion?.Value?.toFixed(2);
                        this.stockRegionsDetailsMap[name] = {
                            portfolio,
                            color: this.getRegionIconColor(portfolio),
                            name: this.stockRegionsMapping.nameMapping[name],
                        };
                    });
                }
            });
        },
        updateMap() {
            this.stockMapSVG = document.getElementById('stockMapSVG');
            const childNode = this.stockMapSVG?.childNodes[0];
            const childElements = childNode?.children;

            if (!childElements) return;
            for (let i = 0, len = childElements.length; i < len; i += 1) {
                const region = childElements[i].classList[1];
                const currentRegionsMap = this.stockRegionsDetailsMap[region];
                const { coordinates, showRight } = legendMapping[region];
                const legendInfoText = currentRegionsMap
                    ? `${currentRegionsMap?.name} (${currentRegionsMap?.portfolio})`
                    : '';
                const groupElem = document.createElementNS('http://www.w3.org/2000/svg', 'g');

                childElements[i].setAttribute(
                    'fill',
                    `${this.stockRegionsDetailsMap[region]?.color}`,
                );
                groupElem.setAttribute(
                    'transform',
                    `translate(${coordinates[0]}, ${(coordinates[1])})`,
                );
                groupElem.classList.add('legend', `${region}_legend`);
                groupElem.innerHTML = this.generateLegendsTemplate(legendInfoText, showRight);
                childNode.appendChild(groupElem);
            }
        },
        generateLegendsTemplate(legendInfoText, showRight) {
            let width = 90;
            let x = -45;
            let y = -18;
            if (showRight) {
                width = 50;
                x = 0;
                y = 9;
            } else if (legendInfoText.length <= 18) {
                width = 60;
                x = -30;
            } else if (legendInfoText.length < 22) {
                width = 80;
                x = -40;
            }
            return `
                    <rect x="${x}" y="${y}" width="${width}" height="13" rx="2" ry="2"
                        stroke-linejoin="round"
                        class="region-info-container"></rect>
                    <text class="region-info" y="${showRight ? 18 : -9}">
                        <tspan x="${showRight ? 25 : 0}" text-anchor="middle">
                            ${legendInfoText}
                        </tspan>
                    </text>
                    <circle cx="0" cy="0" r="2.5" class="region-pointer"/>`;
        },
        onMouseOverTooltip(e) {
            const activeRegion = e.target.parentElement;
            const activeRegionLegend = this.stockMapSVG.querySelector(`.${activeRegion.classList[1]}_legend`);

            activeRegion.classList.add('highlight-region');
            if (activeRegionLegend) {
                activeRegionLegend.classList.add('active-legend');
            }
        },
        onMouseOutTooltip(e) {
            const activeRegion = e.target.parentElement;

            activeRegion.classList.remove('highlight-region');
            this.stockMapSVG?.childNodes[0].querySelectorAll('.legend')
                .forEach((region) => {
                    region.classList.remove('active-legend');
                });
        },
        displayChart() {
            if (this.showTable) {
                this.showTable = false;
                this.$nextTick(() => {
                    this.updateMap();
                });
            }
        },
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

.stock-regions {
    @include mixin.wal-component-title;
    @include mixin.wal-table;
    @include mixin.wal-highlight-table-cell;

    .stock-regions-container {
        .svg-wrapper {
            display: flex;
            justify-content: center;
        }
    }

    figure {
        width: 90%;

        figcaption {
            opacity: 0;
            line-height: 0;
        }
    }

    .map__color {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: middle;
    }

    .pointer-events {
        fill: none;
        pointer-events: visible;
    }

    .title {
        position: relative;
    }

    .toggle-btn {
        &-container {
            position: absolute;
            top: 0;
            right: 0;
        }

        &-active {
            &::before {
                opacity: 0.2;
            }
        }
    }

    .highlight-region {
        stroke: rgba(0, 0, 0, 0.4);
        stroke-width: 1;
        stroke-linejoin: round;
    }

    .region-info-container {
        fill: rgba(0, 0, 0, 0.4);
        filter: drop-shadow(4px 5px 3px rgb(0, 0, 0));
        stroke-width: 2px;
    }

    .region-info {
        fill: #fff;
        font-size: 0.45em;
    }

    .region-pointer {
        fill: mixin.$wal-color-orange;
        fill-opacity: 0.9;
        filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, .7));
    }

    .active-legend {
        .region-pointer {
            stroke: mixin.$wal-color-white;
            stroke-width: 1;
            filter: drop-shadow(4px 4px 1.5px rgba(0, 0, 0, .7));
        }

        .region-info {
            font-weight: mixin.$wal-font-weight-bold;
        }

        .region-info-container {
            fill: rgba(230, 115, 0, 0.6);
        }
    }

    .footnote {
        font-size: map.get(mixin.$wal, 'font-size', 's');
        padding-top: 0;
    }

    .legends-details {
        $container-size: map.get(mixin.$wal, 'space', '1-and-a-half-x');
        font-size: map.get(mixin.$wal, 'font-size', 'xs') !important;

        .color-container {
            width: $container-size;
            height: $container-size;
            display: block;
            margin: map.get(mixin.$wal, 'space', 'half-x') map.get(mixin.$wal, 'space', '1-x');
        }
        caption {
            position: absolute;
            clip: rect(1px, 1px, 1px, 1px);
        }
        .color-info, th em {
            font-size: map.get(mixin.$wal, 'font-size', 'xs');
        }
    }
}
</style>
