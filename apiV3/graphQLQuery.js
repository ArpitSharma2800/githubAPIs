function queryCreated(queryGit, first) {
  return `{
          rateLimit {
            limit
            cost
            remaining
            used  
            resetAt
            nodeCount
          }
          search(first:${first}, query:"${queryGit}", type: REPOSITORY) {
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
                  assignableUsers {
                    totalCount
                  }
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
                  languages(first: 10) {
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
                  repositoryTopics(first: 10) {
                    edges {
                      node {
                        topic {
                          name
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
        }
        `;
}

function queryCreatedCursor(queryGit, first, cursor) {
  return `{
          rateLimit {
            limit
            cost
            remaining
            used
            resetAt
            nodeCount
          }
          search(first: ${first}, query:"${queryGit}", type: REPOSITORY,after: "${cursor}") {
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
                  assignableUsers {
                    totalCount
                  }
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
                  languages(first: 10) {
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
                  repositoryTopics(first: 10) {
                    edges {
                      node {
                        topic {
                          name
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
        }
        `;
}
function queryRepoCount(queryGit) {
  return `{
          search(query:"${queryGit}", type: REPOSITORY) {
            repositoryCount
          }
        }
        `;
}

module.exports = {
  queryCreated,
  queryCreatedCursor,
  queryRepoCount,
};
