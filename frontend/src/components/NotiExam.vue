<template>
    <div class="add-noti-exam">
        <h2>Thêm thông báo lịch thi</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="tieu_de">Tiêu đề:</label>
                <input type="text" v-model="tieu_de" id="tieu_de" required />
            </div>
            <div class="form-group">
                <label for="gioi_thieu">Giới thiệu:</label>
                <textarea v-model="gioi_thieu" id="gioi_thieu" required></textarea>
            </div>
            <button type="submit">Thêm thông báo</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            tieu_de: '',
            gioi_thieu: ''
        };
    },
    methods: {
        async submitForm() {
            try {
                const response = await axios.post('http://localhost:3000/api/thong-bao-lich_thi', {
                    tieu_de: this.tieu_de,
                    gioi_thieu: this.gioi_thieu
                });
                alert('Thêm thông báo thành công!');
                this.tieu_de = '';
                this.gioi_thieu = '';
            } catch (error) {
                alert('Lỗi khi thêm thông báo.');
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
.add-noti-exam {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 15px;
}
</style>