var axios = require("axios");
const moment = require("moment");
const { response } = require("express");
const fs = require("fs");
// const { completedQuery } = require("../dbService/dbservice");
const { queryCreated, queryCreatedCursor } = require("../graphQLQuery");
const { append2JSON, append2Txt } = require("./saveFile");
require("dotenv").config();

module.exports = {
  extractionApi: async (data, callback) => {
    let first = data.first; //number of repository data should be in single call. Make sure not to exceed nodes limit in GithubExplorer!
    var cursor = data.cursor; // cursor is default null and updates automatically.
    var keyword = data.keyword;
    var stars = data.stars; // minimum number of stars
    var startDate = data.startDate;
    var endDate = data.endDate;
    let limit = null;
    let nodeCount = null;
    var hasNextpage = true;
    let responses = [];
    let n = 0;
    while (
      moment(startDate.format("YYYY-MM-DD")).isSameOrBefore(endDate) === true
    ) {
      console.log(startDate);
      hasNextpage = true;
      cursor = null;
      while (hasNextpage == true) {
        let updateQuery =
          keyword +
          " created:" +
          startDate.format("YYYY-MM-DD") +
          " stars:" +
          stars;
        console.log(updateQuery);
        try {
          console.log(n);
          console.log(cursor);
          console.log(updateQuery);
          var data = JSON.stringify({
            query:
              cursor == null
                ? queryCreated(updateQuery, first)
                : queryCreatedCursor(updateQuery, first, cursor),
            variables: {},
          });
          //extraction github tokens
          var token = [
            process.env.GITHUB_TOKEN,
            process.env.GITHUB_TOKEN2,
            process.env.GITHUB_TOKEN3,
            process.env.GITHUB_TOKEN4,
            process.env.GITHUB_TOKEN5,
          ];
          // var token = [];
          const random = Math.floor(Math.random() * token.length); //picks random token from the array so that no token reach to it't limit
          var config = {
            method: "post",
            url: "https://api.github.com/graphql",
            headers: {
              Authorization: `Bearer ${token[random]}`,
              "Content-Type": "application/json",
            },
            data: data,
          };
          await axios(config)
            .then(async function (response) {
              console.log(response.data.data.search.edges);
              cursor = response.data.data.search.pageInfo.endCursor;
              hasNextpage = response.data.data.search.pageInfo.hasNextPage;
              limit = response.data.data.rateLimit.remaining;
              nodeCount = response.data.data.rateLimit.nodeCount;
              responses.push(JSON.stringify(response.data.data.search.edges));
              const saveData = {
                filetoname: "sampleExtract",
                response: response.data.data.search.edges,
              };
              await append2JSON(saveData, (err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log(results);
              });
              await append2Txt(saveData, (err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log(results);
              });
            })
            .catch(function (err) {
              console.log(err);
              return callback(err);
            });
        } catch (error) {
          console.log(error);
        }
        n = n + 1;
      }
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
    });
  },
};
