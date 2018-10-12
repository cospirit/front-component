<template>
    <span :class="classes">{{ content }}</span>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class SimpleText extends Vue {
    @Prop() public content!: string | number;
    @Prop() public classes!: string;
}
</script>
