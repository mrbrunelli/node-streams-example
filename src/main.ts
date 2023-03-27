import { time, timeEnd } from "node:console";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { QuotesAPI } from "./services/QuotesAPI.js";

time("Get API data");
const quotesAPI = new QuotesAPI();
const quotes = await quotesAPI.getQuotes();
timeEnd("Get API data");

time("Streams");
const loadQuotes = new Readable({
  read() {
    for (const quote of quotes) {
      this.push(JSON.stringify(quote));
    }
    this.push(null);
  },
});

const addTimestamp = new Transform({
  transform(chunk, encoding, callback) {
    const dto = JSON.parse(chunk);
    const quote = {
      ...dto,
      createdAt: new Date(),
    };
    callback(null, JSON.stringify(quote));
  },
});

const addUUID = new Transform({
  transform(chunk, encoding, callback) {
    const dto = JSON.parse(chunk);
    const quote = {
      ...dto,
      id: randomUUID(),
    };
    callback(null, JSON.stringify(quote));
  },
});

const addLinebreak = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, `${chunk}\n`);
  },
});

await pipeline(
  loadQuotes,
  addTimestamp,
  addUUID,
  addLinebreak,
  createWriteStream("output.txt")
);

timeEnd("Streams");
