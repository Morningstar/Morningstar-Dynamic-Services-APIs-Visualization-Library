<template>
    <v-fab-transition>
    <v-btn
        v-show="isVisible"
        v-bind="getPosition"
        v-scroll="onScroll"
        :color="color"
        :elevation="elevation"
        outlined
        ripple
        fab
        @click="scrollTo"
    >
        <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
    </v-fab-transition>
</template>

<script>

export default {
    name: 'FloatingScrollButton',
    props: {
        color: {
            type: String,
            default: 'primary',
        },
        elevation: {
            type: Number,
            default: 2,
        },
        position: {
            type: String,
            default: 'fixed-bottom-right',
        },
    },
    data() {
        return {
            isVisible: false,
            thresholdScrollPosition: 100,
            scrollToPosition: 0,
        };
    },
    computed: {
        getPosition() {
            const positionValue = this.position.split('-');
            const buttonPosition = {};
            positionValue.forEach((pos) => {
                buttonPosition[pos] = pos;
            });
            return buttonPosition;
        },
    },
    methods: {
        onScroll(e) {
            if (typeof window === 'undefined') return;
            const documentTop = window.pageYOffset || e.target.scrollTop || 0;
            this.isVisible = documentTop > this.thresholdScrollPosition;
        },
        scrollTo() {
            this.$vuetify.goTo(this.scrollToPosition);
        },
    },
};

</script>
