import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector((store) => store.job);
    return (
        <div className='py-16 bg-gray-50'>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8'>
                    <span className='text-blue-600'>Latest & Top Jobs</span>
                </h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        allJobs.length <= 0 ? (
                            <span className='text-center text-gray-500 col-span-full'>There are currently no jobs available.</span>
                        ) : (
                            allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default LatestJobs;
