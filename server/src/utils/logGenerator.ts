export type LogLevel = "INFO" | "WARN" | "ERROR";

//This file is for generating LOGS randomly

//This defines an object where key is of type LogLevel and value is array of strings

const messages: Record<LogLevel, string[]> = {
    INFO: [
        "Dashboard session successfully initialized.",
        "Database connection benchmark: stable.",
        "Re-indexing background cache elements...",
    ],
    WARN: [
        "High system memory allocation detected.",
        "API response latency is increasing.",
        "Background worker queue is growing.",
    ],
    ERROR: [
        "API network request failed with status 500.",
        "Database query failed unexpectedly.",
        "Background worker encountered an error.",
    ],

};

export function generateLog() {
  const levels: LogLevel[] = ["INFO", "WARN", "ERROR"];
  const level = levels[Math.floor(Math.random() * levels.length)];

  //We randomly select one of out 3 levels ie info, warn and error
  //then select one of the messages from the sublist

  const levelMessages = messages[level as LogLevel];
  const message =
    levelMessages[Math.floor(Math.random() * levelMessages.length)];

  const now = new Date();

  const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(
    now.getMilliseconds()
  ).padStart(3, "0")}`;

  //this was to convert the current date into HH:MM:SS:mmm format

  //eg return type is 
  //{
  //level: "WARN",
  //timestamp: "15:46:23.047",
  //message: "High system memory allocation detected."
  //}

  return {
    level,
    timestamp,
    message,
  };
}

