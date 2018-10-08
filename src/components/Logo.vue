<template>
    <span>
        <img
            v-if="owner.logo"
            :height="height"
            :src="owner.logo.link"
            :class="classes"
        >
    </span>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Logo extends Vue {
    @Prop() public owner!: object;
    @Prop({ default: "50px"}) public height!: string;
    @Prop({ default: "logo"}) public classes!: string;
}
</script>