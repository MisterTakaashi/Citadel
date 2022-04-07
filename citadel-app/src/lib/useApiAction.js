import useAction from './useAction';

const useApiAction = (apiInterface, resultKey, method, body, callback) => {
  const { action, response, ...rest } = useAction(apiInterface, method, body, callback);

  return [action, { [resultKey]: response?.[resultKey], ...rest }];
};

export default useApiAction;
