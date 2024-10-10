import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { dynamoDBClient } from 'src/config/database-config.service';
import { v4 as uuidv4 } from 'uuid';
const { USERS_TABLE } = process.env;

@Injectable()
export class UserService {
  async createUser(
    mobileNumber: string,
    language: string,
    botID: string,
  ): Promise<User | any> {
    try {
      const newUser = {
        id: uuidv4(),
        mobileNumber: mobileNumber,
        language: language,
        Botid: botID,
      };

      // console.log("Creating new user ", newUser);
      const params = {
        TableName: USERS_TABLE,
        Item: newUser,
      };
      await dynamoDBClient().put(params).promise();
      return newUser; // Return just the user object
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error; // Consider throwing the error for handling elsewhere
    }
  }
  async findUserByMobileNumber(
    mobileNumber: string,
    Botid: string,
  ): Promise<User | any> {
    try {
      const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression:
          'mobileNumber = :mobileNumber and Botid = :Botid',
        ExpressionAttributeValues: {
          ':mobileNumber': mobileNumber,
          ':Botid': Botid,
        },
      };
      const result = await dynamoDBClient().query(params).promise();
      return result.Items?.[0] || null; // Return the first item or null if none found
    } catch (error) {
      console.error('Error querying user from DynamoDB:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<User | any> {
    const updateUser = {
      TableName: USERS_TABLE,
      Item: {
        mobileNumber: user.mobileNumber,
        language: user.language,
        Botid: user.Botid,
        selectedRecipeOption: user.selectedRecipeOption,
        ingredientsList: user.ingredientsList,
        numberOfPeople: user.numberOfPeople,
        specificDish: user.specificDish,
        dietaryPreference: user.dietaryPreference,
        follow_up: user.follow_up,
        full_dish: user.full_dish,
        chat_history: user.chat_history,
        chat_summary: user.chat_summary,
        recipe_conversation_Api_No: user.recipe_conversation_Api_No,
        apiUsageCount: user.apiUsageCount,
        date: user.date,
      },
    };
    return await dynamoDBClient().put(updateUser).promise();
  }
}
