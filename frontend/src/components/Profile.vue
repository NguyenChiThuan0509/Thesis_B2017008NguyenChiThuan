<template>
    <div class="profile">
        <h1>Thông tin cá nhân</h1>
        <div v-if="user">
            <img :src="user.avatar_url" alt="Avatar" class="avatar" />
            <p><strong>Tên đăng nhập:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Họ và tên:</strong> {{ user.full_name }}</p>
        </div>
        <div v-else>
            <p>Không có thông tin người dùng. Vui lòng đăng nhập.</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Profile',
    computed: {
        ...mapGetters(['user']),
    },
    created() {
        // Lấy thông tin user khi truy cập Profile
        if (!this.user) {
            this.$store.dispatch('fetchUserProfile'); // Đúng tên action
        }
    },
};
</script>

<style>
.profile {
    text-align: center;
    padding: 20px;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: solid 1px #333;
}
</style>
