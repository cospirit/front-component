<template>
    <div class="input-field search-field">
        <input :type="type" :class="classes" v-model="filterInput">
        <label :for="label" >{{ placeholder }}</label>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import _ from "lodash";
import EventBus from "../EventBus";

@Component({})
export default class FieldSearch extends Vue {
    protected filterInput: string = "";

    @Prop() public filterName!: string;
    @Prop() public label!: string;
    @Prop() public placeholder!: string;
    @Prop({default: "text"}) public type!: string;
    @Prop({default: "validate"}) public classes!: string;

    @Watch("filterInput")
    public onFilterChange(value: string) {
        EventBus.$emit("update-filter", _.set({}, this.filterName, value));
    }
}
</script>
