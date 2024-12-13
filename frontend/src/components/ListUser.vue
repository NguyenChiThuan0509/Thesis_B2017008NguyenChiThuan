<template>
    <div>
        <!-- Nút quay lại -->
        <button @click="goBack" class="back-button">Về trang trước</button>
        <!-- Nút in danh sách người dùng -->
        <button @click="exportToExcel" class="export-button">In danh sách người dùng</button>
        <div class="list-user">
            <h2>Danh Sách Người Dùng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ảnh Đại Diện</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Vai trò</th>
                        <th>Hành động</th> <!-- Cột hành động -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                        <td>
                            <img v-if="user.avatar_url" :src="user.avatar_url" alt="Ảnh đại diện" class="avatar-img" />
                            <span v-else>Chưa có ảnh</span>
                        </td>
                        <td>{{ user.full_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.gioi_tinh }}</td>
                        <td>{{ formatDate(user.ngay_sinh) }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                            <button @click="editUser(user)" class="btn btn-edit">Sửa</button>
                            <button @click="deleteUser(user.id)" class="btn btn-delete">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal sửa người dùng -->
        <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h3>Sửa Thông Tin Người Dùng</h3>
                <form @submit.prevent="updateUser">
                    <label for="full_name">Họ và Tên:</label>
                    <input type="text" v-model="selectedUser.full_name" required />

                    <label for="email">Email:</label>
                    <input type="email" v-model="selectedUser.email" required />

                    <label for="gioi_tinh">Giới tính:</label>
                    <select name="gioi_tinh" id="gioi_tinh">
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                    </select>

                    <label for="ngay_sinh">Ngày sinh:</label>
                    <input type="date" v-model="selectedUser.ngay_sinh" required />

                    <label for="role">Vai trò:</label>
                    <input type="text" v-model="selectedUser.role" required />

                    <button type="submit">Cập Nhật</button>
                    <button type="button" @click="closeModal">Đóng</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import thư viện xlsx

export default {
    data() {
        return {
            users: [],
            isModalVisible: false,
            selectedUser: {}
        };
    },
    created() {
        this.fetchUsers();
    },
    computed: {
        filteredUsers() {
            return this.users.filter(user => user.role !== 'admin');
        }
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                this.users = response.data.users;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                alert('Có lỗi xảy ra khi lấy danh sách người dùng!');
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        async deleteUser(userId) {
            try {
                await axios.delete(`http://localhost:3000/api/users/${userId}`);
                this.fetchUsers(); // Cập nhật lại danh sách người dùng
                alert('Người dùng đã được xóa thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                alert('Có lỗi xảy ra khi xóa người dùng!');
            }
        },
        editUser(user) {
            this.selectedUser = { ...user }; // Sao chép thông tin người dùng để sửa
            this.isModalVisible = true; // Hiển thị modal
        },
        closeModal() {
            this.isModalVisible = false; // Ẩn modal khi nhấn Đóng
        },
        async updateUser() {
            try {
                const response = await axios.put(`http://localhost:3000/api/users/${this.selectedUser.id}`, this.selectedUser);
                alert('Thông tin người dùng đã được cập nhật!');
                this.isModalVisible = false; // Đóng modal sau khi cập nhật
                this.fetchUsers(); // Cập nhật danh sách người dùng
            } catch (error) {
                console.error('Lỗi khi cập nhật người dùng:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin người dùng');
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("vi-VN");
        },
        // Phương thức để xuất danh sách người dùng ra Excel
        exportToExcel() {
            const ws = XLSX.utils.json_to_sheet(this.filteredUsers.map(user => ({
                'Họ và Tên': user.full_name,
                'Email': user.email,
                'Giới tính': user.gioi_tinh,
                'Ngày sinh': this.formatDate(user.ngay_sinh),
                'Vai trò': user.role
            })));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Người Dùng');
            XLSX.writeFile(wb, 'danh_sach_nguoi_dung.xlsx');
        }
    }
};
</script>


<style scoped>
h2 {
    margin-bottom: 30px;
    color: black;
    border-bottom: 2px solid #333;
    font-size: 25px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.list-user {
    margin: 20px;
}

.list-user h2 {
    text-align: center;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

table th,
table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

table th {
    color: white;
    background-color: #2570BB;
}

.avatar-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
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

/* css cho các nút Sửa và Xóa */
button.btn {
    padding: 5px 10px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.btn-edit:hover {
    background-color: #45a049;
}

.btn-delete {
    background-color: #f44336;
    color: white;
    border: none;
}

.btn-delete:hover {
    background-color: #e53935;
}

/* css popup */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}

.modal-content form {
    display: flex;
    flex-direction: column;
}

.modal-content input,
select {
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

button[type="submit"],
button[type="button"] {
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    cursor: pointer;
}

button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

button[type="submit"]:hover {
    background-color: #45a049;
}

button[type="button"] {
    background-color: #f44336;
    color: white;
}

button[type="button"]:hover {
    background-color: #e53935;
}

/* css button in list user */
.export-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    margin-left: 10px;
}

.export-button:hover {
    background-color: #45a049;
}
</style>
