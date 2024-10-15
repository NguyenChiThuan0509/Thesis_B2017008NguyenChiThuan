import { createRouter, createWebHistory } from "vue-router";
import Course from "../components/Course.vue";
import InCourse from "../components/InCourse.vue";

const routes = [
  { path: "/", component: Course },
  // { path: "/incourse", component: InCourse, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
