import axios from "axios";
import EventBus from "./EventBus";

class Configuration {
    private configuration: { [index: string]: any } = {
        debug: false,
        env: "prod",
        apiUri: "",
        ssoUri: "",
        lastValidTimestamp: 0,
    };

    constructor() {
        EventBus.$on("unvalid-old-actions", () => {
            this.configuration.lastValidTimestamp =  Date.now();
        });
    }

    /**
     * Load configuration using Promise
     */
    public load(configurationFilePath = location.origin + "/configuration.json"): Promise<object> {
        return new Promise((resolve: any) => {
            axios
                .get(configurationFilePath)
                .then((response) => {
                    this.configuration = {
                        ...this.configuration,
                        ...response.data,
                    };
                    resolve(this.configuration);
                })
                .catch((error) => {
                    if (this.configuration.debug) {
                        console.log(error);
                    }
                    resolve(this.configuration);
                });
        });
    }

    /**
     * Get configuration by label.
     * @param label
     */
    public get(label: string): any {
        return this.configuration.hasOwnProperty(label)
            ? this.configuration[label]
            : "";
    }
}

export default new Configuration();
