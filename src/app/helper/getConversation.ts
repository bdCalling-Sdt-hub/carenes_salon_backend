import Client from '../modules/client/client.model';
import Conversation from '../modules/conversation/conversation.model';
import Customer from '../modules/customer/customer.model';
import { USER_ROLE } from '../modules/user/user.constant';

export const getConversation = async (crntUserId: string) => {
  if (crntUserId) {
    const currentUserConversation = await Conversation.find({
      $or: [{ sender: crntUserId }, { receiver: crntUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'messages',
        model: 'Message',
      })
      .populate('sender')
      .populate('receiver');
    // console.log('currentUserConversation', currentUserConversation);
    // const conversation = currentUserConversation?.map((conv) => {
    //   const countUnseenMessage = conv.messages?.reduce((prev, curr) => {
    //     const msgByUserId = curr?.msgByUserId?.toString();

    //     if (msgByUserId !== crntUserId) {
    //       return prev + (curr?.seen ? 0 : 1);
    //     } else {
    //       return prev;
    //     }
    //   }, 0);

    //   const senderRole = conv.sender.role;
    //   const receiverRole = conv.receiver.role;
    //   console.log("role",senderRole,receiverRole);
    //   let convSender;
    //   let convReceiver;
    //   if (senderRole === USER_ROLE.customer) {
    //     convSender =await Customer.findOne({ user: conv.sender.user });
    //   } else if (senderRole === USER_ROLE.client) {
    //     convReceiver =await Client.findOne({ user: conv.sender });
    //   }
    //   if (receiverRole === USER_ROLE.customer) {
    //     convReceiver =await Customer.findOne({ user: conv.receiver.user });
    //   } else if (receiverRole === USER_ROLE.client) {
    //     convReceiver =await Client.findOne({ user: conv.receiver.user });
    //   }

    //   console.log(convSender,convReceiver)

    //   return {
    //     _id: conv?._id,
    //     sender: convSender,
    //     receiver: convReceiver,
    //     unseenMsg: countUnseenMessage,
    //     lastMsg: conv?.messages[conv?.messages?.length - 1],
    //   };
    // });
    // console.log(conversation);
    // socket.emit('conversation', conversation);

    const conversation = await Promise.all(
      currentUserConversation?.map(async (conv) => {
        const countUnseenMessage = conv.messages?.reduce((prev, curr) => {
          const msgByUserId = curr?.msgByUserId?.toString();

          if (msgByUserId !== crntUserId) {
            return prev + (curr?.seen ? 0 : 1);
          } else {
            return prev;
          }
        }, 0);

        const senderRole = conv.sender.role;
        const receiverRole = conv.receiver.role;

        let convSender = null;
        let convReceiver = null;

        if (senderRole === USER_ROLE.customer) {
          convSender = await Customer.findOne({ user: conv.sender._id });
        } else if (senderRole === USER_ROLE.client) {
          convSender = await Client.findOne({ user: conv.sender._id });
        }

        if (receiverRole === USER_ROLE.customer) {
          convReceiver = await Customer.findOne({ user: conv.receiver._id });
        } else if (receiverRole === USER_ROLE.client) {
          convReceiver = await Client.findOne({ user: conv.receiver._id });
        }

        // console.log(convSender, convReceiver);

        return {
          _id: conv?._id,
          sender: convSender,
          receiver: convReceiver,
          unseenMsg: countUnseenMessage,
          lastMsg: conv?.messages[conv?.messages?.length - 1],
        };
      }),
    );

    return conversation;
  } else {
    return [];
  }
};
