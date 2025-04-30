// webpack.config.js
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "react-native$": "react-native-web",
    // Alias RN internal utilities to RNW exports:
    "react-native/Libraries/Utilities/Platform$": require.resolve(
      "react-native-web/dist/exports/Platform"
    ),
    "react-native/Libraries/Utilities/Dimensions$": require.resolve(
      "react-native-web/dist/exports/Dimensions"
    ),
    // add any others you hit (e.g. DeviceInfo, PixelRatio, etc.)
  };
  config.resolve.extensions = [".web.js", ".js", ".json", ".web.jsx", ".jsx"];
  return config;
};
