import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { configureWunderGraphServer } from "@wundergraph/sdk";
import type { HooksConfig, HookRequest } from "./generated/wundergraph.hooks";
import type { InternalClient } from "./generated/wundergraph.internal.client";

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
  hooks: {
    authentication: {
      postAuthentication: async ({ user, internalClient, log }) => {
        if (!user || !user.email || !user.name) {
          return;
        }
        const data = await internalClient.mutations.CreateUser({
          input: {
            email: user.email,
            name: user.name,
            picture: user.avatarUrl,
          },
        });
        if (data.errors) log.error("User Creation failed", data.errors);
      },
    },
    queries: {},
    mutations: {},
  },
  graphqlServers: [
    {
      apiNamespace: "gql",
      serverName: "gql",
      schema: new GraphQLSchema({
        query: new GraphQLObjectType({
          name: "RootQueryType",
          fields: {
            hello: {
              type: GraphQLString,
              resolve() {
                return "world";
              },
            },
          },
        }),
      }),
    },
  ],
}));
