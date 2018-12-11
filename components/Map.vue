<template>
    <div>
        <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
            integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
            crossorigin="">
        <div id="map" :style="{ width: width, height: height }" />
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import { Prop, Watch } from "vue-property-decorator";
    import L, { Marker, Map as LeafleatMap, LatLngBoundsExpression, Layer, Control }  from "leaflet";
    import "leaflet-fullscreen";
    import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

    interface LayerControl {
        addOverlay(layer: object, name: string): void;
        removeLayer(layer: object): void;
    }

    interface MarkerList {
        name: string;
        markers: ExtendedMarker[];
        layerId: string;
        type: string;
    }

    export interface ExtendedLayer extends Layer {
        _url: string;
    }

    interface Event {
        eventType: string;
        eventAction: any;
    }

    export interface ExtendedMarker extends Marker {
        addTo(Map): void
        layerId: string;
    }

    @Component({ })
    export default class Map extends Vue {
        private layerControl: LayerControl;
        private map: LeafleatMap;

        @Prop({ default: "500px" }) public width!: string;
        @Prop({ default: "500px" }) public height!: string;
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
            this.layerControl = L.control.layers({ satellite, plan }).addTo(this.map);
            this.map.addControl(new L.control.fullscreen());
            this.mapControls.forEach((control: Control) => {
                control.addTo(this.map);
            });
        }

        @Watch("markers") public onMarkersChange() {
            this.updateMarker();
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

        private updateMarker(): void {
            // Remove all layers except main layers (e.g: google map)
            this.map.eachLayer((layer: ExtendedLayer): void => {
                if (!layer._url) {
                    layer.removeFrom(this.map);
                    this.layerControl.removeLayer(layer);
                }
            });

            if (this.markers.length > 0) {
                // Add all layer on map
                this.markers.forEach((markerList: MarkerList) => {
                    this.addMarkerToLayer(markerList);
                });
            }

            // Focus map on bounds (coordinates list)
            if (this.bounds.length > 0) {
                this.map.fitBounds(this.bounds, { maxZoom: 14 });
            }
        }

        private addMarkerToLayer(markerList: MarkerList): void {
            const layer = L.layerGroup(markerList.markers);
            layer.addTo(this.map);
            this.layerControl.addOverlay(layer, markerList.name);
        }
    }
</script>
