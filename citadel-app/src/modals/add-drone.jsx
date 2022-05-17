import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../components/button';
import useApiAction from '../lib/useApiAction';

function AddDrone({ isOpen, onClose }) {
  const [address, setAddress] = useState('http://localhost:3001');

  const [addDrone, { loading: loadingAdd }] = useApiAction(
    `/servers`,
    'server',
    'POST',
    ({ url }) => {
      return {
        url,
      };
    },
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
            <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded'>
              <Dialog.Title
                as='h3'
                className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
              >
                Add a drone
              </Dialog.Title>
              <div className='mt-2'>
                <p className='text-sm text-gray-400'>
                  Adding a drone will allow you to create new instances. <br />
                  The drone will run the game images, you can add your own drone or use one of the
                  drone of Citadel when creating an instance.
                </p>
                <p className='dark:text-white mt-5'>Drone address</p>
                <input
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                  inputMode='numeric'
                  className='py-2 pl-3 pr-10 bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black w-full'
                />
              </div>
              <div className='mt-6 flex flex-row-reverse'>
                <Button
                  disabled={loadingAdd}
                  loading={loadingAdd}
                  onClick={() => {
                    addDrone({ url: address });
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
