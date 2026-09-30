import { useRef, useState } from "react";
import StreamControls from "../components/StreamControls";
import LogTerminal from "../components/LogTerminal";
import { connectToStream } from "../services/streamService";
import type { Log } from "../types/log";
import { downloadLogs } from "../services/logExportService";
import { Button } from "@/components/ui/button";
import { injectLog } from "../services/injectionService";
import { Input } from "@/components/ui/input";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type LogFilter = "ALL" | "INFO" | "WARN" | "ERROR";


function Dashboard() {

    const [clientId, setClientId] = useState("");
    const [logs, setLogs] = useState<Log[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<LogFilter>("ALL");
    const [streamId, setStreamId] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [customLevel, setCustomLevel] =
        useState<"INFO" | "WARN" | "ERROR">("INFO");

    const eventSourceRef = useRef<EventSource | null>(null);

    const handleStart = () => {
        if (!clientId || isStreaming) return;

        const eventSource = connectToStream(clientId, {
            onLog: (log) => {
                setLogs((previousLogs) => [...previousLogs, log].slice(-100));
            },

            onSession: (id) => {
                setStreamId(id);
            },
        });

        eventSourceRef.current = eventSource;
        setIsStreaming(true);
    };

    const handleInject = async () => {
        if (!streamId || !customMessage.trim()) return;

        await injectLog(streamId, customLevel, customMessage.trim());

        setCustomMessage("");
    }

    const handleStop = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        setStreamId("");
        setIsStreaming(false);
    };

    const filteredLogs = selectedFilter === "ALL" ? logs : logs.filter((log) => log.level === selectedFilter);

    return (
        <main className="min-h-screen bg-black p-6 text-white">
            <h1 className="mb-6 text-2xl font-bold">LogStream</h1>

            <StreamControls
                clientId={clientId}
                isStreaming={isStreaming}
                onClientIdChange={setClientId}
                onStart={handleStart}
                onStop={handleStop}
            />

            <div className="mt-4 flex gap-3">
                <Input
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter custom log message"
                    disabled={!isStreaming}
                />

                <Select
                    value={customLevel}
                    onValueChange={(value) =>
                        setCustomLevel(value as "INFO" | "WARN" | "ERROR")
                    }
                    disabled={!isStreaming}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="INFO">INFO</SelectItem>
                        <SelectItem value="WARN">WARN</SelectItem>
                        <SelectItem value="ERROR">ERROR</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    onClick={handleInject}
                    disabled={!isStreaming || !customMessage.trim()}
                >
                    Send
                </Button>
            </div>

            <Button
                className="mt-4"
                onClick={() => downloadLogs(filteredLogs)}
                disabled={filteredLogs.length === 0}
            >
                Save Session Output
            </Button>

            <div className="mt-4">
                <Select
                    value={selectedFilter}
                    onValueChange={(value) => setSelectedFilter(value as LogFilter)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter logs" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="ALL">All Logs</SelectItem>
                        <SelectItem value="INFO">Info Only</SelectItem>
                        <SelectItem value="WARN">Warnings Only</SelectItem>
                        <SelectItem value="ERROR">Errors Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <LogTerminal logs={filteredLogs} />
        </main>
    );

}

export default Dashboard;