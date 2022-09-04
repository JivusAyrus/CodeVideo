import {
  Application,
  authProviders,
  configureWunderGraphApplication,
  cors,
  introspect,
  templates,
} from "@wundergraph/sdk";
import { NextJsTemplate } from "@wundergraph/nextjs/dist/template";
import server from "./wundergraph.server";
import operations from "./wundergraph.operations";
// import linkBuilder from "./generated/linkbuilder";

const codeVideoDB = introspect.postgresql({
  apiNamespace: "codeVideoDB",
  databaseURL:
    "postgresql://admin:admin@localhost:54322/codevideo?schema=public",
  introspection: {
    pollingIntervalSeconds: 10,
  },
});

const colorcodes = introspect.openApi({
  apiNamespace: "colorcodes",
  source: {
    kind: "file",
    filePath: "colorcodes.yaml",
  },
  introspection: {
    pollingIntervalSeconds: 10,
  },
});

const myApplication = new Application({
  name: "api",
  apis: [codeVideoDB, colorcodes],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  application: myApplication,
  server,
  operations,
  // S3 Server
  // 1. Move to`../minio` and run (chmod +x && ./setup.sh) to create a S3 server.
  // 2. Comment out the section below and save!

  // Enable file upload functionality in your generated client
  // Minio credentials: minio / minio123
  s3UploadProvider: [
    {
      name: "minio",
      endpoint: "127.0.0.1:9000",
      accessKeyID: "minio",
      secretAccessKey: "minio123",
      bucketLocation: "eu-central-1",
      bucketName: "uploads",
      useSSL: false,
    },
  ],
  codeGenerators: [
    {
      templates: [
        ...templates.typescript.all,
        templates.typescript.operations,
        templates.typescript.linkBuilder,
      ],
    },
    {
      templates: [new NextJsTemplate()],
      path: "../components/generated",
    },
  ],
  cors: {
    ...cors.allowAll,
    allowedOrigins: ["http://localhost:3000"],
  },
  authentication: {
    cookieBased: {
      providers: [
        authProviders.google({
          id: "google",
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
      ],
      authorizedRedirectUris: ["http://localhost:3000/"],
    },
  },
  security: {
    enableGraphQLEndpoint: process.env.NODE_ENV !== "production",
  },
});
