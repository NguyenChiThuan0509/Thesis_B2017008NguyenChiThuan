const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

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

// Middleware xác thực token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }
    req.user = user;
    next();
  });
}

// Middleware kiểm tra quyền dựa trên vai trò
function authorizeRole(roles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }
    next();
  };
}

// Cấu hình multer để lưu trữ tệp tải lên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Đường dẫn lưu tệp
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên tệp duy nhất
  },
});
const upload = multer({ storage: storage });

// ----------------------------------------------------------------*----------------------------------------------------------------

// Đăng ký người dùng mới (Chỉ admin)
app.post(
  "/register",
  verifyToken,
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
          (err) => {
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

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
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

// API lấy thông tin người dùng
app.get("/api/user/profile", verifyToken, (req, res) => {
  const userId = req.user.id; // Lấy ID từ token
  const sql = "SELECT * FROM users WHERE id = ?";

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

// Endpoint lấy danh sách học viên
app.get("/api/students", (req, res) => {
  const query = "SELECT * FROM users WHERE role = 'student'";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn database:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
});

// ----------------------------------------------------------------*----------------------------------------------------------------

// API thêm, sửa, xóa lớp học (chỉ admin)
app.post("/api/courses", verifyToken, authorizeRole(["admin"]), (req, res) => {
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
});

app.put(
  "/api/courses/:id",
  // verifyToken,
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
  verifyToken,
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

app.get(
  "/api/courses",
  // verifyToken,
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

app.get(
  "/api/thong-bao-chieu-sinh",
  // verifyToken,
  // authorizeRole(["admin", "teacher", "student", "guest"]),
  (req, res) => {
    db.query("SELECT * FROM thong_bao_chieu_sinh", (err, results) => {
      if (err) return res.status(500).send("Lỗi khi lấy thông tin chiêu sinh");
      res.json(results);
    });
  }
);

// Endpoint lấy thông tin thông báo và danh sách các lớp chiêu sinh
app.get("/api/thong-bao-chieu-sinh/:id", (req, res) => {
  const id = req.params.id;

  // Lấy thông báo chiêu sinh
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

      // Lấy danh sách lớp chiêu sinh liên quan
      db.query(
        "SELECT * FROM lop_chieu_sinh WHERE thong_bao_id = ?",
        [id],
        (err, lopHocResults) => {
          if (err) {
            console.error("Lỗi khi lấy danh sách lớp chiêu sinh:", err);
            res.status(500).send("Lỗi khi lấy danh sách lớp chiêu sinh.");
          } else {
            res.json({ thongBao, lopHocList: lopHocResults });
          }
        }
      );
    }
  );
});
// ----------------------------------------------------------------*----------------------------------------------------------------

// API lấy thông tin chi tiết thông báo lịch thi
app.get("/api/thong-bao-lich_thi/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID không hợp lệ" });
  }

  const query = "SELECT * FROM thong_bao_lich_thi WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin thông báo lịch thi:", err);
      return res.status(500).send("Lỗi khi lấy thông báo lịch thi.");
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy thông báo lịch thi." });
    }

    res.json(results[0]);
  });
});

// Lấy danh sách thông báo lịch thi
app.get("/api/thong-bao-lich_thi", (req, res) => {
  const query = "SELECT * FROM thong_bao_lich_thi";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông báo lịch thi:", err);
      return res.status(500).send("Lỗi khi lấy danh sách thông báo lịch thi.");
    }
    res.json(results);
  });
});

// API lấy danh sách lịch thi liên quan đến một thông báo
app.get("/api/lich-thi/:thong_bao_id", (req, res) => {
  const thongBaoId = parseInt(req.params.thong_bao_id, 10);
  if (isNaN(thongBaoId)) {
    return res.status(400).json({ error: "ID thông báo không hợp lệ" });
  }

  const query = "SELECT * FROM lich_thi WHERE thong_bao_id = ?";
  db.query(query, [thongBaoId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách lịch thi:", err);
      return res.status(500).send("Lỗi khi lấy danh sách lịch thi.");
    }

    res.json(results);
  });
});

app.post("/api/thong-bao-lich_thi", async (req, res) => {
  const { tieu_de, gioi_thieu } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO thong_bao_lich_thi (tieu_de, gioi_thieu) VALUES (?, ?)",
      [tieu_de, gioi_thieu]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi thêm thông báo.");
  }
});

app.post("/api/lich-thi", async (req, res) => {
  const { thong_bao_id, ngay_thi, han_dang_ky, yeu_cau, dia_chi_dang_ky } =
    req.body;
  try {
    await db.execute(
      "INSERT INTO lich_thi (thong_bao_id, ngay_thi, han_dang_ky, yeu_cau, dia_chi_dang_ky) VALUES (?, ?, ?, ?, ?)",
      [thong_bao_id, ngay_thi, han_dang_ky, yeu_cau, dia_chi_dang_ky]
    );
    res.status(201).send("Lịch thi đã được thêm.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi thêm lịch thi.");
  }
});

// API cập nhật lịch thi (Admin)
app.put(
  "/api/lich-thi/:id",
  verifyToken,
  authorizeRole(["admin"]),
  (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID lịch thi không hợp lệ" });
    }

    const { ngay_thi, ca_thi, dia_diem, ghi_chu } = req.body;

    const query =
      "UPDATE lich_thi SET ngay_thi = ?, ca_thi = ?, dia_diem = ?, ghi_chu = ? WHERE id = ?";
    db.query(query, [ngay_thi, ca_thi, dia_diem, ghi_chu, id], (err) => {
      if (err) {
        console.error("Lỗi khi cập nhật lịch thi:", err);
        return res.status(500).send("Lỗi khi cập nhật lịch thi.");
      }

      res.status(200).json({ message: "Cập nhật lịch thi thành công." });
    });
  }
);

// API xóa lịch thi (Admin)
app.delete(
  "/api/lich-thi/:id",
  verifyToken,
  authorizeRole(["admin"]),
  (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID lịch thi không hợp lệ" });
    }

    const query = "DELETE FROM lich_thi WHERE id = ?";
    db.query(query, [id], (err) => {
      if (err) {
        console.error("Lỗi khi xóa lịch thi:", err);
        return res.status(500).send("Lỗi khi xóa lịch thi.");
      }

      res.status(204).send();
    });
  }
);

// ----------------------------------------------------------------*----------------------------------------------------------------
// Tra cứu điểm
app.get("/api/tra-cuu-diem", (req, res) => {
  const { soBaoDanh, maKhoaThi, ngayThi } = req.query;

  if (!soBaoDanh || !maKhoaThi || !ngayThi) {
    return res.status(400).json({
      error: "Vui lòng nhập đầy đủ Số báo danh, Mã khóa thi và Ngày thi.",
    });
  }

  const query = `
    SELECT * 
    FROM bang_diem 
    WHERE so_bao_danh = ? AND ma_khoa_thi = ? AND ngay_thi = ?
  `;
  db.query(query, [soBaoDanh, maKhoaThi, ngayThi], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err);
      return res.status(500).json({ error: "Lỗi khi truy vấn dữ liệu." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy kết quả phù hợp." });
    }

    res.json(results[0]);
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

// ------------------------------------ U S E R --------------------

// API lấy danh sách người dùng
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách người dùng",
      });
    }
    res.status(200).json({ success: true, users: results });
  });
});

// API xóa người dùng
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Không thể xóa người dùng" });
    }
    res.status(200).json({ success: true, message: "Người dùng đã được xóa" });
  });
});

// API thêm người dùng
app.post("/api/users", upload.single("avatar"), (req, res) => {
  const { email, password, full_name, gioi_tinh, ngay_sinh, phone, role } =
    req.body;
  const avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `INSERT INTO users (email, password, full_name, gioi_tinh, ngay_sinh, phone, avatar_url, role) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [email, password, full_name, gioi_tinh, ngay_sinh, phone, avatar_url, role],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Không thể thêm người dùng" });
      }
      res
        .status(200)
        .json({ success: true, message: "Người dùng đã được thêm thành công" });
    }
  );
});

const dayjs = require("dayjs");

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  let { email, full_name, gioi_tinh, ngay_sinh, phone, role, password } =
    req.body;

  // Chuyển đổi định dạng ngày
  ngay_sinh = dayjs(ngay_sinh).format("YYYY-MM-DD");

  const query = `
        UPDATE users
        SET email = ?, full_name = ?, gioi_tinh = ?, ngay_sinh = ?, phone = ?, role = ?, password = ?
        WHERE id = ?
    `;

  db.query(
    query,
    [email, full_name, gioi_tinh, ngay_sinh, phone, role, password, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Không thể cập nhật thông tin người dùng",
        });
      }
      res.status(200).json({
        success: true,
        message: "Thông tin người dùng đã được cập nhật",
      });
    }
  );
});

// ----------------------------------------------------------------*----------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
