import d3 from 'd3';

export default {
    arcColorFn(value, ticks) {
        let ret;
        ticks.forEach((tick) => {
            if (value > tick.tick) {
                ret = tick.color;
            }
        });
        return ret;
    },
    beforeDestroyCleanUp() {
        const element = this.chart.querySelector('svg');
        if (element) {
            Object.keys(this.legendsData).forEach((index) => {
                d3.select(`#${this.chartId}-marker-hover-area-${index}`)
                    .on('mouseover', null)
                    .on('mouseout', null);
            });
            this.chart.removeChild(element);
        }
    },
    createOffScaleArc(elementId) {
        const { offScaleMarkerWidth } = this.chartSettings;
        d3.select(elementId)
            .append('g')
            .attr('transform', this.chartSettings.transformValue)
            .append('path')
            .style('stroke', this.chartSettings.offScaleColor)
            .style('stroke-width', offScaleMarkerWidth)
            .attr('id', 'over-scale')
            .attr('d', this.createArcOnGauge(this.chartSettings.maxValue, 0, -offScaleMarkerWidth / 2));
    },
    createPatchToHideRoundedCorner(elementId, strokeColor) {
        const strokeWidth = 6;

        d3.select(elementId)
            .insert('g', '#arrow')
            .attr('transform', this.chartSettings.transformValue)
            .append('path')
            .style('stroke', strokeColor)
            .style('stroke-width', strokeWidth)
            .attr('d', this.createArcOnGauge(0, 0, strokeWidth / 2));
    },
    createArcOnGauge(positionInValue, widthInPixel = 0, offsetInPixel = 0) {
        let arc;

        const {
            maxValue, minValue, gaugeStartAngle, gaugeEndAngle,
        } = this.chartSettings;
        const gaugeTotalAngle = gaugeEndAngle - gaugeStartAngle;
        const arcLength = this.degreeToRadian(gaugeTotalAngle)
        * (this.innerRadius + (this.outerRadius - this.innerRadius) / 2);

        const widthInPercentage = (widthInPixel / arcLength) * 100;
        const halfWidth = widthInPercentage / 2;

        const offsetInPercentage = (offsetInPixel / arcLength) * 100;

        const positionInPercentage = (100 * positionInValue) / (maxValue - minValue);
        const startPosition = positionInPercentage + offsetInPercentage - halfWidth;
        const startAngleCalc = gaugeStartAngle + ((startPosition * gaugeTotalAngle) / 100);
        const startAngle = this.degreeToRadian(startAngleCalc);

        if (widthInPercentage) {
            const endPosition = positionInPercentage + halfWidth;
            const endAngleCalc = gaugeStartAngle + ((endPosition * gaugeTotalAngle) / 100);
            const endAngle = this.degreeToRadian(endAngleCalc);
            arc = this.drawArc(this.chartSettings.innerRadius, this.chartSettings.outerRadius, '', startAngle, endAngle);
        } else { // Draw line if width is zero
            arc = this.drawLineOnGauge(startAngle);
        }
        return arc;
    },
    createBenchmarksPoints(riskScore, elementId) {
        const benchmarkRange = this.getBenchmarkRange(riskScore);
        const markerValues = Object.values(this.legendsData);

        if (this.selectedTarget) {
            d3
                .select(`#${elementId}`)
                .append('defs')
                .append('marker')
                .attr({
                    id: 'selectedTarget',
                    viewBox: [0, 0, 20, 20],
                    markerWidth: 9,
                    markerHeight: 9,
                    orient: 'auto',
                    refX: 27,
                    refY: 9,
                })
                .append('circle')
                .attr({
                    cx: 9,
                    cy: 9,
                    r: 8,
                    fill: 'white',
                    'stroke-width': 2,
                    stroke: 'black',
                });
        }

        const ticksGroup = d3
            .select(`#${elementId}`)
            .append('g')
            .attr('class', 'ticks-group')
            .attr(
                'transform',
                `translate(${this.chartSettings.size / 2}, ${this.chartSettings.size / 2})`,
            );

        const showHideLabels = (selector, show) => {
            ticksGroup.selectAll(selector)
                .transition()
                .style('opacity', show ? 1 : 0)
                .duration(this.chartSettings.transitionMs[show ? 'markerTextAppearsIn' : 'markerTextDisappearsIn']);
        };

        markerValues.forEach((marker, index) => {
            const tickLabelText = marker.abbrName;
            const tickGroup = ticksGroup
                .append('g')
                .attr('class', 'tick-group');
            const isMarkerInRange = [benchmarkRange.lowestBenchmark?.name,
                benchmarkRange.highestBenchmark?.name].indexOf(marker.name) > -1;

            // Add visible ticks on the gauge
            const benchmarkTick = tickGroup
                .append('path')
                .attr('class', 'tick')
                .attr('d', this.createArcOnGauge(marker.value))
                .style('stroke', this.chartSettings.markerColor)
                .style('stroke-width', 1);

            if (marker.name === this.selectedTarget) {
                benchmarkTick.attr('marker-end', 'url(#selectedTarget)');
                tickGroup.attr('class', 'tick-group selected-target');
            }

            // Add bigger arcs for text
            tickGroup
                .append('path')
                .attr('class', 'tick-label-ref-path')
                .attr('id', `${elementId}-tick-label-ref-path-${index}`)
                .attr('d', this.createArcOnGauge(marker.value, tickLabelText.length * this.chartSettings.markerTextLetterWidth))
                .attr('fill', 'none');

            if (riskScore !== null) {
                // Add labels for each tick
                tickGroup
                    .append('text')
                    .attr('id', `${elementId}-tick-label-${index}`)
                    .attr('class', `marker-text-value ${isMarkerInRange ? 'marker-text-value--in-range' : ''}`)
                    .attr('dy', -5) // Move the text down
                    .attr('text-anchor', 'middle')
                    .append('textPath')
                    .attr('xlink:href', `#${elementId}-tick-label-ref-path-${index}`)
                    .attr('startOffset', `${(tickLabelText.length + 9) * 1.25}%`) // (n + 9) * 1.25 - An approx pattern observed while trying to center align text
                    .text(tickLabelText);

                // Add invisible hover area
                const hoverArea = tickGroup
                    .append('path')
                    .attr('id', () => `${elementId}-marker-hover-area-${index}`)
                    .attr('class', 'tick-hover-area')
                    .attr('d', this.createArcOnGauge(marker.value, this.chartSettings.benchmarkHoverArcWidth))
                    .attr('fill', 'transparent');

                if (this.chartSettings.enableHoverAnimation) {
                    hoverArea.on('mouseover', () => {
                        tickGroup.attr('class', 'tick-group tick-group--hovered');
                        if (!isMarkerInRange) {
                            showHideLabels(`#${elementId}-tick-label-${index}`, true);
                        }
                    })
                        .on('mouseout', () => {
                            tickGroup.attr('class', 'tick-group');
                            if (!isMarkerInRange) {
                                showHideLabels(`#${elementId}-tick-label-${index}`, false);
                            }
                        });
                }
            }
        });
        setTimeout(() => {
            showHideLabels('.marker-text-value--in-range', true);
        }, this.chartSettings.transitionMs.markerText);
    },
    createSvg(fillColor, arc) {
        return d3
            .select(`#${this.chartId}`)
            .append('g')
            .attr('transform', this.chartSettings.transformValue)
            .append('path')
            .style('fill', fillColor)
            .attr('d', arc);
    },
    createComfortSvg(fillColor, arc, d) {
        return d3
            .select(`#${this.chartId}`)
            .append('g')
            .attr('transform', this.chartSettings.transformValue)
            .append('path')
            .style('fill', fillColor)
            .style('opacity', this.chartSettings.gaugeAnimation.enableComfortFadeIn ? 0 : 1)
            .transition()
            .duration(d.duration)
            .style('opacity', 1)
            .delay(this.chartSettings.transitionMs.comfortAnimationDelay)
            .ease(this.chartSettings.gaugeAnimation.comfortEase)
            .attrTween('d', () => {
                const interpolate = d3.interpolate(d.endAngle, d.newAngle);
                return (t) => {
                    const duration = d;
                    duration.endAngle = interpolate(t);
                    return arc(duration);
                };
            });
    },
    counter(id, elem, start, end, duration) {
        if (end === null || end <= 0) return;
        let timer = null;
        clearInterval(timer);

        const obj = elem.querySelector(`.${id}`);
        if (!obj) return;
        let current = start;
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const step = Math.abs(Math.floor(duration / range));
        const isScoreMoreThanThreeDigits = end > 999;

        timer = setInterval(() => {
            current += increment;
            if (isScoreMoreThanThreeDigits && current > 999) {
                current = end;
            }
            obj.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, step);
    },
    createArrow(value, fillColor, comfortColors) {
        const {
            maxValue, minValue, gaugeEndAngle, gaugeStartAngle,
        } = this.chartSettings;
        const gaugeTotalAngle = gaugeEndAngle - gaugeStartAngle;
        let arrowEaseAnimation = this.chartSettings.gaugeAnimation.arrowEaseNormal;
        // In ideal condition for bounce animation, t is 0.38s when it first reaches the max value.
        const bounceEffectDelta = 0.38;
        let arcAnimationDuration = parseInt(this.chartSettings.transitionMs.default, 10);
        let triangleEndAngle;
        if (value >= maxValue) {
            triangleEndAngle = maxValue * (gaugeTotalAngle / maxValue);
            arrowEaseAnimation = this.chartSettings.gaugeAnimation.arrowEaseOutOfRange;
            arcAnimationDuration /= bounceEffectDelta;
        } else if (value <= minValue) {
            triangleEndAngle = minValue;
        } else {
            triangleEndAngle = value * (gaugeTotalAngle / maxValue);
        }
        return d3.select(`#${this.chartId}`).append('g').attr('transform', this.chartSettings.transformValue).attr('id', 'arrow')
            .append('polygon')
            .attr({
                points: this.chartSettings.arrowPoints,
                fill: fillColor,
                transform: 'rotate(0)',
            })
            .transition('rotate')
            .duration(arcAnimationDuration)
            .ease(arrowEaseAnimation)
            .styleTween('fill', () => d3.interpolate(fillColor, comfortColors))
            .attrTween('transform', () => d3.interpolateString('rotate(0)', `rotate(${triangleEndAngle})`));
    },
    degreeToRadian(deg) {
        return (deg * Math.PI) / 180;
    },
    drawArc(innerRadius, outerRadius, cornerRadius, startAngle, endAngle) {
        return this.drawComfortArc(innerRadius, outerRadius, cornerRadius, startAngle)
            .endAngle(endAngle);
    },
    drawComfortArc(innerRadius, outerRadius, cornerRadius, startAngle) {
        // endAngle will not be present here, endAngle will be calculated
        // while tweening in method createComfortSvg
        return d3.svg
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius)
            .startAngle(startAngle);
    },
    drawText(text, transformValue, className) {
        return d3.select(`#${this.chartId}`)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', transformValue)
            .attr('class', className)
            .text(text);
    },
    drawChart(data) {
        let patchColor = this.chartSettings.modColors.baseColor;
        const { riskScore } = data;
        const { comfortRanges } = data;
        const hideRoundedCorner = Object.keys(this.legendsData)
            .find((item) => this.legendsData[item].value === 0);
        const baseArc = this.drawArc(
            this.innerRadius,
            this.outerRadius,
            this.outerRadius - this.innerRadius,
            this.degreeToRadian(this.chartSettings.gaugeStartAngle),
            this.degreeToRadian(this.chartSettings.gaugeEndAngle),
        );
        const innerCircleArc = this.drawArc(this.innerCircleOuterRadius, this.innerCircleRadius, '', -Math.PI, Math.PI);

        const svgElement = d3.select(this.chart)
            .append('svg')
            .attr('id', this.chartId)
            .attr('width', this.chartSettings.size)
            .attr('height', this.chartSettings.size)
            .append('g')
            .attr('transform', this.chartSettings.transformValue)
            .append('path')
            .datum({
                endAngle: Math.PI / 2,
            })
            .attr('d', baseArc);

        if (riskScore === null) {
            svgElement.style('fill', this.chartSettings.modColors.baseColor);
        } else {
            const riskScoreText = this.drawText(riskScore, this.transValue(0, 12), 'gauge-chart-value');
            const elementId = `#${this.chartId}`;
            if (comfortRanges === null) {
                // rendering default chart
                const defaultColors = this.arcColorFn(
                    riskScore,
                    this.chartSettings.defaultTicksConfig,
                );
                svgElement.style('fill', 'none');
                this.gradient(baseArc, `${this.chartId}-svgGradient`);
                this.createArrow(riskScore, this.chartSettings.baseColor, defaultColors);
                this.innerDial(innerCircleArc, defaultColors);
                patchColor = this.colorMixer(this.chartSettings.defaultModColors);
            } else {
                // rendering Comfort chart
                const comfortColors = this.arcColorFn(
                    riskScore,
                    this.chartSettings.comfortTicksConfig || [],
                );
                const interpolateColor = comfortColors === this.chartSettings.modColors.comfort
                    ? comfortColors : this.chartSettings.baseColor;
                svgElement.style('fill', this.chartSettings.modColors.baseColor);
                this.createArrow(riskScore, this.chartSettings.baseColor, comfortColors);
                this.innerDial(innerCircleArc, comfortColors);
                riskScoreText.transition('fill').duration(this.chartSettings.transitionMs.default)
                    .styleTween('fill', () => d3.interpolate(
                        this.chartSettings.baseColor,
                        interpolateColor,
                    ));
                // Comfort arc
                if (comfortRanges) {
                    this.drawComfortArcs(comfortRanges);
                }
            }

            // off-scale bar
            setTimeout(() => {
                if (riskScore > this.chartSettings.maxValue) {
                    this.createOffScaleArc(elementId);
                }
            }, (this.chartSettings.transitionMs.default));
            this.counter('gauge-chart-value', this.chart, 0, riskScore, this.chartSettings.transitionMs.default);
        }

        if (hideRoundedCorner) {
            this.createPatchToHideRoundedCorner(`#${this.chartId}`, patchColor);
        }

        // benchmark points of gauge chart
        this.createBenchmarksPoints(riskScore, this.chartId);
        this.scaleLabels(); // scale labels text
    },
    drawComfortArcs(comfortRanges) {
        const comfortRegionTransitionMs = this.chartSettings.transitionMs.comfortArc;
        const nearComfortRegionTransitionMs = this.chartSettings.transitionMs.comfortArc;
        // correction value which makes sure there is no gap between the two adjacent arcs.
        const arcCorrectionValue = 0.05;
        const startAngleValue = (comfortRanges.start + comfortRanges.end) / 2;
        const modNearComfortArcStart = this.drawComfortArc(
            this.innerRadius,
            this.outerRadius,
            '',
            this.getAngle(startAngleValue),
        );
        const modNearComfortArcEnd = this.drawComfortArc(
            this.innerRadius,
            this.outerRadius,
            '',
            this.getAngle(startAngleValue),
        );
        const modComfortArcStart = this.drawComfortArc(
            this.innerRadius,
            this.outerRadius,
            '',
            this.getAngle(startAngleValue + arcCorrectionValue),
        );
        const modComfortArcEnd = this.drawComfortArc(
            this.innerRadius,
            this.outerRadius,
            '',
            this.getAngle(startAngleValue - arcCorrectionValue),
        );
        // Added check if near comfort end value is exceeding the maxValue,
        // if yes, consider near comfort end value as maxValue.
        let modNearComfortArcEndNewAngle = comfortRanges.comfortEnd;
        if (modNearComfortArcEndNewAngle > this.chartSettings.maxValue) {
            modNearComfortArcEndNewAngle = this.chartSettings.maxValue;
        }
        // Added check if near comfort start value is subceeding the minValue,
        // if yes, consider near comfort start value as minValue.
        let modNearComfortArcStartNewAngle = comfortRanges.comfortStart;
        if (modNearComfortArcStartNewAngle < this.chartSettings.minValue) {
            modNearComfortArcStartNewAngle = this.chartSettings.minValue;
        }
        this.createComfortSvg(this.chartSettings.modColors.nearComfort, modNearComfortArcStart, {
            newAngle: this.getAngle(modNearComfortArcStartNewAngle),
            endAngle: this.getAngle(startAngleValue),
            duration: nearComfortRegionTransitionMs,
        });
        this.createComfortSvg(this.chartSettings.modColors.nearComfort, modNearComfortArcEnd, {
            newAngle: this.getAngle(modNearComfortArcEndNewAngle),
            endAngle: this.getAngle(startAngleValue),
            duration: nearComfortRegionTransitionMs,
        });
        this.createComfortSvg(this.chartSettings.modColors.comfort, modComfortArcStart, {
            newAngle: this.getAngle(comfortRanges.start),
            endAngle: this.getAngle(startAngleValue),
            duration: comfortRegionTransitionMs,
        });
        this.createComfortSvg(this.chartSettings.modColors.comfort, modComfortArcEnd, {
            newAngle: this.getAngle(comfortRanges.end),
            endAngle: this.getAngle(startAngleValue),
            duration: comfortRegionTransitionMs,
        });
    },
    drawLineOnGauge(atAngle) {
        // Using parametric equation of circle with center (a,b)
        //      x = a + cos(t)
        //      y = b + sin(t)
        //  where a, b are 0 in our case
        // and SVG graphs are PI/2 ahead so subtracting same from angle

        return d3.svg.line()([
            [
                this.chartSettings.innerRadius * Math.cos(atAngle - Math.PI / 2),
                this.chartSettings.innerRadius * Math.sin(atAngle - Math.PI / 2),
            ],
            [
                this.chartSettings.outerRadius * Math.cos(atAngle - Math.PI / 2),
                this.chartSettings.outerRadius * Math.sin(atAngle - Math.PI / 2),
            ],
        ]);
    },
    getAngle(value) {
        const { gaugeStartAngle } = this.chartSettings;
        const { gaugeEndAngle } = this.chartSettings;
        const { maxValue } = this.chartSettings;
        const radian = gaugeStartAngle + (value * (gaugeEndAngle - gaugeStartAngle)) / maxValue;

        return this.degreeToRadian(radian);
    },
    gradient(arc, gradientId) {
        const defs = d3.select(`#${this.chartId}`).append('defs');
        const gradient = defs.append('linearGradient').attr('id', gradientId);
        const defaultColors = this.chartSettings.defaultModColors;

        Object.keys(defaultColors).forEach((key) => {
            gradient
                .append('stop')
                .attr('class', `gradient-${key}`)
                .attr('offset', `${key}%`)
                .attr('stop-color', defaultColors[key]);
        });

        d3.select(`#${this.chartId}`).append('path')
            .attr('d', arc)
            .attr('transform', this.chartSettings.transformValue)
            .attr('fill', `url(#${gradientId})`);
    },
    initChart(parentElem, chartSettings, chartId, comfortRanges) {
        this.el = parentElem;
        this.chartId = `risk-score-${parentElem.gaugeType}-${chartId}`;
        this.chartSettings = chartSettings;
        this.legendsData = parentElem.computedLegendsData;
        this.chart = parentElem.$refs.chart;
        this.selectedTarget = parentElem.selectedTarget;
        this.outerRadius = this.chartSettings.outerRadius;
        this.innerRadius = this.chartSettings.innerRadius;
        this.innerCircleOuterRadius = this.chartSettings.innerCircleOuterRadius;
        this.innerCircleRadius = this.innerCircleOuterRadius - 1;
        if (comfortRanges) {
            this.chartSettings.comfortTicksConfig = [
                {
                    tick: this.chartSettings.minValue - 1,
                    color: this.chartSettings.offScaleColor,
                },
                {
                    tick: comfortRanges.comfortStart - 1,
                    color: this.chartSettings.baseColor,
                },
                {
                    tick: comfortRanges.start - 1,
                    color: this.chartSettings.modColors.comfort,
                },
                {
                    tick: comfortRanges.end,
                    color: this.chartSettings.baseColor,
                },
                {
                    tick: comfortRanges.comfortEnd,
                    color: this.chartSettings.offScaleColor,
                },
                {
                    tick: this.chartSettings.maxValue,
                    color: this.chartSettings.offScaleColor,
                },
            ];
        }
        this.chartSettings.defaultTicksConfig = [
            {
                tick: this.chartSettings.minValue,
                color: this.chartSettings.baseColor,
            },
            {
                tick: this.chartSettings.maxValue,
                color: this.chartSettings.offScaleColor,
            },
        ];
        this.chartSettings.transformValue = `translate(${this.chartSettings.size / 2},${this.chartSettings.size / 2})`;
    },
    innerDial(innerArc, colors) {
        const innerCircle = this.createSvg(this.chartSettings.baseColor, innerArc);
        innerCircle.transition('fill')
            .duration(this.chartSettings.transitionMs.default)
            .styleTween('fill', () => d3.interpolate(this.chartSettings.baseColor, colors));
    },
    getBenchmarkRange(score) {
        // Returns the range of labels with respect to risk score value
        const bMarkObj = {};
        const legends = this.legendsData;
        const legendNames = Object.keys(this.legendsData);
        let hasRangeFound = false;

        for (let i = 0; i <= legendNames.length - 1 && !hasRangeFound; i += 1) {
            const currentLegend = legendNames[i];
            const nextLegend = legendNames[i + 1];
            const lastLegend = legendNames[legendNames.length - 1];

            switch (true) {
            case score === legends[currentLegend].value || score < legends[currentLegend].value:
                bMarkObj.lowestBenchmark = legends[currentLegend];
                hasRangeFound = true;
                break;
            case score > legends[lastLegend].value:
                bMarkObj.lowestBenchmark = legends[lastLegend];
                hasRangeFound = true;
                break;
            case score === legends[nextLegend].value:
                bMarkObj.lowestBenchmark = legends[nextLegend];
                hasRangeFound = true;
                break;
            case score > legends[currentLegend].value && score < legends[nextLegend].value:
                bMarkObj.lowestBenchmark = legends[currentLegend];
                bMarkObj.highestBenchmark = legends[nextLegend];
                hasRangeFound = true;
                break;
            default:
                break;
            }
        }

        return bMarkObj;
    },
    scaleLabels() {
        this.drawText(this.chartSettings.maxValue, this.transValue(30, 54), 'gauge-chart-max-value');
        this.drawText(this.chartSettings.minValue, this.transValue(-33, 54), 'gauge-chart-min-value');
    },
    transValue(X, Y) {
        return `translate(${(this.chartSettings.size / 2) + X}, ${(this.chartSettings.size / 2) + Y})`;
    },
    update(data) {
        this.beforeDestroyCleanUp();
        this.drawChart(data);
    },
    colorMixer(colorsObj, weight = 0.15) {
        // This function is generating color for the patch, which is use to
        // hide rounded corner at 0.
        // - weight is between 0-1

        let fromColor;
        let toColor;

        [fromColor, toColor] = Object.values(colorsObj);

        const hexToRGB = (h) => {
            let r = 0;
            let g = 0;
            let b = 0;

            // 3 digits
            if (h.length === 4) {
                r = `0x${h[1]}${h[1]}`;
                g = `0x${h[2]}${h[2]}`;
                b = `0x${h[3]}${h[3]}`;

            // 6 digits
            } else if (h.length === 7) {
                r = `0x${h[1]}${h[2]}`;
                g = `0x${h[3]}${h[4]}`;
                b = `0x${h[5]}${h[6]}`;
            }

            return [+r, +g, +b];
        };

        toColor = hexToRGB(toColor);
        fromColor = hexToRGB(fromColor);

        const p = weight;
        const w = p * 2 - 1;
        const w1 = (w / 1 + 1) / 2;
        const w2 = 1 - w1;

        const rgb = `rgb(${
            Math.round(toColor[0] * w1 + fromColor[0] * w2)
        },${
            Math.round(toColor[1] * w1 + fromColor[1] * w2)
        },${
            Math.round(toColor[2] * w1 + fromColor[2] * w2)
        })`;

        return rgb;
    },
};
