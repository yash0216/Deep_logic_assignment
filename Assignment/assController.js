const https = require("https");

// Function to fetch data from "https://time.com" URL and it returns a Promise
// containing the JSON array of title and link
function fetchData() {
  return new Promise((resolve, reject) => {
    const url = "https://time.com";
    const result = [];

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Initialize the string containing HTML to be extracted from response
          const startString =
            '<div class="partial latest-stories" data-module_name="Latest Stories"';
          const endString = "</ul>";

          // Find the start and end indices
          const startIndex = data.indexOf(startString);
          const endIndex = data.indexOf(endString, startIndex);

          const latestStoriesSection = data.substring(startIndex, endIndex);

          // Extract individual stories
          const stories = latestStoriesSection.match(
            /<li class="latest-stories__item">(.*?)<\/li>/gs
          );

          stories.forEach((story) => {
            const titleMatch = story.match(
              /<h3 class="latest-stories__item-headline">(.*?)<\/h3>/
            );
            const title = titleMatch ? titleMatch[1].trim() : "";
            const linkMatch = story.match(/<a href="(.*?)">/);
            const link = linkMatch ? "https://time.com" + linkMatch[1] : "";

            result.push({ title: title, link: link });
          });

          resolve(result);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = fetchData;
