import React, { useState, useEffect, useRef } from 'react';
// import { div } from '@shopify/polaris';
import { debounce } from './util'
import axios from 'axios';
import { AppProvider, Page, Card, Button } from '@shopify/polaris';
const App: React.FC = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const apiUrl = 'http://localhost:3001/api/crypto'
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(apiUrl);
                setLoading(false)
                setCryptoData(response.data);
            } catch (error) {
                setLoading(false)
                setError('serve error')
                console.error('Error fetching crypto data:' + error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = ((e: any) => {
        setSearchTerm(e.target.value);
    });

    const filteredData = cryptoData.filter((crypto: any) => {
        return crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        //1.5分钟更新数据一次
        setInterval(async () => {
            try {
                setError('')
                const response = await axios.get(apiUrl);

                setCryptoData(response.data);
            } catch (error) {
                setError('serve error')
                console.error('Error fetching crypto data:', error);
            }
        }, 1000 * 30);
    }, [])

    return (
        <div >
            {/* 数据加载正确显示完整数据 */}
            {!loading && error.length === 0 && <>
                <input placeholder='please input name or symbol to search' style={{ height: 30, marginBottom: '1vw', width: '50vw' }} autoComplete='true' value={searchTerm}
                    onChange={(e) => {
                        handleSearch(e)
                    }} />

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'center', gap: '1vw' }}>
                    {filteredData.length ? filteredData.map((crypto: any) => (
                        <div style={{ background: '#ddd', minWidth: '10vw', borderRadius: '10px', padding: 10 }} key={crypto.id}>
                            <div>{crypto.name}</div>
                            <p>Symbol: {crypto.symbol}</p>
                            <p>Price: {crypto.current_price}</p>
                        </div>
                    )) : 'no data'}
                </div>
            </>}
            {/* 加载中提示 */}
            {loading && error.length === 0 && ("data loading...")}
            {/* 加载错误提示 */}
            {!loading && error.length > 0 && ("sever error,please try again...")}
        </div>
    );
};

export default App;