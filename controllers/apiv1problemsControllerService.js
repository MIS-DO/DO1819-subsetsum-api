'use strict'
const sumService = require('@haensl/subset-sum');

module.exports.newProblem = function newProblem(req, res, next) {
  var problemRequest = req.problem.value;
  console.log(problemRequest);

  //time
  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  var solutionItems = subsetSumProblem(problemRequest.problem.items, problemRequest.problem.sum);

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;

  var solutionSolvingTime = (end - begin) / 1000;

  problemRequest.solution = {
    items: solutionItems,
    sum: problemRequest.problem.sum,
    stats: {
      solvingTime: solutionSolvingTime
    }
  };

  res.send(problemRequest);
};

function subsetSumProblem(numbers, target) {
  const solver = sumService.subsetSum(numbers, target);
  for (let solution of solver) {
    return solution;
  }
  return [];
}