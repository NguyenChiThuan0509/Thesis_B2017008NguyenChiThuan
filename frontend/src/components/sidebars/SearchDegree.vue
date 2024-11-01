<template>
    <div class="search-degree">
        <h1>Tra cứu văn bằng chứng chỉ</h1>
        <form class="form">
            <div class="form-group">
                <label for="tenVanBang">Tên văn bằng *</label>
                <select id="tenVanBang">
                    <option>Chọn tên văn bằng</option>
                    <!-- Các tùy chọn văn bằng khác sẽ thêm vào đây -->
                </select>
            </div>
            <div class="form-group">
                <label for="hoTen">Họ tên</label>
                <input type="text" id="hoTen" placeholder="Nhập họ tên người được cấp bằng" />
            </div>
            <div class="form-group">
                <label for="soHieu">Số hiệu</label>
                <input type="text" id="soHieu" placeholder="Nhập số hiệu" />
            </div>
            <div class="form-group">
                <label for="soVaoSo">Số vào sổ</label>
                <input type="text" id="soVaoSo" placeholder="Nhập số vào sổ" />
            </div>
            <div class="form-note">
                * Điều kiện tìm kiếm: Họ tên, số hiệu, số vào sổ không phân biệt ký tự HOA, thường
            </div>
            <div class="buttons">
                <button type="button" class="btn btn-primary">Tìm kiếm</button>
                <button type="button" class="btn btn-secondary">Làm lại</button>
            </div>
        </form>
        <Footer />
    </div>
</template>

<script>
import Footer from '../Footer.vue';

export default {
    name: "SearchDegree",
    components: {
        Footer,
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
    margin-bottom: 15px;
}

.form-group label {
    width: 25%;
    text-align: right;
    padding-right: 10px;
}

.form-group input,
.form-group select {
    width: 70%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-note {
    text-align: left;
    color: #666;
    font-size: 14px;
    margin-top: 10px;
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
}

.btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
}
</style>
