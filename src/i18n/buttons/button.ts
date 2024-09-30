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
  ];

  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.welcomeMessage
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}


export function dietaryPreferencesButtons(from: string, localisedStrings: any){
  const buttons = localisedStrings.dietaryPreferencesOption.map((option: string) => {
    return {
      type: 'solid',
      body: option,
      reply: option
    };
  });

  return{
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
  }

}