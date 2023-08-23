import React from 'react';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import Overview from './overview';
import Console from './console';
import Layout from '../../components/layout';
import DroneStatus from '../../components/drone-status';
import useApiQuery from '../../lib/useApiQuery';

function Instance() {
  const { name } = useParams();
  const { pathname } = useLocation();

  const currentRoute = pathname.split('/')[pathname.split('/').length - 1];

  const { instance, loading } = useApiQuery(`/instances/${name}`, 'instance');

  return (
    <Layout>
      <div className='dark:bg-gray-800 px-5 sm:px-0'>
        <div className='container mx-auto mb-10 pt-5'>
          {!loading && <h2 className='text-white text-3xl font-bold mb-3'>{instance.name}</h2>}
          {!loading && (
            <div className='flex flex-col sm:flex-row sm:gap-8 items-baseline'>
              <p className='dark:text-gray-400'>
                <FontAwesomeIcon icon={faTag} /> {instance.infos.image}
              </p>
              <DroneStatus state={instance.infos.state} />
            </div>
          )}

          <div className='h-px bg-gray-600 mt-7 mb-5' />
          <div className='flex'>
            <Link to={`/instances/${name}`}>
              <span
                className={`dark:text-white border-0 pb-4 mr-4 ${
                  currentRoute.startsWith(name)
                    ? 'font-bold border-b-2 border-solid border-green-500'
                    : ''
                }`}
              >
                Overview
              </span>
            </Link>
            <span className='dark:text-white border-0 pb-4 mx-4'>Addons</span>
            <Link to={`/instances/${name}/console`}>
              <span
                className={`dark:text-white border-0 pb-4 mx-4 ${
                  currentRoute.startsWith('console')
                    ? 'font-bold border-b-2 border-solid border-green-500'
                    : ''
                }`}
              >
                Console
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Routes>
        <Route path='/' element={<Overview />} />
        <Route path='/console' element={<Console />} />
      </Routes>
    </Layout>
  );
}

export default Instance;
