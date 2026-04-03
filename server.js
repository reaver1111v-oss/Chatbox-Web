const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Trả lời bằng tiếng Việt dễ hiểu: " + message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

// debug để xem lỗi thật
console.log("STATUS:", response.status);
console.log("DATA:", JSON.stringify(data, null, 2));

if (!response.ok) {
  return res.json({
    reply: "API lỗi: " + (data.error?.message || "Unknown error")
  });
}

const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!reply) {
  return res.json({
    reply: "Không có dữ liệu trả về (có thể sai API key hoặc hết quota)"
  });
}

res.json({ reply });

  } catch (error) {
    res.json({ reply: "Lỗi kết nối API Gemini 😢" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
