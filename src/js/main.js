class BaseClass {
    constructor() {
        this.init();
        this.app();
    }

    app() {
        this.totalTime = {number: 480, string: '8h'};
        this.Elements = {
            main: this.Dom('main.wrapper')[0],
            columns: {
                count: 0,
                children: {
                    0: {
                        id: null,
                        dayName: '',
                        date: '',
                        totalWorkedTime: null,
                        totalTime: null,
                        title: 'Worklogs',
                    }
                },
                dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            cards: {
                count: 0,
                children: {
                    0: {
                        parentId: '',
                        title: '',
                        description: '',
                        taskType: '',
                        taskName: '',
                        timeLogged: null,
                    }
                }
            },
            dialog: {
                title: 'Log time',
                inputs: {
                    names: ['task-name', 'description', 'task-type', 'time-spent'],
                }
            }
        };
    }

    init() {
        Element.prototype.addClass = function(className) {
            if (typeof className === 'string') {
                this.classList.add(className);
            } else if (typeof className === 'object') {
                if (className.length) { //an array
                    className.forEach((name) => this.classList.add(name));
                } else {
                    console.error('Invalid type of class name or class names container.');
                }
            }
            return this;
        };

        Element.prototype.removeClass = function(className) {
            if (typeof className === 'string') {
                this.classList.remove(className);
            } else if (typeof className === 'object') {
                if (className.length) { //an array
                    className.forEach((name) => this.classList.remove(name));
                } else {
                    console.error('Invalid type of class name or class names container.');
                }
            }
            return this;
        };

        this.convertStringToTime('7h 30m');
    }

    Dom(selector) {
        return document.querySelectorAll(selector);
    }

    class(className) {
        return document.getElementsByClassName(className);
    }

    id(idName) {
        return document.getElementById(idName);
    }

    createElement(tag, options, parent, append = true) {
        let element = document.createElement(tag);
        if (options['class']) element.addClass(options['class']);
        if (options['id']) element.id = options['id'];

        if (append) parent.append(element);
        else parent.prepend(element);

        return element;
    }

    fixDate(number) {
        if (number < 10) return `0${number}`;
        return number;
    }

    convertStringToTime(string) {
        string = string.replace(/\s/g, '').slice(0, string.length - 2).split('h');
        return Number(string[0]) * 60 + Number(string[1]);
    }

    convertTimeToString() {}
}

const Base = new BaseClass;

class CardClass extends HTMLElement {
    constructor() {
        super();
    }

    create(parentId) {
        let newCard = Base.createElement('log-card',
            {'class': ['column__card', 'card'], 'id': `card-${++Base.Elements.cards.count}`},
            Base.Dom(`#${parentId} .column__body`)[0]);

        this.addToElementsObject(parentId);

        this.createCardHeader(newCard);
        this.createCardBody(newCard);
        this.createCardFooter(newCard);
    }

    addToElementsObject(parentId) {
        Base.Elements.cards.children[Base.Elements.cards.count] = {
            parentId: parentId,
            id: Base.Elements.cards.count,
            title: 'Nazwa karty',
            description: 'Opis karty',
            taskType: 'feature',
            taskName: 'Nazwa taska',
            timeLogged: null,
        };
    }

    createCardHeader(newCard) {
        let newCardHeader = Base.createElement('div',
            {'class': 'card__header'}, newCard);

        let newCardHeaderTitle = Base.createElement('span',
            {'class': 'card__title'}, newCardHeader);
        newCardHeaderTitle.innerText = Base.Elements.cards.children[Base.Elements.cards.count].title;
    }

    createCardBody(newCard) {
        let newCardBody = Base.createElement('div',
            {'class': 'card__body'}, newCard);

        let newCardBodyDescription = Base.createElement('span',
            {'class': 'card__description'}, newCardBody);
        newCardBodyDescription.innerText = Base.Elements.cards.children[Base.Elements.cards.count].description;
    }

    createCardFooter(newCard) {
        let newCardFooter = Base.createElement('div',
            {'class': 'card__footer'}, newCard);

        let newCardFooterTask = Base.createElement('div',
            {'class': 'card__task'}, newCardFooter);

        let newCardFooterTaskIcon = Base.createElement('i',
            {'class': ['card__status-icon', 'status-icon', 'status-icon__feature']}, newCardFooterTask);

        let newCardFooterTaskName = Base.createElement('span',
            {'class': 'card__task-name'}, newCardFooterTask);
        newCardFooterTaskName.innerText = Base.Elements.cards.children[Base.Elements.cards.count].taskName;

        let newCardFooterLoggedTime = Base.createElement('span',
            {'class': 'card__logged-time'}, newCardFooter);
    }
}
customElements.define('log-card', CardClass);
let Card = new CardClass;

class ColumnClass extends HTMLElement {
    constructor() {
        super();
        this.week = this.setWeek();
    }

    setWeek() {
        let week = [];
        this.now = new Date;

        for (let i = 1; i < this.now.getDay(); i++) {
           week.push(this.now.getDate() - this.now.getDay() + i);
        }

        if (week.length === 0) week.push(this.now.getDate());
        for (let i = week.length; i < 7; i++) {
            week.push((week[week.length - 1]%31) + 1);
        }

        return week;
    }

    countTotalTimeInColumn(columnId) {
        return '7h 30m';
    }

    create() {
        let newColumn = Base.createElement('log-column',
            {'class': 'column', 'id': `column-${++Base.Elements.columns.count}`},
            Base.Elements.main);

        this.addToElementsObject();

        this.createColumnHead(newColumn);
        this.createColumnBody(newColumn);
        this.createColumnFooter(newColumn);

        this.addButtonListener(newColumn.id);
    }

    addToElementsObject() {
        Base.Elements.columns.children[Base.Elements.columns.count] = {
            id: Base.Elements.columns.count,
            dayName: Base.Elements.columns.dayNames[Base.Elements.columns.count - 1],
            date: this.week[Base.Elements.columns.count - 1] + '.' + Base.fixDate(this.now.getMonth() + 1),
            totalWorkedTime: this.countTotalTimeInColumn(Base.Elements.columns.count),
            totalTime: '8h',
            title: 'Worklogs',
        };
    }

    setProgress () {

    }

    createColumnHead(newColumn) {
        let newColumnHead = Base.createElement('div',
            {'class': 'column__head'}, newColumn);
        let newColumnHeadDetails = Base.createElement('div',
            {'class': 'column__details'}, newColumnHead);
        let newColumnHeadDate = Base.createElement('p', {'class': 'column__date'}, newColumnHeadDetails);
        let newColumnHeadDateDay = Base.createElement('span',
            {'class': 'column__date-day'}, newColumnHeadDate);
        let newColumnHeadDateDate = Base.createElement('span',
            {'class': 'column__date-date'}, newColumnHeadDate);

        newColumnHeadDateDay.innerText = Base.Elements.columns.children[Base.Elements.columns.count].dayName + ' ';
        newColumnHeadDateDate.innerText = Base.Elements.columns.children[Base.Elements.columns.count].date;

        let newColumnHeadHours = Base.createElement('p',
            {'class': 'column__hours'}, newColumnHeadDetails);
        let newColumnHeadHoursWorked = Base.createElement('span',
            {'class': 'column__hours-worked'}, newColumnHeadHours);
        let newColumnHeadHoursOf = Base.createElement('span',
            {}, newColumnHeadHours);
        let newColumnHeadHoursTotal = Base.createElement('span',
            {'class': 'column__hours-total'}, newColumnHeadHours);

        newColumnHeadHoursWorked.innerText = Base.Elements.columns.children[Base.Elements.columns.count].totalWorkedTime;
        newColumnHeadHoursOf.innerText = ' of ';
        newColumnHeadHoursTotal.innerText = Base.Elements.columns.children[Base.Elements.columns.count].totalTime;

        let newColumnHeadProgress = Base.createElement('div',
            {'class': 'column__progress'}, newColumnHead);
        let newColumnHeadProgressDone = Base.createElement('div',
            {'class': 'column__progress--done',
                'id': `column-${Base.Elements.columns.count}__progress--done`}, newColumnHeadProgress);

        let newColumnHeadTitle = Base.createElement('h2',
            {'class': 'column__title'}, newColumnHead);

        newColumnHeadTitle.innerText = Base.Elements.columns.children[Base.Elements.columns.count].title;
    }

    createColumnBody(newColumn) {
        let newColumnBody = Base.createElement('idv',
            {'class': 'column__body'}, newColumn);
    }

    createColumnFooter(newColumn) {
        let newColumnFooter = Base.createElement('div',
            {'class': 'column__footer'}, newColumn);

        let newColumnButtons = Base.createElement('div',
            {'class': 'column__buttons'}, newColumnFooter);

        let newColumnButtonAdd = Base.createElement('button',
            {'class': ['buttons__add-task', 'button', 'column__button']}, newColumnButtons);

        let newColumnButtonRemove = Base.createElement('button',
            {'class': ['buttons__remove', 'button', 'column__button']}, newColumnButtons);
    }

    addButtonListener(parentId) {
        Base.Dom(`#${parentId} .buttons__add-task`)[0].addEventListener('click', function() {
            if (Dialog.open()) Card.create(parentId);
        });
    }

}
customElements.define('log-column', ColumnClass);
let Column = new ColumnClass;

class DialogClass extends HTMLElement {
    constructor() {
        super();
    }

    open() {
        Base.class('dialog-overlay')[0].removeClass('dialog-overlay--hidden');
        Base.class('dialog')[0].removeClass('dialog--hidden');
        this.state.opened = !this.state.opened;
    }

    close() {
        Base.class('dialog-overlay')[0].addClass('dialog-overlay--hidden');
        Base.class('dialog')[0].addClass('dialog--hidden');
        this.state.opened = !this.state.opened;
    }

    init() {
        this.state = {
            opened: false
        };

        let dialogOverlay = Base.createElement('div',
            {'class': ['dialog-overlay', 'dialog-overlay--hidden']}, Base.Elements.main);

        let dialog = Base.createElement('log-dialog',
            {'class': ['dialog', 'dialog--hidden']}, dialogOverlay);

        this.createDialogContent(dialog);
        this.addButtonListener();
    }

    createDialogContent(dialog) {
        let dialogHeader = Base.createElement('div',
            {'class': 'dialog__header'}, dialog);

        let dialogTitle = Base.createElement('h2',
            {'class': 'dialog__title'}, dialogHeader);
        dialogTitle.innerText = 'Log Time';

        let dialogBody = Base.createElement('div',
            {'class': 'dialog__body'}, dialog);
        dialogTitle.innerText = 'Log Time';

        for (let input of Base.Elements.dialog.inputs.names) {
            let dialogInputContainer = Base.createElement('div',
                {'class': ['dialog__input-container', 'input-container', `input-container__${input}`]}, dialogBody);
            let dialogInput;
            if (input === 'description') {
                dialogInput = Base.createElement('textarea',
                    {'class': ['dialog__input', 'input', `input__${input}`]}, dialogInputContainer);
            } else if (input === 'task-type') {
                dialogInput = Base.createElement('select',
                    {'class': ['dialog__input', 'input', 'select', `input__${input}`]}, dialogInputContainer);

                for (let type of ['feature', 'bug', 'urgent']) {
                    let dialogInputOption = Base.createElement('option',
                        {'class': ['dialog__input--option', 'select__option', `input__${input}`]}, dialogInput);
                    dialogInputOption.innerText = type;
                }
            } else {
                dialogInput = Base.createElement('input',
                    {'class': ['dialog__input', 'input', `input__${input}`]}, dialogInputContainer);
                dialogInput.type = 'text';
            }
            let dialogInputLabel = Base.createElement('label',
                {'class': ['dialog__input-label', 'input-label', `input-label__${input}`]}, dialogInputContainer);

            dialogInput.name = `input__${input}`;
            dialogInputLabel.innerText = input;
            dialogInput.required = true;
            dialogInput.minLength = 1;
        }

        let dialogFooter = Base.createElement('div',
            {'class': 'dialog__footer'}, dialog);

        let dialogButtons = Base.createElement('div',
            {'class': 'dialog__buttons'}, dialogFooter);

        let dialogButtonSubmit = Base.createElement('button',
            {'class': ['dialog__button', 'button', 'dialog__button--submit']}, dialogButtons);
        dialogButtonSubmit.innerText = 'Submit';

        let dialogButtonCancel = Base.createElement('button',
            {'class': ['dialog__button', 'button', 'dialog__button--cancel']}, dialogButtons);
        dialogButtonCancel.innerText = 'Cancel';
    }

    addButtonListener() {
        Base.Dom(`.dialog__button.dialog__button--cancel`)[0].addEventListener('click', () => {
            console.info(this.state.opened);
            if (this.state.opened === true) {
                this.close();
            }
        });
    }
}
customElements.define('log-dialog', DialogClass);
let Dialog = new DialogClass;

class Main {
    constructor() {
        Base.init();
        Dialog.init();
        Dialog.open();
    }

    init() {
        this.createColumns(5);
        this.createCard('column-1');
    }

    createColumns(quantity) {
        for (let i = 0; i < quantity; i++) Column.create();
    }

    createCard(parentId) {
        Card.create(parentId);
    }

}

(new Main()).init();
