
import siteTags from './site_tags.json' assert {type: 'json'};
import fs from 'fs';
const tagsObject = siteTags.tag;
const tagsSimplified = tagsObject.map( (tag) => ({  
    title: tag.title,
    pages: tag.pages,
    id: tag["@id"],
}));

const tagsNoEmpty = tagsSimplified.filter((tag)=>tag.pages["@count"] > 1);
const tagsSimplifiedFiltered = tagsNoEmpty.filter((tag)=> {
    return tag.pages.page.some((page)=> page["uri.ui"].includes('/tc/'))
});

const tagsOnly = tagsSimplifiedFiltered.map( (tag) => ({  
    title: tag.title,
    id: tag.id
}));

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }

// const tutorialsOnly = tagsSimplifiedFiltered.filter((tag)=>tag.url.includes('/tutorials/'));
// const faqsOnly = tagsSimplifiedFiltered.filter((tag)=>tag.url.includes('/faq/'));

console.log(`all articles: ${tagsSimplifiedFiltered.length}`);
// console.log(`tutorials: ${tutorialsOnly.length}`);
// console.log(`faqs: ${faqsOnly.length}`);

const data = JSON.stringify(tagsOnly);
const csvData = convertToCSV(tagsOnly);

//const tutorialData = JSON.stringify(tutorialsOnly);
//const faqData = JSON.stringify(faqsOnly);

// write JSON string to a file

fs.writeFile('tagsOnly.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});

fs.writeFile('tagsOnly.csv', csvData, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
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