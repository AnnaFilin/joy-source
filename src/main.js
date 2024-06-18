import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import clickOutside from "./directives/clickOutside"; // Adjust the import path according to your project structure

import "./style.css";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";

const pinia = createPinia();

const routes = [
  { path: "/", component: () => import("./views/Home.vue") },
  { path: "/about", component: () => import("./views/About.vue") },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

app.directive("click-outside", clickOutside);

app.use(router);
app.use(pinia);
app.use(VueQueryPlugin);

app.mount("#app");
