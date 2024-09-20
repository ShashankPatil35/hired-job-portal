import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './button';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox, User } from 'lucide-react';
import { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';


function Header() {

  const [ShowSignIn, setShowSignIn] = useState(false);

  const [search,setSearch] = useSearchParams();

  useEffect(()=>{
    if(search.get("sign-in")){
      setShowSignIn(true);
    }
  },[search]); 

  const handleOverlayClick=(e)=>{
    if(e.target === e.currentTarget){
      setShowSignIn(false);
      setSearch({});
    }
  };

  return <>
  <nav className='py-4 flex justify-between items-center'>
    <Link>
    <img src="/logo.png" className='h-20'/>
    </Link>

    {/* <Button className='outline' >Login</Button> */}
    <div className='flex gap-8'>
    <SignedOut>
      <Button variant="outline" onClick={()=>setShowSignIn(true)}>Login</Button>
    </SignedOut>
    <SignedIn>
      {/* add a condn here */}
        <Link to="/post-job">
          <Button variant='destructive' className='rounded-full'>
            <PenBox size={20} className='mr-2'/>
            Post a Job
          </Button>
        </Link>
        <UserButton
        appearance={{
          elements:{
            avatarBox:"w-10 h-10"
          },
        }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
            label="My Jobs"
            labelIcon={<BriefcaseBusiness size={15}/>}
            href="/my-jobs"
            />
             <UserButton.Link
            label="Saved Jobs"
            labelIcon={<Heart size={15}/>}
            href="/saved-jobs"
            />
          </UserButton.MenuItems>
        </UserButton>
    </SignedIn>
    </div>
  </nav>
  {ShowSignIn && (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
    onClick={handleOverlayClick}
    >
      <SignIn>
        signUpForceRedirectUrl="/onboarding"
        fallbackRedirectUrl="/onboarding"
      </SignIn>
    </div>
  )}
  </>;
};

export default Header
