import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet, Platform,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import Global from '../Global/globalinclude';
import helper from '../Global/Helper/helper';
import { scale } from '../Theme/Scalling'
import { Card } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { useDispatch, useStore } from 'react-redux';
const chatData = [
  {
    img: Global.GlobalAssets.chat1,
    count: '1',
  },
  {
    img: Global.GlobalAssets.chat2,
    count: '2',
  },
  {
    img: Global.GlobalAssets.chat3,
    count: '0',
  },
  {
    img: Global.GlobalAssets.chat4,
    count: '0',
  },
  {
    img: Global.GlobalAssets.chat5,
    count: '0',
  },
];
let is_loading = 0,
  message_counter_array = [],
  new_message_id_receiver = [],
  id_receiver = '',
  new_message_counter = '',
  chatMainData = [],
  receiver_type = '',
  intervalId = null,
  new_message_type_receiver = [];
let focusListener = null;
const Chat = ({ navigation }) => {
  const dispatch = useDispatch()
  const [chatData, setChatData] = useState([]);
  const [chatnametext, setChatNameText] = useState('');
  const [new_message_counter, setNewMessageObject] = useState('');
  React.useEffect(() => {
    focusListener = navigation.addListener('focus', () => {
      setNewMessageObject('')
      setChatNameText('')
      getChatApi("");
      notificationcountApi()
    });
    setChatNameText('')
    setNewMessageObject('')
    getChatApi("");
    intervalId = setInterval(() => {
      getChatApi("");
      //notificationcountApi()
    }, 5000);
    // const unsubscribe = navigation.addListener('focus', () => {
    // });
    return () => clearInterval(intervalId);
  }, []);
  const notificationcountApi = () => {
    helper
      .UrlReqAuth('api/user/count_notification')
      .then(res => {

        if (res.status) {
          global.chat_count = parseInt(res.data.unread_chat_message)
          //  alert(global.chat_count)
          dispatch({ type: "APPS.CHATINCREMENT" })
        }
        else {
          global.chat_count = 0;
          dispatch({ type: "APPS.CHATINCREMENT" })
        }
      })
  }
  const getChatApi = (name) => {
    is_loading = 1;
    let chatobj = {
      id_user: global.userid,
      user_type: "user", search_text: name,
      call_from: Platform.OS,
    };
    new_message_id_receiver = [];
    chatMainData = [];
    new_message_type_receiver = [];
    let url = 'chat/index';
    helper.UrlReqAuthPost('api/chat/index', 'POST', chatobj).then((response) => {
  
      if (response.data !== null) {

        if (response.data.user !== null) {
          if (response.data.user.length > 0) {
            id_receiver = response.data.user[0].id;
            receiver_type = response.data.user[0].type;
            for (let i = 0; i < response.data.user.length; i++) {
              new_message_id_receiver.push(response.data.user[i].id);
              new_message_type_receiver.push(response.data.user[i].type);
            }
            chatMainData = response.data.user;
            getMessageApi();
            setTimeout(() => {
              setChatData(chatMainData);
            }, 100);
          } else {
            setChatData([]);
          }
        }
      }
      global.global_loader_reff.show_loader(0);
    });
  };
  const getMessageApi = () => {
    is_loading = 1;
    setNewMessageObject('')
    let chatobj = {
      call_from: Platform.OS,
      first_message_id: "",
      get_full: false,
      id_receiver: '999999',
      id_sender: global.userid,
      is_send_enable: true,
      last_message_id: "",
      new_message_id_receiver: new_message_id_receiver,
      new_message_receiver_type: new_message_type_receiver,
      sender_type: '3',
      receiver_type: "3",
    };

    let url = 'api/chat/get_message';
    helper.UrlReq(url, 'POST', chatobj).then((response) => {
      setNewMessageObject(response.new_message_counter);
    });
  };
  const searchChat = () => {
    if (chatnametext === '') {
      setTimeout(() => {
        getChatApi('')
      }, 50);
    } else {
      setTimeout(() => {
        getChatApi(chatnametext)
      }, 50);
      // const newData = chatData.filter((item) => {
      //   const itemData = `${item.name.toUpperCase()}`;
      //   const textData = chatnametext.toUpperCase();
      //   return itemData.indexOf(textData) > -1;
      // });
      // // let filterdata = chatData.filter((item) => item.name == chatnametext);

      // setChatData(newData);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={Global.GlobalAssets.bgImg}
        style={styles.bgImg}
        resizeMode={'cover'}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Global.GlobalColor.themePink}
          hidden={false}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.baseView}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText text="CHATS" style={{ color: 'white' }} />
              </View>
              <View>
                <Global.GlobalTextBox
                  placeholder="Search"
                  value={chatnametext}
                  onChangeText={value => setChatNameText(value)}
                  textInputStyle={{ height: scale(40) }}
                  onSubmitEditing={() => searchChat()}
                />
                <View style={styles.searchView}>
                  <TouchableOpacity onPress={() => searchChat()}>
                    <Image
                      resizeMode="contain"
                      style={{ width: scale(20), height: scale(20) }}
                      source={Global.GlobalAssets.searchIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {chatData.length > 0 && chatData !== null && chatData !== undefined ?
                <View>
                  {chatData.map((item, index) => {
                    let chat_date = ""
                    if (item.created_at === "") {
                      chat_date = ""
                    } else {
                      chat_date = moment(item.created_at).format('hh:mm a');
                    }

                    let counter_value = 0;
                    if (new_message_counter !== '' && new_message_counter !== null && new_message_counter !== undefined
                    ) {
                      if (Object.values(new_message_counter[item.id]) !== null && Object.values(new_message_counter[item.id]) !== undefined) {
                        counter_value = Object.values(new_message_counter[item.id]);
                      }

                    }
                     return (
                      <TouchableOpacity
                        style={
                          item.count == '0'
                            ? [styles.chatVewActive]
                            : [styles.chatVew]
                        }
                        onPress={() => {
                          navigation.navigate('Chatdetail', {
                            receiver_id: item.id, receiver_type: item.type, username: item.name, profilepicture: item.profile_picture
                          })
                        }}>
                        <View style={styles.chatOne}>
                          <Image
                            source={{ uri: item.profile_picture }}
                            style={{
                              height: scale(45),
                              width: scale(45),
                              borderRadius: scale(45),
                            }}
                          />
                        </View>
                        <View style={styles.chatContainer}>
                          <Global.GlobalText
                            text={item.name}
                            style={styles.titleText}
                          />
                          {/* <Global.GlobalText
                            text={item.created_at}
                            style={styles.timeDuration}
                          /> */}
                          <Global.GlobalText
                            text={item.message}
                            style={styles.messageText}
                          />
                        </View>
                        <View style={styles.threeFlex}>
                          {counter_value === 0 ? (
                            <View style={{ margin: scale(10) }}></View>
                          ) : (
                            <View style={styles.chatBagde}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontFamily: Global.GlobalFont.Regular,
                                  textAlign: 'center',
                                }}>
                                {counter_value}
                              </Text>
                            </View>
                          )}
                          {chat_date !== "" ?
                            <Global.GlobalText
                              text={chat_date}
                              style={styles.timeDuration}
                            /> : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  {is_loading === 0 ?
                    <Text style={{ padding: scale(10), fontSize: scale(15), color: Global.GlobalColor.themeBlue }}>No Record</Text>
                    : null}
                </View>}
            </Card>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  scrollVew: { marginBottom: scale(120) },
  chatOne: {
    flex: 2,
  },
  chatBagde: {
    backgroundColor: Global.GlobalColor.themePink,
    minHeight: scale(20),
    minWidth: scale(20),
    borderRadius: scale(20),
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  searchView: {
    position: 'absolute',
    top: scale(20),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    right: scale(20),
    height: scale(20),
    width: scale(20),
  },
  chatVewActive: {
    flexDirection: 'row',
    padding: scale(15),
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    backgroundColor: Global.GlobalColor.lightPink,
  },
  chatContainer: { flex: 8, marginLeft: scale(18) },
  chatVew: {
    flexDirection: 'row',
    padding: scale(15),
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  messageText: {
    textTransform: 'none',
    fontSize: scale(13),
    color: '#37266e',
    fontFamily: Global.GlobalFont.Regular,
    marginTop: scale(3),
  },
  threeFlex: {
    flex: 3,
  },
  timeDuration: {
    textTransform: 'none',
    fontSize: scale(11),
    color: '#37266e',
    fontFamily: Global.GlobalFont.Bold,
    marginTop: scale(5),
  },
  bgImg: { height: '119%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(40),
  },
  titleText: {
    fontFamily: Global.GlobalFont.Bold,
    textTransform: 'none',
    color: '#37266e',
    fontSize: scale(16),
  },
  innerCard: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  cardHeader: {
    height: scale(60),
    backgroundColor: Global.GlobalColor.darkBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
  },
});
const mapStateToProps = (state) => ({
  chatCount: {
    apps: state.apps.chatCount,
  },
});
const mapDispatchToProps = (dispatch) => {
  dispatch({ type: "APPS.CHATINCREMENT" });
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);