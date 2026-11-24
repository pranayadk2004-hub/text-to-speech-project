const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Frontend connected to Backend successfully!"
    });
});

app.listen(5000, () => {
    console.log("Backend running on port 5000");
});