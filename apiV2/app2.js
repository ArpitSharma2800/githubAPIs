const fs = require("fs");
const { graphQlMulti } = require("./service/service");
require("dotenv").config();

module.exports = {
  serverCheck: (req, res) => {
    console.log("running");
  },
  repoGraphQL: async () => {
    // const { query, cursor, first } = req.body;
    const data = {
      query: "android pushed:2016-01-01..2020-12-31 stars:>=3",
      cursor: null,
      first: 10,
    };
    graphQlMulti(data, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
    });
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
    try {
      const data = fs.readFileSync(`./ExtractedData/1620andios.txt`, "utf8");
      JSON.parse(data).forEach((element) => {
        // console.log(element.node.repositoryTopics.totalCount)
        repoTopics = element.node.repositoryTopics.edges;
        repoTopics.forEach((element2) => {
          console.log(element2.node.topic.name);
          const found = dict.find((el) => el.tag === element2.node.topic.name);
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
      append2json(dict, "2016-20Topic");
    } catch (err) {
      console.error(err);
    }
  },
  langDict: async () => {
    // const { filename, filetoname } = req.body;
    let dict = [];
    try {
      const data = fs.readFileSync(`./ExtractedData/1620andios.txt`, "utf8");
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
      append2json(dict, "2016-20Lang");
    } catch (err) {
      console.error(err);
    }
  },

  description: () => {
    try {
      const data = fs.readFileSync(`./ExtractedData/1620and.txt`, "utf8");
      const dict = JSON.parse(
        fs.readFileSync(`./dictionary/SODict.txt`, "utf8")
      );
      //JSON.stringify(dict, null, 4)
      // console.log(dict[0]);
      JSON.parse(data)
        //.slice(0, 10)
        .forEach((element) => {
          // console.log(element.node.description);
          repoDesc = element.node.description;
          if (repoDesc !== null) {
            receivedData = getTagsInDescription(dict, repoDesc);
            console.log(repoDesc, "\n\t " + receivedData);
          }
        });
    } catch (err) {
      console.error(err);
    }
  },
  mergeFile: async () => {
    mainDict = [];
    const dict = JSON.parse(fs.readFileSync(`./dictionary/SODict.txt`, "utf8"));
    const dict2 = JSON.parse(
      fs.readFileSync(`./dictionary/1620andiosLang.txt`, "utf8")
    );
    const dict3 = JSON.parse(
      fs.readFileSync(`./dictionary/1620andiosTopics.txt`, "utf8")
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
    `./dictionary/${filetoname}.txt`,
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
    `./dictionary/${filetoname}.json`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
