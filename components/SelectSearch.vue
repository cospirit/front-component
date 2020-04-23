<template>
    <div :class="classes">
        <select v-model="filterSelect" class="browser-default">
            <option
                v-for="(option, key) in options"
                :value="option.key"
                :key="key"
                :disabled="option.disabled"
            >
                {{ option.label | trans }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import _ from "lodash";
import EventBus from "../EventBus";

@Component({})
export default class SelectSearch extends Vue {
    @Prop({ default: "" }) public value!: string;
    @Prop() public filterName!: string;
    @Prop() public options!: object[];
    @Prop() public classes!: string;

    protected filterSelect: string = "";

    public mounted(): void {
        this.filterSelect = this.value;
    }

    @Watch("value") public handleValueChange() {
        this.filterSelect = this.value;
    }

    @Watch("filterSelect") public onFilterChange(value: string): void {
        EventBus.$emit("update-filter", _.set({}, this.filterName, value));
    }
}
</script>