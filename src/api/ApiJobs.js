import supabaseClient from "@/utils/supabase";


export async function getJobs(token, { location, company_id, searchQuery }) {
    
    const supabase = supabaseClient(token);
    // console.log("getJobs function called");
    let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");
 
    if (location) {
        query = query.eq("location", location);
    }
    if (company_id) {
        query = query.eq("company_id", company_id);
    }
    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }
    console.log("query "+query);
    // Execute the query and destructure the response
    const { data, error } = await query;
    console.log("Jobs fetched-> ", data);

    if (error) {
        console.error("Error fetching jobs:", error);
        return null;
    } 
    
    return data ;
}


export async function saveJob(token,{alreadySaved},saveData) {
    
    const supabase = supabaseClient(token);
   
    if(alreadySaved){
        const { data, error:deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id",saveData.job_id);
      
        if (deleteError) {
            console.error("Error Deleting saved Jobs:", deleteError);
            return null;
        } 
        return data;
    }
    else{
        const { data, error:insertError } = await supabase
        .from("saved_jobs")
        .insert([saveData])
        .select()
        if(insertError){
            console.log("Error fetching jobs:",insertError);
            return null;
        }
        return data ;
    }
}


export async function getSingleJob(token,{job_id}){
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .select(
        "*,company: companies(name,logo_url),applications:application(*)"
    )
    .eq("id",job_id)
    .single();

    if(error){
        console.log("Error fetching Job ",error);
        return null;
    }
    return data;
}


export async function updateHiringStatus(token,{job_id},isOpen){
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .update({isOpen})
    .eq("id",job_id)
    .select();

    if(error){
        console.log("Error updating job ",error);
        return null;
    }
    return data;
}


export async function addNewJob(token, _,jobData) {
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .insert([jobData])
    .select()

    if(error){
        console.log("Error Creating job ",error);
        return null;
    }
    return data;
}

export async function getSavedJobs(token) {
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("saved_jobs")
    .select("*,job:jobs(*, company:companies(name,logo_url))");

    if(error){
        console.log("Error Fetching Saved Jobs ", error);
        return null;
    }
    return data;
}

export async function getMyJobs(token, {recruiter_id}) {
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url)")
    .eq("recruiter_id",recruiter_id);

    if(error){
        console.log("Error Fetching Jobs ", error);
        return null;
    }
    return data;
}

export async function deleteJobs(token, {job_id}) {
    const supabase = await supabaseClient(token);

    const {data,error} = await supabase
    .from("jobs")
    .delete()
    .eq("id",job_id)
    .select();

    if(error){
        console.log("Error Deleting Jobs ", error);
        return null;
    }
    return data;
}