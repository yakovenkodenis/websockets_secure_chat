import os from 'os';


export function getExternalIpAddress() {
    const ifaces = os.networkInterfaces();
    let address;

    for (let dev in ifaces) {

        let iface = ifaces[dev].filter(
            details => details.family === 'IPv4' && details.internal === false
        );

        if (iface.length > 0) {
            address = iface[0].address;
        }
    }
    return address;
}
