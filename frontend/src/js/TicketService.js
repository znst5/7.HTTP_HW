import createRequest from './api/createRequest';

export default class TicketService {
    constructor(baseUrl = 'http://localhost:7070') {
        this.baseUrl = baseUrl;
    }

    list(callback) {
        createRequest({
            url: this.baseUrl,
            method: 'GET',
            data: { method: 'allTickets' },
            callback,
        });
    }

    get(id, callback) {
        createRequest({
            url: this.baseUrl,
            method: 'GET',
            data: { method: 'ticketById', id },
            callback,
        });
    }

    create(data, callback) {
        createRequest({
            url: `${this.baseUrl}?method=createTicket`,
            method: 'POST',
            data,
            callback,
        });

    }

    update(id, data, callback) {
        createRequest({
            url: `${this.baseUrl}?method=updateById&id=${id}`,
            method: 'POST',
            data,
            callback,
        });
    }

    delete(id, callback) {
        createRequest({
            url: this.baseUrl,
            method: 'GET',
            data: { method: 'deleteById', id },
            callback,
        });
    }
}
