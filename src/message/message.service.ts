import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CustomException } from 'src/common/exception/custom.exception';
import { localisedStrings } from 'src/i18n/en/localised-strings';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Injectable()
export abstract class MessageService {
  constructor(public readonly mixpanel: MixpanelService) {}
  async prepareWelcomeMessage() {
    return localisedStrings.welcomeMessage;
  }
  getSeeMoreButtonLabel() {
    return localisedStrings.seeMoreMessage;
  }

 async sendMessage(baseUrl: string, requestData: any, token: string) {
   try {
      const response = await axios.post(baseUrl, requestData, {
         headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
      });
      return response.data;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  abstract sendWelcomeMessage(from: string, localisedStrings: string);
  abstract askForIngredients(from: string, prompt: string);
  abstract askForDishName(from: string, prompt: string);
  abstract askForServingSize(from: string, prompt: string);
  abstract askForMissingIngredients(from: string, prompt: string)
  abstract askForDietaryPreferences (from: string, localisedStrings: string);
  abstract sendSuggestedRecipe(from:string, localisedStrings: string, result: any, language: string);
  abstract sendSpecificRecipe(from: string, localisedStrings: string, result: any, language: string);
  abstract sendAwesomeRecipePrompt(from: string, localisedStrings: string);
  abstract mainMenubuttons(from:string, localisedStrings: any);
  abstract sendFollowUpPrompt(from: string, localisedStrings: string);
  abstract sendFollowRecipe(from: string, localisedStrings: any, result: any);
  abstract sendConversation(from: string, message: any);
  abstract sendButtonsWithRecipeConversation(from: string, localisedStrings: any,message: any);
  abstract sendlimitreached(from: string, localisedStrings: any);
  abstract sendLanguageChangedMessage(from: string, language: string);
  abstract sendYouTubeLinks(apiKey, from, recipeName, language);
  abstract sendYouTubeLinks1(apiKey, from, title, language);
}
