<script lang="ts">
import { Marker } from "leaflet";

export interface ExtendedMarker extends Marker {
    uuid: string;
}

export interface Pin {
    longitude: number;
    latitude: number;
    logo: string;
}
</script>