import Http, { Data } from "../Http";
import EventBus from "../EventBus";
import _ from "lodash";

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

export interface ICompetitor {
    uuid: string;
    name: string;
    lsaCode: string;
    postalCode: string;
    city: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    phone: string;
    fax: string;
    competitorGroup: {
        uuid: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export default {
    state: {
        competitorsGroup: [],
        competitorsType: [],
        getLogo(uuid: string): string {
            const competitorGroups = this.competitorsGroup;
            const competitorGroup = _.find(competitorGroups, (cg: ICompetitorGroup) => {
                return cg.uuid === uuid;
            });

            return competitorGroup ? competitorGroup.logoBase64 : "";
        },
    },
    mutations: {
        setCompetitorsGroup: (state: any, competitorsGroup: any[]) => {
            state.competitorsGroup = competitorsGroup;
        },
        setCompetitorsType: (state: any, competitorsType: any[]) => {
            state.competitorsType = competitorsType;
        },
    },
    getters: {
        competitorsGroup: (state: any) => {
            return state.competitorsGroup;
        },
        competitorsType: (state: any) => {
            return state.competitorsType;
        },
    },
    actions: {
        loadCompetitors: (store: { commit: any }) => {
            Http.search(
                "/search/competitortype",
                { fields: [ "parent.code", "name", "code", "uuid", "competitorGroups.uuid" ] },
                (data: Data) => {
                    store.commit("setCompetitorsType", data.data);
                },
                (error: Data) => {
                    store.commit("setCompetitorsType", null);
                    EventBus.$emit("error-alert",  { message: error.status.messages });
                },
            );
            Http.search(
                "/search/competitorgroup",
                { fields: [ "uuid", "name", "logoBase64" ] },
                (data: Data) => {
                    store.commit("setCompetitorsGroup", data.data);
                },
                (error: Data) => {
                    store.commit("setCompetitorsGroup", null);
                    EventBus.$emit("error-alert", { message: error.status.messages });
                },
            );
        },
    },
};
