import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout';
import ServerStatus from '../../components/server-status';
import useApiQuery from '../../lib/useApiQuery';

function Instance() {
  const { name } = useParams();
  const { instance, loading } = useApiQuery(`/instances/${name}`, 'instance');

  return (
    <Layout>
      <div className='dark:bg-gray-800'>
        <div className='container mx-auto mb-10 pt-5'>
          {!loading && <h2 className='text-white text-3xl font-bold mb-3'>{instance.name}</h2>}
          {!loading && (
            <div className='flex items-baseline'>
              <p className='dark:text-gray-400'>
                <FontAwesomeIcon icon={faTag} /> {instance.image}
              </p>
              <ServerStatus state={instance.state} className='mx-6' />
            </div>
          )}

          <div className='h-px bg-gray-600 mt-7 mb-5' />
          <div className='flex'>
            <span className='dark:text-white font-bold border-0 border-b-2 border-solid border-green-500 pb-4 mr-4'>
              Overview
            </span>
            <span className='dark:text-white border-0 pb-4 mx-4'>Addons</span>
            <span className='dark:text-white border-0 pb-4 mx-4'>Console</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Instance;
