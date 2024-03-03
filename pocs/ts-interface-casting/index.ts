interface ServerConfig {
    host?: string;
    port?: number;
}

interface SimpleServerConfig {
    host: string;
}

function getConfig(): SimpleServerConfig {
    return {
        host: "127.0.0.1",
        port: 8080,
    } as SimpleServerConfig
} 

console.log(getConfig())
console.log(getConfig() as SimpleServerConfig )