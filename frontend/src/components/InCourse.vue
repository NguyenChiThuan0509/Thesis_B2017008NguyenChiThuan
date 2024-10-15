<template>
    <div class="course-detail">
        <h1>{{ course.title }}</h1>
        <p>{{ course.description }}</p>
        <p><strong>Giá:</strong> {{ course.price }}</p>
        <p><strong>Số lượng tham gia:</strong> {{ course.participants }}</p>
        <p><strong>Số bài học:</strong> {{ course.lessons }}</p>
        <p><strong>Thời lượng:</strong> {{ course.duration }}</p>
    </div>
</template>
