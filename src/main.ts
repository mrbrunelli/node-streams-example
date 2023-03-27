import express from "express";
import { randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { QuotesAPI } from "./services/QuotesAPI.js";

const app = express();
app.use(express.json());

app.get("/generate", async (req, res) => {
  const quotesAPI = new QuotesAPI();
  const quotes = await quotesAPI.getQuotes();

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

  pipeline(
    loadQuotes,
    addTimestamp,
    addUUID,
    addLinebreak,
    createWriteStream("output.txt")
  );

  return res.status(200).send("Streams generated successfully");
});

app.get("/streams", async (req, res) => {
  await pipeline(createReadStream("output.txt"), res);
});

app.get("/fs", async (req, res) => {
  const txt = await fs.readFile("output.txt");
  return res.send(txt.toString());
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
});
