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
            console.log("results completed");
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