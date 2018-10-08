<template>
    <div :class="classes">
        <select v-model="filter" class="browser-default">
            <option
                v-for="(option, key) in options"
                :value="option.key"
                :key="key"
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

@Component({})
export default class SelectSearch extends Vue {
    @Prop({ default: "" }) public value!: string;
    @Prop() public filterName!: string;
    @Prop() public options!: object[];
    @Prop() public classes!: string;

    private filter: string = "";

    public mounted(): void {
        this.filter = this.value;
    }

    @Watch("filter") public onFilterChange(value: string): void {
        this.$emit("update-filter", _.set({}, this.filterName, value));
    }
}
</script>