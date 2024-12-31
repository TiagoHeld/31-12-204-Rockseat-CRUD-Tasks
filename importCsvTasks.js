import fs from "fs";
import { parse } from "csv-parse";

async function importCsvTasks(filePath) {
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true }));
  for await (const record of parser) {
    const { title, description } = record;

    try {
      const response = await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        console.log(`Task criada com sucesso: ${title}`);
      } else {
        console.error(
          `Erro ao criar task: ${title} - Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(`Erro ao criar task: ${title}`, error.message);
    }
  }
}

const filePath = "./tasks.csv";

importCsvTasks(filePath)
  .then(() => console.log("Importação finalizada"))
  .catch((error) => console.error("Erro na importação:", error.message));
