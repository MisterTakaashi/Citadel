import axios, { Method } from 'axios';
import * as Bluebird from 'bluebird';
import Server from '../models/server';

const queryDrone = async ({ url }: Server, apiInterface: string, resultKey?: string, method: Method = 'get') => {
  try {
    const result = await axios({ url: `${url}/${apiInterface}`, method });

    const response = result.data;

    if (response.error) {
      throw response.error;
    }

    return { response: response.data[resultKey || apiInterface], server: { url }, error: false };
  } catch (err) {
    console.error('Cannot query drone', url);

    return { response: undefined, code: err.response.status, error: err.response?.data?.message || err };
  }
};

const queryDrones = async (servers: Server[], apiInterface: string, resultKey?: string) => {
  const results = await Bluebird.map(servers, (currentServer: Server) =>
    queryDrone(currentServer, apiInterface, resultKey)
  );

  const filteredResults = results.reduce((acc, currentResult) => {
    if (currentResult.error) {
      return acc;
    }

    let response = currentResult.response;
    if (Array.isArray(currentResult.response)) {
      response = currentResult.response.map((currenResponse) => ({ ...currenResponse, server: currentResult.server }));
    } else {
      response.server = currentResult.server;
    }

    return [...acc, ...response];
  }, []);

  return filteredResults;
};

export { queryDrone, queryDrones };
