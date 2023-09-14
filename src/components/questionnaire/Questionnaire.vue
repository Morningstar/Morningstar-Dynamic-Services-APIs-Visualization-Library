<template>
    <v-container fluid>
        <v-row v-if="showHeader">
            <v-col cols="12" class="title">
                <h2>Questionnaire</h2>
            </v-col>
        </v-row>
        <v-row class="ml-sm-2 mb-4">
            <h2>{{ questionairre.description }}</h2>
        </v-row>
        <v-row class="ml-sm-2 mb-4 pa-sm-3 pb-5 elevation-2 justify-center align-center">
            <v-col cols="10" sm="7" class="pa-0" v-for="question in questionairre.questions" :key="question.id">
                <v-row class="">
                    <v-col :class="question.classes.header" class="d-flex align-center justify-end pa-2" cols="8" md="6">
                        <h3 v-if="!question.parentId" :class="question.classes.textHeader" class="mb-4 mt-4 text-left ml-0 ml-md-12">
                            {{ question.text }}
                        </h3>
                        <h4
                            v-else-if="questionairre.questions[question.parentId - 1].defaultValue.includes('Yes')"
                            :class="question.classes.textHeader"
                            class="text-left ml-4 ml-md-16"
                        >
                            {{ question.text }}
                        </h4>
                    </v-col>
                    <v-col :class="question.classes.component" class="d-flex align-center pa-0" cols="4" md="6">
                        <v-select
                            v-if="
                                question.componentType === 'dropdown' &&
                                (!question.parentId || questionairre.questions[question.parentId - 1].defaultValue.includes('Yes'))
                            "
                            v-model="question.defaultValue"
                            :items="question.options"
                            @change="changeSelect(question)"
                            class="selection"
                        >
                        </v-select>
                        <v-select
                            v-if="
                                question.componentType === 'dropdown-multi' &&
                                (!question.parentId || questionairre.questions[question.parentId - 1].defaultValue.includes('Yes'))
                            "
                            v-model="question.defaultValue"
                            :items="question.options"
                            multiple
                            chips
                            @change="changeSelect(question)"
                            class="selection"
                        >
                        </v-select>
                        <v-slider
                            v-else-if="
                                question.componentType === 'slider' &&
                                (!question.parentId || questionairre.questions[question.parentId - 1].defaultValue.includes('Yes'))
                            "
                            v-model="question.value.value"
                            :label="question.options.label"
                            :thumb-color="question.options.color"
                            :thumb-size="22"
                            thumb-label="always"
                            density="compact"
                            class="pt-5 ml-n1 slider-align"
                        ></v-slider>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row v-if="questionairre.buttons" class="buttons align-center justify-center text-sm-center mt-10 mb-10 ml-4 ml-sm-10">
            <!-- <div> Check your preferences for</div> -->
            <v-col cols="12" sm="12" md="5" class="pa-2 ml-2" v-for="button in questionairre.buttons" :key="button.text">
                <v-btn
                    elevation="3"
                    :small="$vuetify.breakpoint.width < 1000"
                    :class="$vuetify.breakpoint.width < 500 ? 'responsive-width' : ''"
                    :disabled="!button.enabled"
                    @click="onButtonClick(button)"
                >
                    {{ button.text }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    props: {
        showHeader: {
            type: Boolean,
            default: true,
        },
        questionairre: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            params: {
                calculatedDataPoints: [
                    {
                        name: "UserPref1",
                        type: "bool",
                        condition: {
                            and: [
                                {
                                    or: [
                                        {
                                            fields: [],
                                            
                                        },
                                    ],
                                },
                                {
                                    or: [
                                        {
                                            fields: [],
                                            
                                        },
                                    ],
                                },
                                {
                                    or: [
                                            {
                                                fields: [],
                                            },
                                    ],
                                }
                            ],
                        },
                    },
                ],
            },
        };
    },
    methods: {
        changeSelect(question) {
            this.changeChildDefaultValue(question);
        },
        changeChildDefaultValue(question) {
            const { questionairre } = this;
            const childComponentList = questionairre.questions.filter((q) => q.parentId === question.id);

            childComponentList.forEach((item) => {
                if (item.defaultValue === "Yes" || item.defaultValue === "No") {
                    item.defaultValue = question.defaultValue;
                }
            });
        },
        onButtonClick(btn) {
            this.generateParams();
            this.$emit("onButtonClick", { source: btn.value, params: this.params });
        },

        generateParams() {
            const self = this;
            // Reset fields
            self.params.calculatedDataPoints[0].condition.and[0].or[0].fields = [];
            self.params.calculatedDataPoints[0].condition.and[1].or[0].fields = [];
            self.params.calculatedDataPoints[0].condition.and[2].or[0].fields = [];


            // generate the fields
            this.questionairre.questions.forEach((question, index) => {
                if (
                    question.text === "Optional or Exclusive" ||
                    question.text === "SFDR Classification" ||
                    question.text === "Principal Adverse Indicators"
                )
                    return;
                if (self.questionairre.questions[0].defaultValue !== "No" && (question.id == 1 || question.parentId == 1)) {
                    if (!question.value) {
                        question.value = question.values.filter((val) => val.key === question.defaultValue)[0];
                        delete question.value.key;
                    }
                    if (question.componentType == "slider") {
                        question.value.value = parseInt(question.value.value) / 100;
                    }
                    self.params.calculatedDataPoints[0].condition.and[0].or[0].fields.push(question.value);
                }

                if (self.questionairre.questions[3].defaultValue === "Yes" && question.parentId == 4) {
                    if (question.defaultValue) {
                        question.value = question.defaultValue.map((val) => {
                            return {
                                name: "EET_EUSFDRType",
                                op: "eq",
                                value: parseInt(val.split(" ")[1]),
                            };
                        });
                        self.params.calculatedDataPoints[0].condition.and[1].or[0].fields = question.value;
                    }
                }

                if (self.questionairre.questions[6].defaultValue === "Yes") {
                    if (question.parentId === 9 && question.defaultValue === "Yes") {
                        question.detail = {
                            name: question.value,
                            op: "eq",
                            value: "Y",
                        };
                        self.params.calculatedDataPoints[0].condition.and[2].or[0].fields.push(question.detail);
                    }
                    if (question.parentId === 15 && question.defaultValue === "Yes") {
                        question.detail = {
                            name: question.value,
                            op: "eq",
                            value: "Y",
                        };
                        self.params.calculatedDataPoints[0].condition.and[2].or[0].fields.push(question.detail);
                    }

                    if (question.id === 14 && question.defaultValue === "Yes") {
                        question.detail = {
                            name: question.value,
                            op: "eq",
                            value: "Y",
                        };
                        self.params.calculatedDataPoints[0].condition.and[2].or[0].fields.push(question.detail);
                    }
                }
            });

            // Remove Empty fields
            self.params.calculatedDataPoints[0].condition.and = self.params.calculatedDataPoints[0].condition.and.filter((obj) => {
                return obj.or[0].fields.length > 0
            });

        },
    },
};
</script>
<style lang="scss" scoped>
@use "sass:map";
@use '~@/components/shared/scss/mixin.scss' as mixin;

@include mixin.wal-component-title;

h3,
h4 {
    width: inherit;
}

h4 {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
}

.selection.v-input {
    font-size: 14px;
}

.responsive-width {
    font-size: 2.3vw;
}

.slider-align {
    padding-top: 25px !important;
}

.slider-align::v-deep .v-slider--horizontal {
    margin-right: 0px !important;
}
</style>
