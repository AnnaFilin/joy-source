import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", component: () => import("./components/views/HomeN.vue") },
  { path: "/about", component: () => import("@/components/views/About.vue") },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
