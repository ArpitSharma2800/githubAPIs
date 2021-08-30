const fs = require("fs");
const moment = require("moment");
const {
  append2JSON,
  saveDictJSON,
  saveDictTxt,
} = require("./service/saveFile");
require("dotenv").config();
const JSONToCSV = require("json2csv").parse;
const { extractionApi } = require("./service/service");
module.exports = {
  jsonArrayCount: () => {
    console.log("running");
    const file = require("./sample/sampleCOunt.json"); //give path to file location.
    const data = file;
    data.forEach((ele, i) => {
      console.log(i);
    });
  },
  //extracting repository data
  extraction: async () => {
    let startDate = moment("01-01-2020", "DD-MM-YYYY");
    let endDate = moment("01-01-2020", "DD-MM-YYYY");
    // query like `android created:2020-01-01..2020-12-31 stars:>=3` can be converted in below format
    // this can be edited according to need of the data required
    const data = {
      keyword: "android",
      stars: ">=3",
      startDate: startDate,
      endDate: endDate.format("YYYY-MM-DD"),
      cursor: null,
      first: 10,
    };
    extractionApi(data, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
    });
  },
  //extracting all the topics inside extracted data, this can help creating major dictionary for creating tags for github similar to StackOverflow
  topicsExtract: async () => {
    let dict = [];
    // If extractions are in multiple files, that files can be added to array and it will combine all the results inside single file
    extract = ["./SavedFiles/sampleExtract.json"];
    try {
      extract.forEach((elem, i) => {
        const data = require(elem);
        data.forEach((element) => {
          // console.log(element.node.repositoryTopics.edges);
          repoTopics = element.node.repositoryTopics.edges;
          repoTopics.forEach((element2) => {
            console.log(element2.node.topic.name);
            const found = dict.find(
              //check for existence
              (el) => el.tag === element2.node.topic.name
            );
            if (!found) {
              dict.push({
                tag: element2.node.topic.name,
                occurence: 1,
              });
            } else {
              dict.find((v) => v.tag === found["tag"]).occurence =
                found["occurence"] + 1;
            }
          });
        });
      });
      const data = {
        filetoname: "sampleTopicDict",
        response: dict,
      };
      await saveDictJSON(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
      await saveDictTxt(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
    } catch (err) {
      console.error(err);
    }
  },
  //extracting all the languages inside extracted data, this can help creating major dictionary for creating tags for github similar to StackOverflow
  langExtract: async () => {
    let dict = [];
    // If extractions are in multiple files, that files can be added to array and it will combine all the results inside single file
    extract = ["./SavedFiles/sampleExtract.json"];
    try {
      extract.forEach((elem, i) => {
        const data = require(elem);
        data.forEach((element) => {
          repoTopics = element.node.languages.edges;
          repoTopics.forEach((element2) => {
            console.log(element2.node.name);
            const found = dict.find((el) => el.tag === element2.node.name); //check for existence
            if (!found) {
              dict.push({
                tag: element2.node.name,
                occurence: 1,
              });
            } else {
              dict.find((v) => v.tag === found["tag"]).occurence =
                found["occurence"] + 1;
            }
          });
        });
      });
      const data = {
        filetoname: "sampleLangDict",
        response: dict,
      };
      await saveDictJSON(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
      await saveDictTxt(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
    } catch (err) {
      console.error(err);
    }
  },
  //converting JSON into CSV
  JSON2CSV: () => {
    var data = require("./sample/sampleCOunt.json");
    // console.log(data);
    var csv = JSONToCSV(data);
    fs.writeFileSync("./apiV3/CSVResults/sample.csv", csv);
  },
  // merging multiple json files
  mergeDict: async () => {
    let i = 0;
    let mainDict = [];
    const files = [
      "./dictionary/sampleLangDict.json",
      "./dictionary/sampleTopicDict.json",
    ];
    try {
      while (i < files.length) {
        const dict = require(files[i]);
        await dict.forEach((element) => {
          console.log(element.tag);
          const found = mainDict.find(
            (el) => el.tag === element.tag.toLowerCase()
          );
          if (!found) {
            mainDict.push({
              tag: element.tag.toLowerCase(),
              occurence: element.occurence,
            });
          } else {
            mainDict.find((v) => v.tag === found["tag"]).occurence =
              found["occurence"] + element.occurence;
          }
        });
        i += 1;
      }
    } catch (error) {
      console.log(error);
    }
    const data = {
      filetoname: "sampleCombinedDict",
      response: mainDict,
    };
    await saveDictJSON(data, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
    });
    await saveDictTxt(data, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
    });
  },
};
