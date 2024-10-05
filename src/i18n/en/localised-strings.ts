export const localisedStrings = {
  validText: [
    'hi', 'Hi', 'HI', 'hI', 'Hello', 'hello', 'hola', 'Hii', 'hii',
  ],
  welcomeMessage: `Hey! 👋 Ready to whip up something delicious? 🍳🥕\nJust let me know what you would like to cook or share the ingredients you have and I'll suggest a mouthwatering recipe! 🍽️\nLet’s get started and make something amazing together! 👨‍🍳👩‍🍳`,
  suggestRecipeOption: 'Suggest a recipe based on ingredients I have',
  specificDishOption: 'I want to cook a specific dish',
  ingredientsPrompt: `Great! Please tell me the ingredients you have, and I'll suggest something tasty! 🛒`,
  specificDishPrompt: `What dish would you like to prepare? 👩‍🍳`,
  servingSizePrompt: 'How many people will you be cooking for? 👥',
  missingIngredientsPrompt: `Got it! Let me know which ingredients you’re missing so I can adjust the recipe. 📝`,
  dietaryPreferencesPrompt: `Thanks! Do you have any dietary preferences or restrictions?  🥗`,
  dietaryPreferencesOption: ["Spicy 🌶️","Salty 🧂","Low Sugar 🍬","Low Fat 🍏","High Protein 💪","Vegan 🌿","Low Carb 🍽️", "No specific preference 🤷‍♂️🍽️"],
  recipeSuggestion:(recipeName: string)=> `Based on the ingredients you have, here’s a delicious ${recipeName} you can try! 🍲`,
  modifiedRecipeSuggestion:(dishName: string)=> `Here’s a modified version of **${dishName}** that you can make without the ingredients you’re missing! 🍲`,
  awesomeRecipePrompt: "⏳ Please wait a moment while I find the best recipe for you! 🥣",
  option1: "1",
  option2: "2",
  seeMoreMessage: 'See More Data',
  language_hindi: 'हिन्दी',
  language_english: 'English',
  language_changed: 'Language changed to English',
};
 