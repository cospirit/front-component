import Http, {Data} from "cospirit-front-component/Http";
import M from "materialize-css";

export default {
    state: {
        currentUser: null,
    },
    getters: {
        getUser : (state: any) => {
            return (route: string, next: any) => {
                return state.currentUser;
            };
        },
        loadUser: (state: any) => {
            return (route: string, next: any) => {
                const params = {
                    fields: [
                        "token",
                        "user.uuid",
                        "user.displayName",
                        "user.email",
                        "user.roles"
                    ],
                };

                Http.search(
                    route,
                    params,
                    (data: Data) => {
                        state.currentUser = data.data.user;
                        localStorage.token = data.data.token;
                        next();
                    },
                    (error: Data) => {
                        state.currentUser = null;
                        localStorage.token = null;
                        M.toast({ html: error.message, classes: "red"});
                        next();
                    },
                );
            };
        },
    },
};
