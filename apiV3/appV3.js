const fs = require("fs");
const moment = require("moment");
const { append2JSON } = require("./service/saveFile");
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
};
