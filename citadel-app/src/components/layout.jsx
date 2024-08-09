import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { faServer, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../lib/useAuth';
import useApiQuery from '../lib/useApiQuery';
import JobCard from './job-card';

function Layout({ noNavbar, children }) {
  const location = useLocation();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const { jobs } = useApiQuery('/jobs', 'jobs');
  const inProgressJobs = jobs?.filter(
    ({ status }) => status === 'delivered' || status === 'created'
  );
  const doneJobs = jobs?.filter(({ status }) => status !== 'delivered' && status !== 'created');

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
                  className='relative bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                  onClick={() => setOpen(true)}
                >
                  <FontAwesomeIcon icon={faBell} className='text-xl px-1' />
                  {jobs?.length > 0 && (
                    <>
                      <span className='sr-only'>Notifications</span>
                      {inProgressJobs?.length > 0 && (
                        <div className='absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900'>
                          {inProgressJobs?.length}
                        </div>
                      )}
                    </>
                  )}
                </button>

                <Transition appear show={open} as={Fragment}>
                  <Dialog onClose={setOpen} className='relative z-10'>
                    <div className='fixed inset-0 bg-black/30' />

                    <div className='fixed inset-0 overflow-hidden'>
                      <div className='absolute inset-0 overflow-hidden'>
                        <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                          <Dialog.Panel className='pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700'>
                            <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-gray-800 dark:text-white p-5'>
                              <div className='px-2'>
                                <div className='flex items-baseline justify-between'>
                                  <Dialog.Title className='text-2xl px-3 text-gray-900 dark:text-white'>
                                    Jobs
                                  </Dialog.Title>
                                  <div className='ml-3 flex h-7 items-center'>
                                    <button
                                      type='button'
                                      onClick={() => setOpen(false)}
                                      className='relative rounded-md bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                                    >
                                      <span className='absolute -inset-2.5' />
                                      <span className='sr-only'>Close panel</span>
                                      <FontAwesomeIcon
                                        icon={faXmarkCircle}
                                        className='text-xl px-1'
                                      />
                                    </button>
                                  </div>
                                </div>

                                <div className='h-px bg-gray-600 mt-5 mb-5' />
                              </div>
                              <div className='relative mt-4 flex-1 px-4'>
                                <div>
                                  <div className=' flex flex-col gap-2'>
                                    {jobs &&
                                      inProgressJobs.map(({ _id: id, ...job }) => (
                                        <JobCard job={job} key={id} />
                                      ))}
                                  </div>

                                  {inProgressJobs?.length > 0 && (
                                    <div className='h-px bg-gray-600 mt-5 mb-5' />
                                  )}

                                  <div className=' flex flex-col gap-2'>
                                    {jobs &&
                                      doneJobs?.map(({ _id: id, ...job }) => (
                                        <JobCard job={job} key={id} />
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </Transition>

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
