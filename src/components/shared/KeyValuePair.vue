<template>
    <v-container fluid>
        <v-row>
            <v-col
                sm="4"
                md="4"
                lg="2"
                cols="12"
                v-for="(data, index) in modelData" :key="index">
                <div class="subtitle-1">{{ data.key }}</div>
                <div class="text-h6">{{ data.value }}</div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        modelData: {
            type: Array,
        },
    },
};
</script>
