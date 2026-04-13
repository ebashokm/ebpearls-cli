import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "./k6.bundle.js";

export const options = {
  stages: [
    { duration: '1m', target: 2 },
    // { duration: '5m', target: 500 },
    // { duration: '1m', target: 100 },
  ],
};

export default function () {

  //http://localhost:3001/events/test-sse-multiple
  const res = http.get('http://localhost:3000/upload-contacts/contact', {
    tags: { name: 'Endpoint Trigger' },
    timeout: '180s', // Increase timeout
  });

  // Check if the response has data
  check(res, {
    'status is 200': (r) => r.status === 200,
    'content-type is text/event-stream': (r) => r.headers['Content-Type'] === 'text/event-stream',
  });

  sleep(1); // Small sleep to simulate a wait time before the next request
}

export function handleSummary(data) {
  return {
    "load-test/summary.html": htmlReport(data),
  };
}
