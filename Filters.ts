import moment from "moment";

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

        Vue.filter("price", (value: any | string, precision: number = 2) => {
            if(typeof value === "string" && value.length > 0) {
                value = parseInt(value);
            }
            if (typeof value !== "number") {
                return "";
            }

            const locale = "fr";
            const options = {
                style: "currency",
                currency: "eur",
                minimumFractionDigits: precision,
                maximumFractionDigits: precision,
            };
            const formatter = new Intl.NumberFormat(locale, options);

            return formatter.format(value);
        });

        Vue.filter("percent", (value: any, precision: number = 1) => {
            if(typeof value === "string" && value.length > 0) {
                value = parseInt(value);
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

            return formatter.format(value) + " %";
        });

        Vue.filter("number", (value: any, precision: number = 2, suffix: string = "") => {
            if(typeof value === "string" && value.length > 0) {
                value = parseInt(value);
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

            return formatter.format(value) + suffix;
        });

        Vue.filter("int", (value: any, precision: number = 0, suffix: string = "") => {
            if(typeof value === "string" && value.length > 0) {
                value = parseInt(value);
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

            return formatter.format(value) + suffix;
        });

        Vue.filter("string", (value: string, prefix: string = "", suffix: string = "") => {
            return prefix + value + suffix;
        });
    },
};
