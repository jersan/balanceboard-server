var mongoose = require('mongoose');
var CategorizedActivity = require('./categorizedActivity');


var Schema = mongoose.Schema;

var TimeMarkSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    previousTimeMarkId: { type: Schema.Types.ObjectId, ref: 'TimeMark'},
    timeISO: {type: String, required: true},
    title: String,
    description: String,
    activities: [Schema.Types.ObjectId]
  }, 
  { 
    collection: 'timeMark' 
  }
);

//Export model
module.exports = mongoose.model('TimeMark', TimeMarkSchema);