import { createRouter, createWebHistory } from "vue-router";

// 普通路由
export const constantRoutes = [
  {
    path: "/",
    redirect: '/login',
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
  },
];

// 公共路由
export const asyncRoutes = [
]

// 路由合并
function getAsyncRoutes() {
  let route = asyncRoutes.concat(constantRoutes);
  return route
}

// 创建路由
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: getAsyncRoutes()
})

export default router;
