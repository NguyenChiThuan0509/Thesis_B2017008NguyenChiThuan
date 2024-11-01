<template>
    <div class="incourse-container" v-if="courseData">
        <div class="incourse">
            <h1>{{ courseData.ten_lop_dao_tao }}</h1>
            <p>{{ courseData.gioi_thieu }}</p>

            <div class="learning-goals" v-if="courseData.muc_tieu">
                <h2>Bạn sẽ học được gì?</h2>
                <ul>
                    <li v-for="(goal, index) in courseData.muc_tieu.split(';')" :key="index">✔ {{ goal }}</li>
                </ul>
            </div>

            <div class="course-content" v-if="courseData.noi_dung">
                <h2>Nội dung khóa học</h2>
                <div class="section" v-for="(content, index) in courseData.noi_dung.split(';')" :key="index">
                    <h3>{{ index + 1 }}. {{ content }}</h3>
                </div>
            </div>
        </div>

        <div class="course-info">
            <div class="course-demo">
                <img :src="courseImage" alt="demo khóa học" />
            </div>

            <div class="course-details">
                <h3>Miễn phí</h3>
                <!-- <button class="register-button">Đăng ký học</button> -->
                <ul class="details-list">
                    <li>Trình độ: {{ courseData.trinh_do }}</li>
                    <li>Số buổi: {{ courseData.so_buoi }}</li>
                    <li>Số tiết lý thuyết: {{ courseData.so_tiet_ly_thuyet }}</li>
                    <li>Số tiết thực hành: {{ courseData.so_tiet_thuc_hanh }}</li>
                </ul>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import axios from 'axios';
import courseImage from '@/assets/image/course_01.png';
import Footer from '../Footer.vue';

export default {
    components: {
        Footer,
    },
    data() {
        return {
            courseData: null,
            courseImage,
        };
    },
    created() {
        this.fetchCourseData();
    },
    methods: {
        async fetchCourseData() {
            const courseId = this.$route.params.id; // Lấy ID từ tham số của route
            try {
                // Sử dụng courseId để lấy thông tin chi tiết của khóa học tương ứng
                const response = await axios.get(`http://localhost:3000/api/courses/${courseId}`);
                this.courseData = response.data; // Lưu dữ liệu của khóa học
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu chi tiết khóa học:', error);
            }
        },
    },
};
</script>




<style scoped>
/* CSS như phiên bản trước của bạn */
.incourse-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.incourse {
    width: 65%;
    padding-right: 20px;
}

.course-info {
    width: 30%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
}

h1,
h2 {
    font-size: 25px;
    font-weight: bold;
}

.learning-goals h2 {
    margin-top: 20px;
    font-size: 22px;
}

.learning-goals ul {
    list-style-type: none;
    padding: 0;
}

.learning-goals ul li {
    font-size: 16px;
    padding: 5px 0;
}

.course-content h2 {
    margin-top: 20px;
    font-size: 22px;
}

.course-content p {
    font-size: 16px;
    color: #888;
}

.section {
    margin-top: 20px;
}

.section h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.course-info .course-demo {
    text-align: center;
}

.course-demo img {
    max-width: 100%;
    object-fit: fill;
    border-radius: 10px;
}

.course-info .course-details {
    margin-top: 20px;
    text-align: center;
}

.course-info h3 {
    font-size: 28px;
    color: #ff6f61;
    margin-bottom: 15px;
}

/* .register-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.register-button:hover {
    background-color: #0056b3;
} */

.details-list {
    padding: 0;
    font-size: 16px;
    color: #666;
    margin-top: 20px;
    list-style-type: none;
}

.details-list li {
    margin-bottom: 10px;
}
</style>
