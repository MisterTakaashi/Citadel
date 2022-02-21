import useQuery from './useQuery';

const useApiQuery = (apiInterface, resultKey) => {
  const { response, ...rest } = useQuery(apiInterface);

  return { [resultKey]: response?.[resultKey], ...rest };
};

export default useApiQuery;
