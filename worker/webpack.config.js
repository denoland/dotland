// This is for the CloudFlare worker. Ideally this configuration could live in
// the worker sub-directory but it seems the github actions deployment doesn't
// like that.
module.exports = {
  target: "webworker",
  entry: "./index.js",
  mode: "production"
};
