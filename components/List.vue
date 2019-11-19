<template>
    <div v-if="neededPagination" :scroll="scrollFunction">
        <span v-if="loading">
            <preloader />
        </span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import Preloader from "./Preloader.vue";
import Http, { Data } from "../Http";
import EventBus from "../EventBus";

@Component({ components: { Preloader } })
export default class List extends Vue {
    protected page: number = 1;
    protected loading: boolean = false;
    protected hasNextPage: boolean = true;
    private list: string[] = [];
    protected route: string = "";
    protected elements: object[] = [];
    protected fields: string[];

    @Prop({ default: [] }) public filters: object[];
    @Prop({ default: true}) public neededPagination!: boolean;
    @Prop({ default: 50 }) public limitPerPage!: number;

    @Watch("filters") public onFiltersChange(value: object[]): void {
        this.page = 1;
        this.hasNextPage = true;
        this.elements = [];
        this.loadUsingApi();
    }

    public mounted(): void {
        this.loadUsingApi();
        if (this.neededPagination) {
            window.onscroll = () => {
                const windowHeight = window.innerHeight;
                const scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop +
                    (document.documentElement && document.documentElement.scrollTop || 0);

                if (document.body.offsetHeight <= windowHeight + scrollPosition) {
                    this.page++;
                    this.loadUsingApi();
                }
            };
        }
    }

    private link(): string {
        return this.$router.resolve({ name: this.route }).href;
    }

    private scrollFunction(): void {
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop +
            (document.documentElement && document.documentElement.scrollTop || 0);

        if (document.body.offsetHeight <= windowHeight + scrollPosition) {
            this.page++;
            this.loadUsingApi();
        }
    }

    protected refreshList(): void {
        this.hasNextPage = true;
        this.page = 1;
        this.elements = [];
        this.loadUsingApi();
    }

    private loadUsingApi(): void {
        const params: object = {
            filters: this.filters,
            fields: this.fields,
            pagination: {
                nb_per_page: this.limitPerPage,
                page: this.page,
            },
        };

        if (!this.loading && this.hasNextPage) {
            this.loading = true;

            Http
                .search(this.link(), params,
                    (data: Data) => {
                        this.$emit("update", data.data);
                        data.data.forEach((entity: any) => this.elements.push(entity));
                        this.hasNextPage = data.data.length > 0;
                        this.loading = false;
                    },
                    (error: any) => {
                        if (this.$options.filters) {
                            EventBus.$emit(
                                "error-alert",
                                { message: this.$options.filters.trans("An error occurred while loading the list.") }
                            );
                            this.loading = false;
                        }
                    },
                )
            ;
        }
    }
}
</script>