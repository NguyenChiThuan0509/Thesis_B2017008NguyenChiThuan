<template>
    <div>
        <h2>Bạn có muốn đăng xuất không?</h2>
        <button @click="handleLogout">Đăng xuất</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    methods: {
        handleLogout() {
            localStorage.removeItem('token'); // Xóa token khỏi localStorage
            this.$router.push('/login');
        },
    },
};
</script>