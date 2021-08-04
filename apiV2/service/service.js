var axios = require("axios");
const moment = require("moment");
const { response } = require("express");
const fs = require("fs");
const { queryPushed, queryPushedAfter } = require("../../graphQL/queryies");
const { completedQuery } = require("../dbService/dbservice");
require("dotenv").config();
module.exports = {
  graphQlMulti2: async (data, callback) => {
    //   createdDate = moment(createdDate).add(1, "d");
    let queryGit = data.query;
    let first = data.first;
    var cursor = data.cursor;
    var keyword = data.keyword;
    var stars = data.stars;
    var startDate = data.startDate;
    var endDate = data.endDate;
    let limit = null;
    let nodeCount = null;
    var hasNextpage = true;
    let responses = [];
    // let promises = [];
    let n = 0;
    while (
      moment(startDate.format("YYYY-MM-DD")).isSameOrBefore(endDate) === true
    ) {
      console.log(startDate);
      // updateQuery = `android created:${startDate.format(
      //   "YYYY-MM-DD"
      // )} stars:>=3`;

      hasNextpage = true;
      cursor = null;
      updateQuery =
        keyword +
        " created:" +
        startDate.format("YYYY-MM-DD") +
        " stars:" +
        stars;
      console.log(startDate);
      while (hasNextpage == true) {
        try {
          console.log(n);
          console.log(cursor);
          console.log(queryGit);
          var data = JSON.stringify({
            query:
              cursor == null
                ? queryPushed(updateQuery, first)
                : queryPushedAfter(updateQuery, first, cursor),
            // ? queryPushed(queryGit, first)
            // : queryPushedAfter(queryGit, first, cursor),
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
              console.log(response.data.data.search);
              cursor = response.data.data.search.pageInfo.endCursor;
              hasNextpage = response.data.data.search.pageInfo.hasNextPage;
              limit = response.data.data.rateLimit.remaining;
              nodeCount = response.data.data.rateLimit.nodeCount;
              // responses.push(JSON.stringify(response.data.data.search.edges));
              // try {
              //   const dbData = {
              //     query: queryGit,
              //     cursor: cursor || "first query",
              //     hasLastPage: hasNextpage,
              //     limitremaining: limit || -1,
              //     nodeCount: nodeCount || -1,
              //   };
              //   completedQuery(dbData, (err, results) => {
              //     if (err) {
              //       console.log(err);
              //     }
              //     console.log("db push completed final");
              //   });
              // } catch (error) {
              //   console.log(error);
              // }
              // append2json(response.data.data.search.edges, "2016and");
              // append2txt(response.data.data.search.edges, "2016and");
            })
            .catch(function (err) {
              console.log(err);
              return callback(err);
            });
          // }
        } catch (error) {
          console.log(error);
        }
        n = n + 1;
      }
      // console.log("changing date");
      startDate = moment(startDate).add(1, "d");
    }
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
    `./NewData/${filetoname}.json`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
function append2txt(response, filetoname) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(
    `./NewData/${filetoname}.txt`,
    JSON.stringify(response, null, 4),
    function (err) {
      if (err) throw err;
      console.log("save");
    }
  );
}
