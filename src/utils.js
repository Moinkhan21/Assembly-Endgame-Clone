// Import the list of possible words from the 'words.js' file
import { words } from "./words"

/**
 * Function to randomly select a word from the words array
 * 
 * This is used at the beginning of the game or when starting a new game
 * to generate a word for the player to guess.
 * 
 * @returns {string} A randomly chosen word from the list
 */
export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length) // Get a random index based on the words array length
    return words[randomIndex] // Return the word at that random index
}

/**
 * Function to get a random farewell message for a programming language
 * 
 * This function is triggered when the player makes a wrong guess,
 * and the corresponding language "falls". A fun or dramatic farewell
 * message is shown for that language.
 * 
 * @param {string} language - The name of the language that has been lost
 * @returns {string} A randomly selected farewell message string
 */
export function getFarewellText(language) {
    const options = [
        `Farewell, ${language}`,
        `Adios, ${language}`,
        `R.I.P., ${language}`,
        `We'll miss you, ${language}`,
        `Oh no, not ${language}!`,
        `${language} bites the dust`,
        `Gone but not forgotten, ${language}`,
        `The end of ${language} as we know it`,
        `Off into the sunset, ${language}`,
        `${language}, it's been real`,
        `${language}, your watch has ended`,
        `${language} has left the building`
    ];

    const randomIndex = Math.floor(Math.random() * options.length); // Random index for farewell message
    return options[randomIndex]; // Return a random message
}
