var axios = require("axios");
const { response } = require("express");
const fs = require("fs");
const {
  querycursor,
  querys,
  queryPushed,
  queryPushedAfter,
} = require("../graphQL/queryies");
const { completedQuery } = require("./dbService/dbservice");
module.exports = {
  repoSearch: (data, callback) => {
    // urlString = `?q=${data.keyword}&type=Repositories&ref=advsearch&l=`;
    urlString = data.urlString;
    var config = {
      method: "get",
      url: `https://api.github.com/search/repositories${urlString}&type=Repositories&ref=advsearch&l=`,
    };
    axios(config)
      .then(function (response) {
        return callback(null, response.data);
      })
      .catch(function (error) {
        return callback(error);
      });
  },

  graphQl: async (data, callback) => {
    queryGit = data.query;
    var filename = data.filename;
    var data = JSON.stringify({
      query: query(queryGit),
      variables: {},
    });
    var config = {
      method: "post",
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Cookie: "_octo=GH1.1.1436014495.1626119614; logged_in=no",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        // append(JSON.stringify(response.data.data.search.edges));
        return callback(null, response.data);
      })
      .catch(function (error) {
        return callback(error);
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
        if (responses.length == 10) {
          console.log("running");
          try {
            const dbData = {
              query: queryGit,
              cursor: cursor || "first query",
              hasLastPage: hasNextpage,
              limitremaining: limit || -1,
              nodeCount: nodeCount || -1,
            };
            completedQuery(dbData, (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log("db push completed");
            });
            append(responses);
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
          // promises.push(
          await axios(config)
            .then(function (response) {
              cursor = response.data.data.search.pageInfo.endCursor;
              hasNextpage = response.data.data.search.pageInfo.hasNextPage;
              limit = response.data.data.rateLimit.remaining;
              nodeCount = response.data.data.rateLimit.nodeCount;
              responses.push(JSON.stringify(response.data.data.search.edges));
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
    // await Promise.all(promises).then(async (values) => {
    //     append(responses)
    //     // console.log("donee");
    // });
    try {
      const dbData = {
        query: queryGit,
        cursor: cursor || "first query",
        hasLastPage: hasNextpage,
        limitremaining: limit || -1,
        nodeCount: nodeCount || -1,
      };
      completedQuery(dbData, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log("db push completed final");
      });
    } catch (error) {
      console.log(error);
    }
    await append(responses);
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

function append(response) {
  // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
  //     return callback(error);
  // });
  fs.appendFile(`./storedFile/1620and.txt`, response, function (err) {
    if (err) throw err;
    console.log("save");
  });
}
