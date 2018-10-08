<template>
    <div class="preloader-container center">
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue">
                <div class="circle-clipper left">
                    <div class="circle" />
                </div>
                <div class="gap-patch">
                    <div class="circle" />
                </div>
                <div class="circle-clipper right">
                    <div class="circle" />
                </div>
            </div>

            <div class="spinner-layer spinner-red">
                <div class="circle-clipper left">
                    <div class="circle" />
                </div>
                <div class="gap-patch">
                    <div class="circle" />
                </div>
                <div class="circle-clipper right">
                    <div class="circle" />
                </div>
            </div>

            <div class="spinner-layer spinner-yellow">
                <div class="circle-clipper left">
                    <div class="circle" />
                </div>
                <div class="gap-patch">
                    <div class="circle" />
                </div>
                <div class="circle-clipper right">
                    <div class="circle" />
                </div>
            </div>

            <div class="spinner-layer spinner-green">
                <div class="circle-clipper left">
                    <div class="circle" />
                </div>
                <div class="gap-patch">
                    <div class="circle" />
                </div>
                <div class="circle-clipper right">
                    <div class="circle" />
                </div>
            </div>
        </div>
        <div class="legend">{{ loadText }}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class Preloader extends Vue {
    @Prop({ default: ""}) public loadText!: string;
}
</script>
