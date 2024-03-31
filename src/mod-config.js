import { setModConfig } from "../framework/js/utils/config-utils.js";

setModConfig({
    info: {
        name: "Change This",
        id: "Change this to something unique",
        author: "Change this",
        version: {
            name: "Name of mod version",
            number: "0.1",
        }
    },
    changelog: {},
    isEndgame: () => false,
});