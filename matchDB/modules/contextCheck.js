/**
 *  Check the context's format
 */
const Validator = require('param-validator.js')
const stringModel = {
    type:String,
    empty: false
}
const whereModel = {
    db: stringModel,
    table: stringModel,
    mode: {
        type: String,
        required: false,
        range:['AND','OR','BOTH'],
        default: 'BOTH'
    },
    where:{
        type: Object
    }
};
const validatorClass = {
    'dbNormalize':new Validator({
        dbName: stringModel,
        test:{
            type: Number,
            required: false
        }
    }),
    'createTable':new Validator({
        db:stringModel,
        tableName:stringModel,
        format:{
            type:Array,
            items:stringModel
        }
    }),
    'addData': new Validator({
        db:stringModel,
        table:stringModel,
        data:{
            type:[Object,Array],
            objItems: {
                "_id":{
                    type:[Number, String],
                    empty: false,
                    required: false
                }
            },
            arrItems:{
                type:Object,
                objItems:{
                    "_id": {
                        type: [Number, String],
                        empty: false,
                        required: false
                    }
                }
            }
        }
    }),
    'deleteData': new Validator({
        db: stringModel,
        table: stringModel,
        _id: {
            type: [Array, Number, String],
            items:{
                type: [Number, String],
                empty: false,
                required: false
            }
        }
    }),
    'getData': new Validator({
        db: stringModel,
        table: stringModel,
        _id: {
            type: [Array, Number, String],
            items:{
                type: [Number, String],
                empty: false,
                required: false
            }
        }
    }),
    'getTable': new Validator({
        db: stringModel,
        table: stringModel
    }),
    'getTableData': new Validator({
        db: stringModel,
        table: stringModel
    }),
    'updateData': new Validator({
        db: stringModel,
        table: stringModel,
        _id: {
            type: [Array, Number, String],
            items:{
                type: [Number, String],
                empty: false,
                required: false
            }
        },
        field: {
            type: Object
        }
    }),
    'getWhere': new Validator(whereModel),
    'deleteWhere': new Validator(whereModel),
    'updateWhere':new Validator(whereModel)
}

function contextCheck(operation,context){
    let result = true
    const paramValidator = validatorClass[operation]
    if (!Validator.isType(context,Object)) return {result:false,msg:`[MatchDB]: post or context format error,please use JSON to post or use the correct context format`}
    const returnResult = paramValidator.check(context)
    if (!returnResult.result) {
        const {errorField, errorType, errorModule}  = returnResult
        const frontInfo = `[MatchDB] Property {${errorField}} `
        const reasonTable = {
            "required":'is needed',
            "type":'should be an ',
            "regexp": 'can not be empty',
            "range": 'is not a correct value'
        }
        const typeTable = {
            "stringV": 'String',
            "objectV": 'Object',
            "arrayV": 'Array',
            "numberV": 'Number'
        }
        const msg = frontInfo + reasonTable[errorType] + ( errorType === 'type'? typeTable[errorModule] : '' )
        return {
            result: false,
            msg
        }
    }
    return {result}
}

module.exports = contextCheck