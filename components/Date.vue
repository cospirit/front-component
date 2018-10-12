<template>
    <div>
        <simple-text
            :class="classes"
            :content="content"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SimpleText from "./SimpleText.vue";

@Component({ components: { SimpleText } })
export default class Date extends Vue {
    @Prop() public content!: string | number;
    @Prop() public classes!: string;
}
</script>
