import axios from 'axios';
import _ from "lodash";
import EventBus from "./EventBus";

class Configuration {
    private configuration = {
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
    public load(configurationFilePath = location.origin + '/configuration.json'): any
    {
        return new Promise((resolve: any) => {
            axios
                .get(configurationFilePath)
                .then(response => {
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

    public get(label: string): any
    {
        return _.get(this.configuration, label, "");
    }
}

export default new Configuration();
