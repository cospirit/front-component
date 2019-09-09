import { LatLng } from "leaflet";
import moment from "moment";

interface Attributes {
    [key: string]: number;
}

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

    static weeksCount(beginDate: string, endDate: string): number {
        const mBeginDate = moment(beginDate, "DD-MM-YYYY");
        const mEndDate = moment(endDate, "DD-MM-YYYY");
        return Math.ceil(mEndDate.diff(mBeginDate, "day") / 7);
    }

    static isSidebarActive(name: string): boolean {
        const element = _.invoke(document, "querySelector", ".leaflet-sidebar-tabs .active a");

        if (!element) {
            return false;
        }

        return (name === element.getAttribute("name"));
    }

    static processAttributes(irisAttributes: Attributes, totalIrisAttributes: Attributes): Attributes {
        return {
            numberOfMen: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfMen", "population",
            ),
            numberOfWomen: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfWomen", "population",
            ),
            ageBetween0and17: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween0and17", "population",
            ),
            ageBetween18and24: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween18and24", "population",
            ),
            ageBetween25and39: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween25and39", "population",
            ),
            ageBetween40and54: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween40and54", "population",
            ),
            ageBetween55and64: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween55and64", "population",
            ),
            ageBetween65and79: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween65and79", "population",
            ),
            ageBetween80andMore: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween80andMore", "population",
            ),
            numberOfSecondaryHousing: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfSecondaryHousing", "numberOfHousing",
            ),
            numberOfHouseBaseHousehold: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfHouseBaseHousehold", "numberOfHouseHold",
            ),
            numberOfApartmentBaseHousehold: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfApartmentBaseHousehold", "numberOfHouseHold",
            ),
            numberOfOwner: (irisAttributes.numberOfOwner /
                (irisAttributes.numberOfOwner + irisAttributes.numberOfTenant) * 100) /
                (totalIrisAttributes.numberOfOwner /
                    (totalIrisAttributes.numberOfOwner + totalIrisAttributes.numberOfTenant) * 100) * 100,
            numberOfTenant: (irisAttributes.numberOfTenant /
                (irisAttributes.numberOfOwner + irisAttributes.numberOfTenant) * 100) /
                (totalIrisAttributes.numberOfTenant /
                    (totalIrisAttributes.numberOfOwner + totalIrisAttributes.numberOfTenant) * 100) * 100,
            numberOfFamilyWithChild: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfFamilyWithChild", "numberOfFamily",
            ),
            numberOfActiveCSPP: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfActiveCSPP", "ageBetween15andMore",
            ),
            numberOfActiveCSPM: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfActiveCSPM", "ageBetween15andMore",
            ),
            numberOfRetiredBetween64andMore: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfRetiredBetween64andMore", "ageBetween15andMore",
            ),
            numberOfUnactiveBetween15and64: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfUnactiveBetween15and64", "ageBetween15andMore",
            ),
        };
    }

    static getPercentageForAttribute(
        irisAttributes: Attributes,
        totalIrisAttributes: Attributes,
        attribute: string,
        divider: string,
    ): number {
        if (!irisAttributes[divider]) {
            irisAttributes[divider] = 1;
        }

        return 100 *
            (irisAttributes[attribute] / irisAttributes[divider])
            / (totalIrisAttributes[attribute] / totalIrisAttributes[divider]);
    }
}
