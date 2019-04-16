import moment from "moment";

const formatNumber = (value: any, precision: number, suffix: string = "") => {
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
    if ("NaN" + suffix === result) {
        result = "<span class='red-text'>Nombre attendu</span>";
    }

    return result;
};

export default {
    install(Vue: any) {
        Vue.filter("date", (value: string, entryFormat: string, displayFormat: string) => {
            entryFormat =
                typeof entryFormat !== "undefined" ? entryFormat : "YYYY-MM-DD HH:mm:ss";
            displayFormat =
                typeof displayFormat !== "undefined" ? displayFormat : "DD/MM/YYYY";

            return moment(value, entryFormat).format(displayFormat);
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
            return formatNumber(value, precision, " %");
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
    },
};
