<template>
    <button @click="goBack" class="back-button">Về trang trước</button>
    <div class="add-user">
        <h2>Thêm Tài Khoản Người Dùng</h2>
        <form @submit.prevent="addUser">
            <div class="form-group">
                <label for="full_name">Họ và Tên</label>
                <input type="text" v-model="user.full_name" id="full_name" placeholder="Nhập họ và tên" required />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" v-model="user.email" id="email" placeholder="Nhập email" required />
            </div>

            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input type="password" v-model="user.password" id="password" placeholder="Nhập mật khẩu" required />
            </div>

            <div class="form-group">
                <label for="gioi_tinh">Giới tính</label>
                <select v-model="user.gioi_tinh" id="gioi_tinh" required>
                    <option value="nam">Nam</option>
                    <option value="nữ">Nữ</option>
                    <option value="khác">Khác</option>
                </select>
            </div>

            <div class="form-group">
                <label for="ngay_sinh">Ngày sinh</label>
                <input type="date" v-model="user.ngay_sinh" id="ngay_sinh" required />
            </div>

            <div class="form-group">
                <label for="phone">Số điện thoại</label>
                <input type="text" v-model="user.phone" id="phone" placeholder="Nhập số điện thoại" required />
            </div>

            <div class="form-group">
                <label for="avatar">Ảnh đại diện</label>
                <input type="file" @change="onFileChange" id="avatar" />
                <img v-if="user.avatar_url" :src="user.avatar_url" alt="Ảnh đại diện" class="avatar-preview" />
            </div>

            <div class="form-group">
                <label for="role">Vai trò</label>
                <select v-model="user.role" id="role" required>
                    <option value="student">Học viên</option>
                    <option value="teacher">Giáo viên</option>
                </select>
            </div>

            <button type="submit" class="submit-btn">Thêm người dùng</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import bcrypt from 'bcryptjs';

export default {
    data() {
        return {
            user: {
                full_name: '',
                email: '',
                password: '',
                gioi_tinh: 'nam',
                ngay_sinh: '',
                phone: '',
                avatar_url: '', // Đây là đường dẫn ảnh đại diện
                role: 'student',
                avatar_file: null // Đây là tệp ảnh người dùng chọn
            }
        };
    },
    methods: {
        async addUser() {
            try {
                // Mã hóa mật khẩu
                const hashedPassword = bcrypt.hashSync(this.user.password, 10); // 10 là độ khó của hash
                this.user.password = hashedPassword; // Thay đổi mật khẩu thành mật khẩu đã mã hóa

                const formData = new FormData();
                formData.append('full_name', this.user.full_name);
                formData.append('email', this.user.email);
                formData.append('password', this.user.password);
                formData.append('gioi_tinh', this.user.gioi_tinh);
                formData.append('ngay_sinh', this.user.ngay_sinh);
                formData.append('phone', this.user.phone);
                formData.append('role', this.user.role);

                if (this.user.avatar_file) {
                    formData.append('avatar', this.user.avatar_file);
                }

                const response = await axios.post('http://localhost:3000/api/users', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    this.$router.push('/profile'); // Chuyển hướng đến trang danh sách người dùng
                }
            } catch (error) {
                console.error("Lỗi khi thêm người dùng:", error);
                alert("Có lỗi xảy ra khi thêm người dùng!");
            }
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.user.avatar_file = file;
                this.user.avatar_url = URL.createObjectURL(file); // Hiển thị ảnh ngay lập tức sau khi chọn
            }
        },
        goBack() {
            this.$router.go(-1); // Sử dụng Vue Router để quay lại trang trước
        }
    }
};
</script>


<style scoped>
.add-user {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.add-user h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-weight: bold;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #133E87;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #e64a19;
}

.avatar-preview {
    margin-top: 10px;
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
}

/* css nút quay lại */
.back-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
}

.back-button:hover {
    background-color: #0056b3;
}
</style>
