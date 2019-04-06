var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var DayTemplateSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {type: String, required: true},
    color: {type: String, required: true},
    sleepTimeRanges: {type: [], required: true},
    nonDiscretionaryTimeRanges: {type: [], required: true},
    discretionaryTimeRanges: {type: [], required: true},
  }, 
  { 
    collection: 'dayTemplate' 
  }
);

//Export model
module.exports = mongoose.model('DayTemplate', DayTemplateSchema);

