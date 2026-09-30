import { EventEmitter } from "node:events";
import type { Log } from "../utils/logGenerator.js";

//Node.js provides a built-in class EventEmitter 
//It acts as a small message channel

const streams = new Map<string, EventEmitter>();



export function createStream(streamId: string): EventEmitter {
  const channel = new EventEmitter();

  streams.set(streamId, channel);

  return channel;
}

export function getStream(streamId: string): EventEmitter | undefined {
  return streams.get(streamId);
}

export function emitLog(streamId: string, log: Log): boolean {
  const stream = streams.get(streamId);

  if (!stream) {
    return false;
  }

  

  return stream.emit("log", log);
  //this triggers an event.
}

export function removeStream(streamId: string): void {
  streams.delete(streamId);
}