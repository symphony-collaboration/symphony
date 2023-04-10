const axios = require('axios');

const metaDataEndpoint = process.env.ECS_CONTAINER_METADATA_URI_V4;

async function getContainerIp() {
    try {
        const response = await axios.get(metaDataEndpoint);

        if (response.data) {
            const {Networks } = response.data;
            const privateIp = Networks[0].IPv4Addresses[0];
            return privateIp
        }
    } catch (error) {
        console.error('Error fetching ECS metadata:', error);
        throw error;
    }
}

module.exports = {getContainerIp};