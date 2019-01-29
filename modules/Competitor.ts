import Http, {Data} from "cospirit-front-component/Http";
import M from "materialize-css";

export interface ICompetitorType {
    uuid: string;
    code: string;
    name: string;
    parent: IParentCompetitorType | null;
    competitorGroups: ICompetitorGroup[];
}

export interface IParentCompetitorType {
    code: string;
}

export interface ICompetitorGroup {
    uuid: string;
    logoBase64: string;
    name: string;
}

export default {
    state: {
        competitorsGroup: [],
        competitorsType: [],
    },
    getters: {
        loadCompetitors: (state: any) => {
            return () => {
                Http.search(
                    "/search/competitortype",
                    { fields: ["parent.code", "name", "code", "uuid", "competitorGroups.uuid"] },
                    (data: Data) => {
                        state.competitorsType = data.data;
                    },
                    (error: Data) => {
                        state.competitorsType = null;
                        M.toast({ html: error.message, classes: "red" });
                    },
                );
                Http.search(
                    "/search/competitorgroup",
                    { fields: ["uuid", "name", "logoBase64"] },
                    (data: Data) => {
                        state.competitorsGroup = data.data;
                    },
                    (error: Data) => {
                        state.competitorsGroup = null;
                        M.toast({ html: error.message, classes: "red" });
                    },
                );
            };
        },
    },
};
