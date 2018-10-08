<template>
    <pastel
        v-if="status"
        :size="size"
        :title="status.title"
        :color="status.markerColor"
        :border-color="status.markerBorderColor"
        :border-width="borderWidth"
        :tooltip-content="getTooltipContent(status) | trans"
        tooltip-position="bottom"
    />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Pastel from "./Pastel.vue";

interface Status {
    label: string;
    title: string;
    markerColor: string;
    markerBorderColor: string;
}

@Component({ components: { Pastel }})
export default class StatusPastel extends Vue {
    @Prop() public status: Status;
    @Prop({ default: 20 }) public size!: number;
    @Prop({ default: 0 }) public borderWidth!: number;
    @Prop({ default: false }) public tooltips!: boolean;

    private getTooltipContent(status: Status): string {
        return this.tooltips ? status.label : "";
    }
}
</script>