import useAction from './useAction';

const useApiAction = (apiInterface, resultKey, body, callback) => {
  const { action, response, ...rest } = useAction(apiInterface, body, callback);

  return [action, { [resultKey]: response?.[resultKey], ...rest }];
};

export default useApiAction;
