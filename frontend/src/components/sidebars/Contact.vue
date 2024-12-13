<template>
    <button @click="goHome" class="back-button">Về trang chủ</button>
    <div>
        <h1 class="title">Trung Tâm Điện Tử & Tin Học - Bộ phận Đào tạo</h1>
        <p>Văn phòng đào tạo chứng chỉ - Khu II – Trường CNTT&TT (Khu Hiệu Bộ cũ) – ĐHCT</p>
        <p>ĐT: (84) 0292.3735 898</p>

        <h2>Giám đốc Trung tâm</h2>
        <ul>
            <li>Thầy Trần Minh Tân</li>
            <li>Email: <a href="mailto:tmtan@ctu.edu.vn">tmtan@ctu.edu.vn</a></li>
            <li>Điện thoại: 0982 88 90 90</li>
        </ul>

        <h2>Phó Giám đốc Trung tâm</h2>
        <ul>
            <li>Thầy Phan Huy Cường</li>
            <li>Email: <a href="mailto:phcuong@cit.ctu.edu.vn">phcuong@cit.ctu.edu.vn</a></li>
        </ul>

        <h2>Chuyên viên văn phòng Trung tâm</h2>
        <ul>
            <li>Cô Lê Ngọc Giàu, Email: <a href="mailto:lngiau@cit.ctu.edu.vn">lngiau@cit.ctu.edu.vn</a></li>
            <li>Cô Võ Thị Út, Email: <a href="mailto:vtut@cit.ctu.edu.vn">vtut@cit.ctu.edu.vn</a></li>
            <li>Cô Phan Thị Yến Nhi, Email: <a href="mailto:ptynhi@cit.ctu.edu.vn">ptynhi@cit.ctu.edu.vn</a></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Contact",
    methods: {
        // Phương thức chuyển hướng về trang chủ
        goHome() {
            this.$router.push('/'); // Dẫn đến trang chủ (home)
        }
    }
};
</script>

<style scoped>
.title {
    color: red;
    font-weight: bold;
    margin-bottom: 10px;
}

h2 {
    color: #333;
    margin-bottom: 5px;
}

p {
    margin-bottom: 10px;
}

ul {
    margin-bottom: 15px;
    list-style-type: disc;
    padding-left: 20px;
}

a {
    color: #e64a19;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
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