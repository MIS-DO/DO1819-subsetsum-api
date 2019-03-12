'use strict'
const sumService = require('@haensl/subset-sum');
const v8 = require('v8');

module.exports.newStress = function newStress(req, res, next) {
  var initialMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  var totalBeginHR = process.hrtime();
  var totalBegin = totalBeginHR[0] * 1000000 + totalBeginHR[1] / 1000;

  var stressRequest = req.stressRequest.value;
  var heapStats = v8.getHeapStatistics();

  // Round stats to MB
  var roundedHeapStats = Object.getOwnPropertyNames(heapStats).reduce(function (map, stat) {
    map[stat] = Math.round((heapStats[stat] / 1024 / 1024) * 1000) / 1000;
    return map;
  }, {});

  var stressResponse = {
    "problem": stressRequest.problem,
    "parameters": stressRequest.parameters,
    "config": {
      "maxMemory": -1,
      "maxTime": -1
    },
    "info": {
      "initialMemory": Math.round((initialMemUsed) * 1000) / 1000,
      "heapStats": roundedHeapStats
    },
    "result": {
      "stages": [{
        "id": "problemGeneration",
        "duration": -1,
        "memory": -1
      },
      {
        "id": "problemSolving",
        "duration": -1,
        "memory": -1
      }
      ],
      "total": {
        "duration": -1,
        "memory": -1
      }
    }
  };


  var parametersMap = stressRequest.parameters.reduce(function (map, obj) {
    map[obj.id] = obj.value;
    return map;
  }, {});

  var stagesMap = stressResponse.result.stages.reduce(function (map, obj) {
    map[obj.id] = {
      "duration": obj.duration,
      "memory": obj.memory
    };
    return map;
  }, {});

  var numbersInArray = parametersMap["numbersInArray"];
  var targetSum = parametersMap["targetSum"];


  ///////////////// GENERATION ///////////////////

  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  var problemGenerated = problemGeneration(numbersInArray, targetSum);

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;
  var duration = (end - begin) / 1000;
  var roundedDuration = Math.round(duration * 1000) / 1000;


  stagesMap["problemGeneration"].duration = roundedDuration;

  /////////////////////////////////////////////////

  const genMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  stagesMap["problemGeneration"].memory = Math.round((genMemUsed - initialMemUsed) * 1000) / 1000;

  ///////////////////// SOLVING /////////////////
  var phase = "solving";
  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  var solution = subsetSumProblem(problemGenerated.items, problemGenerated.sum); /*******/

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;
  var duration = (end - begin) / 1000;
  var roundedDuration = Math.round(duration * 1000) / 1000;

  stagesMap["problemSolving"].duration = roundedDuration;

  var finalMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  stagesMap["problemSolving"].memory = Math.round((finalMemUsed - genMemUsed) * 1000) / 1000;

  /////////////////////////////////////////////////

  var totalEndHR = process.hrtime()
  var totalEnd = totalEndHR[0] * 1000000 + totalEndHR[1] / 1000;
  var totalDuration = (totalEnd - totalBegin) / 1000;
  var roundedDuration = Math.round(totalDuration * 1000) / 1000;

  stressResponse.result.total.duration = roundedDuration;
  stressResponse.result.total.memory = Math.round((finalMemUsed - initialMemUsed) * 1000) / 1000;

  stressResponse.result.stages = Object.getOwnPropertyNames(stagesMap).map(stageId => {
    return {
      "id": stageId,
      "duration": stagesMap[stageId].duration,
      "memory": stagesMap[stageId].memory
    };
  });

  res.send(stressResponse);
}

module.exports.getStress = function getStress(req, res, next) {
  
 
};

module.exports.getStressInfo = function getStressInfo(req, res, next) {
  var os = require('os-utils');
  var si = require('systeminformation');

  si.cpu(function (cpuInfo) {
    si.mem(function (memInfo) {

      // Round mem stats to MB
      var roundedMemInfo = Object.getOwnPropertyNames(memInfo).reduce(function (map, stat) {
        map[stat] = Math.round((memInfo[stat] / 1024 / 1024) * 1000) / 1000;
        return map;
      }, {});

      var p = os.platform();

      os.cpuUsage(function (cpuUsage) {

        os.cpuFree(function (cpuFree) {

          res.send({
            "cpuUsage": cpuUsage,
            "cpuFree": cpuFree,
            "cpuCount": os.cpuCount(),
            "memInfo": roundedMemInfo,
            "freemem": Math.round((os.freemem() * 1000)) / 1000,
            "totalmem": Math.round((os.totalmem() * 1000)) / 1000,
            "freememPercentage": os.freememPercentage(),
            "cpuInfo": cpuInfo,
            "sysUptime": os.sysUptime(),
            "processUptime": os.processUptime(),
            "loadavgLast1Minute": os.loadavg(1),
            "loadavgLast5Minutes": os.loadavg(5),
            "loadavgLast15Minutes": os.loadavg(15),
            "platform": os.platform()
          });


        });
      });


    });
  });
};

function subsetSumProblem(numbers, target) {
  const solver = sumService.subsetSum(numbers, target);
  for (let solution of solver) {
    return solution;
  }
  return [];
}

function problemGeneration(numberInArray, targetSum) {

  const n = numberInArray || 100; // Numbers in array
  const s = targetSum || 100; // Target sum

  var items = [];

  Array.from({ length: n }, () => Math.floor(Math.random()));
  return {
    items: items,
    sum: s
  };
}
