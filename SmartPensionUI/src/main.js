import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/index.scss";


//公共js
import Common from "@/assets/js/base.js";
const common = new Common();

const app = createApp(App);
app.config.globalProperties.common = common
// createApp(App).prototype.$path = function(name, query) {
//   this.$router.push({
//     name,
//     query,
//   });
// };
// createApp(App).prototype.$back = function(index) {
//   this.$router.go(index);
// };

createApp(App).use(store).use(router).mount("#app");
