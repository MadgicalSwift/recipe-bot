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
      console.log("Sending request to:", baseUrl);
      console.log("Request Data:", JSON.stringify(requestData, null, 2));
      console.log("Authorization Token:", token);
      
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
  abstract sendSuggestedRecipe(from:string, localisedStrings: string);
  abstract sendModifiedRecipe(from: string, localisedStrings: string);
  abstract sendLanguageChangedMessage(from: string, language: string);
}
