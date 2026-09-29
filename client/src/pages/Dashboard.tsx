import { useRef, useState } from "react";
import StreamControls from "../components/StreamControls";
import LogTerminal from "../components/LogTerminal";
import { connectToStream } from "../services/streamService";
import type { Log } from "../types/log";

function Dashboard() {

    const [clientId, setClientId] = useState("");
    const [logs, setLogs] = useState<Log[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const eventSourceRef = useRef<EventSource | null>(null);

    const handleStart = () => {
        if (!clientId || isStreaming) return;

        const eventSource = connectToStream(clientId, (log) => {
            setLogs((previousLogs) => [...previousLogs, log].slice(-100));
        });

        eventSourceRef.current = eventSource;
        setIsStreaming(true);
    };

    const handleStop = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        setIsStreaming(false);
    };

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

            <LogTerminal logs={logs} />
        </main>
    );


}

export default Dashboard;