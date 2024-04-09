const https = require("https");

function fetchData() {
  return new Promise((resolve, reject) => {
    const url = "https://time.com";

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const result = [];

          // Find index of start and end of latest-stories section
          const startString =
            '<div class="partial latest-stories" data-module_name="Latest Stories"';
          const startIndex = data.indexOf(startString);
          if (startIndex === -1) {
            reject("Start string not found");
            return;
          }
          const endIndex = data.indexOf("</ul>", startIndex);
          if (endIndex === -1) {
            reject("End string not found");
            return;
          }

          // Extract latest-stories section
          const latestStoriesSection = data.substring(startIndex, endIndex);

          // Match each story within latest-stories section
          const storyRegex = /<li class="latest-stories__item">(.*?)<\/li>/gs;
          let match;
          while ((match = storyRegex.exec(latestStoriesSection)) !== null) {
            const story = match[1];

            // Extract title and link from each story
            const titleMatch = story.match(
              /<h3 class="latest-stories__item-headline">(.*?)<\/h3>/
            );
            const title = titleMatch ? titleMatch[1].trim() : "";
            const linkMatch = story.match(/<a href="(.*?)">/);
            const link = linkMatch ? "https://time.com" + linkMatch[1] : "";

            result.push({ title, link });
          }

          resolve(result);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = fetchData;
