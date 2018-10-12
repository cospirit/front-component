<template>
    <field-search
        @update-filter="updateFilter"
        label="city"
        placeholder="Code or City"
        filter-name="codeOrCity"
    />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import FieldSearch from "./FieldSearch.vue";

@Component({ components: { FieldSearch } })
export default class CodeOrCitySearch extends Vue {
    @Emit("updateFilter") public updateFilter(filter: object): void {
        this.$emit("update-filter", filter);
    }
}
</script>