import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/button';
import useApiQuery from '../lib/useApiQuery';
import useApiAction from '../lib/useApiAction';

function CreateInstance({ isOpen, onClose }) {
  const { images } = useApiQuery('/images', 'images');
  const [gameSelected, setGameSelected] = useState();

  if (!gameSelected && images) {
    setGameSelected(images[0]);
  }

  const [createInstance, { loading: loadingCreate }] = useApiAction(
    `/instances`,
    'instance',
    'POST',
    () => ({ image: 'mistertakaashi/citadel-gmod-4000:latest', drone: 'angry beetle' }),
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
                Create an instance
              </Dialog.Title>
              <div className='mt-2'>
                <p className='text-sm text-gray-400'>
                  This wizard will guide you though the creation of an instance. <br />
                  If the game image you try to launch is not listed, please submit an Issue on the{' '}
                  <a
                    href='https://github.com/MisterTakaashi/Citadel/issues'
                    className='text-blue-500'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Citadel Github
                  </a>
                  .
                </p>
              </div>

              <div className='w-full my-5'>
                <p className='dark:text-white'>Select an image</p>
                {gameSelected && (
                  <Listbox value={gameSelected} onChange={setGameSelected}>
                    <div className='relative mt-1'>
                      <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                        <span className='block truncate'>{gameSelected.name}</span>
                        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          <FontAwesomeIcon icon={faAngleDown} />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                          {images &&
                            images.map((image) => (
                              <Listbox.Option
                                key={image.name}
                                className={({ active }) =>
                                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                    active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'
                                  }`
                                }
                                value={image}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {image.name}
                                    </span>
                                    {selected ? (
                                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
                                        <FontAwesomeIcon icon={faCheck} />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                )}
              </div>

              <div className='mt-4'>
                <Button
                  disabled={loadingCreate}
                  loading={loadingCreate}
                  onClick={() => {
                    createInstance();
                  }}
                >
                  Got it !
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

CreateInstance.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

CreateInstance.defaultProps = {
  onClose: () => {},
};

export default CreateInstance;
