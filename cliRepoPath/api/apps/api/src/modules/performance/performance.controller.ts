import { Controller, Get, Query } from '@nestjs/common';
import {
  PerformanceInterceptor,
  PerformanceMetrics,
} from '@app/common/interceptors/performance.interceptor';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceInterceptor: PerformanceInterceptor) {}

  @Get('metrics')
  getMetrics() {
    return {
      metrics: this.performanceInterceptor.getMetrics(),
      summary: {
        totalOperations: this.performanceInterceptor.getMetrics().length,
        averageResponseTime: this.performanceInterceptor.getAverageResponseTime(),
        overallErrorRate: this.performanceInterceptor.getErrorRate(),
      },
    };
  }

  @Get('slow-operations')
  getSlowOperations(@Query('threshold') threshold: string = '1000') {
    const thresholdMs = parseInt(threshold, 10);
    return this.performanceInterceptor.getSlowOperations(thresholdMs);
  }

  @Get('operation-stats')
  getOperationStats(@Query('operation') operation: string) {
    if (!operation) {
      return { error: 'Operation parameter is required' };
    }

    return {
      operation,
      stats: this.performanceInterceptor.getOperationStats(operation),
    };
  }

  @Get('health')
  getHealthCheck() {
    const metrics = this.performanceInterceptor.getMetrics();
    const recentMetrics = metrics.filter(
      (m) => Date.now() - m.timestamp.getTime() < 5 * 60 * 1000, // Last 5 minutes
    );

    const averageResponseTime =
      recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
        : 0;

    const errorRate =
      recentMetrics.length > 0
        ? (recentMetrics.filter((m) => !m.success).length / recentMetrics.length) * 100
        : 0;

    return {
      status: 'healthy',
      timestamp: new Date(),
      metrics: {
        recentOperations: recentMetrics.length,
        averageResponseTime: Math.round(averageResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
        slowOperations: recentMetrics.filter((m) => m.duration > 1000).length,
      },
      recommendations: this.getRecommendations(averageResponseTime, errorRate),
    };
  }

  private getRecommendations(averageResponseTime: number, errorRate: number): string[] {
    const recommendations = [];

    if (averageResponseTime > 2000) {
      recommendations.push('Consider implementing caching for slow operations');
    }

    if (averageResponseTime > 5000) {
      recommendations.push('Review database queries and add proper indexing');
    }

    if (errorRate > 5) {
      recommendations.push('High error rate detected - investigate error patterns');
    }

    if (averageResponseTime > 1000 && averageResponseTime < 2000) {
      recommendations.push('Consider optimizing queries or implementing pagination');
    }

    return recommendations.length > 0 ? recommendations : ['System performance is optimal'];
  }
}

// #!/usr/bin/env node

// /**
//  * Performance Benchmark Script
//  * Tests the optimized query performance against baseline
//  */

// import http from 'k6/http';
// import { check, sleep } from 'k6';
// import { htmlReport } from "./k6.bundle.js";

// // Test scenarios
// export const scenarios = {
//   // Light load test
//   light_load: {
//     executor: 'constant-vus',
//     vus: 10,
//     duration: '2m',
//     tags: { test_type: 'light_load' },
//   },

//   // Medium load test
//   medium_load: {
//     executor: 'constant-vus',
//     vus: 50,
//     duration: '5m',
//     tags: { test_type: 'medium_load' },
//   },

//   // Heavy load test
//   heavy_load: {
//     executor: 'constant-vus',
//     vus: 100,
//     duration: '3m',
//     tags: { test_type: 'heavy_load' },
//   },

//   // Spike test
//   spike_test: {
//     executor: 'ramping-vus',
//     startVUs: 0,
//     stages: [
//       { duration: '1m', target: 100 },
//       { duration: '30s', target: 200 },
//       { duration: '1m', target: 100 },
//       { duration: '30s', target: 0 },
//     ],
//     tags: { test_type: 'spike_test' },
//   },
// };

// export const options = {
//   scenarios,
//   thresholds: {
//     // Performance thresholds
//     http_req_duration: ['p(95)<2000'], // 95% of requests should be under 2s
//     http_req_failed: ['rate<0.1'], // Error rate should be less than 10%
//     http_reqs: ['rate>10'], // Should handle at least 10 requests per second
//   },
// };

// // Test data
// const API_URL = 'http://localhost:3000/api';
// const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRodWt1Y2hodXN1Ym9kaDk5QGdtYWlsLmNvbSIsInN1YiI6IjY3MTVkYzlkODE2NjJmYWNkYmIyMjIzYiIsImp0aSI6IjViYWRjZDBiLTI2OTAtNGQzZC04ZDc1LWI1ZGE4YjAxMWQ3YyIsImlhdCI6MTczNjQ4NTIzMiwiZXhwIjoxNzM2NDg4ODMyfQ.PUmsCDrhG-s5fKm0f90O4FDnJ7c0THJmbjtBCnI73aM';

// const HEADERS = {
//   'Content-Type': 'application/json',
//   'Authorization': AUTH_TOKEN,
// };

// // Test queries
// const QUERIES = {
//   feedList: {
//     query: `
//       query FeedList($input: ListFeedsInput!) {
//         feedList(input: $input) {
//           feeds {
//             _id
//             caption
//             assets {
//               type
//               url
//               thumbnails
//             }
//             userDetail {
//               firstName
//               lastName
//               profileImage
//             }
//             isLiked
//             likeCount
//             commentCount
//             createdAt
//           }
//           pagination {
//             total
//             hasNextPage
//           }
//           message
//         }
//       }
//     `,
//     variables: {
//       input: {
//         limit: 20,
//         skip: 0,
//         orderBy: 'createdAt',
//         order: 'desc',
//         searchText: '',
//       },
//     },
//   },

//   userProfiles: {
//     query: `
//       query UserProfiles($input: ListUseProfilesDTO!) {
//         listUserProfiles(input: $input) {
//           users {
//             _id
//             firstName
//             lastName
//             profileImage
//             bio
//           }
//           pagination {
//             total
//             hasNextPage
//           }
//           message
//         }
//       }
//     `,
//     variables: {
//       input: {
//         limit: 10,
//         skip: 0,
//         orderBy: 'createdAt',
//         order: 'desc',
//         searchText: '',
//       },
//     },
//   },

//   feedComments: {
//     query: `
//       query FeedComments($feedId: String!, $input: ListCommentsInFeedInput!) {
//         listFeedComments(feedId: $feedId, input: $input) {
//           comments {
//             _id
//             comment
//             userDetail {
//               firstName
//               lastName
//               profileImage
//             }
//             isLiked
//             replyCount
//             createdAt
//           }
//           pagination {
//             total
//             hasNextPage
//           }
//           message
//         }
//       }
//     `,
//     variables: {
//       feedId: '6715dc9d81662facdbb2223b', // Sample feed ID
//       input: {
//         limit: 10,
//         skip: 0,
//         orderBy: 'createdAt',
//         order: 'desc',
//       },
//     },
//   },
// };

// // Performance tracking
// class PerformanceTracker {
//   constructor() {
//     this.metrics = {
//       requests: 0,
//       errors: 0,
//       totalDuration: 0,
//       cacheHits: 0,
//       cacheMisses: 0,
//     };
//   }

//   recordRequest(duration, error = false, cacheHit = false) {
//     this.metrics.requests++;
//     this.metrics.totalDuration += duration;

//     if (error) {
//       this.metrics.errors++;
//     }

//     if (cacheHit) {
//       this.metrics.cacheHits++;
//     } else {
//       this.metrics.cacheMisses++;
//     }
//   }

//   getStats() {
//     return {
//       ...this.metrics,
//       averageDuration: this.metrics.totalDuration / this.metrics.requests,
//       errorRate: (this.metrics.errors / this.metrics.requests) * 100,
//       cacheHitRate: (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100,
//     };
//   }
// }

// const tracker = new PerformanceTracker();

// // Helper function to execute GraphQL query
// function executeGraphQLQuery(queryName, queryData) {
//   const startTime = Date.now();

//   const payload = JSON.stringify({
//     query: queryData.query,
//     variables: queryData.variables,
//   });

//   const response = http.post(API_URL, payload, { headers: HEADERS });

//   const duration = Date.now() - startTime;
//   const error = response.status !== 200 || response.json('data').errors;

//   // Check for cache indicators in response headers
//   const cacheHit = response.headers['X-Cache'] === 'HIT';

//   tracker.recordRequest(duration, error, cacheHit);

//   return {
//     response,
//     duration,
//     error,
//     cacheHit,
//   };
// }

// // Test functions
// export function testFeedList() {
//   const result = executeGraphQLQuery('feedList', QUERIES.feedList);

//   check(result.response, {
//     'feed list status is 200': (r) => r.status === 200,
//     'feed list has data': (r) => {
//       const data = r.json('data');
//       return data && data.feedList && data.feedList.feeds;
//     },
//     'feed list response time < 2s': () => result.duration < 2000,
//     'feed list has pagination': (r) => {
//       const data = r.json('data');
//       return data && data.feedList && data.feedList.pagination;
//     },
//   });

//   return result;
// }

// export function testUserProfiles() {
//   const result = executeGraphQLQuery('userProfiles', QUERIES.userProfiles);

//   check(result.response, {
//     'user profiles status is 200': (r) => r.status === 200,
//     'user profiles has data': (r) => {
//       const data = r.json('data');
//       return data && data.listUserProfiles && data.listUserProfiles.users;
//     },
//     'user profiles response time < 1s': () => result.duration < 1000,
//   });

//   return result;
// }

// export function testFeedComments() {
//   const result = executeGraphQLQuery('feedComments', QUERIES.feedComments);

//   check(result.response, {
//     'feed comments status is 200': (r) => r.status === 200,
//     'feed comments response time < 1.5s': () => result.duration < 1500,
//   });

//   return result;
// }

// // Main test function
// export default function () {
//   // Randomly select a test to run
//   const tests = [testFeedList, testUserProfiles, testFeedComments];
//   const randomTest = tests[Math.floor(Math.random() * tests.length)];

//   const result = randomTest();

//   // Log performance metrics
//   if (__ITER % 10 === 0) {
//     console.log(`Iteration ${__ITER}: ${result.duration}ms, Cache: ${result.cacheHit ? 'HIT' : 'MISS'}`);
//   }

//   sleep(Math.random() * 2 + 0.5); // Random sleep between 0.5-2.5 seconds
// }

// // Teardown function
// export function teardown(data) {
//   const stats = tracker.getStats();
//   console.log('\n=== PERFORMANCE BENCHMARK RESULTS ===');
//   console.log(`Total Requests: ${stats.requests}`);
//   console.log(`Average Response Time: ${stats.averageDuration.toFixed(2)}ms`);
//   console.log(`Error Rate: ${stats.errorRate.toFixed(2)}%`);
//   console.log(`Cache Hit Rate: ${stats.cacheHitRate.toFixed(2)}%`);
//   console.log('=====================================\n');
// }

// // Report generation
// export function handleSummary(data) {
//   return {
//     'load-test/performance-report.html': htmlReport(data),
//     'load-test/performance-summary.json': JSON.stringify({
//       summary: data.metrics,
//       custom: tracker.getStats(),
//     }, null, 2),
//   };
// }
