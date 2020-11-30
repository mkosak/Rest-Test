import axios from 'axios';

class ApiClient {
    static defaultOptions = {
        apiUrl: 'https://resttest.bench.co/transactions/',
        cancelMessage: 'canceled',
    };

    constructor(client, options) {
        this.options = { ...this.constructor.defaultOptions, ...options };
        this.client =
            client || axios.create({ baseURL: this.options.apiUrl || '' });
        this.Promise = Promise;
        this.CancelToken = axios.CancelToken;
        this.sourcesCancel = {};
        this.config = null;
        this.isCancel = axios.isCancel;
    }

    create(client, options) {
        return this.constructor(client, options);
    }

    /**
     * cancel given or all active requests
     * @method cancel
     * @param {string} request - name of the function that perform request
     */
    cancel(request) {
        const { sourcesCancel } = this;
        const { cancelMessage } = this.options;
        if (request && sourcesCancel[request]) {
            sourcesCancel[request].forEach(
                (cancel) =>
                    typeof cancel === 'function' && cancel(cancelMessage)
            );
            delete sourcesCancel[request];
        } else if (!request) {
            Object.keys(sourcesCancel).forEach((key) => {
                if (typeof sourcesCancel[key] === 'object') {
                    sourcesCancel[key].forEach(
                        (cancel) =>
                            typeof cancel === 'function' &&
                            cancel(cancelMessage)
                    );
                }
            });
            this.sourcesCancel = {};
        }
    }

    /**
     * send POST request
     * @method post
     * @param {string} url - relative path to the api entry point
     * @param {object} data - post data
     * @param {object} [options] - options for request
     * @param {string|number} [options.cancelTokenId] - id that will be used to cancel this request
     * @return {Promise} - request promise
     */
    post(url, data, options = {}) {
        const { cancelTokenId, ...restOptions } = options;
        const opt = {
            cancelToken: this.setCancelToken(cancelTokenId || url),
            ...restOptions,
        };
        return this.client.post(url, data, opt).then((res) => res.data);
    }

    /**
     * send PUT request
     * @method put
     * @param {string} url - relative path to the api entry point
     * @param {object} data - post data
     * @param {object} [options] - options for request
     * @param {string|number} [options.cancelTokenId] - id that will be used to cancel this request
     * @return {Promise} - request promise
     */
    put(url, data, options = {}) {
        const { cancelTokenId, ...restOptions } = options;
        const opt = {
            cancelToken: this.setCancelToken(cancelTokenId || url),
            ...restOptions,
        };
        return this.client.put(url, data, opt).then((res) => res.data);
    }

    /**
     * send GET request
     * @method get
     * @param {string} url - relative path to the api entry point
     * @param {object} [options] - options for request
     * @param {string|number} [options.cancelTokenId] - id that will be used to cancel this request
     * @return {Promise} - request promise
     */
    get(url, options = {}) {
        const { cancelTokenId, ...restOptions } = options;
        const opt = {
            cancelToken: this.setCancelToken(cancelTokenId || url),
            ...restOptions,
        };
        return this.client.get(url, opt).then((res) => res.data);
    }

    /**
     * send DELETE request
     * @method delete
     * @param {string} url - relative path to the api entry point
     * @param {object} [options] - options for request
     * @param {string|number} [options.cancelTokenId] - id that will be used to cancel this request
     * @return {Promise} - request promise
     */
    delete(url, options) {
        const { cancelTokenId, ...restOptions } = options || {};
        const opt = {
            cancelToken: this.setCancelToken(cancelTokenId || url),
            ...restOptions,
        };
        return this.client.delete(url, opt).then((res) => res.data);
    }

    /**
     * generates cancel token, store cancel handler for request
     * @method setCancelToken
     * @param {string} name - alias for request to store cancel handler
     * @return {string} - cancel token for request
     */
    setCancelToken(tokenId) {
        const source = this.CancelToken.source();
        if (typeof this.sourcesCancel[tokenId] === 'object') {
            this.sourcesCancel[tokenId].push(source.cancel);
        } else {
            this.sourcesCancel[tokenId] = [source.cancel];
        }
        return source.token;
    }

    /**
     * send concurrent requests
     * @method all
     * @param {array} requests - array of requests
     * @return {Promise} - request promise
     */
    all(requests) {
        return this.Promise.all(requests);
    }
}

export default new ApiClient();
export { ApiClient };
