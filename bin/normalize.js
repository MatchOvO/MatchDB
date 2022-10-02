const axios = require('axios')
const port = 3020

console.log('\033[44;30m[MatchDB]: Normalize your database.......\033[0m')
normalizeProgram(0)
function normalizeProgram(pullTimes) {
    const newPullTimes = pullTimes + 1
    setTimeout(()=>{
        axios.post(`http://127.0.0.1:${port}/rootNormalize`).then(res=>{
            if (res.status === 200) return console.log('\033[44;30m[MatchDB]: Your database has been normalized and compelete firts start\033[0m');
            return console.log('\033[44;30m[MatchDB]: fail to normalize your database, but MatchDB is on service\033[0m')
        }).catch(e=>{
            if (pullTimes < 10){
                normalizeProgram(newPullTimes)
            }else{
                console.log(e.message)
                console.log('\033[41;33m[MatchDB]: fail to start database service,please check if the port:'+port+' has already been used\033[0m')
            }
        })
    },500)
}

