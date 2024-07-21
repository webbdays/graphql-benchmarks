# GraphQL Benchmarks <!-- omit from toc -->

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/tailcallhq/graphql-benchmarks)

Explore and compare the performance of the fastest GraphQL frameworks through our comprehensive benchmarks.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Benchmark Results](#benchmark-results)
  - [Throughput (Higher is better)](#throughput-higher-is-better)
  - [Latency (Lower is better)](#latency-lower-is-better)
- [Architecture](#architecture)
  - [WRK](#wrk)
  - [GraphQL](#graphql)
  - [Nginx](#nginx)
  - [Jsonplaceholder](#jsonplaceholder)
- [GraphQL Schema](#graphql-schema)
- [Contribute](#contribute)

[Tailcall]: https://github.com/tailcallhq/tailcall
[Gqlgen]: https://github.com/99designs/gqlgen
[Apollo GraphQL]: https://github.com/apollographql/apollo-server
[Netflix DGS]: https://github.com/netflix/dgs-framework
[Caliban]: https://github.com/ghostdogpr/caliban
[async-graphql]: https://github.com/async-graphql/async-graphql
[Hasura]: https://github.com/hasura/graphql-engine
[GraphQL JIT]: https://github.com/zalando-incubator/graphql-jit

## Introduction

This document presents a comparative analysis of several renowned GraphQL frameworks. Dive deep into the performance metrics, and get insights into their throughput and latency.

> **NOTE:** This is a work in progress suite of benchmarks, and we would appreciate help from the community to add more frameworks or tune the existing ones for better performance.

## Quick Start

Get started with the benchmarks:

1. Click on this [link](https://codespaces.new/tailcallhq/graphql-benchmarks) to set up on GitHub Codespaces.
2. Once set up in Codespaces, initiate the benchmark tests:

```bash
./setup.sh
./run_benchmarks.sh
```

## Benchmark Results

<!-- PERFORMANCE_RESULTS_START -->

| Query | Server | Requests/sec | Latency (ms) | Relative |
|-------:|--------:|--------------:|--------------:|---------:|
| 1 | `{ posts { id userId title user { id name email }}}` |
|| [Tailcall] | `47,512.10` | `2.05` | `42.91x` |
|| [async-graphql] | `7,194.49` | `13.92` | `6.50x` |
|| [Caliban] | `5,835.92` | `17.25` | `5.27x` |
|| [Hasura] | `4,526.02` | `22.09` | `4.09x` |
|| [Gqlgen] | `2,262.58` | `44.08` | `2.04x` |
|| [GraphQL JIT] | `1,509.69` | `66.00` | `1.36x` |
|| [Netflix DGS] | `1,417.92` | `61.18` | `1.28x` |
|| [Apollo GraphQL] | `1,107.37` | `89.80` | `1.00x` |
| 2 | `{ posts { title }}` |
|| [Tailcall] | `142,249.00` | `666.59` | `92.24x` |
|| [async-graphql] | `34,739.10` | `3.01` | `22.53x` |
|| [Caliban] | `34,491.90` | `2.99` | `22.37x` |
|| [Gqlgen] | `7,415.40` | `16.47` | `4.81x` |
|| [Hasura] | `6,648.57` | `15.03` | `4.31x` |
|| [Apollo GraphQL] | `6,306.80` | `16.23` | `4.09x` |
|| [Netflix DGS] | `6,168.39` | `18.06` | `4.00x` |
|| [GraphQL JIT] | `1,542.21` | `64.76` | `1.00x` |
| 3 | `{ greet }` |
|| [Tailcall] | `263,166.00` | `332.74` | `46.93x` |
|| [async-graphql] | `220,503.00` | `394.91` | `39.32x` |
|| [Caliban] | `197,866.00` | `784.90` | `35.29x` |
|| [Gqlgen] | `154,410.00` | `0.93` | `27.54x` |
|| [Apollo GraphQL] | `31,343.50` | `3.71` | `5.59x` |
|| [Netflix DGS] | `28,386.10` | `3.65` | `5.06x` |
|| [Hasura] | `9,272.07` | `10.77` | `1.65x` |
|| [GraphQL JIT] | `5,607.45` | `17.81` | `1.00x` |

<!-- PERFORMANCE_RESULTS_END -->



### 1. `{posts {title body user {name}}}`
#### Throughput (Higher is better)

![Throughput Histogram](assets/req_sec_histogram1.png)

#### Latency (Lower is better)

![Latency Histogram](assets/latency_histogram1.png)

### 2. `{posts {title body}}`
#### Throughput (Higher is better)

![Throughput Histogram](assets/req_sec_histogram2.png)

#### Latency (Lower is better)

![Latency Histogram](assets/latency_histogram2.png)

### 3. `{greet}`
#### Throughput (Higher is better)

![Throughput Histogram](assets/req_sec_histogram3.png)

#### Latency (Lower is better)

![Latency Histogram](assets/latency_histogram3.png)

## Architecture

![Architecture Diagram](assets/architecture.png)

A client (`wrk`) sends requests to a GraphQL server to fetch post titles. The GraphQL server, in turn, retrieves data from an external source, `jsonplaceholder.typicode.com`, routed through the `nginx` reverse proxy.

### WRK

`wrk` serves as our test client, sending GraphQL requests at a high rate.

### GraphQL

Our tested GraphQL server. We evaluated various implementations, ensuring no caching on the GraphQL server side.

### Nginx

A reverse-proxy that caches every response, mitigating rate-limiting and reducing network uncertainties.

### Jsonplaceholder

The primary upstream service forming the base for our GraphQL API. We query its `/posts` API via the GraphQL server.

## GraphQL Schema

Inspect the generated GraphQL schema employed for the benchmarks:

```graphql
schema {
  query: Query
}

type Query {
  posts: [Post]
}

type Post {
  id: Int!
  userId: Int!
  title: String!
  body: String!
  user: User
}

type User {
  id: Int!
  name: String!
  username: String!
  email: String!
  phone: String
  website: String
}
```

## Contribute

Your insights are invaluable! Test these benchmarks, share feedback, or contribute by adding more GraphQL frameworks or refining existing ones. Open an issue or a pull request, and let's build a robust benchmarking resource together!
