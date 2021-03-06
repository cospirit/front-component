import { LatLng } from "leaflet";
import moment from "moment";
import _ from "lodash";

interface Attributes {
    [key: string]: number;
}

export default class Tools {
    public static generateUuid(mask: string = "xxxxxxxx"): string {
        return mask + "-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const d = new Date().getTime();
            // tslint:disable-next-line:no-bitwise
            const r = (d + Math.random() * 16) % 16 | 0;
            // tslint:disable-next-line:no-bitwise
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    public static generateFakeUuid(): string {
        return this.generateUuid("0FA4E1D0");
    }

    public static weeksCount(beginDate: string, endDate: string): number {
        const mBeginDate = moment(beginDate, "DD-MM-YYYY");
        const mEndDate = moment(endDate, "DD-MM-YYYY");
        return Math.ceil(mEndDate.diff(mBeginDate, "day") / 7);
    }

    public static processAttributes(irisAttributes: Attributes, totalIrisAttributes: Attributes): Attributes {
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

    public static getPercentageForAttribute(
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
