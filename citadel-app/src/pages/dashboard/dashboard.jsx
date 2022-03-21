import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout';
import Button from '../../components/button';
import Card from '../../components/card';
import useApiQuery from '../../lib/useApiQuery';
import useApiAction from '../../lib/useApiAction';
import ServerStatus from '../../components/server-status';

function Dashboard() {
  const { instances, refetch } = useApiQuery('/instances', 'instances');
  const { servers } = useApiQuery('/servers', 'servers');

  const [startInstance, { loading: startLoading }] = useApiAction(
    (instanceName) => `/instances/${instanceName}/start`,
    'instances',
    () => refetch()
  );
  const [stopInstance, { loading: stopLoading }] = useApiAction(
    (instanceName) => `/instances/${instanceName}/stop`,
    'instances',
    () => refetch()
  );

  const generateColor = (index) => {
    const colors = ['purple', 'sky'];
    const emojis = ['🪣🎮🔫', '🔧🤖🚀'];

    return [colors[index], emojis[index]];
  };

  return (
    <Layout>
      <div className='container mx-auto mb-10 flex items-start gap-5'>
        <div className='basis-3/4'>
          <h2 className='text-white text-3xl font-bold my-5'>My Instances</h2>
          <div className='grid grid-cols-4 sm:grid-cols-2 gap-4'>
            {instances &&
              instances.map((instance, index) => (
                <div key={instance.name} className='dark:bg-gray-800 dark:text-white rounded'>
                  <div
                    className={`h-40 bg-${
                      generateColor(index)[0]
                    }-600 flex items-center justify-center rounded`}
                  >
                    <span className='text-3xl'>{generateColor(index)[1]}</span>
                  </div>
                  <div className='flex justify-between items-center m-3 mb-0'>
                    <p className='text-xl font-bold truncate'>{instance.name.replace(/\//g, '')}</p>
                    <ServerStatus state={instance.state} background size='xs' />
                  </div>

                  <p className='dark:text-gray-400 px-3 pb-3'>
                    <FontAwesomeIcon icon={faTag} /> {instance.image}
                  </p>

                  <div className='mx-3'>
                    <div className='h-px bg-gray-600' />
                    {(instance.state === 'exited' || instance.state === 'created') && (
                      <Button
                        color='green'
                        size='sm'
                        className='my-3 mr-3 px-4'
                        disabled={startLoading}
                        onClick={() => {
                          startInstance(instance.name);
                        }}
                      >
                        Start instance
                      </Button>
                    )}
                    {instance.state === 'running' && (
                      <Button
                        color='red'
                        size='sm'
                        className='my-3 mr-3 px-4'
                        disabled={stopLoading}
                        onClick={() => {
                          stopInstance(instance.name);
                        }}
                      >
                        Shut down
                      </Button>
                    )}
                    <Link to={`/instances/${instance.name}`}>
                      <Button color='slate' size='sm' className='my-3 px-4'>
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Card title='Drones' className='basis-1/4 mt-5'>
          {servers && servers.map((server) => server.url)}
        </Card>
      </div>
    </Layout>
  );
}

export default Dashboard;
