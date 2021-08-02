const fs = require("fs");

var getTagsInDescription = function (dict, description) {
  let res = [];
  for (var j = 0; j < dict.length; j++) {
    var _topic = dict[j].tag.toLowerCase();
    var splittedTag = _topic.split("-");
    var splittedDescription = description.split(" ");
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

function main() {
  try {
    const data = fs.readFileSync(`./ExtractedData/1620and.txt`, "utf8");
    const dict = JSON.parse(fs.readFileSync(`./dictionary/SODict.txt`, "utf8"));
    //JSON.stringify(dict, null, 4)
    // console.log(dict[0]);
    JSON.parse(data)
      .slice(0, 10)
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
}

// function main() {
//   try {
//     const data = JSON.parse(
//       fs.readFileSync(`./ExtractedData/1620and.txt`, "utf8")
//     );
//     fs.writeFile(
//       `./dictionary/New.json`,
//       JSON.stringify(data, null, 4),
//       (err) => {
//         if (err) throw err;
//         console.log("save");
//       }
//     );
//   } catch (err) {
//     console.error(err);
//   }
// }

// testDict = ["3d", "3d-graphics", "unity", "unity3d"];
// testDescription = "this is a 3d-graphics project made with unity unity3d";
// testTags = getTagsInDescription(testDict, testDescription);
// console.log(testTags);
main();
