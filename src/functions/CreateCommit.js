const { app } = require('@azure/functions');
const { Octokit } = require('@octokit/graphql');

app.http('CreateCommit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`)

        const octokit = new Octokit({
            auth: `${process.env["GITHUB_TOKEN"]}`,
            baseUrl: `${process.env["GITHUB_URL"]}`
        })
        
        try {
          const owner = 'luiarhs';
          const repo = 'github-actions-test';
          const branch = 'main';
          const message64 = 'IyBHaXRIdWIgR3JhcGhRTCBBUEkNCg0KIyMgVGVzdCBjb21taXQgdXNpbmcgZ3JhcGhxbCBpbiBhIEF6IEZu';
  
          const response = await octokit(`query  Repository {
              repository(owner: "${owner}", name: "${repo}") {
                  ref(qualifiedName: "${branch}") {
                      target {
                          ... on Commit {
                              oid
                          }
                      }
                  }
              }
          }`);
  
          const headId = response.repository.ref.target.oid;
  
          // Construct a schema, using GraphQL schema language
          const data = await octokit(`mutation CreateCommitOnBranch {
              createCommitOnBranch(
                  input: {
                      branch: {
                          branchName: "${branch}",
                          repositoryNameWithOwner: "${owner}/${repo}"
                      }
                      fileChanges: {
                          additions: [{
                              path: "README.md",
                              contents: "${message64}"
                          }]
                      }
                      message: { headline: "[add] commit by azure fapp" }
                      expectedHeadOid: "${headId}"
                  }
              ) {
                  clientMutationId
                  ref {
                      id
                      name
                      prefix
                  }
              }
          }`);

            context.log(response);
        } catch (error) {
            context.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
        }
        return { status: 200, body: response };
    }
});
