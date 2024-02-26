const { app } = require('@azure/functions');
import { Octokit } from "@octokit/core";



app.http('SignCommit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`)

        // graphql = graphql.defaults({
        //     headers: {
        //         authorization: `token ${process.env.GITHUB_TOKEN}`,
        //     },
        // });
        
        // try {
        //     const { response } = await graphql(`
        //       {
        //         repository(owner: "luiarhs", name: "datalist") {
        //           issues(last: 3) {
        //             edges {
        //               node {
        //                 title
        //               }
        //             }
        //           }
        //         }
        //       }
        //     `);

        //     context.log(response);
        // } catch (error) {
        //     context.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
        // }

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: response };
    }
});