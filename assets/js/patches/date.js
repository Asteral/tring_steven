/**
 * Extending the Date class with some patches - Added in the day names as well. 
 * Based off solution:
 * http://stackoverflow.com/questions/1643320/get-month-name-from-date-using-javascript
 */

Date.locale = {
    en: {
        day_names: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        day_names_short : [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        month_names: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        month_names_short: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    }
};

/**
 * getDayName - returns the name of the day according to the locale
 * @param {string} lang - The locale/language - current there is only 'en'.
 */
Date.prototype.getDayName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].day_names[this.getDay()];
}

/**
 * getDayNameShort - returns the short name of the day according to the locale
 * @param {string} lang - The locale/language - current there is only 'en'.
 */
Date.prototype.getDayNameShort = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].day_names_short[this.getDay()];
};

/**
 * getMonthName - returns the name of the month according to the locale
 * @param {string} lang - The locale/language - current there is only 'en'.
 */
Date.prototype.getMonthName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names[this.getMonth()];
};

/**
 * getMonthNameShort - returns the name of the short month according to the locale
 * @param {string} lang - The locale/language - current there is only 'en'.
 */
Date.prototype.getMonthNameShort = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names_short[this.getMonth()];
};

/**
 * Utility functions for getting the prev/next days, weeks and months
 */

Date.prototype.offsetDate = function(dOffset, mOffset, yOffset) {
    var d = this.getDate() + dOffset;
    var m = this.getMonth() + mOffset;
    var y = this.getFullYear() + yOffset;
    return new Date(y, m, d);
}

Date.prototype.getPrevDay = function() {
    return this.offsetDate(-1, 0, 0)
}

Date.prototype.getNextDay = function() {
    return this.offsetDate(1, 0, 0)
}

Date.prototype.getPrevWeek = function() {
    return this.offsetDate(-7, 0, 0)
}

Date.prototype.getNextWeek = function() {
    return this.offsetDate(7, 0, 0)
}

Date.prototype.getPrevMonth = function() {
    return this.offsetDate(0, -1, 0)
}

Date.prototype.getNextMonth = function() {
    return this.offsetDate(0, 1, 0)
}
