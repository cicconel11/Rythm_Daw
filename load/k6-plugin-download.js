import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    download: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
    },
  },
  thresholds: {
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/download');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains download button': (r) => r.body.includes('Download Plug-in'),
  });
  sleep(1);
}
