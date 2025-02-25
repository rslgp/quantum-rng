const getIpv4 = (req) => req.ip.includes(':') ? req.ip.split(':')[3] : req.ip;
const getUserId = (req) => {
    let ipv4 = getIpv4(req);
    if(ipv4==='127.0.0.1') ipv4=undefined;
    console.log(req.user?.id , req.headers['x-real-ip'] , ipv4 , 'anom')
    return req.user?.id || req.headers['x-real-ip'] || ipv4 || 'anom';
}
export {getUserId, getIpv4};