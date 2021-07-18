const {
    repoSearch,
    graphQl,
    graphQlMulti
} = require("./service");
var axios = require('axios');
module.exports = {
    serverCheck: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Server running .."
        });
    },
    //all repository
    repository: async (req, res) => {
        const {
            keyword,
            created,
            stars,
            language,
            forks,
            license
        } = req.query;
        const request = req.query
        // console.log(req.query)
        if (keyword == null) {
            return res.status(500).json({
                success: 0,
                message: "Error Message",
            });
        }
        var urlString = `?q=${keyword}`
        await Object.keys(request).forEach((key, i) => {
            if (i == 0) {
                console.log(key);
            } else {
                urlString = urlString.concat(`+${key}:${request[key]}`)
            }
        });
        console.log(urlString);
        data = {
            urlString
        };
        repoSearch(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error Message",
                });
            }
            return res.status(200).json({
                success: true,
                results
            });
        });
    },
    //repos graphql
    repoGraphQL: async (req, res) => {
        const {
            query,
            cursor
        } = req.body;
        const data = {
            query,
            cursor
        }
        graphQlMulti(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    err,
                });
            }
            console.log(results);
        })
        return res.status(200).json({
            success: true,
            message: "extraction started, please follow DB for further info"
            // cursor: results.cursor,
            // hasNext: results.hasNextpage
        });
    },
    //repo graphql single
    repoGraphQLSingle: async (req, res) => {
        const {
            query
        } = req.params;
        const data = {
            query,
            filename: "query1"
        }
        graphQl(data, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    err,
                });
            }
            return res.status(200).json({
                success: true,
                results
            });
        })
    }

}