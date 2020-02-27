import moment from "moment";

const formatNumber = (value: any, precision: number, suffix: string = "", showError: boolean = true) => {
    const originalValue = value;
    if (typeof value === "string" && value.length > 0) {
        value = parseFloat(value);
    }
    if (typeof value !== "number") {
        return "";
    }

    const locale = "fr";
    const options = {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    };
    const formatter = new Intl.NumberFormat(locale, options);

    let result = formatter.format(value) + suffix;

    if ("NaN" + suffix === result && !showError) {
        return originalValue;
    }

    if ("NaN" + suffix === result) {
        result = "<span class='red-text'>Nombre attendu</span>";
    }

    return result;
};

const formatDate = (value: any, entryFormat: string, displayFormat: string): string => {
    return moment(value, entryFormat).format(displayFormat);
};

export default {
    install(Vue: any) {
        Vue.filter(
            "date",
            (
                value: string,
                entryFormat: string = "YYYY-MM-DD HH:mm:ss",
                displayFormat: string = "DD/MM/YYYY"
            ): string => {
                return formatDate(value, entryFormat, displayFormat);
            }
        );

        Vue.filter("datetime", (value: string, entryFormat: string = "YYYY-MM-DD HH:mm:ss"): string => {
            return formatDate(value, entryFormat, "DD/MM/YYYY HH:mm:ss");
        });

        Vue.filter("dashIfEmpty", (value: string) => {
            if (!value) {
                return "-";
            }
            return value;
        });

        Vue.filter("price", (value: any, precision: number = 2) => {
            return formatNumber(value, precision, " €");
        });

        Vue.filter("percent", (value: any, precision: number = 1) => {
            return formatNumber(value, precision, " %", false);
        });

        Vue.filter("number", (value: any, precision: number = 2, suffix: string = "") => {
            return formatNumber(value, precision, suffix);
        });

        Vue.filter("int", (value: any, precision: number = 0, suffix: string = "") => {
            return formatNumber(value, precision, suffix);
        });

        Vue.filter("string", (value: string, prefix: string = "", suffix: string = "") => {
            return prefix + value + suffix;
        });

        Vue.filter("text", (value: string, prefix: string = "", suffix: string = "") => {
            return prefix + value + suffix;
        });
    },
};
