const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const FILE = "chat_history.json";

// đọc dữ liệu
function loadData() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

// ghi dữ liệu
function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// API chat
app.post("/chat", (req, res) => {
  const { message, sessionId } = req.body;
  let data = loadData();

  if (!data[sessionId]) data[sessionId] = [];

  let reply = "Tôi chưa hiểu.";
  if (message.toLowerCase().includes("xin chào")) reply = "Chào bạn!";
  else if (message.toLowerCase().includes("ai")) reply = "AI là trí tuệ nhân tạo.";

  // lưu lịch sử
  data[sessionId].push({
    user: message,
    bot: reply
  });

  saveData(data);

  res.json({ reply });
});

// API lấy lịch sử
app.get("/history/:sessionId", (req, res) => {
  const data = loadData();
  res.json(data[req.params.sessionId] || []);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));