import React, { Component, useState, useEffect, useRef } from 'react';
import {
    StatusBar,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView, Text,
    PermissionsAndroid, ImageBackground,
    FlatList,
    Image,
} from 'react-native';
import { Card } from 'native-base';
import HTMLView from 'react-native-htmlview';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import GlobalInclude from '../Global/globalinclude';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import helpers from '../Global/Helper/helper';
import { Alert } from 'react-native';
import { Platform } from 'react-native';
import { API_KEY, APP_URL } from '../Global/config'
let is_send_enable = false, alltachmentResponse = null
import { KeyboardAvoidingView } from 'react-native';
const options = {
    title: 'Select Avatar',
    noData: true,
    maxWidth: 720,
    maxHeight: 1024,
    allowsEditing: false,
    storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
    },
};
const Chatdetail = ({ navigation, route }) => {
    const [messageData, setMessageData] = useState([]);
    const [messagetext, setMessageText] = useState('');
    const [senderimage, setSenderImage] = useState('');
    const [receiverimage, setReciverImage] = useState('');
    const [receivername, setReciverName] = useState('');
    const [messagetype, setMessageType] = useState(0);
    const [attachmentpath, setAttachmentPath] = useState('');
    const [senderName, setSenderName] = useState('')
    const [attachmentresponse, setAttachmentResponse] = useState(null);
    let FlatListRef = useRef(null);

    useEffect(() => {

        getMessageApi();
        setMessageType(0)
        const intervalId = setInterval(() => {
            getMessageApi();
        }, 10000);

        return () => clearInterval(intervalId);
        // return () => clearInterval(intervalId); //This is important
    }, []);

    const deleteDialog = (id) => {
        Alert.alert('Are you sure want to delete message?', '', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteApiCall(id) },
        ]);
    };

    const permissionAttachment = (url) => {
        if (Platform.OS === 'ios') {
            downloadAttachment(url);
        } else {
            requestPermission(url);
        }
    };
    const requestPermission = async (url) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Download  Permission',
                    message: '',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                downloadAttachment(url);
            } else {
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const downloadAttachment = (url) => {
        var RandomNumber = Math.floor(Math.random() * 100) + 1;
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: true,
                path: PictureDir + '/attachment_' + RandomNumber, // this is the path where your downloaded file will live in
                description: 'Downloading Attachment.',
            },
        };
        config(options)
            .fetch('GET', url)
            .then((res) => {
                
                helpers.ToastShow('Download Successfully', 'success');

                // do some magic here
            });
    };
    const deleteApiCall = (id) => {
        global.global_loader_reff.show_loader(1);
        let deleteobj = {
            id_sender: route.params.id_sender !== undefined ? route.params.id_sender : global.userid,
            sender_type: route.params.sender_type !== undefined ? route.params.sender_type : '3',

            // id_sender: global.user_id_val,
            // sender_type: global.user_type_val === 'user' ? '3' : '2',
            id_receiver: route.params.receiver_id,
            receiver_type: route.params.receiver_type,
            id: id,
            call_from: Platform.OS,
        };
        let url = 'chat/delete';

        helpers.UrlReq(url, 'POST', deleteobj).then((response) => {
            if (response.status) {
                global.global_loader_reff.show_loader(0);
                helpers.ToastShow(response.message, 'success');

                getMessageApi();
            } else {
                global.global_loader_reff.show_loader(0);
                helpers.ToastShow(response.message, 'fail');
            }
        });
    };

    const sendMessage = () => {
      
        if (messagetext !== '') {
            setMessageType(1);
            sendMessageApiCall(1);
        } else if (alltachmentResponse !== null) {
            global.global_loader_reff.show_loader(1);
            setMessageType(2);
            sendMessageApiCall(2);
        }
    };
    const sendMessageApiCall = (type) => {
        global.global_loader_reff.show_loader(1);
        let sendobj = {
            id_sender: route.params.id_sender !== undefined ? route.params.id_sender : global.userid,
            sender_type: '3',
            // id_sender: global.user_id_val,
            // sender_type: global.user_type_val === 'user' ? '3' : '2',
            id_receiver: route.params.receiver_id,
            receiver_type: '3',
            message: messagetext,
            message_type: type,
            call_from: Platform.OS,
        };
        const body = [];
        const sendBodyString = JSON.stringify(sendobj);
        body.push({ name: 'data', data: sendBodyString });
        let imageDetail = null, imageName = '';

        if (alltachmentResponse !== null) {
            imageDetail = JSON.parse(JSON.stringify(alltachmentResponse));
        }

        if (imageDetail !== null) {



            if (
                imageDetail.fileName === undefined ||
                imageDetail.fileName == null ||
                imageDetail.fileName === ''
            ) {
                var extension = imageDetail.type.split('/')[1];
                imageName = new Date().getTime() + '.' + extension;
            } else {
                var ext = extension.exec(imageDetail.fileName)[1];
                imageName = new Date().getTime() + '.' + ext;
            }
            // let imageName =
            //   imageDetail.name !== null && imageDetail.name !== ''
            //     ? imageDetail.name
            //     : new Date().getTime();
            let imagePath =
                Platform.OS === 'ios'
                    ? imageDetail.uri.replace('file://', '')
                    : imageDetail.uri;
            let imageType = imageDetail.type;

            var imageData = {
                name: 'attachment',
                filename: imageName,
                type: imageType,
                data: RNFetchBlob.wrap(decodeURI(imagePath)),
            };

            // formdata.append("attachment", this.state.imageResponse);
            body.push(imageData);
        }


        console.log("responseresponse",body)
        let edit_api_url = APP_URL + 'api/chat/send';
        RNFetchBlob.fetch(
            'POST',
            edit_api_url,
            {
                'Content-Type': 'multipart/form-data',
                apikey: API_KEY,
            },
            body,
        )
            .then((resp) => {
                let bodyData = JSON.parse(resp.data);
                let response = bodyData;
                // console.log("responseresponse",response)
                if (response.status) {
                    //  global.global_loader_reff.show_loader(0);
                    alltachmentResponse = null

                    setMessageText('');
                    getMessageApi("loading");

                    // helpers.ToastShow(response.message, 'success');
                } else {
                    GlobalInclude.showError(response.message.attachment)
                    // helpers.ToastShow(response.message.attachment, 'fail');
                    global.global_loader_reff.show_loader(0);
                }
            })

            .catch((err) => {
                console.log("responseresponse",err)
            });
    };

    const attachmentClick = async () => {

        // launchImageLibrary(options, (response) => {
        //   if (response.didCancel) {
        //   } else if (response.error) {
        //   } else if (response.customButton) {
        //   } else {
        //     setMessageType(2);
        //     setAttachmentPath({uri: response.uri});
        //     setAttachmentResponse(response);
        //   }
        // });

        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],

            });

            if (res !== null) {

                setMessageType(2);

                setAttachmentPath({ uri: res.uri });
                alltachmentResponse = res
                // setAttachmentResponse(res);
                setTimeout(() => {
                sendMessage();
                }, 30);



            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    };

    const getMessageApi = (name) => {
        console.log("name",name)
        if(name){
            global.global_loader_reff.show_loader(1);
        }
        let chatobj = {
            id_sender: route.params.id_sender !== undefined ? route.params.id_sender : global.userid,
            sender_type: route.params.sender_type !== undefined ? route.params.sender_type : '3',
            id_receiver: route.params.receiver_id,
            receiver_type: route.params.receiver_type,
            get_full: true,
            last_message_id: 0,
            first_message_id: 0,
            is_send_enable: true,
            new_message_id_receiver: [],
            new_message_receiver_type: [],
            call_from: Platform.OS,
        };

        let url = 'api/chat/get_message';

        helpers.UrlReq(url, 'POST', chatobj).then((response) => {

            if (response.data !== null) {
                console.log("response.dataresponse.dataresponse.data",response.data)
                if (response.data.sender_info) {
                    setSenderImage(response.data.sender_info.image);
                    setSenderName(response.data.sender_info.name);
                }
                if (response.data.receiver_info) {
                    setReciverImage(response.data.receiver_info.image);
                    setReciverName(response.data.receiver_info.name);
                }
                is_send_enable = response.data.is_send_enable

                if (response.data.chat !== null) {

                    if (response.data.chat.length > 0) {

                        if (name === 'scroll') {
                        }
                        setMessageData(response.data.chat.reverse());
                        setTimeout(() => {
                            global.global_loader_reff.show_loader(0);
                        }, 100);
                     
                    } else {
                        setMessageData([]);
                        global.global_loader_reff.show_loader(0);
                    }
                }
               
            }
        });
    };
    const clickEmailChat = () => {
        global.global_loader_reff.show_loader(1);
        let chatobj = {
            id_sender: route.params.id_sender !== undefined ? route.params.id_sender : global.userid,
            sender_type: '3',
            id_receiver: route.params.receiver_id,
            receiver_type: '3',

            call_from: Platform.OS,
        };


        let url = 'api/chat/email_chat';

        helpers.UrlReq(url, 'POST', chatobj).then((response) => {
            if (response.status) {
                global.global_loader_reff.show_loader(0);
                GlobalInclude.showToast(response.message)
            } else {
                global.global_loader_reff.show_loader(0);
                GlobalInclude.showError(response.message)
            }
        })
    }
    const checkValidImageUrl = (url) => {
        var types = ['jpg', 'jpeg', 'png'];

        //split the url into parts that has dots before them
        var parts = url.split('.');

        //get the last part
        var extension = parts[parts.length - 1];

        //check if the extension matches list
        if (types.indexOf(extension) !== -1) {
            return true;
        }
    };

    
        const messageItem = (item, index) => {
        return (
            <View style={{ flex: 1 }}>

                {item.item.id_receiver !== global.userid ? (
                    <View
                        style={{
                            marginTop: scale(5),
                            width: '100%',
                            justifyContent: 'flex-end',
                        }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: scale(5), alignItems: 'center', marginTop: scale(7) }}>

                            <GlobalInclude.GlobalText style={[styles.revicersendername, { paddingRight: scale(5) }]} text={senderName} />
                            <Image
                                style={styles.imageView}
                                source={{
                                    uri: senderimage,
                                }}
                            />
                        </View>

                        <View style={styles.talkBubble}>
                            <View style={styles.talkBubbleSenderTriangle} />
                            <View style={styles.talkBubbleSenderSquare}>

                                {item.item.message_type === '2' ?
                                    < View style={styles.reciverView}>
                                        <View style={{ padding: scale(5), alignSelf: 'center', }}>
                                            {item.item.message_type === '2' ? (
                                                <View style={{ marginTop: scale(5), }}>
                                                    {checkValidImageUrl(item.item.message[1]) === true ? (

                                                        <Image
                                                            style={styles.attachmentImage}

                                                            source={{
                                                                uri: item.item.message[1],
                                                            }}
                                                        />

                                                    ) : null}
                                                </View>
                                            ) : null}
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                                {item.item.message_type === '2' ? (
                                                    <TouchableOpacity
                                                        onPress={() => permissionAttachment(item.item.message[1])}
                                                        style={{ margin: scale(5) }}>
                                                        <GlobalInclude.AntDesign
                                                            name="download"
                                                            size={20}
                                                            color="red"
                                                        />
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        </View>
                                    </View> : null}
                                {item.item.message ?
                                <>
                                {item.item.message_type === '1' ||
                                    item.item.message_type === '0' ? (
                                    <HTMLView
                                        value={item.item.message.replace('<br></p></br>', '\n')}
                                        ignoredTags={['br']}
                                        textComponentProps={{
                                            style: {
                                                fontFamily: GlobalInclude.GlobalFont.Bold,
                                                fontSize: scale(14),
                                                color: 'black', justifyContent: 'center'
                                            },
                                        }}
                                    />
                                ) : (
                                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                       
                                        <HTMLView
                                            value={item.item.message[0] ? item.item.message[0].replace('<br></p></br>', '\n') : ''}
                                            ignoredTags={['br']}
                                            textComponentProps={{
                                                style: {
                                                    fontFamily: GlobalInclude.GlobalFont.Bold,
                                                    fontSize: scale(14),
                                                    color: 'black', alignSelf: 'center'
                                                },
                                            }}
                                        />
                                            
                                    </View>
                                )}

                            </>
                               : null }

                            </View>
                        </View>

                    </View>
                ) : null
                }
                {
                    item.item.id_receiver === global.userid ? (
                        <View style={{ marginTop: scale(5), }}>
                            <View style={{ flexDirection: 'row', margin: scale(5), alignItems: 'center', marginTop: scale(7) }}>
                                <Image
                                    style={styles.imageView}
                                    source={{
                                        uri: receiverimage,
                                    }}
                                />
                                <GlobalInclude.GlobalText style={styles.revicersendername} text={receivername} />

                            </View>
                            <View style={styles.talkBubble}>
                                <View style={styles.talkBubbleTriangle} />
                                <View style={styles.talkBubbleSquare}>

                                    {item.item.message_type === '2' ? (
                                        <View style={styles.reciverView}>
                                            <View style={{ padding: scale(5) }}>
                                                {item.item.message_type === '2' ? (
                                                    <View style={{ marginTop: scale(5) }}>
                                                        {checkValidImageUrl(item.item.message[1]) === true ? (
                                                            <View style={styles.imageattachmentView}>
                                                                <Image
                                                                    style={styles.attachmentImage}

                                                                    source={{
                                                                        uri: item.item.message[1],
                                                                    }}
                                                                />
                                                            </View>
                                                        ) : null}
                                                    </View>
                                                ) : null}
                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                                    {item.item.message_type === '2' ? (
                                                        <TouchableOpacity
                                                            onPress={() => downloadAttachment(item.item.message[1])}
                                                            style={{ margin: scale(5) }}>
                                                            <GlobalInclude.AntDesign
                                                                name="download"
                                                                size={20}
                                                                color="red"
                                                            />
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </View>
                                            </View>
                                        </View>) : null}
                                    {item.item.message_type === '1' ||
                                        item.item.message_type === '0' ? (
                                        <HTMLView
                                            value={item.item.message.replace('<br></p></br>', '\n')}
                                            ignoredTags={['br']}
                                            textComponentProps={{
                                                style: {
                                                    fontFamily: GlobalInclude.GlobalFont.Bold,
                                                    fontSize: scale(14),
                                                    color: 'black', justifyContent: 'center'
                                                },
                                            }}
                                        />
                                    ) : (
                                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                          
                                            <HTMLView
                                                value={item.item.message[0] ? item.item.message[0].replace('<br></p></br>', '\n') : ''}
                                                ignoredTags={['br']}
                                                textComponentProps={{
                                                    style: {
                                                        fontFamily: GlobalInclude.GlobalFont.Bold,
                                                        fontSize: scale(14),
                                                        color: 'black', color: 'black', alignSelf: 'center'
                                                    },
                                                }}
                                            />
                                             
                                        </View>
                                    )}

                                </View>
                            </View>
                        </View>
                    ) : null
                }
            </View >
        );
    };
    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor={GlobalInclude.GlobalColor.ColorLightPink}
                barStyle="dark-content"
            />
            <ImageBackground
                source={Global.GlobalAssets.bgImg}
                style={styles.bgImg}
                resizeMode={'cover'}>



                <Global.GlobalHeader onPress={() => navigation.goBack()} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={styles.baseView}>
                        <Card style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Global.GlobalText text="CHATS" style={{ color: 'white' }} />
                            </View>
                            <TouchableOpacity activeOpacity={1} style={[styles.chatVew, { alignItems: 'center', backgroundColor: GlobalInclude.GlobalColor.themeLightBlue }]}>
                                <View style={styles.chatOne}>
                                    <Image
                                        source={{ uri: receiverimage }}
                                        style={styles.imageView}

                                    />
                                </View>
                                <View style={styles.chatContainer}>
                                    <Global.GlobalText
                                        text={receivername}
                                        style={styles.titleText}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => clickEmailChat()}>
                                        <Image source={Global.GlobalAssets.chatLayer} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            <View style={{
                                flex: 1, backgroundColor: GlobalInclude.GlobalColor.lightPink, borderBottomStartRadius: scale(15),
                                borderBottomEndRadius: scale(15),
                            }}>
                                <View style={{ flex: 1, padding: scale(10) }}>
                                    {messageData.length > 0 ? (
                                        <FlatList
                                            inverted
                                            data={messageData}
                                            showsVerticalScrollIndicator={false}
                                            ref={(ref) => (FlatListRef = ref)}
                                            renderItem={messageItem}
                                            keyExtractor={(item) => item.id}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <GlobalInclude.GlobalText style={{ fontSize: scale(12) }} text="No Record Found" />
                                        </View>
                                    )}
                                </View>
                                {is_send_enable === true ?
                                    <View
                                        style={{
                                            flexDirection: 'row',

                                            backgroundColor: 'rgba(231,213,225,255)',

                                        }}>
                                        <TouchableOpacity
                                            style={styles.attachmentButtonView}
                                            onPress={() => {

                                                attachmentClick()
                                            }
                                            }>
                                            <View style={{ width: scale(30), borderRadius: scale(5), marginLeft: scale(5), height: scale(30), alignItems: 'center', justifyContent: 'center', backgroundColor: GlobalInclude.GlobalColor.themeBlue, marginTop: scale(5) }}>
                                                <GlobalInclude.AntDesign name="plus" size={20} color="white" />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: '70%', }}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Type a message"
                                                placeholderTextColor="black"
                                                onChangeText={(text) => setMessageText(text)}
                                                value={messagetext}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={styles.sendButtonView}
                                            onPress={() => sendMessage()}>
                                            <Image source={GlobalInclude.GlobalAssets.messageSend}
                                                style={{ width: scale(35), height: scale(35) }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>


                                    </View> : null}

                            </View>

                        </Card>
                    </View>

                </KeyboardAvoidingView>
            </ImageBackground>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: GlobalInclude.GlobalColor.ColorWhite,
    },
    talkBubbleSenderTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: scale(50), position: 'absolute', top: scale(-20),
        borderRightWidth: scale(50), alignSelf: 'center', transform: [{ rotate: "180deg" }],
        borderBottomWidth: 0, justifyContent: 'flex-end', alignItems: 'center',
        borderLeftWidth: 0,
        borderTopColor: GlobalInclude.GlobalColor.themePink,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    talkBubbleSenderSquare: {
        width: "90%", padding: scale(15),
        marginStart: scale(10), flexDirection: 'row',
        backgroundColor: GlobalInclude.GlobalColor.themePink,

        borderRadius: 10,
    },
    talkBubbleSquare: {
        width: "90%", padding: scale(15),
        marginStart: scale(10), flexDirection: 'row',
        backgroundColor: GlobalInclude.GlobalColor.themeLightBlue,
        borderRadius: 10,
    },
    talkBubbleTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: scale(50), position: 'absolute', top: -25,
        borderRightWidth: scale(50), alignSelf: 'center', transform: [{ rotate: "270deg" }],
        borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center',
        borderLeftWidth: 0,
        borderTopColor: GlobalInclude.GlobalColor.themeLightBlue,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    imageView: {
        height: scale(45),
        width: scale(45),
        borderRadius: 150 / 2,
        alignSelf: 'center',
    },
    input: {
        color: 'black', fontFamily: GlobalInclude.GlobalFont.Bold,
        height: scale(40),

    },
    child: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: GlobalInclude.GlobalColor.ColorLightPink,
    },
    attachmentImage: {
        height: 45,
        width: 45,
        borderRadius: 45 / 2,
        alignSelf: 'center',
    },
    senderView: {
        alignSelf: 'flex-end',
        marginTop: scale(10),

        flexDirection: 'row',
        width: '70%',
        paddingLeft: scale(15),
        marginLeft: scale(50),
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(15),

        borderBottomLeftRadius: scale(30),
    },
    revicersendername: {
        paddingStart: scale(5),
        fontSize: scale(12), fontFamily: GlobalInclude.GlobalFont.Bold, color: "black", justifyContent: 'center'
    },
    imageattachmentView: {
        // borderRadius: scale(40),
        // borderWidth: 1,
        // borderColor: 'black',
        // width: scale(40),
        alignItems: 'center',
        justifyContent: 'center',
        // height: scale(40),
    },
    attachmentButtonView: {
        width: '15%',

    },
    scrollVew: { marginBottom: scale(70) },
    chatOne: {
        flex: 2,
    },
    sendMessage: {
        height: scale(40),
        width: scale(40),
        backgroundColor: GlobalInclude.GlobalColor.themePink,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userImg: { height: scale(45), width: scale(45), borderRadius: scale(45) },
    chatBagde: {
        backgroundColor: GlobalInclude.GlobalColor.themePink,
        minHeight: scale(20),
        minWidth: scale(20),
        borderRadius: scale(20),
        alignSelf: 'flex-end',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    talkBubble: {
        backgroundColor: "transparent", marginTop: scale(5),
    },
    chatVewActive: {
        flexDirection: 'row',
        padding: scale(15),
        borderBottomWidth: 2,
        borderBottomColor: 'white',
        backgroundColor: GlobalInclude.GlobalColor.lightPink,
    },
    chatContainer: { flex: 8, marginLeft: scale(18) },
    chatVew: { flexDirection: 'row', height: scale(60), padding: scale(20) },
    messageText: {
        textTransform: 'none',
        fontSize: scale(20),
        color: '#37266e',
        fontFamily: GlobalInclude.GlobalFont.Regular,
        marginTop: scale(5),
    },
    threeFlex: {
        flex: 3,
    },
    timeDuration: {
        textTransform: 'none',
        fontSize: scale(16),
        color: '#37266e',
        fontFamily: GlobalInclude.GlobalFont.RobotoRegular,
        marginTop: scale(15),
    },
    bgImg: { flex: 1, },
    card: {
        marginLeft: scale(10),
        marginRight: scale(10),
        borderRadius: scale(15),
        backgroundColor: GlobalInclude.GlobalColor.lightPink,
        width: scale(285), flex: 1,
    },

    titleText: {
        fontFamily: GlobalInclude.GlobalFont.Bold,
        textTransform: 'none',
        color: '#37266e',
        fontSize: scale(15),
    },
    innerCard: {
        backgroundColor: 'white',
        marginLeft: scale(10),
        marginRight: scale(10),
    },
    cardHeader: {
        height: scale(60),
        backgroundColor: GlobalInclude.GlobalColor.darkBlue,
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
    inputContainerStyle: {
        backgroundColor: GlobalInclude.GlobalColor.themeLightBlue,
        borderTopColor: '#E8E8E8',
        borderTopWidth: 1,
        borderRadius: scale(5),
        fontFamily: GlobalInclude.GlobalFont.Regular,
        color: 'black',
    },
    sendButtonView: {
        width: '15%', marginTop: scale(2),
        marginLeft: scale(7),
    },
    mainTitle: {
        textAlign: 'left',
        marginTop: scale(5),
        paddingLeft: scale(5),
        fontFamily: GlobalInclude.GlobalFont.Bold,
    },
    reciverView: {
        alignItems: 'center',
        marginTop: scale(0),
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomRightRadius: scale(0),
    },
    activeImage: {
        textAlign: 'left',
        paddingLeft: scale(5),
        fontFamily: GlobalInclude.GlobalFont.Bold,
    },
    messageText: {
        textAlign: 'left',
        marginTop: scale(5),
        paddingLeft: scale(5),
        paddingRight: scale(10),
        fontSize: scale(12),
        fontFamily: GlobalInclude.GlobalFont.Bold,
    },
    parent: {
        height: scale(120),
        width: '100%',
    },
    filterview: {
        width: '50%',
        height: scale(50),
        paddingRight: scale(10),
        alignItems: 'flex-end',
    },
    dateText: {
        textAlign: 'left',
        paddingLeft: scale(5),
        fontSize: scale(12),
        alignSelf: 'flex-end',
        paddingTop: scale(5),
        color: '#a7a7a8',
    },
    drawerview: {
        width: '50%',
        flexDirection: 'row',
        height: scale(50),
        paddingLeft: scale(10),
        justifyContent: 'flex-start',
    },

    baseView: {
        flex: 1, alignItems: 'center',

    },
    ourproducttext: {
        fontFamily: GlobalInclude.GlobalFont.Bold,
        textAlign: 'center',
        fontSize: scale(17),
        paddingLeft: scale(10),
        color: GlobalInclude.GlobalColor.ColorBlack,
    },
});
export default Chatdetail;
