<template>
    <button @click="goBack" class="back-button">Về trang trước</button>
    <div>
        <h1>{{ announcement.tieu_de }}</h1>
        <p>{{ announcement.gioi_thieu }}</p>

        <h2>Danh sách các lớp học</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Lớp</th>
                        <th>Ngày khai giảng</th>
                        <th>Chỉ tiêu</th>
                        <th>Phòng</th>
                        <th>Số buổi</th>
                        <th>Buổi học</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lop in lopHocList" :key="lop.id">
                        <td>{{ lop.ten_lop }}</td>
                        <td>{{ formatDate(lop.ngay_khai_giang) }}</td>
                        <td>{{ lop.chi_tieu }}</td>
                        <td>{{ lop.so_phong }}</td>
                        <td>{{ lop.so_buoi }}</td>
                        <td>{{ lop.buoi_hoc }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>Học phí (bao gồm lệ phí thi)</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Lớp</th>
                        <th>Lệ phí</th>
                        <th>Lệ phí cho sinh viên</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hocPhi in hocPhiList" :key="hocPhi.ten_lop">
                        <td>{{ hocPhi.ten_lop }}</td>
                        <td>{{ formatCurrency(hocPhi.le_phi) }}</td>
                        <td>{{ formatCurrency(hocPhi.le_phi_sinh_vien) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>Phương thức đăng ký ghi danh</h2>
        <div class="registration-methods">
            <ul>
                <li>
                    Ghi danh trực tiếp tại: <strong>Trung tâm Điện tử & Tin học (Trường CNTT&TT)</strong>.
                </li>
                <li>
                    Ghi danh trực tuyến (Online) tại:
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScK2QftI1UjXq5XfFjJP1QHTFLBNBEUHWicsAbPP5xCZt3zLQ/viewform"
                        target="_blank">
                        Link
                    </a>.
                </li>
            </ul>
        </div>

        <Footer />
    </div>
</template>

<script>
import Footer from "../Footer.vue";
import axios from "axios";

export default {
    name: "InAddStudent",
    components: { Footer },
    props: ["id"], // ID thông báo được truyền từ route hoặc parent component
    data() {
        return {
            announcement: {}, // Thông tin thông báo chiêu sinh
            lopHocList: [], // Danh sách các lớp học
            hocPhiList: [], // Dữ liệu học phí
        };
    },
    async created() {
        await this.fetchAnnouncementDetails(this.id);
        await this.fetchHocPhi(); // Lấy dữ liệu học phí khi tạo component
    },
    methods: {
        // Lấy thông tin thông báo và danh sách lớp học
        async fetchAnnouncementDetails(id) {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/thong-bao-chieu-sinh/${id}`
                );
                this.announcement = response.data.thongBao; // Thông báo chiêu sinh
                this.lopHocList = response.data.lopHocList; // Danh sách lớp chiêu sinh
            } catch (error) {
                console.error("Lỗi khi lấy thông tin chiêu sinh:", error);
            }
        },
        // Lấy dữ liệu học phí
        async fetchHocPhi() {
            try {
                const response = await axios.get("http://localhost:3000/api/hoc-phi");
                this.hocPhiList = response.data; // Gán dữ liệu học phí vào state
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu học phí:", error);
            }
        },
        // Định dạng tiền tệ
        formatCurrency(value) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);
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
h1,
h2 {
    text-align: center;
    color: #2570BB;
}

.table-container {
    display: flex;
    justify-content: center;
    margin: 20px auto;
    padding: 20px;
    max-width: 800px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    font-family: Arial, sans-serif;
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

.registration-methods {
    margin-top: 20px;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.registration-methods ul {
    list-style-type: none;
    padding: 0;
}

.registration-methods li {
    margin-bottom: 10px;
    font-size: 16px;
}

.registration-methods a {
    color: #2570BB;
    text-decoration: underline;
    font-weight: bold;
}

.registration-methods a:hover {
    color: #0f5bbd;
}
</style>
