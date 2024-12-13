<template>
    <div>
        <!-- Nút "THÊM" chỉ hiển thị khi vai trò là admin -->
        <button v-if="isAdmin" @click="goToAddClass" class="add-class-button">
            THÊM
        </button>
        <div class="courses-container">
            <div v-for="course in visibleCourses" :key="course.id" class="course-card">
                <router-link :to="{ name: 'InCourse', params: { id: course.id } }">
                    <div :class="course.bgClass" class="course-header">
                        <img src="@/assets/image/course_01.png" alt="khóa học">
                    </div>
                    <div class="course-content">
                        <h2 class="course-title">{{ course.ten_lop_dao_tao }}</h2>
                        <p>{{ course.gioi_thieu }}</p>
                    </div>
                </router-link>
                <!-- Các nút "Xóa" và "Sửa" chỉ hiển thị khi vai trò là admin -->
                <div v-if="isAdmin" class="course-actions">
                    <button @click="deleteCourse(course.id)">Xóa</button>
                    <button @click="editCourse(course.id)">Sửa</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import AddClass from './AddClass.vue';
import UpdateClass from './UpdateClass.vue';
import { mapGetters } from 'vuex';

export default {
    name: "Course",
    components: {
        AddClass,
        UpdateClass
    },
    data() {
        return {
            courses: [],
            maxVisibleCourses: 8,
        };
    },
    computed: {
        ...mapGetters(["userRole"]),
        visibleCourses() {
            return this.courses.slice(0, this.maxVisibleCourses);
        },
        isAdmin() {
            return this.userRole === "admin";
        },
    },
    mounted() {
        this.fetchCourses();
        window.addEventListener('resize', this.updateMaxVisibleCourses);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateMaxVisibleCourses);
    },
    methods: {
        async fetchCourses() {
            try {
                const response = await axios.get('http://localhost:3000/api/courses');
                this.courses = response.data.map((course, index) => ({
                    ...course,
                    bgClass: this.getBgClass(index),
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
        goToAddClass() {
            this.$router.push({ name: 'AddClass' });
        },
        editCourse(courseId) {
            this.$router.push({ name: 'UpdateClass', params: { id: courseId } });
        },
        async deleteCourse(courseId) {
            if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
                try {
                    await axios.delete(`http://localhost:3000/api/courses/${courseId}`);
                    this.fetchCourses(); // Cập nhật danh sách khóa học
                } catch (error) {
                    console.error('Lỗi khi xóa khóa học:', error);
                }
            }
        },
    },
};
</script>

<style scoped>
.add-class-button {
    max-width: 120px;
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #08C2FF;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.add-class-button:hover {
    background-color: #006BFF;
}

.courses-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 10px;
    padding-bottom: 50px;
    justify-content: space-between;
}

.course-card {
    flex: 1 1 calc(25% - 16px);
    min-width: 200px;
    min-height: 250px;
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

.course-actions {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.course-actions button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.course-actions button:first-of-type {
    background-color: #dc3545;
    color: white;
}

.course-actions button:first-of-type:hover {
    background-color: #c82333;
}

.course-actions button:last-of-type {
    background-color: #ffc107;
    color: black;
}

.course-actions button:last-of-type:hover {
    background-color: #e0a800;
}

@media (max-width: 768px) {
    .course-card {
        flex: 1 1 calc(50% - 16px);
    }
}

@media (max-width: 480px) {
    .course-card {
        flex: 1 1 calc(100% - 16px);
    }
}
</style>
