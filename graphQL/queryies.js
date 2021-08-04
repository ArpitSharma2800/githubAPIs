function querys(queryGit, first) {
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

function querycursor(queryGit, first, cursor) {
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

function queryPushed(queryGit, first) {
  return `{
    rateLimit {
      limit
      cost
      remaining
      used
      resetAt
      nodeCount
    }
    search(first: ${first}, query: "${queryGit}", type: REPOSITORY) {
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
              totalCount
              edges {
                node {
                  id
                }
              }
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
            languages(first: 100) {
              edges {
                node {
                  name
                }
                size
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
            repositoryTopics(first: 100) {
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
            submodules {
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
            assignableUsers {
              totalCount
            }
            pullRequests {
              totalCount
            }
            releases {
              totalCount
            }
            packages {
              totalCount
            }
            updatedAt
          }
        }
        textMatches {
          fragment
          property
        }
      }
    }
  }`;
}

function queryPushedAfter(queryGit, first, cursor) {
  return `{
    rateLimit {
      limit
      cost
      remaining
      used
      resetAt
      nodeCount
    }
    search(first: ${first}, query: "${queryGit}", type: REPOSITORY, after: "${cursor}") {
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
              totalCount
              edges {
                node {
                  id
                }
              }
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
            languages(first: 100) {
              edges {
                node {
                  name
                }
                size
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
            repositoryTopics(first: 100) {
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
            submodules {
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
            assignableUsers {
              totalCount
            }
            pullRequests {
              totalCount
            }
            releases {
              totalCount
            }
            packages {
              totalCount
            }
            updatedAt
          }
        }
        textMatches {
          fragment
          property
        }
      }
    }
  }`;
}

module.exports = {
  querys,
  querycursor,
  queryPushed,
  queryPushedAfter,
};
