<template>
    <div class="courses-container">

        <div v-for="course in visibleCourses" :key="course.id" class="course-card">
            <router-link to="/incourse">
                <div :class="course.bgClass" class="course-header">
                    <img src="../assets/image/course_01.png" alt="khóa học">
                </div>
                <div class="course-content">
                    <h2 class="course-title">{{ course.title }}</h2>
                    <p>{{ course.description }}</p>
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
// import InCourse from './InCourse.vue';

export default {
    // name: "Course",
    // components: [
    //     InCourse,
    // ],
    data() {
        return {
            courses: [
                { id: 1, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "130.577", date: "10/10/2024", bgClass: "bg-purple" },
                { id: 2, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "29.882", date: "10/10/2024", bgClass: "bg-teal" },
                { id: 3, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "201.338", date: "10/10/2024", bgClass: "bg-blue" },
                { id: 4, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "45.296", date: "10/10/2024", bgClass: "bg-pink" },
                { id: 5, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "45.296", date: "10/10/2024", bgClass: "bg-pink" },
                { id: 6, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "45.296", date: "10/10/2024", bgClass: "bg-pink" },
                { id: 7, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "45.296", date: "10/10/2024", bgClass: "bg-pink" },
                { id: 8, title: "Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", description: "Giới thiệu Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin", price: "Miễn phí", participants: "45.296", date: "10/10/2024", bgClass: "bg-pink" },
            ],
            maxVisibleCourses: 8, // Số lượng thẻ tối đa được hiển thị
        };
    },
    mounted() {
        this.updateMaxVisibleCourses();
        window.addEventListener('resize', this.updateMaxVisibleCourses);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateMaxVisibleCourses);
    },
    computed: {
        visibleCourses() {
            // Tính toán số lượng thẻ được hiển thị dựa trên độ rộng màn hình
            return this.courses.slice(0, this.maxVisibleCourses);
        },
    },
    methods: {
        updateMaxVisibleCourses() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 768) {
                this.maxVisibleCourses = 4; // Khi dưới 768px, chỉ hiển thị 4 thẻ
            } else if (screenWidth <= 480) {
                this.maxVisibleCourses = 2; // Khi dưới 480px, chỉ hiển thị 2 thẻ
            } else {
                this.maxVisibleCourses = this.courses.length; // Trên 768px, hiển thị tất cả thẻ
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
    justify-content: space-between;
    margin-top: 10px;
    padding-bottom: 50px;
}

.course-card {
    max-width: 300px;
    min-height: 200px;
    flex: 1 1 calc(25% - 16px);
    background-color: #F4F6FF;
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
    color: black;
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
