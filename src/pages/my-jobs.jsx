import CreatedApplications from '@/components/ui/created-application';
import CreatedJobs from '@/components/ui/created-jobs';
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { BarLoader } from 'react-spinners';


function MyJobs() {
  const {user, isLoaded} = useUser();

  if(!isLoaded){

  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        {user?.unsafeMetadata?.role === "candidate"
        ? "My Applications"
        : "My Jobs"
        }
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  )
};

export default MyJobs;
