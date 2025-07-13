import cron from 'node-cron';

const MAIN_CHANNEL_ID = '1241192832245563582';

export function initializeAutoGameScheduler(client) {
    async function sendNotification(channelId, message) {
        try {
            const channel = await client.channels.fetch(channelId);
            
            if (!channel) {
                console.error(`チャンネルが見つかりません。`);
                return;
            }
            
            await channel.send(`@everyone ${message}`);
        } catch (error) {
            console.error('通知送信エラー:', error);
        }
    }

    // 日本時間22:20 (UTC 13:20)
    cron.schedule('20 13 * * *', () => 
        sendNotification(MAIN_CHANNEL_ID, 'みんなーーいつもの時間!10分後開始するよー')
    );

    // 日本時間22:25 (UTC 13:25)
    cron.schedule('25 13 * * *', () => 
        sendNotification(MAIN_CHANNEL_ID, 'みんなーー5分後だよーー')
    );

    // 日本時間22:30 (UTC 13:30)
    cron.schedule('30 13 * * *', () => 
        sendNotification(MAIN_CHANNEL_ID, 'みんなーーはじめるよーー')
    );
}