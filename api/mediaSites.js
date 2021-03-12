
const axios = require('axios');
const config = require('plain-config')()
        
const sites = async () => {
           
    try {
        const response = await axios.get(config.hyunaRandomSites);
        return response.data.url_sites.media;
    } catch (error) {
        console.error(error);
    }
}
        
        
module.exports = {
    sites,
}
