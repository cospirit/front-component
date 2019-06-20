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
import { GeoSearchControl, OpenStreetMapProvider } from "../leaflet-geosearch/lib/index.js";
import Pin from "../Pin"
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "../streetview/streetview";
import "../streetview/streetview.css";
import _ from "lodash";
import EventBus from "cospirit-front-component/EventBus";

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

export interface Sidebar extends L.Control {
    enablePanel(id: string): void;
    open(id: string): void;
    disablePanel(id: string): void;
    close(id: string): void;
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
    };
    zoomControl?: {
        active: boolean;
        options?: object;
    };

    eventClick?: EventClick[];
}

@Component({ })
export default class Map extends Vue {
    static SIDEBAR_OPEN = "open";
    static SIDEBAR_CLOSE = "close";
    static SIDEBAR_DISABLE = "disable";
    static SIDEBAR_ENABLE = "enable";

    private layerControl: L.Control.Layers;
    private eventclicks: EventClick[] = [];
    private map: LeafleatMap;
    private sidebar: Sidebar | null = null;
    private drawer: L.Control.Draw | null = null;
    public cursor: string = "default";

    @Prop({ default: "500px" }) public width!: string;
    @Prop({ default: "500px" }) public height!: string;
    @Prop({ default: 10 }) public zoom!: number;
    @Prop({ default: null }) public bounds!: LatLngBoundsExpression & string[];
    @Prop({ default: [] }) public markers!: MarkerList[];
    @Prop({ default: [] }) public mapEvents!: Event[];
    @Prop({ default: null }) public controls!: Layer[];
    @Prop({ default: () => { return [] } }) public mapControls: Control[];
    @Prop() public resize: number;
    @Prop({ default: "map" }) public idMap: string;
    @Prop({ }) public options: Options;
    @Prop({ default: null }) public sidebarControl!: SidebarControl;
    @Prop({ default: true }) public drawerControl: boolean;

    public mounted(): void {
        this.map = L.map(this.idMap, { zoomControl: false }).setView(
            [ 45.749095 , 4.82665 ],
            this.zoom,
        );
        let satellite = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            {
                maxZoom: 20,
                subdomains: [ "mt0" ],
            },
        ).addTo(this.map);
        let plan = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
                maxZoom: 20,
                subdomains: [ "mt0" ],
            },
        ).addTo(this.map);

        this.layerControl = L.control.layers({ "Satelite": satellite, "Plan": plan }).addTo(this.map);
        this.controls.forEach((control: Layer) => {
            this.layerControl.addBaseLayer(control, _.get(control, "name", ""))
        });

        this.mapControls.forEach((control: Control) => {
            control.addTo(this.map);
        });

        this.loadOptions();

        EventBus.$on("add-map-event", this.addMapEvent);
        EventBus.$on("change-map-cursor", (cursor: string) => {
            this.cursor = cursor;
        });
        EventBus.$on("change-map-sidebar", this.onChangeSidebarControl);
    }

    @Watch("resize") public resizeMap() {
        this.map.invalidateSize();
    }

    @Watch("markers") public onMarkersChange(newValue: MarkerList[], oldValue: MarkerList[]) {

        // Remove layer not used
        _.forEach(oldValue, (oldLayer: MarkerList) => {
            let find = _.find(newValue, (newLayer: MarkerList) => {
                return newLayer.name === oldLayer.name;
            });

            if (!find) {
                this.map.eachLayer((layer: Layer): void => {
                    if (_.get(layer, "layerName", "")=== oldLayer.name) {
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

            if (find) {
                this.map.eachLayer((layer: Layer): void => {
                    if (_.get(layer, "layerName", "") === newLayer.name) {
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

        // Focus map on bounds (coordinates list)
        if (this.bounds && this.bounds.length > 0) {
            this.map.fitBounds(this.bounds, { maxZoom: 14 });
        }
    }

    @Watch("mapEvents") public onEventsChange() {
        this.mapEvents.forEach((event: Event) => {
            this.map.on(event.eventType, event.eventAction);
        });
    }

    @Watch("mapControls") public onMapControlsChange() {
        this.mapControls.forEach((control: Control) => {
            control.addTo(this.map);
        });
    }

    @Watch("controls") public onControlsChange() {
        this.controls.forEach((control: Layer) => {
            _.remove(_.get(this.layerControl, "_layers", []), (layerControl: Layer) => {
                return _.get(layerControl, "name","") === _.get(control, "name", null);
            });
            this.layerControl.addBaseLayer(control, _.get(control, "name", ""));
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
                this.sidebar.close(id);
                this.sidebar.disablePanel(id);
            }
            if (this.sidebar && sidebarControl.action === Map.SIDEBAR_DISABLE) {
                this.sidebar.close(id);
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

        if (this.drawerControl.options) {
            this.drawer = new L.Control.Draw(
                {
                    position: 'topleft',
                    draw: this.drawerControl.options
                }
            );
            this.drawer.addTo(this.map);
        }
    }

    public addMapEvent(events: Event[]) {
        events.forEach((event: Event) => {
            this.map.on(event.eventType, event.eventAction);
        });
    }

    private addMarkerToLayer(markerList: MarkerList): void {
        const layer: LayerGroup  = L.layerGroup(markerList.markers);

        _.set(layer, "layerName", markerList.name);
        layer.addTo(this.map);
        this.layerControl.addOverlay(layer, markerList.name);
    }

    private loadOptions() {
        if (this.options) {
            if (this.options.streetview && true === this.options.streetview.active) {
                new L.Control.Pegman(
                    this.options.streetview.options
                    || {
                        position: 'bottomright',
                        clickableStreetViewLayer: false, // WARNING: when enabled it will violate Google ToS rules
                        theme: "leaflet-pegman",
                    }
                ).addTo(this.map);
            }

            if (this.options.zoomControl && true === this.options.zoomControl.active) {
                L.control.zoom(
                    this.options.zoomControl.options
                    || {
                        position: "bottomright",
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
                this.sidebar.addTo(this.map);
            }

            if (this.options.traffic && true === this.options.traffic.active) {
                const trafficMutant = L.gridLayer.googleMutant(
                    this.options.traffic.options
                    || {
                        maxZoom: 20,
                        type: "roadmap",
                    }
                );
                trafficMutant.addGoogleLayer("TrafficLayer");
                trafficMutant.name = this.options.traffic.name;
                this.layerControl.addBaseLayer(trafficMutant,trafficMutant.name);
            }

            if (this.options.transit && true === this.options.transit.active) {
                const transitMutant = L.gridLayer.googleMutant(
                    this.options.transit.options
                    || {
                        maxZoom: 20,
                        type: "roadmap",
                    }
                );
                transitMutant.addGoogleLayer("TransitLayer");
                transitMutant.name = this.options.transit.name;
                this.layerControl.addBaseLayer(transitMutant, transitMutant.name);
            }

            if (this.options.bike && true === this.options.bike.active) {
                const bikeMutant = L.gridLayer.googleMutant(
                    this.options.bike.options
                    || {
                        maxZoom: 20,
                        type: "roadmap",
                    }
                );
                bikeMutant.addGoogleLayer("BicyclingLayer");
                bikeMutant.name = this.options.bike.name;
                this.layerControl.addBaseLayer(bikeMutant, bikeMutant.name);
            }

            if (this.options.address && true === this.options.address.active) {
                const provider = new OpenStreetMapProvider();
                new GeoSearchControl(
                    this.options.address.options
                    || {
                        provider,
                        searchLabel: this.options.address.name,
                        position: 'bottomright',
                    }
                ).addTo(this.map);
            }

            if (this.options.fullscreen && true === this.options.fullscreen.active) {
                this.map.addControl(_.invoke(L.control, "fullscreen", {
                    position: 'bottomright'
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
