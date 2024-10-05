import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';
import { welcomeButtons, dietaryPreferencesButtons } from 'src/i18n/buttons/button';

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
  
    const messageData = dietaryPreferencesButtons(from, localisedStrings)
  
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

  async sendSuggestedRecipe(from:string, localisedStrings: string, result: any){
    const messageContent = `${localisedStrings}\n${result}`;
    const requestData = this.prepareRequestData(
      from,
      messageContent,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendAwesomeRecipePrompt(from: string, localisedStrings: string){
    const requestData = this.prepareRequestData(
      from,
      localisedStrings,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
  async sendModifiedRecipe(from: string, localisedStrings: string, result: any){
    const messageContent = `${localisedStrings}\n${result}`;
    const requestData = this.prepareRequestData(
      from,
      messageContent,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

async mainMenubuttons(from:string, localisedStrings: any){

  const messageData = {
    to: from,
    type: 'button',
    button: {
        body: {
        type: 'text',
        text: {
            body: localisedStrings.mainMenu
        },
        },
        buttons: [
        {
            type: 'solid',
            body: localisedStrings.suggestRecipeOption,
            reply: localisedStrings.suggestRecipeOption,
        },
        {
            type: 'solid',
            body: localisedStrings.specificDishOption,
            reply: localisedStrings.specificDishOption,
        },
        ],
        allow_custom_response: false,
    }
  }

  const response = await this.sendMessage(
    this.baseUrl,
    messageData,
    this.apiKey
  )
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
