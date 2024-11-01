<template>
    <div class="courses-container">
        <div v-for="course in visibleCourses" :key="course.id" class="course-card">
            <router-link :to="{ name: 'InCourse', params: { id: course.id } }">
                <div :class="course.bgClass" class="course-header">
                    <img src="@/assets/image/course_01.png" alt="khóa học">
                </div>
                <div class="course-content">
                    <h2 class="course-title">{{ course.ten_lop_dao_tao }}</h2>
                    <p>{{ course.gioi_thieu }}</p>
                    <p class="course-price">{{ course.price }}</p>
                    <div class="course-details">
                        <div class="detail">
                            <i class="fa-solid fa-user"></i>
                            <span>{{ course.participants }}</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-clock"></i>
                            <span>{{ course.date }}</span>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            courses: [],
            maxVisibleCourses: 8,
        };
    },
    mounted() {
        this.fetchCourses();
        window.addEventListener('resize', this.updateMaxVisibleCourses);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateMaxVisibleCourses);
    },
    computed: {
        visibleCourses() {
            return this.courses.slice(0, this.maxVisibleCourses);
        },
    },
    methods: {
        async fetchCourses() {
            try {
                const response = await axios.get('http://localhost:3000/api/courses');
                this.courses = response.data.map((course, index) => ({
                    ...course,
                    bgClass: this.getBgClass(index),
                    price: "Miễn phí",
                    participants: "Số lượng tham gia",
                    date: "Ngày khai giảng",
                }));
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khóa học:', error);
            }
        },
        getBgClass(index) {
            const colors = ["bg-purple", "bg-teal", "bg-blue", "bg-pink"];
            return colors[index % colors.length];
        },
        updateMaxVisibleCourses() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                this.maxVisibleCourses = 4;
            } else if (screenWidth <= 480) {
                this.maxVisibleCourses = 2;
            } else {
                this.maxVisibleCourses = this.courses.length;
            }
        },
    },
};
</script>



<style scoped>
.courses-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    /* justify-content: space-between; */
    margin-top: 10px;
    padding-bottom: 50px;
}

.course-card {
    max-width: 300px;
    min-height: 200px;
    flex: 1 1 calc(25% - 16px);
    background-color: #F5F5F5;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    overflow: hidden;
    color: black;
    display: flex;
    flex-direction: column;
}

.course-card:hover {
    transform: translateY(-5px);
}

.course-header {
    /* padding: 16px; */
    color: black;
    text-align: center;
    font-size: medium;
    font-weight: bolder;
}

.course-header img {
    max-width: 100%;
    object-fit: fill;
}

.course-content {
    padding: 10px;
}

.course-title {
    color: #2570BB;
    font-size: 18px;
    font-weight: bolder;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.course-price {
    color: red;
    font-weight: bold;
}

.course-details {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
}

.detail {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Khi màn hình nhỏ hơn 768px, mỗi hàng hiển thị 2 thẻ */
@media (max-width: 768px) {
    .course-card {
        flex: 1 1 calc(50% - 16px);
    }
}

/* Khi màn hình nhỏ hơn 480px, mỗi hàng hiển thị 1 thẻ */
@media (max-width: 480px) {
    .course-card {
        flex: 1 1 calc(50% - 16px);
    }
}
</style>
