<template>
    <div
        class="custom"
        v-html="compileTemplate">
    </div>
</template>
<script>
import { template, templateSettings } from 'lodash';

export default {
    name: 'cell-custom',
    props: {
        template: {
            type: String,
            default: '',
        },
        rowData: {
            type: [Array, Object],
            default: () => ([]),
        },
    },
    data() {
        return {
            compileTemplate: undefined,
        };
    },
    watch: {
        rowData: {
            deep: true,
            handler() {
                this.generateCompileTemplate();
            },
        },
    },
    created() {
        templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    },
    mounted() {
        this.generateCompileTemplate();
    },
    methods: {
        generateCompileTemplate() {
            try {
                this.compileTemplate = template(this.template)(this.rowData);
            } catch (e) {
                console.warn(e);
            }
        },
    },
};
</script>
