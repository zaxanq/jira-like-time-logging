class BaseClass {
    constructor() {
        this.init();
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
}

const Base = new BaseClass;

class ColumnClass extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.Elements = {
            columns: {
                count: 0
            }
        };
    }

    create() {
        let newColumn = Base.createElement('log-column',
            {'class': 'column', 'id': `column-${++this.Elements.columns.count}`},
            Base.class('wrapper')[0]);

        this.createHeadElements(newColumn);
        this.createBodyElements(newColumn);

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

        newColumnHeadDateDay.innerText = 'Mon ';
        newColumnHeadDateDate.innerText = '26.08';

        let newColumnHeadHours = Base.createElement('p',
            {'class': 'column__hours'}, newColumnHeadDetails);
        let newColumnHeadHoursWorked = Base.createElement('span',
            {'class': 'column__hours-worked'}, newColumnHeadHours);
        let newColumnHeadHoursOf = Base.createElement('span',
            {}, newColumnHeadHours);
        let newColumnHeadHoursTotal = Base.createElement('span',
            {'class': 'column__hours-total'}, newColumnHeadHours);

        newColumnHeadHoursWorked.innerText = '7h 30m';
        newColumnHeadHoursOf.innerText = ' of ';
        newColumnHeadHoursTotal.innerText = '8h';

        let newColumnHeadProgress = Base.createElement('div',
            {'class': 'column__progress'}, newColumnHead);
        let newColumnHeadProgressDone = Base.createElement('div',
            {'class': 'column__progress--done',
                'id': `column-${this.Elements.columns.count}__progress--done`}, newColumnHeadProgress);

        let newColumnHeadTitle = Base.createElement('h2',
            {'class': 'column__title'}, newColumnHead);

        newColumnHeadTitle.innerText = 'Worklogs';
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