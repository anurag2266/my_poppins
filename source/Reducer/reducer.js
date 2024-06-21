import initialState from './initialState';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'APPS.NOTIFICATIONINCREMENT':
      return {
        ...state,
        apps: {
          ...state.apps,
          notificationCount: global.notification_count,
        },
      };
    case 'APPS.CHATINCREMENT':
      return {
        ...state,
        apps: {
          ...state.apps,
          chatCount: global.chat_count,
        },
      };



    default:
      return state;
  }
}
