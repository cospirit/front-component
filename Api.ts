import $http from "axios";
import Loading from "./modules/Loading";
import Configuration from "./Configuration";
import EventBus from "./EventBus";
import _ from "lodash";


export default abstract class Api {
    protected baseUrl: string;

    protected constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public getHeaders(): object {
        const accessToken: string = localStorage.getItem("access_token") || "";
        return {
            Authorization: accessToken.indexOf(":") > 0 ?
                "Basic " + Buffer.from(accessToken).toString("base64") :
                "Bearer " + accessToken,
        };
    }

    /**
     * You must overload this method if you extend Api
     */
    public static getBaseObject(): Api {
        throw new Error("You must extend the Api class to use it");
    }

    public static get(link: string, params: object, successFunction: any, errorFunction?: any): void {
        this.getBaseObject().call("get", link, {}, successFunction, errorFunction, {params});
    }

    protected call(
        method: string,
        link: string,
        data: object,
        successFunction: any,
        errorFunction: any,
        extraConfig: any = {}
    ) {
        const currentTimestamp = Date.now();
        Loading.mutations.increase(Loading.state);
        $http
            .request(
                _.assign(
                    {
                        url: this.baseUrl + link,
                        headers: this.getHeaders(),
                        method,
                        data,
                    },
                    extraConfig
                )
            )
            .then((response) => {
                Loading.mutations.decrease(Loading.state);
                if (Configuration.get("lastValidTimestamp") <= currentTimestamp) {
                    if (successFunction) {
                        successFunction(response.data);
                    } else {
                        EventBus.$emit("success-alert", {message: "Operation successfully completed."});
                    }
                }
            }).catch((error: { response: { data: any } | null }) => {
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
                        (messages: string[] | string, fieldName: string) => {
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

            EventBus.$emit("error-alert", {message: errorFunction});
        });
    }
}
