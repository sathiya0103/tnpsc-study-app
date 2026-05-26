import { registerRootComponent } from 'expo';
import "./global.css";

console.log("EXPO INDEX: RELOADED AT " + new Date().toLocaleTimeString());

import MainApp from './MainApp';

registerRootComponent(MainApp);
