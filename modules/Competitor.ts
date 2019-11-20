import Http, { Data } from "../Http";
import Pin from "../Pin";
import { Marker } from "leaflet";
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
        createPopCompetitor(competitor: ICompetitor, translate: (word: string) => string ): string {
            let html = "<div class=\"card\" style=\"background-color: #3a99fc;\"><h5 style=\"padding:5px;\">" +
                competitor.name + " ( " + competitor.city + ")" +
                "</h5></div><div class=\"row\"><div class=\"col s6\"><div>" +
                "<b>" + translate("address") + "</b><br>" +
                "<span>" + competitor.address1 + "</span><br>";

            if (competitor.address2) {
                html += "<span>" + competitor.address2 + "</span><br>";
            }
            if (competitor.address3) {
                html += "<span>" + competitor.address3 + "</span><br>";
            }
            if (competitor.address4) {
                html += "<span>" + competitor.address4 + "</span><br>";
            }

            html += "<br>" +
                competitor.postalCode + " " + competitor.city + "</div><br>" +
                "<div><b>" +
                translate("coordinates") + "</b><br>(Y) : " +
                competitor.coordinates.latitude + "<br>(X) : " +
                competitor.coordinates.longitude + "<br><br>";

            if (competitor.lsaCode) {
                html += "<b>" + translate("LSACode") + "</b> : <span>" + competitor.lsaCode
                    + "</span><br>";
            }

            if (competitor.phone) {
                html += "<b>" + translate("phone") + "</b> : <span>" + competitor.phone +
                    "</span><br>";
            }

            if (competitor.fax) {
                html += "<b>" + translate("fax") + "</b> : <span>" + competitor.fax +
                    "</span><br>";
            }

            html += "</div></div>";

            return html;
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
        competitorMarkers: (state: any) => {
            return (
                uuidCompetitorGroup: string[],
                center: object,
                range: number,
                createPopCompetitor: (competitor: ICompetitor, translate: (word: string) => string ) => any,
                callback: (list: Marker[]) => void,
                translate: (word: string) => string,
            ) => {
                const params = {
                    filters: {
                        uuidCompetitorGroup,
                        center,
                        range,
                    },
                    fields: [
                        "uuid",
                        "name",
                        "lsaCode",
                        "postalCode",
                        "city",
                        "address1",
                        "address2",
                        "address3",
                        "address4",
                        "phone",
                        "fax",
                        "competitorGroup.uuid",
                        "coordinates.latitude",
                        "coordinates.longitude",
                    ],
                };

                Http
                    .search(
                        "/search/competitor",
                        params,
                        (data: Data) => {
                            const markerList: Marker[] = [];
                            _.forEach(data.data, (competitor: ICompetitor) => {
                                const marker: Marker = Pin.createMarker(
                                    competitor.coordinates.latitude,
                                    competitor.coordinates.longitude,
                                    state.getLogo(competitor.competitorGroup.uuid),
                                    null,
                                    null,
                                    30,
                                    30,
                                );

                                const htmlPopUp = createPopCompetitor(competitor, translate);

                                marker.bindPopup(htmlPopUp, { minWidth: 500 });
                                marker.openPopup();

                                markerList.push(marker);
                            });
                            callback(markerList);

                        },
                        "errorLoadingCompetitors",
                    )
                ;
            };
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
                    EventBus.$emit(
                        "error-alert",
                        { message: error.message }
                    );
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
                    EventBus.$emit("error-alert", { message: error.message });
                },
            );
        },
    },
};
