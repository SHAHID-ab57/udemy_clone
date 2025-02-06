"use client"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

const Header = dynamic(()=>import("@/Layout/Header"))
const Footer = dynamic(()=>import("@/Layout/Footer"))

const Wraper = ({children}) => {
  const router = useRouter()

 const  path = router.pathname === "/admin"

 
  return (
    <>
    <Header/>
    {children}
    <Footer/>
    </>
  )
}

export default Wraper
