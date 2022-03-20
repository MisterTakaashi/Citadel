import axios from 'axios';
import { useState } from 'react';

const apiUrl = 'http://localhost:3000';

/**
 * Make a action to the Hive API
 *
 * @param {string} endpoint The endpoint to call
 * @param {Function} callback The callback to execute after the query
 * @returns {any} Response of the API
 */
const useAction = (endpoint, callback) => {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const action = (params) => {
    setLoading(true);

    let finalEndpoint = endpoint;
    if (typeof endpoint === 'function') {
      finalEndpoint = endpoint(params);
    }

    axios({ url: `${apiUrl}${finalEndpoint}`, method: 'POST' })
      .then(({ data: apiResponse }) => {
        if (!apiResponse.error) {
          setResponse(apiResponse.data);
        } else {
          setError(apiResponse.error);
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
        if (callback) callback();
      });
  };

  return { action, response, loading, error };
};

export default useAction;
