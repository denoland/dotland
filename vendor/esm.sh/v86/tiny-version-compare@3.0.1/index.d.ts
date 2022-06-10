/**
 * Compare two software versions, with any number of points.
 *
 * Supports most version types, from "r12.3" to "1.03.4.234567-RC4". Development versions are sorted as: "dev", "alpha", "beta", "rc"
 *
 * @param versionA A version to compare.
 *
 * @param versionB A version to compare.
 *
 * @returns Returns -1 if versionA is greater, 1 if versionB is greater, 0 if the versions are equivalent.
 */
declare function compareVersions(versionA: string, versionB: string): number;
export = compareVersions;
