import $http from "axios";
import Loading from "./modules/Loading";
import _ from "lodash";
import Configuration from "./Configuration";
import EventBus from "./EventBus";
import {Data} from "./Http";

export default class Universe {

    public static getHeaders(): object {
        const accessToken: string = localStorage.getItem("universe_access_token") || "";

        return {
            "X-Requested-With": "XMLHttpRequest",
            "Authorization" : accessToken.indexOf(":") > 0 ?
                "Basic " + Buffer.from(accessToken).toString("base64") :
                "Bearer " + accessToken,
        };
    }

    public static search(link: string, params: object, successFunction: any, errorFunction?: any): void {
        new Universe().call("post", link, params, successFunction, errorFunction);
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
                EventBus.$emit("success-alert", {message: "Coucou"});
        }).catch((error: {response: {data: Data}|null}) => {
            Loading.mutations.decrease(Loading.state);
            console.log(error);
        } );
    }
}
