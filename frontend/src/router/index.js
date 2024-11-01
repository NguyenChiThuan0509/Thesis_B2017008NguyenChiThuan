import { createRouter, createWebHistory } from "vue-router";
import MainContents from "../components/MainContent.vue";
import AddStudent from "../components/sidebars/AddStudent.vue";
import ExamSchedule from "../components/sidebars/ExamSchedule.vue";
import SearchResult from "../components/sidebars/SearchResult.vue";
import SearchDegree from "../components/sidebars/SearchDegree.vue";
import Teacher from "../components/sidebars/Teacher.vue";
import Contact from "../components/sidebars/Contact.vue";
import InCourse from "../components/courses/InCourse.vue";
import InAddStudent from "../components/sidebars/InAddStudent.vue";
import AddClass from "../components/courses/AddClass.vue";
import UpdateClass from "../components/courses/UpdateClass.vue";

const routes = [
  { path: "/", component: MainContents },
  { path: "/addstudent", component: AddStudent },
  { path: "/examschedule", component: ExamSchedule },
  { path: "/searchresult", component: SearchResult },
  { path: "/searchdegree", component: SearchDegree },
  { path: "/teacher", component: Teacher },
  { path: "/contact", component: Contact },
  { path: "/addclass", name: "AddClass", component: AddClass },
  {
    path: "/update-class/:id",
    name: "UpdateClass",
    component: UpdateClass,
  },
  {
    path: "/incourse/:id",
    name: "InCourse",
    component: InCourse,
  },
  {
    path: "/addstudent/:id",
    name: "InAddStudent",
    component: InAddStudent,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
