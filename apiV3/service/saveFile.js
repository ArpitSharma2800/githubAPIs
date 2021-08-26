const fs = require("fs");
module.exports = {
  //append to json formatted data
  append2JSON: (data, callBack) => {
    fs.appendFile(
      `./apiV3/SavedFiles/${data.filetoname}.json`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
  //append to txt formatted data
  append2Txt: (data, callBack) => {
    fs.appendFile(
      `./apiV3/SavedFiles/${data.filetoname}.txt`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
  //append to dictionary in json formatted data
  saveDictJSON: (data, callBack) => {
    fs.appendFile(
      `./apiV3/dictionary/${data.filetoname}.json`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
  //append to dictionary in txt formatted data
  saveDictTxt: (data, callBack) => {
    fs.appendFile(
      `./apiV3/dictionary/${data.filetoname}.txt`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
};
