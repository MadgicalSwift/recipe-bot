export function welcomeButtons(from: string, localisedStrings: any) {
  const buttons = [
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
    {
      type: 'solid',
      body: localisedStrings.helpByAIOption,
      reply: localisedStrings.helpByAIOption,
    },
  ];

  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.welcomeMessage,
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}

export function dietaryPreferencesButtons(from: string, localisedStrings: any) {
  const buttons = localisedStrings.dietaryPreferencesOption.map(
    (option: string) => {
      return {
        type: 'solid',
        body: option,
        reply: option,
      };
    },
  );

  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.dietaryPreferencesPrompt,
        },
      },
      buttons, // Use the dynamically created buttons array
      allow_custom_response: false,
    },
  };
}

export function menuButtons(from: string, localisedStrings: any) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.mainMenu,
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
        {
          type: 'solid',
          body: localisedStrings.helpByAIOption,
          reply: localisedStrings.helpByAIOption,
        },
      ],
      allow_custom_response: false,
    },
  };
}

export function sendButtonsAfterRecipe(
  from: string,
  localisedStrings: any,
  result: any,
  strings: any,
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: `${localisedStrings}\n${result}`,
        },
      },
      buttons: [
        {
          type: 'solid',
          body: strings.optionMainMenu,
          reply: strings.optionMainMenu,
        },
        {
          type: 'solid',
          body: strings.optionFollowUp,
          reply: strings.optionFollowUp,
        },
      ],
      allow_custom_response: false,
    },
  };
}

export function buttonsAfterFollowRecipe(
  from: string,
  localisedStrings: any,
  result: any,
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: result,
        },
      },
      buttons: [
        {
          type: 'solid',
          body: localisedStrings.optionMainMenu,
          reply: localisedStrings.optionMainMenu,
        },
        {
          type: 'solid',
          body: localisedStrings.optionFollowUp,
          reply: localisedStrings.optionFollowUp,
        },
      ],
      allow_custom_response: false,
    },
  };
}

export function buttonsWithRecipeConversation(
  from: string,
  localisedStrings: any,
  message: any,
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: message,
        },
      },
      buttons: [
        {
          type: 'solid',
          body: localisedStrings.optionMainMenu,
          reply: localisedStrings.optionMainMenu,
        },
        {
          type: 'solid',
          body: localisedStrings.continueQueryOption,
          reply: localisedStrings.continueQueryOption,
        },
      ],
      allow_custom_response: false,
    },
  };
}
