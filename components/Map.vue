<template>
    <div>
        <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
            integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
            crossorigin="">
        <div id="map" :style="{ width: width, height: height, cursor: cursor }" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import L, { Marker, Map as LeafleatMap, LatLngBoundsExpression, Layer, Control, LayerGroup }  from "leaflet";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import _ from "lodash";

interface LayerControl {
    _layers: IControl[];
    addOverlay(layer: object, name: string): void;
    removeLayer(layer: object): void;
}

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

interface Event {
    eventType: string;
    eventAction: any;
}

export interface ExtendedMarker extends Marker {
    layerId: string;
}

export interface ExtendedLayerGroup extends LayerGroup {
    layerName: string;
}

@Component({ })
export default class Map extends Vue {
    private layerControl: LayerControl;
    private map: LeafleatMap;

    @Prop({ default: "500px" }) public width!: string;
    @Prop({ default: "500px" }) public height!: string;
    @Prop({ default: "default" }) public cursor!: string;
    @Prop({ default: 10 }) public zoom!: number;
    @Prop({ default: null }) public bounds!: LatLngBoundsExpression & string[];
    @Prop({ default: [] }) public markers!: MarkerList[];
    @Prop({ default: [] }) public mapEvents!: Event[];
    @Prop({ default: null }) public controls!: Control[];
    @Prop({ default: () => { return [] } }) public mapControls: any[];

    public mounted(): void {
        this.map = L.map("map").setView(
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
        this.map.addControl(new L.control.fullscreen());
        this.mapControls.forEach((control: Control) => {
            control.addTo(this.map);
        });
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

    private addMarkerToLayer(markerList: MarkerList): void {
        const layer: ExtendedLayerGroup  = L.layerGroup(markerList.markers);

        layer.layerName = markerList.name;
        layer.addTo(this.map);
        this.layerControl.addOverlay(layer, markerList.name);
    }
}
</script>
