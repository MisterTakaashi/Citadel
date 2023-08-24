import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import Button from '../components/button';
import useApiAction from '../lib/useApiAction';

function AddDrone({ isOpen, onClose }) {
  const droneOses = [
    { displayName: 'Linux', name: 'linux', icon: faLinux },
    { displayName: 'macOS', name: 'macos', icon: faApple },
    { displayName: 'Windows', name: 'windows', icon: faWindows },
  ];

  const [droneOs, setDroneOs] = useState('linux');
  const [addDrone, { loading: loadingAdd }] = useApiAction(
    `/drones`,
    'drone',
    'POST',
    () => ({}),
    () => onClose()
  );

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
              <div className='mt-2'>
                <p className='text-sm text-gray-400'>
                  Adding a self hosted drone will allow you to create new instances. <br />
                  The drones will be used to run the game images on you instances. You can use your
                  own self hosted drones or one of the Citadel&apos;s hosted drones when creating an
                  instance.
                </p>
                <RadioGroup value={droneOs} onChange={setDroneOs} className='flex flex-col'>
                  <RadioGroup.Label className='dark:text-white mt-5'>Drone runner</RadioGroup.Label>
                  <div className='flex gap-2'>
                    {droneOses.map((possibleOs) => (
                      <RadioGroup.Option
                        key={possibleOs.name}
                        value={possibleOs.name}
                        className={`flex-1 rounded p-3 dark:text-white cursor-pointer ${
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
              </div>
              <div className='mt-6 flex flex-row-reverse'>
                <Button
                  disabled={loadingAdd}
                  loading={loadingAdd}
                  onClick={() => {
                    addDrone();
                  }}
                >
                  Add the drone
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

AddDrone.defaultProps = {
  onClose: () => {},
};

export default AddDrone;
