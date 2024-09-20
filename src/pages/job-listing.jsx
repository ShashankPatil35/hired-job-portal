import { getJobs } from '@/api/ApiJobs';
// import { getJobs } from '@/api/ApiJobs';
import useFetch from '@/hooks/use-fetch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarLoader } from 'react-spinners';
import { useSession, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import JobCard from '@/components/job-card';
import { getCompanies } from '@/api/apiCompanies';
import { Select,SelectContent,SelectTrigger,SelectValue,SelectGroup,SelectItem } from '@/components/ui/select';
import { State } from 'country-state-city';


function JobListing() {

    const [searchQuery,setSearchQuery] = useState("");
    const [location,setLocation] = useState("");
    const [company_id,setCompany_id] = useState("");  

    const {isLoaded} = useUser();


  const {
    fn:fnJobs,
    data:jobs,
    loading:loadingJobs,
  } = useFetch(getJobs,{
    location,
    company_id,
    searchQuery, 
  });
  console.log("jobs "+jobs);
  
  const {
    fn:fnCompanies,
    data:companies,
  } = useFetch(getCompanies);


 useEffect(()=>{

  if(isLoaded) fnCompanies();
  },[isLoaded]);

  useEffect(()=>{

    if(isLoaded) fnJobs();
  },[isLoaded, location, company_id, searchQuery,]);

  const handleSearch=(e)=>{
      e.preventDefault();
      let formData = new FormData(e.target);
      const query = formData.get("search-query");
      if(query) setSearchQuery(query);
  };

  const clearFilters = () =>{
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }


  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>


    {/* filters here */}
      <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input
        type="text"
        placeholder="Search Jobs by title"
        name="search-query"
        className="h-full flex-1 px-4 text-md"
        />
        <Button type='submit' className='h-full sm:w-28' variant="blue">
        Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company.." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name,id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

{loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  )
};
export default JobListing;




//...............................

// import React, { useEffect } from 'react';
// import { useSession } from '@clerk/clerk-react';

// function JobListing() {
//   const { session, isLoaded } = useSession();

//   const fetchJobs = async () => {
//     if (!session) {
//       console.error("Session is undefined. Cannot get the token.");
//       return;
//     }

//     try {
//       // Attempt to get the token using the provided template
//       const supabaseAccessToken = await session.getToken({ template: "supabase" });

//       if (!supabaseAccessToken) {
//         console.error("No token available");
//         return;
//       }

//       const data = await getJobs(supabaseAccessToken);
//       console.log("Data received in fetchJobs:", data); // Console to check if data is received
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

//   useEffect(() => {
//     if (isLoaded && session) {
//       fetchJobs();
//     }
//   }, [session, isLoaded]);

//   return (
//     <div>
//       {/* Your component code */}
//     </div>
//   );
// }

// export default JobListing;
