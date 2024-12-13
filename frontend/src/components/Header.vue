<template>
    <header class="header">
        <div class="container">
            <div class="left-section">
                <router-link to="/">
                    <div class="logo">
                        <img src="@/assets/logo/profile.png" alt="Logo" />
                    </div>
                </router-link>
                <router-link to="/">
                    <span class="name-web">
                        Trung Tâm Điện Tử & Tin Học
                    </span>
                </router-link>
            </div>
            <!-- <div class="search-bar">
                <input type="text" placeholder="Nhập từ khóa cần tìm kiếm..." />
                <button>
                    <i class="fa-brands fa-searchengin"></i>
                </button>
            </div> -->
            <router-link to="/profile" class="img-profile">
                <button class="profile-btn">Trang cá nhân</button>

            </router-link>
            <div class="auth-buttons">

                <!-- Hiển thị nút Đăng nhập nếu người dùng chưa đăng nhập -->
                <router-link v-if="!isAuthenticated" to="/login" class="login-btn">Đăng nhập</router-link>
                <!-- Hiển thị nút Đăng xuất nếu người dùng đã đăng nhập -->
                <button v-else @click="handleLogout" class="logout-btn">Đăng xuất</button>
            </div>
        </div>
    </header>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Header',
    computed: {
        ...mapState(['isAuthenticated']) // Lấy trạng thái đăng nhập từ Vuex
    },
    methods: {
        ...mapActions(['logout']),
        handleLogout() {
            this.logout(); // Gọi action logout để cập nhật trạng thái đăng nhập
            this.$router.push("/login"); // Điều hướng về trang đăng nhập
        }
    }
};
</script>

<style scoped>
.header {
    background-color: #fff;
    padding: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
}

.left-section {
    display: flex;
    align-items: center;
}

.logo img {
    height: 40px;
}

.img-profile img {
    max-height: 40px;
    margin-right: 10px;
    align-items: center;
    border-radius: 50%;
    background-color: #133E87;
}

.name-web {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.name-web a {
    color: #333;
    font-size: large;
    font-weight: bold;
}

.search-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 3;
    margin: 0 20px;
}

.search-bar input {
    width: 100%;
    max-width: 500px;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 14px;
}

.search-bar button {
    background: none;
    border: none;
    margin-left: -35px;
    cursor: pointer;
}

.search-bar button i {
    font-size: 16px;
    color: #888;
}

.profile-btn {
    margin-right: 5px;
    color: white;
    background-color: #133e87;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.auth-buttons {
    display: flex;
    gap: 10px;
}

.register-btn {
    background-color: #888;
}

.login-btn {
    background-color: #133E87;
}

.register-btn,
.login-btn {
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.register-btn:hover,
.login-btn:hover {
    background-color: #e64a19;
}

.logout-btn {
    background-color: #e64a19;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.logout-btn:hover {
    background-color: #c43b16;
}

/* Ẩn tên web và nút đăng ký khi màn hình nhỏ hơn 768px */
@media (max-width: 768px) {
    .name-web {
        display: none;
    }

    .register-btn {
        display: none;
    }

    .search-bar {
        margin: 0;
    }

    .search-bar input {
        max-width: 250px;
    }
}
</style>