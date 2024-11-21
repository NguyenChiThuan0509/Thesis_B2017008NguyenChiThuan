import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store"; // Import Vuex store
import router from "./router";

import "./assets/main.css";

createApp(App).use(router).use(store).mount("#app"); // Sử dụng Vuex
