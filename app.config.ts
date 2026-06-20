import { ExpoConfig } from "expo/config";

const appJson = require("./app.json") as { expo: ExpoConfig };

const mapsPlugin = [
  "react-native-maps",
  {
    androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
] as [string, any];

const plugins = [...(appJson.expo.plugins || []), mapsPlugin];

export default ({ ...appJson.expo, plugins } satisfies ExpoConfig);
