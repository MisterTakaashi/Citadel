import React, { useState } from 'react';
import capitalize from 'lodash/capitalize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CreateInstanceModal from '../../modals/create-instance';
import AddDroneModal from '../../modals/add-drone';
import Layout from '../../components/layout';
import Button from '../../components/button';
import Card from '../../components/card';
import useApiQuery from '../../lib/useApiQuery';
import useApiAction from '../../lib/useApiAction';
import ServerStatus from '../../components/server-status';

function Dashboard() {
  const { instances, refetch } = useApiQuery('/instances', 'instances');
  const { servers, refetch: refetchServers } = useApiQuery('/servers', 'servers');

  const [startInstance, { loading: startLoading }] = useApiAction(
    (instanceName) => `/instances/${instanceName}/start`,
    'instances',
    'POST',
    null,
    () => refetch()
  );
  const [stopInstance, { loading: stopLoading }] = useApiAction(
    (instanceName) => `/instances/${instanceName}/stop`,
    'instances',
    'POST',
    null,
    () => refetch()
  );

  const generateColor = (index) => {
    const colors = ['purple', 'sky'];
    const emojis = ['🪣🎮🔫', '🔧🤖🚀'];

    return [colors[index], emojis[index]];
  };

  const [isCreateInstanceModalOpen, setIsCreateInstanceModalOpen] = useState(false);
  const [isAddDroneModalOpen, setIsAddDroneModalOpen] = useState(false);
  function closeCreateInstanceModal() {
    setIsCreateInstanceModalOpen(false);
    refetch();
  }

  function closeAddDroneModal() {
    setIsAddDroneModalOpen(false);
    refetchServers();
  }

  function openCreateInstanceModal() {
    setIsCreateInstanceModalOpen(true);
  }

  function openAddDroneModal() {
    setIsAddDroneModalOpen(true);
  }

  return (
    <>
      {isCreateInstanceModalOpen && (
        <CreateInstanceModal
          isOpen={isCreateInstanceModalOpen}
          onClose={() => closeCreateInstanceModal()}
        />
      )}
      {isAddDroneModalOpen && (
        <AddDroneModal isOpen={isAddDroneModalOpen} onClose={() => closeAddDroneModal()} />
      )}
      <Layout>
        <div className='container mx-auto mb-10 flex flex-col md:flex-row items-start gap-5 px-5 md:px-0'>
          <div className='w-full md:basis-3/4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-3xl font-bold my-5'>My Instances</h2>
              <Button
                color='green'
                size='sm'
                className='my-3 mr-3 px-4'
                disabled={startLoading || stopLoading}
                loading={startLoading}
                onClick={() => {
                  openCreateInstanceModal();
                }}
              >
                <span className='hidden sm:block'>Create instance</span>
                <span className='block sm:hidden'>+</span>
              </Button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                      <p className='text-xl font-bold truncate'>
                        {instance.name.replace(/\//g, '')}
                      </p>
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
                          disabled={startLoading || stopLoading}
                          loading={startLoading}
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
                          disabled={stopLoading || stopLoading}
                          loading={stopLoading}
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
          <Card title='Drones' className='w-full md:basis-1/4 mt-5'>
            {servers &&
              servers.length > 1 &&
              servers
                .filter((server) => server.selfHosted)
                .map((server) => (
                  <div
                    className='flex flex-row md:flex-col xl:flex-row justify-between items-center sm:items-start xl:items-center'
                    key={server.name}
                  >
                    <div>
                      <p>
                        {server.name
                          .split(' ')
                          .map((namePart) => capitalize(namePart))
                          .join(' ')}
                      </p>
                      <p className='text-sm text-gray-400'>{server.url}</p>
                    </div>
                    <ServerStatus background bullet state='running' size='sm' />
                  </div>
                ))}
            <p className='text-gray-400'>
              You don&apos;t have any self-hosted drone, you will only be able to launch instances
              via public drones
            </p>
            <Button
              size='sm'
              color='green'
              className='mt-3 w-full'
              onClick={() => openAddDroneModal()}
            >
              Add a server as drone
            </Button>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default Dashboard;
