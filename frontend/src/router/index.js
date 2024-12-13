import { createRouter, createWebHistory } from "vue-router";
import AddStudent from "../components/sidebars/AddStudent.vue";
import AddClass from "../components/courses/AddClass.vue";
import Contact from "../components/sidebars/Contact.vue";
import ExamSchedule from "../components/sidebars/ExamSchedule.vue";
import InCourse from "../components/courses/InCourse.vue";
import InExamSchedule from "../components/sidebars/InExamSchedule.vue";
import InAddStudent from "../components/sidebars/InAddStudent.vue";
import Login from "../components/Login.vue";
import MainContents from "../components/MainContent.vue";
import UpdateClass from "../components/courses/UpdateClass.vue";
import SearchResult from "../components/sidebars/SearchResult.vue";
import SearchResultClass from "../components/sidebars/SearchResultClass.vue";
import Teacher from "../components/sidebars/Teacher.vue";
import Profile from "../components/Profile.vue";
import ListUser from "../components/ListUser.vue";
import AddUser from "../components/AddUser.vue";
import AddExam from "../components/AddExam.vue";
import NotiExam from "../components/NotiExam.vue";

// Hàm giả để kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  // Nếu có token, bạn có thể thêm điều kiện kiểm tra như thời gian sống của token
  // Ví dụ: Nếu token đã hết hạn, trả về false.
  return true;
};

const routes = [
  { path: "/", component: MainContents },
  { path: "/examschedule", component: ExamSchedule },
  { path: "/searchresult", component: SearchResult },
  { path: "/searchresultclass", component: SearchResultClass },
  { path: "/teacher", component: Teacher },
  { path: "/contact", component: Contact },
  { path: "/login", name: "Login", component: Login },
  { path: "/addstudent", component: AddStudent },
  { path: "/listuser", component: ListUser },
  { path: "/adduser", component: AddUser },
  { path: "/notiexam", component: NotiExam },
  {
    path: "/add-exam",
    component: AddExam,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/addclass",
    name: "AddClass",
    component: AddClass,
    meta: { requiresAuth: true },
  },
  {
    path: "/update-class/:id",
    name: "UpdateClass",
    component: UpdateClass,
    props: true, // Truyền props
    meta: { requiresAuth: true },
  },
  {
    path: "/incourse/:id",
    name: "InCourse",
    component: InCourse,
    props: true,
  },
  {
    path: "/addstudent/:id",
    name: "InAddStudent",
    component: InAddStudent,
    props: true,
  },
  {
    path: "/inexamschedule/:id",
    name: "InExamSchedule",
    component: InExamSchedule,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Điều hướng bảo vệ
router.beforeEach((to, from, next) => {
  // Kiểm tra nếu route yêu cầu xác thực
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    next({ name: "Login" });
  } else {
    next(); // Tiếp tục điều hướng nếu đã đăng nhập hoặc route không yêu cầu
  }
});

export default router;
