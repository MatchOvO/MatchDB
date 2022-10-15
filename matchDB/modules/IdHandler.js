const uuid = require('uuid')
class IdHandler {
    constructor(_id) {
        this.id = _id
    }
    static randomId(){
        return uuid()
    }

    idArr(){
        const idArr = this.id.constructor === Array ? this.id : [this.id]
        // 将id转为字符串
        idArr.forEach((item,index)=>{
            if (item.constructor !== String) idArr[index] = String(item)
        })
        return idArr
    }
}
module.exports = IdHandler