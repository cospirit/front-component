<template>
    <a
        :href="link"
        :class="classes"
        :title="title"
    >
        <i class="material-icons small">{{ icon }}</i>
    </a>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Route, Dictionary } from "../Route";

@Component({})
export default class IconLink extends Vue {
    @Prop() public action!: string;
    @Prop() public type!: string;
    @Prop() public params!: Dictionary<string>;
    @Prop() public classes!: string;
    @Prop() public title!: string;
    @Prop() public icon!: string;

    private get link(): string {
        return this.$router.resolve(new Route(this.action + "_" + this.type, this.params)).href;
    }
}
</script>
