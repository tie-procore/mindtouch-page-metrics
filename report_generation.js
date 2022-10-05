const popularPagesPrevious = require("./popular_pages_2022_aug30.json");
const popularPagesCurrent = require("./popular_pages_2022_sep30.json");
const { parse } = require("json2csv");
const fs = require("fs");
const pagesObjectPrevious = popularPagesPrevious.page;
const pagesObjectCurrent = popularPagesCurrent.page;
const simplifyReport = (fullArray) => {
  const simplifiedArray = fullArray.map((page) => ({
    title: page.title,
    views: page.metrics["metric.views"],
    url: page["uri.ui"],
    id: page["@id"],
    dateCreated: page["date.created"],
  }));
  return simplifiedArray;
};
const pagesSimplifiedPrevious = simplifyReport(pagesObjectPrevious);
const pagesSimplifiedCurrent = simplifyReport(pagesObjectCurrent);

const filterReport = (simplifiedArray) => {
  const terms = ["tc/", "/tc", "/Sandbox", "/Media_Library", "/new-releases/"];
  const filteredReport = simplifiedArray.filter((page) =>
    terms.every((term) => {
      return !page.url.includes(term);
    })
  );
  return filteredReport;
};
const previousReportFiltered = filterReport(pagesSimplifiedPrevious);
const currentReportFiltered = filterReport(pagesSimplifiedCurrent);

const currentReportFinal = currentReportFiltered.map((page) => {
  const oldPage = previousReportFiltered.find(
    (previousPage) => previousPage.id === page.id
  );
  let lastThirty = page.views;
  if (oldPage) {
    lastThirty = page.views - oldPage.views;
  }
  return { ...page, lastThirty };
});

const tutorialsOnly = currentReportFinal.filter((page) =>
  page.url.includes("/tutorials/")
);
const faqsOnly = currentReportFinal.filter((page) =>
  page.url.includes("/faq/")
);

console.log(`all articles: ${currentReportFinal.length}`);
console.log(`tutorials: ${tutorialsOnly.length}`);
console.log(`faqs: ${faqsOnly.length}`);

const csvData = parse(currentReportFinal);
const tutorialsOnlycsv = parse(tutorialsOnly);
const faqsOnlycsv = parse(faqsOnly);
const reportDate = "2022sep30";
fs.writeFile(`FullData${reportDate}.csv`, csvData, (err) => {
  if (err) {
    throw err;
  }
  console.log("Full data is saved.");
});
fs.writeFile(`tutorialsOnly${reportDate}.csv`, tutorialsOnlycsv, (err) => {
  if (err) {
    throw err;
  }
  console.log("Tutorial Only is saved.");
});
fs.writeFile(`faqsOnly${reportDate}.csv`, faqsOnlycsv, (err) => {
  if (err) {
    throw err;
  }
  console.log("FAQ Only is saved.");
});
