const dotenv = require("dotenv");
const resolveEnvVars = require("resolve-env-vars")
const { DefinePlugin } = require("webpack")

export default (config, env, helpers) => {
  Object.assign(config.output, {
    publicPath: process.env.PREACT_APP_BASEURL
  })

  if (config.devServer) {
    dotenv.config()
    Object.assign(config.devServer, {
      host: 'localhost'
    })
  }

  const { stringified, raw } = resolveEnvVars("PREACT_APP_");
  config.plugins.push(new DefinePlugin(stringified));

  const { plugin: htmlPlugin } =
    helpers.getPluginsByName(config, "HtmlWebpackPlugin")[0] || {};

  if (htmlPlugin) {
    // Pass all prefixed env vars to the HTML template.
    htmlPlugin.options.env = raw;
  }
}
