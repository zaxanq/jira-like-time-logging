class BaseClass {
    /* Base class containing common methods and prototype methods. */

    constructor() {
        this.app();
        this.init();
    }

    app() {
        this.totalTime = {number: 480, string: '8h'};
        this.Elements = { // main object that stores most of data/DOM links.
            main: this.Dom('main.wrapper')[0],
            columns: {
                count: 0,
                children: {
                    0: {}
                },
                DOM: {
                    0: {}
                },
                dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // displayed in Column head
            },
            cards: {
                count: 0,
                children: {
                    0: {}
                }
            },
            dialog: {
                title: 'Log time',
                inputs: {
                    names: ['card-name', 'description', 'task-name', 'task-type', 'time-spent'],
                    labels: ['Card name', 'Description', 'Task name', '', 'Time spent'],
                    DOM: []
                },
                buttons: {}
            }
        };
        this.message = {
            warning: {
                requiredInput: 'This input is required.',
                invalidValue: 'Invalid time value',
                invalidTaskNameFormat: 'Invalid task name format',
            },
            error: {
                invalidClassName: 'Invalid type of class name or class names container.',
            }
        }
    }

    init() {
        Element.prototype.addClass = function(className) {
            if (typeof className === 'string') {
                this.classList.add(className);
            } else if (typeof className === 'object') {
                if (className.length) { // checking if it's an array
                    className.forEach((name) => this.classList.add(name));
                } else {
                    console.error(this.message.error.invalidClassName);
                }
            }
            return this;
        };

        Element.prototype.removeClass = function(className) {
            if (typeof className === 'string') {
                this.classList.remove(className);
            } else if (typeof className === 'object') {
                if (className.length) { // checking if it's an array
                    className.forEach((name) => this.classList.remove(name));
                } else {
                    console.error(this.message.error.invalidClassName);
                }
            }
            return this;
        };
    }

    Dom(selector) { // shortcut method
        return document.querySelectorAll(selector);
    }

    class(className) { // shortcut method
        return document.getElementsByClassName(className);
    }

    id(idName) { // shortcut method
        return document.getElementById(idName);
    }

    createElement(tag, options, parent, append = true) {
        /*  Input: tag (string), options (object), parent element (Node), append (boolean).
            Output: HTML element (Node)
            Method creates an element with given tag, inside a given parent.
            Append attribute decides whether the element should be added as the first or last child.
            Options can contain class and id names,
                i.e.: {class: 'button'} or {class: ['button', 'button-dark'], id: 'button-5'}
         */
        let element = document.createElement(tag);
        if (options['class']) element.addClass(options['class']);
        if (options['id']) element.id = options['id'];

        if (append) parent.append(element);
        else parent.prepend(element);

        return element;
    }

    fixDate(number) {
        /*  Method adds a '0' to the beginning of number if it's smaller than 10. It return it as a string.
            If no '0' was added, method returns inputted number (as a number).
         */
        if (number < 10) return `0${number}`;
        return number;
    }

    checkTime(string) {
        /*  Input: string
            Output: array (containing 2 elements)
            Method takes a string and looks for a RegExp matches in order to get an array of time values.
            Next a for loop will get first appearance of "__h" and "__m" (where __ = any number) and assign it to
                variables 'hours' and 'minutes'.
            Finally, these 2 variables are returned in an array.
         */
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
        /*  Input: string
            Output: number
            Method gets a string with time value (i.e: "7h30m", "5h" "10m" "20m 4h", "1h 10m").
            With a help of a Base.checkTime() method it returns a number of minutes.
         */
        let removeLastChar = (string) => string.slice(0, string.length - 1); // removes a (last) letter from a time value

        let [hours, minutes] = this.checkTime(string);
        return Number(removeLastChar(hours)) * 60 + Number(removeLastChar(minutes));
    }

    convertTimeToString(number) {
        /*  Input: number
            Output: string
            Method gets a number of minutes and returns it as a string in given format: "HHh MMm"
                where 'HH' is a number of hours and 'MM' is a number of minutes.
            If number of hours or minutes is equal to 0 it is not displayed (i.e. "0h 30m" -> "30m", "5h 0m" -> "5h")
         */
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

    fetchDataFromDialog() {
        /*  Input: -
            Output: -
            This method is used to gather all data inserted into Dialog inputs into Elements.cards object.
            Elements.cards object will later deliver this data (in Card.create() method) to fill the card with info.
         */
        Base.Elements.cards.children[++Base.Elements.cards.count] = {
            cardName: Base.Elements.dialog.inputs.DOM[0].value,
            description: Base.Elements.dialog.inputs.DOM[1].value,
            taskName: Base.Elements.dialog.inputs.DOM[2].value,
            taskType: Base.Elements.dialog.inputs.DOM[3].value,
            timeLogged: Dialog.DialogInputTimeSpent,
        };
    }

    create(parentId) {
        /*  Input: id of a column in which the Card is supposed to be created in (string)
            Output: Card element (Node)
            Method creates a <log-card></log-card> element (a "Card"), that displays a task.
            The Card is created only after Dialog form is submitted and it is validated as correct.
            This method uses data from Elements.cards.
         */
            // Card element
        let newCard = Base.createElement('log-card',
            {'class': ['column__card', 'card'], 'id': `card-${Base.Elements.cards.count}`},
            Base.Dom(`#${parentId} .column__body`)[0]);

        this.addToElementsObject(parentId); // new card will be added to Base.Elements.cards object.

        this.createCardHeader(newCard);
        this.createCardBody(newCard);
        this.createCardFooter(newCard);
        return newCard;
    }

    addToElementsObject(parentId) {
        /*  Input: Input: id of a column in which the Card is supposed to be created in (string)
            Output: -
            Method adds parent column id and card id (card number) to Elements object.
         */
        Base.Elements.cards.children[Base.Elements.cards.count].parentId = parentId;
        Base.Elements.cards.children[Base.Elements.cards.count].id = Base.Elements.cards.count;
    }

    createCardHeader(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card header and everything that it should contain (card name).
         */
        let newCardHeader = Base.createElement('div',
            {'class': 'card__header'}, newCard);

        let newCardHeaderTitle = Base.createElement('span',
            {'class': 'card__name'}, newCardHeader);
        newCardHeaderTitle.innerText = Base.Elements.cards.children[Base.Elements.cards.count].cardName;
    }

    createCardBody(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card body and everything that it should contain (task description).
         */
        let newCardBody = Base.createElement('div',
            {'class': 'card__body'}, newCard);

        let newCardBodyDescription = Base.createElement('span',
            {'class': 'card__description'}, newCardBody);
        newCardBodyDescription.innerText = Base.Elements.cards.children[Base.Elements.cards.count].description;
    }

    createCardFooter(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card fppter and everything that it should contain (task type, task name and logged tie).
         */
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
}
customElements.define('log-card', CardClass);
let Card = new CardClass;

class ColumnClass extends HTMLElement {
    constructor() {
        super();
    }

    setWeek(quantity) {
        /*  Input: quantity (number)
            Output: an array of quantity length
            Method takes current date and day of the week in order to return an array with all days of the current week.
         */

        const getDaysInMonth = (month, year) => {
            let date = new Date(Date.UTC(year, month, 1));
            let days = [];
            while (date.getMonth() === month) {
                days.push(new Date(date).getDate());
                date.setDate(date.getDate() + 1);
            }
            return days;
        };

        let week = [];
        this.now = new Date();

        this.currentMonth = getDaysInMonth(this.now.getMonth(), this.now.getFullYear());
        this.nextMonth = getDaysInMonth(this.now.getMonth() + 1, this.now.getFullYear());

        for (let i = 1; i < this.now.getDay(); i++) { // add days until today
           week.push(this.now.getDate() - this.now.getDay() + i);
        }
        if (week.length === 0) week.push(this.now.getDate()); // if week is empty then it's the first day of the week

        let j = this.currentMonth.indexOf(week[week.length - 1]) + 1; // find index of tomorrow (next day to add)
        for (let i = 0; i < this.currentMonth.length - j; i++) { // add future days until a month is finished
            week.push(this.currentMonth[j+i]);
        }
            // convert number of day in month into full date (day.month)
        week = week.map((day) => Base.fixDate(day) + '.' + Base.fixDate(this.now.getMonth() + 1));
        if (week.length >= quantity) return week; // if last day of month is also last day needed then finish
            // set number of elements we already have
        let weekLength = week.length;
        for (let i = 0; i < quantity - weekLength; i++) { // add future days from next month
            week.push(Base.fixDate(this.nextMonth[i]) + '.' + Base.fixDate(this.now.getMonth() + 2));
        }

        return week;
    }

    create(quantity) {
        /*  Input: quantity (number)
            Output: -
            Method creates a <log-column></log-column> Column and all that should be contained in it.
         */
            // at first create() execution execute setWeek()
        if (!this.week) this.week = this.setWeek(quantity);

            // create new sub object
        Base.Elements.columns.DOM[++Base.Elements.columns.count] = {};

            // a Column element.
        let newColumn = Base.createElement('log-column',
            {'class': 'column', 'id': `column-${Base.Elements.columns.count}`},
            Base.Elements.main);
        Base.Elements.columns.DOM[Base.Elements.columns.count].column = newColumn;

        this.addToElementsObject(); // new card will be added to Base.Elements.columns object.

        this.createColumnHead(newColumn);
        this.createColumnBody(newColumn);
        this.createColumnFooter(newColumn);

        this.addButtonListener(newColumn.id);  // add EventListeners for Column buttons
    }

    addToElementsObject() {
        /*  Input: -
            Output: -
            Creates a "starter" Elements.columns sub object containing starting data. Some of it will later be updated.
         */
        //this.week[Base.Elements.columns.count - 1] + '.' + Base.fixDate(this.now.getMonth() + 1)

        Base.Elements.columns.children[Base.Elements.columns.count] = {
            id: Base.Elements.columns.count,
            dayName: Base.Elements.columns.dayNames[(Base.Elements.columns.count - 1) % 7],
            date: this.week[Base.Elements.columns.count - 1],
            totalWorkedTime: {number: 0, string: '0h'},
            totalTime: '8h',
            title: 'Worklogs',
        };
    }

    createColumnHead(newColumn) {
        /*  Input: Column element (Node)
            Output: -
            Creates a Column head and everything that it should contain (date, logged hours, total hours, progress bar).
         */
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
        /*  Input: Column element (Node)
            Output: -
            Creates a Column body, which will be a container for Cards.
         */
        let newColumnBody = Base.createElement('div',
            {'class': 'column__body'}, newColumn);
    }

    createColumnFooter(newColumn) {
        /*  Input: Column element (Node)
            Output: -
            Creates a Column footer and Column buttons.
         */
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
        /*  Input: Column id (string)
            Output: -
            Adds an EventListener to Column buttons.
            Add-task button will open a Dialog and if the Dialog.open() return true, it will create a Card.
         */
        Base.Dom(`#${parentId} .buttons__add-task`)[0].addEventListener('click', function() {
            if (Dialog.open(parentId)) Card.create(parentId);
        });
    }

    getTimeLogged(time, columnId) {
        /*  Input: time (string), columnId (string)
            Output: -
            Method takes a time value and converts it to a number, which is later added to total worked time
                in Elements.columns object. Then new total worked time number value is taken to update the
                total worked time string value.
            With both these values renderWorkedTime() and renderProgress() can be now executed.
         */
        let columnNo = columnId.charAt(columnId.length - 1);

        time = Base.convertStringToTime(time);

        Base.Elements.columns.children[columnNo].totalWorkedTime.number += time;
        Base.Elements.columns.children[columnNo].totalWorkedTime.string =
            Base.convertTimeToString(Base.Elements.columns.children[columnNo].totalWorkedTime.number);
        this.renderWorkedTime(columnNo);
        this.renderProgress(columnNo);
    }

    renderWorkedTime(columnNo) {
        /*  Input: columnNo (string with a digit)
            Output: -
            Updates total worked time in a Column header with new (updated) value from Elements.columns object.
         */
        Base.Elements.columns.DOM[columnNo].totalWorkedTime.innerText =
            Base.Elements.columns.children[columnNo].totalWorkedTime.string;
    }

    renderProgress(columnNo) {
        /*  Input: columnNo (string with a digit)
            Output: -
            Updates inline css width of progress bar(--done) based on new (update) value from Elements.columns object.
         */
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
        /*  Input: columnId (string)
            Output: -
            This method shows the Dialog overlay (dark transparent div between app and dialog) and the Dialog itself.
            There is a small security measure in form of a state that changes when Dialog is opened correctly
                so that it will not work if Dialog is shown with a help of Dev Tools.
         */
        Base.class('dialog-overlay')[0].removeClass('dialog-overlay--hidden');
        Base.class('dialog')[0].removeClass('dialog--hidden');
        this.state.opened = !this.state.opened;
        this.state.openedBy = columnId;
    }

    close() {
        /*  Input: -
            Output: -
            Method closes Dialog and after a small timeout it removes any values from the Dialog.
         */
        Base.class('dialog-overlay')[0].addClass('dialog-overlay--hidden');
        Base.class('dialog')[0].addClass('dialog--hidden');
        this.state.opened = !this.state.opened;
        this.state.openedBy = '';
        setTimeout(() => {
            Base.Elements.dialog.inputs.DOM.forEach((input) => {input.value = null});
        }, 250);

    }

    init() {
        /*  Input: -
            Output: -
            Initialization method. Creates DOM array and buttons object in Elements.dialog object.
            It also creates the Dialog overlay and Dialog component and executes creation of Dialog content.
         */
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
        /*  Input: -
            Output: -
            This method creates Dialog content and inputs.
         */
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
        /*  Input: -
            Output: -
            Method adds EventListeners to Dialog Form, Cancel button, inputs and Dialog overlay.
         */
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

        this.dialogButtonCancel.addEventListener('mousedown', event => {
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
        /*  Input: input (Node)
            Output: -
            Removes class marking the input as invalid and removes the warning below this input.
            This method is executed when user inputs any value into the input.
         */
        input.classList.remove('dialog__input--invalid');
        input.parentNode.lastElementChild.innerText = '';
    }

    addInvalidInputState(input, state) {
        /*  Input: input (Node), state (string)
            Output: -
            Adds a class marking the input as invalid and adds a warning below this input depending on state.
            This method is executed when validation returns false for the input.
         */
        input.addClass('dialog__input--invalid');
        input.parentNode.lastElementChild.innerText = Base.message.warning[state];
    }

    validation() {
        /*  Input: -
            Output: true/false
            Checks every Dialog input value in order to validate it. If the result of checkInput() method is a false
                addInvalidInputState() is executed to mark the input as invalid.
            This method is executed when Dialog Form is submitted.
         */
        for (let input of Base.Elements.dialog.inputs.DOM) {
            if (!this.checkInput(input).result) {
                this.addInvalidInputState(input, this.checkInput(input).reason);
                return false;
            }
        }
        return true;
    }

    checkInput(input) {
        /*  Input: input (Node)
            Output: object {result: <boolean>, reason: <string>}
            This method checks generic input validation, each input except the Description is technically required.
            Due to default HTML form validation the required attribute is missing from inputs and instead
                they are validated with this method. If the input is empty, this method returns false.
            Then if the fields are not empty and have any further requirements, method executes specific methods
                to check these specific inputs.
         */
        if (!input.value && input.name !== 'input__description') return {result: false, reason: 'requiredInput'};
        else if (input.name === 'input__task-name') return this.checkInputTaskName();
        else if (input.name === 'input__time-spent') return this.checkInputTimeSpent();
        return {result: true, reason: ''}
    }

    checkInputTaskName() {
        /*  Input: -
            Output: object {result: <boolean>, reason: <string>}
            Checks if Dialog TaskName input contains value in format XXX-YYY.. where X is a letter and Y is a digit.
         */
        let regExp = /^([a-zA-Z]{3}-[0-9]*)$/g;

        this.DialogInputTaskName = Base.Elements.dialog.inputs.DOM[2].value.match(regExp);

        if (this.DialogInputTaskName) return {result: true, reason: ''};
        return {result: false, reason: 'invalidTaskNameFormat'};
    }

    checkInputTimeSpent() {
        /*  Input: -
            Output: object {result: <boolean>, reason: <string>}
            Checks if Dialog TimeSpent input contains valid time values.
         */
        let regExp = /([0-9]{1,2}h|[0-9]{1,3}m)/g;

        // get all time values (i.e "30m", "5h", "4h20m", "5h 50m", "50m1h", "40m 4h")
        this.DialogInputTimeSpent = Base.Elements.dialog.inputs.DOM[4].value.match(regExp);

        if (this.DialogInputTimeSpent) { // if such time value exists
            this.DialogInputTimeSpent = this.DialogInputTimeSpent.filter(
                (value) => Base.convertStringToTime(value) > 0); // filter out everything "bigger" than "0m" or "0h"

                // execute checkTime() to get first hours and minutes values and then join it into a string
            this.DialogInputTimeSpent = Base.checkTime(this.DialogInputTimeSpent.join('')).join('');
            return {result: true, reason: ''};
        }
        return {result: false, reason: 'invalidValue'}; // if no valid time values were given
    }
}
customElements.define('log-dialog', DialogClass);
let Dialog = new DialogClass;

class Main {
    constructor() {
         // it's important to invoke Dialog.init() here
        Dialog.init();
    }

    init(columnQuantity = 5) {
        /*  Input: columnQuantity (number)
            Output: -
            Creates columns in number given by user. Default number is 5, and maximum is 28 (4 weeks).
         */
        if (columnQuantity > 28) columnQuantity = 28;
        this.createColumns(columnQuantity);
    }

    createColumns(quantity) {
        for (let i = 0; i < quantity; i++) Column.create(quantity);
    }

}

(new Main()).init(5);
