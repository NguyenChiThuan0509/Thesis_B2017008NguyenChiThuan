<template>
    <div>
        <h1>Danh sách giáo viên</h1>
        <ul v-if="teacher.length">
            <li v-for="teacher in teacher" :key="teacher.ma_so_can_bo">
                {{ teacher.ten_giao_vien }} - {{ teacher.ma_so_can_bo }} - {{ teacher.gioi_tinh }} - {{ teacher.email }}
                - {{ teacher.dien_thoai }}
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
            teacher: []
        };
    },
    methods: {
        async fetchTeachers() {
            try {
                const response = await axios.get('http://localhost:3000/api/danh-sach-giao-vien');
                this.teacher = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        }
    },
    mounted() {
        this.fetchTeachers();
    }
};
</script>
