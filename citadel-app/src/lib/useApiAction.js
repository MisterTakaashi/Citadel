import useAction from './useAction';

const useApiQuery = (apiInterface, resultKey) => {
  const { action, response, ...rest } = useAction(apiInterface);

  return [action, { [resultKey]: response?.[resultKey], ...rest }];
};

export default useApiQuery;
