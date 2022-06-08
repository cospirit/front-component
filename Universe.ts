import Api from "./Api";
import Configuration from "./Configuration";

export default class Universe extends Api {
    public getHeaders(): object {
        const accessToken: string = localStorage.getItem("access_token") || "";
        return {
            ...super.getHeaders(),
            "X-AUTH-TOKEN": accessToken,
        };
    }

    public static getBaseObject(): Universe {
        return new Universe(Configuration.get("universeUri"));
    }
}
