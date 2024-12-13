<template>
    <div class="add-exam">
        <h1>Thêm Lịch Thi</h1>
        <form @submit.prevent="addExam">
            <div class="form-group">
                <label for="thongBaoId">Thông Báo ID:</label>
                <input type="number" id="thongBaoId" v-model="exam.thong_bao_id" required />
            </div>

            <div class="form-group">
                <label for="ngayThi">Ngày Thi:</label>
                <input type="date" id="ngayThi" v-model="exam.ngay_thi" required />
            </div>

            <div class="form-group">
                <label for="hanDangKy">Hạn Đăng Ký:</label>
                <input type="date" id="hanDangKy" v-model="exam.han_dang_ky" required />
            </div>

            <div class="form-group">
                <label for="yeuCau">Yêu Cầu:</label>
                <textarea id="yeuCau" v-model="exam.yeu_cau" required></textarea>
            </div>

            <div class="form-group">
                <label for="diaChiDangKy">Địa Chỉ Đăng Ký:</label>
                <input type="text" id="diaChiDangKy" v-model="exam.dia_chi_dang_ky" required />
            </div>

            <button type="submit">Thêm Lịch Thi</button>
        </form>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="message" class="success">{{ message }}</div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            exam: {
                thong_bao_id: "",
                ngay_thi: "",
                han_dang_ky: "",
                yeu_cau: "",
                dia_chi_dang_ky: "",
            },
            message: "",
            error: "",
        };
    },
    methods: {
        async addExam() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    this.error = "Bạn cần phải đăng nhập để thực hiện hành động này.";
                    return;
                }

                const response = await axios.post(
                    "http://localhost:3000/api/lich-thi",
                    this.exam,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                this.message = "Lịch thi đã được thêm thành công!";
                this.error = ""; // Clear previous errors
                this.exam = { // Reset form after submission
                    thong_bao_id: "",
                    ngay_thi: "",
                    han_dang_ky: "",
                    yeu_cau: "",
                    dia_chi_dang_ky: "",
                };
            } catch (error) {
                this.error = error.response?.data?.message || "Lỗi khi thêm lịch thi.";
                this.message = "";
            }
        },
    },
};
</script>

<style scoped>
.add-exam {
    width: 300px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 15px;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
}

button {
    padding: 10px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

.error {
    color: red;
    margin-top: 10px;
}

.success {
    color: green;
    margin-top: 10px;
}
</style>