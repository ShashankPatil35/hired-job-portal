import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function applyToJob(token,_,jobData){
    const supabase = await supabaseClient(token);

    // uploading resume

    const random = Math.floor (Math.random()*9000);
    const fileName = `resume-${random}-${jobData.candidate_d}`;

    const {error:storageError} = await supabase.storage
    .from("resume")
    .upload(fileName,jobData.resume);



   if(storageError){
    console.log("Error uploading resume: ",storageError);
    return null;
   }


    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const {data,error} = await supabase.from("application").insert([
        {
            ...jobData,
            resume,
        },
    ])
    .select();

    if(error){
        console.log("Error submitting Application ",error);
        return null;
    }
    return data;
}
export async function updateApplicationStatus(token,{job_id,status}){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase
    .from("applications")
    .update({status})
    .eq("job_id",job_id)
    .select()

    if(error || data.length===0){
        console.log("Error Updating applications status ",error);
        return null;
    }
    return data;
}

export async function getApplications(token,{user_id}){
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase
    .from("application")
    .select("*,job:jobs(title,company:companies(name))")
    .eq("candidate_id",user_id);

    if(error ){
        console.log("Error Fetching applications ",error);
        return null;
    }
    return data;
}
