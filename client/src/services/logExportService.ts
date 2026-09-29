import type { Log } from "../types/log";

//This file creates a function that can download logs given logs as an input


export function downloadLogs(logs: Log[]): void {
    const content = logs.map(
        (log) => `[${log.level}] ${log.timestamp} - ${log.message}`
    )
        .join("\n");

    //Blob([content]) here is an browser api which returns a blob object
    //blob object is something browser can treat like a file


    const blob = new Blob([content], {
        type: "text/plain",
    });

    //URL is also a browser API using this browser creates a temporary URL pointing to that Blob.


    const url = URL.createObjectURL(blob);

    //anchor is an html element created using js

    //anchor.download tells the browser to download the resource instead of navigating to it.

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "logs.txt";
    anchor.click();

    URL.revokeObjectURL(url);
}

