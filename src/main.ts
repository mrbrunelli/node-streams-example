import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

function* generateMassiveData() {
  for (let i = 0; i < 1e5; i++) {
    yield {
      id: randomUUID(),
      createdAt: new Date(),
    };
  }
}

await pipeline(
  new Readable({
    objectMode: true,
    read() {
      for (const item of generateMassiveData()) {
        this.push(item);
      }
      this.push(null);
    },
  }),
  new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      setTimeout(() => {
        callback(null, `${JSON.stringify(chunk)}\n`);
      }, 50);
    },
  }),
  createWriteStream("output.txt")
);
