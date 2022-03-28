import { faTag, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card';
import Layout from '../../components/layout';
import ServerStatus from '../../components/server-status';
import Button from '../../components/button';
import useApiQuery from '../../lib/useApiQuery';
import useApiAction from '../../lib/useApiAction';

function Instance() {
  const { name } = useParams();

  const {
    instance,
    loading,
    refetch: refetchInstance,
  } = useApiQuery(`/instances/${name}`, 'instance');
  const { response: logs, loading: loadingLogs } = useApiQuery(
    `/instances/${name}/logs`,
    'response'
  );
  const [startServer] = useApiAction(`/instances/${name}/start`, 'instance', () =>
    refetchInstance()
  );
  const [stopServer] = useApiAction(`/instances/${name}/stop`, 'instance', () => refetchInstance());

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
      <div className='container mx-auto flex items-start gap-10'>
        <Card title='Details' className='basis-1/3'>
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
                {!loading && instance.server.publicIp} {/* eslint-disable-next-line no-undef */}
                {window.navigator?.clipboard && (
                  <FontAwesomeIcon
                    icon={faCopy}
                    className='text-gray-500 cursor-pointer'
                    onClick={() => {
                      // eslint-disable-next-line no-undef
                      navigator.clipboard.writeText(instance.server.publicIp);
                    }}
                  />
                )}
              </p>
            </div>
            <div className='flex mt-3'>
              {!loading && (instance.state === 'exited' || instance.state === 'created') && (
                <Button
                  disabled={loading}
                  color='green'
                  className='mr-2'
                  onClick={() => {
                    startServer();
                  }}
                >
                  Start instance
                </Button>
              )}
              {!loading && instance.state === 'running' && (
                <Button
                  disabled={loading}
                  color='red'
                  className='mr-2'
                  onClick={() => {
                    stopServer();
                  }}
                >
                  Shut down
                </Button>
              )}
              <Button disabled={loading} color='slate' className='mx-2'>
                Destroy
              </Button>
            </div>
          </div>
        </Card>
        <Card title='Console' className='basis-2/3'>
          <div className='font-mono tracking-tight leading-5 bg-slate-700 rounded px-5 py-3 max-h-[32rem] overflow-y-auto'>
            {!loadingLogs &&
              logs.map((log) => (
                <p className={`mb-2 break-all ${log.charAt(0) === '\u0065' ? 'text-red-500' : ''}`}>
                  {log.substring('1')}
                </p>
              ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Instance;
