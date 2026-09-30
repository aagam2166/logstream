const API_URL = import.meta.env.VITE_API_URL;

export async function injectLog(
    streamId: string,
    level: "INFO" | "WARN" | "ERROR",
    message: string
): Promise<void> {
    const response = await fetch(`${API_URL}/api/stream/inject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            streamId,
            level,
            message,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to inject log");
    }
}