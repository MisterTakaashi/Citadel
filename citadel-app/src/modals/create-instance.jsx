import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import mapKeys from 'lodash/mapKeys';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCaretDown, faCaretRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/button';
import useApiQuery from '../lib/useApiQuery';
import useApiAction from '../lib/useApiAction';

function CreateInstance({ isOpen, onClose }) {
  const { images } = useApiQuery('/images', 'images');
  const { servers } = useApiQuery('/servers', 'servers');
  const { image: imageConfig, refetch: refetchConfig } = useApiQuery('/images', 'image');
  const [serverSelected, setServerSelected] = useState();
  const [gameSelected, setGameSelected] = useState();
  const [portsBinding, setPortsBinding] = useState({});
  const [volumesBinding, setVolumesBinding] = useState([]);
  const [envVars, setEnvVars] = useState({});

  if (!gameSelected && images) {
    setGameSelected(images[0]);
  }
  if (!serverSelected && servers && servers.length > 0) {
    setServerSelected(servers[0]);
  }
  if (Object.keys(portsBinding).length === 0 && imageConfig) {
    setPortsBinding(
      imageConfig.ports.reduce(
        (acc, port) => ({ ...acc, [port]: port.replace(/\/(udp)?(tcp)?/, '') }),
        {}
      )
    );
  }
  if (volumesBinding.length === 0 && imageConfig) {
    setVolumesBinding(
      imageConfig.persistences.map((persistence) => ({
        to: persistence.name,
        from: '',
        file: persistence.type.includes('file'),
      }))
    );
  }

  const [createInstance, { loading: loadingCreate }] = useApiAction(
    `/instances`,
    'instance',
    'POST',
    ({ image, portsMapping }) => {
      return {
        image,
        drone: serverSelected.name,
        config: {
          portsMapping,
          volumes: volumesBinding,
          environmentVariables: envVars,
        },
      };
    },
    () => onClose()
  );

  useEffect(() => {
    if (gameSelected) {
      refetchConfig(`/images/${gameSelected.slug}`);
    }
  }, [gameSelected, refetchConfig]);

  useEffect(() => {
    setPortsBinding({});
    setVolumesBinding([]);
    setEnvVars({});
  }, [imageConfig]);

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
                <p className='dark:text-white'>Select a drone</p>
                {serverSelected && (
                  <Listbox value={serverSelected} onChange={setServerSelected}>
                    <div className='z-40 relative mt-1'>
                      <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                        <span className='block truncate'>
                          {serverSelected.name
                            .split(' ')
                            .map((namePart) => capitalize(namePart))
                            .join(' ')}
                        </span>
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
                          {servers &&
                            servers.map((server) => (
                              <Listbox.Option
                                key={server.name}
                                className={({ active }) =>
                                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                    active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'
                                  }`
                                }
                                value={server}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {server.name
                                        .split(' ')
                                        .map((namePart) => capitalize(namePart))
                                        .join(' ')}
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
                <p className='dark:text-white mt-5'>Select an image</p>
                {gameSelected && (
                  <Listbox value={gameSelected} onChange={setGameSelected}>
                    <div className='relative mt-1'>
                      <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
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
                <p className='dark:text-white mt-5'>Mapped ports</p>
                {portsBinding &&
                  Object.entries(portsBinding).map(([imagePort, hostPort]) => (
                    <div
                      className='text-gray-400 flex items-center justify-between'
                      key={`${gameSelected.name}-${imagePort}`}
                    >
                      <span>{imagePort}</span>
                      <FontAwesomeIcon icon={faCaretRight} />
                      <input
                        value={hostPort}
                        onChange={(event) => {
                          if (event.target.value.length > 0 && !/^\d+$/.test(event.target.value))
                            return;

                          const bindingCopy = { ...portsBinding };
                          bindingCopy[imagePort] = event.target.value;
                          setPortsBinding(bindingCopy);
                        }}
                        inputMode='numeric'
                        className='py-2 pl-3 pr-10 bg-white rounded shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black'
                      />
                    </div>
                  ))}
                <p className='dark:text-white mt-5'>Persisted volumes</p>
                <div className='flex flex-col gap-4'>
                  {volumesBinding &&
                    volumesBinding.map((volume, volumeIndex) => (
                      <div
                        className='text-gray-400 flex flex-col'
                        key={`${gameSelected.name}-${volume.to}`}
                      >
                        <div className='flex items-center'>
                          <input
                            value={volume.to}
                            className='py-2 pl-3 pr-10 grow bg-white rounded shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black disabled:bg-gray-400 disabled:cursor-not-allowed'
                            disabled
                          />
                        </div>
                        <div className='flex gap-4 items-center mx-auto my-1'>
                          <FontAwesomeIcon icon={faCaretDown} />
                          <p className='text-sm'>mapped to</p>
                          <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                        <input
                          value={volume.from}
                          onChange={(event) => {
                            const bindingCopy = [...volumesBinding];
                            bindingCopy[volumeIndex].from = event.target.value;
                            setVolumesBinding(bindingCopy);
                          }}
                          className='py-2 pl-3 pr-10 bg-white rounded cursor-text shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black disabled:bg-gray-400 disabled:cursor-not-allowed'
                        />
                      </div>
                    ))}
                </div>
                <p className='dark:text-white mt-5'>Environment variables</p>
                {Object.entries(envVars).map(([envVarName, envVar], index) => (
                  <div
                    className={`flex items-center gap-4 ${index > 0 ? 'mt-3' : ''}`}
                    // eslint-disable-next-line
                    key={`${gameSelected.name}-${index}`}
                  >
                    <div className='basis-1/2'>
                      <input
                        value={envVarName}
                        onChange={(event) => {
                          const envVarsCopy = { ...envVars };

                          setEnvVars(
                            mapKeys(envVarsCopy, (_, key) =>
                              key === envVarName ? event.target.value : key
                            )
                          );
                        }}
                        className='py-2 pl-3 pr-10 bg-white rounded shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black w-full'
                      />
                    </div>
                    <FontAwesomeIcon icon={faCaretRight} className='text-gray-400' />
                    <div className='basis-1/2'>
                      <input
                        value={envVar}
                        onChange={(event) => {
                          const envVarsCopy = { ...envVars };
                          envVarsCopy[envVarName] = event.target.value;

                          setEnvVars(envVarsCopy);
                        }}
                        className='py-2 pl-3 pr-10 bg-white rounded shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-blue-400 focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-black w-full'
                      />
                    </div>
                  </div>
                ))}
                <div className='flex'>
                  <Button
                    size='sm'
                    className={`grow ${Object.keys(envVars).length > 0 ? 'mt-3' : ''}`}
                    color='green'
                    onClick={() => {
                      setEnvVars({ ...envVars, [`ENV_${Object.keys(envVars).length}`]: '' });
                    }}
                  >
                    Add environment variable
                  </Button>
                </div>
              </div>

              <div className='mt-6 flex flex-row-reverse'>
                <Button
                  disabled={loadingCreate}
                  loading={loadingCreate}
                  onClick={() => {
                    createInstance({ image: gameSelected.slug, portsMapping: portsBinding });
                  }}
                >
                  Create the instance
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
