"use client"
import VideoPlayer from '@/app/component/VideoPlayer'
import supabase from '@/app/config/configsupa'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({params}) => {
const {id}= React.use(params)

const [course, setCourse] = useState(null)

useEffect(()=>{
   ( async ()=>{
    const {data, error} = await supabase
    .from('courseUpload')
    .select('*')
    .eq('id', id)
    .single()
    setCourse(data)
    })()
},[id])

console.log("course",course);


    
  return (
    <div>
      <VideoPlayer url={course?.courseVideo
}/>
    </div>
  )
}

export default page
