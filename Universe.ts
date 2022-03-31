import $http from "axios";
import Loading from "./modules/Loading";
import _ from "lodash";
import Configuration from "./Configuration";
import EventBus from "./EventBus";


export default class Universe {

    public static getHeaders(): object {
        const accessToken: string = localStorage.getItem("access_token") || "";
        return {
            // "X-Requested-With": "XMLHttpRequest",
            "Authorization": accessToken.indexOf(":") > 0 ?
                "Basic " + Buffer.from(accessToken).toString("base64") :
                "Bearer " + accessToken,
            "X-AUTH-TOKEN": accessToken,
        };
    }

    public static search(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Universe().call("get", link, params, successFunction, errorFunction);
    }

    private call(
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
                        url: Configuration.get("universeUri") + link,
                        headers: Universe.getHeaders(),
                        method,
                        data,
                    },
                    extraConfig
                )
            ).then((response) => {
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
            console.log(error);
        });
    }
}
