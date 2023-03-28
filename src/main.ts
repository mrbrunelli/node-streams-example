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
    read() {
      for (const item of generateMassiveData()) {
        this.push(JSON.stringify(item));
      }
      this.push(null);
    },
  }),
  new Transform({
    transform(chunk, encoding, callback) {
      setTimeout(() => {
        callback(null, `${chunk}\n`);
      }, 50);
    },
  }),
  createWriteStream("output.txt")
);
