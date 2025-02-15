import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';
import {localisedStrings} from 'src/i18n/en/localised-strings';
//import { recipeSuggestion } from 'src/i18n/en/';
import {
  welcomeButtons,
  dietaryPreferencesButtons,
  menuButtons,
  sendButtonsAfterRecipe,
  buttonsAfterFollowRecipe,
  buttonsWithRecipeConversation,
} from 'src/i18n/buttons/button';
import axios from 'axios';
import { title } from 'process';

dotenv.config();

@Injectable()
export class SwiftchatMessageService extends MessageService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;
  private youtube_url= process.env.youtube_url;
  private youtube_apiKey=  process.env.youtube_apiKey;
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
    const recipeName = result.split('\n')[0].trim();
    console.log('🍽️ Extracted Recipe Name:', recipeName); 
    await this.sendYouTubeLinks(this.apiKey, from, recipeName, language);

    
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
  async sendSpecificRecipe(from: string,localisedStrings: string,result: any,language: string,) {
    const strings = LocalizationService.getLocalisedString(language);
    const title = result
            .split('\n')[0]
            .replace(/.*:\s*/, '')
            .replace(/^\*\*\s*/, '')
            .trim();
    console.log(title);
    await this.sendYouTubeLinks1(this.apiKey, from, title, language);
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
    const titleMatch = result.match(/^(?:.*?:\s*)?\*\*?(.*?)\*\*/);
        const title = titleMatch ? titleMatch[1].trim() : '';
        if (title) {
            await this.sendYouTubeLinks1(this.apiKey, from, title, "english");
        }
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
  ///..................................... for 1 button ..................................................//
    async sendYouTubeLinks(
      apiKey: string,
      recipientMobile: string,
      recipeName: string,
      language: string
    ): Promise<any> {
      try {
        const localisedStrings = LocalizationService.getLocalisedString(language);
        const query = recipeName.trim() + ' ' + localisedStrings.query;
        console.log(`Searching for: ${query}`);
    
        const youtube_response = await axios.get(this.youtube_url, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 3,
            key: this.youtube_apiKey, // Store in env variable
          },
        });
    
        if (!youtube_response.data.items || youtube_response.data.items.length === 0) {
          console.log('No videos found.');
          return undefined;
        }
    
        const youtubeData = youtube_response.data.items.map((item) => ({
          title: this.ellipsiseText(item.snippet.title, 99),
          description: this.ellipsiseText(
            item.snippet.description || `Food Magic ${item.snippet.title}`,
            1000
          ),
          thumbnail: item.snippet.thumbnails.default.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));
    
        console.log('YouTube Data:', youtubeData);
    
        const requestData = youtubeData.map((item) => ({
          tags: ['Food Magic'],
          title: item.title,
          header: {
            type: 'text',
            text: { body: item.url },
          },
          description: item.description,
        }));
    
        const requestBody = {
          to: recipientMobile,
          type: 'article',
          article: requestData,
        };
    
        const response = await axios.post(this.baseUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        });
    
        console.log('Message sent successfully.');
        return youtubeData;
      } catch (error) {
        console.error(`Error fetching YouTube videos: ${error.message}`);
        return undefined;
      }
    }
    
    ellipsiseText(text: string, maxLength: number): string {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
  //...............................for button 2.........................
  async sendYouTubeLinks1(
    apiKey: string,
    recipientMobile: string,
    title: string,
    language: string
  ): Promise<any> {
    try {
      const localisedStrings = LocalizationService.getLocalisedString(language);
      const query = title.trim() + ' ' + localisedStrings.query;
      console.log(`Searching for: ${query}`);
  
      const youtube_response = await axios.get(this.youtube_url, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 3,
          key: this.youtube_apiKey, // Store in env variable
        },
      });
  
      if (!youtube_response.data.items || youtube_response.data.items.length === 0) {
        console.log('No videos found.');
        return undefined;
      }
  
      const youtubeData = youtube_response.data.items.map((item) => ({
        title: this.ellipsiseText(item.snippet.title, 99),
        description: this.ellipsiseText(
          item.snippet.description || `Food Magic ${item.snippet.title}`,
          1000
        ),
        thumbnail: item.snippet.thumbnails.default.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
  
      console.log('YouTube Data:', youtubeData);
  
      const requestData = youtubeData.map((item) => ({
        tags: ['Food Magic'],
        title: item.title,
        header: {
          type: 'text',
          text: { body: item.url },
        },
        description: item.description,
      }));
  
      const requestBody = {
        to: recipientMobile,
        type: 'article',
        article: requestData,
      };
  
      const response = await axios.post(this.baseUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Message sent successfully.');
      return youtubeData;
    } catch (error) {
      console.error(`Error fetching YouTube videos: ${error.message}`);
      return undefined;
    }
  }
  
  ellipsiseText1(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
    
}
