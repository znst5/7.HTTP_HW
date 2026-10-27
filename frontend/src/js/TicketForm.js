
export default class TicketForm {
    constructor(onSubmitCallback) {
        this.element = null;
        this.onSubmitCallback = onSubmitCallback;
    }

    bindToDOM(parent) {
        const modal = document.createElement('div');
        modal.className = 'modal hidden';

        const container = document.createElement('div');
        container.className = 'modal-form-container';

        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = 'Добавить тикет';

        const form = document.createElement('form');
        form.className = 'modal-form';

        const inputId = document.createElement('input');
        inputId.type = 'hidden';
        inputId.name = 'id';
        inputId.className = 'form-id';

        const labelName = document.createElement('label');
        labelName.className = 'form-label';
        labelName.textContent = 'Краткое описание ';

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.name = 'name';
        inputName.className = 'form-input-name';
        inputName.required = true;
        labelName.appendChild(inputName);

        const labelDesc = document.createElement('label');
        labelDesc.className = 'form-label';
        labelDesc.textContent = 'Подробное описание ';

        const textareaDesc = document.createElement('textarea');
        textareaDesc.name = 'description';
        textareaDesc.className = 'form-input-desc';
        textareaDesc.rows = 4;
        labelDesc.appendChild(textareaDesc);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'btn btn-cancel';
        btnCancel.textContent = 'Отмена';

        const btnOk = document.createElement('button');
        btnOk.type = 'submit';
        btnOk.className = 'btn btn-ok';
        btnOk.textContent = 'Ok';

        buttonsContainer.appendChild(btnCancel);
        buttonsContainer.appendChild(btnOk);

        form.appendChild(inputId);
        form.appendChild(labelName);
        form.appendChild(labelDesc);
        form.appendChild(buttonsContainer);

        container.appendChild(title);
        container.appendChild(form);
        modal.appendChild(container);
        parent.appendChild(modal);

        this.element = modal;

        this.form = form;
        this.titleElement = title;
        this.idInput = inputId;
        this.nameInput = inputName;
        this.descInput = textareaDesc;

        btnCancel.addEventListener('click', () => this.close());

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                id: this.idInput.value || null,
                name: this.nameInput.value,
                description: this.descInput.value,
            };

            if (this.onSubmitCallback) {
                this.onSubmitCallback(formData);
            }
        });
    }

    openForCreate() {
        this.form.reset();
        this.idInput.value = '';
        this.titleElement.textContent = 'Добавить тикет';
        this.element.classList.remove('hidden');
    }

    openForEdit() {
        this.idInput.value = ticket.id;
        this.nameInput.value = ticket.name;
        this.descInput.value = ticket.description || '';
        this.titleElement.textContent = 'Изменить тикет';
        this.element.classList.remove('hidden');
    }

    close() {
        this.element.classList.add('hidden');
        this.form.reset();
    }
}
