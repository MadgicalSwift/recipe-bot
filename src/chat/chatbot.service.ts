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
      console.log('User not found, Creating new user');
      userData = await this.userService.createUser(from, 'english', botID);
    }
    const today = new Date().toISOString().split('T')[0];

    const localisedStrings = LocalizationService.getLocalisedString(
      userData.language,
    );

    if (button_response) {
      const buttonBody = button_response?.body;
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
        userData.dietaryPreference = buttonBody;
        await this.userService.saveUser(userData);
        
        

        const { limitReached } = await this.updateUserDateAndUsage(userData, today);
        if (limitReached) {
          await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
          return 'ok';
        }
        await this.message.sendAwesomeRecipePrompt(
          from,
          localisedStrings.awesomeRecipePrompt,
        );

        const result = await suggestRecipe(userData);
        if (!result) {
          console.log('Result not found');
          return 'ok';
        }
       
        userData.full_dish = result;
        await this.userService.saveUser(userData);
        const trackingData = {
          distinct_id: from,
          recipe: result,
          botID: botID,
        };

        // Track button click using Mixpanel
        this.mixpanel.track('Suggested_Recipe', trackingData);

        const recipeName = result.split('\n')[0].trim();
        const recipeSuggestion = localisedStrings.recipeSuggestion(recipeName);
        await this.message.sendSuggestedRecipe(
          from,
          recipeSuggestion,
          result,
          userData.language,
        );
      } else if (buttonBody === localisedStrings.optionMainMenu) {
        await this.message.mainMenubuttons(from, localisedStrings);
        userData.ingredientsList = null;
        userData.specificDish = null;
        userData.selectedRecipeOption = null;
        userData.recipe_conversation_Api_No = 0;
        userData.chat_history = [];
        userData.chat_summary = '';
      } else if (buttonBody === localisedStrings.optionFollowUp) {
        userData.follow_up = 'yes';
        await this.message.sendFollowUpPrompt(
          from,
          localisedStrings.followUpPrompt,
        );
      } else if (buttonBody === localisedStrings.helpByAIOption) {
    
        const { limitReached } = await this.updateUserDateAndUsage(userData, today);
        if (limitReached) {
          await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
          return 'ok';
        }
        const response = await recipeConversation(userData, buttonBody);
        userData.selectedRecipeOption = null;
        userData.chat_history = response.full_history;
        userData.chat_summary = response.summary_history;
       

        userData.recipe_conversation_Api_No =
          typeof userData.recipe_conversation_Api_No === 'number'
            ? userData.recipe_conversation_Api_No + 1
            : 1;

        await this.message.sendConversation(from, response.response);
      } else if (buttonBody === localisedStrings.continueQueryOption) {
        
        const { limitReached } = await this.updateUserDateAndUsage(userData, today);
        if (limitReached) {
          await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
          return 'ok';
        }
        const response = await recipeConversation(userData, buttonBody);

        userData.selectedRecipeOption = null;
        userData.chat_history = response.full_history;
        userData.chat_summary = response.summary_history;
        userData.recipe_conversation_Api_No += 1;
      
        await this.userService.saveUser(userData);

        if (userData.recipe_conversation_Api_No >= 5) {
          userData.recipe_conversation_Api_No = 0;
          await this.userService.saveUser(userData);
          await this.message.sendButtonsWithRecipeConversation(
            from,
            localisedStrings,
            response.response,
          );

          return 'ok';
        }
        await this.message.sendConversation(from, response.response);
      }

      // Save user data after any button response
      await this.userService.saveUser(userData);
      return 'ok';
    } else {
      const message = text?.body;
      const selectedRecipeOption = userData.selectedRecipeOption;

      // Handle text responses based on user choice (ingredients or specific dish)
      if (localisedStrings.validText.includes(message)) {
        userData.ingredientsList = null;
        userData.follow_up = null;
        userData.specificDish = null;
        userData.selectedRecipeOption = null;
        userData.recipe_conversation_Api_No =
          typeof userData.recipe_conversation_Api_No === 'number'
            ? (userData.recipe_conversation_Api_No = 0)
            : 0;
        userData.chat_history = [];
        userData.chat_summary = '';
        await this.userService.saveUser(userData);
        await this.message.sendWelcomeMessage(from, localisedStrings);
      } else if (selectedRecipeOption === localisedStrings.option1) {
        // If user has selected option 1 (suggest recipe based on ingredients)
        if (userData.follow_up) {
          userData.follow_up = null;
          await this.userService.saveUser(userData);

          const fullDish = userData.full_dish;

        
          const { limitReached } = await this.updateUserDateAndUsage(userData, today);
          if (limitReached) {
            await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
            return 'ok';
          }
          const response = await followUpDish(userData, message, fullDish);
          if (!response) {
            console.log('response not found');
            return 'ok';
          }

          userData.chat_history = response.full_history;
          userData.chat_summary = response.summary_history;
         
          await this.userService.saveUser(userData);

          await this.message.sendFollowRecipe(
            from,
            localisedStrings,
            response.response,
          );
        } else if (userData.ingredientsList) {
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
        if (userData.follow_up) {
          userData.follow_up = null;
          await this.userService.saveUser(userData);

          const fullDish = userData.full_dish;
          
         
          const { limitReached } = await this.updateUserDateAndUsage(userData, today);
          if (limitReached) {
            await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
            return 'ok';
          }
          const response = await followUpDish(userData, message, fullDish);
          if (!response) {
            console.log('response not found');
            return 'ok';
          }

          userData.chat_history = response.full_history;
          userData.chat_summary = response.summary_history;
       
          await this.userService.saveUser(userData);

          await this.message.sendFollowRecipe(
            from,
            localisedStrings,
            response.response,
          );
        } else if (userData.specificDish) {
          userData.numberOfPeople = message;
          await this.userService.saveUser(userData);
         
         
          const { limitReached } = await this.updateUserDateAndUsage(userData, today);
          if (limitReached) {
            await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
            return 'ok';
          }
          await this.message.sendAwesomeRecipePrompt(
            from,
            localisedStrings.awesomeRecipePrompt,
          );
          const result = await specificRecipe(userData);
          if (!result) {
            console.log('Result not found');
            return 'ok';
          }

          
          userData.full_dish = result;
          await this.userService.saveUser(userData);
          const trackingData = {
            distinct_id: from,
            recipe: result,
            botID: botID,
          };

          // Track button click using Mixpanel
          this.mixpanel.track('Specific_Recipe', trackingData);

          const title = result
            .split('\n')[0]
            .replace(/.*:\s*/, '')
            .replace(/^\*\*\s*/, '')
            .trim();
          const modifiedRecipeSuggestion =
            localisedStrings.specificRecipeSuggestion(title);
          await this.message.sendSpecificRecipe(
            from,
            modifiedRecipeSuggestion,
            result,
            userData.language,
          );
        } else {
          userData.specificDish = message;
          userData.dietaryPreference = 'null';
          userData.ingredientsList = 'null';
          await this.userService.saveUser(userData);
          await this.message.askForServingSize(
            from,
            localisedStrings.servingSizePrompt,
          );
        }
      } else {
        
        const { limitReached } = await this.updateUserDateAndUsage(userData, today);
        if (limitReached) {
          await this.message.sendlimitreached(from, localisedStrings.reacheddailylimit);
          return 'ok';
        }
        const response = await recipeConversation(userData, message);

       
        userData.selectedRecipeOption = null;
        userData.chat_history = response.full_history;
        userData.chat_summary = response.summary_history;
        userData.recipe_conversation_Api_No =
          typeof userData.recipe_conversation_Api_No === 'number'
            ? userData.recipe_conversation_Api_No + 1
            : 1;
        await this.userService.saveUser(userData);
        if (userData.recipe_conversation_Api_No >= 5) {
          userData.recipe_conversation_Api_No = 0;
          await this.userService.saveUser(userData);
          await this.message.sendButtonsWithRecipeConversation(
            from,
            localisedStrings,
            response.response,
          );

          return 'ok';
        } else if (response.response.includes('**')) {
          await this.message.sendButtonsWithRecipeConversation(
            from,
            localisedStrings,
            response.response,
          );
          return 'ok';
        }
        await this.message.sendConversation(from, response.response);
      }
    }

    return 'ok';
  }

  private async updateUserDateAndUsage(userData: any, today: string): Promise<any> {
    if (userData.date < today) {
      userData.date = today;
      userData.apiUsageCount = 0; // Reset the usage count for a new day
    } else if (userData.apiUsageCount >= 20) {
      return { limitReached: true };
    } else {
      userData.apiUsageCount = typeof userData.apiUsageCount === 'number'
        ? userData.apiUsageCount + 1
        : 1;
    }
    await this.userService.saveUser(userData);
    return { limitReached: false };
  }
   
}

async function followUpDish(userData: any, message: string, fullDish: any) {
  const url = process.env.FOLLOW_UP_URL;
  const data = {
    chat_history: userData.chat_history,
    full_dish: fullDish,
    question: message,
    dietary_preferences: userData.dietaryPreference,
    main_integerents: userData.ingredientsList,
    people: userData.numberOfPeople,
    chat_summary: userData.chat_summary,
    bot_name: process.env.BOT_NAME,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error in follow-up dish request:', error);
  }
}

async function suggestRecipe(userData: any) {
  const url = process.env.SUGGEST_RECIPE_URL;

  const data = {
    ingredients: userData.ingredientsList,
    people: userData.numberOfPeople,
    dietary_preferences: userData.dietaryPreference,
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
  }
}

async function specificRecipe(userData: any) {
  const url = process.env.SPECIFIC_RECIPE_URL;
  const data = {
    dish_name: userData.specificDish,
    people: userData.numberOfPeople,
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
  }
}

async function recipeConversation(userData: any, message: any) {
  const url = process.env.RECIPE_COVERSATION_URL;
  const data = {
    chat_history: userData.chat_history,
    question: message,
    chat_summary: userData.chat_summary,
    bot_name: process.env.BOT_NAME,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error in recipe conversation request:', error);
  }
}
export default ChatbotService;
