<template>
    <div class="profile">
        <h1>Trang cá nhân</h1>
        <div v-if="user">
            <div class="info-card">
                <div class="avatar-container">
                    <img :src="user.avatar_url" alt="Ảnh đại diện" class="avatar" />
                </div>
                <div class="info">
                    <p><strong>Tên:</strong> {{ user.full_name }}</p>
                    <p><strong>Giới tính:</strong> {{ user.gioi_tinh }}</p>
                    <p><strong>Vai trò:</strong> {{ getRoleName(user.role) }}</p>
                    <p><strong>Email:</strong> {{ user.email }}</p>
                </div>
            </div>

            <!-- Dropdown menu, chỉ hiển thị cho admin -->
            <div class="menu" v-if="isAdmin">
                <div class="menu-item">
                    <router-link to="/adduser" class="router-link">
                        <p style="color: white;">Thêm người dùng</p>
                    </router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/listuser" class="router-link">
                        <p style="color: white;">Danh sách người dùng</p>
                    </router-link>
                </div>
            </div>

            <!-- Danh sách hiển thị -->
            <div v-if="currentSection === 'students'" class="student-list">
                <h2>Danh sách học viên</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tên học viên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in students" :key="student.email">
                            <td>{{ student.full_name }}</td>
                            <td>{{ student.phone }}</td>
                            <td>{{ student.email }}</td>
                            <td>
                                <button class="btn btn-green" @click="addStudent(student)">Thêm</button>
                                <button class="btn btn-yellow" @click="editStudent(student)">Sửa</button>
                                <button class="btn btn-red" @click="deleteStudent(student)">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Thêm các danh sách khác nếu cần -->
        </div>
        <div v-else>
            <p>Không có thông tin người dùng. Vui lòng đăng nhập.</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name: 'Profile',
    data() {
        return {
            currentSection: null,
            students: [],
        };
    },
    computed: {
        ...mapGetters(['user']),
        // Kiểm tra xem người dùng có phải là admin hay không
        isAdmin() {
            return this.user && this.user.role === 'admin';
        }
    },
    created() {
        if (!this.user) {
            this.$store.dispatch('fetchUserProfile');
        }
    },
    methods: {
        getRoleName(role) {
            switch (role) {
                case 'admin':
                    return 'Quản trị viên';
                case 'teacher':
                    return 'Giáo viên';
                case 'student':
                    return 'Học viên';
                default:
                    return 'Không xác định';
            }
        },
        handleDropdown(section) {
            this.currentSection = section;
            if (section === 'students') {
                this.fetchStudents();
            }
            // Có thể thêm logic cho các section khác nếu cần
        },
        async fetchStudents() {
            try {
                const response = await axios.get('http://localhost:3002/api/students');
                this.students = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách học viên:', error);
                alert('Không thể tải danh sách học viên');
            }
        },
        addStudent(student) {
            alert(`Thêm học viên: ${student.full_name}`);
        },
        editStudent(student) {
            alert(`Sửa học viên: ${student.full_name}`);
        },
        deleteStudent(student) {
            alert(`Xóa học viên: ${student.full_name}`);
        },
    },
};
</script>



<style>
.profile {
    text-align: center;
    padding: 20px;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: solid 1px #333;
}

.info-card {
    display: flex;
    align-items: center;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    background-color: #f9f9f9;
}

.avatar-container {
    margin-right: 20px;
}

.info {
    text-align: left;
}

.info strong {
    font-weight: bolder;
}

.menu {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.menu-item {
    position: relative;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.menu-item:hover {
    background-color: #0056b3;
}

.dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 150px;
    z-index: 1000;
}

.menu-item:hover .dropdown {
    display: block;
}

.dropdown-item {
    padding: 10px;
    cursor: pointer;
}

.dropdown-item:hover {
    background-color: #f0f0f0;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}

.btn-green {
    background-color: #28a745;
}

.btn-yellow {
    background-color: #ffc107;
}

.btn-red {
    background-color: #dc3545;
}

.student-list {
    margin-top: 20px;
}
</style>
