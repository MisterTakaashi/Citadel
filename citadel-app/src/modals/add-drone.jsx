import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import Button from '../components/button';
import CodeSnippet from '../components/code-snippet';
import useApiAction from '../lib/useApiAction';
import CodeSnippetCopyline from '../components/code-snippet-copyline';

function AddDrone(
  { isOpen, onClose } = {
    onClose: () => {},
  }
) {
  const [token, setToken] = useState();
  const droneOses = [
    {
      displayName: 'Linux',
      disabled: false,
      name: 'linux',
      icon: faLinux,
      instructions: (
        <div>
          <p className='text-zinc-400 px-2'># Download the latest Drone runner</p>
          <CodeSnippetCopyline text='curl -o citadel-drone -L https://github.com/MisterTakaashi/Citadel/releases/download/latest/citadel-drone' />
          <p className='text-zinc-400 px-2'># Run the drone with the Hive URL and the Token</p>
          <CodeSnippetCopyline
            text={`./citadel-drone --host https://citadelnest.org --token ${token}`}
          />
        </div>
      ),
    },
    {
      displayName: 'macOS',
      disabled: true,
      name: 'macos',
      icon: faApple,
    },
    {
      displayName: 'Windows',
      disabled: true,
      name: 'windows',
      icon: faWindows,
    },
  ];

  const didAddDrone = useRef(false);

  const [droneOs, setDroneOs] = useState('linux');
  const [addDrone, { loading: loadingAdd }] = useApiAction(
    `/drones`,
    'drone',
    'POST',
    () => ({}),
    (_, { token: newToken }) => {
      setToken(newToken);
    }
  );

  useEffect(() => {
    if (!isOpen || didAddDrone.current) return;

    didAddDrone.current = true;
    addDrone();
  }, [isOpen, addDrone]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={onClose}>
        <div className='min-h-screen px-4 text-center'>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded'>
              <Dialog.Title
                as='h3'
                className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
              >
                Add a drone
              </Dialog.Title>
              <div className='mt-2 flex flex-col gap-3'>
                <p className='text-sm text-gray-400'>
                  Adding a self hosted drone will allow you to create new instances. <br />
                  The drones will be used to run the game images on you instances. You can use your
                  own self hosted drones or one of the Citadel&apos;s hosted drones when creating an
                  instance.
                </p>
                <RadioGroup value={droneOs} onChange={setDroneOs} className='flex flex-col'>
                  <RadioGroup.Label className='dark:text-white'>Drone runner</RadioGroup.Label>
                  <div className='flex gap-2'>
                    {droneOses.map((possibleOs) => (
                      <RadioGroup.Option
                        key={possibleOs.name}
                        disabled={possibleOs.disabled}
                        value={possibleOs.name}
                        className={`flex-1 rounded p-3 dark:text-white cursor-pointer ${
                          possibleOs.disabled ? 'bg-gray-500/[.2] cursor-not-allowed' : ''
                        } ${
                          droneOs === possibleOs.name
                            ? 'border-2 border-blue-500'
                            : 'border border-gray-600'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={possibleOs.icon}
                          size='lg'
                          className='text-gray-500'
                        />{' '}
                        {possibleOs.displayName}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                <CodeSnippet>
                  {droneOses.find((possibleOs) => possibleOs.name === droneOs).instructions}
                </CodeSnippet>
                <p className='text-xs dark:text-white'>
                  Once the drone connects to the hive, you will be able to see it on the dashboard
                  after refreshing.
                </p>
              </div>
              <div className='mt-6 flex flex-row-reverse'>
                <Button disabled={loadingAdd} loading={loadingAdd} onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

AddDrone.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default AddDrone;
