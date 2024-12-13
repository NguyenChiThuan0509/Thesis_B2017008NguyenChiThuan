<template>
    <button @click="goBack" class="back-button">Về trang chủ</button>
    <div>
        <h1>Thông báo chiêu sinh</h1>
        <div v-for="announcement in announcements" :key="announcement.id" class="card">
            <router-link :to="{ name: 'InAddStudent', params: { id: announcement.id } }">
                <div class="title">{{ announcement.tieu_de }}</div>
            </router-link>
            <div class="content">{{ announcement.gioi_thieu }}</div>
        </div>
        <Footer />
    </div>
</template>


<script>
import Footer from '../Footer.vue';
import axios from 'axios';

export default {
    name: "AddStudent",
    components: {
        Footer,
    },
    data() {
        return {
            announcements: [],
        };
    },
    created() {
        this.fetchAnnouncements();
    },
    methods: {
        async fetchAnnouncements() {
            try {
                const response = await axios.get("http://localhost:3000/api/thong-bao-chieu-sinh");
                this.announcements = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        },
        goToAnnouncementDetail(id) {
            this.$router.push(`/inaddstudent/${id}`); // Điều hướng với tham số ID
        },
        goBack() {
            this.$router.go(-1); // Sử dụng Vue Router để quay lại trang trước
        }
    },
};
</script>

<style>
h1 {
    margin-bottom: 30px;
    text-align: center;
    color: black;
    border-bottom: 2px solid #333;
    font-size: 25px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
    padding: 15px;
    border-radius: 8px;
    background-color: #F5F5F5;
    margin-bottom: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card .title {
    padding-bottom: 8px;
    font-size: 20px;
    text-align: left;
    color: #2570BB;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    cursor: pointer;
    /* Con trỏ thành dạng click */
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
