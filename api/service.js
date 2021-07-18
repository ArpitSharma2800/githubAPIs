var axios = require('axios');
const {
    querycursor,
    querys
} = require('../graphQL/queryies');
const {
    completedQuery
} = require('./dbService/dbservice');
module.exports = {
    repoSearch: (data, callback) => {
        // urlString = `?q=${data.keyword}&type=Repositories&ref=advsearch&l=`;
        urlString = data.urlString;
        var config = {
            method: 'get',
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
        var filename = data.filename
        var data = JSON.stringify({
            query: query(queryGit),
            variables: {}
        });
        var config = {
            method: 'post',
            url: 'https://api.github.com/graphql',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Cookie': '_octo=GH1.1.1436014495.1626119614; logged_in=no'
            },
            data: data
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
        queryGit = data.query;
        var cursor = data.cursor;
        let limit = null;
        let nodeCount = null;
        var hasNextpage = true;
        let responses = [];
        // let languages = [];
        // let topics = [];
        let promises = [];
        while (promises.length < 10) {
            console.log(cursor);
            var data = JSON.stringify({
                query: cursor == null ? querys(queryGit) : querycursor(queryGit, cursor),
                variables: {}
            });
            var config = {
                method: 'post',
                url: 'https://api.github.com/graphql',
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                data: data
            };
            promises.push(
                await axios(config)
                .then(function (response) {

                    // console.log(response.data);
                    const dbData = {
                        query: queryGit,
                        cursor: cursor || "first query",
                        hasLastPage: hasNextpage,
                        limitremaining: limit || -1,
                        nodeCount: nodeCount || -1,
                    }
                    // console.log(dbData);
                    completedQuery(dbData, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("push completed");
                    })
                    cursor = response.data.data.search.pageInfo.endCursor;
                    hasNextpage = response.data.data.search.pageInfo.hasNextPage;
                    limit = response.data.data.rateLimit.remaining;
                    nodeCount = response.data.data.rateLimit.nodeCount;
                    responses.push(JSON.stringify(response.data.data.search.edges))
                })
                .catch(function (err) {
                    console.log(err);
                    return callback(err);
                }))
        }

        await Promise.all(promises).then((values) => append(responses));
        console.log('Done!', cursor);
        return callback(null, {
            cursor,
            hasNextpage
        });
    }
}

function append(response) {
    const fs = require("fs");
    // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
    //     return callback(error);
    // });
    fs.appendFile(`./storedFile/main.json`, response, function (err) {
        if (err) throw err;
        console.log("save")
    });
}

// function appendLang(response, cursor) {
//     const fs = require("fs");
//     // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
//     //     return callback(error);
//     // });
//     fs.appendFile(`./storedFile/lang.json`, response, function (err) {
//         if (err) throw err;
//         console.log("save")
//     });
// }

// function appendTopics(response, cursor) {
//     const fs = require("fs");
//     // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
//     //     return callback(error);
//     // });
//     fs.appendFile(`./storedFile/topics.json`, response, function (err) {
//         if (err) throw err;
//         console.log("save")
//     });
// }