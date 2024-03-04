type Port = {
    port: number,
};
type Host = {
    hostname: string,
};

function validate(config: Host & Port){
    console.log(config.port);
    console.log(config.hostname);
}

let devServer = {
    hostname: "127.0.0.1",
    port: 3000,
};

validate(devServer);

validate({
    hostname: "127.0.0.10",
    port: 3030,
});

validate({
    hostname: "127.0.0.100",
    port: 8080,
} as Host & Port);