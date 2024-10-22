<template>
    <div class="incourse-container">
        <!-- Phần nội dung khóa học bên trái -->
        <div class="incourse">
            <!-- Tiêu đề khóa học -->
            <h1>Chứng Chỉ Ứng Dụng Công Nghệ Thông Tin Cơ Bản</h1>
            <p>là chứng chỉ quốc gia theo Chuẩn do Bộ Thông tin và Truyền thông quy định, được ban hành tại Thông tư
                17/2016/TTLT-BGDĐT-BTTTT.
            </p>

            <!-- Bạn sẽ học được gì -->
            <div class="learning-goals">
                <h2>Bạn sẽ học được gì?</h2>
                <ul>
                    <li>✔ Hiểu biết về công nghệ thông tin cơ bản</li>
                    <li>✔ Sử dụng máy tính cơ bản</li>
                    <li>✔ Xử lý văn bản cơ bản</li>
                    <li>✔ Sử dụng bảng tính cơ bản</li>
                    <li>✔ Sử dụng trình chiếu cơ bản</li>
                    <li>✔ Sử dụng Internet cơ bản</li>
                    <li>✔ Được nhận chứng chỉ khi hoàn thành khóa học</li>
                </ul>
            </div>

            <!-- Nội dung khóa học -->
            <div class="course-content">
                <h2>Nội dung khóa học</h2>
                <p>19 chương • </p>

                <!-- Các phần khóa học -->
                <div class="section">
                    <h3>1. Kiến thức cơ bản máy tính - mạng máy tính</h3>
                    <!-- <ul>
                        <li>1. Mô hình Client - Server là gì? <span>11:35</span></li>
                        <li>2. Domain là gì? Tên miền là gì? <span>10:34</span></li>
                        <li>3. Mua áo F8 | Đăng ký học Offline <span>01:00</span></li>
                    </ul> -->
                </div>

                <div class="section">
                    <h3>2. Các ứng dụng của công nghệ thông tin</h3>
                    <!-- <ul>
                        <li>3 bài học</li>
                    </ul> -->
                </div>

                <div class="section">
                    <h3>3. Một số vấn đề liên quan khi sử dụng CNTT-TT</h3>
                    <!-- <ul>
                        <li>4 bài học</li>
                    </ul> -->
                </div>

                <div class="section">
                    <h3>4. ......</h3>
                    <!-- <ul>
                        <li>4 bài học</li>
                    </ul> -->
                </div>
            </div>
        </div>

        <!-- Phần thông tin khóa học bên phải -->
        <div class="course-info">
            <div class="course-demo">
                <img src="../assets/image/course_01.png" alt="demo khóa học" />
            </div>

            <div class="course-details">
                <h3>Miễn phí</h3>
                <button class="register-button">Đăng ký học</button>
                <ul class="details-list">
                    <li>Trình độ: Cơ bản</li>
                    <li>Số buổi: 30</li>
                    <li>Số tiết lý thuyết: 60</li>
                    <li>Số tiết thực hành: 60</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.incourse-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.incourse {
    width: 65%;
    padding-right: 20px;
}

.course-info {
    width: 30%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
}

h1,
h2 {
    font-size: 25px;
    font-weight: bold;
}


.learning-goals h2 {
    margin-top: 20px;
    font-size: 22px;
}

.learning-goals ul {
    list-style-type: none;
    padding: 0;
}

.learning-goals ul li {
    font-size: 16px;
    padding: 5px 0;
}

.course-content h2 {
    margin-top: 20px;
    font-size: 22px;
}

.course-content p {
    font-size: 16px;
    color: #888;
}

.section {
    margin-top: 20px;
}

.section h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.section ul {
    list-style-type: none;
    padding: 0;
}

.section ul li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
}

.section ul li span {
    font-size: 14px;
    color: #888;
}

.course-info .course-demo {
    text-align: center;
}

.course-demo img {
    max-width: 100%;
    object-fit: fill;
    border-radius: 10px;
}

.course-info .course-details {
    margin-top: 20px;
    text-align: center;
}

.course-info h3 {
    font-size: 28px;
    color: #ff6f61;
    margin-bottom: 15px;
}

.register-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.register-button:hover {
    background-color: #0056b3;
}

.details-list {
    padding: 0;
    font-size: 16px;
    color: #666;
    margin-top: 20px;
    list-style-type: none;
}

.details-list li {
    margin-bottom: 10px;
}
</style>