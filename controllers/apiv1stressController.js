'use strict'

var varapiv1stressController = require('./apiv1stressControllerService');

module.exports.newStress = function newStress(req, res, next) {
  varapiv1stressController.newStress(req.swagger.params, res, next);
};

module.exports.getStress = function getStress(req, res, next) {
  var stressRequest = {
    "problem": "subsetsum",
    "parameters": [
      {
        "id": "numbersInArray",
        "value": req.swagger.params.numbersInArray.value
      },
      {
        "id": "targetSum",
        "value": req.swagger.params.targetSum.value
      }
    ],
    "config": {
      "maxMemory": -1,
      "maxTime": -1
    }
  };
  req.swagger.params.stressRequest = {
    "value": stressRequest
  };
  
  varapiv1stressController.newStress(req.swagger.params, res, next);
};

module.exports.getStressInfo = function getStressInfo(req, res, next) {
  varapiv1stressController.getStressInfo(req.swagger.params, res, next);
};