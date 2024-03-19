<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Correlation Matrix</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-tabs
                    v-model="selectedTab"
                    background-color="transparent"
                    color="black"
                    show-arrows
                    right>
                    <v-tab
                        v-for="tab in tabs"
                        :key="tab"
                        @click="tabChanged(tab)">{{ tab }}
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div id="correlation-matrix"
                     ref="correlationMatrix">
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
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
    },
    data() {
        return {
            width: 800,
            margin: {
                top: 0,
                right: 80,
                bottom: 0,
                left: 320
            },
            colorSpectrum: ['#ef7622', '#fbddc8', '#1f55a5'],
            textColorDark: '#000',
            textColorLight: '#fff',
            backgroundColor: '#fff',
            offset: 15,
            showBubbleChart: true,
        };
    },
    computed: {
        blocksCount() {
            return Math.sqrt(this.correlationData.length);
        },
        svgHeight() {
            return this.svgWidth - this.margin.top - this.margin.bottom;
        },
        svgWidth() {
            return this.width - this.margin.left - this.margin.right;
        }
    },
    beforeMount() {
        this.height = this.width - this.margin.left - this.margin.right;
        this.tabs = Object.keys(this.modelData.correlationMatrix) || [];
        this.selectedTab = this.tabs[0] || "year3";
        this.correlationData = this.modelData.correlationMatrix[this.selectedTab] || {};
    },
    mounted() {
        const clientWidth = this.$refs.correlationMatrix.clientWidth;
        this.margin.top = clientWidth / this.offset;
        if (clientWidth < this.width) {
            this.offset = 14;
            this.width = clientWidth;
        }
        this.init();
    },
    methods: {
        init() {
            this.svg = d3.select(this.$refs.correlationMatrix)
            this.svgGrid = this.svg
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'correlation-matrix')
                .attr('ref', 'correlation-matrix')
                .append('g')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
            this.drawChart();
        },
        drawBubbleChart(domain, color) {
            const section = this.svgGrid.selectAll('.section');
            const maxLength = Math.sqrt(this.correlationData.length);
            const bbox = section.nodes()[0].getBBox();

            const circleHeight = bbox.x + bbox.width / 2;
            section.filter(d => {
                const yPosition = domain.indexOf(d.y.toString());
                const xPosition = domain.indexOf(d.x.toString());
                for (let i = (yPosition + 1); i < maxLength; i++) {
                    if (i === xPosition) return true;
                }
                return false;
            })
                .style('fill', this.backgroundColor)
                .append('circle')
                .attr('cx', circleHeight)
                .attr('cy', circleHeight)
                .attr('dominant-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .attr('r', d => (this.svgHeight / (maxLength * 2)) * (Math.abs(d.value)))
                .style('fill', d => d.value === 1 ? this.textColorDark : color(d.value));
        },
        drawChart() {
            const domain = d3.set(this.correlationData.map(d =>d.x.toString())).values();
            const color = d3.scaleLinear()
                .domain([-1, 0, 1])
                .range(this.colorSpectrum);

            this.drawCorrelogram(domain, color);
            if (this.showBubbleChart) {
                this.drawBubbleChart(domain, color)
            }
            this.drawLegends(color);
            this.drawXAxis(domain);
        },
        drawXAxis(domain) {
            const blocksWidth = this.svgWidth / this.blocksCount;
            const xAxisScale = d3.scalePoint()
                .range([0, this.svgWidth - blocksWidth])
                .domain(domain);

            // Append the x-axis to the SVG
            const xAxis = d3.axisTop(xAxisScale);
            const transform = `translate(${this.margin.left}, 0)`;

            const xAxisGroup = this.svg
                .select('svg')
                .append("g")
                .attr("class", "x-axis")
                .attr("transform", transform)
                .attr("width", this.svgWidth)
                .call(xAxis);
            xAxisGroup.selectAll(".tick text")
                .attr('x', 0)
                .attr('y', this.offset)
                .text((d, i) => i + 1)
                .attr('fill', this.textColorDark);

            xAxisGroup.select("path").attr("stroke", "none");
        },
        drawLegends(color) {
            const blocksLength = this.svgHeight / this.blocksCount;
            const scale = d3.scaleLinear()
                .range([-this.margin.top + this.offset / 2, this.svgHeight - blocksLength / 2])
                .domain([1, -1]);

            const axis = d3.axisRight()
                .scale(scale)
                .tickPadding(7);

            const y = this.margin.top;
            const colorSpectrum = this.svg
                .select('svg')
                .append('g')
                .attr('class', 'y-axis')
                .call(axis)
                .attr('transform', 'translate(' + (this.width - this.margin.right / 2) + ' ,' + y + ')');

            const iR = d3.range(-1, 1.01, 0.01);

            const height = this.svgHeight / iR.length + 1;
            iR.forEach(d => {
                colorSpectrum.append('rect')
                    .style('fill', color(d))
                    .style('stroke-width', 0)
                    .style('stoke', 'none')
                    .attr('height', height)
                    .attr('width', 10)
                    .attr('x', 0)
                    .attr('y', scale(d));
            });
        },
        drawYAxis(xSpace, ySpace) {
            // Draw legend bar
            const legend = this.svg
                .select('svg')
                .append("g")
                .attr('class', 'y-axis-labels')
                .attr('transform', 'translate(0, '+ySpace+')');
            const legendRectSize = this.blocksCount;
            const legendItems = legend.selectAll('.legend-item')
                .data(this.modelData.securities)
                .enter()
                .append('g')
                .attr('class', 'legend-item')
                .attr('transform', (d, i) => 'translate(0,' + (ySpace * i) + ')');

            legendItems.append('text')
                .attr('x', legendRectSize)
                .attr('y', legendRectSize)
                .attr('class', 'y-axis-label')
                .text((d, i) =>i + 1 + '. ' + d)
                .attr('fill', this.textColorDark);
        },
        drawCorrelogram(domain, color) {
            const num = Math.sqrt(this.correlationData.length);
            const xSpace = this.svgWidth / this.blocksCount;
            const ySpace = this.svgHeight / this.blocksCount;
            const x = d3.scalePoint()
                .range([0, this.svgWidth - xSpace])
                .domain(domain);
            const y = d3.scalePoint()
                .range([0, this.svgHeight - ySpace])
                .domain(domain);

            const section = this.svgGrid.selectAll('.section')
                .data(this.correlationData)
                .enter()
                .append('g')
                .attr('class', 'section')
                .attr('transform', d => 'translate(' + x(d.x) + ',' + y(d.y) + ')');

            section.append('rect')
                .attr('width', xSpace)
                .attr('height', ySpace)
                .attr('x', -xSpace/2)
                .attr('y', -ySpace/2)
                .attr('fill', this.backgroundColor);

            section.filter((d) => {
                const yPosition = domain.indexOf(d.y.toString());
                const xPosition = domain.indexOf(d.x.toString());
                for (let i = (yPosition + 1); i < num; i++) {
                    if (i === xPosition) return false;
                }
                return true;
            })
                .append('text')
                .attr('alignment-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .text(d => d.value.toFixed(2))
                .style('fill', d => d.value > 0.5 ? this.textColorLight : this.textColorDark);

            section.select('rect')
                .style('fill', d => {
                    const yPosition = domain.indexOf(d.y.toString());
                    const xPosition = domain.indexOf(d.x.toString());
                    for (let i = (yPosition + 1); i < num; i++) {
                        if (i === xPosition) return false;
                    }
                    return color(d.value);
                });
            this.drawYAxis(xSpace, ySpace);
        },
        tabChanged(tab) {
            this.$refs.correlationMatrix.innerHTML = '';
            this.selectedTab = tab;
            this.correlationData = this.modelData.correlationMatrix[tab];
            this.init();
            this.drawChart();
        }
    },
};
</script>
<style lang="scss">
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;
#correlation-matrix {
    overflow-x: auto;

    svg {
        float: right;
        font-size: map.get(mixin.$wal, 'font-size', 's');
        text-anchor: middle;
    }

    rect {
        stroke: lightgray;
        stoke-width: 1px;
        fill: none;
    }

    .tick {
        font-size: map.get(mixin.$wal, 'font-size', 's');
    }

    .section text {
        font-weight: mixin.$wal-font-weight-regular;
    }

    .y-axis-label {
        text-anchor: start;
        font-weight: mixin.$wal-font-weight-regular;
    }
}
</style>
