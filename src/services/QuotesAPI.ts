import axios from "axios";
import { Quote } from "../models/Quote.js";

export class QuotesAPI {
  private BASE_URL = "https://type.fit/api";

  async getQuotes(): Promise<Quote[]> {
    try {
      const { data } = await axios.get<Quote[]>(`${this.BASE_URL}/quotes`);
      return data;
    } catch {
      return [];
    }
  }
}
