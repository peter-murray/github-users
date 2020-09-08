# GitHub Users Organization Report

This is a simple GraphQL query that will collect the users in an organization and dump them with some
activity stats to a CSV file.

This is a fairly simple implementation that does not concern itself with too much in the way of error handling due to 
the adhoc of the purpose of this utility.

## Running
1. Install npm dependencies:
    ```
    $ npm install
    ```
    
1. Update `index.js` to include the GitHub token and Organization Name that you want to generate the output for.

1. Run the index.js file using
    ```
    $ node index.js
    ```
   
## Interpreting Results
The csv file will be generated in the root directory of the project (along side the `index.js` file).

The Columns in the CSV file are:

* `role`: The role that the user has in the organization
* `login`: The handle for the user
* `name`: The users' name 
* `email`: The publically available email address for the user (can be blank if the user has not shared one)
* `create`: The time that the user's account was created
* `updated`: The time at which the user's account/profile was updated
* `reposContributedTo`: The number of repositories that the user has contributed to
* `pullRequestTotal`: The total number of Pull Requests that the user has created
* `issueTotal`: The total number of issues that the user has created
* `commitConnentsTotal`: The number of commit commment that the user has made 
