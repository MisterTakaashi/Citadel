import axios from 'axios';
import { useEffect, useState } from 'react';

const apiUrl = 'http://localhost:3000';

/**
 * Make a query to the Pure System API
 *
 * @param {string} endpoint The endpoint to call
 * @returns {any} Response of the Pure System API
 */
const useQuery = (endpoint) => {
  const [response, setResponse] = useState();
  const [refreshTriggered, setRefreshTriggered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = () => {
    setRefreshTriggered(!refreshTriggered);
  };

  useEffect(() => {
    axios({ url: `${apiUrl}${endpoint}` })
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
  }, [endpoint, refreshTriggered]);

  return { response, loading, error, refetch };
};

export default useQuery;
