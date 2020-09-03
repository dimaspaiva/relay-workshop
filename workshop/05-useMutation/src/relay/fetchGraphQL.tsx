import { RequestParameters } from 'relay-runtime/lib/util/RelayConcreteNode';
import { Variables } from 'relay-runtime/lib/util/RelayRuntimeTypes';

import config from '../config';

// read from localstorage or cookie
const getToken = () => {
  /**
   * TODO
   * use your user token
   */
  return 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMGQxN2JmOTY4Yzk4Y2E4MGNjMzUzYSIsImlhdCI6MTU5OTA3MDY0NX0.ASj8rSbm53RrSSYgZpVcB4HhyBTxXjWs_hIgxI3Gbag';
};

export const fetchGraphQL = async (request: RequestParameters, variables: Variables) => {
  const authorization = getToken();

  const response = await fetch(config.GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: authorization,
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  const data = await response.json();

  return data;
};
