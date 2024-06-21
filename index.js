import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import AppWrapper from './AppWrapper';
import { name as appName } from './app.json';
LogBox.ignoreAllLogs(true);

import 'react-native-gesture-handler';
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => AppWrapper);



// Register the service