class BaseClass {
    constructor() {
        this.init();
        this.app();
    }

    app() {
        this.totalTime = {number: 480, string: '8h'};
        this.Elements = {
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
                        taskId: null,
                        timeLogged: null,
                    }
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
        return document.getElementsByClassName(idName);
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

    create() {
        let newColumn = Base.createElement('log-card',
            {'class': 'card', 'id': `card-${++Base.Elements.cards.count}`},
            Base.class('wrapper')[0]);
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
            Base.class('wrapper')[0]);

        this.addToElementsObject();

        this.createHeadElements(newColumn);
        this.createBodyElements(newColumn);
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

    createHeadElements(newColumn) {
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

    createBodyElements(newColumn) {

    }

}
customElements.define('log-column', ColumnClass);
let Column = new ColumnClass;


class Main {
    constructor() {
        Base.init();
    }

    init() {
        this.createColumns(5);
    }

    createColumns(quantity) {
        for (let i = 0; i < quantity; i++) Column.create();
    }
}

(new Main()).init();
