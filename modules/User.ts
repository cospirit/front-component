export interface Department {
    uuid: string;
    name: string;
}

export interface hideFeature {
    code: string;
}

export interface User {
    uuid: string;
    displayName: string;
    email: string;
    roles: string[];
    userHideFeatures: hideFeature[];
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
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "_DAF");

        },
        isDsi: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "_DSI");

        },
        isLocalMedia: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "_MEDIA_LOCAUX");

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
