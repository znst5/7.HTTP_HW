import TicketForm from './TicketForm';
import TicketView from './TicketView';

export default class HelpDesk {
    constructor(container, ticketService) {
        if (!(container instanceof HTMLElement)) {
            throw new Error('This is not HTML element!');
        }
        this.container = container;
        this.ticketService = ticketService;
        this.ticketForm = new TicketForm();
        this.activeDeleteId = null;
    }

    init() {
        this.renderBaseLayout();
        this.ticketForm.bindToDOM(this.container);
        this.renderDeleteModal();
        this.bindEvents();
        this.loadTickets();
    }

    renderBaseLayout() {
        const header = document.createElement('header');
        header.className = 'header';

        const title = document.createElement('h1');
        title.className = 'title';
        title.textContent = 'HelpDesk';

        const addBtn = document.createElement('button');
        addBtn.id = 'add-ticket-btn';
        addBtn.className = 'btn';
        addBtn.textContent = 'Добавить тикет';

        header.appendChild(title);
        header.appendChild(addBtn);

        const main = document.createElement('main');
        main.id = 'tickets-container';
        main.className = 'tickets-list';

        this.container.appendChild(header);
        this.container.appendChild(main);
    }

    renderDeleteModal() {
        const deleteModal = document.createElement('div');
        deleteModal.id = 'delete-modal';
        deleteModal.className = 'modal hidden';

        const container = document.createElement('div');
        container.className = 'modal-form-container';

        const title = document.createElement('h3');
        title.textContent = 'Удалить тикет';

        const text = document.createElement('p');
        text.textContent = 'Вы уверены, что хотите удалить этот тикет? Это действие необратимо.';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';

        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-cancel id-delete-cancel';
        btnCancel.textContent = 'Отмена';

        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-ok id-delete-confirm';
        btnConfirm.textContent = 'Ok';

        buttonsContainer.appendChild(btnCancel);
        buttonsContainer.appendChild(btnConfirm);

        container.appendChild(title);
        container.appendChild(text);
        container.appendChild(buttonsContainer);
        deleteModal.appendChild(container);

        this.container.appendChild(deleteModal);
    }

    loadTickets() {
        const listContainer = document.getElementById('tickets-container');
        this.ticketService.list((error, rawTickets) => {
            if (error) {
                console.error(error);
                return;
            }

            let tickets = rawTickets;
            if (typeof rawTickets === 'string') {
                try {
                    tickets = JSON.parse(rawTickets);
                } catch (e) {
                    console.error('Не удалось распарсить тикеты: ', e);
                    return;
                }
            }

            if (!Array.isArray(tickets)) {
                console.error('Данные тикетов не являются массивом: ', tickets);
            }

            listContainer.replaceChildren();

            tickets.forEach((ticket) => {
                const ticketView = new TicketView(ticket);
                listContainer.appendChild(ticketView.render());
            });
        });
    }

    bindEvents() {
        const addBtn = document.getElementById('add-ticket-btn');
        const formModal = this.ticketForm.element;
        const form = formModal.querySelector('.modal-form');
        const deleteModal = document.getElementById('delete-modal');
        const listContainer = document.getElementById('tickets-container');

        addBtn.addEventListener('click', () => {
            form.reset();
            form.querySelector('.form-id').value = '';
            formModal.querySelector('.modal-title').textContent = 'Добавить тикет';
            formModal.classList.remove('hidden');
        });

        formModal.querySelector('.btn-cancel').addEventListener('click', () => {
            formModal.classList.add('hidden');
        });

        deleteModal.querySelector('.id-delete-cancel').addEventListener('click', () => {
            deleteModal.classList.add('hidden');
            this.activeDeleteId = null;
        });

        deleteModal.querySelector('.id-delete-confirm').addEventListener('click', () => {
            if (this.activeDeleteId) {
                this.ticketService.delete(this.activeDeleteId, (error) => {
                    if (error) return console.error(error);
                    deleteModal.classList.add('hidden');
                    this.activeDeleteId = null;
                    this.loadTickets();
                });
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = form.querySelector('.form-id').value;
            const name = form.querySelector('.form-input-name').value;
            const description = form.querySelector('.form-input-desc').value;


            if (id) {
                this.ticketService.get(id, (error, ticket) => {
                    if (error) return console.error(error);

                    const updateData = {
                        ...ticket,
                        name: name,
                        description: description
                    };

                    this.ticketService.update(id, updateData, (error) => {
                        if (error) return console.error(error);
                        formModal.classList.add('hidden');
                        this.loadTickets();
                    });
                });
            } else {
                const newData = {
                    name: name,
                    description: description,
                    status: false
                };

                this.ticketService.create(newData, (error) => {
                    if (error) return console.error(error);
                    formModal.classList.add('hidden');
                    this.loadTickets();
                });
            }
        });

        listContainer.addEventListener('click', (e) => {
            const row = e.target.closest('.ticket-row');
            if (!row) return;

            const item = row.closest('.ticket-item');
            const id = item.dataset.id;

            if (e.target.classList.contains('ticket-status')) {
                e.stopPropagation();

                this.ticketService.get(id, (error, ticket) => {
                    if (error) return console.error(error);

                    const updatedData = {
                        ...ticket,
                        status: !ticket.status
                    };

                    this.ticketService.update(id, updatedData, (error) => {
                        if (error) return console.error(error);
                        this.loadTickets();
                    });
                });
                return;
            }

            if (e.target.classList.contains('btn-edit')) {
                e.stopPropagation();
                this.ticketService.get(id, (error, ticket) => {
                    if (error) return console.error(error);
                    form.querySelector('.form-id').value = ticket.id;
                    form.querySelector('.form-input-name').value = ticket.name;
                    form.querySelector('.form-input-desc').value = ticket.description || '';
                    formModal.querySelector('.modal-title').textContent = "Редактировать тикет";
                    formModal.classList.remove('hidden');
                });
                return;
            }

            if (e.target.classList.contains('btn-delete')) {
                e.stopPropagation();
                this.activeDeleteId = id;
                deleteModal.classList.remove('hidden');
                return;
            }

            const descContainer = item.querySelector('.ticket-description');
            if (descContainer.classList.contains('hidden')) {
                this.ticketService.get(id, (error, ticket) => {
                    if (error) return console.error(error);
                    descContainer.textContent = ticket.description || 'Описание отсутствует.';
                    descContainer.classList.remove('hidden');
                });
            } else {
                descContainer.classList.add('hidden');
            }
        });
    }
}
