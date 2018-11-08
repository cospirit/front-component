import Vue from "vue";
import Component from "vue-class-component";
import L, { GeoJSON,GeoJSONOptions } from "leaflet";

@Component({})
export default class GeoJson extends Vue {
    public static addPolygon(
        zone: number[][],
        properties: object,
        color: string,
        opacity: number = 1,
        type: string = "Polygon"
    ): GeoJSON {
        const geojsonFeature: any = {
            "type": "Feature",
            "properties": properties,
            "geometry": {
                "type": type,
                "coordinates": [
                    zone
                ]
            }
        };
        const options: GeoJSONOptions = {
            style: this.style(color, opacity),
        };

        return L.geoJSON(geojsonFeature, options);
    }

    public static style(color: string, opacity: number): any {
        return { color, opacity };
    }
}
