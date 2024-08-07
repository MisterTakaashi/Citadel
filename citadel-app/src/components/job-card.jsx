import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faGear,
  faHourglass,
  faInbox,
  faServer,
  faSquare,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { DroneType } from './drone-status';

const stateColors = Object.freeze({
  created: { color: 'text-blue-600', icon: faInbox },
  delivered: { color: 'text-blue-600', icon: faGear, spin: true },
  done: { color: 'text-green-600', icon: faCheck },
  failed: { color: 'text-red-600', icon: faXmark },
});

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
}

function JobCard({ job }) {
  return (
    <div className='bg-gray-700 border-gray-600 border-2 rounded'>
      <div className='flex items-center gap-1 p-2'>
        <span className='fa-layers fa-fw fa-2xl'>
          <FontAwesomeIcon icon={faSquare} className={`px-1 ${stateColors[job.status]?.color}`} />
          <FontAwesomeIcon
            icon={stateColors[job.status]?.icon}
            className='px-1 text-lg'
            spin={stateColors[job.status]?.spin}
          />
        </span>
        <div className='flex flex-col'>
          <span>{job.jobType}</span>
          <Link className='text-gray-300 text-xs' to={`/instances/${job.parameters?.instance}`}>
            {job.parameters?.instance}
          </Link>
        </div>
      </div>
      <div className='flex gap-1 px-2 border-gray-600 border-t-2 py-0.5'>
        <span className='text-xs bg-slate-900 p-1'>
          <FontAwesomeIcon icon={faServer} className='px-1' />
          {job.drone.name}
        </span>

        <span className='text-xs bg-slate-900 p-1' title={job.createdAt}>
          <FontAwesomeIcon icon={faHourglass} className='px-1' />
          {timeSince(new Date(job.createdAt))}
        </span>
      </div>
    </div>
  );
}

const JobType = PropTypes.shape({
  _id: PropTypes.string,
  drone: DroneType.isRequired,
  jobType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  parameters: PropTypes.any,
  reason: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

JobCard.propTypes = {
  job: JobType.isRequired,
};

export default JobCard;
export { JobType };
