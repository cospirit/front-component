<template>
    <div class="input-field search-field">
        <input :type="type" :class="classes" v-model="value">
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
    protected filterInput: string | null = null;

    @Prop() public filterName!: string;
    @Prop() public label!: string;
    @Prop() public placeholder!: string;
    @Prop({default: ""}) public defaultValue!: string;
    @Prop({default: "text"}) public type!: string;
    @Prop({default: "validate"}) public classes!: string;

    public get value(): string {
        if (null === this.filterInput) {
            this.filterInput = this.defaultValue;
        }

        return this.filterInput;
    }

    public set value(newValue) {
        this.filterInput = newValue;
        EventBus.$emit("update-filter", _.set({}, this.filterName, newValue));
    }
}
</script>
