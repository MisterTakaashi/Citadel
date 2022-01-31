import axios from 'axios';

const queryDrone = async (url: string, apiInterface: string, resultKey?: string) => {
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

export default queryDrone;
