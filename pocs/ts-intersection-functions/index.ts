interface PortProvider{
    getPort(): number
}

interface HostProvider{
    getHostname(): string
}

function debug(conf: PortProvider & HostProvider): void {
    console.log(conf.getHostname() + " - " + conf.getPort());
}

let local = {
    getHostname(){
        return "localhost";
    },
    getPort(){
        return 3000;
    }
}
debug(local);
