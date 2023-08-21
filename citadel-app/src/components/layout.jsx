import React from 'react';
import PropTypes from 'prop-types';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../lib/useAuth';

function Layout({ noNavbar, children }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className='min-h-screen bg-white dark:bg-slate-900'>
      <nav className={`${noNavbar ? '' : 'dark:bg-gray-800'}`}>
        <div className='container mx-auto'>
          <div className='relative flex items-center justify-between h-16'>
            <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex-shrink-0 flex items-center'>
                <Link to='/'>
                  <div className='flex items-center gap-4'>
                    <FontAwesomeIcon icon={faServer} className='text-white' size='2x' />
                    {noNavbar && <h1 className='text-white font-bold text-xl'>Citadel</h1>}
                  </div>
                </Link>
              </div>
              {!noNavbar && (
                <div className='hidden sm:block sm:ml-6'>
                  <div className='flex space-x-4'>
                    <Link
                      to='/'
                      className={`${
                        location.pathname === '/' || location.pathname.startsWith('/instances')
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to='/'
                      className={`${
                        location.pathname === '/documentation'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Documentation
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {!noNavbar && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                <button
                  type='button'
                  className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                >
                  <FontAwesomeIcon icon={faBell} className='text-xl px-1' />
                </button>

                <div className='ml-3 relative'>
                  <div>
                    <button
                      type='button'
                      className='bg-gray-800 flex text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white text-gray-300'
                      id='user-menu-button'
                      aria-expanded='false'
                      aria-haspopup='true'
                    >
                      <div className='flex items-center'>
                        <img
                          className='h-8 w-8 rounded mr-2'
                          src='https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/42/422e893d9bf551cb26a7764dd20936f85c445a4e_full.jpg'
                          alt=''
                        />
                        <span>{user && user.email}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}

Layout.propTypes = {
  noNavbar: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  noNavbar: false,
};

export default Layout;
