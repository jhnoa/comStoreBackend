const app = require('../app');

async function historyChat(userId) {
  try {
    let chatService = app.service('chat');
    let chatResult = await chatService.find({query: {userId}});
    let data = [];
    if (chatResult.total > 0) {
      data = chatResult.data[0].data;
    } else {
      // console.log('error', userId);
      let chat = {userId, data: []};
      chatResult = await chatService.create(chat);
    }
    // console.log(chatResult);
    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = historyChat;
