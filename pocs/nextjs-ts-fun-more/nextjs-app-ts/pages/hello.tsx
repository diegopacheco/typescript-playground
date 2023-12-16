export const getServerSideProps = function (){
    return {
        props: {
            anwser: "42"
        }
    }    
}

export default function Home(props:any){
    console.log(props);
    return <div>Hello World! Page render by nextjs at the server side.</div>   
}