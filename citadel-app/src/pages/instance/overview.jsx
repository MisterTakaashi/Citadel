import React from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import Card from '../../components/card';
import Button from '../../components/button';
import ServerStatus from '../../components/server-status';
import useApiQuery from '../../lib/useApiQuery';
import useApiAction from '../../lib/useApiAction';
import Console from '../../components/console';

function InstanceOverview() {
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
  const [startServer] = useApiAction(`/instances/${name}/start`, 'instance', null, () =>
    refetchInstance()
  );
  const [stopServer] = useApiAction(`/instances/${name}/stop`, 'instance', null, () =>
    refetchInstance()
  );

  return (
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
        {!loadingLogs && <Console logs={logs} />}
      </Card>
    </div>
  );
}

export default InstanceOverview;
