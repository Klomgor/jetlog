// cannot store boolean in localStorage
export interface ConfigInterface {
    frequencyBasedMarker: string;
    frequencyBasedLine: string;
    //militaryClock: string;
    metricUnits: string;
}
const ConfigKeys = ["frequencyBasedMarker", "frequencyBasedLine", /*"militaryClock",*/ "metricUnits"];
type Config = typeof ConfigKeys[number];

const defaultConfig: ConfigInterface = {
    frequencyBasedMarker: "false",
    frequencyBasedLine: "false",
    //militaryClock: "true",
    metricUnits: "true"
}

class ConfigStorageClass {
    constructor() {
        for(let key of ConfigKeys) {
            const current = localStorage.getItem(key);

            if(current === null) {
                localStorage.setItem(key, defaultConfig[key]);
            }
        }
    }

    getSetting(setting: Config): string|null {
        return localStorage.getItem(setting);
    }

    getAllSettings(): ConfigInterface{
        var settings: ConfigInterface = defaultConfig;

        for(let key of ConfigKeys) {
            settings[key] = this.getSetting(key);
        }

        return settings;
    }

    setSetting(setting: Config, value: string): void {
        localStorage.setItem(setting, value)
    }
}
const ConfigStorage = new ConfigStorageClass();
export default ConfigStorage;