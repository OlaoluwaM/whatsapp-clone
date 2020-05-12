import React from 'react';
import * as SendBird from 'sendbird';
import styled from 'styled-components';
import { AuthContext, ChatProvider } from '../context/Context';
import {
  chatManagerReducer,
  createUserMetaData,
  extractNeededMessageData,
} from '../utils/chatFunctions';
import { SENDBIRD_APP_ID } from '../utils/file';
import { hashCode } from '../utils/helper';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';

const ChatRoomContainer = styled.div.attrs({
  className: 'wrapper',
})`
  display: flex;
  align-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.primaryColorDark};
`;

// TODO add general error page
// TODO redo the neumorphic design

export default function Chatroom() {
  const { activeUserName: username } = React.useContext(AuthContext);
  const [chatManager, dispatch] = React.useReducer(chatManagerReducer, null);
  const [sb] = React.useState(() => new SendBird({ appId: SENDBIRD_APP_ID }));

  React.useEffect(() => {
    try {
      sb.connect(hashCode(username) + '', (user, error) => {
        if (error) throw new Error(error.message);
        const friendArray = user.metaData.friends ?? JSON.stringify([]);
        user.nickname = username;

        createUserMetaData(user, {
          friends: friendArray,
        });

        dispatch({ type: 'Connect', isConnected: user !== null });
      });
      sb.updateCurrentUserInfo(username, '');
    } catch (e) {
      console.error(e);
      dispatch({ type: 'Error', error: e });
    }
    return () => {
      dispatch({ type: 'Reset' });
      sb.disconnect();
    };
  }, []);

  const createOneToOneChannel = users => {
    const { '1': invitee } = users;
    const inviteeHash = hashCode(invitee) + '';
    const { userChannel } = chatManager;

    if (userChannel && userChannel.memberMap.hasOwnProperty(inviteeHash)) {
      return;
    } else {
      dispatch({ type: 'Exit Chat' });
      dispatch({ type: 'New Chat' });
    }

    // const gCParams = new sb.GroupChannelParams();

    // gCParams.addUserIds([inviteeHash]);
    // const obj = Object.fromEntries(createGroupParamEntries(invitee));
    // Object.assign(gCParams, obj);

    sb.GroupChannel.createChannelWithUserIds(
      [inviteeHash],
      true,
      invitee,
      '',
      ' ',
      (channel, error) => {
        if (error) dispatch({ type: 'Error', error: error.message });

        const prevMessages = channel.createPreviousMessageListQuery();

        prevMessages.Limit = 30;
        prevMessages.reverse = false;

        prevMessages.load((messages, error) => {
          if (error) dispatch({ type: 'Error', error: error.message });

          const filteredMessages = messages.map(extractNeededMessageData);

          dispatch({
            type: 'New channel and message',
            channel,
            messages: filteredMessages,
          });
        });
      }
    );
  };

  const chatManagerIsSetup = chatManager?.connected ?? false;

  const { success, loading, error } = {
    success: sb && chatManagerIsSetup && !chatManager.error,
    loading: !sb && chatManagerIsSetup && !chatManager.error,
    error: chatManagerIsSetup && chatManager.error !== undefined,
  };

  const chatContextObj = {
    sb,
    chatManager,
    dispatch,
  };

  return (
    <ChatRoomContainer>
      {success && (
        <ChatProvider value={chatContextObj}>
          <Sidebar inviteUser={createOneToOneChannel} />
          <ChatArea />
        </ChatProvider>
      )}

      {loading && !error && <p>Loading</p>}

      {error && <p>{chatManager.error}</p>}
    </ChatRoomContainer>
  );
}
