var axios = require('axios');
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

    graphQl: (data, callback) => {
        queryGit = data.query;
        var filename = data.filename
        var axios = require('axios');
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
                const FileSystem = require("fs");
                FileSystem.writeFile(`./storedFile/${filename}.json`, JSON.stringify(response.data.data.search.edges), (error) => {
                    return callback(error);
                });
                return callback(null, response.data);
            })
            .catch(function (error) {
                return callback(error);
            });
    }
}

function query(queryGit) {
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