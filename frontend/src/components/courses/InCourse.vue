<template>
    <button @click="goBack" class="back-button">Về trang trước</button>
    <div class="incourse-container" v-if="courseData">
        <div class="incourse">
            <h1>{{ courseData.ten_lop_dao_tao }}</h1>
            <p>{{ courseData.gioi_thieu }}</p>

            <div class="learning-goals" v-if="courseData.muc_tieu">
                <h2>Bạn sẽ học được gì?</h2>
                <ul>
                    <li v-for="(goal, index) in courseData.muc_tieu.split(';')" :key="index"> {{ goal }}</li>
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

            <!-- Nút Đăng ký học -->
            <div class="register-button">
                <button @click="openModal" class="btn btn-primary">Đăng ký học</button>
            </div>

            <div class="course-details">
                <ul class="details-list">
                    <li>Cấp độ: {{ courseData.trinh_do }}</li>
                    <li>Học phí: {{ formattedHocPhi }} vnđ</li>
                    <li>Khai giảng: {{ formatDate(courseData.khai_giang) }}</li>
                    <li>Số buổi: {{ courseData.so_buoi }}</li>
                    <li>Số tiết lý thuyết: {{ courseData.so_tiet_ly_thuyet }}</li>
                    <li>Số tiết thực hành: {{ courseData.so_tiet_thuc_hanh }}</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Modal đăng ký học -->
    <div v-if="isModalVisible" class="modal-overlay">
        <div class="modal">
            <h2>Phương thức đăng ký ghi danh học tại trung tâm</h2>
            <p><strong>Phương thức 1:</strong> Ghi danh trực tiếp tại: <strong>Trung tâm Điện tử & Tin học (Trường
                    CNTT&TT)</strong></p>
            <p><strong>Phương thức 2:</strong> Ghi danh trực tuyến (Online) tại:
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScK2QftI1UjXq5XfFjJP1QHTFLBNBEUHWicsAbPP5xCZt3zLQ/viewform"
                    target="_blank">
                    Link
                </a>
            </p>
            <button @click="closeModal" class="btn btn-secondary">Đóng</button>
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
            hocPhi: "Đang tải học phí...",
            isModalVisible: false, // Quản lý hiển thị popup
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
                this.fetchHocPhi();
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu chi tiết khóa học:', error);
            }
        },
        async fetchHocPhi() {
            try {
                if (!this.courseData) return;
                const tenLopDaoTao = this.courseData.ten_lop_dao_tao;

                // Lấy danh sách học phí từ API
                const response = await axios.get('http://localhost:3000/api/hoc-phi');
                const hocPhiList = response.data;

                // Kiểm tra các điều kiện để xác định học phí
                let hocPhi = "Chưa xác định học phí";
                if (tenLopDaoTao.includes("Lớp học") && tenLopDaoTao.includes("cơ bản")) {
                    const match = hocPhiList.find(hp => hp.ten_lop === "Học và thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu CB)");
                    hocPhi = match ? match.le_phi : hocPhi;
                } else if (tenLopDaoTao.includes("Lớp ôn") && tenLopDaoTao.includes("cơ bản")) {
                    const match = hocPhiList.find(hp => hp.ten_lop === "Ôn thi chứng chỉ Ứng dụng CNTT cơ bản (ký hiệu ÔN CB)");
                    hocPhi = match ? match.le_phi : hocPhi;
                } else if (tenLopDaoTao.includes("Lớp học") && tenLopDaoTao.includes("nâng cao")) {
                    const match = hocPhiList.find(hp => hp.ten_lop === "Học và thi chứng chỉ Ứng dụng CNTT nâng cao (ký hiệu NC)");
                    hocPhi = match ? match.le_phi : hocPhi;
                }
                this.hocPhi = hocPhi;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin học phí:', error);
                this.hocPhi = "Lỗi khi tải học phí";
            }
        },
        goBack() {
            this.$router.go(-1); // Sử dụng Vue Router để quay lại trang trước
        },
        openModal() {
            this.isModalVisible = true; // Mở modal
        },
        closeModal() {
            this.isModalVisible = false; // Đóng modal
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("vi-VN");
        }
    },
    computed: {
        // Định dạng học phí theo kiểu 1.440.000
        formattedHocPhi() {
            return new Intl.NumberFormat('vi-VN').format(this.hocPhi);
        }
    }
};
</script>

<style scoped>
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

/* css # */
.incourse-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    flex-wrap: wrap;
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
    margin-bottom: 20px;
}

/* các tiêu đề */
h1,
h2 {
    font-size: 25px;
    font-weight: bold;
}

.learning-goals h2 {
    margin-top: 20px;
    font-size: 22px;
}

/* thông tin khóa học */
.course-info .course-demo {
    text-align: center;
}

.course-demo img {
    max-width: 100%;
    object-fit: fill;
    border-radius: 10px;
}

.course-info h3 {
    font-size: 28px;
    color: #ff6f61;
    margin-bottom: 15px;
}

/* danh sách thông tin chi tiết */
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

/* Nút Đăng ký học */
.register-button {
    margin: 20px 0;
    text-align: center;

}

.register-button .btn {
    font-size: medium;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 5px;
    background-color: #28a745;
}

.register-button .btn:hover {
    background-color: #218838;
}

/* Modal */
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

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
    text-align: center;
}

.modal h2 {
    font-size: 24px;
    margin-bottom: 15px;
}

.modal a {
    color: #007bff;
}

.btn-secondary {
    float: right;
    margin: 10px 0;
    width: 70px;
    height: 30px;
    font-size: medium;
    background-color: #0056b3;
}

.btn-secondary:hover {
    background-color: #5a6268;
}
</style>
