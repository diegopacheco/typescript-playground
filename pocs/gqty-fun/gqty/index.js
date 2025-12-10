/**
 * GQty: You can safely modify this file based on your needs.
 */

import { createClient as createSubscriptionsClient } from "graphql-ws";
import { Cache, createClient, defaultResponseHandler } from "gqty";
import { generatedSchema, scalarsEnumsHash } from "./schema.generated";

/**
 * @type {import("gqty").QueryFetcher}
 */
const queryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  // Modify "https://spacex-production.up.railway.app/" if needed
  const response = await fetch("https://spacex-production.up.railway.app/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: "cors",
    ...fetchOptions,
  });

  return await defaultResponseHandler(response);
};

const subscriptionsClient =
  typeof window !== "undefined"
    ? createSubscriptionsClient({
        lazy: true,
        url: () => {
          // Modify if needed
          const url = new URL(
            "https://spacex-production.up.railway.app/",
            window.location.href
          );
          url.protocol = url.protocol.replace("http", "ws");
          return url.href;
        },
      })
    : undefined;

const cache = new Cache(
  undefined,
  /**
   * Cache is valid for 30 minutes, but starts revalidating after 5 seconds,
   * allowing soft refetches in background.
   */
  {
    maxAge: 5000,
    staleWhileRevalidate: 30 * 60 * 1000,
    normalization: true,
  }
);

/**
 * @type {import("gqty").GQtyClient<import("./schema.generated").GeneratedSchema>}
 */
export const client = createClient({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
    subscriber: subscriptionsClient,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export * from "./schema.generated";
