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
            const { response } = await octokit.graphql(`
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

            context.log(response);
        } catch (error) {
            context.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
        }
        return { status: 200, body: response };
    }
});
