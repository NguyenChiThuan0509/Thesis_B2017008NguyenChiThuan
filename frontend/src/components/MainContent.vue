<template>
    <div class="main-content">
        <!-- <Slider /> -->
        <div class="slider">
            <a href="#">
                <img src="@/assets/image/anh_dai_dien_TTDTTH.jpg" alt="anh_dai_dien">
            </a>

        </div>
        <div class="topic">
            <span>Lớp đào tạo</span>
        </div>
        <Course />
        <Footer />
    </div>
</template>

<script>
import Course from "./courses/Course.vue";
import Footer from "./Footer.vue";

export default {
    name: "MainContent",
    components: {
        Course,
        Footer,
    }
};
</script>

<style scoped>
.main-content {
    padding: 20px;
}

.slider img {
    width: 100%;
    max-height: 340px;
    /* padding: 10px; */
    border-radius: 20px;
}

.topic {
    margin: 15px 0;
}

.topic span {
    margin: 30px;
    color: black;
    border-bottom: 2px solid #333;
    font-size: 25px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>