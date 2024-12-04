<template>
    <div>
        <h1>Lịch thi</h1>
        <h2 style="font-style: italic; font-size:small; font-weight: bold; color: blue;">
            TỔ CHỨC THI CẤP CHỨNG CHỈ ỨNG DỤNG CNTT QUỐC GIA
        </h2>
        <div v-for="announcement in announcements" :key="announcement.id" class="card">
            <router-link :to="{ name: 'InExamSchedule', params: { id: announcement.id } }">
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
    name: "ExamSchedule",
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
                const response = await axios.get("http://localhost:3000/api/thong-bao-lich_thi");
                this.announcements = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        },
    },
};
</script>

<style scoped>
h1 {
    margin-bottom: 30px;
    color: black;
    border-bottom: 2px solid #333;
    font-size: 25px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
    /* font-size: 100px; */
    text-align: center;
    color: #2570BB;
    margin-bottom: 20px;
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
}
</style>
