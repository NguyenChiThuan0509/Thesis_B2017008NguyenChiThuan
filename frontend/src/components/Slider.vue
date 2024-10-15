<template>
    <div class="container">
        <swiper-slide>
            <img src="@/assets/image/anh_dai_dien_TTDTTH.jpg" alt="Slider">
        </swiper-slide>
        <swiper-slide>
            <img src="@/assets/image/TTDTTH_1.jpg" alt="Slider">
        </swiper-slide>
        <swiper-slide>
            <img src="@/assets/image/TTDTTH_2.jpg" alt="Slider">
        </swiper-slide>
        <swiper-slide>
            <img src="@/assets/image/TTDTTH_3.jpg" alt="Slider">
        </swiper-slide>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
    name: 'Slider',
    components: {
        Swiper,
        SwiperSlide,
    },
};
</script>

<style scoped>
.swiper-container {
    width: 100%;
    height: 300px;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>