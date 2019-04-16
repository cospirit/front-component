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
import L, { LatLngBoundsExpression, Layer, LayerGroup, Control, Map, LeafletMouseEvent } from "leaflet";
import { LMarker, LMap as LeafleatMap  }  from "vue2-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "../leaflet-geosearch/lib/index.js";
import Pin from "../Pin"
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "../streetview/streetview";
import "../streetview/streetview.css";
import _ from "lodash";

interface IControl {
    layer: string;
    name: string;
    overlay: boolean | null;
}

interface MarkerList {
    name: string;
    markers: ExtendedMarker[];
    layerId: string;
    type: string;
}

export interface ExtendedLayer extends Layer {
    _url: string;
    layerName: string;
}

export interface Event {
    eventType: string;
    eventAction: any;
}

export interface ExtendedMarker extends LMarker {
    layerId: string;
}

export interface ExtendedLayerGroup extends LayerGroup {
    layerName: string;
}

export interface EventClick {
    dispatchClick(ev: LeafletMouseEvent): void
}

export interface Options {
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

    eventClick?: EventClick[];
}

@Component({ })
export default class Map extends Vue {
    private layerControl: Control.Layers;
    private eventclicks: EventClick[] = [];
    private map: Map;
    private sidebar?: L.control;

    @Prop({ default: "500px" }) public width!: string;
    @Prop({ default: "500px" }) public height!: string;
    @Prop({ default: "default" }) public cursor!: string;
    @Prop({ default: 10 }) public zoom!: number;
    @Prop({ default: null }) public bounds!: LatLngBoundsExpression & string[];
    @Prop({ default: [] }) public markers!: MarkerList[];
    @Prop({ default: [] }) public mapEvents!: Event[];
    @Prop({ default: null }) public controls!: Control[];
    @Prop({ default: () => { return [] } }) public mapControls: Control[];
    @Prop() public resize: number;
    @Prop({ default: "map" }) public idMap: string;
    @Prop({ }) public options: Options;
    @Prop({ default: null }) public sidebarControl!: object;

    public mounted(): void {
        this.map = L.map(this.idMap).setView(
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
        this.controls.forEach((control: Control) => {
            this.layerControl.addBaseLayer(control, control.name)
        });

        var pegmanControl = new L.Control.Pegman({
            position: 'bottomright',
            clickableStreetViewLayer: false, // WARNING: when enabled it will violate Google ToS rules
            theme: "leaflet-pegman",
        });
        pegmanControl.addTo(this.map);

        this.map.addControl(new L.control.fullscreen());

        this.mapControls.forEach((control: Control) => {
            control.addTo(this.map);
        });

        this.loadOptions();
    }

    @Watch("resize") public resizeMap() {
        this.map.invalidateSize();
    }

    @Watch("markers") public onMarkersChange(newValue, oldValue) {

        // Remove layer not used
        _.forEach(oldValue, (oldLayer: MarkerList) => {
            let find = _.find(newValue, (newLayer: MarkerList) => {
                return newLayer.name === oldLayer.name;
            });

            if (!find) {
                this.map.eachLayer((layer: ExtendedLayer): void => {
                    if (layer.layerName === oldLayer.name) {
                        this.map.removeLayer(layer);
                    }
                });

                _.remove(this.layerControl._layers, (layerControl: IControl) => {
                    return layerControl.name === oldLayer.name;
                });
            }
        });

        // Add layer used
        _.forEach(newValue, (newLayer: MarkerList) => {
            let find = _.find(oldValue, (oldLayer: MarkerList) => {
                return newLayer.name === oldLayer.name;
            });

            if (find) {
                this.map.eachLayer((layer: ExtendedLayer): void => {
                    if (layer.layerName === newLayer.name) {
                        this.map.removeLayer(layer);
                    }
                });

                _.remove(this.layerControl._layers, (layerControl: IControl) => {
                    return layerControl.name === newLayer.name;
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

    @Watch("mapControls") public onControlsChange() {
        this.mapControls.forEach((control: Control) => {
            control.addTo(this.map);
        });
    }

    @Watch("controls") public onControlsChange() {
        this.controls.forEach((control: Control) => {
            if (this.layerControl._layers) {
                _.remove(this.layerControl._layers, (layerControl: IControl) => {
                    return layerControl.name === control.name;
                });
            }
            this.layerControl.addBaseLayer(control, control.name)
        });
    }

    @Watch("sidebarControl") public onChangeSidebarControl() {
        if (this.sidebar) {
            if (this.sidebarControl.action === "OPEN") {
                this.sidebar.enablePanel(this.sidebarControl.id);
                this.sidebar.open(this.sidebarControl.id);
            }

            if (this.sidebarControl.action === "CLOSE") {
                this.sidebar.close(this.sidebarControl.id);
                this.sidebar.disablePanel(this.sidebarControl.id);
            }
        }
    }

    private addMarkerToLayer(markerList: MarkerList): void {
        const layer: ExtendedLayerGroup  = L.layerGroup(markerList.markers);

        layer.layerName = markerList.name;
        layer.addTo(this.map);
        this.layerControl.addOverlay(layer, markerList.name);
    }

    private loadOptions() {
        if (this.options) {
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
                    }
                ).addTo(this.map);
            }

            if (this.options.draw && true === this.options.draw.active) {
                // Set the title to show on the polygon button
                new L.Control.Draw(
                    this.options.draw.options
                    || {
                        position: 'topright',
                        draw: {
                            polyline: false,
                            polygon: {
                                metric: true,
                                icon: new L.DivIcon({
                                    className: 'leaflet-div-icon leaflet-editing-icon',
                                    iconSize: new L.Point(8, 8)
                                }),
                            },
                            circlemarker: false,
                            marker: { icon: Pin.getCustomMarkerSvgCode("#00bbff", 24, 24) },
                        }
                    }
                ).addTo(this.map);
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
