<template>
    <div>
        <div id="messages">
            <div v-for="msg in messages" :key="msg.id">{{ msg.text }}</div>
        </div>
        <input v-model="userMessage" placeholder="Type your message" />
        <button @click="sendMessage">Send</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userMessage: '',
            messages: [],
        };
    },
    methods: {
        async sendMessage() {
            // Gửi yêu cầu đến Rasa server
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: 'user', message: this.userMessage }),
            });

            const data = await response.json();
            this.messages.push({ id: Date.now(), text: this.userMessage }); // Thêm tin nhắn người dùng vào danh sách

            // Thêm phản hồi từ Rasa vào danh sách tin nhắn
            data.forEach((msg) => {
                this.messages.push({ id: Date.now() + Math.random(), text: msg.text });
            });

            // Xóa nội dung trong input
            this.userMessage = '';
        },
    },
};
</script>

<style>
/* Bạn có thể thêm các kiểu dáng tại đây */
</style>