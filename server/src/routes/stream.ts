import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "node:crypto";

import { generateLog, type Log } from "../utils/logGenerator.js";
import {
    createStream,
    removeStream,
} from "../services/streamRegistry.js";

//In this file we are creating SSE connection between the clinet and server
//and we are creating /api/stream

const router = Router();

router.get("/stream", (req: Request, res: Response) => {
    const clientId = req.query.clientId as string;

    if (!clientId) {
        res.status(400).json({ error: "clientId is required" });
        return;
    }

    const streamId = crypto.randomUUID();
    const channel = createStream(streamId);

    //now we are heading some headers to make sure that the connection does not close
    //after one req res cycle.

    res.setHeader("Content-Type", "text/event-stream"); //This header is for telling HTTP response is an SSE stream because normally its application/json
    res.setHeader("Cache-Control", "no-cache"); //This is just to tell the browser not to cache the response as we want it to receive live stream
    res.setHeader("Connection", "keep-alive"); //This to make sure connection doesn't die

    console.log(`Stream started for client: ${clientId}`);
    res.write(
        `event: session\ndata: ${JSON.stringify({ streamId })}\n\n`
    );

    //setInterval function executes a given function repeatedly every given amount of time here 0.5 seconds
    //we hvae to use this because we want to generate logs continously

    const handleLog = (log: Log) => {
        res.write(`data: ${JSON.stringify(log)}\n\n`);
    };

    channel.on("log", handleLog);

    const interval = setInterval(() => {
        const log = generateLog();

        channel.emit("log", log);
    }, 500);
    //This continously listens for client connection closing

    res.on("close", () => {
        clearInterval(interval);
        channel.removeListener("log", handleLog);
        removeStream(streamId);
        console.log(`Stream closed for client: ${clientId}`);
    });


});

export default router;
