## Description

Load testing tool

#### Steps

To test graphql endpoint,
Add following line in package.json scripts

```bash
"test:graphql": "k6 run --out json=load-test/results.json load-test/graphql-load-test.js",
```
npm run test:graphql for running

To test rest endpoint
Add following line in package.json scripts

```bash
"test:rest": "k6 run --out json=load-test/results.json load-test/rest-load-test.js",
```
npm run test:rest for running

If load testing not required remove the parent folder load-test and remove these lines from package.json
```bash
"test:graphql": "k6 run --out json=load-test/results.json load-test/graphql-load-test.js",
"test:rest": "k6 run --out json=load-test/results.json load-test/rest-load-test.js",
```