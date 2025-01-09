import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import image from "../public/images/disco.png"

export default function HostSection () {
  return (
    <>
    <div className='bg-transparent w-full text-white h-[90vh] overflow-hidden mt-[60px]'>
    <div className="header bg-transparent py-8 ml-20">
  <h1 className="text-4xl font-bold">Host your own EVENT!!!</h1>
</div>
<div className="content grid grid-cols-[2fr_1fr] gap-5 items-center px-16">
<div className="left space-y-6 text-center">
  <p className="text-2xl font-light mb-8">
    Create an event, invite your community,<br /> and manage everything in one place.
  </p>
  <Button className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600">
    Create Event
  </Button>
</div>
<div className="right flex justify-center items-center space-x-4">
  <Image src={image} alt="Disco Ball"  />
</div>
</div>
</div> 
    </>
  )
}

