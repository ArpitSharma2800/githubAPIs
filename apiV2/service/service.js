var axios = require("axios");
const { response } = require("express");
const fs = require("fs");
const { queryPushed, queryPushedAfter } = require("../../graphQL/queryies");
require("dotenv").config();
module.exports = {
  graphQlMulti: async (data, callback) => {
    let queryGit = data.query;
    let first = data.first;
    var cursor = data.cursor;
    let limit = null;
    let nodeCount = null;
    var hasNextpage = true;
    let responses = [];
    // let promises = [];
    let n = 0;
    while (hasNextpage == true) {
      try {
        console.log(n);
        if (responses.length == 3) {
          console.log("running");
          try {
            append2json(responses, "sample");
            promises = [];
            responses = [];
            n = 0;
            console.log("all cleared");
          } catch (error) {
            console.log(error);
          }
        } else {
          // console.log("running search");
          console.log(cursor);
          var data = JSON.stringify({
            query:
              cursor == null
                ? queryPushed(queryGit, first)
                : queryPushedAfter(queryGit, first, cursor),
            variables: {},
          });
          var config = {
            method: "post",
            url: "https://api.github.com/graphql",
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
            data: data,
          };
          await axios(config)
            .then(function (response) {
              cursor = response.data.data.search.pageInfo.endCursor;
              hasNextpage = response.data.data.search.pageInfo.hasNextPage;
              limit = response.data.data.rateLimit.remaining;
              nodeCount = response.data.data.rateLimit.nodeCount;
              responses.push(response.data.data.search.edges);
            })
            .catch(function (err) {
              console.log(err);
              return callback(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
      n = n + 1;
    }
    await append2json(responses, "sample");
    promises = [];
    responses = [];
    console.log("Done!", cursor);
    return callback(null, {
      cursor,
      hasNextpage,
      hasNextpage,
      limit,
      queryGit,
    });
  },
};

function append(response, filename) {
  const filePath = "./storedFile/1819ios.txt";
  fs.appendFile(filePath, response, function (err) {
    if (err) throw err;
    console.log("save");
  });
}

function append2json(response, filetoname) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(
    `./ExtractedData/${filetoname}.json`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
