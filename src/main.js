import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import clickOutside from "./directives/clickOutside"; // Adjust the import path according to your project structure

import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("./views/HomeN.vue") },
  { path: "/about", component: () => import("./views/About.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const app = createApp(App);

app.directive("click-outside", clickOutside);

app.use(router);
app.use(VueQueryPlugin, { queryClient });

app.mount("#app");
