import type { Log } from "../types/log";

const API_URL = import.meta.env.VITE_API_URL;

//EventSource is a browser API specifically for SSE
//it opens GET API_URL:stream?clientId=? and keeps that connection open.
//hence we don't need to fetch() every 500ms

//Signature of this function
//It accepts a clientId which is sent to backend
//A callback function called onLog it means whenever a log arrives this function will give log to this callback function
//and we have onError in case SSE connection encounters an error we can tell React component.

export function connectToStream(
    clientId: string,
    onLog: (log: Log) => void,
    onError?: () => void
) {

   

    const eventSource = new EventSource(
        `${API_URL}/api/stream?clientId=${encodeURIComponent(clientId)}`
    );

    eventSource.onmessage = (event) => {
        const log: Log = JSON.parse(event.data);
        onLog(log);
    };

    eventSource.onerror = () => {
        onError?.();
    };

    return eventSource;


}