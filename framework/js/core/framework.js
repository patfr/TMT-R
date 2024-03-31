/**
 * @typedef FrameworkConfig
 * @property {{number: string | number, name: string}} version
 * @property {import("../../lib/utils/config").Changelog} changelog
 */

/**
 * @type {FrameworkConfig}
 */
export const frameworkConfig = {
    version: {
        name: "Beta Beta",
        number: 0.1,
    },
    changelog: {},
};