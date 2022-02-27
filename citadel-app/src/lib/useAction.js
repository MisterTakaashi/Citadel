import axios from 'axios';
import { useState } from 'react';

const apiUrl = 'http://localhost:3000';

/**
 * Make a action to the Hive API
 *
 * @param {string} endpoint The endpoint to call
 * @returns {any} Response of the API
 */
const useAction = (endpoint) => {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const action = () => {
    setLoading(true);

    axios({ url: `${apiUrl}${endpoint}`, method: 'POST' })
      .then(({ data: apiResponse }) => {
        if (!apiResponse.error) {
          setResponse(apiResponse.data);
        } else {
          setError(apiResponse.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  return { action, response, loading, error };
};

export default useAction;
