import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import capitalize from 'lodash/capitalize';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/layout';
import Button from '../../components/button';
import useApiQuery from '../../lib/useApiQuery';

function Dashboard() {
  const { instances } = useApiQuery('/instances', 'instances');

  const generateColor = (index) => {
    const colors = ['purple', 'sky'];
    const emojis = ['🎮', '🎲'];

    return [colors[index], emojis[index]];
  };

  return (
    <Layout>
      <div className='container mx-auto mb-10'>
        <h2 className='text-white text-3xl font-bold my-5'>My Instances</h2>
        <div className='grid grid-cols-4 gap-4'>
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
                  <p
                    className={`text-xs rounded ${
                      instance.state === 'created' ? 'bg-green-600' : ''
                    } p-1`}
                  >
                    {capitalize(instance.state)}
                  </p>
                </div>

                <p className='dark:text-gray-400 px-3 pb-3'>
                  <FontAwesomeIcon icon={faTag} /> {instance.image}
                </p>

                <div className='mx-3'>
                  <div className='h-px bg-gray-600' />
                  <Button color='red' size='sm' className='my-3 mr-3 px-4'>
                    Shut down
                  </Button>
                  <Button color='gray' size='sm' className='my-3 px-4'>
                    Manage
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
