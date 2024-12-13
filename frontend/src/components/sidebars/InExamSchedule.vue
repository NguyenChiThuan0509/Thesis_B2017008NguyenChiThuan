<template>
    <button @click="goBack" class="back-button">Về trang trước</button>
    <div>
        <h1>{{ announcement.tieu_de }}</h1>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Ngày thi</th>
                        <th>Hạn đăng ký thi</th>
                        <th>Địa điểm đăng ký</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="exam in exams" :key="exam.id">
                        <td>{{ formatDate(exam.ngay_thi) }}</td>
                        <td>{{ formatDate(exam.han_dang_ky) }}</td>
                        <td>{{ exam.dia_chi_dang_ky }}</td>
                        <td>{{ exam.yeu_cau }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Footer />
    </div>
</template>

<script>
import Footer from '../Footer.vue';
import axios from 'axios';

export default {
    name: "InExamSchedule",
    components: {
        Footer,
    },
    data() {
        return {
            announcement: {},
            exams: [], // Chứa danh sách lịch thi
        };
    },
    created() {
        this.fetchAnnouncementAndExams();
    },
    methods: {
        async fetchAnnouncementAndExams() {
            const id = this.$route.params.id;
            try {
                // Lấy thông tin thông báo
                const announcementResponse = await axios.get(`http://localhost:3000/api/thong-bao-lich_thi/${id}`);
                this.announcement = announcementResponse.data;

                // Lấy danh sách lịch thi liên quan
                const examsResponse = await axios.get(`http://localhost:3000/api/lich-thi/${id}`);
                this.exams = examsResponse.data;
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("vi-VN");
        },
        goBack() {
            this.$router.go(-1); // Sử dụng Vue Router để quay lại trang trước
        }
    },
};
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
    color: #2570BB;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
}

.table-container {
    margin: 20px auto;
    padding: 20px;
    max-width: 800px;
    background-color: #F9F9F9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    text-align: center;
}

thead th {
    background-color: #2570BB;
    color: white;
    padding: 10px;
    border: 1px solid #ddd;
}

tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
}

tbody tr:nth-child(even) {
    background-color: #e7f3fe;
}

td,
th {
    padding: 8px 12px;
    border: 1px solid #ddd;
}
</style>
