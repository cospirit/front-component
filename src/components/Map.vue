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
import L from "leaflet";
import { Pin } from "./MapInterfaces";
import { Icon, Marker, Map as LeafleatMap, LatLngBoundsExpression, Layer, LatLng } from "leaflet";

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

    @Prop() public bounds!: LatLngBoundsExpression;
    @Prop({ default: [] }) public markers!: MarkerList[];
    @Prop({ default: "500px" }) public width!: string;
    @Prop({ default: "500px" }) public height!: string;
    @Prop({ default: 13 }) public zoom!: number;

    public mounted(): void {
        this.map = L.map("map").setView(
            [ 45.749095 , 4.82665 ],
            this.zoom,
        );
        L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
                maxZoom: 20,
                subdomains: [ "mt0" ],
            },
        ).addTo(this.map);
        this.layerControl = L.control.layers().addTo(this.map);
        this.updateMarker();
    }

    @Watch("markers") public onMarkersChange() {
        this.updateMarker();
    }

    private updateMarker(): void {
        this.map.eachLayer((layer: any) => {
            if (layer.id) {
                this.map.removeLayer(layer);
            }
        });

        this.markers.forEach((markerList: MarkerList) => {
            this.addMarkerToLayer(markerList);
        });
        this.map.fitBounds(this.bounds, { maxZoom: 14 });
    }

    private addMarkerToLayer(markerList: MarkerList): object {
        const layer = L.layerGroup(markerList.markers);
        layer.addTo(this.map);
        this.layerControl.addOverlay(layer, markerList.name);

        return layer;
    }

    public static createEntityMarkerList(entityList: any[], clickable: any, draggable: any): Marker[] {
        const list: any[] = [];
        entityList.forEach((entity) => {
            const pin = {
                latitude: entity.address.coordinates.latitude,
                longitude: entity.address.coordinates.longitude,
                logo: _.get(entity.logo, "link", null),
            };
            list.push(this.createEntityMarker(pin, clickable, draggable));
        });

        return list;
    }

    public static createEntityMarker(pin: Pin, clickable: any, draggable: any): Marker {
        return this.createMarker(
            pin.latitude,
            pin.longitude,
            pin.logo,
            clickable,
            draggable,
        );
    }

    public static createMarker(lat: number, lng: number, icon: string, clickable: any, draggable: any): Marker {
        const marker = L.marker(
            [ lat, lng ],
            {
                draggable: !!draggable,
                clickable: !!clickable,
                icon: this.getCustomMarkerSvgCode(icon),
            },
        );

        if (draggable) {
            marker.on("drag", () => {
                draggable(marker);
            });
        }

        if (clickable) {
            clickable(marker);
        }

        return marker;
    }

    public static getCustomMarkerSvgCode(icon: string): Icon {
        icon = icon ? icon : "#1B5E20";
        let url = icon;
        const reg = new RegExp("^#");
        if (reg.test(icon)) {
            url = "data:image/svg+xml;charset=utf-8," +
            "<svg fill='" + icon + "' height='36' viewBox='0 0 24 24' width='36' xmlns='http://www.w3.org/2000/svg'>" +
            "<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0" +
            "9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>" +
            "<path d='M0 0h24v24H0z' fill='none'/>" +
            "</svg>";
        }

        return L.icon({
            iconUrl: url,
        });
    }
}
</script>
