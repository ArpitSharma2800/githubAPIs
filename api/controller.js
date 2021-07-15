const {
    repoSearch,
    graphQl
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
            query
        } = req.params;
        // const data = {
        //     query
        // }
        var cursor = null;
        var hasNextpage = true;
        let responses = [];
        let promises = [];
        var n = 0;
        while (n < 3) {
            console.log(cursor);
            var data = JSON.stringify({
                query: querys(query),
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
            promises.push(
                await axios(config)
                .then(function (response) {
                    // append(JSON.stringify(response.data.data.search.edges));
                    cursor = response.data.data.search.pageInfo.endCursor
                    responses.push(JSON.stringify(response.data.data.search.edges))
                    // return callback(null, response.data);
                })
                .catch(function (err) {
                    console.log(err);
                    //             return res.status(500).json({
                    //                 success: 0,
                    //                 err,
                    //             });
                    // return callback(error);
                }))
            // console.log(n);
            // promises.push(
            //     graphQl(data, (err, results) => {
            //         if (err) {
            //             console.log(err);
            //             return res.status(500).json({
            //                 success: 0,
            //                 err,
            //             });
            //         }
            //         cursor = results.data.search.pageInfo.endCursor
            //         // console.log(JSON.stringify(results.data.search.edges));
            //         response.push(JSON.stringify(results.data.search.edges))
            //         // promises2.push(append(JSON.stringify(results.data.search.edges), n))
            //         // append(JSON.stringify(results.data.search.edges), results.data.search.pageInfo.endCursor);
            //     })
            // )
            // hasNextpage = false;
            n = n + 1;
        }
        await Promise.all(promises).then(() => append(responses, n));
        console.log('Done!');
        return res.status(200).json({
            success: true,
            message: "all queries completed"
        });
    },
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

function append(response, cursor) {
    const fs = require("fs");
    // FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
    //     return callback(error);
    // });
    fs.appendFile(`./storedFile/${cursor}.json`, response, function (err) {
        if (err) throw err;
        console.log("save")
    });
}


function querys(queryGit) {
    return `{
    rateLimit {
        limit
        cost
        remaining
        used
        resetAt
        nodeCount
    }
    search(first: 10, query:"${queryGit}", type: REPOSITORY) {
        pageInfo {
        endCursor
        hasNextPage
        }
        repositoryCount
        userCount
        wikiCount
        edges {
        cursor
        node {
            ... on Repository {
            name
            nameWithOwner
            id
            createdAt
            databaseId
            description
            diskUsage
            environments(first: 5) {
                edges {
                node {
                    name
                }
                }
                totalCount
            }
            forkCount
            hasIssuesEnabled
            hasProjectsEnabled
            hasWikiEnabled
            isArchived
            isBlankIssuesEnabled
            isDisabled
            isEmpty
            isFork
            isInOrganization
            isLocked
            isMirror
            isPrivate
            isSecurityPolicyEnabled
            isTemplate
            isUserConfigurationRepository
            issues {
                totalCount
            }
            labels {
                totalCount
            }
            languages(first: 20) {
                edges {
                node {
                    name
                }
                }
                totalCount
            }
            lockReason
            mergeCommitAllowed
            mirrorUrl
            primaryLanguage {
                name
            }
            projects {
                totalCount
            }
            rebaseMergeAllowed
            repositoryTopics(first: 20) {
                edges {
                node {
                    topic {
                    name
                    relatedTopics(first: 10) {
                        name
                    }
                    stargazerCount
                    }
                }
                }
                totalCount
            }
            stargazerCount
            submodules(first: 10) {
                edges {
                node {
                    name
                }
                }
                totalCount
            }
            tempCloneToken
            url
            usesCustomOpenGraphImage
            viewerCanAdminister
            viewerCanCreateProjects
            viewerCanSubscribe
            viewerCanUpdateTopics
            viewerDefaultCommitEmail
            viewerDefaultMergeMethod
            viewerHasStarred
            viewerPermission
            viewerPossibleCommitEmails
            viewerSubscription
            watchers {
                totalCount
            }
            }
        }
        textMatches {
            fragment
            property
        }
        }
    }
    }`
}