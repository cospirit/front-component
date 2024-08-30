import Http, {Data} from "../Http";
import EventBus from "../EventBus";

const TRANSLATION_ROUTE = "/list/translation";

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

                Http.get(
                    TRANSLATION_ROUTE,
                    {
                        context: context,
                        code: "fr",
                    },
                    (data: Data) => {
                        state.translations = data.data;
                    },
                    (error: Data) => {
                        state.translations = null;
                        EventBus.$emit("error-alert", {message: error.status.messages});
                    },
                );
            };
        },
    },
};
