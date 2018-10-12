<template>
    <div>
        <span v-if="textBefore">{{ text }} </span>
        <a :href="link" :class="classes" :title="title">
            {{ content }}
        </a>
        <span v-if="textAfter">{{ text }} </span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({ })
export default class LinkTo extends Vue {
    @Prop() public content!: string;
    @Prop() public link!: string;
    @Prop() public classes!: string;
    @Prop() public title!: string;
    @Prop() public text!: string;
    @Prop({ default: true }) public after!: boolean;

    private get textBefore(): boolean {
        return this.text && !this.after ? true : false;
    }

    private get textAfter(): boolean {
        return this.text && this.after ? true : false;
    }
}
</script>
