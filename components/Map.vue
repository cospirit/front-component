<template>
    <div>
        <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
            integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
            crossorigin="">
        <div :id="idMap" :style="{ width: width, height: height, cursor: cursor }" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import L, { LatLngBoundsExpression, Layer, LayerGroup, Control, Map as LeafleatMap, LeafletMouseEvent } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet.gridlayer.googlemutant";
import "leaflet-pegman/leaflet-pegman.min.css";
import "leaflet-pegman/leaflet-pegman.min";
import "leaflet-sidebar-v2";
import _ from "lodash";
import EventBus from "../EventBus";

export interface MarkerList {
    name: string;
    markers: Layer[];
    layerId: string;
    type: string;
}

export interface Event {
    eventType: string;
    eventAction: any;
}

export interface EventClick {
    dispatchClick(ev: LeafletMouseEvent): void
}

export interface SidebarControl {
    action: string;
    id: string | string[];
}

export interface Options {
    streetview?: {
        active: boolean;
        options?: object;
    }
    sidebar?: {
        active: boolean;
        options?: object;
    };
    traffic?: {
        active: boolean;
        name: string;
        options?: object;
    };
    transit?: {
        active: boolean;
        name: string;
        options?: object;
    };
    bike?: {
        active: boolean;
        name: string;
        options?: object;
    };
    address?: {
        active: boolean;
        name: string;
        options?: object;
    };
    draw?: {
        active: boolean;
        options?: object;
    };
    fullscreen?: {
        active: boolean;
        options?: object;
        titleFalse?: string;
        titleTrue?: string;
    };
    zoomControl?: {
        active: boolean;
        options?: object;
        zoomInTitle?: string;
        zoomOutTitle?: string;
    };

    eventClick?: EventClick[];
}

@Component({ })
export default class Map extends Vue {
    static SIDEBAR_OPEN = "open";
    static SIDEBAR_CLOSE = "close";
    static SIDEBAR_DISABLE = "disable";
    static SIDEBAR_ENABLE = "enable";

    private layerControl: L.Control.Layers | null = null;
    private map: LeafleatMap | null = null;
    private sidebar: L.Control.Sidebar | null = null;
    private drawer: L.Control.Draw | null = null;
    public cursor: string = "default";

    @Prop({ default: "500px" }) public width!: string;
    @Prop({ default: "500px" }) public height!: string;
    @Prop({ default: 10 }) public zoom!: number;
    @Prop({ default: [] }) public markers!: MarkerList[];
    @Prop({ default: [] }) public mapEvents!: Event[];
    @Prop({ default: null }) public controls!: Layer[];
    @Prop({ default: () => { return [] } }) public mapControls!: Control[];
    @Prop() public resize!: number;
    @Prop({ default: "map" }) public idMap!: string;
    @Prop({ }) public options!: Options;
    @Prop({ default: null }) public sidebarControl!: SidebarControl;
    @Prop({ default: true }) public drawerControl!: any;

    public mounted(): void {
        const map: LeafleatMap = L.map(this.idMap, { zoomControl: false }).setView(
            [ 45.749095 , 4.82665 ],
            this.zoom,
        );
        let satellite = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            {
                maxZoom: 20,
                subdomains: [ "mt0" ],
            },
        ).addTo(map);
        let plan = L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
                maxZoom: 20,
                subdomains: [ "mt0" ],
            },
        ).addTo(map);

        const layerControl: L.Control.Layers = L.control.layers({ "Satelite": satellite, "Plan": plan });
        layerControl.addTo(map);
        this.controls.forEach((control: Layer) => {
            layerControl.addBaseLayer(control, _.get(control, "name", ""))
        });
        this.layerControl = layerControl;

        this.mapControls.forEach((control: Control) => {
            control.addTo(map);
        });
        this.map = map;
        this.loadOptions();

        EventBus.$on("add-map-event", this.addMapEvent);
        EventBus.$on("change-map-cursor", this.changeMapCursor);
        EventBus.$on("change-map-sidebar", this.onChangeSidebarControl);
        EventBus.$on("change-bounds", this.changeBounds);
    }

    public beforeDestroy(): void {
        EventBus.$off("add-map-event", this.addMapEvent);
        EventBus.$off("change-map-cursor", this.changeMapCursor);
        EventBus.$off("change-map-sidebar", this.onChangeSidebarControl);
        EventBus.$off("change-bounds",  this.changeBounds);
    }

    private changeMapCursor(cursor: string): void {
        this.cursor = cursor;
    }

    private changeBounds(bounds: [number, number][]): void {
        if (0 < bounds.length && this.map) {
            this.map.fitBounds(bounds, { maxZoom: 14 });
        }
    }

    @Watch("resize") public resizeMap() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }

    @Watch("markers") public onMarkersChange(newValue: MarkerList[], oldValue: MarkerList[]) {

        // Remove layer not used
        _.forEach(oldValue, (oldLayer: MarkerList) => {
            let find = _.find(newValue, (newLayer: MarkerList) => {
                return newLayer.name === oldLayer.name;
            });

            if (!find && this.map) {
                this.map.eachLayer((layer: Layer): void => {
                    if (_.get(layer, "layerName", "") === oldLayer.name && this.map) {
                        this.map.removeLayer(layer);
                    }
                });

                const controls: Layer[] = _.get(this.layerControl, "_layers", []);
                _.remove(controls, (layerControl: Layer) => {
                    return _.get(layerControl, "name", "") === oldLayer.name;
                });
            }
        });

        // Add layer used
        _.forEach(newValue, (newLayer: MarkerList) => {
            let find = _.find(oldValue, (oldLayer: MarkerList) => {
                return newLayer.name === oldLayer.name;
            });

            if (find && this.map) {
                this.map.eachLayer((layer: Layer): void => {
                    if (_.get(layer, "layerName", "") === newLayer.name && this.map) {
                        this.map.removeLayer(layer);
                    }
                });

                const controls: Layer[] = _.get(this.layerControl, "_layers", []);
                _.remove(controls, (layerControl: Layer) => {
                    return _.get(layerControl, "name", "") === newLayer.name;
                });
            }

            this.addMarkerToLayer(newLayer);
        });
    }

    @Watch("mapEvents") public onEventsChange() {
        this.mapEvents.forEach((event: Event) => {
            if (this.map) {
                this.map.on(event.eventType, event.eventAction);
            }
        });
    }

    @Watch("mapControls") public onMapControlsChange() {
        this.mapControls.forEach((control: Control) => {
            if (this.map) {
                control.addTo(this.map);
            }
        });
    }

    @Watch("controls") public onControlsChange() {
        this.controls.forEach((control: Layer) => {
            _.remove(_.get(this.layerControl, "_layers", []), (layerControl: Layer) => {
                return _.get(layerControl, "name","") === _.get(control, "name", null);
            });
            if (this.layerControl) {
                this.layerControl.addBaseLayer(control, _.get(control, "name", ""));
            }
        });
    }

    public onChangeSidebarControl(sidebarControl: SidebarControl): void {
        if (!Array.isArray(sidebarControl.id)) {
            sidebarControl.id = [sidebarControl.id];
        }

        _.forEach(sidebarControl.id, (id, key) => {
            if (this.sidebar && sidebarControl.action === Map.SIDEBAR_OPEN) {
                this.sidebar.enablePanel(id);
                this.sidebar.open(id);
            }
            if (this.sidebar && sidebarControl.action === Map.SIDEBAR_CLOSE) {
                this.sidebar.close();
                this.sidebar.disablePanel(id);
            }
            if (this.sidebar && sidebarControl.action === Map.SIDEBAR_DISABLE) {
                this.sidebar.close();
                this.sidebar.disablePanel(id);
            }
            if (this.sidebar && sidebarControl.action === Map.SIDEBAR_ENABLE) {
                this.sidebar.enablePanel(id);
            }
        });
    }

    @Watch("drawerControl") public onChangeDrawerControl() {
        if (this.drawer) {
            this.drawer.remove();
        }

        if (_.get(this.drawerControl, "options", false)) {
            this.drawer = new L.Control.Draw(
                {
                    position: 'topleft',
                    draw: _.get(this.drawerControl, "options"),
                }
            );
            if (this.map) {
                this.drawer.addTo(this.map);
            }
        }
    }

    public addMapEvent(events: Event[]) {
        events.forEach((event: Event) => {
            if (this.map) {
                this.map.on(event.eventType, event.eventAction);
            }
        });
    }

    private addMarkerToLayer(markerList: MarkerList): void {
        const layer: LayerGroup  = L.layerGroup(markerList.markers);

        _.set(layer, "layerName", markerList.name);
        if (this.map) {
            layer.addTo(this.map);
        }
        if (this.layerControl) {
            this.layerControl.addOverlay(layer, markerList.name);
        }
    }

    private loadOptions() {
        if (this.options) {
            if (this.options.streetview && true === this.options.streetview.active && this.map) {
                new L.Control.Pegman(
                    this.options.streetview.options
                    || {
                        position: "bottomright",
                        clickableStreetViewLayer: false, // WARNING: when enabled it will violate Google ToS rules
                        theme: "leaflet-pegman-v3-small",
                    }).addTo(this.map)
            }

            if (this.options.zoomControl && true === this.options.zoomControl.active && this.map) {
                L.control.zoom(
                    this.options.zoomControl.options
                    || {
                        position: "bottomright",
                        zoomInTitle: this.options.zoomControl.zoomInTitle || "Zoom in",
                        zoomOutTitle: this.options.zoomControl.zoomOutTitle || "Zoom out",
                    }).addTo(this.map);
            }

            if (this.options.sidebar && true === this.options.sidebar.active) {
                this.sidebar = L.control.sidebar(
                    this.options.sidebar.options
                    || {
                        autopan: true,
                        closeButton: false,
                        container: "sidebar",
                        position: "left",
                    }
                );
                if (this.sidebar && this.map) {
                    this.sidebar.addTo(this.map);
                }
            }

            _.forEach({ traffic: "TrafficLayer", transit: "TransitLayer", bike: "BicyclingLayer"},
                (type: string, name: string) => {
                    const configuration: any = _.get(this.options, name);
                    if (configuration && true === configuration.active) {
                        const gridLayerGoogleMutant: any = L.gridLayer.googleMutant(
                            configuration.options
                            || {
                                maxZoom: 20,
                                type: "roadmap",
                                name,
                            }
                        );
                        gridLayerGoogleMutant.addGoogleLayer(type);
                        gridLayerGoogleMutant.name = _.get(configuration, "name", "");
                        if (this.layerControl) {
                            this.layerControl.addBaseLayer(gridLayerGoogleMutant,  gridLayerGoogleMutant.name);
                        }
                    }
                });

            if (this.options.address && true === this.options.address.active && this.map) {
                const provider = new OpenStreetMapProvider();
                new GeoSearchControl(
                    this.options.address.options as any
                    || {
                        provider,
                        searchLabel: this.options.address.name,
                        position: 'bottomright',
                    }
                ).addTo(this.map);
            }

            if (this.options.fullscreen && true === this.options.fullscreen.active && this.map) {
                this.map.addControl(_.invoke(L.control, "fullscreen", {
                    position: 'bottomright',
                    title: {
                        false: this.options.fullscreen.titleFalse || "View Fullscreen",
                        true: this.options.fullscreen.titleTrue || "Exit Fullscreen ",
                    }
                }));
            }

            if (this.options.eventClick) {
                this.options.eventClick.forEach((eventClick: EventClick) => {
                    this.mapEvents.push({
                        eventType: "click",
                        eventAction: (ev: LeafletMouseEvent) => {
                            eventClick.dispatchClick(ev);
                        },
                    });
                });
            }
        }
    }
}
</script>
