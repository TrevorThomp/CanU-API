'use strict';

/** 
 * checks if user has required permissions to access route
 * @param {string} capability read, write, update, delete, superuser
 * @module access-control
*/
module.exports = (capability) => {
  return (req, res, next) => {
    try {
      if(req.user[0].userRoles.capabilities.includes(capability)){
        next();
      }
      else{
        next('Access Denied');
      }
    }
    catch(error){
      next('Invalid Login');
    }
  };
};