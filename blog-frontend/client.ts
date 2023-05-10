import {  createClient, type ClientConfig } from "@sanity/client";


const config: ClientConfig = {
  projectId: "ydoxviqr",
  dataset: "production",
  apiVersion: '2023-04-26',
  useCdn: true,
}
const client = createClient(config);

export default client;
