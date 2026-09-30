import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StreamControlProps {
    clientId: string;
    isStreaming: boolean;
    onClientIdChange: (value: string) => void;
    onStart: () => void;
    onStop: () => void;
}

function StreamControls({
    clientId,
    isStreaming,
    onClientIdChange,
    onStart,
    onStop,
}: StreamControlProps) {
    return (
        <div className="flex items-center gap-3">
            <Input
                className="max-w-xl"
                value={clientId}
                onChange={(e) => onClientIdChange(e.target.value)}
                placeholder="Client ID"
            />

            <Button disabled={isStreaming || !clientId} onClick={onStart}>
                Start Stream
            </Button>

            <Button disabled={!isStreaming} onClick={onStop}>
                Stop Stream
            </Button>
        </div>
    );
}

export default StreamControls;