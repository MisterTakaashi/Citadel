import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button';
import Card from '../../components/card';
import Layout from '../../components/layout';
import useApiAction from '../../lib/useApiAction';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [createSession, { loading: loadingSession }] = useApiAction(
    `/sessions`,
    'sessions',
    'POST',
    ({ email: emailBody, password: passwordBody }) => ({
      email: emailBody,
      password: passwordBody,
    }),
    (err, { token: accessToken }) => {
      if (err) {
        // TODO: Display the error in a toaster
        return;
      }

      setToken(accessToken);
    }
  );

  useEffect(() => {
    if (token === '') return;

    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined' && window.localStorage) {
      // eslint-disable-next-line no-undef
      window.localStorage.setItem('token', token);
    }
    navigate('/');
  }, [token, navigate]);

  return (
    <Layout noNavbar>
      <div className='container mx-auto mb-10 flex flex-col md:flex-row items-start gap-5 px-5 md:px-0'>
        <div className='w-full grid grid-cols-6 mt-12'>
          <div className='col-start-3 col-span-2'>
            <Card title='Log in to Citadel dashboard' className='w-full'>
              <p className='dark:text-white mt-5'>Email address</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='py-2 pl-3 pr-10 bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black w-full'
              />
              <p className='dark:text-white mt-5'>Password</p>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='py-2 pl-3 pr-10 bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black w-full'
              />
              <div className='mt-6 flex flex-row-reverse'>
                <Button
                  loading={loadingSession}
                  disabled={loadingSession}
                  onClick={() => createSession({ email, password })}
                >
                  Login
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
