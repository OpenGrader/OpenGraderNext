import Sidebar from "../../Components/Sidebar"
import Students from "../../Components/Course Pages/Students"

export async function getServerSideProps(context:any){

    const data = context.query.Course
    return {props: {data}}
}

const PageLoader = ({page}:{page:string}) =>{
    switch (page) {
        case "Student":
            return <Students/>
            break;
    
        default:
            return (<h1 className="font-bold text-3xl text-slate-50">INVALID PAGE</h1>)
            break;
    }
}


const Page = ({data}:{data:Array<string>}) =>{
    console.log(data.length)
    
    if(data.length == 1)
    {
        return(
            <div className="flex">
                <Sidebar courseID={data[0]} parent="Homepage"/>
                <h1 className="font-bold text-3xl text-slate-50">Homepage</h1>
            </div>
        )
    }

    if(data.length == 2)
    {
        return(
            <div className="flex">
            <Sidebar courseID={data[0]} parent={data[1]}/>
            <PageLoader page={data[1]}/>
            </div>
        )
    }
}

export default Page