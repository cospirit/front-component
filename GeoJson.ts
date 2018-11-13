import Vue from "vue";
import Component from "vue-class-component";
import L, { GeoJSON,GeoJSONOptions } from "leaflet";

interface Properties {
    popupContent: string;
}

@Component({})
export default class GeoJson extends Vue {
    public static addPolygon(
        zone: number[][],
        properties: Properties,
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

        const geoJson = L.geoJSON(geojsonFeature, options);
        if (properties && properties.popupContent) {
            geoJson.bindPopup(properties.popupContent);
        }

        return geoJson;
    }

    public static style(color: string, opacity: number): any {
        return { color, opacity };
    }
}
