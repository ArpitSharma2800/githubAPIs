const fs = require("fs");
const moment = require("moment");
const { graphQlMulti, graphQlMulti2 } = require("./service/service");
require("dotenv").config();

module.exports = {
  serverCheck: (req, res) => {
    console.log("running");
    const data = require("../NewData/2020ios.json");
    data.forEach((ele, i) => {
      console.log(i);
    });
  },
  repoGraphQL: async () => {
    // const { query, cursor, first } = req.body;
    let createdDate = moment("01-01-2020", "DD-MM-YYYY");
    let endDate = moment("31-12-2020", "DD-MM-YYYY");
    // ${createdDate.format("YYYY-MM-DD")}
    const data = {
      query: `android created:${createdDate.format("YYYY-MM-DD")} stars:>=3`,
      keyword: "ios",
      stars: ">=3",
      startDate: createdDate,
      endDate: endDate.format("YYYY-MM-DD"),
      cursor: null,
      first: 10,
    };
    // console.log(
    //   moment(createdDate.format("YYYY-MM-DD")).isSameOrBefore(endDate)
    // );
    //   createdDate = moment(createdDate).add(1, "d");
    //   console.log(createdDate.format("YYYY-MM-DD"));
    graphQlMulti2(data, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      createdDate = moment(createdDate).add(1, "d");
      console.log(createdDate.format("YYYY-MM-DD"));
    });
  },
  concatJson: async () => {
    let mainFile = [];
    const data = fs.readFileSync(`./NewData/2016and.txt`, "utf8");
    const data2 = fs.readFileSync(`./NewData/2017and.txt`, "utf8");
    const data3 = fs.readFileSync(`./NewData/2018and.txt`, "utf8");
    const data4 = fs.readFileSync(`./NewData/2019and.txt`, "utf8");
    const data5 = fs.readFileSync(`./NewData/2020and.txt`, "utf8");
    const data6 = fs.readFileSync(`./NewData/2016ios.txt`, "utf8");
    const data7 = fs.readFileSync(`./NewData/2017ios.txt`, "utf8");
    const data8 = fs.readFileSync(`./NewData/2018ios.txt`, "utf8");
    const data9 = fs.readFileSync(`./NewData/2019ios.txt`, "utf8");
    const data10 = fs.readFileSync(`./NewData/2020ios.txt`, "utf8");
    mainFile = mainFile.concat(
      data,
      data2,
      data3,
      data4,
      data5,
      data6,
      data8,
      data7,
      data9,
      data9,
      data10
    );
    await append2json(mainFile, "MainFile");
  },
  soDict: async () => {
    let dict = [];
    const fileStream = fs.createReadStream("androiost.txt");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      var array = line.split(",");
      const found = dict.find((el) => el.tag === array[1]);
      if (!found) {
        dict.push({
          tag: array[1],
          occurence: parseInt(array[3]),
        });
      } else {
        dict.find((v) => v.tag === found["tag"]).occurence =
          found["occurence"] + parseInt(array[3]);
        console.log(array[3]);
      }
    }
    await append2json(dict, "StackOverflow");
  },
  topicsDict: async () => {
    let dict = [];
    extract = [
      "./NewData/2016and.txt",
      "./NewData/2017and.txt",
      "./NewData/2018and.txt",
      "./NewData/2019and.txt",
      "./NewData/2020and.txt",
      "./NewData/2016ios.txt",
      "./NewData/2017ios.txt",
      "./NewData/2018ios.txt",
      "./NewData/2019ios.txt",
      "./NewData/2020ios.txt",
    ];
    try {
      extract.forEach((elem, i) => {
        console.log(elem);
        const data = fs.readFileSync(elem, "utf8");
        JSON.parse(data).forEach((element) => {
          // console.log(element.node.repositoryTopics.edges);
          repoTopics = element.node.repositoryTopics.edges;
          repoTopics.forEach((element2) => {
            console.log(element2.node.topic.name);
            const found = dict.find(
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
      append2json(dict, "201620Topic");
    } catch (err) {
      console.error(err);
    }
  },
  langDict: async () => {
    // const { filename, filetoname } = req.body;
    let dict = [];
    extract = [
      "./NewData/2016and.txt",
      "./NewData/2017and.txt",
      "./NewData/2018and.txt",
      "./NewData/2019and.txt",
      "./NewData/2020and.txt",
      "./NewData/2016ios.txt",
      "./NewData/2017ios.txt",
      "./NewData/2018ios.txt",
      "./NewData/2019ios.txt",
      "./NewData/2020ios.txt",
    ];
    try {
      extract.forEach((elem, i) => {
        console.log(elem);
        const data = fs.readFileSync(elem, "utf8");
        JSON.parse(data).forEach((element) => {
          // console.log(element.node.languages.edges)
          repoTopics = element.node.languages.edges;
          repoTopics.forEach((element2) => {
            console.log(element2.node.name);
            const found = dict.find((el) => el.tag === element2.node.name);
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
      // append2json(dict, "201620Lang");
      append2txt(dict, "201620LangText");
    } catch (err) {
      console.error(err);
    }
  },

  description: () => {
    try {
      const data = fs.readFileSync(`./ExtractedData/1620andios.txt`, "utf8");
      const dict = JSON.parse(
        fs.readFileSync(`./dictionary/mainDictionaryText.txt`, "utf8")
      );
      //JSON.stringify(dict, null, 4)
      // console.log(dict[0]);
      JSON.parse(data)
        // .slice(0, 10)
        .forEach((element) => {
          // console.log(element.node.description);
          repoDesc = element.node.description;
          if (repoDesc !== null) {
            receivedData = getTagsInDescription(dict, repoDesc);
            const responses = {
              nameWithOwner: element.node.nameWithOwner,
              description: element.node.description,
              tag: receivedData,
            };
            append2jsonCSV(responses, "extractedData");
            console.log(repoDesc, "\n\t " + receivedData);
          }
        });
    } catch (err) {
      console.error(err);
    }
  },
  JSON2CSV: () => {
    var data = require("../description/extractedData.json");
    // console.log(data);
    const JSONToCSV = require("json2csv").parse;
    var csv = JSONToCSV(data);
    fs.writeFileSync("./description/data.csv", csv);
  },
  mergeFile: async () => {
    mainDict = [];
    const dict = JSON.parse(fs.readFileSync(`./dictionary/SODict.txt`, "utf8"));
    const dict2 = JSON.parse(
      fs.readFileSync(`./newDictionary/201620LangText.txt`, "utf8")
    );
    const dict3 = JSON.parse(
      fs.readFileSync(`./newDictionary/201620TopicText.txt`, "utf8")
    );
    await dict.forEach((element) => {
      console.log(element.tag);
      const found = mainDict.find((el) => el.tag === element.tag.toLowerCase());
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
    console.log("completed dict");
    await dict2.forEach((element) => {
      console.log(element.tag);
      const found = mainDict.find((el) => el.tag === element.tag.toLowerCase());
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
    console.log("completed dict 2");
    await dict3.forEach((element) => {
      console.log(element.tag);
      const found = mainDict.find((el) => el.tag === element.tag.toLowerCase());
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
    console.log("completed dict 3");
    await append2json(mainDict, "mainDictionary");
    await append2txt(mainDict, "mainDictionaryText");
  },
};

var getTagsInDescription = function (dict, description) {
  let res = [];
  for (var j = 0; j < dict.length; j++) {
    var _topic = dict[j].tag.toLowerCase();
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

function append(response, filename) {
  const filePath = "./storedFile/1819ios.txt";
  fs.appendFile(filePath, response, function (err) {
    if (err) throw err;
    console.log("save");
  });
}

function append2txt(response, filetoname) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(
    `./newDictionary/${filetoname}.txt`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
function append2json(response, filetoname) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(
    `./newDictionary/${filetoname}.json`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
function append2jsonCSV(response, filetoname) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(
    `./newDictionary/${filetoname}.json`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
