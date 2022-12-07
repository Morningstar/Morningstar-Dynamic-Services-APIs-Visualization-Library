<template>
    <div>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Portfolio SRRI</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div class=" px-3">
                    <div class="portfolio-srri__labels top">
                        <span>LOWER RISK</span>
                        <span>HIGHER RISK</span>
                    </div>
                    <table class="portfolio-srri__scale">
                        <tbody>
                            <tr>
                                <td
                                    v-for="item in 7"
                                    :key="item"
                                    class="portfolio-srri__scale-value-holder text-center"
                                >
                                    <div
                                        :class="['portfolio-srri__scale-value', 'ma-auto', {
                                            'portfolio-srri__scale-value--rank-given':
                                                parsedModelData.srriRank == item,
                                        }]">
                                        <span
                                            v-if="parsedModelData.srriRank == item"
                                            class="portfolio-srri__screen-reader">
                                            Portfolio SRRI Rank
                                        </span>
                                        <span class="portfolio-srri__scale-value-text">
                                            {{ item }}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="portfolio-srri__line">
                        <i class="arrow left"></i>
                        <i class="arrow right"></i>
                    </div>
                    <div class="portfolio-srri__labels bottom">
                        <span>Potential lower returns</span>
                        <span>Potential higher returns</span>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { get } from 'lodash';

export default {
    props: {
        /** Accepts the response object returned from API Data Access Library. */
        modelData: {
            type: Object,
        },
        /** Show or hide component title. */
        showHeader: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        parsedModelData() {
            const srriRank = get(this.modelData, 'sRRI[0].value');
            return {
                srriRank,
            };
        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;
$srri-bg-color: #969BBB;
$srri-bg-active-color: #686f9d;

.portfolio-srri {
    @include mixin.wal-component-title;

    &__labels {
        display: flex;

        span:first-child {
            flex: 1;
        }
        span:last-child {
            text-align: end;
        }

        &.top {
            padding-bottom: map.get(mixin.$wal, 'space', 'three-quarter-x');
            font-weight: mixin.$wal-font-weight-bold;
        }

        &.bottom {
            padding-top: map.get(mixin.$wal, 'space', 'three-quarter-x');
        }
    }

    &__scale {
        width: 100%;
        border-spacing: 1px;

        td {
            &:first-child .portfolio-srri__scale-value {
                border-top-left-radius: map.get(mixin.$wal, 'space', 'three-quarter-x');
                border-bottom-left-radius: map.get(mixin.$wal, 'space', 'three-quarter-x');
            }
            &:last-child .portfolio-srri__scale-value {
                border-top-right-radius: map.get(mixin.$wal, 'space', 'three-quarter-x');
                border-bottom-right-radius: map.get(mixin.$wal, 'space', 'three-quarter-x');
            }
        }

        &-value {
            background-color: $srri-bg-color;
            transition: box-shadow .3s;
            padding: map.get(mixin.$wal, 'space', '1-and-a-quarter-x');
            position: relative;

            &--rank-given {
                background-color: $srri-bg-active-color;
                font-weight: mixin.$wal-font-weight-bold;
                color: mixin.$wal-color-white;
            }
        }
    }

    &__line {
        height: 5px;
        background: $srri-bg-color;
        margin: map.get(mixin.$wal, 'space', '1-and-a-half-x')
            map.get(mixin.$wal, 'space', 'three-quarter-x');
        position: relative;

        .arrow {
            border: solid $srri-bg-color;
            border-width: 0 4px 4px 0;
            display: inline-block;
            padding: map.get(mixin.$wal, 'space', 'three-quarter-x');
            position: absolute;
            top: -6px;
        }

        .right {
            transform: rotate(-45deg);
            right: 0;
        }

        .left {
            transform: rotate(135deg);
        }
    }

    &__screen-reader {
        clip: rect(0 0 0 0);
        left: 0;
        position: absolute;
        z-index: -1;
    }
}
</style>
