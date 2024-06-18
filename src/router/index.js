import { createMemoryHistory, createRouter } from "vue-router";

// import Home from "./../pages/Home";
// import About from "./../pages/About";

const routes = [
  { path: "/", component: () => import("./components/views/Home1.vue") },
  { path: "/about", component: () => import("@/components/views/About.vue") },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
