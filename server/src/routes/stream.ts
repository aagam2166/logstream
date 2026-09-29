import { Router } from "express";
import type { Request, Response } from "express";
import { generateLog } from "../utils/logGenerator.js";


//In this file we are creating SSE connection between the clinet and server
//and we are creating /api/stream

const router = Router();

router.get("/stream", (req: Request, res: Response) => {
    const clientId = req.query.clientId as string;

    if (!clientId) {
        res.status(400).json({ error: "clientId is required" });
        return;
    }

    //now we are heading some headers to make sure that the connection does not close
    //after one req res cycle.

    res.setHeader("Content-Type", "text/event-stream"); //This header is for telling HTTP response is an SSE stream because normally its application/json
    res.setHeader("Cache-Control", "no-cache"); //This is just to tell the browser not to cache the response as we want it to receive live stream
    res.setHeader("Connection", "keep-alive"); //This to make sure connection doesn't die

    //setInterval function executes a given function repeatedly every given amount of time here 0.5 seconds
    //we hvae to use this because we want to generate logs continously

    const interval = setInterval(() => {
        const log = generateLog();

        res.write(`data: ${JSON.stringify(log)}\n\n`);
    }, 500);

    //This continously listens for client connection closing

    req.on("close", () => {
        clearInterval(interval);
        console.log(`Stream closed for client: ${clientId}`);
    });


});

export default router;
