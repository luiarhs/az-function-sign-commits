const { app } = require("@azure/functions");
const { graphql } = require("@octokit/graphql");

app.http("CreateCommit", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const octokit = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    try {
      const owner = "luiarhs";
      const repo = "github-actions-test";
      const branch = "main";
      const message = "[add] new commit";
      const content64 ="IyBHaXRIdWIgR3JhcGhRTCBBUEkNCg0KIyMgVGVzdCBjb21taXQgdXNpbmcgZ3JhcGhxbCBpbiBhIEF6IEZu";

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
                              contents: "${content64}"
                          }]
                      }
                      message: { headline: "${message}" }
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

      context.log(repository);
    } catch (error) {
      if (error instanceof GraphqlResponseError) {
        console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
        console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
      } else {
        // handle non-GraphQL error
      }
      context.log(
        `Error! Status: ${error.status}. Message: ${error.response.data.message}`
      );
    }

    return { body: repository };
  },
});
