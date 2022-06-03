import _ from "lodash";
import Configuration from "./Configuration";
import Api from "./Api";

export interface Data {
    status: {
        code: number,
        messages: { [index: string]: string[]|string },
    };
    data: any;
}

export default class Http extends Api {

    public getHeaders(): object {
        return {
            ...super.getHeaders(),
            "X-Requested-With": "XMLHttpRequest",
        };
    }

    public static getBaseObject(): Http {
        return new Http(Configuration.get("apiUri"));
    }

    public static search(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("post", link, params, successFunction, errorFunction);
    }

    public static create(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("post", link, params, successFunction, errorFunction);
    }

    public static save(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("patch", link, params, successFunction, errorFunction);
    }

    public static delete(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("delete", link, params, successFunction, errorFunction);
    }

    public static download(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("get", link, [], successFunction, errorFunction, { responseType: "blob", params });
    }

    // getNeededFields from components list
    public static computeStandardFields(
        components: any,
        currentEntityName: string,
        entityNameToUse: string = "",
    ): string[] {
        const fields: string[] = [];
        const reg = new RegExp("^" + currentEntityName + ".");

        // For each component
        Object.values(components).forEach((component: unknown) => {
            // We check if the component has a getNeededFields function
            if (typeof _.invoke(component, "getNeededFields") !== "undefined") {
                // For each needed field
                _.invoke(component, "getNeededFields").forEach((field: string) => {
                    // We check if the field begins with the current entity name
                    // If so, we delete it by default or replace it with an optional entity name
                    const fieldName = field.replace(reg, entityNameToUse);

                    // We push the fielname in array if it is not already in
                    if (!fields.includes(fieldName)) {
                        fields.push(fieldName);
                    }
                });
            }
        });

        return fields;
    }
}
