import Vue from "vue";
import Component from "vue-class-component";
import L, { GeoJSON, GeoJSONOptions, LeafletEventHandlerFn } from "leaflet";

export interface Properties {
    popupContent: string;
    code: string | null;
}

export interface GeoPortalJson {
    type: string;
    coordinates: string
}

@Component({})
export default class GeoJson extends Vue {
    public static addPolygon(
        zone: number[][],
        properties: Properties | null,
        color: string,
        opacity: number = 1,
        type: string = "Polygon",
        contextMenu: LeafletEventHandlerFn | null = null,
        weight: number = 1,
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
            style: this.style(color, opacity, weight),
        };

        const geoJson = L.geoJSON(geojsonFeature, options);
        if (properties && properties.popupContent) {
            geoJson.bindPopup(properties.popupContent, { minWidth: 350 });
        }

        if (contextMenu) {
            geoJson.addEventListener("contextmenu", contextMenu);
        }

        return geoJson;
    }

    public static style(color: string, opacity: number, weight: number): any {
        return { color, opacity, weight };
    }

    public static toJson(strWkt: string): GeoPortalJson {
        // regex coordinates
        let regex = /(-?\d+\.?[0-9]*)\s(-?\d+\.?[0-9]+)/g;
        let subst = "[$1,$2]";
        strWkt = strWkt.replace(regex, subst);

        // regex type
        regex = /^(\w+)/;
        regex.exec(strWkt);

        subst = "{\"type\" : \"Polygon\",";
        strWkt = strWkt.replace(RegExp.$1, subst);
        // clean
        // (( --> coordinates : [[
        regex = /(\({2}?)/;
        subst = "\"coordinates\" : [[";
        strWkt = strWkt.replace(regex, subst);
        // )) --> ]]}
        regex = /(\){2}?)/;
        subst = "]]}";
        strWkt = strWkt.replace(regex, subst);
        // all ( --> [
        regex = /(\()/g;
        subst = "[";
        strWkt = strWkt.replace(regex, subst);
        // all ) --> ]
        regex = /(\))/g;
        subst = "]";
        strWkt = strWkt.replace(regex, subst);

        return JSON.parse(strWkt);
    }
}
