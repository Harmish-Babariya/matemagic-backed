const sendResponse = (response, result) => {
	return response
		.set(result.headers)
		.status(result.statusCode)
		.send(result.data);
};

const handleResponse = (promise, res) => {
	promise
		.then((result) => sendResponse(res, result))
		.catch((error) => sendResponse(res, error));
};

(module.exports = handleResponse), sendResponse;
