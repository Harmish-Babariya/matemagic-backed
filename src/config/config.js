module.exports = function () {
  // set config
  if (!process.env.NODE_ENV) {
    console.error("FATAL ERROR: NODE_ENV environment is not defined");
    process.exit(1);
  }
  if (!process.env.URL_DEV) {
    console.error("FATAL ERROR: URL_DEV database environment is not defined");
    process.exit(1);
  }
  if (!process.env.URL_PROD && process.env.NODE_ENV === "production") {
    console.error("FATAL ERROR: URL_PROD database environment is not defined");
    process.exit(1);
  }
  if (!process.env.SECRET_STRING) {
    console.error(
      "FATAL ERROR: SECRET_STRING environment variable is not defined"
    );
    process.exit(1);
  }
};
