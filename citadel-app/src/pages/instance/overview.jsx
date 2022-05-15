import React from 'react';
import { faCaretRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import Button from '../../components/button';
import ServerStatus from '../../components/server-status';
import useApiQuery from '../../lib/useApiQuery';
import useApiAction from '../../lib/useApiAction';
import Console from '../../components/console';

function InstanceOverview() {
  const { name } = useParams();
  const navigate = useNavigate();

  const {
    instance,
    loading,
    refetch: refetchInstance,
  } = useApiQuery(`/instances/${name}`, 'instance');
  const {
    response: logs,
    loading: loadingLogs,
    refetch: refetchLogs,
  } = useApiQuery(`/instances/${name}/logs`, 'response');
  const [startServer, { loading: loadingStart }] = useApiAction(
    `/instances/${name}/start`,
    'instance',
    'POST',
    null,
    () => refetchInstance()
  );
  const [stopServer, { loading: loadingStop }] = useApiAction(
    `/instances/${name}/stop`,
    'instance',
    'POST',
    null,
    () => refetchInstance()
  );
  const [destroyServer] = useApiAction(`/instances/${name}`, 'instance', 'DELETE', null, () =>
    navigate('/')
  );

  return (
    <div className='container mx-auto flex flex-col lg:flex-row items-start gap-10 px-5 md:px-0'>
      <Card title='Details' className='w-full md:basis-1/3'>
        <div className='flex flex-col'>
          <div className='flex flex-col sm:flex-row mb-4'>
            <p className='basis-1/3 text-gray-400'>Status</p>
            <div className='basis-2/3'>
              {!loading && (
                <ServerStatus bullet={false} className='align-center' state={instance.state} />
              )}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row mb-4'>
            <p className='basis-1/3 text-gray-400'>Image</p>
            <p className='basis-2/3'>{!loading && instance.image}</p>
          </div>
          <div className='flex flex-col sm:flex-row mb-4'>
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
          <div className='flex flex-col sm:flex-row mb-4'>
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
          <div className='flex flex-col sm:flex-row flex-col mb-4'>
            <p className='basis-1/3 text-gray-400'>Ports Mapping</p>
            {!loading &&
              Object.entries(instance.portsMapping).map((ports) => (
                <div className='basis-2/3 flex items-center gap-4' key={`${ports}`}>
                  <p>{ports[0]}</p>
                  <FontAwesomeIcon icon={faCaretRight} />
                  <p>{ports[1]}</p>
                </div>
              ))}
            {!loading && instance.state !== 'running' && (
              <p className='text-orange-400 text-sm'>
                The instance must be running to retrieve ports mapping
              </p>
            )}
          </div>
          <div className='flex mt-3'>
            {!loading && (instance.state === 'exited' || instance.state === 'created') && (
              <Button
                disabled={loading || loadingStop || loadingStart}
                color='green'
                className='mr-2'
                onClick={() => {
                  startServer();
                }}
                loading={loadingStart}
              >
                Start instance
              </Button>
            )}
            {!loading && instance.state === 'running' && (
              <Button
                disabled={loading || loadingStop || loadingStart}
                color='red'
                className='mr-2'
                onClick={() => {
                  stopServer();
                }}
                loading={loadingStop}
              >
                Shut down
              </Button>
            )}
            <Button
              disabled={loading || loadingStop || loadingStart}
              color='slate'
              className='mx-2'
              onClick={() => {
                destroyServer();
              }}
            >
              Destroy
            </Button>
          </div>
        </div>
      </Card>
      <Card title='Console' className='w-full md:basis-2/3'>
        {!loadingLogs && <Console logs={logs} refresh={refetchLogs} />}
      </Card>
    </div>
  );
}

export default InstanceOverview;
