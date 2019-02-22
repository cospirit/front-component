import L, { Icon, Marker }  from "leaflet";
import _ from "lodash";

export interface IPin {
    longitude: number;
    latitude: number;
    logo: string;
}

export interface ExtendedMarker extends Marker {
    uuid: string;
}

export default class Pin {

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

    public static createEntityMarker(pin: IPin, clickable: any, draggable: any): Marker {
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
                "<svg xmlns=\"http://www.w3.org/2000/svg\" style='fill: " + Pin.HEX2RGB(icon) + "'>" +
                "<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm09.5c-1.38 " +
                "0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/>" +
                "</svg>";
        }

        return L.icon({
            iconUrl: url,
            iconAnchor: [18, 18],
        });
    }

    public static HEX2RGB(hex: string): string {
        if ("#" === hex.charAt(0)) {
            hex = hex.substr(1);
        }
        if ((2 > hex.length) || (6 < hex.length)) {
            return "";
        }
        var values = hex.split(""), r, g, b;

        if (2 === hex.length) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = r;
            b = r;
        } else if (3 === hex.length) {
            r = parseInt(values[0].toString() + values[0].toString(), 16);
            g = parseInt(values[1].toString() + values[1].toString(), 16);
            b = parseInt(values[2].toString() + values[2].toString(), 16);
        } else if (6 === hex.length) {
            r = parseInt(values[0].toString() + values[1].toString(), 16);
            g = parseInt(values[2].toString() + values[3].toString(), 16);
            b = parseInt(values[4].toString() + values[5].toString(), 16);
        } else {
            return "";
        }

        return "rgb(" + r + "," + g + "," + b + ")";
    }
}