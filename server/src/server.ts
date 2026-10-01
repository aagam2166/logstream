import express from "express";
import cors from "cors";
import streamRouter from "./routes/stream.js";
import injectRouter from "./routes/inject.js"

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/",(_req,res)=>{
    res.json({
        message: "LogStream server is running",
    });
});

app.use("/api", streamRouter);
app.use("/api", injectRouter);

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});