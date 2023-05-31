import Http, {Data} from "../Http";
import EventBus from "../EventBus";

const TRANSLATION_ROUTE = "/search/translation";

interface Translation {
    source: string;
    target: string;
    context: string;
    language: Language;
}

interface Language {
    code: string;
    language: string;
}

export default {
    state: {
        translations: [],
        languages: [],
    },
    getters: {
        getAllLanguages: (state: any): any[] => {
            return state.languages;
        },
        translate: (state: any) => {
            const userLanguage = localStorage.getItem('userLanguage');
            let languageCode = navigator.language.substr(0, 2);
            if (userLanguage) {
                languageCode = userLanguage;
            }
            if (!state.languages.find((language: Language) => {
                return language.code === languageCode;
            })) {
                languageCode = 'en';
            }

            return (translate: string) => {
                let result = translate;
                state.translations.forEach((translation: Translation) => {
                    if (translate === translation.source && translation.language.code === languageCode) {
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
                        "language.language",
                    ],
                };

                Http.search(
                    TRANSLATION_ROUTE,
                    params,
                    (data: Data) => {
                        state.translations = data.data;
                        data.data.forEach((line: any) => {
                            if (!state.languages.find((language: Language) => {
                                return language.code === line.language.code;
                            })) {
                                state.languages.push(line.language);
                            }
                        });
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
