import $http from "axios";
import _ from "lodash";
import EventBus from "./EventBus";
import Configuration from "./Configuration";
import Loading from "./modules/Loading";

export interface Data {
    status: {
        code: number,
        messages: { [index: string]: string[]|string },
    };
    data: any;
}

export default class Http {

    public static getHeaders(): object {
        return {
            "X-Requested-With": "XMLHttpRequest",
            "Authorization" : "Bearer " + localStorage.getItem("access_token"),
        };
    }

    public static search(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Http().call("post", link, params, successFunction, errorFunction);
    }

    public static create(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Http().call("post", link, params, successFunction, errorFunction);
    }

    public static save(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Http().call("patch", link, params, successFunction, errorFunction);
    }

    public static delete(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Http().call("delete", link, params, successFunction, errorFunction);
    }

    public static download(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Http().call("get", link, params, successFunction, errorFunction, { responseType: "blob" });
    }

    private call(
        method: string,
        link: string,
        data: object,
        successFunction: any,
        errorFunction: any,
        extraConfig: any = {}
    ): void {
        const currentTimestamp = Date.now();
        Loading.mutations.increase(Loading.state);
        $http
            .request(
                _.assign(
                    {
                        url: Configuration.get("apiUri") + link,
                        headers: Http.getHeaders(),
                        method,
                        data,
                    },
                    extraConfig
                )
            )
            .then((response: any) => {
                Loading.mutations.decrease(Loading.state);
                if (Configuration.get("lastValidTimestamp") <= currentTimestamp) {
                    if (successFunction) {
                        successFunction(response.data);
                    } else {
                        EventBus.$emit("success-alert", { message: "Operation successfully completed." });
                    }
                }
            })
            .catch((error: { response: { data: Data }|null}) => {
                Loading.mutations.decrease(Loading.state);
                if (Configuration.get("lastValidTimestamp") > currentTimestamp) {
                    return;
                }

                if ("dev" === Configuration.get("debug")) {
                    console.log(error);
                }

                if (typeof errorFunction === "function" && error.response && error.response.data) {
                    return errorFunction(error.response.data);
                }

                if (typeof errorFunction !== "string") {
                    errorFunction = "The operation was not able to be made, please warn the IT team.";
                }

                if (error.response) {
                    if (_.get(error.response.data, "status.messages")) {
                        _.forEach(
                            error.response.data.status.messages,
                            (messages: string[]|string, fieldName: string) => {
                                errorFunction += fieldName + " : ";
                                if (typeof messages !== "string") {
                                    messages.forEach((message) => {
                                        errorFunction += message + "<br>";
                                    });
                                } else {
                                    errorFunction += messages + "<br>";
                                }
                            }
                        );
                    } else {
                        errorFunction = "The operation was not able to be made, please warn the IT team.";
                    }
                }

                EventBus.$emit("error-alert", { message: errorFunction });
            })
        ;
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
