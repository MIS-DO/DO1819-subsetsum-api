'use strict'

var varapiv1stressController = require('./apiv1stressControllerService');

module.exports.newStress = function newStress(req, res, next) {
  varapiv1stressController.newStress(req.swagger.params, res, next);
};

module.exports.getStress = function getStress(req, res, next) {
  varapiv1stressController.getStress(req.swagger.params, res, next);
};

module.exports.getStressInfo = function getStressInfo(req, res, next) {
  varapiv1stressController.getStressInfo(req.swagger.params, res, next);
};