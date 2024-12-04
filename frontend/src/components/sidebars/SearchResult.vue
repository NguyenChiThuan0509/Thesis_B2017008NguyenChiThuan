<template>
    <div class="search-result">
        <h1>Tra cứu kết quả thi</h1>
        <form class="form" @submit.prevent="searchResult">
            <div class="form-group">
                <label for="soBaoDanh">Số báo danh</label>
                <input type="text" id="soBaoDanh" v-model="searchData.soBaoDanh" placeholder="Nhập số báo danh" />
            </div>
            <div class="form-group">
                <label for="maKhoaThi">Mã khoá thi</label>
                <input type="text" id="maKhoaThi" v-model="searchData.maKhoaThi" placeholder="Nhập mã khóa thi" />
            </div>
            <div class="form-group">
                <label for="ngayThi">Ngày thi</label>
                <input type="date" id="ngayThi" v-model="searchData.ngayThi" placeholder="Nhập ngày thi" />
            </div>
            <div class="buttons">
                <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                <button type="button" class="btn btn-secondary" @click="resetForm">Nhập lại</button>
                <button type="button" class="btn btn-danger" @click="showPopup = true">Xem hướng dẫn tra cứu</button>
            </div>
        </form>

        <div v-if="result" class="result">
            <h2>Kết quả thi</h2>
            <table>
                <thead>
                    <tr>
                        <th>Số báo danh</th>
                        <th>Họ và tên</th>
                        <th>Ngày thi</th>
                        <th>Mã khóa thi</th>
                        <th>Điểm thi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ result.so_bao_danh }}</td>
                        <td>{{ result.full_name }}</td>
                        <td>{{ formatDate(result.ngay_thi) }}</td>
                        <td>{{ result.ma_khoa_thi }}</td>
                        <td>{{ result.diem_thi }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="error" class="error">
            <p>{{ error }}</p>
        </div>

        <ExamGuidePopup v-if="showPopup" :show="showPopup" @close="showPopup = false" />
        <Footer />
    </div>
</template>

<script>
import Footer from '../Footer.vue';
import ExamGuidePopup from './ExamGuidePopup.vue';
import axios from 'axios';

export default {
    name: "SearchResult",
    components: {
        Footer,
        ExamGuidePopup
    },
    data() {
        return {
            searchData: {
                soBaoDanh: "",
                maKhoaThi: "",
                ngayThi: ""
            },
            result: null,
            error: null,
            showPopup: false
        };
    },
    methods: {
        async searchResult() {
            this.error = null;
            this.result = null;
            try {
                const response = await axios.get("http://localhost:3000/api/tra-cuu-diem", {
                    params: this.searchData
                });
                this.result = response.data;
            } catch (err) {
                if (err.response && err.response.data.error) {
                    this.error = err.response.data.error;
                } else {
                    console.error(err);
                    this.error = "Lỗi không xác định. Vui lòng thử lại.";
                }
            }
        },
        resetForm() {
            this.searchData = {
                soBaoDanh: "",
                maKhoaThi: "",
                ngayThi: ""
            };
            this.result = null;
            this.error = null;
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("vi-VN");
        }
    }
};
</script>

<style scoped>
.form {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.form-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
}

.form-group label {
    width: 25%;
    text-align: right;
    padding-right: 10px;
}

.form-group input {
    width: 70%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.btn {
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    border: none;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.result,
.error {
    margin-top: 20px;
    text-align: center;
}

.result table {
    margin: 0 auto;
    border-collapse: collapse;
    width: 70%;
    text-align: center;
}

.result th,
.result td {
    border: 1px solid #ddd;
    padding: 8px;
}

.result th {
    background-color: #007bff;
    color: white;
}

.error p {
    color: red;
    font-weight: bold;
}
</style>
