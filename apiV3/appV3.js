const fs = require("fs");
const moment = require("moment");
const {
  append2JSON,
  saveDictJSON,
  saveDictTxt,
} = require("./service/saveFile");
require("dotenv").config();
const JSONToCSV = require("json2csv").parse;
module.exports = {
  jsonArrayCount: () => {
    console.log("running");
    const file = require("./sample/sampleCOunt.json"); //give path to file location.
    const data = file;
    data.forEach((ele, i) => {
      console.log(i);
    });
    // const data = {
    //   filetoname: "checking",
    //   response: file,
    // };
    // append2JSON(data, (err, results) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log(results);
    // });
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
    const files = ["./sample/sampleDict1.json", "./sample/sampleDict2.json"];
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
