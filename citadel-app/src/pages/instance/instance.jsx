import { faTag, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card';
import Layout from '../../components/layout';
import ServerStatus from '../../components/server-status';
import Button from '../../components/button';
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
      <div className='container mx-auto flex items-start'>
        <Card title='Details' className='basis-1/3 mr-5'>
          <div className='flex flex-col'>
            <div className='flex mb-4'>
              <p className='basis-1/3 text-gray-400'>Status</p>
              <div className='basis-2/3'>
                {!loading && (
                  <ServerStatus bullet={false} className='align-center' state={instance.state} />
                )}
              </div>
            </div>
            <div className='flex mb-4'>
              <p className='basis-1/3 text-gray-400'>Image</p>
              <p className='basis-2/3'>{!loading && instance.image}</p>
            </div>
            <div className='flex mb-4'>
              <p className='basis-1/3 text-gray-400'>Drone URL</p>
              <p className='basis-2/3'>
                {!loading && instance.server.url} {/* eslint-disable-next-line no-undef */}
                {window.navigator?.clipboard && (
                  <FontAwesomeIcon
                    icon={faCopy}
                    className='text-gray-500 cursor-pointer'
                    onClick={() => {
                      // eslint-disable-next-line no-undef
                      navigator.clipboard.writeText(instance.server.url);
                    }}
                  />
                )}
              </p>
            </div>
            <div className='flex mb-4'>
              <p className='basis-1/3 text-gray-400'>IP</p>
              <p className='basis-2/3'>
                {!loading && instance.server.url} {/* eslint-disable-next-line no-undef */}
                {window.navigator?.clipboard && (
                  <FontAwesomeIcon
                    icon={faCopy}
                    className='text-gray-500 cursor-pointer'
                    onClick={() => {
                      // eslint-disable-next-line no-undef
                      navigator.clipboard.writeText(instance.server.url);
                    }}
                  />
                )}
              </p>
            </div>
            <div className='flex mt-3'>
              <Button disabled={loading} color='red' className='mr-2'>
                Shut down
              </Button>
              <Button disabled={loading} color='slate' className='mx-2'>
                Destroy
              </Button>
            </div>
          </div>
        </Card>
        <Card title='Details' className='basis-2/3 ml-5' />
      </div>
    </Layout>
  );
}

export default Instance;
