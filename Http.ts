import $http from "axios";
import _ from "lodash";
import M from "materialize-css";
import Configuration from "cospirit-front-component/Configuration";
import Loading from "cospirit-front-component/modules/Loading";

export interface Data {
    message: string;
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
        (new Http).call("post", link, params, successFunction, errorFunction);
    }

    public static create(link: string, params: object, successFunction: any, errorFunction?: any): void {
        (new Http).call("post", link, params, successFunction, errorFunction);
    }

    public static save(link: string, params: object, successFunction: any, errorFunction?: any): void {
        (new Http).call("patch", link, params, successFunction, errorFunction);
    }

    public static delete(link: string, params: object, successFunction: any, errorFunction?: any): void {
        (new Http).call("delete", link, params, successFunction, errorFunction);
    }

    private call(method: string, link: string, data: object, successFunction: any, errorFunction: any): void {
        const currentTimestamp = Date.now();
        Loading.mutations.increase(Loading.state);
        $http
            .request(Configuration.get("apiUri") + link, {
                headers: Http.getHeaders(),
                method,
                data,
            })
            .then((response: any) => {
                Loading.mutations.decrease(Loading.state);
                if(Configuration.get("lastValidTimestamp") <= currentTimestamp) {
                    if (successFunction) {
                        successFunction(response.data);
                    } else {
                        M.toast({
                            html: "Operation successfully completed.",
                            classes: "green",
                        });
                    }
                }
            })
            .catch((error: any) => {
                Loading.mutations.decrease(Loading.state);
                if(Configuration.get("lastValidTimestamp") <= currentTimestamp) {
                    console.log(error);

                    if (typeof errorFunction === "function") {
                        errorFunction(error);
                    } else {
                        if (typeof errorFunction !== "string") {
                            errorFunction = "The operation was not able to be made, please warn the IT team.";
                        }

                        if (error.response) {
                            _.forEach(error.response.data.status.messages, (messages: string[], fieldName: string) => {
                                errorFunction += fieldName + " : ";
                                messages.forEach((message) => {
                                    errorFunction += message + "<br>";
                                });
                            });
                        }

                        M.toast({
                            html: errorFunction,
                            classes: "red",
                        });
                    }
                }
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
        Object.values(components).forEach((component: object) => {
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
