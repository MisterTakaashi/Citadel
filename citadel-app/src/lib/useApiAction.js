import useAction from './useAction';

const useApiAction = (apiInterface, resultKey, callback) => {
  const { action, response, ...rest } = useAction(apiInterface, callback);

  return [action, { [resultKey]: response?.[resultKey], ...rest }];
};

export default useApiAction;
