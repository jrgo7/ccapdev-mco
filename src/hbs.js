// NPM modules
const { create } = require('express-handlebars');

// MCO3 Modules
const queries = require('./queries.js');

const pluralS = amount => amount === 1 ? "" : "s";

const hbs = create({
    helpers: {

        defaultAvatar: function (avatar) {
            return avatar ? `${avatar}` : "img/avatar/guest.png";
        },

        castNumber(x) {
            return Number(x);
        },

        equals(x, y) {
            return x === y;
        },

        /**
         * @param {Date} date 
         */
        formatDate(date) {
            return date.toLocaleDateString('en-us', {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
        },

        formatDateYear(date) {
            return date.toLocaleDateString('en-us', {
                year: "numeric"
            })
        },

        getTime(date) {
            return date.getTime();
        },

        // Using normal `equals()` would compare the references instead of the actual values
        dateEquals(d1, d2) {
            return d1.getTime() === d2.getTime();
        },

        isNow(date) {
            const now = new Date();
            return date.toDateString() === now.toDateString();
        },

        accountAge(date) {
            const now = new Date();
            const diffTime = now - date;

            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
            const diffMonths = Math.floor(diffDays / 30); // Approximate months
            const diffYears = Math.floor(diffDays / 365); // Approximate years

            if (diffYears > 0) {
                return `${diffYears} year${pluralS(diffYears)}`;
            } else if (diffMonths > 0) {
                return `${diffMonths} month${pluralS(diffMonths)}`;
            } else if (diffDays > 0) {
                return `${diffDays} day${pluralS(diffDays)}`;
            } else {
                return "Less than a day";
            }
        },

        async findUser(email) {
            const user = await User.findOne({ email: email }).lean();
            return user;
        },

        pad(string, chars) {
            return string.padStart(chars, " ");
        },

        /**
         * @param {Number} rating 
         * @param {Boolean} isEditable 
         * @returns Text containing a series of `<span>` elements representing the star rating
         *          If the star rating is editable, a list of IDs in the format `star-n` is also added.
         */
        generateStarRating(rating, isEditable) {
            let out = "";
            for (let i = 1; i <= 5; i++) {
                // Stars are by default:
                let checked = "unchecked"; // unchecked
                let onclick = ""; // have no bound click events
                let clickable = ""; // are unclickable
                let id = ""; // and have no id
                if (isEditable) { // but if it is part of an editable star rating (i.e., in leave review modal)
                    onclick = `onclick=setStarRating(${i})` // add a function on click
                    id = `id=star-${i}`; // set a unique ID for this star to identify it (when toggling the `checked` CSS class)
                    clickable = "allow-editing-always"; // and always make it editable/"clickable"
                }
                if (i <= rating) {
                    checked = "checked";
                }
                out += `<span ${id} ${onclick} class="fa fa-star fa-xl ${clickable} ${checked}"></span>`;
            }
            return out;
        },

        /**
         * @param {String} text 
         * @param {Number} wordCount
         * @returns A trimmed version of `text` having only the specified `wordCount`, with "..." appended if the original length exceeds it
         */
        truncateWords(text, wordCount) {
            let splitText = text.split(" ").splice(0, wordCount).join(" ");
            splitText.trimEnd(",");
            let lastCharacter;
            let lastCharacterIsPunctuation;
            do {
                lastCharacter = splitText.slice(-1);
                lastCharacterIsPunctuation = lastCharacter === ',';
                if (lastCharacterIsPunctuation) {
                    splitText = splitText.substring(0, splitText.length - 1);
                }
            } while (lastCharacterIsPunctuation);
            if (splitText != text) {
                splitText += "...";
            }
            return splitText;
        },

        floor(n) {
            return Math.floor(n);
        }
    },
    extname: ".hbs",
    defaultLayout: "main"
});

module.exports = hbs;