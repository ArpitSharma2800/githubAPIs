const fs = require("fs");
module.exports = {
  //append to json formatted data
  append2JSON: (data, callBack) => {
    var dir = `./apiV3/${data.foldertoname}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.appendFile(
      `./apiV3/${data.foldertoname}/${data.filetoname}.json`, //path can be changes where files need to be saved
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
    var dir = `./apiV3/${data.foldertoname}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.appendFile(
      `./apiV3/${data.foldertoname}/${data.filetoname}.txt`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
  //dexcription json formatted data
  decriptJSON: (data, callBack) => {
    fs.appendFile(
      `./apiV3/description/${data.filetoname}.json`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
  //description txt formatted data
  decriptTxt: (data, callBack) => {
    fs.appendFile(
      `./apiV3/description/${data.filetoname}.txt`, //path can be changes where files need to be saved
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
    var dir = `./apiV3/${data.foldertoname}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.appendFile(
      // `./apiV3/${data.filetoname}/dictionary.json`, //path can be changes where files need to be saved
      `./apiV3/${data.foldertoname}/${data.filetoname}}.json`, //path can be changes where files need to be saved
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
    var dir = `./apiV3/${data.foldertoname}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.appendFile(
      // `./apiV3/${data.filetoname}/dictionary.json`, //path can be changes where files need to be saved
      `./apiV3/${data.foldertoname}/${data.filetoname}}.txt`, //path can be changes where files need to be saved
      JSON.stringify(data.response, null, 4),
      function (err) {
        if (err) return callBack(err);
        // console.log("save");
        return callBack(null, "Save");
      }
    );
  },
};
