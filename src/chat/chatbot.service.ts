import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { LocalizationService } from 'src/localization/localization.service';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

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
      userData = await this.userService.createUser(from, 'english', botID);
    }

    const localisedStrings = LocalizationService.getLocalisedString(userData.language);

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
        await this.message.askForIngredients(from, localisedStrings.ingredientsPrompt);
        userData.selectedRecipeOption = localisedStrings.option1;
      } else if (buttonBody === localisedStrings.specificDishOption) {
        await this.message.askForDishName(from, localisedStrings.specificDishPrompt);
        userData.selectedRecipeOption = localisedStrings.option2;
      } else if (localisedStrings.dietaryPreferencesOption.includes(buttonBody)) {
        await this.message.sendSuggestedRecipe(from, localisedStrings.recipeSuggestion);
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
          await this.message.askForServingSize(from, localisedStrings.servingSizePrompt);
        }
      } else if (selectedRecipeOption === localisedStrings.option2) {
        // If user has selected option 2 (specific dish)
        if (userData.missingIngredients) {
          userData.numberOfPeople = message;
          await this.userService.saveUser(userData);
          await this.message.sendModifiedRecipe(from, localisedStrings.modifiedRecipeSuggestion);
        } else if (userData.specificDish) {
          userData.missingIngredients = message;
          await this.userService.saveUser(userData);
          await this.message.askForServingSize(from, localisedStrings.servingSizePrompt);
        } else {
          userData.specificDish = message;
          await this.userService.saveUser(userData);
          await this.message.askForMissingIngredients(from, localisedStrings.missingIngredientsPrompt);
        }
      }
    }

    return 'ok';
  }
}
export default ChatbotService;
