import path from "path";
import fs from "fs/promises";
import searchQuery from "search-query-parser";

import config from "../config";
import guru from "./guruClient";
import { GuruCard, GuruCardRaw } from "./guru";

export function checkAuth(): void {
  if (!config.has("auth.email") || !config.has("auth.token")) {
    console.log('Please login first using "guru-cli login"');
    process.exit();
  }
}

export async function backupCards(directoryPath: string): Promise<void> {
  const filePath = path.join(
    path.resolve(directoryPath),
    `/guru-cards-backup_${new Date().toJSON()}.json`
  );
  const cards: any = await guru.getAllCardsRaw();
  await fs.writeFile(filePath, JSON.stringify(cards, null, 4), "utf8");
  console.log(`Successfully wrote backup to ${filePath}`);
}

export function handleCardsFilter(
  filter: string,
  cardsRaw: GuruCardRaw[],
  cliOptions: any,
  options?: { raw: boolean }
): GuruCard[] | GuruCardRaw[] {
  const keywords = ["collection", "boards", "title", "verifier", "content"];
  let cards = cardsRaw.map((card) => guru._convertCardModel(card));
  if (!filter) {
    if (options?.raw) return cardsRaw;
    return cards;
  }
  const parsed = searchQuery.parse(filter, {
    keywords,
    alwaysArray: true,
    tokenize: true,
    offsets: false,
  }) as { [key: string]: any }; // override to allow iteration without type errors

  if (
    Object.keys(parsed).includes("boards") &&
    !Object.keys(parsed).includes("collection")
  ) {
    console.log(
      'Please add "collection:example" to filter when filtering for boards'
    );
    process.exit();
  }

  let reFlags = "";
  if (cliOptions.ignoreCase) reFlags += "i";
  for (const keyword of keywords) {
    if (parsed[keyword]) {
      for (const value of parsed[keyword]) {
        const matcher = new RegExp(value, reFlags);
        cards = cards.filter((card) => matcher.test(card[keyword]));
      }
    }
  }
  if (options?.raw) {
    const rawCardsFiltered = cards.map((card) =>
      cardsRaw.find((cardRaw) => cardRaw.id === card.id)
    ) as any;
    return rawCardsFiltered;
  }
  return cards;
}
