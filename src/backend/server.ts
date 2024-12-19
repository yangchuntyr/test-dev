import express from 'express';
import axios from 'axios';
import cors from 'cors'; // 引入cors中间件
import { throttle } from './util'
const app = express();
// 使用cors中间件，允许所有来源的跨域请求，这在开发阶段比较方便，但在生产环境可能需要更严格限制来源
app.use(cors());
const port = 3001; // 端口号

// 用于从CoinGecko API获取加密货币数据
const getCryptoData = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        console.log('get data successfully')
        return response.data;
    } catch (error) {
        console.error('Error fetching data,time=' + error);
        return Promise.reject(error);
    }
};


const getCryptoDataFun = (() => {
    //缓存加密货币数据
    const cacheObj = { cryptoData: '' }

    const getDataSetCache = throttle(async () => {

        try {
            const cryptoData = await getCryptoData();
            cacheObj.cryptoData = cryptoData;
            return cryptoData;
        } catch {
            return []
        }


    }, 1000 * 60*1.5)
    return async () => {

        if (!cacheObj.cryptoData) {
            return getDataSetCache()
        }
        //确保数据每1.5分钟更新一下
        getDataSetCache()
        return cacheObj.cryptoData

    }
})()
app.get('/api/crypto', async (req, res) => {
    getCryptoDataFun().then((data) => {
        res.json(data||[])
    }).catch(() => {
        res.json([])
    })

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});