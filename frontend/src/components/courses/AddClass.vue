<template>
    <div class="add-class-container">
        <h2>Thêm lớp học</h2>
        <form @submit.prevent="addClass">
            <div class="form-group">
                <label for="ten_lop_dao_tao">Tên lớp đào tạo:</label>
                <input type="text" v-model="newClass.ten_lop_dao_tao" placeholder="Nhập tên lớp đào tạo" required />
            </div>
            <div class="form-group">
                <label for="gioi_thieu">Giới thiệu:</label>
                <textarea v-model="newClass.gioi_thieu" placeholder="Giới thiệu về lớp học" required></textarea>
            </div>
            <div class="form-group">
                <label for="muc_tieu">Mục tiêu:</label>
                <textarea v-model="newClass.muc_tieu" placeholder="Mục tiêu của lớp học" required></textarea>
            </div>
            <div class="form-group">
                <label for="noi_dung">Nội dung:</label>
                <textarea v-model="newClass.noi_dung" placeholder="Nội dung lớp học" required></textarea>
            </div>
            <div class="form-group">
                <label for="trinh_do">Trình độ:</label>
                <input type="text" v-model="newClass.trinh_do" placeholder="Trình độ yêu cầu" required />
            </div>
            <div class="form-group">
                <label for="so_buoi">Số buổi:</label>
                <input type="number" v-model="newClass.so_buoi" placeholder="Số buổi học" required />
            </div>
            <div class="form-group">
                <label for="so_tiet_ly_thuyet">Số tiết lý thuyết:</label>
                <input type="number" v-model="newClass.so_tiet_ly_thuyet" placeholder="Số tiết lý thuyết" required />
            </div>
            <div class="form-group">
                <label for="so_tiet_thuc_hanh">Số tiết thực hành:</label>
                <input type="number" v-model="newClass.so_tiet_thuc_hanh" placeholder="Số tiết thực hành" required />
            </div>
            <button type="submit" class="submit-btn">Thêm lớp học</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            newClass: {
                ten_lop_dao_tao: '',
                gioi_thieu: '',
                muc_tieu: '',
                noi_dung: '',
                trinh_do: '',
                so_buoi: null,
                so_tiet_ly_thuyet: null,
                so_tiet_thuc_hanh: null,
            },
        };
    },
    methods: {
        async addClass() {
            try {
                await axios.post('http://localhost:3000/api/courses', this.newClass);
                alert('Thêm lớp học thành công!');
                this.$router.push('/'); // Quay lại trang chủ sau khi thêm thành công
            } catch (error) {
                console.error('Lỗi khi thêm lớp học:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại.');
            }
        },
    },
};
</script>

<style scoped>
.add-class-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    font-size: 2em;
    color: #333;
    margin-bottom: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

label {
    font-size: 1em;
    color: #666;
    margin-bottom: 0.3rem;
}

input[type="text"],
input[type="number"],
textarea {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    resize: vertical;
    width: 100%;
}

input,
textarea::placeholder {
    font-size: 0.95em;
    color: #999;
}

input:focus,
textarea:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.2);
}

.submit-btn {
    width: 100%;
    padding: 0.9rem;
    font-size: 1.1em;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.submit-btn:hover {
    background-color: #0056b3;
    transform: scale(1.02);
}

/* Responsive thiết kế */
@media (max-width: 600px) {
    .add-class-container {
        padding: 1.5rem;
    }

    h2 {
        font-size: 1.8em;
    }

    label,
    input,
    textarea {
        font-size: 0.9em;
    }

    .submit-btn {
        font-size: 1em;
    }
}
</style>