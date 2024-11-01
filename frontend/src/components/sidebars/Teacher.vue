<template>
    <div>
        <h1>Danh sách lớp CB217</h1>
        <ul v-if="students.length">
            <li v-for="student in students" :key="student.mssv">
                {{ student.ho_va_ten }} - {{ student.ngay_sinh }} - {{ student.noi_sinh }}
            </li>
        </ul>
        <p v-else>Không có dữ liệu</p>
    </div>
    <Footer />
</template>

<script>
import axios from 'axios';
import Footer from '../Footer.vue';

export default {
    name: "Teacher",
    components: {
        Footer,
    },
    data() {
        return {
            students: []
        };
    },
    methods: {
        async fetchStudents() {
            try {
                const response = await axios.get('http://localhost:3000/api/danh-sach-lop-cb217');
                this.students = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        }
    },
    mounted() {
        this.fetchStudents();
    }
};
</script>
