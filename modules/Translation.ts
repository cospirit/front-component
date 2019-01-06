import Http, {Data} from "cospirit-front-component/Http";
import M from "materialize-css";

const UPDATE_CURRENT_TRANSLATION = "UPDATE_CURRENT_TRANSLATION";

interface Translation {
    source: string;
    target: string;
    context: string;
}

export default {
    state: {
        translations: [],
    },
    mutations: {
        [UPDATE_CURRENT_TRANSLATION]: (state: any, translations: any) => {
            state.translations = translations;
        },
    },
    getters: {
        translate: (state: any) => {

            return (translate: string) => {
                let result = translate;
                state.translations.forEach((translation: Translation) => {
                    if (translate === translation.source) {
                        result = translation.target;
                    }
                });

                return result;
            };
        },
        loadTranslations: (state: any) => {

            return (route: string, context: string, next: any) => {
                const params = {
                    filters: {
                        context: context,
                    },
                    fields: [
                        "source",
                        "target",
                        "context",
                        "language.code",
                    ],
                };

                Http.search(
                    route,
                    params,
                    (data: Data) => { state.translations = data.data; next(); },
                    (error: Data) => {
                        state.translations = null;
                        M.toast({ html: error.message, classes: "red"});
                    },
                );
            };
        },
    },
};
