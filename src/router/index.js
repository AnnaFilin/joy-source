import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("./components/views/HomeN.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/components/views/About.vue"),
  },
  {
    path: "/location/:type/:id",
    name: "location",
    component: () => import("@/components/views/Location.vue"),
  },
  // {
  //   path: "/dogParks/:id",
  //   component: () => import("@/components/views/Location.vue"),
  // },
  // {
  //   path: "/bikeParkings/:id",
  //   component: () => import("@/components/views/Location.vue"),
  // },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
