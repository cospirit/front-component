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