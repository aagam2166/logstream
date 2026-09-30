import { useRef, useState } from "react";

import StreamControls from "../components/StreamControls";
import LogTerminal from "../components/LogTerminal";
import { connectToStream } from "../services/streamService";
import { downloadLogs } from "../services/logExportService";
import { injectLog } from "../services/injectionService";
import type { Log } from "../types/log";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type LogFilter = "ALL" | "INFO" | "WARN" | "ERROR";
type CustomLogLevel = "INFO" | "WARN" | "ERROR";

function Dashboard() {
    const [clientId, setClientId] = useState("");
    const [logs, setLogs] = useState<Log[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const [streamId, setStreamId] = useState("");

    const [selectedFilter, setSelectedFilter] =
        useState<LogFilter>("ALL");

    const [customMessage, setCustomMessage] = useState("");
    const [customLevel, setCustomLevel] =
        useState<CustomLogLevel>("INFO");

    const eventSourceRef = useRef<EventSource | null>(null);

    const handleStart = () => {
        if (!clientId || isStreaming) return;

        const eventSource = connectToStream(clientId, {
            onLog: (log) => {
                setLogs((previousLogs) =>
                    [...previousLogs, log].slice(-100)
                );
            },

            onSession: (id) => {
                setStreamId(id);
            },

            onError: () => {
                setIsStreaming(false);
            },
        });

        eventSourceRef.current = eventSource;
        setIsStreaming(true);
    };

    const handleStop = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;

        setStreamId("");
        setIsStreaming(false);
    };

    const handleInject = async () => {
        if (!streamId || !customMessage.trim()) return;

        await injectLog(
            streamId,
            customLevel,
            customMessage.trim()
        );

        setCustomMessage("");
    };

    const filteredLogs =
        selectedFilter === "ALL"
            ? logs
            : logs.filter(
                (log) => log.level === selectedFilter
            );

    return (
        <main className="min-h-screen bg-black px-6 py-8 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <header className="mb-8 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            LogStream
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">
                            Developer observability dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span
                            className={
                                isStreaming
                                    ? "text-green-400"
                                    : "text-zinc-500"
                            }
                        >
                            ●
                        </span>

                        <span className="text-zinc-400">
                            {isStreaming ? "LIVE" : "OFFLINE"}
                        </span>
                    </div>
                </header>

                {/* Stream Control */}
                <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-zinc-200">
                            Stream Control
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Start a real-time log stream for a client session.
                        </p>
                    </div>

                    <StreamControls
                        clientId={clientId}
                        isStreaming={isStreaming}
                        onClientIdChange={setClientId}
                        onStart={handleStart}
                        onStop={handleStop}
                    />
                </section>

                {/* Custom Log Injection */}
                <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-zinc-200">
                            Custom Log Injection
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Inject a custom log directly into the active stream.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Input
                            value={customMessage}
                            onChange={(e) =>
                                setCustomMessage(e.target.value)
                            }
                            placeholder="Enter custom log message..."
                            disabled={!isStreaming}
                            className="flex-1"
                        />

                        <Select
                            value={customLevel}
                            onValueChange={(value) =>
                                setCustomLevel(
                                    value as CustomLogLevel
                                )
                            }
                            disabled={!isStreaming}
                        >
                            <SelectTrigger className="w-[130px] border-zinc-700 bg-zinc-950 text-zinc-200">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100 [&_[data-highlighted]]:!text-white">
                                <SelectItem value="INFO">
                                    INFO
                                </SelectItem>

                                <SelectItem value="WARN">
                                    WARN
                                </SelectItem>

                                <SelectItem value="ERROR">
                                    ERROR
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleInject}
                            disabled={
                                !isStreaming ||
                                !customMessage.trim()
                            }
                        >
                            Send
                        </Button>
                    </div>
                </section>

                {/* Terminal Controls */}
                <div className="mt-6 mb-3 flex items-center justify-between">
                    <Select
                        value={selectedFilter}
                        onValueChange={(value) =>
                            setSelectedFilter(
                                value as LogFilter
                            )
                        }
                    >
                        <SelectTrigger className="w-[150px] border-zinc-700 bg-zinc-950 text-zinc-100">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100 [&_[data-highlighted]]:!text-white">
                            <SelectItem value="ALL">
                                All Logs
                            </SelectItem>

                            <SelectItem value="INFO">
                                Info Only
                            </SelectItem>

                            <SelectItem value="WARN">
                                Warnings Only
                            </SelectItem>

                            <SelectItem value="ERROR">
                                Errors Only
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={() => downloadLogs(filteredLogs)}
                        disabled={filteredLogs.length === 0}
                        className="border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                    >
                        Save Session Output
                    </Button>
                </div>

                {/* Terminal */}
                <LogTerminal logs={filteredLogs} />

            </div>
        </main>
    );
}

export default Dashboard;