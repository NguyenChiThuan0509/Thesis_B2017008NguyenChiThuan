<template>
    <button @click="goHome" class="back-button">Về trang chủ</button>
    <div class="search-degree">
        <h1>Tra cứu kết quả thi theo lớp</h1>
        <form class="form">
            <div class="form-group">
                <label for="tenVanBang">Tên chứng nhận</label>
                <select id="tenVanBang">
                    <option>Chứng nhận ứng dụng CNTT cơ bản</option>
                    <option>Chứng nhận ứng dụng CNTT nâng cao</option>
                </select>
            </div>
            <div class="form-group">
                <label for="tenLop">Mã lớp</label>
                <input type="text" id="tenLop" placeholder="Nhập mã lớp" />
            </div>
            <div class="form-group">
                <label for="maKhoaThi">Mã khóa thi</label>
                <input type="text" id="maKhoaThi" placeholder="Nhập mã khóa thi" />
            </div>
            <div class="form-group">
                <label for="ngayThi">Ngày thi</label>
                <input type="date" id="ngayThi" placeholder="Nhập ngày thi" />
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
    },
    methods: {
        // Phương thức chuyển hướng về trang chủ
        goHome() {
            this.$router.push('/'); // Dẫn đến trang chủ (home)
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
    text-align: center;
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
