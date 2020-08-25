/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const { expect } = require("chai");
const chai = require("chai");
const assert = chai.assert;

let Translator;
let handleClearButton, translateByLocale, handleDisplayTranslation = null;

const BRITISH = "british";
const AMERICAN = "american";

suite("Functional Tests", () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require("../public/translator.js");
    handleClearButton = Translator.handleClearButton;
    translateByLocale = Translator.translateByLocale;
    handleDisplayTranslation = Translator.handleDisplayTranslation;
  });

  suite("Function ____()", () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", (done) => {
      const TextAreaInput = document.getElementById("text-input");
      const TranslationsElement = document.getElementById(
        "translated-sentence",
      );
      const TranslateButton = document.getElementById("translate-btn");
      const input = "We had a party at my friend's condo.";
      TextAreaInput.value = input;
      TranslateButton.click();

      expect(TranslationsElement.innerHTML).eq(
        `We had a party at my friend's <span class="highlight">flat</span>.`,
      );

      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", (
      done,
    ) => {
      const TextAreaInput = document.getElementById("text-input");
      const TranslationsElement = document.getElementById(
        "translated-sentence",
      );
      const TranslateButton = document.getElementById("translate-btn");
      const input = "asdadsdas sadaddassdadsd";
      TextAreaInput.value = input;
      TranslateButton.click();

      expect(TranslationsElement.innerHTML).eq("Everything looks good to me!");
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", (
      done,
    ) => {
      const TextAreaInput = document.getElementById("text-input");
      const errorDiv = document.getElementById("error-msg");
      const TranslateButton = document.getElementById("translate-btn");
      TextAreaInput.value = "";
      TranslateButton.click();

      expect(errorDiv.innerHTML).eq("Error: No text to translate.");
      done();
    });
  });

  suite("Function ____()", () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", (
      done,
    ) => {
      const TextAreaInput = document.getElementById("text-input");
      const TranslationsElement = document.getElementById(
        "translated-sentence",
      );
      const errorDiv = document.getElementById("error-msg");
      const TranslateButton = document.getElementById("translate-btn");
      const clearBtn = document.getElementById("clear-btn");
      TextAreaInput.value = "";
      TranslateButton.click();
      expect(errorDiv.innerHTML).eq("Error: No text to translate.");
      clearBtn.click();
      expect(errorDiv.innerHTML).eq("");
      expect(TranslationsElement.innerHTML).eq("");

      done();
    });
  });
});
