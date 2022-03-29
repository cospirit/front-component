export interface Department {
    uuid: string;
    name: string;
}

export interface User {
    uuid: string;
    displayName: string;
    email: string;
    roles: string[];
    department: Department|null;
    internalAccount: boolean;
}

export default {
    state: {
        currentUser: null,
    },
    mutations: {
        setCurrentUser: (state: any, user: User) => {
            state.currentUser = user;
        },
    },
    getters: {
        getCurrentUser: (state: any) => {
            return state.currentUser;
        },
        isAdv: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "ADV");

        },
        isDsi: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "DSI");

        },
        isLocalMedia: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "Media Locaux");

        },
        getUserDepartment: (state: any) => {
            return (state.currentUser && state.currentUser.department ? state.currentUser.department.name : "");
        },
        isCospiritUser: (state: any) => {
            return (state.currentUser && !state.currentUser.internalAccount);
        },
    },
    actions: {
        /*
            Add your methods to populate this module by "extending" this object
         */
    },
};
