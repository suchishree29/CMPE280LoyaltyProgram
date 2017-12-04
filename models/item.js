/**
 * Created by Suchishree Jena on 11/9/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    voucherName: {type:String, required:true},
    points: {type:Number, required:true},
	value: {type:Number, required:true},
	voucherCode: {type:String, required:true}
});

module.exports = mongoose.model('Item', ItemSchema);

