const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const readline = require("readline");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Show menu repeatedly until user chooses to exit
function showMenu() {
  rl.question(
    "\nChoose an option:\n1: String Manipulation\n2: File Compression\n3: Tell me a Joke\n4: Exit\n> ",
    async (choice) => {
      if (choice === "1") {
        rl.question("Enter a word: ", (input) => {
          console.log("You entered:", input);

          const wordCount = input.trim().split(/\s+/).length;
          console.log("Word count:", wordCount);

          console.log("Uppercase:", input.toUpperCase());

          const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, "");
          const reversed = cleaned.split("").reverse().join("");
          const isPalindrome = cleaned === reversed;
          console.log("Palindrome:", isPalindrome ? "Yes" : "No");

          showMenu();
        });
      } else if (choice === "2") {
        const filePath = path.join(__dirname, "files", "zeel.txt");

        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) {
            console.error("File read error:", err);
            showMenu();
            return;
          }

          const input = Buffer.from(data);

          zlib.deflate(input, (err, compressed) => {
            if (err) {
              console.error("Compression error:", err);
              showMenu();
              return;
            }

            console.log("File Compressed.",input);

            zlib.inflate(compressed, (err, output) => {
              if (err) {
                console.error("Decompression error:", err);
                showMenu();
                return;
              }

              const result = output.toString();
              console.log("Decompressed Text:\n", result);

              const wordCount = result.trim().split(/\s+/).length;
              console.log("Word count in file:", wordCount);

              showMenu();
            });
          });
        });
      } else if (choice === "3") {
        try {
          const response = await fetch(
            "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist,explicit&type=twopart"
          );
          const joke = await response.json();

          if (joke.setup && joke.delivery) {
            console.log("\nJoke:");
            console.log(joke.setup);
            console.log(joke.delivery);
          } else {
            console.log("No joke found.");
          }
        } catch (error) {
          console.error("Fetch error:", error.message);
        }
        showMenu();
      } else if (choice === "4") {
        console.log("Goodbye!");
        rl.close();
      } else {
        console.log("Invalid choice.");
        showMenu();
      }
    }
  );
}

// Start the menu
showMenu();
