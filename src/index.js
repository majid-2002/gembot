import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("200 | Server Running");
});

app.use("/webhook", webhookRoutes);

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
});
