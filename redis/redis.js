const asyncRedis = require('async-redis')
const redisClient = asyncRedis.createClient(6379, 'localhost')

redisClient.on('connect', () => {
    console.log(`\x1b[36m  Redis connected to host localhost port 6379 \x1b[0m`)
})

redisClient.on('error', (err) => {
    console.log('\x1b[41m Redis error: ' + err + '\x1b[0m')
})
// 900s -> 15 min,  1800s -> 30 min
const setRedis = async (key, value) => (await redisClient.set(key, value, "EX", 1800))

const getRedis = async (value) => (await redisClient.get(value))

const deleteRedis = async (key) => (await redisClient.del(key))

const setDataCache = async (key, data) => {

    try {
        await setRedis(key, JSON.stringify(data))
        console.log(`*** Redis SET { ${key} } count: { ${data.length} } `)

    } catch (err) {
        console.log(`\n*** Something happened, setDataCache, err:`, err)
    }
}

const delDataCache = async (key) => {

    try {
        await deleteRedis(key)
        console.log(`*** Redis DEL { ${key} } \n`)

    } catch (err) {
        console.log(`\n*** Something happened, delDataCache, err:`, err)
    }
}


const getDataCache = async (key) => {

    try {
        // console.time('getDataCache')
        let dataCache = JSON.parse(await getRedis(key))
        if (dataCache) {
            console.log(`*** REDIS GET { ${key} }, count: { ${dataCache.length} }`)
        }
        // console.timeEnd('getDataCache')
        return dataCache

    } catch (err) {
        console.log(`\n*** Something happened, getDataCache err:`, err)
    }
}


module.exports = {
    getDataCache,
    setDataCache,
    delDataCache
}