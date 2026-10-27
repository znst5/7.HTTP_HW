
export default class TicketView {
    constructor(ticket) {
        this.ticket = ticket;
    }

    render() {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket-item';
        ticketElement.dataset.id = this.ticket.id;

        const ticketRow = document.createElement('div');
        ticketRow.className = 'ticket-row';

        const statusElement = document.createElement('div');
        statusElement.className = 'ticket-status';
        if (this.ticket.status) {
            statusElement.classList.add('done');
        }

        const nameElement = document.createElement('div');
        nameElement.className = 'ticket-name';
        nameElement.textContent = this.ticket.name;

        const formattedDate = new Date(this.ticket.created).toLocaleString('ru-Ru', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        const dateElement = document.createElement('div');
        dateElement.className = 'ticket-date';
        dateElement.textContent = formattedDate;

        const actionsElement = document.createElement('div');
        actionsElement.className = 'ticket-actions';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-action btn-edit';
        btnEdit.textContent = '✎';

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-action btn-delete';
        btnDelete.textContent = 'x';

        actionsElement.appendChild(btnEdit);
        actionsElement.appendChild(btnDelete);

        ticketRow.appendChild(statusElement);
        ticketRow.appendChild(nameElement);
        ticketRow.appendChild(dateElement);
        ticketRow.appendChild(actionsElement);

        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'ticket-description hidden';

        ticketElement.appendChild(ticketRow);
        ticketElement.appendChild(descriptionElement);

        return ticketElement;
    }
}
