const bcrypt = require("bcrypt");

// Danh sách các mật khẩu cần mã hóa
const passwords = ["admin", "passGiaovien", "passThuan", "tuanTran2312"];

async function hashPasswords() {
  const hashedPasswords = await Promise.all(
    passwords.map((password) => bcrypt.hash(password, 10))
  );
  console.log(hashedPasswords);
}

hashPasswords();
