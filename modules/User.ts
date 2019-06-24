import Router, { Route } from "vue-router";
import Http, {Data} from "cospirit-front-component/Http";
import Configuration from "cospirit-front-component/Configuration";
import M from "materialize-css";
import { decode } from "jwt-simple";

const LOGIN_ROUTE = "/search/token";
const refreshToken = (state: any, router: Router, afterLoad: any) => {

    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
    }

    Http.search(
        LOGIN_ROUTE,
        {
            fields: [
                "token",
                "user.uuid",
                "user.displayName",
                "user.email",
                "user.roles",
                "user.department.uuid",
                "user.department.name",
            ],
        },
        (data: Data) => {
            state.currentUser = data.data.user;
            localStorage.setItem("access_token", data.data.token);
            if (afterLoad) {
                afterLoad();
            }

            const route = router.resolve(location.href.replace(location.origin, "")).route;
            if ("token" === route.name) {
                const lastRoute = localStorage.getItem("lastRoute");
                localStorage.setItem("lastRoute", "");
                router.push({path: lastRoute ? lastRoute : "/"});
            }

            // refresh all 3 mn
            if (!state.timeoutId) {
                state.timeoutId = setTimeout(() => { refreshToken(state, router); }, 60 * 3 * 1000);
            }
        },
        (error: Data) => {
            state.currentUser = null;
            localStorage.setItem("access_token", "");
            M.toast({ html: error.message, classes: "red"});
        },
    );
};

export default {
    state: {
        currentUser: null,
        timeoutId: null,
        refreshUser: (state: any, router: Router, afterLoad: any) => {
            refreshToken(state, router, afterLoad);
        },
    },
    getters: {
        isAdv: (state: any) => {
            if (state.currentUser && state.currentUser.department && state.currentUser.department.name === "ADV") {
                return true;
            }
            return false;
        },
        isDsi: (state: any) => {
            if (state.currentUser && state.currentUser.department && state.currentUser.department.name === "DSI") {
                return true;
            }
            return false;
        },
        getUserDepartment: (state: any) => {
            return (state.currentUser && state.currentUser.department ? state.currentUser.department.name : "");
        },
        loadUserUsingSSO: (state: any) => {

            return (router: Router, afterLoad: any) => {
                // controle route
                router.beforeEach((to: Route, from: Route, next: any) => {
                    // Set current access_token
                    if ("token" === to.name) {
                        localStorage.setItem("access_token", to.query.code ? to.query.code : "");
                        state.refreshUser(state, router, afterLoad);

                        return;
                    }

                    // get access_token
                    const accesToken: string | null = localStorage.getItem("access_token");

                    let validToken = false;
                    if (accesToken) {
                        // Test valid access_token
                        try {
                            const token = decode(accesToken, "", true);
                            if (token.exp <= (new Date()).getTime() / 1000) {
                                localStorage.setItem("access_token", "");
                            } else {
                                validToken = true;
                            }
                        } catch (error) {
                            console.log("Token decode error : " + error);
                        }
                    }

                    // access_token not valid
                    if (!validToken) {
                        localStorage.setItem("lastRoute",  to.path + to.hash);

                        location.href = Configuration.get("ssoUri") +
                            location.origin +
                            router.resolve({ name: "token" }).href;

                        return;
                    }

                    // Have user
                    if (!state.currentUser) {
                        state.refreshUser(state, router, afterLoad);
                    }

                    next();
                });
            };
        },
    },
};
