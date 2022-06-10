import axios from 'axios';
import { useState } from 'react';

const apiUrl = 'http://localhost:3000';

/**
 * Make a action to the Hive API
 *
 * @param {string | Function} endpoint The endpoint to call
 * @param {string} method The method to use when calling endpoint
 * @param {object | Function} body The body to send
 * @param {Function} callback The callback to execute after the query
 * @returns {any} Response of the API
 */
const useAction = (endpoint, method, body, callback) => {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const action = (params) => {
    setLoading(true);

    let finalEndpoint = endpoint;
    if (typeof endpoint === 'function') {
      finalEndpoint = endpoint(params);
    }

    let finalBody = body;
    if (typeof body === 'function') {
      finalBody = body(params);
    }

    axios({ url: `${apiUrl}${finalEndpoint}`, method, data: finalBody })
      .then(({ data: apiResponse }) => {
        if (!apiResponse.error) {
          setResponse(apiResponse.data);
          if (callback) callback(null, apiResponse.data);
        } else {
          setError(apiResponse.error);
          if (callback) callback(apiResponse.error);
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        if (callback) callback(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { action, response, loading, error };
};

export default useAction;
