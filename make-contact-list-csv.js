global.ObjectId = (s) => s;

let customers = require('./list.js');

var csv =  customers.reduce( ( agg, i) => { agg[i.email] = i.fullname + ',' + i.created_at.toString() ; return agg; }, {} );
console.log("email, firstname, opt-in time");
for (var i in csv ) {
	console.log(i.replace(',', ' ') , ',' , csv[i]);
}
