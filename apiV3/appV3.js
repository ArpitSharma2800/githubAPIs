const fs = require("fs");
const configV3 = require("./config.json");
const moment = require("moment");
var axios = require("axios");
const {
  append2JSON,
  saveDictJSON,
  saveDictTxt,
  decriptJSON,
  decriptTxt,
} = require("./service/saveFile");
require("dotenv").config();
const JSONToCSV = require("json2csv").parse;
const { extractionApi, extractionApiSingle } = require("./service/service");
const { queryRepoCount } = require("./graphQLQuery");
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
    // console.log(config);
    var repoCount = 0;
    let startDate = moment(configV3.extraction.startDate, "DD-MM-YYYY");
    let endDate = moment(configV3.extraction.endDate, "DD-MM-YYYY");
    // query like `android created:2020-01-01..2020-12-31 stars:>=3` can be converted in below format
    // this can be edited according to need of the data required
    const data = {
      query: configV3.extraction.query,
      startDate: startDate,
      endDate: endDate.format("YYYY-MM-DD"),
      cursor: null,
      first: 10, //number of data in single API Call, can be increased just be careful about Github limit.
    };
    var dataApi = JSON.stringify({
      query: queryRepoCount(
        data.query +
          ` ${configV3.extraction.type}:` +
          startDate.format("YYYY-MM-DD") +
          ".." +
          endDate.format("YYYY-MM-DD")
      ),
      variables: {},
    });
    var config = {
      method: "post",
      url: "https://api.github.com/graphql",
      headers: {
        // Authorization: `Bearer ${configV3.extraction.githubTokens[0]}`,
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: dataApi,
    };
    await axios(config)
      .then(async function (response) {
        console.log(response.data.data.search.repositoryCount);
        repoCount = response.data.data.search.repositoryCount;
      })
      .catch(function (err) {
        console.log(err);
      });

    if (repoCount > 1000) {
      extractionApi(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
    } else {
      console.log("data less than 1000");
      extractionApiSingle(data, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      });
    }
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
  //extracting tags through description from extracted Github data
  description: async () => {
    // Replace these file names with extracted data files
    const files = ["./SavedFiles/sampleExtract.json"];
    var i = 0;
    while (i < files.length) {
      try {
        const data = require(files[i]);
        // for extracting tags using decription it need a dictionary, the dictionary can be extracted using topics and languages extraction functions
        const dict = JSON.parse(
          fs.readFileSync(`./dictionary/sampleMainDictTxt.txt`, "utf8") //sample dictionary (this dictionary can be used for android and iOS)
        );
        // JSON.stringify(dict, null, 4);
        // console.log(dict[0]);
        data.forEach(async (element) => {
          let languageCount = [];
          let topicCount = [];
          let mainCount = {};
          let newadded = [];
          // console.log(element.node.description);
          repoDesc = element.node.description;
          element.node.languages.edges.forEach(async (elemen, key) => {
            languageCount.push(elemen.node.name);
            mainCount[elemen.node.name] = true;
          });
          element.node.repositoryTopics.edges.forEach((elemen, key) => {
            topicCount.push(elemen.node.topic.name);
            mainCount[elemen.node.topic.name] = true;
          });
          if (repoDesc !== null) {
            receivedData = getTagsInDescription(dict, repoDesc, 10);
            receivedData.forEach((ele2, key) => {
              if (!(ele2 in mainCount)) newadded.push(ele2);
            });
            const responses = {
              nameWithOwner: element.node.nameWithOwner,
              description: element.node.description,
              tag: receivedData,
              newAdded: newadded,
              languages: languageCount,
              topics: topicCount,
            };
            // append2jsonCSV(responses, "majorTest");
            const data = {
              filetoname: "sampleDecription",
              response: responses,
            };
            await decriptJSON(data, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(results);
            });
            await decriptTxt(data, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(results);
            });
            console.log(repoDesc, "\n\t " + receivedData);
          }
        });
        console.log(repoDesc, "\n\t " + receivedData);
      } catch (err) {
        console.error(err);
      }
      i = i + 1;
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

var getTagsInDescription = function (dict, description, tagThreshold) {
  let res = [];
  for (var j = 0; j < dict.length; j++) {
    var _topic = dict[j].tag.toLowerCase();
    if (dict[j].occurence < tagThreshold) continue;
    var splittedTag = _topic.split("-");
    var splittedDescription = description.toLowerCase().split(" ");
    if (
      arrayWithinArray(splittedTag, splittedDescription) ||
      arrayIncludes(splittedDescription, _topic)
    )
      res.push(_topic);
  }
  return res;
};

var arrayIncludes = function (arr2, topic) {
  var res = false;
  if (arr2.length == 0) return false;
  for (var j = 0; j < arr2.length; j++) {
    if (arr2[j] == topic) {
      return true;
    }
  }
  return false;
};

var arrayWithinArray = function (arr1, arr2) {
  var res = false;
  if (arr1.length == 0) return false;
  for (var j = 0; j < arr2.length; j++) {
    if (arr2[j] == arr1[0]) {
      var matched = 1;
      for (var i = 1; i < arr1.length && j + i < arr2.length; i++)
        if (arr1[i] == arr2[j + i]) matched++;
      if (matched == arr1.length) return true;
    }
  }
  return false;
};
