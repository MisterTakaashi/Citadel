import axios from 'axios';
import * as Bluebird from 'bluebird';
import Server from '../models/server';

const queryDrone = async ({ url }: Server, apiInterface: string, resultKey?: string) => {
  try {
    const result = await axios({ url: `${url}/${apiInterface}` });

    const response = result.data;

    if (response.error) {
      throw response.error;
    }

    return { response: response.data[resultKey || apiInterface], error: false };
  } catch (err) {
    console.error('Cannot query drone', url);

    return { response: undefined, error: err };
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

    return [...acc, ...currentResult.response];
  }, []);

  return filteredResults;
};

export { queryDrone, queryDrones };
