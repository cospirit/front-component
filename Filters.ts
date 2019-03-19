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

        Vue.filter("price", (value: number, precision: number = 2) => {
            if (isNaN(value)) {
                value = 0.0;
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

        Vue.filter("percent", (value: number, precision: number = 1) => {
            if (isNaN(value)) {
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

        Vue.filter("number", (value: number, precision: number = 2, suffix: string = "") => {
            if (isNaN(value)) {
                value = 0.0;
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
