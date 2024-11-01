<template>
    <div class="search-result">
        <h1>Tra cứu kết quả thi</h1>
        <form class="form">
            <div class="form-group">
                <label for="soBaoDanh">Số báo danh</label>
                <input type="text" id="soBaoDanh" placeholder="Nhập số báo danh" />
            </div>
            <div class="form-group">
                <label for="maKhoaThi">Mã khoá thi</label>
                <input type="text" id="maKhoaThi" placeholder="Nhập khóa thi" />
            </div>
            <div class="form-group">
                <label for="ngayThi">Ngày thi</label>
                <input type="date" id="ngayThi" placeholder="Nhập ngày thi" />
            </div>
            <div class="buttons">
                <button type="button" class="btn btn-primary">Tìm kiếm</button>
                <button type="button" class="btn btn-secondary">Nhập lại</button>
                <!-- <button type="button" class="btn btn-danger">Xem hướng dẫn tra cứu</button> -->
                <button type="button" class="btn btn-danger" @click="showPopup = true">Xem hướng dẫn tra cứu</button>
            </div>
        </form>

        <ExamGuidePopup v-if="showPopup" :show="showPopup" @close="showPopup = false" />
        <Footer />
    </div>
</template>

<script>
import Footer from '../Footer.vue';
import ExamGuidePopup from './ExamGuidePopup.vue';

export default {
    name: "SearchResult",
    components: {
        Footer,
        ExamGuidePopup
    },
    data() {
        return {
            showPopup: false
        };
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
</style>
