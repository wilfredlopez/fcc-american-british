import { americanOnly } from "./american-only.js";
import { britishOnly } from "./british-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";

//UTILS
function reverseDict(dict) {
  return Object.keys(dict).reduce((acc, curr) => {
    acc[dict[curr]] = curr;
    return acc;
  }, {});
}

function dictToUpper(dict) {
  return Object.keys(dict).reduce((acc, curr) => {
    const key = curr[0].toUpperCase() + curr.slice(1);
    acc[key] = key.includes(".") ? key.replace(".", "") : `${key}.`;
    return acc;
  }, {});
}

function reduceSentance(SArray) {
  return SArray.reduce((acc, curr) => {
    return acc += curr;
  }, "");
}

//Setup
let AllAmericanDict = { ...americanToBritishSpelling };
let AllBritish = reverseDict({ ...AllAmericanDict });
let reversedAmericanTitles = reverseDict({ ...americanToBritishTitles });

AllAmericanDict = { ...AllAmericanDict, ...americanOnly };

AllBritish = { ...AllBritish, ...britishOnly };

const upAndLowCaseTitlesAmericanToBritish = {
  ...americanToBritishTitles,
  ...dictToUpper(americanToBritishTitles),
};
const upAndLowCaseTitlesBritishToAmerican = {
  ...reversedAmericanTitles,
  ...dictToUpper(reversedAmericanTitles),
};

/**
 * Main Function that translates value from american to british or british to american
 * @param {string} value 
 * @param {'british' | 'american'} locale 
 */
function translateByLocale(value, locale) {
  const translatedTerms = [];
  const targetTitles = locale === "british"
    ? upAndLowCaseTitlesAmericanToBritish
    : upAndLowCaseTitlesBritishToAmerican;

  const getTitles = (str) => {
    return str.split(" ").map((s) => {
      const match = targetTitles[s];
      if (match) {
        translatedTerms.push(match);
        return match;
      } else {
        return s;
      }
    }).join(" ");
  };

  const handleTimes = (arr) =>
    arr.reduce((acc, curr, i, arr) => {
      const curentI = parseInt(curr);
      const separator = locale === "british"
        ? arr[i + 1] === ":"
        : arr[i + 1] === ".";
      const followingNumber = parseInt(arr[i + 2]);
      if (curentI && separator && followingNumber) {
        const time = locale === "british"
          ? `${curentI}.${followingNumber}`
          : `${curentI}:${followingNumber}`;
        acc.push(time);
        translatedTerms.push(time);
        arr.splice(i + 1, 2);
      } else {
        acc.push(curr);
      }

      return acc;
    }, []);

  const titles = getTitles(value);
  let arrayLower = titles.toLowerCase().split(/([\s,.;:?])/).filter((el) =>
    el !== ""
  );
  let arrayWithCaps = titles.split(/([\s,.;:?])/).filter((el) => el !== "");
  const targetDict = locale === "british" ? AllAmericanDict : AllBritish;

  arrayLower = handleTimes(arrayLower);
  arrayWithCaps = handleTimes(arrayWithCaps);

  Object.keys(targetDict).forEach((term) => {
    const testStr = arrayLower.join("").replace(/[,.;?]/g, "");

    if (testStr.includes(term)) {
      const newTerm = targetDict[term];
      const currentTerm = term.split(/(\s)/);
      const isIn = (str) => arrayLower.indexOf(str) >= 0;

      if (currentTerm.every(isIn)) {
        if (currentTerm.length === 1) {
          arrayWithCaps[arrayLower.indexOf(term)] = newTerm;
          arrayLower[arrayLower.indexOf(term)] = newTerm;

          translatedTerms.push(newTerm);
        } else {
          const termIndex = arrayLower.indexOf(...currentTerm);
          arrayLower.splice(
            termIndex,
            currentTerm.length,
            newTerm,
          );
          const firstTerm = arrayWithCaps.slice(
            termIndex,
            termIndex + currentTerm.length,
          );
          const CapTerm = firstTerm[0].toUpperCase() === firstTerm[0];
          arrayWithCaps.splice(
            termIndex,
            currentTerm.length,
            CapTerm ? newTerm[0].toUpperCase() + newTerm.slice(1) : newTerm,
          );

          translatedTerms.push(newTerm);
        }
      }
    }
  });

  const translation = reduceSentance(arrayWithCaps);
  const returnData = {
    translation,
    translationCaps: arrayWithCaps,
    translatedTerms,
  };

  handleDisplayTranslation(returnData);
  return returnData;
}

//Elements
const TextAreaInput = document.getElementById("text-input");
const TranslationsElement = document.getElementById("translated-sentence");
const errorDiv = document.getElementById("error-msg");
const TranslateButton = document.getElementById("translate-btn");
const clearBtn = document.getElementById("clear-btn");

//Event Handlers
function handleClearButton() {
  return TextAreaInput.value = "",
    TranslationsElement.textContent = "",
    errorDiv.textContent = "";
}

function handleDisplayTranslation(data) {
  const { translation, translationCaps, translatedTerms } = data;

  translatedTerms.forEach((word) => {
    const upperValue = word[0].toUpperCase() + word.slice(1);
    if (translationCaps.indexOf(upperValue) >= 0) {
      translationCaps[translationCaps.indexOf(upperValue)] =
        `<span class='highlight'>${upperValue}</span>`;
    } else {
      translationCaps[translationCaps.indexOf(word)] =
        `<span class='highlight'>${word}</span>`;
    }
  });

  const stringValue = reduceSentance(translationCaps);

  if (translation === "" || TextAreaInput.value === "") {
    TranslationsElement.textContent = "";
    errorDiv.textContent = "Error: No text to translate.";
  } else {
    errorDiv.textContent = "";
    return translatedTerms.length === 0
      ? TranslationsElement.innerHTML = "Everything looks good to me!"
      : TranslationsElement.innerHTML = stringValue;
  }
}

TranslateButton.addEventListener("click", () => {
  const targetLocale =
    document.getElementById("locale-select").value === "american-to-british"
      ? "british"
      : "american";
  translateByLocale(TextAreaInput.value, targetLocale);
});

clearBtn.addEventListener("click", () => {
  handleClearButton();
});

function toBritish(value) {
  return translateByLocale(value, "british");
}

function toAmerican(value) {
  return translateByLocale(value, "american");
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    handleClearButton,
    translateByLocale,
    handleDisplayTranslation,
    toBritish,
    toAmerican,
  };
} catch (e) {}
