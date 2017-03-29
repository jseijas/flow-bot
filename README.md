# Flow Bot Manager

The Flow Bot Framework is based on the Microsoft Bot Framework, but including some cool features and a way of defining the bots only describing the cards to the user and the dialog flow.

You can find an example of use at: https://github.com/jseijas/flow-bot-example/

* Persistance: A Persistance layer is added with the flow-storage component. Default storages developed are: memory, json files, loopback model. You can implement your own storages only implementing the FlowStorage abstract class.
* i18n: A translation module is added. Instead of using "tag constants" you can use directly a default language.
* Template: A template engine is added with Mustache. The template engine can be used even in the i18n literal. The template engine replace named variables from a view object that is automatically filled.
* JSON Cards: Instead of building your cards programatically, you can use directly a JSON file for representing them. You can add texts, images, hero cards, thumbnail cards, prompts, choices,...
* Menu Card: A menu card is a choice prompt that automatically route to other dialog states.
* Multilanguage Choices: The choice prompts can be Multilanguage, and automatically the text of the choice is translated to a tag for the developer.
* Automatic load of Cards: Define a folder where the JSON files of the cards are located, and the framework will automatically load them for you.
* Automatic load of Actions: Define your actions separatelly into a folder. They will be automatically loaded into the framework using the name of the file as name of the action, so you can invoke them automatically from your dialogs.
* Automatic load of Dialogs: Define your dialogs in the ".flow" format, and will be loaded from the folder.
* Prompt variables: You can define prompt variables where the result of the prompt will be stored. The prompt variables can be assigned to the current user (the user id will be used) or to the dialog with the name. Example: "user.age" or "dialog.value".

## Dialog Flow format

Example of use:
```bash
/ -> greetings.card, greetings.text, logsomething(), /help, /menu, greetings.goodbye
/help
/menu*
/prompts -> prompts.text, prompts.number, prompts.choice
/picture
/cards
/list
/carousel
/receipt
/actions
```

You can define a dialog simply putting the name, the symbol "->" and then the waterfall to be executed. The waterfall can have three type of actions:
* Cards: put the name of the card.
* Dialogs: put the name of the dialog. You can recognize them because the '/' at the beginning of the name. This will invoke the session.beginDialog passing the name of the dialog.
* Actions: put the name of the action. You can recognize them becase the '()' at the end of the name. The actions will be invoked automatically binded to the bot, so you can use bot methods using the "this".

When a dialog has not waterfall defined, then is assumed that the waterfall is to call a card with the same name as the menu.
This way, '/help' is equal to '/help -> help'

## Card JSON format
Each card JSON file can contain an array of cards. The format of the cards is like this:

```json
  {
    "name": "greetings",
    "type": "text",
    "text": "Hello world {{ message.user.name }}"
  }
```
A more complete example can be a menu:
```json
  {
    "name": "menu",
    "type": "prompt",
    "prompt": "choice",
    "isMenu": "true",
    "variable": "dialog.pepe",
    "text": "What demo would you like to run?",
    "options": [
      { "tag": "prompts", "text": "Prompts" },
      { "tag": "picture", "text": "Picture" },
      { "tag": "cards", "text": "Cards" },
      { "tag": "list", "text": "List" },
      { "tag": "carousel", "text": "Carousel" },
      { "tag": "receipt", "text": "Receipt" },
      { "tag": "actions", "text": "Actions" },
      { "tag": "endDialog", "text": "Quit" }
    ]
  }
```
At the options we can see the difference between the text that is shown to the user and the tag that the developer can use internally. Also, the "isMenu" property converts this choice card into a menu card, so the tags are also the name of other dialogs. The options choosen by the user is stored in the variable defined, in this case in a dialog variable.


## Use of the Flow Bot Framework.

The Flow Bot Framework is available via NPM.

```bash
npm install --save flow-bot-manager
```
You can use express, loopback, hapi, restify... to expose your bot API as a service. In this example we use restify:
```bash
npm install --save restify
```

And then you can create a bot folder with your bot behaviour (cards, actions, dialogs, and translations), and put the following code in the index.js to create the bot:

```javascript
const BotManager = require('flow-bot-manager').default;
const restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
var opts = {
  defaultLocale: 'en',
  localesPath: './bot/locales',
  cardPath: './bot/cards',
  actionPath: './bot/actions',
  dialogPath: './bot/dialogs'
};
server.botManager = new BotManager(opts);
server.post('/api/messages', server.botManager.connector.listen());
```

## Test your bot 

You can use the Microsoft Bot Channel Emulator to test your bot

## Define your Microsoft APP_ID and APP_PASSWORD

You can set them from the environment variables BOT_APP_ID and BOT_APP_PASSWORD or pass them in the opts of the BotManager when you create the instance:

```javascript
var opts = {
  botAppId: '<YOUR APP ID>',
  botAppPassword: '<YOUR APP PASSWORD>',
  defaultLocale: 'en',
  localesPath: './bot/locales',
  cardPath: './bot/cards',
  actionPath: './bot/actions',
  dialogPath: './bot/dialogs'
};
```
## Accessing the Microsoft Framework bot instance and connector

You can simply access the UniversalBot instance as the property "bot" and the connector as the property "connector", of the BotManager instance.
