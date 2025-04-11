class Accordion {
    data: { items: any; };
    wrapper: HTMLDivElement;

    constructor({ data }) {
        this.data = { items: data?.items || [] };
        this.wrapper = undefined;
    }

    static get toolbox() {
        return {
            title: 'Accordion',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
        };
    }

    /**
     * Render phần hiển thị (view) của accordion
     */
    render() {
        this.wrapper = document.createElement('div');
        const uniqueId = `editorjs-accordion-${Date.now()}`; // Tạo ID duy nhất
        if (this.data.items.length > 0) {
            this.wrapper.classList.add('accordion');
            this.wrapper.id = uniqueId;
            this.data.items.forEach((item: { title: string; content: string; }, index: number) => {
                this.addItemView(item.title, item.content, index, uniqueId);
            });
        }
        else {
            // Nếu không có item nào, tạo một item mặc định
            this.wrapper.classList.add('accordion');
            this.wrapper.id = uniqueId;
            this.addItemView('Header accordion', 'Body accordion', Date.now(), uniqueId);
        }
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Item';
        addButton.classList.add('btn', 'btn-primary', 'mt-3');
        addButton.addEventListener('click', () => this.addItemView('Header accordion', 'Body accordion', Date.now(), uniqueId));
        this.wrapper.appendChild(addButton);
        return this.wrapper;
    }

    /**
     * Thêm mục vào phần hiển thị (view)
     */
    addItemView(title = '', content = '', index = Date.now(), parentId: string) {
        const itemWrapper = document.createElement('div');
        itemWrapper.classList.add('accordion-item');

        const headerId = `heading-${index}`;
        const collapseId = `${parentId}-collapse-${index}`;

        const header = document.createElement('h2');
        header.classList.add('accordion-header');
        header.id = headerId;

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = title;
        titleInput.placeholder = 'Title';
        titleInput.classList.add('form-control', 'accordion-title-input', 'mb-2');

        const button = document.createElement('button');
        button.classList.add('accordion-button');
        if (!title && index === 0) {
            button.classList.add('collapsed');
        }
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#${collapseId}`);
        button.setAttribute('aria-expanded', title ? 'true' : 'false');
        button.setAttribute('aria-controls', collapseId);

        // Append the title input to the button
        button.appendChild(titleInput);

        header.appendChild(button);

        const collapse = document.createElement('div');
        collapse.id = collapseId;
        collapse.classList.add('accordion-collapse');
        if (index === 0) {
            collapse.classList.add('show');
        }
        else {
            collapse.classList.add('collapse');
        }
        collapse.setAttribute('aria-labelledby', headerId);
        collapse.setAttribute('data-bs-parent', '#editorjs-accordion');

        const body = document.createElement('div');
        body.classList.add('accordion-body');

        const contentInput = document.createElement('textarea');
        contentInput.placeholder = 'Content';
        contentInput.value = content;
        contentInput.classList.add('form-control', 'mb-2');
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.addEventListener('click', () => {
            this.wrapper.removeChild(itemWrapper);
        });

        body.appendChild(contentInput);
        body.appendChild(removeButton);

        collapse.appendChild(body);
        itemWrapper.appendChild(header);
        itemWrapper.appendChild(collapse);

        this.wrapper.insertBefore(itemWrapper, this.wrapper.lastChild);

    }

    save() {
        const items = Array.from(this.wrapper.querySelectorAll('.accordion-item')).map((item) => {
            const title = ((item as HTMLElement).querySelector('.accordion-title-input') as HTMLInputElement)?.value || '';
            const content = ((item as HTMLElement).querySelector('.accordion-body textarea') as HTMLTextAreaElement)?.value || '';
            return { title, content };
        });
        return { items };
    }
}

export default Accordion;