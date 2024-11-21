<template>
    <div class="login-container">
        <h2>Đăng nhập</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required placeholder="Nhập email của bạn" />
            </div>
            <div class="form-group">
                <label for="password">Mật khẩu:</label>
                <div class="password-container">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
                        placeholder="Nhập mật khẩu của bạn" />
                    <span class="password-icon" @click="togglePassword">
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </span>
                </div>
            </div>
            <button type="submit" class="btn-login">Đăng nhập</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            showPassword: false, // Trạng thái ẩn/hiện mật khẩu
        };
    },
    methods: {
        // Hàm xử lý đăng nhập
        async handleLogin() {
            try {
                const response = await axios.post("http://localhost:3000/login", {
                    email: this.email,
                    password: this.password
                });
                console.log("Login response:", response.data);
                // Lưu token vào localStorage
                localStorage.setItem("token", response.data.token);
                // Chuyển hướng về trang chính
                this.$router.push("/");
            } catch (error) {
                console.error("Login error:", error.response || error.message);
                if (error.response && error.response.status === 401) {
                    this.errorMessage = "Sai email hoặc mật khẩu.";
                } else {
                    this.errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
                }
            }
        },
        // Hàm thay đổi trạng thái ẩn/hiện mật khẩu
        togglePassword() {
            this.showPassword = !this.showPassword;
        }
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
}

.form-group {
    margin-bottom: 1em;
}

.form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5em;
}

.form-group input {
    width: 100%;
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.password-container {
    display: flex;
    align-items: center;
    position: relative;
}

.password-container input {
    flex: 1;
}

.password-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 1.2em;
}

.btn-login {
    width: 100%;
    padding: 0.75em;
    font-size: 1em;
    color: #fff;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-login:hover {
    background-color: #218838;
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 1em;
}
</style>
