const { app } = require('@azure/functions');
const { graphql } = require('@octokit/graphql');

app.http('CreateCommit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`)
        
        try {
            const octokit = graphql.defaults({
				headers: {
					authorization: `token ${process.env.GITHUB_TOKEN}`
				}
            });
            const { repository } = await octokit(`
              {
				repository(owner: "luiarhs", name: "datalist") {
					issues(last: 3) {
						edges {
							node {
								title
							}
						}
					}
				}
              }
            `);

            context.log(repository);
        } catch (error) {
			if (error instanceof GraphqlResponseError) {
			
				console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
				console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
			} else {
			// handle non-GraphQL error
			}
            context.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
        }

        return { body: repository };
    }
});
