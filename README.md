# SubsetSum-API

## Overview
This is a Subset Sum API for stress analysis and benchmarking. 

This server was scaffolded with [oas-generator](https://github.com/isa-group/oas-generator); subsetsum algorithm is taken from [@haensl/subset-sum](https://www.npmjs.com/package/@haensl/subset-sum).

There is a **on-line demo** deployment available at: https://do1819-subsetsum-api.herokuapp.com


### Running the API using docker

If you have docker, you can use it out of the box: `docker run -p 7000:80 -d omigongar/subsetsum-api` to run the container at port `7000`


### Running the API using node

To run the server, just use:

```
npm install 
npm start
```

Then, if running in localhost, you can check the swagger UI doc portal in: `http://localhost:8080/`

### Using the API

#### Stress request

In order to send a request, either GET or POST can be used:

- `POST /api/v1/stress` 
```json
{
	"problem": "subsetsum",
	"parameters": [
		{
			"id": "numbersInArray",
			"value": 1000
		},
		{
			"id": "targetSum",
			"value": 450
		}
	],
	"config": {
		"maxMemory": -1,
		"maxTime": -1
	}
}
```

- `GET /api/v1/stress/1000/450` would generate and solve a subsetsum problem with 1000 random numbers and find a susbset(the first one) that sum 450.

#### Subsetsum problem solving

In order to solve a given subsetsum problem you should send a POST to `/api/v1/problems` endpoint: 

`POST /api/v1/problems`
```json
{
  "id": "subsetsum",
  "problem": {
    "items": [1,2,4,5,23,22,25,66,67,88],
    "sum": 94
  }
}
```
will get: 
```json
{
  "id": "subsetsum",
  "problem": {
    "items": [
      1,
      2,
      4,
      5,
      23,
      22,
      25,
      66,
      67,
      88
    ],
    "sum": 94
  },
  "solution": {
    "items": [
      1,
      2,
      25,
      66
    ],
    "sum": 94,
    "stats": {
      "solvingTime": 1.4443809967041015
    }
  }
}
```
****