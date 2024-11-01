const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Import thư viện cors

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:3002",
  })
);

// Kết nối database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "P28LsJyK",
  database: "luanvan",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Đã kết nối MySQL!");
});

// ----------------------------------------------------------------*----------------------------------------------------------------

// Tạo route lấy dữ liệu từ bảng `danh_sach_lop_cb217`
app.get("/api/danh-sach-lop-cb217", (req, res) => {
  db.query("SELECT * FROM danh_sach_lop_cb217", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route lấy dữ liệu từ bảng hoc_phi
app.get("/api/hoc-phi", (req, res) => {
  const query = "SELECT ten_lop, le_phi, le_phi_sinh_vien FROM hoc_phi";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu học phí:", err);
      res.status(500).send("Lỗi khi lấy dữ liệu học phí từ cơ sở dữ liệu.");
    } else {
      res.json(results);
    }
  });
});

// Lấy dữ liệu của tất cả các khóa học
app.get("/api/courses", (req, res) => {
  const query = `
    SELECT id, ten_lop_dao_tao, gioi_thieu, muc_tieu, noi_dung, trinh_do, so_buoi, so_tiet_ly_thuyet, so_tiet_thuc_hanh
    FROM lop_dao_tao
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách khóa học:", err);
      res.status(500).send("Lỗi khi lấy danh sách khóa học từ cơ sở dữ liệu.");
    } else {
      res.json(results);
    }
  });
});

// Lấy dữ liệu chi tiết của một khóa học theo ID
app.get("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id); // Lấy ID từ tham số của route

  // Kiểm tra xem courseId có phải là một số hợp lệ hay không
  if (isNaN(courseId)) {
    return res.status(400).json({ error: "ID không hợp lệ." }); // Trả về lỗi nếu ID không hợp lệ
  }

  const query = `SELECT * FROM lop_dao_tao WHERE id = ?`; // Câu truy vấn để lấy dữ liệu chi tiết

  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu chi tiết khóa học:", err);
      res.status(500).send("Lỗi khi lấy dữ liệu khóa học từ cơ sở dữ liệu.");
    } else if (results.length === 0) {
      res.status(404).json({ error: "Không tìm thấy khóa học." });
    } else {
      res.json(results[0]); // Trả về dữ liệu khóa học
    }
  });
});

// Tạo route lấy dữ liệu từ bảng `thong_bao_chieu_sinh`
app.get("/api/thong-bao-chieu-sinh", (req, res) => {
  db.query("SELECT * FROM thong_bao_chieu_sinh", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      res.status(500).send("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/thong-bao-chieu-sinh/:id", (req, res) => {
  const id = req.params.id;

  // Lấy thông báo và tên bảng lớp học
  db.query(
    "SELECT * FROM thong_bao_chieu_sinh WHERE id = ?",
    [id],
    (err, thongBaoResult) => {
      if (err) {
        console.error("Lỗi khi lấy thông báo chiêu sinh:", err);
        res.status(500).send("Lỗi khi lấy thông báo chiêu sinh.");
        return;
      }

      if (thongBaoResult.length === 0) {
        res.status(404).send("Không tìm thấy thông báo chiêu sinh.");
        return;
      }

      const thongBao = thongBaoResult[0];
      const tableName = thongBao.table_name;

      // Lấy dữ liệu lớp học từ bảng lớp học tương ứng
      const queryLopHoc = `SELECT * FROM ${tableName}`;
      db.query(queryLopHoc, (err, lopHocResults) => {
        if (err) {
          console.error("Lỗi khi lấy dữ liệu lớp học:", err);
          res.status(500).send("Lỗi khi lấy dữ liệu lớp học.");
        } else {
          res.json({ thongBao, lopHocList: lopHocResults });
        }
      });
    }
  );
});

// API tạo thông báo mới và tự động tạo bảng lớp học
app.post("/api/add-thong-bao-chieu-sinh", (req, res) => {
  const { tieu_de, gioi_thieu } = req.body;

  // Tạo tên bảng dựa trên tháng, năm hiện tại
  const now = new Date();
  const tableName = `chieu_sinh_t${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}_${now.getFullYear()}`;

  // Tạo bảng nếu chưa tồn tại
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      lop VARCHAR(10) PRIMARY KEY,
      ngay_khai_giang DATE,
      phong VARCHAR(10),
      so_buoi VARCHAR(10),
      buoi_hoc VARCHAR(50)
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Lỗi khi tạo bảng:", err);
      res.status(500).send("Lỗi khi tạo bảng lớp học.");
      return;
    }

    // Thêm thông báo mới vào bảng thong_bao_chieu_sinh
    const insertThongBaoQuery = `
      INSERT INTO thong_bao_chieu_sinh (tieu_de, gioi_thieu, table_name)
      VALUES (?, ?, ?)
    `;

    db.query(
      insertThongBaoQuery,
      [tieu_de, gioi_thieu, tableName],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi thêm thông báo chiêu sinh:", err);
          res.status(500).send("Lỗi khi thêm thông báo chiêu sinh.");
        } else {
          res.json({
            message: "Thêm thông báo và bảng lớp học thành công.",
            id: result.insertId,
          });
        }
      }
    );
  });
});

// ----------------------------------------------------------------*----------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
