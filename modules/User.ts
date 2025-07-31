export interface Department {
    uuid: string;
    name: string;
}

export interface hideFeature {
    code: string;
}

export interface Permission {
    name: string;
}

export interface User {
    uuid: string;
    displayName: string;
    email: string;
    roles: string[];
    userHideFeatures: hideFeature[];
    department: Department|null;
    internalAccount: boolean;
    applicationPermissions: Permission[];
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
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "DAF");

        },
        isDsi: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "DSI");

        },
        isLocalMedia: (state: any) => {
            return !!(state.currentUser && state.currentUser.department && state.currentUser.department.name === "MEDIA LOCAUX");

        },
        getUserDepartment: (state: any) => {
            return (state.currentUser && state.currentUser.department ? state.currentUser.department.name : "");
        },
        isCospiritUser: (state: any) => {
            return (state.currentUser && !state.currentUser.internalAccount);
        },
        hasPermission: (state: any) => (permissionName: string) => {
            if (!state.currentUser || !state.currentUser.applicationPermissions) {
                return false;
            }
            return state.currentUser.applicationPermissions.some((permission: Permission) => permission.name === permissionName);
        }
    },
    actions: {
        /*
            Add your methods to populate this module by "extending" this object
         */
    },
};
