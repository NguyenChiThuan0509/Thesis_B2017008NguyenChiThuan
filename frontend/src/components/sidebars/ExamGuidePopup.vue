<template>
    <div class="popup" v-if="show">
        <div class="popup-content">
            <h2>Phiếu báo dự thi mẫu</h2>
            <p class="center">Trường Đại Học Cần Thơ</p>
            <p class="center">Trung Tâm Điện tử & Tin Học</p>
            <h3>PHIẾU DỰ THI CHỨNG NHẬN ỨNG DỤNG CNTT CƠ BẢN</h3>
            <div class="info">
                <p><strong>Số báo danh:</strong> 209 (Nhóm 01)</p>
                <p><strong>Họ và tên:</strong> Nguyễn Chí Thuận</p>
                <p><strong>Ngày Sinh:</strong> 05/09/2002</p>
                <p><strong>Nơi Sinh:</strong> Trần Văn Thời - Cà Mau</p>
                <p><strong>Ngày Thi:</strong> 29/12/2024</p>
                <p><strong>Giờ Thi LT:</strong> 09h30 tại Hội trường</p>
                <p><strong>Giờ Thi TH:</strong> 10h00 tại Phòng 105</p>
                <p><strong>Mã khóa Thi:</strong>1224CB509</p>
            </div>
            <button class="btn btn-secondary" @click="closePopup">Đóng</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ExamGuidePopup",
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closePopup() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: white;
    padding: 20px 30px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: left;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
}

.popup-content h2,
.popup-content h3 {
    text-align: center;
    margin: 0;
    font-weight: normal;
    color: #333;
}

.popup-content h2 {
    font-size: 18px;
    margin-bottom: 5px;
}

.popup-content h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
}

.center {
    text-align: center;
    font-size: 14px;
    margin: 0;
}

.info {
    font-size: 14px;
    line-height: 1.6;
}

.info p {
    display: flex;
    justify-content: flex-start;
    margin: 5px 0;
}

.info p strong {
    font-weight: bold;
    width: 40%;
    text-align: left;
    margin-left: 40px;
    justify-content: center;
    padding-right: 10px;
}

.footer {
    text-align: right;
    font-size: 13px;
    margin-top: 10px;
    color: #555;
}

.btn-secondary {
    margin-top: 15px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    background-color: #6c757d;
    color: white;
    border-radius: 4px;
    border: none;
    display: block;
    margin-left: auto;
}

.btn-secondary:hover {
    background-color: #c82333;
}
</style>