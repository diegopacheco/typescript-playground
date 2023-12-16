import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async function (){
    const rawData = {
        anwser: "42",
        renderDate: new Date(),
    };
    const data = JSON.stringify(rawData);
    return {
        props: {
            data
        }
    }    
}

export default function Home(
    props: InferGetServerSidePropsType<GetServerSideProps>){
    console.log(props, props.renderDate);
    return <div>Hello World! Page render by nextjs at the server side.</div>   
}