const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:3002",
  })
);

app.use(express.json());
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Không thể kết nối MySQL:", err);
  } else {
    console.log("Đã kết nối MySQL!");
  }
});

// Middleware xác thực người dùng và kiểm tra vai trò
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token không tồn tại" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token không hợp lệ" });
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền dựa trên vai trò
const authorizeRole = (roles) => (req, res, next) => {
  const userRole = req.user.role;
  if (!roles.includes(userRole)) {
    return res.status(403).json({ error: "Không có quyền truy cập" });
  }
  next();
};

// ----------------------------------------------------------------*----------------------------------------------------------------

// Đăng ký người dùng mới (Chỉ admin có thể đăng ký người dùng mới)
app.post(
  "/register",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { username, email, password, role, full_name } = req.body;

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0)
          return res.status(400).json({ error: "Email đã được sử dụng" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)",
          [username, email, hashedPassword, role || "guest", full_name],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(201).json({ message: "Đăng ký người dùng thành công" });
          }
        );
      }
    );
  }
);

// Đăng nhập
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email và mật khẩu không được để trống" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng" });

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res
          .status(401)
          .json({ error: "Email hoặc mật khẩu không đúng" });

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  );
});

// Đăng xuất
app.post("/logout", (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
});

// ----------------------------------------------------------------*----------------------------------------------------------------

// API dành cho admin: Thêm, sửa, xóa lớp học (chỉ dành cho admin)
app.post(
  "/api/courses",
  // authenticateToken,
  // authorizeRole(["admin"]),
  (req, res) => {
    const {
      ten_lop_dao_tao,
      gioi_thieu,
      muc_tieu,
      noi_dung,
      trinh_do,
      so_buoi,
      so_tiet_ly_thuyet,
      so_tiet_thuc_hanh,
    } = req.body;
    const query =
      "INSERT INTO lop_dao_tao (ten_lop_dao_tao, gioi_thieu, muc_tieu, noi_dung, trinh_do, so_buoi, so_tiet_ly_thuyet, so_tiet_thuc_hanh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        ten_lop_dao_tao,
        gioi_thieu,
        muc_tieu,
        noi_dung,
        trinh_do,
        so_buoi,
        so_tiet_ly_thuyet,
        so_tiet_thuc_hanh,
      ],
      (err, results) => {
        if (err) return res.status(500).send("Lỗi khi thêm lớp học");
        res.status(201).json({ id: results.insertId });
      }
    );
  }
);

app.put(
  "/api/courses/:id",
  // authenticateToken,
  // authorizeRole(["admin"]),
  (req, res) => {
    const courseId = parseInt(req.params.id);
    const {
      ten_lop_dao_tao,
      gioi_thieu,
      muc_tieu,
      noi_dung,
      trinh_do,
      so_buoi,
      so_tiet_ly_thuyet,
      so_tiet_thuc_hanh,
    } = req.body;
    const query =
      "UPDATE lop_dao_tao SET ten_lop_dao_tao = ?, gioi_thieu = ?, muc_tieu = ?, noi_dung = ?, trinh_do = ?, so_buoi = ?, so_tiet_ly_thuyet = ?, so_tiet_thuc_hanh = ? WHERE id = ?";

    db.query(
      query,
      [
        ten_lop_dao_tao,
        gioi_thieu,
        muc_tieu,
        noi_dung,
        trinh_do,
        so_buoi,
        so_tiet_ly_thuyet,
        so_tiet_thuc_hanh,
        courseId,
      ],
      (err) => {
        if (err) return res.status(500).send("Lỗi khi cập nhật lớp học");
        res.status(200).send("Cập nhật lớp học thành công!");
      }
    );
  }
);

app.delete(
  "/api/courses/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  (req, res) => {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId))
      return res.status(400).json({ error: "ID lớp học không hợp lệ" });

    db.query("DELETE FROM lop_dao_tao WHERE id = ?", [courseId], (err) => {
      if (err) return res.status(500).send("Lỗi khi xóa lớp học");
      res.status(204).send();
    });
  }
);

// API cho giáo viên và học viên: Xem danh sách khóa học
app.get(
  "/api/courses",
  // authenticateToken,
  // authorizeRole(["admin", "teacher", "student"]),
  (req, res) => {
    db.query("SELECT * FROM lop_dao_tao", (err, results) => {
      if (err) return res.status(500).send("Lỗi khi lấy danh sách khóa học");
      res.json(results);
    });
  }
);

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

// API cho khách: Xem thông tin công khai về chiêu sinh
app.get(
  "/api/thong-bao-chieu-sinh",
  // authenticateToken,
  // authorizeRole(["admin", "teacher", "student", "guest"]),
  (req, res) => {
    db.query("SELECT * FROM thong_bao_chieu_sinh", (err, results) => {
      if (err) return res.status(500).send("Lỗi khi lấy thông tin chiêu sinh");
      res.json(results);
    });
  }
);

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
      if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).send("Tên bảng không hợp lệ.");
      }

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

// Tạo route lấy dữ liệu từ bảng `GiaoVien`
app.get("/api/danh-sach-giao-vien", (req, res) => {
  db.query("SELECT * FROM GiaoVien", (err, results) => {
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

// API lấy thông tin chi tiết của người dùng
// Thêm API để lấy thông tin user
app.get("/api/user/profile", verifyToken, (req, res) => {
  const userId = req.user.id; // Lấy ID từ token
  const sql =
    "SELECT username, email, full_name, avatar_url FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi khi truy xuất dữ liệu người dùng" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(result[0]); // Trả về thông tin người dùng
  });
});

// ----------------------------------------------------------------*----------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
