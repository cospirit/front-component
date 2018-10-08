<template>
    <div v-if="amount">
        <simple-text :classes="classes" :content="amount | price" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SimpleText from "./SimpleText.vue";

@Component({ components: { SimpleText } })
export default class Amount extends Vue {
    @Prop({ default: 0 }) public amount!: number;
    @Prop() public classes!: string;
}
</script>