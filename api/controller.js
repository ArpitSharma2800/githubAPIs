const {
    repoSearch,
    graphQl,
    graphQlMulti
} = require("./service");
var axios = require('axios');
const fs = require('fs');
const readline = require('readline');

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
            cursor,
            first
        } = req.body;
        const data = {
            query,
            cursor,
            first
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
    },
    soDict: async (req, res) => {
        let dict = []
        const fileStream = fs.createReadStream('androiost.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            var array = line.split(',');
            const found = dict.find(el => el.tag === array[1]);
            if (!found) {
                dict.push({
                    tag: array[1],
                    occurance: parseInt(array[3])
                })
            } else {
                dict.find(v => v.tag === found["tag"]).occurance = found["occurance"] + parseInt(array[3]);
                console.log(array[3]);
            }
        }
        await append(dict);
        return res.status(200).json({
            success: true,
            dict
        });
    },
    topicsDict: async (req, res) => {
        const {
            filename
        } = req.body
        let dict = []
        const fs = require('fs')
        try {
            const data = fs.readFileSync(`./ExtractedData/${filename}.txt`, 'utf8')
            JSON.parse(data).forEach(element => {
                // console.log(element.node.repositoryTopics.totalCount)
                repoTopics = element.node.repositoryTopics.edges;
                repoTopics.forEach(element2 => {
                    console.log(element2.node.topic.name)
                    const found = dict.find(el => el.tag === element2.node.topic.name);
                    if (!found) {
                        dict.push({
                            tag: element2.node.topic.name,
                            occurance: 1
                        })
                    } else {
                        dict.find(v => v.tag === found["tag"]).occurance = found["occurance"] + 1;
                    }
                })
            });
            append(dict, "1620andTopics")
            return res.status(200).json({
                success: true,
                dict
            });
        } catch (err) {
            console.error(err)
        }
    },
    langDict: async (req, res) => {
        const {
            filename,
            filetoname
        } = req.body
        let dict = []
        const fs = require('fs')
        try {
            const data = fs.readFileSync(`./ExtractedData/${filename}.txt`, 'utf8')
            JSON.parse(data).forEach(element => {
                // console.log(element.node.languages.edges)
                repoTopics = element.node.languages.edges;
                repoTopics.forEach(element2 => {
                    console.log(element2.node.name)
                    const found = dict.find(el => el.tag === element2.node.name);
                    if (!found) {
                        dict.push({
                            tag: element2.node.name,
                            occurance: 1
                        })
                    } else {
                        dict.find(v => v.tag === found["tag"]).occurance = found["occurance"] + 1;
                    }
                })
            });
            append(dict, filetoname)
            return res.status(200).json({
                success: true,
                dict
            });
        } catch (err) {
            console.error(err)
        }
    }

}


function append(response, filename) {
    fs.writeFile(`./dictionary/${filename}.txt`, JSON.stringify(response), (err) => {
        if (err) throw err;
        console.log("save")
    });
    // fs.appendFile(`./storedFile/1819ios.txt`, response, function (err) {
    //     if (err) throw err;
    //     console.log("save")
    // });
}