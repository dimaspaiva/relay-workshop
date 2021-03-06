import { RequestParameters } from 'relay-runtime/lib/util/RelayConcreteNode';
import { Variables } from 'relay-runtime/lib/util/RelayRuntimeTypes';

import config from '../config';

// read from localstorage or cookie
const getToken = () => {
  return 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMGQxN2JmOTY4Yzk4Y2E4MGNjMzUzYSIsImlhdCI6MTU5OTA3ODM1MH0.8BhVqFHEg0M-D1QKruDn3MqIRnH5_fTC82dSuO2X0RA';
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
