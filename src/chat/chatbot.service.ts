import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { LocalizationService } from 'src/localization/localization.service';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly mixpanel: MixpanelService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
    mixpanel: MixpanelService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
    this.mixpanel = mixpanel;
  }

  public async processMessage(body: any): Promise<any> {
    const { from, text, button_response } = body;
    const botID = process.env.BOT_ID;

    // Get user data based on mobile number and bot ID, or create a new user
    let userData = await this.userService.findUserByMobileNumber(from, botID);
    if (!userData) {
      console.log("User not found, Creating new user")
      userData = await this.userService.createUser(from, 'english', botID);
    }
  
    console.log("userdata====", userData);
// if (userData === undefined) {
//       console.log('Userdata is undefined');
//       return 'ok';
//     } else {
//      await this.userService.deleteUser(from, botID);
//      return 'ok';
//     }
    const localisedStrings = LocalizationService.getLocalisedString(
      userData.language,
    );

    if (button_response) {
      const buttonBody = button_response.body;
      const trackingData = {
        distinct_id: from,
        button: buttonBody,
        botID: botID,
      };

      // Track button click using Mixpanel
      this.mixpanel.track('Button_Click', trackingData);

      // Process different button responses based on localized strings
      if (buttonBody === localisedStrings.suggestRecipeOption) {
        await this.message.askForIngredients(
          from,
          localisedStrings.ingredientsPrompt,
        );
        userData.selectedRecipeOption = localisedStrings.option1;
      } else if (buttonBody === localisedStrings.specificDishOption) {
        await this.message.askForDishName(
          from,
          localisedStrings.specificDishPrompt,
        );
        userData.selectedRecipeOption = localisedStrings.option2;
      } else if (
        localisedStrings.dietaryPreferencesOption.includes(buttonBody)
      ) {
        await this.message.sendAwesomeRecipePrompt(
          from,
          localisedStrings.awesomeRecipePrompt,
        );
        const result = await suggestRecipe(userData, buttonBody);
    
      const trackingData = {
        distinct_id: from,
        recipe: result,
        botID: botID,
      };

      // Track button click using Mixpanel
      this.mixpanel.track('Suggested_Recipe', trackingData);
        // const recipeTitle = result.split('\n')[0].split(':')[1].trim();
        const recipeName = result.split('\n')[0].trim();
        const recipeSuggestion = localisedStrings.recipeSuggestion(recipeName);
        await this.message.sendSuggestedRecipe(from, recipeSuggestion, result);
      }

      // Save user data after any button response
      await this.userService.saveUser(userData);
      return 'ok';
    } else {
      const message = text.body;
      const selectedRecipeOption = userData.selectedRecipeOption;

      // Handle text responses based on user choice (ingredients or specific dish)
      if (localisedStrings.validText.includes(message)) {
        userData.ingredientsList = null;
        
        userData.specificDish = null;
        userData.missingIngredients = null;
        await this.userService.saveUser(userData);
        await this.message.sendWelcomeMessage(from, localisedStrings);
      } else if (selectedRecipeOption === localisedStrings.option1) {
        // If user has selected option 1 (suggest recipe based on ingredients)
        if (userData.ingredientsList) {
          userData.numberOfPeople = message;
          await this.userService.saveUser(userData);
          await this.message.askForDietaryPreferences(from, localisedStrings);
        } else {
          userData.ingredientsList = message;
          await this.userService.saveUser(userData);
          await this.message.askForServingSize(
            from,
            localisedStrings.servingSizePrompt,
          );
        }
      } else if (selectedRecipeOption === localisedStrings.option2) {
        // If user has selected option 2 (specific dish)
        if (userData.missingIngredients) {
          userData.numberOfPeople = message;
          await this.userService.saveUser(userData);
          await this.message.sendAwesomeRecipePrompt(
            from,
            localisedStrings.awesomeRecipePrompt,
          );
          const result = await modifiedRecipe(userData);
          const trackingData = {
            distinct_id: from,
            recipe: result,
            botID: botID,
          };
    
          // Track button click using Mixpanel
          this.mixpanel.track('Modified_Recipe', trackingData);
          // const recipeTitle = result.split('\n')[0].split(':')[1].trim();
          // const title = result.split('\n')[0].replace(/.*: /, '').trim();
          // const title = result.split('\n')[0].replace(/.*:\s*/, '').trim();
          const title = result.split('\n')[0].replace(/.*:\s*/, '').replace(/^\*\*\s*/, '').trim();
          const modifiedRecipeSuggestion =
            localisedStrings.modifiedRecipeSuggestion(title);
          await this.message.sendModifiedRecipe(
            from,
            modifiedRecipeSuggestion,
            result,
          );
        } else if (userData.specificDish) {
          userData.missingIngredients = message;
          await this.userService.saveUser(userData);
          await this.message.askForServingSize(
            from,
            localisedStrings.servingSizePrompt,
          );
        } else {
          userData.specificDish = message;
          await this.userService.saveUser(userData);
          await this.message.askForMissingIngredients(
            from,
            localisedStrings.missingIngredientsPrompt,
          );
        }
      }
    }

    return 'ok';
  }
}

async function suggestRecipe(userData: any, buttonBody: string) {
  const url = process.env.SUGGEST_RECIPE_URL;
  const data = {
    ingredients: userData.ingredientsList,
    people: userData.numberOfPeople,
    dietary_preferences: buttonBody,
    bot_name: process.env.BOT_NAME,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the result here
  } catch (error) {
    console.error('Error suggesting recipe:', error);
    throw error; // Propagate the error
  }
}

async function modifiedRecipe(userData: any) {
  const url = process.env.MODIFIED_RECIPE_URL;
  const data = {
    dish_name: userData.specificDish,
    people: userData.numberOfPeople,
    missing_ingredients: userData.missingIngredients,
    bot_name: process.env.BOT_NAME,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the result here
  } catch (error) {
    console.error('Error suggesting recipe:', error);
    throw error; // Propagate the error
  }
}

export default ChatbotService;
