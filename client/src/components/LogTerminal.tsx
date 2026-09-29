import type { Log } from "../types/log";

interface LogTerminalProps {
    logs: Log[];
}

//This file defines how the terminal looks like and also 
//handles placement of logs on the terminal

function LogTerminal({ logs }: LogTerminalProps) {
    return (
        <div className="mt-6 h-[500px] overflow-y-auto rounded-lg bg-zinc-950 p-4 font-mono text-sm text-green-400">
            {logs.map((log, index) => (
                <div key={`${log.timestamp}-${index}`}>
                    [{log.level}] {log.timestamp} - {log.message}
                </div>
            ))}
        </div>
    );
}

export default LogTerminal;