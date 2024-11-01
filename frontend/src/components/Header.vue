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
            <div class="search-bar">
                <input type="text" placeholder="Tìm kiếm khóa học, bài viết, video, ..." />
                <button>
                    <i class="fa-brands fa-searchengin"></i>
                </button>
            </div>
            <div class="auth-buttons">
                <button class="register-btn">Đăng ký</button>
                <button class="login-btn">Đăng nhập</button>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
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