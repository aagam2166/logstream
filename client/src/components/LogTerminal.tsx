import { useEffect, useRef } from "react";
import type { Log } from "../types/log";

interface LogTerminalProps {
    logs: Log[];
}

//This file defines how the terminal looks like and also 
//handles placement of logs on the terminal

function LogTerminal({ logs }: LogTerminalProps) {
    const terminalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <section className="mt-8">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-zinc-300">
                        TERMINAL
                    </span>

                    <span className="text-xs text-zinc-500">
                        LIVE OUTPUT
                    </span>
                </div>

                <span className="font-mono text-xs text-zinc-500">
                    {logs.length} logs
                </span>
            </div>

            <div
                ref={terminalRef}
                className="h-[500px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm shadow-inner"
            >
                {logs.map((log, index) => (
                    <div key={`${log.timestamp}-${index}`} className="leading-6">
                        <span className="mr-2 text-zinc-600">&gt;</span>

                        <span
                            className={
                                log.level === "INFO"
                                    ? "text-green-400"
                                    : log.level === "WARN"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                            }
                        >
                            [{log.level}]
                        </span>{" "}

                        <span className="text-zinc-400">{log.timestamp}</span>

                        <span className="text-zinc-600"> - </span>

                        <span className="text-zinc-200">{log.message}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LogTerminal;