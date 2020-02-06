'use strict';

const mongoose = require('mongoose');
const email = require('../middleware/email.js');
const user = require('./user');

const jobSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currentBidder: { type: String, default: '' },
  jobType: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  isOpen: { type: Boolean, default: true },
});

/** 
 * Post hook to send an email to the job creator after the job is saved to the database
*/
jobSchema.post('save', function (job) {
  user.findById(job.postedBy)
    .then(user => {      
      email.sendNewJob(user, job.name);
    }).catch(err => console.log(err));
});

/** 
 * Jobs model
 * @module Jobs
*/
function getModel(){
  return mongoose.model('jobs', jobSchema);
}
module.exports = getModel;