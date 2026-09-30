import {
  createLog,
  type LogLevel,
} from "../utils/logGenerator.js";
import { emitLog } from "./streamRegistry.js";

export function injectLog(
    streamId: string,
    level: LogLevel,
    message: string
): boolean {
    const log = createLog(level, message);
    
    return emitLog(streamId, log);
}