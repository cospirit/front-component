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
    import L, { Marker, Map as LeafleatMap, LatLngBoundsExpression, Layer }  from "leaflet";

    interface LayerControl {
        addOverlay(layer: object, name: string): void;
    }

    interface MarkerList {
        name: string;
        markers: Marker[];
        layerId: string;
    }

    @Component({ })
    export default class Map extends Vue {
        private layerControl: LayerControl;
        private map: LeafleatMap;

        @Prop({ default: null }) public bounds!: LatLngBoundsExpression[];
        @Prop({ default: [] }) public markers!: MarkerList[];
        @Prop({ default: "500px" }) public width!: string;
        @Prop({ default: "500px" }) public height!: string;
        @Prop({ default: 13 }) public zoom!: number;

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
            this.layerControl = L.control.layers({satellite, plan}).addTo(this.map);
        }

        @Watch("markers") public onMarkersChange() {
            this.updateMarker();
        }

        private updateMarker(): void {
            // Remove all layers except main layers (e.g: google map)
            this.map.eachLayer((layer: Layer) => {
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
                this.map.flyToBounds(this.bounds, { maxZoom: 14 });
            }
        }

        private addMarkerToLayer(markerList: MarkerList): object {
            const layer = L.layerGroup(markerList.markers);
            layer.addTo(this.map);
            this.layerControl.addOverlay(layer, markerList.name);

            return layer;
        }
    }
</script>
