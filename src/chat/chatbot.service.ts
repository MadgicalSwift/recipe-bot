import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { LocalizationService } from 'src/localization/localization.service';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
  }

  public async processMessage(body: any): Promise<any> {
    const { from, text, button_response } = body;
    const botID = process.env.BOT_ID;
    let userData = await this.userService.findUserByMobileNumber(from);
    if (!userData) {
      userData = await this.userService.createUser(from, 'english', botID);
    }
    const localisedStrings = LocalizationService.getLocalisedString(
      userData.language,
    );

    if (button_response) {
      const buttonBody = button_response.body;
      if (buttonBody === localisedStrings.suggestRecipeOption) {
        await this.message.askForIngredients(
          from,
          localisedStrings.ingredientsPrompt,
        );
        userData.selectedRecipeOption = localisedStrings.option1;
        await this.userService.saveUser(userData);
      } else if (buttonBody === localisedStrings.specificDishOption) {
        await this.message.askForDishName(
          from,
          localisedStrings.specificDishPrompt,
        );

        userData.selectedRecipeOption = localisedStrings.option2;
        await this.userService.saveUser(userData);
      } else if (
        localisedStrings.dietaryPreferencesOption.includes(buttonBody)
      ) {
        await this.message.sendSuggestedRecipe(
          from,
          localisedStrings.recipeSuggestion,
        );
      }
      return 'ok';
    } else {
      const message = text.body;
      const selectedRecipeOption = userData.selectedRecipeOption;

      if (localisedStrings.validText.includes(message)) {
        userData.ingredientsList = null;
        userData.specificDish = null;
        userData.missingIngredients = null;
        await this.userService.saveUser(userData);
        await this.message.sendWelcomeMessage(from, localisedStrings);
      } else if (selectedRecipeOption === localisedStrings.option1) {
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
        if (userData.missingIngredients) {
          userData.numberOfPeople = message;
          await this.userService.saveUser(userData);
          await this.message.sendModifiedRecipe(
            from,
            localisedStrings.modifiedRecipeSuggestion,
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

    // const { intent, entities } = this.intentClassifier.getIntent(text.body);
    // if (userData.language === 'english' || userData.language === 'hindi') {
    //   await this.userService.saveUser(userData);
    // }
    // if (intent === 'greeting') {
    //   this.message.sendWelcomeMessage(from, userData.language);
    // } else if (intent === 'select_language') {
    // const selectedLanguage = entities[0];
    // const userData = await this.userService.findUserByMobileNumber(from);
    // userData.language = selectedLanguage;
    // await this.userService.saveUser(userData);
    // this.message.sendLanguageChangedMessage(from, userData.language);
    // }
    return 'ok';
  }
}
export default ChatbotService;
