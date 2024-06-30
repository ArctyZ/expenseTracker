import fs from "fs/promises";

const filePath = "./src/data/db.json";

export async function getExpense() {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  }