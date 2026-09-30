import type { Request, Response } from "express";
import { injectLog } from "../services/injectionService.js";
import type { LogLevel } from "../utils/logGenerator.js";

export function handleLogInjection(req: Request, res: Response): void {
    const {streamId, level, message } = req.body;

    if (!streamId || !level || !message){
        res.status(400).json({
            error: "streamId, level and messsage are required",
        });
        return;
    }

    const success = injectLog(
        streamId, 
        level as LogLevel,
        message
    );

    if (!success){
        res.status(404).json({
            error: "Stream not found",
        });
        return;
    }

    res.status(200).json({
        message: "Log injected successfully",
    });
}