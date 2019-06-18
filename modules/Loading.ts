export default {
    state: {
        actionsCount: 0,
    },
    getters: {
        isLoading: (state: any): boolean => {
            return 0 < state.actionsCount;
        },
    },
    mutations: {
        increase: (state: any) => {
            state.actionsCount += 1;
        },
        decrease: (state: any) => {
            state.actionsCount -= 1;
        },
    },
    actions: {
        updateAction: ({ commit }: any, action: string) => {
            commit(action);
        }
    }
};
