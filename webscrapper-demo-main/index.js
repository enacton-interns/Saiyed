const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { Parser } = require("json2csv");

const BASE_URL = "http://books.toscrape.com/catalogue/";

const scrapePage = async (pageNum) => {
  const url = `${BASE_URL}page-${pageNum}.html`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const books = [];

    $(".product_pod").each((i, el) => {
      const title = $(el).find("h3 a").attr("title") || "N/A";
      const price = $(el).find(".price_color").text() || "N/A";
      const rating =
        $(el).find(".star-rating").attr("class")?.split(" ")[1] || "N/A";
      const link = BASE_URL + $(el).find("h3 a").attr("href");

      books.push({ title, price, rating, link });
    });

    return books;
  } catch (err) {
    console.error(`Error on page ${pageNum}:`, err.message);
    return [];
  }
};

const runScraper = async () => {
  const allBooks = [];

  for (let page = 1; page <= 30; page++) {
    // up to 30 pages
    console.log(`Scraping page ${page}...`);
    const books = await scrapePage(page);

    if (books.length === 0) {
      console.warn(`No books on page ${page}. Stopping.`);
      break;
    }

    allBooks.push(...books);
  }
  // Save to JSON
  fs.writeFileSync("books.json", JSON.stringify(allBooks, null, 2));
  console.log("Saved all books to books.json");

  // Save to CSV
  const parser = new Parser({ fields: ["title", "price", "rating", "link"] });
  const csv = parser.parse(allBooks);
  fs.writeFileSync("books.csv", csv);
  console.log("Saved all books to books.csv");
};


runScraper();
