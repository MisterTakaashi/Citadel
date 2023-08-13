import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card';
import useApiQuery from '../../lib/useApiQuery';
import Console from '../../components/console';

function InstanceConsole() {
  const { name } = useParams();

  const {
    logs,
    loading: loadingLogs,
    refetch: refetchLogs,
  } = useApiQuery(`/instances/${name}/logs`, 'logs');

  return (
    <div className='container mx-auto flex items-start gap-10 px-5 sm:px-0'>
      <Card title='Console' className='w-full'>
        {!loadingLogs && <Console logs={logs} refresh={refetchLogs} />}
      </Card>
    </div>
  );
}

export default InstanceConsole;
