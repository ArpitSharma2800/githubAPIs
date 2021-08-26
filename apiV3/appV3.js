const fs = require("fs");
const moment = require("moment");
require("dotenv").config();

module.exports = {
  jsonArrayCount: () => {
    console.log("running");
    const file = require("./sample/sampleCOunt.json"); //give path to file location.
    const data = file;
    data.forEach((ele, i) => {
      console.log(i);
    });
  },
};
