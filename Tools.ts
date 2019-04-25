import { LatLng } from "leaflet";

export default class Tools {
    static generateUuid(mask: string = "xxxxxxxx"): string {
        return mask + "-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const d = new Date().getTime();
            const r = (d + Math.random() * 16) % 16 | 0;
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static generateFakeUuid(): string {
        return this.generateUuid("0FA4E1D0");
    }

    // Generate circle from center and radius for leaflet
    static generateMapCircke(center: LatLng, radius: number, nbPoints: number = 100, polygon: boolean = false): any {
        const d2r = Math.PI / 180; // degrees to radians
        const r2d = 180 / Math.PI; // radians to degrees

        // find the radius in lat/lon
        const rlat = r2d * radius / 6372800; // 6372800 is the radius of the earth in meters
        const rlng = rlat / Math.cos(center.lat * d2r);

        const circle = [];
        for (let i = 0; i < nbPoints + 1; i++) {
            const theta = Math.PI * (i / (nbPoints/2));
            const lng = center.lng + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
            const lat = center.lat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
            circle.push(new LatLng(lat, lng));
        }

        if (polygon) {
            return this.latLngToPolygon(circle);
        }

        return circle;
    }

    static latLngToPolygon(coordinates: LatLng[]): any {
        const polygon: any[] = [];
        coordinates.forEach((latLng: LatLng) => {
            polygon.push([latLng.lng, latLng.lat]);
        });

        return [polygon];
    }
}