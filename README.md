# jira-like-time-logging
Vanilla Javascript project based on JIRA time logging.

[Live](http://kosmowski.ct8.pl/time-logging/)
## Table of contents
* [Used technologies](#used-technologies)
* [How to start](#how-to-start)
* [Application description](#application-description)
* [Application description - Columns](#columns)
* [Application description - Cards](#cards)
* [Application description - Dialogs](#dialogs)
## Used technologies
* Vanilla Javascript
* HTML5
* Sass (SCSS)
* Gulp 3.9.1 (gulp-sass ^4.0.2, gulp-sourcemaps ^2.6.5, browser-sync ^2.26.7)
## How to start
After installing all the dependencies the only needed comand is `npm start`.
## Application description
#### Columns
App creates columns representing days. If quantity is not specified ( *main.js:1209* ), then by default there will be 5 columns for a one, full week.
#### Cards
Each column allows you to create cards in it, representing tasks. By initializing creation of a new card we open a dialog.

When the card is created, we get access to few new operations, such as card edition (by simply clicking the desired card) or card deletion, which can be done in two ways.

First way to delete a card is to hover on it and the click the "x" button. This operation does need a confirmation.

The other way is to change Column state to card deletion, which we can switch by clicking the second Column button. This will disable possibility of creating new tasks, but in return we can now select desired card or cards, and then by pressing the "x" button we can remove them.

#### Dialogs
A dialog consists of a title, inputs (optional) and submit/cancel button.

We can cancel the operation (in this case card creation/time logging) by clicking Cancel button or clicking outside the dialog.

In order to create the card we need to pass the validation of inputs. The only bigger requirement is a *Task name* Which needs to be inputted in following format: `LLL-N`, where *L* is a letter, and *N* is a number.

Examples of correct Task names are following: `ABC-15`, `XYZ-638`, `WDK-5`, `MPO-01683` or `BDI-11256`.

Dialog is opened whenever we want to log time (create a card), edit the task, remove a single card or when cancelling any of the previous operations.

#### Time inputs
Time inputs are a bit more complicated. In order to log a time we need to insert a *correct time value*. Examples of such are following: `1h`, `2h 15m`, `3h20m`, `25m4h`, `1h 1h 10m`, `100m` or `1h76m`.

Each other values are ignored. Fraction are not supported, meaning `1.5h` will be read as "5h". Total time value needs to be bigger than `0h`/`0m`.

Negative values, such as `-40m` will be read as "40m".
