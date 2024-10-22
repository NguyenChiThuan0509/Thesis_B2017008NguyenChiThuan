import { createRouter, createWebHistory } from "vue-router";
import MainContents from "../components/MainContent.vue";
import AddStudent from "../components/AddStudent.vue";
import ExamSchedule from "../components/ExamSchedule.vue";
import SearchResult from "../components/SearchResult.vue";
import SearchDegree from "../components/SearchDegree.vue";
import Teacher from "../components/Teacher.vue";
import Contact from "../components/Contact.vue";
import InCourse from "../components/InCourse.vue";

const routes = [
  { path: "/", component: MainContents },
  { path: "/addstudent", component: AddStudent },
  { path: "/examschedule", component: ExamSchedule },
  { path: "/searchresult", component: SearchResult },
  { path: "/searchdegree", component: SearchDegree },
  { path: "/teacher", component: Teacher },
  { path: "/contact", component: Contact },
  { path: "/incourse", component: InCourse },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
