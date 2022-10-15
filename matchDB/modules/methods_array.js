class methods_array {
    distinct(arr){
        const tempSet = new Set(arr)
        return [...tempSet]
    }

    repeat(arr){
        const tempArr = []
        arr.forEach((collection,index)=>{
            collection.forEach(id=>{
                if ( !tempArr.includes(id) ){
                    let repeatTimes = 1
                    arr.forEach((_collection,_index)=> {
                        if ( (index !== _index) && _collection.includes(id) ) repeatTimes++;
                    })
                    if ( (repeatTimes === arr.length)) tempArr.push(id)
                }

            })
        })
        return tempArr
    }
}
module.exports = new methods_array()