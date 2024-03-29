import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import initInterceptors from './interceptor';

const userPropType = PropTypes.shape({
  name: PropTypes.string,
  avatar: PropTypes.string,
  avatar_medium: PropTypes.string,
  avatar_full: PropTypes.string,
});

const authContext = createContext();

const useAuth = () => useContext(authContext);

const apiUrl = 'http://localhost:3000';

const useProvideAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-undef
  const [csr, setCsr] = useState(localStorage.getItem('csr'));
  initInterceptors(csr);

  const logout = useCallback(() => {
    // eslint-disable-next-line no-undef
    localStorage.removeItem('user');
    // eslint-disable-next-line no-undef
    localStorage.removeItem('csr');

    setUser(null);

    navigate('/login');
  }, [navigate]);

  const authenticate = useCallback(
    async (authCsr, goToHome) => {
      if (isAuthenticating) return;

      setIsAuthenticating(true);

      axios.interceptors.request.clear();
      axios.interceptors.response.clear();

      initInterceptors(authCsr, logout);

      try {
        const { data: response } = await axios({ url: `${apiUrl}/sessions/${authCsr}` });
        // eslint-disable-next-line no-undef
        localStorage.setItem('user', JSON.stringify(response.data.account));
        // eslint-disable-next-line no-undef
        localStorage.setItem('csr', authCsr);

        setUser(response.data.account);
        setCsr(authCsr);

        if (goToHome) navigate('/');
      } catch (e) {
        navigate('/login');
      }
    },
    [isAuthenticating, navigate, logout]
  );

  const login = async (email, password) => {
    const { data: responseData } = await axios({
      method: 'POST',
      url: `${apiUrl}/sessions`,
      data: { email, password },
    });

    authenticate(responseData.data.token, true);
  };

  useEffect(() => {
    if (user === null) {
      // eslint-disable-next-line no-undef
      const authCsr = localStorage.getItem('csr');

      if (authCsr) {
        authenticate(authCsr);
      } else {
        navigate('/login');
      }
    }
  }, [user, authenticate, navigate]);

  return { authenticate, login, logout, user, csr };
};

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default useAuth;
export { ProvideAuth, userPropType };
