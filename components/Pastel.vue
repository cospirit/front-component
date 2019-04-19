<template>
    <div>
        <span
            :style="{
                width: diameterPx,
                height: diameterPx,
                borderRadius: radiusPx,
                backgroundColor: color,
                borderColor: borderColor,
                border: borderStyles
            }"
            :data-position="tooltipPosition"
            :title="tooltipContent"
            class="pastel tooltipped"
        >
            &nbsp;
        </span>
        <span v-if="content">{{ content }}</span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Pastel extends Vue {
    @Prop() public borderWidth!: number;
    @Prop() public borderColor!: string;
    @Prop() public tooltipContent!: string;
    @Prop({ default: "top" }) public tooltipPosition!: string;
    @Prop({ default: "" }) public content!: string;
    @Prop({ default: 20 }) public size!: number;
    @Prop({ default: "grey" }) public color!: string;

    private get diameterPx(): string {
        return this.size + "px";
    }

    private get radiusPx(): string {
        return (this.size / 2) + "px";
    }

    private get borderStyles(): string {
        return this.borderWidth + "px solid " + this.borderColor;
    }

    public mounted(): void {
        if (this.borderWidth > 0 && this.borderColor === "") {
            this.borderColor = this.color;
        }
    }
}
</script>