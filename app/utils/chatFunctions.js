import { filterObject, formatDate, prettyDateFormat } from './helper';

/**
 *
 * @param {{}} user  current user
 * @param {{}} desiredData Data to be appended to users metaData object
 * @returns {{}}
 */

export function createUserMetaData(user, desiredData) {
  const { metaData } = user;
  Object.keys(desiredData).forEach(key => {
    if (!metaData.hasOwnProperty(key)) {
      user.createMetaData({ [key]: desiredData[key] });
    } else if (metaData[key] !== desiredData[key]) {
      user.updateMetaData({ [key]: desiredData[key] });
    } else return;
  });
}

/**
 * Generates channel parameters from current user
 * @param {string} user
 * @returns {[]}
 */
export function createGroupParamEntries(user) {
  return [
    ['isPublic', false],
    ['isDistinct', true],
    ['isEphemeral', false],
    ['operatorId', user],
    ['name', `${user}'s channel`],
  ];
}

/**
 *
 * @param {{}} messageObj
 * @returns {{}}
 */

export function extractNeededMessageData(messageObj) {
  return filterObject(messageObj, [
    'channelUrl',
    'messageId',
    'createdAt',
    ['sender', '_sender'],
    ['text', 'message'],
  ]);
}

function getInvitee(channel, activeUserName) {
  const user = channel?.members?.find(
    ({ nickname }) => nickname !== activeUserName
  );

  return user;
}

export function chatManagerReducer(state, action) {
  const messages = state?.messages ?? [];
  const activeUser = sessionStorage.getItem('CurrentUser');

  switch (action.type) {
    case 'New message':
      console.log(action.messages);
      messages.push(...action.messages);

      return {
        ...state,
        messages,
      };

    case 'New channel':
      return {
        ...state,
        userChannel: action.channel,
      };

    case 'New channel and message':
      messages.push(...action.messages);

      return {
        ...state,
        userChannel: action.channel,
        invitee: getInvitee(action.channel, activeUser),
        messages,
      };

    case 'Connect':
      return {
        connected: action.isConnected,
      };

    case 'New Chat':
      return {
        ...state,
        userChannel: 'Changing',
        messages: [],
      };

    case 'Exit Chat':
      return {
        connected: true,
      };

    case 'Error':
      return {
        ...state,
        error: action.error,
      };

    case 'Reset':
      return null;

    default:
      console.error('action does not exist');
      throw new Error('Action does not exist');
  }
}

export function getFriendList(user) {
  const { metaData } = user;
  const { friends } = metaData;
  return friends ? JSON.parse(friends) : [];
}

export function handleBlock(targetUser, sb) {
  sb.blockUser(targetUser, (user, error) => {
    if (error) throw new Error(error.message);
    console.log(`${user.userId}(${user.nickname}) has been blocked`);
  });
  return `${targetUser.userId} has been blocked`;
}

export function handleUnBlock(blockedUser, sb) {
  sb.unblockUser(blockedUser, (user, error) => {
    if (error) throw new Error(error.message);
  });
  console.log(`${blockedUser.userId}(${user.nickname}) has been unblocked`);
  return `${blockedUser.userId} has been unblocked`;
}

export function formatTimeString(timeString) {
  const currentDateArr = formatDate(Date.now()).split(' ');
  const {
    '1': cMonth,
    '2': cDay,
    '3': cYear,
    '4': cTime,
    '5': cTimeOfDay,
  } = currentDateArr;

  const dateArr = formatDate(timeString).split(' ');
  const {
    '1': month,
    '2': day,
    '3': year,
    '4': time,
    '5': timeOfDay,
  } = dateArr;

  if (cYear !== year) return prettyDateFormat(dateArr, false);

  if (cMonth === month) {
    const diff = parseInt(cDay) - parseInt(day);

    if (diff === 0) {
      return `Last seen today at ${time}, ${timeOfDay}`;
    } else if (diff >= 1 && diff <= 7) {
      return `Last seen ${
        diff === 1 ? `yesterday` : `${diff} days ago`
      }, at ${time}, ${timeOfDay}`;
    } else {
      return prettyDateFormat(dateArr);
    }
  } else return prettyDateFormat(dateArr);
}
