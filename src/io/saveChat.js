const app = require('../app');

async function saveChat(props) {
  try {
    let {userId} = props;
    let {sender, message} = props.data;
    let chatService = app.service('chat');
    let chatResult = await chatService.find({query: {userId}});
    if (chatResult.total > 0) {
      let data = chatResult.data[0].data;
      data.push({sender, message, timeStamp: Date.now()});
      chatResult = await chatService.update(chatResult.data[0]._id, {
        ...chatResult.data[0],
        data,
      });
    } else {
      let chat = {userId, data: [{sender, message, timeStamp: Date.now()}]};
      chatResult = await chatService.create(chat);
    }
    // console.log(chatResult);
  } catch (e) {
    console.log(e);
  }
}

module.exports = saveChat;
