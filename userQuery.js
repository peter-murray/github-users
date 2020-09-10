const github = require('@actions/github');


const organizationUsersQuery = `
query ($org: String! $cursor: String $total: Int=10 ) {
  
  organization(login: $org) {
    login
    name
    membersWithRole (first: $total, after: $cursor) {
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
`;

module.exports = class UserQuery {

  constructor(token, organization) {
    if (!token || token.length === 0) {
      throw new Error('A GitHub Token must be provided')
    }
    this._octokit = github.getOctokit(token);

    if (!organization) {
      throw new Error('A GitHub organization must be provided')
    }
    this._organization = organization;
  }

  get octokit() {
    return this._octokit;
  }

  get organization() {
    return this._organization;
  }

  getUsers(cursor, total) {
    const self = this;

    return this.octokit.graphql({
      query: organizationUsersQuery,
      org: self.organization,
      cursor: cursor,
      total: total || 5,
    }).then(queryResult => {
      const users = []
        , hasNextPage = queryResult.organization.membersWithRole.pageInfo.hasNextPage
        , cursor = queryResult.organization.membersWithRole.pageInfo.endCursor
      ;

      //TODO ignoring errors int he returned object

      queryResult.organization.membersWithRole.edges.forEach(user => {
        users.push({
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
        });
      });

      return {
        users: users,
        cursor: cursor,
        hasNextPage: hasNextPage
      };
    });
  }
}