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
      let user = await this.findUserByMobileNumber(mobileNumber, botID);
console.log("finding USer===", user)
      if (user) {
        const updateUser = {
          TableName: USERS_TABLE,
          Item: user,
        };
        await dynamoDBClient().put(updateUser).promise();
        return user;
      } else {
        console.log("creating new user ")
        const newUser = {
          TableName: USERS_TABLE,
          Item: {
            id: uuidv4(),
            mobileNumber: mobileNumber,
            language: language,
            Botid: botID,
          },
        };
        console.log("User created")
        await dynamoDBClient().put(newUser).promise();
        console.log("User created", newUser)
        return newUser;
      }
    } catch (error) {
      console.error('Error in createUser:', error);
    }
  }
// async createUser(
//   mobileNumber: string,
//   language: string,
//   botID: string,
// ): Promise<User | any> {
//   try {
//     const newUser = {
//       id: uuidv4(),
//       mobileNumber: mobileNumber,
//       language: language,
//       Botid: botID,
//     };
    
//     console.log("Creating new user ", newUser);
//     const params = {
//       TableName: USERS_TABLE,
//       Item: newUser,
//     };
//     await dynamoDBClient().put(params).promise();
//     // console.log("User created", newUser);
//     return newUser; // Return just the user object
//   } catch (error) {
//     console.error('Error in createUser:', error);
//     throw error; // Consider throwing the error for handling elsewhere
//   }
// }
  async findUserByMobileNumber(mobileNumber: string, Botid: string): Promise<User | any> {
    try {
  console.log(mobileNumber, Botid)
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
        missingIngredients: user.missingIngredients
      },
    };
    return await dynamoDBClient().put(updateUser).promise();
  }
  async deleteUser(mobileNumber: string, Botid: string): Promise<void> {
    try {
      const params = {
        TableName: USERS_TABLE,
        Key: {
          mobileNumber: mobileNumber,
          Botid: Botid,
        },
      };
      await dynamoDBClient().delete(params).promise();
      console.log(
        `User with mobileNumber ${mobileNumber} and Botid ${Botid} deleted successfully.`,
      );
    } catch (error) {
      console.error('Error deleting user from DynamoDB:', error);
    }
  }
}
