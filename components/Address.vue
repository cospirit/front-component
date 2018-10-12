<template>
    <div :title="title">
        {{ address.address1 | dashIfEmpty }}
        {{ address.address2 }}<br>
        {{ address.postalCode }} - {{ address.city }}
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Address extends Vue {
    @Prop() public address!: object;
    @Prop() public title!: string;
}
</script>

