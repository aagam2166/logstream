export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface Log {
    level: LogLevel;
    timestamp: string;
    message: string;
}

//This is just to let TypeScript know how Log will look like
//This helps in getting suggestions

