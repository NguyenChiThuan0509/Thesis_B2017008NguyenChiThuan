<template>
    <div class="sidebar">
        <ul>
            <li>
                <a href="#">Chiêu Sinh</a>
            </li>
            <li>
                <a href="#">Lịch Thi</a>
            </li>
            <li>
                <a href="#">Tra Cứu Kết Quả</a>
            </li>
            <li>
                <a href="#">Tra Cứu Văn Bằng</a>
            </li>
            <li>
                <a href="#">Liên Hệ</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SideBar",
};
</script>

<style scoped>
.sidebar {
    background-color: #f4f4f4;
    min-height: 100%;
}

.sidebar ul {
    display: flex;
    margin-top: 40px;
    list-style-type: none;
    flex-direction: column;
}

.sidebar ul li {
    padding: 15px;
}

.sidebar ul li a {
    font-weight: 800;
    text-decoration: none;
    border: solid 1px #333;
    border-radius: 10px;
    padding: 10px 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.sidebar ul li a:hover {
    background-color: #e64a19;
}
</style>