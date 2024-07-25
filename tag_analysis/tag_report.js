const siteTags = require("./site_tags.json");
const fs = require("fs");
const { parse } = require("json2csv");
const tagsObject = siteTags.tag;
const tagsSimplified = tagsObject.map((tag) => ({
  title: tag.title,
  pages: tag.pages,
  id: tag["@id"],
}));

const tagsNoEmpty = tagsSimplified.filter((tag) => tag.pages["@count"] > 1);
const tagsSimplifiedFiltered = tagsNoEmpty.filter((tag) => {
  return tag.pages.page.some((page) => page["uri.ui"].includes("/tc/"));
});

const tagsOnly = tagsSimplifiedFiltered.map((tag) => ({
  title: tag.title,
  id: tag.id,
  pages: tag.pages["@count"],
}));
const csvData = parse(tagsOnly);
const reportDate = "2023Dec19";

// const tutorialsOnly = tagsSimplifiedFiltered.filter((tag)=>tag.url.includes('/tutorials/'));
// const faqsOnly = tagsSimplifiedFiltered.filter((tag)=>tag.url.includes('/faq/'));

console.log(`all articles: ${tagsSimplifiedFiltered.length}`);
// console.log(`tutorials: ${tutorialsOnly.length}`);
// console.log(`faqs: ${faqsOnly.length}`);

//const tutorialData = JSON.stringify(tutorialsOnly);
//const faqData = JSON.stringify(faqsOnly);

// write JSON string to a file

fs.writeFile(
  `./reports/tag_reports/MT-Tags-report-${reportDate}.csv`,
  csvData,
  (err) => {
    if (err) {
      throw err;
    }
    console.log("report saved.");
  }
);
// fs.writeFile('tutorials.json', tutorialData, (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("JSON data is saved.");
// });
// fs.writeFile('faqs.json', faqData, (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("JSON data is saved.");
// });
