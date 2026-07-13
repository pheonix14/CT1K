const axios = require('axios');

async function getSubscriberCount(channelId, apiKey) {
    if (!channelId || !apiKey) {
        throw new Error('Channel ID or API Key is missing.');
    }
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        const response = await axios.get(url);
        
        if (response.data.items && response.data.items.length > 0) {
            const stats = response.data.items[0].statistics;
            return parseInt(stats.subscriberCount, 10);
        } else {
            throw new Error('Channel not found.');
        }
    } catch (error) {
        console.error('Error fetching subscriber count:', error.message);
        // If there's an error, we might want to return a fallback or re-throw
        return null;
    }
}

module.exports = {
    getSubscriberCount
};
