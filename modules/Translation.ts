import Http, {Data} from "cospirit-front-component/Http";
import M from "materialize-css";

const TRANSLATION_ROUTE = "/search/translation";

interface Translation {
    source: string;
    target: string;
    context: string;
}

export default {
    state: {
        translations: [],
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

            return (context: string) => {
                const params = {
                    filters: {
                        context,
                    },
                    fields: [
                        "source",
                        "target",
                        "context",
                        "language.code",
                    ],
                };

                Http.search(
                    TRANSLATION_ROUTE,
                    params,
                    (data: Data) => { state.translations = data.data; },
                    (error: Data) => {
                        state.translations = null;
                        M.toast({ html: error.message, classes: "red"});
                    },
                );
            };
        },
    },
};
