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
    
1. Run the script using:
    ```
    $ npm run user-export -- -t <GITHUB_TOKEN> -o <ORGANIZATION_NAME>
    ```
   
   Alternatively you could gloablly install the application using `npm install -g` which would give you a command line tool named `github-users`
   
The script will be slow as it will use the local filesystem to store information about how far through the users for the
organization it so it can pick up where it left off if you get an error due to rate limiting etc...
   
If you need to reset the state pass the `--reset` flag in to the program and it will clear the local caches to ensure
it will process the users from scratch.
   
 
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
