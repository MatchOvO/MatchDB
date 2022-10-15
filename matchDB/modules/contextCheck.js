/**
 *  Check the context's format
 */
function contextCheck(operation,context){
    let result = true
    if (context.constructor !== Object) return {result:false,msg:`[MatchDB]: post or context format error,please use JSON to post or use the correct context format`
    }
    switch (operation){
        case 'dbNormalize':
            if(!context.hasOwnProperty('dbName')) return {result:false,msg:'[MatchDB]:Property {dbName} is needed'};
            if (context.dbName.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {dbName} should be an String'};
            if (context.dbName === '') return  {result:false,msg:'[MatchDB]:Property {dbName} can not be empty'};
            break;
        case 'createTable':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {db} can not be empty'};
            if(!context.hasOwnProperty('tableName')) return {result:false,msg:'[MatchDB]:Property {tableName} is needed'};
            if (context.tableName.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {formName} should be an String'};
            if (context.tableName === '') return  {result:false,msg:'[MatchDB]:Property {formName} can not be empty'};
            if(!context.hasOwnProperty('format') || !Array.isArray(context.format)) return {result:false,msg:'[MatchDB]:Property {format} is needed and it is needed as an Array'};
            if (context.format.length === 0) return  {result:false,msg:'[MatchDB]:Property {format} can not be an empty Array'};
            break;
        case 'addData':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if(!context.hasOwnProperty('data')) return {result:false,msg:'[MatchDB]:Property {data} is needed'};
            if ((context.data.constructor !== Object) && (context.data.constructor !== Array)) return {result:false,msg:'[MatchDB]:Property {data} should be an Object'};
            // if ((context.data.hasOwnProperty("_id"))){
            //     if ((context.data._id.constructor !== String) && (context.data._id.constructor !== Number)) return {result:false,msg:'[MatchDB]:Data\'s Property {_id} should be an String or Number'};
            // }
            break;
        case 'getTable':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            break;
        case 'deleteData':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if(!context.hasOwnProperty('_id')) return {result:false,msg:'[MatchDB]:Property {_id} is needed'};
            if (context._id.constructor !== String && context._id.constructor !== Array && context._id.constructor !== Number) return {result:false,msg:'[MatchDB]:Property {_id} should be an String or an Array'};
            break
        case 'getData':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if(!context.hasOwnProperty('_id')) return {result:false,msg:'[MatchDB]:Property {_id} is needed'};
            if (context._id.constructor !== String && context._id.constructor !== Array && context._id.constructor !== Number) return {result:false,msg:'[MatchDB]:Property {_id} should be an String or an Array'};
            break
        case 'updateData':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if (!context.hasOwnProperty('_id')) return {result:false,msg:'[MatchDB]:Property {_id} is needed'};
            if (context._id.constructor !== String && context._id.constructor !== Array && context._id.constructor !== Number) return {result:false,msg:'[MatchDB]:Property {_id} should be an String or an Array'};
            if(!context.hasOwnProperty('field')) return {result:false,msg:'[MatchDB]:Property {field} is needed'};
            if (context.field.constructor !== Object) return {result:false,msg:'[MatchDB]:Property {field} should be an Object'};
            break
        case 'getWhere':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if(!context.hasOwnProperty('where')) return {result:false,msg:'[MatchDB]:Property {field} is needed'};
            if (context.where.constructor !== Object) return {result:false,msg:'[MatchDB]:Property {field} should be an Object'};
            break
        case 'deleteWhere':
            if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
            if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
            if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
            if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
            if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
            if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
            if(!context.hasOwnProperty('where')) return {result:false,msg:'[MatchDB]:Property {field} is needed'};
            if (context.where.constructor !== Object) return {result:false,msg:'[MatchDB]:Property {field} should be an Object'};
            break
    }
    return {result}
}

module.exports = contextCheck