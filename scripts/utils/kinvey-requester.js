
const APP_KEY = "kid_H10xGLhRL";
const APP_SECRET = "48817b9a90be4570affd66e7369248e8";

function fetchData(URL, headers) {
    return fetch(URL, headers)
        .then(handleResponse)
        .then(parseResponseData);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response;
}

function parseResponseData(response) {
    if (response.status === 204) {
        return response;
    }

    return response.json();
}

function buildHeaders(httpMethod, authType, data) {
    let headers = {
        method: httpMethod,
        headers: {
            "Authorization": createAuthorization(authType),
            "Content-Type": "application/json",
        }
    };

    if (data !== undefined) {
        headers.body = JSON.stringify(data);
    }

    return headers;
}

function createAuthorization(authType) {
    if (authType === "Basic") {
        return `Basic ${btoa(`${APP_KEY}:${APP_SECRET}`)}`;
    }

    return `Kinvey ${sessionStorage.getItem("authtoken")}`;
}

function get(module, endpoint, authType, queryParams = '') {
    let headers = buildHeaders("GET", authType);
    let URL = buildURL(module, endpoint);

    return fetchData(URL + queryParams, headers);
}

function post(module, endpoint, data, authType) {
    let headers = buildHeaders("POST", authType, data);
    let URL = buildURL(module, endpoint);

    return fetchData(URL, headers, data);
}

function put(module, endpoint, data, authType) {
    let headers = buildHeaders("PUT", authType, data);
    let URL = buildURL(module, endpoint);

    return fetchData(URL, headers);
}

function del(module, endpoint, authType) {
    let headers = buildHeaders("DELETE", authType);
    let URL = buildURL(module, endpoint);

    return fetchData(URL, headers);
}

const ROOT_URL = " https://baas.kinvey.com"

function buildURL(module, endpoint) {
    return `${ROOT_URL}/${module}/${APP_KEY}/${endpoint}`;
}

export const requester = {
    get,
    post,
    put,
    del,
};