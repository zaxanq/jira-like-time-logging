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
                        totalWorkedTime: {
                            number: 0,
                            string: '0h'
                        },
                        totalTime: null,
                        title: 'Worklogs',
                    }
                },
                DOM: {
                    0: {
                        column: null,
                        totalWorkedTime: null,
                        progress: null,
                    }
                },
                dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            cards: {
                count: 0,
                children: {
                    0: {
                        parentId: '',
                        cardName: '',
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
                    names: ['card-name', 'description', 'task-name', 'task-type', 'time-spent'],
                    labels: ['Card name', 'Description', 'Task name', '', 'Time spent'],
                    DOM: [],
                },
                buttons: {}
            }
        };
        this.message = {
            warning: {
                requiredInput: 'This input is required.',
                invalidValue: 'Invalid time value',
                invalidTaskNameFormat: 'Invalid task name format',
            }
        }
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

    checkTime(string) {
        let regExp = /([0-9]{1,2}h|[0-9]{1,3}m)/g;
        let timeValues = string.match(regExp);
        let hours = '',
            minutes = '';

        for (let i = 0; i < timeValues.length; i++) {
            if (hours && minutes) break;
            if (timeValues[i].includes('h') && !hours) hours = timeValues[i];
            else if (timeValues[i].includes('m') && !minutes) minutes = timeValues[i];
        }

        return [hours, minutes];
    }

    convertStringToTime(string) {
        let removeLastChar = (string) => {
            return string.slice(0, string.length - 1);
        };

        let [hours, minutes] = this.checkTime(string);
        return Number(removeLastChar(hours)) * 60 + Number(removeLastChar(minutes));
    }

    convertTimeToString(number) {
        let hours = Math.floor(number / 60);
        let minutes = number % 60;
        return hours === 0 ? `${minutes}m` : minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
    }
}

const Base = new BaseClass;

class CardClass extends HTMLElement {
    constructor() {
        super();
    }

    create(parentId) {
        let newCard = Base.createElement('log-card',
            {'class': ['column__card', 'card'], 'id': `card-${Base.Elements.cards.count}`},
            Base.Dom(`#${parentId} .column__body`)[0]);

        this.addToElementsObject(parentId);

        this.createCardHeader(newCard);
        this.createCardBody(newCard);
        this.createCardFooter(newCard);
    }

    addToElementsObject(parentId) {
        Base.Elements.cards.children[Base.Elements.cards.count].parentId = parentId;
        Base.Elements.cards.children[Base.Elements.cards.count].id = Base.Elements.cards.count;
    }

    createCardHeader(newCard) {
        let newCardHeader = Base.createElement('div',
            {'class': 'card__header'}, newCard);

        let newCardHeaderTitle = Base.createElement('span',
            {'class': 'card__name'}, newCardHeader);
        newCardHeaderTitle.innerText = Base.Elements.cards.children[Base.Elements.cards.count].cardName;
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
            {'class': ['card__status-icon', 'status-icon',
                    `status-icon__${Base.Elements.cards.children[Base.Elements.cards.count].taskType}`]},
            newCardFooterTask);

        let newCardFooterTaskName = Base.createElement('span',
            {'class': 'card__task-name'}, newCardFooterTask);
        newCardFooterTaskName.innerText = Base.Elements.cards.children[Base.Elements.cards.count].taskName;

        let newCardFooterLoggedTime = Base.createElement('span',
            {'class': 'card__logged-time'}, newCardFooter);
        newCardFooterLoggedTime.innerText = Base.convertTimeToString(
            Base.convertStringToTime(Base.Elements.cards.children[Base.Elements.cards.count].timeLogged));
    }

    fetchDataFromDialog() {
        Base.Elements.cards.children[++Base.Elements.cards.count] = {
            cardName: Base.Elements.dialog.inputs.DOM[0].value,
            description: Base.Elements.dialog.inputs.DOM[1].value,
            taskName: Base.Elements.dialog.inputs.DOM[2].value,
            taskType: Base.Elements.dialog.inputs.DOM[3].value,
            timeLogged: Dialog.DialogInputTimeSpent,
        };
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
        return {number: 0, string: '0h'};
    }

    create() {
        Base.Elements.columns.DOM[++Base.Elements.columns.count] = {};

        let newColumn = Base.createElement('log-column',
            {'class': 'column', 'id': `column-${Base.Elements.columns.count}`},
            Base.Elements.main);
        Base.Elements.columns.DOM[Base.Elements.columns.count].column = newColumn;

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

    createColumnHead(newColumn) {
        let newColumnHead = Base.createElement('div',
            {'class': 'column__head'}, newColumn);

        let newColumnHeadDetails = Base.createElement('div',
            {'class': 'column__details'}, newColumnHead);

        let newColumnHeadDate = Base.createElement('p', {'class': 'column__date'}, newColumnHeadDetails);

        let newColumnHeadDateDay = Base.createElement('span',
            {'class': 'column__date-day'}, newColumnHeadDate);
        newColumnHeadDateDay.innerText = Base.Elements.columns.children[Base.Elements.columns.count].dayName + ' ';

        let newColumnHeadDateDate = Base.createElement('span',
            {'class': 'column__date-date'}, newColumnHeadDate);
        newColumnHeadDateDate.innerText = Base.Elements.columns.children[Base.Elements.columns.count].date;

        let newColumnHeadHours = Base.createElement('p',
            {'class': 'column__hours'}, newColumnHeadDetails);

        let newColumnHeadHoursWorked = Base.createElement('span',
            {'class': 'column__hours-worked'}, newColumnHeadHours);
        Base.Elements.columns.DOM[Base.Elements.columns.count].totalWorkedTime = newColumnHeadHoursWorked;
        newColumnHeadHoursWorked.innerText =
            Base.Elements.columns.children[Base.Elements.columns.count].totalWorkedTime.string;

        let newColumnHeadHoursOf = Base.createElement('span',
            {}, newColumnHeadHours);
        newColumnHeadHoursOf.innerText = ' of ';

        let newColumnHeadHoursTotal = Base.createElement('span',
            {'class': 'column__hours-total'}, newColumnHeadHours);
        newColumnHeadHoursTotal.innerText = Base.Elements.columns.children[Base.Elements.columns.count].totalTime;

        let newColumnHeadProgress = Base.createElement('div',
            {'class': 'column__progress'}, newColumnHead);

        let newColumnHeadProgressDone = Base.createElement('div',
            {'class': 'column__progress--done',
                'id': `column-${Base.Elements.columns.count}__progress--done`}, newColumnHeadProgress);
        Base.Elements.columns.DOM[Base.Elements.columns.count].progress = newColumnHeadProgressDone;

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
            if (Dialog.open(parentId)) Card.create(parentId);
        });
    }

    getTimeLogged(time, column) {
        time = Base.convertStringToTime(time);
        console.log('time:', time);

        Base.Elements.columns.children[column.charAt(column.length - 1)].totalWorkedTime.number += time;
        this.updateTimeLoggedString(column.charAt(column.length - 1));
    }

    updateTimeLoggedString(columnNo) {
        Base.Elements.columns.children[columnNo].totalWorkedTime.string =
            Base.convertTimeToString(Base.Elements.columns.children[columnNo].totalWorkedTime.number);

        console.log(Base.Elements.columns.children[columnNo].totalWorkedTime.string);
        console.log(Base.Elements.columns.children[columnNo].totalWorkedTime.number);
        this.renderWorkedTime(columnNo);
        this.renderProgress(columnNo);
    }

    renderWorkedTime(columnNo) {
        Base.Elements.columns.DOM[columnNo].totalWorkedTime.innerText =
            Base.Elements.columns.children[columnNo].totalWorkedTime.string;
    }

    renderProgress(columnNo) {
        Base.Elements.columns.DOM[columnNo].progress.setAttribute('style',
            `width: ${Base.Elements.columns.children[columnNo].totalWorkedTime.number / Base.totalTime.number * 100}%`);
    }

}
customElements.define('log-column', ColumnClass);
let Column = new ColumnClass;

class DialogClass extends HTMLElement {
    constructor() {
        super();
    }

    open(columnId) {
        Base.class('dialog-overlay')[0].removeClass('dialog-overlay--hidden');
        Base.class('dialog')[0].removeClass('dialog--hidden');
        this.state.opened = !this.state.opened;
        this.state.openedBy = columnId;
    }

    close() {
        Base.class('dialog-overlay')[0].addClass('dialog-overlay--hidden');
        Base.class('dialog')[0].addClass('dialog--hidden');
        this.state.opened = !this.state.opened;
        this.state.openedBy = '';
        setTimeout(() => {
            this.dialog.parentNode.removeChild(this.dialog);
            this.dialogOverlay.parentNode.removeChild(this.dialogOverlay);
            this.init();
        }, 500);

    }

    init() {
        Base.Elements.dialog.inputs.DOM = [];
        Base.Elements.dialog.buttons = {};
        this.state = {
            opened: false,
            openedBy: '',
        };

        this.dialogOverlay = Base.createElement('div',
            {'class': ['dialog-overlay', 'dialog-overlay--hidden']}, Base.Elements.main);

        this.dialog = Base.createElement('log-dialog',
            {'class': ['dialog', 'dialog--hidden']}, this.dialogOverlay);

        this.dialogForm = Base.createElement('form',
            {}, this.dialog);

        this.createDialogContent();
        this.addListeners();
    }

    createDialogContent() {
        let dialogHeader = Base.createElement('div',
            {'class': 'dialog__header'}, this.dialogForm);

        let dialogTitle = Base.createElement('h2',
            {'class': 'dialog__title'}, dialogHeader);
        dialogTitle.innerText = 'Log Time';

        let dialogBody = Base.createElement('div',
            {'class': 'dialog__body'}, this.dialogForm);
        dialogTitle.innerText = 'Log Time';

        let Inputs = Base.Elements.dialog.inputs;
        for (let i = 0; i < Inputs.names.length; i++) {
            let dialogInputContainer = Base.createElement('div',
                {'class': ['dialog__input-container', 'input-container', `input-container__${Inputs.names[i]}`]}, dialogBody);
            let dialogInput;
            if (Inputs.names[i] === 'description') {
                dialogInput = Base.createElement('textarea',
                    {'class': ['dialog__input', 'input', `input__${Inputs.names[i]}`]}, dialogInputContainer);
            } else if (Inputs.names[i] === 'task-type') {
                dialogInput = Base.createElement('select',
                    {'class': ['dialog__input', 'input', 'select', `input__${Inputs.names[i]}`]}, dialogInputContainer);

                for (let type of ['feature', 'bug', 'urgent']) {
                    let dialogInputOption = Base.createElement('option',
                        {'class': ['dialog__input--option', 'select__option', `input__${Inputs.names[i]}`]}, dialogInput);
                    dialogInputOption.innerText = type;
                }
            } else {
                dialogInput = Base.createElement('input',
                    {'class': ['dialog__input', 'input', `input__${Inputs.names[i]}`]}, dialogInputContainer);
                dialogInput.type = 'text';
            }
            Base.Elements.dialog.inputs.DOM.push(dialogInput);

            let dialogInputLabel = Base.createElement('label',
                {'class': ['dialog__input-label', 'input-label', `input-label__${Inputs.names[i]}`]}, dialogInputContainer);

            let dialogInputWarningContainer = Base.createElement('span',
                {'class': ['dialog__input-warning', 'input-warning']}, dialogInputContainer);

            dialogInput.name = `input__${Inputs.names[i]}`;
            dialogInput.placeholder = ' ';
            dialogInputLabel.innerText = Inputs.labels[i];
            dialogInput.minLength = 1;
        }

        let dialogFooter = Base.createElement('div',
            {'class': 'dialog__footer'}, this.dialogForm);

        let dialogButtons = Base.createElement('div',
            {'class': 'dialog__buttons'}, dialogFooter);

        this.dialogButtonSubmit = Base.createElement('input',
            {'class': ['dialog__button', 'button', 'dialog__button--submit']}, dialogButtons);
        this.dialogButtonSubmit.innerText = 'Submit';
        this.dialogButtonSubmit.type = 'submit';
        Base.Elements.dialog.buttons.submit = this.dialogButtonSubmit;

        this.dialogButtonCancel = Base.createElement('button',
            {'class': ['dialog__button', 'button', 'dialog__button--cancel']}, dialogButtons);
        this.dialogButtonCancel.innerText = 'Cancel';
        Base.Elements.dialog.buttons.cancel = this.dialogButtonCancel;
    }

    addListeners() {
        this.dialogForm.addEventListener('submit', event => {
            event.stopPropagation();
            event.preventDefault();
            if (this.state.opened === true && this.validation() === true) {
                Card.fetchDataFromDialog();
                Column.getTimeLogged(Base.Elements.cards.children[Base.Elements.cards.count].timeLogged,
                    this.state.openedBy);
                Card.create(this.state.openedBy);
                this.close();
            }
        });

        this.dialogButtonCancel.addEventListener('input', event => {
            event.stopPropagation();
            if (this.state.opened === true) {
                this.close();
            }
        });
        this.dialogOverlay.addEventListener('mousedown', event => {
            event.stopPropagation();
            if (this.state.opened === true) {
                this.close();
            }
        });
        this.dialog.addEventListener('mousedown', event => {
            event.stopPropagation();
        });

        Base.Elements.dialog.inputs.DOM.forEach(input => {
            input.addEventListener('input', () => {
                this.clearInvalidInputState(input);
            });
        });
    }

    clearInvalidInputState(input) {
        input.classList.remove('dialog__input--invalid');
        input.parentNode.lastElementChild.innerText = '';
    }

    addInvalidInputState(input, state) {
        input.addClass('dialog__input--invalid');
        input.parentNode.lastElementChild.innerText = Base.message.warning[state];
    }

    validation() {
        for (let input of Base.Elements.dialog.inputs.DOM) {
            if (!this.checkInput(input).result) {
                this.addInvalidInputState(input, this.checkInput(input).reason);
                return false;
            }
        }
        return true;
    }

    checkInput(input) {
        if (!input.value && input.name !== 'input__description') return {result: false, reason: 'requiredInput'};
        else if (input.name === 'input__task-name') return this.checkInputTaskName();
        else if (input.name === 'input__time-spent') return this.checkInputTimeSpent();
        return {result: true, reason: ''}
    }

    checkInputTaskName() {
        let regExp = /^([a-zA-Z]{3}-[0-9]*)$/g;

        this.DialogInputTaskName = Base.Elements.dialog.inputs.DOM[2].value.match(regExp);

        if (this.DialogInputTaskName) return {result: true, reason: ''};
        return {result: false, reason: 'invalidTaskNameFormat'};
    }

    checkInputTimeSpent() {
        let regExp = /([0-9]{1,2}h|[0-9]{1,3}m)/g;

        // get all data that looks like time ("30m", "5h", "4h20m", "5h 50m", "50m1h", "40m 4h"
        this.DialogInputTimeSpent = Base.Elements.dialog.inputs.DOM[4].value.match(regExp);

        if (this.DialogInputTimeSpent) { // if such time value exists
            this.DialogInputTimeSpent = this.DialogInputTimeSpent.filter(
                (value) => Base.convertStringToTime(value) > 0); // filter out everything "bigger" than "0m" or "0h"
                // check it again and return first hour value ("__h") and first minute value ("__m")
                //  Right now this.DailogInputTimeSpent is an array of all time values. We need to join it before
                // use as a parameter of Base.checkTime().
                //  The Base.checkTime() will return pair of [hours,minutes], so we join it back into string.
            this.DialogInputTimeSpent = Base.checkTime(this.DialogInputTimeSpent.join('')).join('');

            return {result: true, reason: ''};
        }
        return {result: false, reason: 'invalidValue'};
    }
}
customElements.define('log-dialog', DialogClass);
let Dialog = new DialogClass;

class Main {
    constructor() {
        Base.init();
        Dialog.init();
    }

    init() {
        this.createColumns(5);
    }

    createColumns(quantity) {
        for (let i = 0; i < quantity; i++) Column.create();
    }

}

(new Main()).init();
