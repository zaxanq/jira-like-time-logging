class BaseClass {
    /* Base class containing common methods and prototype methods. */

    constructor() {
        this.app();
        this.init();
    }

    idNumber(string) {
        /* Input: string
            Output: number
            This method takes a string - i.e. "card-14" - and returns the number at the end, in this case: 14.
         */
        return Number(string.slice(string.indexOf('-') + 1));
    }

    app() {
        this.totalTime = {number: 480, string: '8h'};
        this.Main = this.Dom('main.wrapper')[0];
        this.Columns = {
            count: 0,
            children: {},
            DOM: {},
            cards: {},
            dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // displayed in Column head
        };
        this.Cards = {
            count: 0,
            children: {},
            DOM: {}
        };
        this.Dialogs = {
            types: {logTime: 'logTime', cardEdit: 'cardEdit', cancel: 'cancel', confirmDelete: 'confirmDelete'},
            logTime: {
                title: 'Log time',
                className: 'dialog__log-time',
                inputs: {
                    names: ['card-name', 'description', 'task-name', 'task-type', 'time-spent'],
                    labels: ['Card name', 'Description', 'Task name', '', 'Time spent'],
                    DOM: {}
                },
                buttons: {},
                submitText: 'Submit',
                cancelText: 'Cancel'
            },
            cardEdit: {
                title: 'Edit task',
                className: 'dialog__edit-card',
                inputs: {
                    names: ['description', 'time-spent', 'task-name', 'task-type'],
                    labels: ['Description', 'Time spent', 'Task name', ''],
                    DOM: {}
                },
                buttons: {},
                submitText: 'Edit',
                cancelText: 'Cancel'
            },
            cancel: {
                title: 'Cancel?',
                className: 'dialog__cancel',
                inputs: {
                    names: [],
                    labels: [],
                    DOM: {}
                },
                buttons: {},
                submitText: 'Cancel',
                cancelText: 'Go back'
            },
            confirmDelete: {
                title: 'Confirm card deletion',
                className: 'dialog__confirm-delete',
                inputs: {
                    names: [],
                    labels: [],
                    DOM: []
                },
                buttons: {},
                submitText: 'Delete',
                cancelText: 'Cancel'
            },
            inputs: {
                maxLengths: {
                    'card-name': 50,
                    'description': 90,
                    'task-name': 16,
                    'time-spent': 32,
                },
            },
        };
        this.message = {
            warning: {
                requiredInput: 'This input is required.',
                invalidValue: 'Invalid time value',
                valuesEqualToZero: 'Time values need to be bigger than 0m',
                invalidTaskNameFormat: 'Invalid format, please use: ABC-123',
            },
            error: {
                invalidClassName: 'Invalid type of class name or class names container.',
            }
        }
    }

    init() {
        Element.prototype.addClass = function(className) {
            if (typeof className === 'string') this.classList.add(className);
            else if (typeof className === 'object') {
                if (className.length) className.forEach((name) => this.classList.add(name));
                else console.error(Base.message.error.invalidClassName);
            }
            return this;
        };

        Element.prototype.removeClass = function(className) {
            if (typeof className === 'string') this.classList.remove(className);
            else if (typeof className === 'object') {
                if (className.length) className.forEach((name) => this.classList.remove(name));
                else console.error(Base.message.error.invalidClassName);
            }
            return this;
        };

        Element.prototype.toggleClass = function(className) {
            if (typeof className === 'string') this.classList.toggle(className);
            else if (typeof className === 'object') console.error(Base.message.error.invalidClassName);
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
        /*  Input: number
            Output: string / number
            Method adds a '0' to the beginning of number if it's smaller than 10. It return it as a string.
            If no '0' was added, method returns inputted number (as a number).
         */
        return number < 10 ? `0${number}` : number;
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
        let hours = 0,
            minutes = 0;

        for (let i = 0; i < timeValues.length; i++) {
            if (timeValues[i].includes('h')) hours += Number(this.removeLastChar(timeValues[i]));
            else if (timeValues[i].includes('m')) minutes += Number(this.removeLastChar(timeValues[i]));
        }

        return [hours, minutes];
    }

    removeLastChar(string) {
        return string.slice(0, string.length - 1);
    }

    stringToTime(string) {
        /*  Input: string
            Output: number
            Method gets a string with time value (i.e: "7h30m", "5h" "10m" "20m 4h", "1h 10m").
            With a help of a Base.checkTime() method it returns a number of minutes.
         */
        let [hours, minutes] = this.checkTime(string);
        return Number(hours) * 60 + Number(minutes);
    }

    timeToString(number) {
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

    timeToStringToTime(number) { // shortcut method
        return this.stringToTime(this.timeToString(number));
    }

    stringToTimeToString(string) { // shortcut method
        return this.timeToString(this.stringToTime(string));
    }
}
const Base = new BaseClass;

class CardClass extends HTMLElement {
    constructor() {
        super();
    }

    fetchDataFromDialog(type, cardId) {
        /*  Input: type (string/DialogType), cardId (string)
            Output: -
            This method gathers all the data inserted into Dialog inputs and hands it over to Base.Cards object.
            Base.Cards object will later deliver this data (for example in Card.create()) to fill the card with it.
         */
            // if type of operation is a logTime, the object is created.
        if (type === Base.Dialogs.types.logTime) {
            Base.Cards.children[`card-${++Base.Cards.count}`] = {
                cardName: Base.Dialogs[type].inputs.DOM['card-name'].value,
                description: Base.Dialogs[type].inputs.DOM['description'].value,
                taskName: Base.Dialogs[type].inputs.DOM['task-name'].value,
                taskType: Base.Dialogs[type].inputs.DOM['task-type'].value,
                timeLogged: {
                    number: Base.stringToTime(Dialog.DialogInputTimeSpent),
                    string: Base.stringToTimeToString(Dialog.DialogInputTimeSpent)
                }
            };
        } else if (type === Base.Dialogs.types.cardEdit) { // otherwise it is modified
            let currentCardObject = Base.Cards.children[cardId];
            currentCardObject.description = Base.Dialogs[type].inputs.DOM['description'].value;
            currentCardObject.timeLogged = {
                number: Base.stringToTime(Dialog.DialogInputTimeSpent),
                string: Base.stringToTimeToString(Dialog.DialogInputTimeSpent)
            };
            currentCardObject.taskName = Base.Dialogs[type].inputs.DOM['task-name'].value;
            currentCardObject.taskType = Base.Dialogs[type].inputs.DOM['task-type'].value;
        }
    }

    modify(type, cardId) {
        /*  Input: type (string/DialogType), cardId (string)
            Output: -
            This method is executed when user submits the Edit task Dialog.
            It executes Dialog.checkInputTimeSpent() to update Dialog.DialogInputTimeSpent.
            This variable will later be necessary in Card.fetchDataFromDialog().
            It also uses Column.getTimeLogged() to update data inside Base.Columns object
                and this.renderCard() to update data displayed on the card.
         */
        Dialog.checkInputTimeSpent(type);
        Column.getTimeLogged(Base.Cards.children[cardId].timeLogged.number,
            Base.idNumber(Dialog.state[type].openedBy), Base.Dialogs.types.cardEdit, cardId);

        this.renderCard(Base.Cards.DOM[cardId].card, '', 'update');
    }

    create(columnNo) {
        /*  Input: columnNo (string/number)
            Output: Card element (Node)
            Method creates a <log-card></log-card> element (a "Card"), that displays a task.
            The Card is created only after Dialog form is submitted and it is validated as correct.
            This method uses data from Base.Cards.
         */
            // Card element in Cards.DOM object
        Base.Cards.DOM[`card-${Base.Cards.count}`] = {};

            // if this is the first card, create state object
        if (!this.state) this.state = {};
            // this card state object
        this.state[Base.Cards.count] = {
            selectable: false,
            selected: false,
        };

        let newCard = Base.createElement('log-card',
            {'class': ['column__card', 'card'], 'id': `card-${Base.Cards.count}`},
            Base.Columns.DOM[columnNo].body);
        Base.Cards.DOM[`card-${Base.Cards.count}`].card = newCard;

        this.addToElementsObject(columnNo); // new card will be added to Base.Cards object.

        this.createCardHeader(newCard);
        this.createCardBody(newCard);
        this.createCardFooter(newCard);

        this.addListener(newCard);
        return newCard;
    }

    renderCard(card, element, update) {
        /*  Input: card (Node), element (Node), update (string)
            Output: -
            Method renders chosen part of card to be updated (depending on update value).
            Update value can also be simply a 'update' which will render all data that can be modified.
         */
        const renderPart = (element, cardId, property) => { element.innerText = Base.Cards.children[cardId][property] };

        if (update.includes('title')) {
            renderPart(element, card.id, 'cardName');
        } else if (update.includes('description')) {
            renderPart(element, card.id, 'description');
        } else if (update.includes('task-icon')) {
            this.resetTaskIcon(card, element);
        } else if (update.includes('task-name')) {
            renderPart(element, card.id, 'taskName');
        } else if (update.includes('logged-time')) { // update logged time with string value from Cards.children object
            element.innerText = Base.Cards.children[card.id].timeLogged.string;
        } else if (update.includes('selectable')) { // if card is selectable add a specific css class
            Card.state[Base.idNumber(card.id)].selectable ?
                card.addClass('card--selectable') : card.removeClass('card--selectable');
        } else if (update.includes('selected')) { // if card is selected add a specific css class
            Card.state[Base.idNumber(card.id)].selected ?
                card.addClass('card--selected') : card.removeClass('card--selected');
        } else if (update === 'update') { // card edition - update description, task name and type and time logged
            renderPart(Base.Cards.DOM[card.id].bodyDescription, card.id, 'description');
            renderPart(Base.Cards.DOM[card.id].footerTaskName, card.id, 'taskName');
            this.resetTaskIcon(card, Base.Cards.DOM[card.id].footerTaskIcon);
            Base.Cards.DOM[card.id].footerLoggedTime.innerText = Base.Cards.children[card.id].timeLogged.string;
        } else if (update === 'delete') { // card removal
            card.parentNode.removeChild(card); // remove card from DOM
            delete Base.Cards.DOM[card.id]; // remove card from Cards.DOM object
        }
    }

    resetTaskIcon(card, iconElement) {
        /*  Input: card (Node), iconElement (Node)
            Output: -
            Method removes previous taskIcon and sets a new one depending on taskType property of Base.Cards object.
         */
        let classesToRemove = [...iconElement.classList].filter(className => className.match(/^status-icon__/g));
        if (classesToRemove.length > 0) iconElement.removeClass(classesToRemove);
        iconElement.addClass(`status-icon__${Base.Cards.children[card.id].taskType}`);
    }

    addToElementsObject(columnNo) {
        /*  Input: number of a column in which the Card is supposed to be created in (string/number)
            Output: -
            Method adds parent column id and card id (card number) to Elements object.
         */
        Base.Cards.children[`card-${Base.Cards.count}`].parentId = `column-${columnNo}`;
        Base.Cards.children[`card-${Base.Cards.count}`].id = Base.Cards.count;
        Base.Columns.cards[columnNo][Base.Cards.count] = Base.Cards.DOM[`card-${Base.Cards.count}`].card;
    }

    createCardHeader(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card header and everything that it should contain (card name, card delete button).
         */
        let newCardHeader = Base.createElement('div',{'class': 'card__header'}, newCard);
        Base.Cards.DOM[`card-${Base.Cards.count}`].header = newCardHeader;

        let newCardHeaderTitle = Base.createElement('span',{'class': 'card__name'}, newCardHeader);
        this.renderCard(newCard, newCardHeaderTitle, 'title');
        Base.Cards.DOM[`card-${Base.Cards.count}`].headerTitle = newCardHeaderTitle;

        let newCardDelete = Base.createElement('div',{'class': 'card__delete'}, newCardHeader);
        Base.Cards.DOM[`card-${Base.Cards.count}`].headerDelete = newCardDelete;

        Base.createElement('span',{'class': 'card__delete-text'}, newCardDelete).innerText = '+';
    }

    delete(type, cardId, columnId) {
        /*  Input: type (string/DialogType), cardId (string), columnId (string)
            Output: -
            Updates the total time in Column (and Columns object), then removes Card from Cards.children,
            Columns.cards and Cards.DOM objects as well as from DOM.
         */
        if (!columnId) columnId = Dialog.state[type].openedBy;
        let columnNo = Base.idNumber(columnId);
        Column.getTimeLogged(Base.Cards.children[cardId].timeLogged.number,
            columnNo, type, cardId);

        delete Base.Cards.children[cardId];
        delete Base.Columns.cards[columnNo][Base.idNumber(cardId)];
        this.renderCard(Base.Cards.DOM[cardId].card, '', 'delete');
    }

    createCardBody(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card body and everything that it should contain (task description).
         */
        let newCardBody = Base.createElement('div',
            {'class': 'card__body'}, newCard);
        Base.Cards.DOM[`card-${Base.Cards.count}`].body = newCardBody;

        let newCardBodyDescription = Base.createElement('span',
            {'class': 'card__description'}, newCardBody);
        this.renderCard(newCard, newCardBodyDescription, 'description');
        Base.Cards.DOM[`card-${Base.Cards.count}`].bodyDescription = newCardBodyDescription;
    }

    createCardFooter(newCard) {
        /*  Input: Card element (Node)
            Output: -
            Creates a Card footer and everything that it should contain (task type, task name and logged time).
         */
        let newCardFooter = Base.createElement('div',
            {'class': 'card__footer'}, newCard);
        Base.Cards.DOM[`card-${Base.Cards.count}`].footer = newCardFooter;

        let newCardFooterTask = Base.createElement('div',
            {'class': 'card__task'}, newCardFooter);
        Base.Cards.DOM[`card-${Base.Cards.count}`].footerTask = newCardFooterTask;

        let newCardFooterTaskIcon = Base.createElement('i',
            {'class': ['card__status-icon', 'status-icon']}, newCardFooterTask);
        this.renderCard(newCard, newCardFooterTaskIcon, 'task-icon');
        Base.Cards.DOM[`card-${Base.Cards.count}`].footerTaskIcon = newCardFooterTaskIcon;

        let newCardFooterTaskName = Base.createElement('span',
            {'class': 'card__task-name'}, newCardFooterTask);
        newCardFooterTaskName.innerText = Base.Cards.children[`card-${Base.Cards.count}`].taskName;
        this.renderCard(newCard, newCardFooterTaskName, 'task-name');
        Base.Cards.DOM[`card-${Base.Cards.count}`].footerTaskName = newCardFooterTaskName;

        let newCardFooterLoggedTime = Base.createElement('span',
            {'class': 'card__logged-time'}, newCardFooter);
        this.renderCard(newCard, newCardFooterLoggedTime, 'logged-time');
        Base.Cards.DOM[`card-${Base.Cards.count}`].footerLoggedTime = newCardFooterLoggedTime;
    }

    select(cardNo, forced, select) {
        /*  Input: cardNo (string.number), forced (boolean), select (boolean)
            Output: -
            Method changes status of specific card. If the force parameter is true, then "selected" status is set
                to the value of select parameter. Otherwise state is toggled.
            Method also executes renderCard to turn on and off card styles depending on the "selected" state.
         */
        this.state[cardNo].selected = forced ? select : !this.state[cardNo].selected;
        this.renderCard(Base.Cards.DOM[`card-${cardNo}`].card, '', 'selected');
    }

    addListener(newCard) {
        /*  Input: newCard (Node)
            Output: -
            Method adds an EventListener to the card. If it is pressed when "selectable" state is false, then
                Edit task Dialog opens. Otherwise the clicked card is selected and it's "selected" state is changed.
            It also adds an EventListener to delete button of the card.
         */
        newCard.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            if (event.button === 0) { // left mouse button only
                let cardNo = Base.idNumber(newCard.id);
                if (!this.state[cardNo].selectable) {
                    Dialog.fetchDataFromCard(Base.Dialogs.types.cardEdit, newCard.id);
                    Dialog.open(Base.Dialogs.types.cardEdit, Base.Cards.children[newCard.id].parentId, newCard.id);
                } else {
                    this.select(cardNo);
                }
            }
        });

        Base.Cards.DOM[newCard.id].headerDelete.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.button === 0) { // left mouse button only
                Dialog.open(Base.Dialogs.types.confirmDelete, Base.Cards.children[newCard.id].parentId, newCard.id);
            }
        });
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
        Base.Columns.DOM[++Base.Columns.count] = {};
        Base.Columns.cards[Base.Columns.count] = {};

            // create state object
        if (!this.state) this.state = {};
        this.state[Base.Columns.count] = {};

        // a Column element.
        let newColumn = Base.createElement('log-column',
            {'class': 'column', 'id': `column-${Base.Columns.count}`},
            Base.Main);
        Base.Columns.DOM[Base.Columns.count].column = newColumn;

        this.addToElementsObject(); // new card will be added to Base.Columns object.

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

        Base.Columns.children[Base.Columns.count] = {
            id: Base.Columns.count,
            dayName: Base.Columns.dayNames[(Base.Columns.count - 1) % 7],
            date: this.week[Base.Columns.count - 1],
            totalWorkedTime: {number: 0, string: '0h'},
            totalTime: '8h',
            title: 'Worklogs',
        };
    }

    createColumnHead(newColumn) {
        /*  Input: Column element (Node)
            Output: -
            Creates a Column head and everything that it should contain.
         */
        let newColumnHead = Base.createElement('div',
            {'class': 'column__head'}, newColumn);

        let newColumnHeadDetails = Base.createElement('div',
            {'class': 'column__details'}, newColumnHead);

        let newColumnHeadDate = Base.createElement('p', {'class': 'column__date'}, newColumnHeadDetails);

        let newColumnHeadDateDay = Base.createElement('span',
            {'class': 'column__date-day'}, newColumnHeadDate);
        newColumnHeadDateDay.innerText = Base.Columns.children[Base.Columns.count].dayName + ' ';

        let newColumnHeadDateDate = Base.createElement('span',
            {'class': 'column__date-date'}, newColumnHeadDate);
        newColumnHeadDateDate.innerText = Base.Columns.children[Base.Columns.count].date;

        let newColumnHeadHours = Base.createElement('p',
            {'class': 'column__hours'}, newColumnHeadDetails);

        let newColumnHeadHoursWorked = Base.createElement('span',
            {'class': 'column__hours-worked'}, newColumnHeadHours);
        Base.Columns.DOM[Base.Columns.count].totalWorkedTime = newColumnHeadHoursWorked;
        newColumnHeadHoursWorked.innerText =
            Base.Columns.children[Base.Columns.count].totalWorkedTime.string;

        let newColumnHeadHoursOf = Base.createElement('span',
            {}, newColumnHeadHours);
        newColumnHeadHoursOf.innerText = ' of ';

        let newColumnHeadHoursTotal = Base.createElement('span',
            {'class': 'column__hours-total'}, newColumnHeadHours);
        newColumnHeadHoursTotal.innerText = Base.Columns.children[Base.Columns.count].totalTime;

        let newColumnHeadProgress = Base.createElement('div',
            {'class': 'column__progress'}, newColumnHead);

        Base.Columns.DOM[Base.Columns.count].progress = Base.createElement('div',{'class': 'column__progress--done',
                'id': `column-${Base.Columns.count}__progress--done`}, newColumnHeadProgress);

        let newColumnHeadTitle = Base.createElement('h2',
            {'class': 'column__title'}, newColumnHead);
        newColumnHeadTitle.innerText = Base.Columns.children[Base.Columns.count].title;

        let newColumnHeadDeleteControls = Base.createElement('div',
            {'class': 'column__delete-controls'}, newColumnHead);
        Base.Columns.DOM[Base.Columns.count].deleteControls = newColumnHeadDeleteControls;

        let newColumnHeadDeselect = Base.createElement('div',
            {'class': 'column__button-deselect'}, newColumnHeadDeleteControls);
        newColumnHeadDeselect.innerText = 'Deselect';
        Base.Columns.DOM[Base.Columns.count].deselect = newColumnHeadDeselect;

        let newColumnHeadRemoveTasks = Base.createElement('div',
            {'class': 'column__remove-tasks'}, newColumnHeadDeleteControls);
        Base.Columns.DOM[Base.Columns.count].removeTasks = newColumnHeadRemoveTasks;

        Base.createElement('span',{'class': 'column__remove-tasks-span'}, newColumnHeadRemoveTasks).innerText = '+';

        let newColumnHeadSelectAll = Base.createElement('div',
            {'class': 'column__button-select-all'}, newColumnHeadDeleteControls);
        newColumnHeadSelectAll.innerText = 'Select All';
        Base.Columns.DOM[Base.Columns.count].selectAll = newColumnHeadSelectAll;
    }

    createColumnBody(newColumn) {
        /*  Input: Column element (Node)
            Output: -
            Creates a Column body, which will be a container for the Cards.
         */
        Base.Columns.DOM[Base.Columns.count].body = Base.createElement('div',{'class': 'column__body'}, newColumn);
    }

    createColumnFooter(newColumn) {
        /*  Input: Column element (Node)
            Output: -
            Creates a Column footer and Column buttons.
         */
        let newColumnFooter = Base.createElement('div',{'class': 'column__footer'}, newColumn);

        let newColumnButtons = Base.createElement('div',{'class': 'column__buttons'}, newColumnFooter);

        let newColumnButtonAdd = Base.createElement('button',
            {'class': ['buttons__add-task', 'button', 'column__button']}, newColumnButtons);
        Base.Columns.DOM[Base.Columns.count].buttonAdd = newColumnButtonAdd;

        let newColumnButtonRemove = Base.createElement('button',
            {'class': ['buttons__remove', 'button', 'column__button']}, newColumnButtons);
        Base.Columns.DOM[Base.Columns.count].buttonRemove = newColumnButtonRemove;
    }

    addButtonListener(columnId) {
        /*  Input: Column id (string)
            Output: -
            Adds an EventListener to Column buttons.
         */
        let columnNo = Base.idNumber(columnId);
            // button will open a Dialog and if the Dialog.open() returns true, it will create a Card.
        Base.Columns.DOM[Base.Columns.count].buttonAdd.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!this.state[columnNo].cardSelection) {
                if (Dialog.open(Base.Dialogs.types.logTime, columnId)) Card.create(Base.Columns.count);
            }
        });

            // button will set the "cardSelection" Column state to true and "selectable" Card state to true
        Base.Columns.DOM[Base.Columns.count].buttonRemove.addEventListener('click', (event) => {
            event.stopPropagation();
            if (this.containsCards(columnNo)) {
                    // if "cardSelection" state is true, clear all "selected" and "selectable" states
                if (this.state[columnNo].cardSelection) this.toggleSelectable(columnNo, true);
                    // otherwise set "cardSelection" state to true
                else this.toggleSelectable(columnNo);
            }
        });

            // button will delete any Card in specific Column if its "selected" state is true
        Base.Columns.DOM[Base.Columns.count].removeTasks.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            if (event.button === 0) {
                for (let cardNo of Object.keys(Base.Columns.cards[columnNo])) {
                    if (Card.state[cardNo].selected)
                        Card.delete(Base.Dialogs.types.confirmDelete, `card-${cardNo}`, columnId);
                }
                this.toggleSelectable(columnNo);
            }
        });

            // button will change "selected" Card state to true to all the Cards in the Column
        Base.Columns.DOM[Base.Columns.count].selectAll.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            if (event.button === 0) this.selectAll(columnNo);
        });

            // button will change "selected" Card state to false to all the Cards in the Column
        Base.Columns.DOM[Base.Columns.count].deselect.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            if (event.button === 0) this.deselect(columnNo);
        });
    }

    containsCards(columnNo) {
        /*  Input: Column number (string/number)
            Output: Boolean
            Method checks whether Column contains cards. Return true/false;
         */
        return Object.keys(Base.Columns.cards[columnNo]).length > 0;
    }

    toggleSelectable(columnNo, clear = false) {
        /*  Input: Column number (string/number), clear (boolean)
            Output: -
            Toggles "cardSelection" Column state and shows controls. Removes pointer-events from add-task button.
            If clear is set to true, method will force "selectable" and "selected" Card states to false for every Card.
         */
        this.state[columnNo].cardSelection = !this.state[columnNo].cardSelection;
        Base.Columns.DOM[columnNo].deleteControls.toggleClass('column__delete-controls--visible');
        Base.Columns.DOM[columnNo].buttonAdd.toggleClass('column__add-task--disabled');

        for (let cardNo of Object.keys(Base.Columns.cards[columnNo])) {
            Card.state[cardNo].selectable = !Card.state[cardNo].selectable;

            if (clear && Card.state[cardNo].selected) Card.select(cardNo);
            Card.renderCard(Base.Cards.DOM[`card-${cardNo}`].card, '', 'selectable');
        }
    }

    selectAll(columnNo) {
        /*  Input: Column number (string/number)
            Output: -
            Method changes "selected" Card state to true for every Card in the Column.
         */
        for (let cardNo of Object.keys(Base.Columns.cards[columnNo])) {
            Card.select(cardNo, true, true);
        }
    }

    deselect(columnNo) {
        /*  Input: Column number (string/number)
            Output: -
            Method changes "selected" Card state to false for every Card in the Column.
         */
        for (let cardNo of Object.keys(Base.Columns.cards[columnNo])) {
            Card.select(cardNo, true, false);
        }

    }

    getTimeLogged(time, columnNo, type, cardId) {
        /*  Input: time (string), columnNo (string/number), type (string/DialogType), cardId (string)
            Output: -
            Method updates totalWorkedTime in Columns object after events such as card creation, card update
                or card deletion.
         */
        if (type === Base.Dialogs.types.cardEdit) { // if card Edit
            Base.Columns.children[columnNo].totalWorkedTime.number -= time; // substract current card time
            Card.fetchDataFromDialog(type, cardId); // get new logged time
            time = Base.Cards.children[cardId].timeLogged.number; // set it as time variable
        } else if (type === Base.Dialogs.types.confirmDelete) { // if card Delete
            time = -time; // invert card value (so that adding it will actually substract it)
        }
        Base.Columns.children[columnNo].totalWorkedTime.number += time; // add time to totalWorkedTime
        Base.Columns.children[columnNo].totalWorkedTime.string = //get string value of totalWorkedTime
            Base.timeToString(Base.Columns.children[columnNo].totalWorkedTime.number);

        this.renderWorkedTime(columnNo); // update time value inserted in Column header
        this.renderProgress(columnNo); // update progress in Column header
    }

    renderWorkedTime(columnNo) {
        /*  Input: columnNo (string/number)
            Output: -
            Updates total worked time in a Column header with new (updated) value from Elements.columns object.
         */
        Base.Columns.DOM[columnNo].totalWorkedTime.innerText = Base.Columns.children[columnNo].totalWorkedTime.string;
    }

    renderProgress(columnNo) {
        /*  Input: columnNo (string/number)
            Output: -
            Updates inline css width of progress bar(--done) based on new (update) value from Elements.columns object.
         */
        Base.Columns.DOM[columnNo].progress.setAttribute('style',
            `width: ${Base.Columns.children[columnNo].totalWorkedTime.number / Base.totalTime.number * 100}%`);
    }
}
customElements.define('log-column', ColumnClass);
let Column = new ColumnClass;

class DialogClass extends HTMLElement {
    constructor() {
        super();
    }

    createOverlay() {
        /*  Input: -
            Output: -
            Creates DialogOverlay and DialgoCancelOverlay elements in the DOM.
         */
        this.dialogOverlay = Base.createElement('div',
            {'class': ['dialog-overlay', 'dialog-overlay--hidden']}, Base.Main);

        this.dialogCancelOverlay = Base.createElement('div',
            {'class': ['dialog-cancel-overlay', 'dialog-overlay--hidden']}, this.dialogOverlay);
    }

    open(type, columnId, cardId) {
        /*  Input: type (string/DialogType), columnId (string), cardId (string)
            Output: -
            Method opens a Dialog of given type. It also updates "opened" Dialog state.
            There are separate things happening for "Confirm Cancel" Dialog since it is a bit unique.
         */
        if (type !== Base.Dialogs.types.cancel) {
            this.state[type].openedBy = columnId;
            Base.class('dialog-overlay')[0].removeClass('dialog-overlay--hidden');
            this.state[type].openedCard = cardId;
        } else { // if it's "Confirm Cancel" Dialog, DialogCancelOverlay is shown, and the other Dialog is "Cancellable'
            Base.class('dialog-cancel-overlay')[0].removeClass('dialog-overlay--hidden');
            Base.Dom('.dialog--visible')[0].addClass('dialog--cancelable');
        }
        this.state[type].opened = !this.state[type].opened;
        Base.class(Base.Dialogs[type].className)[0].removeClass('dialog--hidden').addClass('dialog--visible');
    }

    close(type) {
        /*  Input: type (string/DialogType)
            Output: -
            Method closes Dialog. Its values are removed from the Dialog after small timeout.
         */
        if (type !== Base.Dialogs.types.cancel) {
            Base.class('dialog-overlay')[0].addClass('dialog-overlay--hidden');
        } else { // if it's "Confirm Cancel" Dialog, hide DialogCancelOverlay and other Dialog is not "Cancellable" now
            Base.class('dialog-cancel-overlay')[0].addClass('dialog-overlay--hidden');
            Base.Dom('.dialog--cancelable')[0].removeClass('dialog--cancelable');
        }
        Base.class(Base.Dialogs[type].className)[0].addClass('dialog--hidden').removeClass('dialog--visible');
        this.state[type].opened = !this.state[type].opened;
        this.state[type].openedBy = '';

        setTimeout(() => {
            Object.values(Base.Dialogs[type].inputs.DOM).forEach((input) => {input.value = null});
        }, 250);
    }

    init(type) {
        /*  Input: type (string)
            Output: -
            Initialization method. Creates new Dialog in the DOM. It executes creation of Dialog content.
         */
        if (!this.state) this.state = {};
        this.state[type] = {
            opened: false,
            openedCard: '',
            openedBy: '',
        };

        if (type !== Base.Dialogs.types.cancel) {
            this.dialog = Base.createElement('log-dialog',
                {'class': ['dialog', Base.Dialogs[type].className, 'dialog--hidden']}, this.dialogOverlay);
        } else {
            this.dialog = Base.createElement('log-dialog',
                {'class': ['dialog', Base.Dialogs[type].className, 'dialog--hidden']}, this.dialogCancelOverlay);
        }

        this.dialogForm = Base.createElement('form',
            {}, this.dialog);

        this.createDialogContent(type);
        this.addListeners(type);
    }

    createDialogContent(type) {
        /*  Input: type (string/DialogType)
            Output: -
            This method creates Dialog content and inputs.
         */
        let dialogHeader = Base.createElement('div',
            {'class': 'dialog__header'}, this.dialogForm);

        let dialogTitle = Base.createElement('h2',
            {'class': 'dialog__title'}, dialogHeader);
        dialogTitle.innerText = Base.Dialogs[type].title;

        let dialogBody = Base.createElement('div',
            {'class': 'dialog__body'}, this.dialogForm);

        let Inputs = Base.Dialogs[type].inputs;
        for (let i = 0; i < Inputs.names.length; i++) { // create Inputs specified in Dialogs.inputs
            let dialogInput;
            let dialogInputContainer = Base.createElement('div',
                {'class': ['dialog__input-container', 'input-container', `input-container__${Inputs.names[i]}`]},
                dialogBody);

            if (Inputs.names[i] === 'description') { // description is a "textarea" so it needs specific rules
                dialogInput = Base.createElement('textarea',
                    {'class': ['dialog__input', 'input', `input__${Inputs.names[i]}`]}, dialogInputContainer);
                dialogInput.maxLength = Base.Dialogs.inputs.maxLengths[Inputs.names[i]];
            } else if (Inputs.names[i] === 'task-type') { // task-type is a "select" so it needs specific rules
                dialogInput = Base.createElement('select',
                    {'class': ['dialog__input', 'input', 'select', `input__${Inputs.names[i]}`]},
                    dialogInputContainer);

                for (let type of ['feature', 'bug', 'urgent']) {
                    let dialogInputOption = Base.createElement('option',
                        {'class': ['dialog__input--option', 'select__option', `input__${Inputs.names[i]}`]},
                        dialogInput);
                    dialogInputOption.innerText = type;
                }
                dialogInput.value = '';
            } else { // default "input" rules
                dialogInput = Base.createElement('input',
                    {'class': ['dialog__input', 'input', `input__${Inputs.names[i]}`]}, dialogInputContainer);
                dialogInput.type = 'text';
                dialogInput.maxLength = Base.Dialogs.inputs.maxLengths[Inputs.names[i]];
            }
            Base.Dialogs[type].inputs.DOM[Inputs.names[i]] = dialogInput; // add input to Dialogs.inputs.DOM

            let dialogInputLabel = Base.createElement('label',
                {'class': ['dialog__input-label', 'input-label', `input-label__${Inputs.names[i]}`]},
                dialogInputContainer);

            Base.createElement('span',{'class': ['dialog__input-warning', 'input-warning']}, dialogInputContainer);

            dialogInput.name = `input__${Inputs.names[i]}`;
            dialogInput.placeholder = ' ';
            dialogInputLabel.innerText = Inputs.labels[i];
            dialogInput.minLength = 1;
        }

        let dialogFooter = Base.createElement('div',{'class': 'dialog__footer'}, this.dialogForm);

        let dialogButtons = Base.createElement('div',{'class': 'dialog__buttons'}, dialogFooter);

        this.dialogButtonSubmit = Base.createElement('input',
            {'class': ['dialog__button', 'button', 'dialog__button--submit']}, dialogButtons);
        this.dialogButtonSubmit.value = Base.Dialogs[type].submitText;
        this.dialogButtonSubmit.type = 'submit';
        Base.Dialogs[type].buttons.submit = this.dialogButtonSubmit;

        this.dialogButtonCancel = Base.createElement('button',
            {'class': ['dialog__button', 'button', 'dialog__button--cancel']}, dialogButtons);
        this.dialogButtonCancel.innerText = Base.Dialogs[type].cancelText;
        this.dialogButtonCancel.type = 'button';
        Base.Dialogs[type].buttons.cancel = this.dialogButtonCancel;
    }

    confirm(action, dialogToClose) {
        /*  Input: action (string), dialogToClose (string/DialogType)
            Output: -
            If action is "cancel", method sets this.dialogToClose to Dialog type that is to be confirmed to cancel.
            Then opens "Confirm Cancel" Dialog. if it is submitted, this.dialogToClose will be used to determine which
         */
        if (action === 'cancel') {
            this.dialogToClose = dialogToClose;
            Dialog.open(Base.Dialogs.types.cancel);
        }
    }

    cancelDialogs() {
        /*  Input: -
            Output: -
            Method closes "Confirm Cancel" Button and button confirmed to cancel.
         */
        this.close(Base.Dialogs.types.cancel);
        this.close(Base.Dialogs.types[this.dialogToClose]);
    }

    addListeners(type) {
        /*  Input: type (string/DialogType)
            Output: -
            Method adds EventListeners to Dialog Form, Cancel button, inputs and Dialog overlay.
         */
        if (type === Base.Dialogs.types.logTime) {
            this.dialogForm.addEventListener('submit', event => { // submit on LogTime
                event.stopPropagation();
                event.preventDefault();
                if (this.state[type].opened === true && this.validation(type) === true) {
                    Card.fetchDataFromDialog(type);
                    Column.getTimeLogged(Base.Cards.children[`card-${Base.Cards.count}`].timeLogged.number,
                        Base.idNumber(this.state[type].openedBy), type);
                    Card.create(Base.idNumber(this.state[type].openedBy));
                    this.close(type);
                }
            });
        } else if (type === Base.Dialogs.types.cardEdit) {
            this.dialogForm.addEventListener('submit', event => { // submit on CardEdit
                event.stopPropagation();
                event.preventDefault();
                if (this.state[type].opened === true && this.validation(type) === true) {
                    Card.modify(type, this.state[type].openedCard);
                    this.close(type);
                }
            });

        } else if (type === Base.Dialogs.types.confirmDelete) { // submit on ConfirmDelete
            this.dialogForm.addEventListener('submit', event => {
                event.stopPropagation();
                event.preventDefault();
                if (this.state[type].opened === true) {
                    Card.delete(type, this.state[type].openedCard);
                    this.close(type);
                }
            });
        } else if (type === Base.Dialogs.types.cancel) {
            this.dialogForm.addEventListener('submit', event => { // submit on Confirm Cancel
                event.stopPropagation();
                event.preventDefault();
                if (this.state[type].opened === true) this.cancelDialogs();
            });

            this.dialogCancelOverlay.addEventListener('mouseup', event => { // stop actions on DialogCancelOverlay click
                event.stopPropagation();
            });
        }
        this.dialogOverlay.addEventListener('mouseup', event => { // click on DialogOverlay
            event.stopPropagation();
            if (this.state[type].opened === true) {
                if (event.button === 0) { // left mouse button only
                    if (Dialog.areInputsEmpty(type)) this.close(type);
                    else this.confirm('cancel', type);
                }
            }
        });
        if (type === Base.Dialogs.types.logTime || type === Base.Dialogs.types.cardEdit) {
            Object.values(Base.Dialogs[type].inputs.DOM).forEach(input => { // clear inputs on LogTime/CardEdit
                input.addEventListener('input', () => {
                    this.clearInvalidInputState(input);
                });
            });
        }

        if (type === Base.Dialogs.types.cancel) {
            this.dialogButtonCancel.addEventListener('mouseup', event => { // cancel on Confirm Cancel (just close)
                event.stopPropagation();
                if (this.state[type].opened === true) {
                    if (event.button === 0) this.close(type);
                }
            });
        } else {
            this.dialogButtonCancel.addEventListener('mouseup', event => { // cancel on other Dialogs (confirm Cancel)
                event.stopPropagation();
                if (this.state[type].opened === true) {
                    if (event.button === 0) { // left mouse button only
                        if (Dialog.areInputsEmpty(type)) this.close(type);
                        else this.confirm('cancel', type);
                    }
                }
            });
        }
        this.dialog.addEventListener('mouseup', event => { // stop actions on Dialog click
            event.stopPropagation();
        });
    }

    clearInvalidInputState(input) {
        /*  Input: input (Node)
            Output: -
            Removes class marking the input as invalid and removes the warning below this input.
            This method is executed when user inputs any value into the input.
         */
        input.removeClass('dialog__input--invalid');
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

    validation(type) {
        /*  Input: type (string/DialogType)
            Output: Boolean
            Checks every Dialog input value in order to validate it. If the result of checkInput() method is a false
                addInvalidInputState() is executed to mark the input as invalid.
            This method is executed when Dialog Form is submitted.
         */
        if (type === Base.Dialogs.types.logTime || type === Base.Dialogs.types.cardEdit) {
            for (let input of Object.values(Base.Dialogs[type].inputs.DOM)) {
                let checkInput = this.checkInput(input, type);
                if (!checkInput.result) {
                    this.addInvalidInputState(input, checkInput.reason);
                    return false;
                }
            }
        }
        return true;
    }

    areInputsEmpty(type) {
        /*  Input: type (string/DialogType)
            Output: Boolean
            Checks whether all of Dialog inputs are empty.
         */
        let names = Base.Dialogs[type].inputs.names;
        for (let i = 0; i < names.length - 1; i++) {
            if (Base.Dialogs[type].inputs.DOM[names[i]].value) return false;
        }
        return true;
    }

    checkInput(input, type) {
        /*  Input: input (Node), type (string/DialogType)
            Output: object {result: <boolean>, reason: <string>}
            This method checks generic input validation, each input except the Description is technically required.
            Due to default HTML form validation the required attribute is missing from inputs and instead
                they are validated with this method. If the input is empty, this method returns false.
            Then if the fields are not empty and have any further requirements, method executes specific methods
                to check these specific inputs.
         */
        if (!input.value && input.name !== 'input__description') return {result: false, reason: 'requiredInput'};
        else if (input.name === 'input__task-name') return this.checkInputTaskName(type);
        else if (input.name === 'input__time-spent') return this.checkInputTimeSpent(type);
        return {result: true, reason: ''}
    }

    checkInputTaskName(type) {
        /*  Input: type (string/DialogType)
            Output: object {result: <boolean>, reason: <string>}
            Checks if Dialog TaskName input contains value in format XXX-YYY.. where X is a letter and Y is a digit.
         */
        let regExp = /^([a-zA-Z]{3}-[0-9]*)$/g;
        this.DialogInputTaskName = Base.Dialogs[type].inputs.DOM['task-name'].value.match(regExp);

        if (this.DialogInputTaskName) return {result: true, reason: ''};
        return {result: false, reason: 'invalidTaskNameFormat'};
    }

    checkInputTimeSpent(type) {
        /*  Input: type (string/DialogType)
            Output: object {result: <boolean>, reason: <string>}
            Checks if Dialog TimeSpent input contains valid time values.
         */
        let regExp = /([0-9]{1,2}h|[0-9]{1,3}m)/g;
            // get all time values (i.e "30m", "5h", "4h20m", "5h 50m", "50m1h", "40m 4h")
        if (type === Base.Dialogs.types.logTime || type === Base.Dialogs.types.cardEdit) {
                // find correct time values, keep only those bigger than 0 and join them into string.
            this.DialogInputTimeSpent = Base.Dialogs[type].inputs.DOM['time-spent'].value.match(regExp);
            console.log(this.DialogInputTimeSpent);
            if (this.DialogInputTimeSpent) { // if there are any may-be-valid values
                this.DialogInputTimeSpent = this.DialogInputTimeSpent.filter(
                    (value) => Base.stringToTime(value) > 0).join(' ');

                if (this.DialogInputTimeSpent.length > 0) return {result: true, reason: ''};
                else return {result: false, reason: 'valuesEqualToZero'}; // if no valid time values were given
            } else {
                return {result: false, reason: 'invalidValue'}; // if no valid time values were given
            }
            return {result: true, reason: ''};
        }
    }

    fetchDataFromCard(type, cardId) {
        /*  Input: type (string/DialogType), cardId (string)
            Output: -
            Method updates Dialog inputs with data from Cards.children. Used in CardEdit Dialog.
         */
        if (type === Base.Dialogs.types.cardEdit) {
            Base.Dialogs[type].inputs.DOM['description'].value = Base.Cards.children[cardId].description;
            Base.Dialogs[type].inputs.DOM['time-spent'].value = Base.Cards.children[cardId].timeLogged.string;
            Base.Dialogs[type].inputs.DOM['task-name'].value = Base.Cards.children[cardId].taskName;
            Base.Dialogs[type].inputs.DOM['task-type'].value = Base.Cards.children[cardId].taskType;
        }
    }
}
customElements.define('log-dialog', DialogClass);
let Dialog = new DialogClass;

class Main {
    constructor() {
        Dialog.createOverlay();
            // it's important to invoke Dialog.init() here
        for (let type of Object.values(Base.Dialogs.types)) Dialog.init(type);
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
