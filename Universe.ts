import Api from "./Api";
import Configuration from "./Configuration";
import {ApiPlatformArrayData} from "./model/ApiPlatform";

export default class Universe extends Api {
    public getHeaders(): object {
        const accessToken: string = localStorage.getItem("access_token") || "";
        return {
            ...super.getHeaders(),
            "X-AUTH-TOKEN": accessToken,
        };
    }

    public static getAll(link: string, params: object, successFunction: any, errorFunction?: any): void {
        let totalData: any[] = [];
        let totalItems = Infinity;
        const promises: Array<Promise<any[]>> = [];

        this.get(link, params, (data: ApiPlatformArrayData) => {
            totalData = data["hydra:member"];
            totalItems = data["hydra:totalItems"];
            if (totalData.length === totalItems) {
                successFunction(totalData);
                return;
            }
            const numberOfPages = Math.ceil(totalItems / totalData.length);
            for (let i = 1; i <= numberOfPages; i++) {
                promises.push(this.getPage(link, params, i));
            }

            Promise.all(promises).then((pages: any[][]) => {
                for (const page of pages) {
                    totalData = totalData.concat(page);
                }
                successFunction(totalData);
            });
        });
    }

    private static getPage(link: string, params: object, page: number): Promise<any[]> {
        return new Promise((resolve: (value: any[]) => void) => {
            this.get(
                link,
                {
                    page,
                    ...params
                },
                (data: ApiPlatformArrayData) => {
                    resolve(data["hydra:member"]);
                });
        });
    }

    public static getBaseObject(): Universe {
        return new Universe(Configuration.get("universeUri"));
    }
}
