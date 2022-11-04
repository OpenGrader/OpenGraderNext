import userIMG from "../public/UserPlaceholder.png"
import { HiCog } from "react-icons/hi"
import Link from "next/link"

const user ={  
                name:"John D.",
                position:"Teacher"
            }

const SideBarLinks = () =>{
    const Options = [{text:"Assignments",link:"#"},
                    {text:"Students",link:"#"},
                    {text:"Reports",link:"#"}]
    return(<>
        {
            Options.map((option,index)=>{
                if(index % 2 == 0)
                    return <Link href={option.link} className="bg-slate-800 h-10 w-full rounded-lg text-left px-2 flex items-center">{option.text}</Link>
                else
                    return <Link href={option.link} className="bg-slate-900 h-10 w-full rounded-lg text-left px-2 flex items-center">{option.text}</Link>
            })
        }
    </>)
}

const Sidebar = () =>{
    const {name,position} = user
    return(
        <div className="h-screen w-2/12 flex flex-col text-gray-50 bg-zinc-900 justify-between">
            <div className=" p-3 flex flex-col gap-6 font-bold">
                <h1 className="text-center text-3xl">OpenGrader</h1>
                <SideBarLinks/>
            </div>
            <div className="w-full h-20 px-4 flex items-center justify-between bg-zinc-800">
                <div className="flex items-center gap-4">
                    <img src="/UserPlaceholder.png" className="h-12 aspect-square p-2 rounded-full" alt="" />
                    <div className="">
                        <h2 className="text-gray-200">{name}</h2>
                        <h3 className="font-bold">{position}</h3>
                    </div>
                </div>
                <Link href="#">
                    <HiCog className="text-3xl"/>
                </Link>
            </div>
        </div>
    )
}
export default Sidebar