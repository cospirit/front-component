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
            numberOfHouseBaseHousehold: this.getPercentageForAttributeWithAttributeDividerSum(
                irisAttributes, totalIrisAttributes, "numberOfHouseBaseHousehold", "numberOfApartmentBaseHousehold"
            ),
            numberOfApartmentBaseHousehold: this.getPercentageForAttributeWithAttributeDividerSum(
                irisAttributes, totalIrisAttributes, "numberOfApartmentBaseHousehold", "numberOfHouseBaseHousehold"
            ),
            numberOfOwner: this.getPercentageForAttributeWithAttributeDividerSum(
                irisAttributes, totalIrisAttributes, "numberOfOwner", "numberOfTenant"
            ),
            numberOfTenant: this.getPercentageForAttributeWithAttributeDividerSum(
                irisAttributes, totalIrisAttributes, "numberOfTenant", "numberOfOwner"
            ),
            numberOfFamilyWithChild: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfFamilyWithChild", "numberOfFamily",
            ),
            numberOfActiveCSPP: this.getPercentageForAttributeCSP(
                irisAttributes, totalIrisAttributes, "numberOfActiveCSPP",
            ),
            numberOfActiveCSPM: this.getPercentageForAttributeCSP(
                irisAttributes, totalIrisAttributes, "numberOfActiveCSPM",
            ),
            numberOfRetiredBetween64andMore: this.getPercentageForAttributeCSP(
                irisAttributes, totalIrisAttributes, "numberOfRetiredBetween64andMore",
            ),
            numberOfUnactiveBetween15and64: this.getPercentageForAttributeCSP(
                irisAttributes, totalIrisAttributes, "numberOfUnactiveBetween15and64",
            ),
            numberOfStudentsAge18andMore: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfStudentsAge18andMore", "ageBetween15andMore",
            ),
            ageBetween18andMore: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "ageBetween18andMore", "ageBetween15andMore",
            ),
            numberOfActiveCsppHousehold: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfActiveCsppHousehold", "ageBetween15andMore",
            ),
            numberOfActiveCspmHousehold: this.getPercentageForAttribute(
                irisAttributes, totalIrisAttributes, "numberOfActiveCspmHousehold", "ageBetween15andMore",
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

    public static getPercentageForAttributeCSP(
        irisAttributes: Attributes,
        totalIrisAttributes: Attributes,
        attribute: string,
    ) {
        return (irisAttributes[attribute] /
                (irisAttributes[attribute] +
                    (irisAttributes.numberOfActiveCSPP + irisAttributes.numberOfActiveCSPM
                        + irisAttributes.numberOfRetiredBetween64andMore + irisAttributes.numberOfUnactiveBetween15and64)) * 100) /
            (totalIrisAttributes[attribute] /
                (totalIrisAttributes[attribute] +
                    (irisAttributes.numberOfActiveCSPP + irisAttributes.numberOfActiveCSPM
                        + irisAttributes.numberOfRetiredBetween64andMore + irisAttributes.numberOfUnactiveBetween15and64)
                ) * 100) * 100
    }

    public static getPercentageForAttributeWithAttributeDividerSum(
        irisAttributes: Attributes,
        totalIrisAttributes: Attributes,
        attribute: string,
        divider: string,
    ) {
        return (irisAttributes[attribute] /
                (irisAttributes[attribute] +
                    (irisAttributes[attribute] + irisAttributes[divider])) * 100) /
            (totalIrisAttributes[attribute] /
                (totalIrisAttributes[attribute] +
                    (totalIrisAttributes[attribute] + totalIrisAttributes[divider])
                ) * 100) * 100
    }
}
