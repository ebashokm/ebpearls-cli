import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "./k6.bundle.js";

// Define options for the test
export const options = {
  stages: [
    { duration: '1m', target: 5 }, // fast ramp-up to a high point
    // No plateau
    //{ duration: '1m', target: 0 }, // quick ramp-down to 0 users
  ],
};

// Define the GraphQL query
const query = `query Contacts($input: ListContactsDTO!) {
  contacts(input: $input) {
    contacts {
      contactId
      deviceId
      isUserRegistered
      name
      userId
      _id
      countryCode
      isPhoneRegistered
      phoneNumber
      phoneNumberId
    }
    message
    pagination {
      hasNextPage
      total
    }
  }
}`;

export default function () {
  const url = 'http://localhost:3000/api'; // GraphQL endpoint

  // Bearer token for authorization
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRodWt1Y2hodXN1Ym9kaDk5QGdtYWlsLmNvbSIsInN1YiI6IjY3MTVkYzlkODE2NjJmYWNkYmIyMjIzYiIsImp0aSI6IjViYWRjZDBiLTI2OTAtNGQzZC04ZDc1LWI1ZGE4YjAxMWQ3YyIsImlhdCI6MTczNjQ4NTIzMiwiZXhwIjoxNzM2NDg4ODMyfQ.PUmsCDrhG-s5fKm0f90O4FDnJ7c0THJmbjtBCnI73aM' // shortened for brevity

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  // Payload with input data
  const payload = JSON.stringify({
    query: query,
    variables: {
      input: {
        deviceId: 'loadTest',
        limit: 10,
        searchText: '',
        skip: 0,
      },
    },
  });

  // Send the POST request
  const res = http.post(url, payload, { headers });

  // Check the response
  if (res.body) {
    const responseBody = JSON.parse(res.body);

    // Log the GraphQL response to console
    console.log('GraphQL Response:', JSON.stringify(responseBody));

    // Check the response
    check(res, {
      'status is 200': (r) => r.status === 200,
      'no GraphQL errors': (r) => !responseBody.errors,  // Check if there are no GraphQL errors
      'response contains data': (r) => responseBody.data && responseBody.data.contacts,
    });
  } else {
    console.log('Request failed or timed out.');
  }

  sleep(1); // Simulate user think time
}


export function handleSummary(data) {
  return {
    "load-test/summary.html": htmlReport(data),
  };
}