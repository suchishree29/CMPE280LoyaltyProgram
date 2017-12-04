/**
 * Created by Suchishree Jena on 11/9/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    fname: {type:String, required:true},
    lname: {type:String, required:true},
	username: {type:String, required:true},
	password: {type:String, required:true},
	email: {type:String, required:true},
    phone: {type:String, required:true},
    totalBillAmount: {type:Number, default:0},
    totalPoints :{type:Number, default: 1000}
});

module.exports = mongoose.model('Customer', CustomerSchema);

