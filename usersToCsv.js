const fs = require('fs')
  , path = require('path')
  , github = require('@actions/github')
  , json2csv = require('json2csv')
;

const organizationUsersQuery = `
query ($org: String! $cursor: String) {
  
  organization(login: $org) {
    login
    name
    membersWithRole (first: 10, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        role
        node {
          login
          name
          email
          createdAt
          updatedAt
          
          repositoriesContributedTo {
            totalCount
          }
          
          pullRequests {
            totalCount
          }
          
          issues {
            totalCount
          }
          
          commitComments {
            totalCount
          }
        }
      }
    }
  }
}
`

module.exports.generateReport = async function(token, orgName) {
  if (!token || token.length === 0) {
    throw new Error('A GitHub Token must be provided')
  }

  if (!orgName || orgName.length === 0) {
    throw new Error('An organization number must be provided');
  }

  const users = await getUsers(token, orgName)
    , parser = new json2csv.Parser()
    , csv = parser.parse(users)
  ;

  const file = path.join(__dirname, 'users.csv');
  fs.writeFileSync(file, csv);
  return file;
}

async function getUsers(token, orgName) {
  const octokit = github.getOctokit(token);

  const users = [];
  let hasNextPage = false
    , cursor = null
  ;

  do {
    const queryResult = await octokit.graphql({
      query: organizationUsersQuery,
      org: orgName,
      cursor: cursor,
    });

    users.push(...queryResult.organization.membersWithRole.edges.map(user => {
        const userData = {
          role: user.role,
          org: queryResult.organization.name,
          login: user.node.login,
          name: user.node.name,
          email: user.node.email,
          created: user.node.createdAt,
          updated: user.node.updatedAt,
          reposContributedTo: user.node.repositoriesContributedTo.totalCount,
          pullRequestsTotal: user.node.pullRequests.totalCount,
          issuesTotal: user.node.issues.totalCount,
          commitCommentsTotal: user.node.commitComments.totalCount,
        }

        return userData;
      })
    );

    hasNextPage = queryResult.organization.membersWithRole.pageInfo.hasNextPage
    cursor = queryResult.organization.membersWithRole.pageInfo.endCursor
  } while (hasNextPage)

  return users;
}