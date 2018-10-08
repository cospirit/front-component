<template>
    <ul class="collapsible popout">
        <li>
            <h6 class="collapsible-header card-panel panel-dashboard active">
                <i class="material-icons">library_books</i> <slot name="title"/>
            </h6>
            <div class="collapsible-body">
                <div>
                    <div class="dashboard-block-list">
                        <slot name="subcomponent"/>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class MiniList extends Vue {}
</script>