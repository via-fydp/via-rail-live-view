import config from './config';

export default class ApiClient {
	static formatHeaders(options){
		const contentType = options.contentType ? options.contentType : 'application/json';
		if(options.authorized){
			return  {
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Content-Type': contentType,
				'Authorization': 'Bearer ' + this.getAuthToken(),
				...options.headers
			}
		}
		else {
			return  {
				'Accept': 'application/json',
				'Content-Type': contentType,
				...options.headers
			}
		}
	}

	static async get(endpoint, options={}) {
		return fetch(`${config.URL}${endpoint}`, {
				method: 'GET',
				headers: this.formatHeaders(options),
			})
			.then((response) => {
				return response.json()
			})
			.then(responseJSON => {
				return responseJSON;
			});
	}

	static async post(endpoint, body, options={}) {
		return fetch(`${config.URL}${endpoint}`, {
			method: 'POST',
			headers: this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.then(response => response.json())
		.then(responseJSON => {
			return responseJSON;
		});
	};

	static async put(endpoint, body, options={}) {
		return fetch(`${config.URL}${endpoint}`, {
			method: 'PUT',
			headers: this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.then(response => {
			return response.json()
		})
		.then(responseJSON => {
			return responseJSON
		});
	}

	static async delete(endpoint, options={}) {
		return fetch(`${this.getServerUrl()}${endpoint}`, {
			method: 'DELETE',
			headers:  this.formatHeaders(options)
		});
	}
}
