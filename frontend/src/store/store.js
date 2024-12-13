import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    user: null, // Lưu thông tin người dùng
    isAuthenticated: !!localStorage.getItem("token"), // Trạng thái đăng nhập
  },
  mutations: {
    // Đặt thông tin người dùng và trạng thái đăng nhập
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    // Đăng xuất, xóa thông tin người dùng
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    // Xử lý logic đăng nhập
    async login({ dispatch }, token) {
      localStorage.setItem("token", token); // Lưu token vào localStorage
      await dispatch("fetchUserProfile"); // Lấy thông tin người dùng sau khi đăng nhập
    },
    // Lấy thông tin người dùng từ API
    async fetchUserProfile({ commit }) {
      const token = localStorage.getItem("token");
      if (!token) {
        commit("SET_USER", null);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Đảm bảo định dạng đúng
            },
          }
        );
        commit("SET_USER", response.data); // Lưu thông tin người dùng vào state
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        commit("SET_USER", null);
      }
    },
    // Xử lý đăng xuất
    logout({ commit }) {
      localStorage.removeItem("token"); // Xóa token khỏi localStorage
      commit("LOGOUT");
    },
  },
  getters: {
    // Lấy thông tin người dùng từ state
    user: (state) => state.user,
    // Lấy trạng thái đăng nhập
    isAuthenticated: (state) => state.isAuthenticated,
    // Lấy vai trò người dùng (nếu có)
    userRole: (state) => state.user?.role || "guest",
  },
});

export default store;
