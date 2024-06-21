import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
  Image, Platform, PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import PDFView from 'react-native-view-pdf';
import showToast from '../Component/showToast';
import GlobalInclude from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import RNFetchBlob from 'rn-fetch-blob';
export default class PDFExample extends React.Component {


  permissionAttachment = () => {
    if (Platform.OS === 'ios') {
      this.downloadAttachment();
    } else {
      this.requestPermission();
    }
  };
  requestPermission = async (url) => {
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
        this.downloadAttachment();
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  downloadAttachment = () => {
    var RandomNumber = Math.floor(Math.random() * 100) + 1;
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
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
      .fetch('GET', this.props.route.params.pdf_url)
      .then((res) => {
        console.log(res)
        showToast('Download Successfully')

        // do some magic here
      });
  };

  render() {
    const source = { uri: 'http://www.africau.edu/images/default/sample.pdf', cache: true };
    console.log(this.props.route.params.pdf_url)
    const resources = {
      file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
      url: this.props.route.params.pdf_url,
      base64: 'JVBERi0xLjMKJcfs...',
    };
    const resourceType = 'url';
    //const source = require('./test.pdf');  // ios only
    //const source = {uri:'bundle-assets://test.pdf'};

    //const source = {uri:'file:///sdcard/test.pdf'};
    //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginTop: scale(30), marginHorizontal: scale(10), marginVertical: scale(10), padding: scale(20) }}>
            <View style={{ width: '90%' }}>


              <TouchableOpacity
                onPress={() => {
                  this.permissionAttachment()
                }}
                style={{


                }}>
                <AntDesign name="download" size={20} color='red' />
              </TouchableOpacity>
            </View>
            <View style={{ width: '10%' }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{

                }}>
                <AntDesign name="close" size={20} color='red' />
              </TouchableOpacity>
            </View>
          </View>
          <PDFView
            fadeInDuration={250.0}
            style={{ flex: 1 }}
            resource={resources[resourceType]}
            resourceType={resourceType}
            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
            onError={(error) => console.log('Cannot render PDF', error)}
          />


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
