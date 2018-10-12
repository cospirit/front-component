<template>
    <div
        v-if="contact"
        :class="classes"
    >
        <i class="material-icons tiny ">account_balance</i>
        <simple-text :content="contact.firstname" />
        <simple-text :content="contact.lastname" />/
        <simple-text :content="contact.email" />
        <span v-if="contact.cellphone">(<simple-text :content="contact.cellphone" />)</span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SimpleText from "./SimpleText.vue";

@Component({ components: { SimpleText } })
export default class Contact extends Vue {
    @Prop() public contact!: object;
    @Prop() public classes!: string;

    public static getNeededFields(entity: string): string[] {
        return [
            entity + ".contact.firstname",
            entity + ".contact.lastname",
            entity + ".contact.email",
            entity + ".contact.cellphone",
        ];
    }
}
</script>
