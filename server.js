const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// โหลด database
function loadDB() {
    return JSON.parse(fs.readFileSync("./user_db.json", "utf8"));
}

// Save DB (ถ้าพี่อยากให้แก้ไข UID อัตโนมัติ)
function saveDB(db) {
    fs.writeFileSync("./user_db.json", JSON.stringify(db, null, 4));
}

// ===========================
// 🔥 API LOGIN
// ===========================
app.post("/login", (req, res) => {
    const { username, password, uid } = req.body;

    // โหลด Database
    const db = loadDB();

    // ตรวจ User / Pass
    const user = db.users.find(u =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
        return res.json({ status: "error", msg: "Invalid login" });
    }

    // ===========================
    // 🔥 ตรวจ UID
    // ===========================
    if (user.uid !== uid) {
        return res.json({ status: "invalid_uid", msg: "UID not match" });
    }

    // ===========================
    // 🔥 ตรวจวันหมดอายุ
    // ===========================
    const today = new Date();
    const expire = new Date(user.expire);

    if (today > expire) {
        return res.json({ status: "expired", msg: "License expired" });
    }

    // ===========================
    // 🔥 Login สำเร็จ
    // ===========================
    res.json({
        status: "ok",
        msg: "Login success",
        expire: user.expire
    });
});

// ===========================
// 🔥 Start Server
// ===========================
app.listen(3000, () => {
    console.log("API Running on port 3000");
});
