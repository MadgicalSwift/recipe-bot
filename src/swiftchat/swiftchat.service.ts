import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';
import {
  welcomeButtons,
  dietaryPreferencesButtons,
  menuButtons,
  sendButtonsAfterRecipe,
  buttonsAfterFollowRecipe,
  buttonsWithRecipeConversation,
} from 'src/i18n/buttons/button';

dotenv.config();

@Injectable()
export class SwiftchatMessageService extends MessageService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private prepareRequestData(from: string, requestBody: string): any {
    return {
      to: from,
      type: 'text',
      text: {
        body: requestBody,
      },
    };
  }
  async sendWelcomeMessage(from: string, localisedStrings: string) {
    const messageData = welcomeButtons(from, localisedStrings);

    const response = await this.sendMessage(
      this.baseUrl,
      messageData,
      this.apiKey,
    );
    return response;
  }

  async askForDietaryPreferences(from: string, localisedStrings: string) {
    const messageData = dietaryPreferencesButtons(from, localisedStrings);

    const response = await this.sendMessage(
      this.baseUrl,
      messageData,
      this.apiKey,
    );
    return response;
  }

  async askForIngredients(from: string, prompt: string) {
    const requestData = this.prepareRequestData(from, prompt);

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }

  async askForDishName(from: string, prompt: string) {
    const requestData = this.prepareRequestData(from, prompt);

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }

  async askForServingSize(from: string, prompt: string) {
    const requestData = this.prepareRequestData(from, prompt);
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }
  async askForMissingIngredients(from: string, prompt: string) {
    const requestData = this.prepareRequestData(from, prompt);
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }

  async sendSuggestedRecipe(
    from: string,
    localisedStrings: string,
    result: any,
    language: string,
  ) {
    const strings = LocalizationService.getLocalisedString(language);
    const requestData = sendButtonsAfterRecipe(
      from,
      localisedStrings,
      result,
      strings,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendAwesomeRecipePrompt(from: string, localisedStrings: string) {
    const requestData = this.prepareRequestData(from, localisedStrings);

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
  async sendSpecificRecipe(
    from: string,
    localisedStrings: string,
    result: any,
    language: string,
  ) {
    const strings = LocalizationService.getLocalisedString(language);
    const requestData = sendButtonsAfterRecipe(
      from,
      localisedStrings,
      result,
      strings,
    );
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendFollowRecipe(from: string, localisedStrings: any, result: any) {
    const messageData = buttonsAfterFollowRecipe(
      from,
      localisedStrings,
      result,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      messageData,
      this.apiKey,
    );
    return response;
  }
  async mainMenubuttons(from: string, localisedStrings: any) {
    const messageData = menuButtons(from, localisedStrings);

    const response = await this.sendMessage(
      this.baseUrl,
      messageData,
      this.apiKey,
    );
  }

  async sendFollowUpPrompt(from: string, localisedStrings: string) {
    const requestData = this.prepareRequestData(from, localisedStrings);

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendConversation(from: string, message: any) {
    const requestData = this.prepareRequestData(from, message);

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendButtonsWithRecipeConversation(
    from: string,
    localisedStrings: any,
    message: any,
  ) {
    const messageData = buttonsWithRecipeConversation(
      from,
      localisedStrings,
      message,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      messageData,
      this.apiKey,
    );
    return response;
  }
  async sendlimitreached(from: string, localisedStrings: any) {
    const message = this.prepareRequestData(from, localisedStrings);

    const response = await this.sendMessage(this.baseUrl, message, this.apiKey);

    return response;
  }
  async sendLanguageChangedMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.select_language,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
}
