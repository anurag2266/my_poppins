import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Keyboard, PermissionsAndroid
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import RNFetchBlob from 'rn-fetch-blob';
import { Card } from 'native-base';
let id_invoice = '', series = '', GST_amount = 0, grand_total = 0,
  invoice_document = '', booking_type = '';
const Invoicedetails = ({ navigation, route }) => {

  id_invoice = route.params.id_invoice;
  series = route.params.series;
  booking_type = route.params.booking_type;
  const data=route.params.items
  const [grandTotal, setGrandTotal] = useState(0)
  const [GSTAmount, setGSTAmount] = useState(0)

  useEffect(() => {

    calculateAmount()
    // const backAction = () => {
    //   navigation.goBack();
    //   return true;
    // };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );
    return () => {
     
    };
  }, []);


  const calculateAmount=()=>{
    invoice_document = data?.invoice_document ? data.invoice_document : '';
    let total_cost = data?.total_cost;
    let sub_total = data?.total_cost;//100
    grand_total = data?.grand_total;//100
    let gst = data?.vat;//18%
    let total = gst > 0 ? ((sub_total * gst) / 100) : 0;

    GST_amount = Math.round(total)
    setGSTAmount(total.toFixed(3))
    // grand_total = GST_amount + total_cost
    setGrandTotal(grand_total)
  }


  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  const checkPermissionForInvoice = async (invoice_document) => {
    if (Platform.OS === 'ios') {
      DownloadInvoice(invoice_document);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DownloadInvoice(invoice_document);
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const DownloadInvoice = (invoice_document) => {
    if (invoice_document !== '') {
      global.global_loader_reff.show_loader(1);
      let pdf_URL = '';

      pdf_URL = invoice_document;
      var min = 1;
      var max = 100;
      var rand = min + Math.random() * (max - min);
      let ext = getExtention(pdf_URL);
      if (Platform.OS === 'ios') {
        ext = ext;
      } else {
        ext = '.' + ext;
      }

      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/Invoice_' + rand + ext,
          description: 'Pdf',
        },
      };
      config(options)
        .fetch('GET', pdf_URL)
        .then(res => {
          global.global_loader_reff.show_loader(0);
          Global.showToast('Invoice Downloaded Successfully!');
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);

          Global.showError(err);
        });
    } else {
      Global.showError('Invoice not available')
    }
  };
  return (
    <ImageBackground
      source={Global.GlobalAssets.bgImg}
      style={styles.bgImg}
      resizeMode={'cover'}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Global.GlobalColor.themePink}
        hidden={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: scale(70) }}>
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="INVOICE DETAILS" />
            </View>

            <View key={id_invoice}
              style={{
                padding: scale(15),
              }}>

              <View  style={styles.invoiceCard}>
                <Global.GlobalText text={data.invoice_number_format} style={styles.text} />
              </View>
              <View style={{ backgroundColor: 'white' }}>
                <Global.GlobalText
                  text={"Customer Name : " + data.client_name}
                  style={[styles.message, styles.lightBlueColor]}
                />
                <Global.GlobalText
                  text={"Address : " + data.client_address + ' -- ' + data.client_area}
                  style={[styles.message, styles.lightBlueColor]}
                />
                <Global.GlobalText
                  text={"EMAIL : " + data.client_email}
                  style={[styles.message, styles.lightBlueColor]}
                />
                <Global.GlobalText
                  text={"Date : " + data.invoice_created_at}
                  style={[styles.message, styles.lightBlueColor]}
                />
                <Global.GlobalText
                  text={"Due Date : " + data.due_date}
                  style={[styles.message, styles.lightBlueColor]}
                />
                <View style={[styles.cardHeader, styles.headerView]}>
                  <Global.GlobalText
                    text="DESCRIPTION"
                    style={styles.descriptionText}
                  />
                </View>
                <View style={styles.serviceTotalView}>
                  <Global.GlobalText
                    text={data.invoice_line_1}
                    style={[styles.message, styles.messageText]}
                  />
                  <View style={[styles.borderView, { paddingBottom: scale(5) }]}>
                    <Text style={styles.textGray}>{data.nanny_name}({data.total_hours} X {data.total_child})</Text>
                    <Text style={styles.totalText}>{global.currency}{data.rate_per_hour}</Text>
                  </View>
                </View>
                <View style={styles.subTotal}>
                  <Text style={styles.textGray}>Subtotal</Text>
                  <Text style={styles.totalText}>{global.currency}{data.total_cost}</Text>
                </View>
                <View style={styles.chargeView}>
                  <Text style={styles.textGray}>{data.vat}% VAT</Text>
                  <Text style={styles.totalText}>{global.currency}{GSTAmount}</Text>
                </View>
                {/* <View style={styles.chargeView}>
                  <Text style={styles.textGray}>10% Adm. Charges</Text>
                  <Text style={styles.totalText}>€10</Text>
                </View> */}
                <View style={styles.grandTotal}>
                  <Text style={styles.textGray}>GRAND TOTAL</Text>
                  <Text style={styles.totalText}>{global.currency}{grandTotal}</Text>
                </View>
                {/* <View style={styles.vatNumber}>
                  <Global.GlobalText
                    text="Vat number : MT25604509"
                    style={styles.globalText}
                  />

                  <Global.GlobalText
                    text="Payment may be efferted either by Cheque or Bank "
                    style={styles.globalText}
                  />

                  <Global.GlobalText
                    text="Transfer as follows:"
                    style={styles.globalText}
                  />
                  <Global.GlobalText
                    text="Bank: HSBC plc ( The Strand Gzira)"
                    style={styles.globalText}
                  />
                  <Global.GlobalText
                    text="Benificiary: Julia PUSSIAU A/C My Poppins "
                    style={styles.globalText}
                  />
                  <Global.GlobalText
                    text="IBAN No. MT82MMEB44392000000039177894001 "
                    style={styles.accNumber}
                  />
                  <Global.GlobalText
                    text="Swift Code: MMEBMTMT "
                    style={styles.code}
                  />
                </View> */}
                <TouchableOpacity style={styles.closeBtn} onPress={() => {
                  checkPermissionForInvoice(data.invoice_document)
                }}>
                  <Image
                    source={Global.GlobalAssets.download}
                    style={{ height: scale(25), width: scale(25) }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  totalText: {
    position: 'absolute',
    right: 0,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
    color: Global.GlobalColor.grayColor,
  },
  accNumber: {
    color: Global.GlobalColor.grayColor,
    textTransform: 'uppercase',
    fontSize: scale(15),
  },
  serviceTotalView: { marginVertical: scale(7), paddingHorizontal: scale(5) },
  globalText: {
    color: Global.GlobalColor.grayColor,
    textTransform: 'capitalize',
    fontSize: scale(15),
  },
  messageText: { color: Global.GlobalColor.grayColor, fontSize: scale(20) },
  descriptionText: { color: 'white', textAlign: 'left', marginTop: scale(-5.5) },
  grandTotal: {
    flexDirection: 'row',
    marginHorizontal: scale(24),
    borderTopWidth: 3,
    borderTopColor: '#dddddd',
    borderBottomWidth: 3,
    borderBottomColor: '#dddddd',
    marginVertical: scale(8),
  },
  textGray: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(16),
    color: Global.GlobalColor.grayColor,
  },
  code: {
    color: Global.GlobalColor.grayColor,
    textTransform: 'capitalize',
    fontSize: scale(15),
  },
  invoiceCard: {
    backgroundColor: Global.GlobalColor.darkBlue,
    paddingVertical: scale(5),
  },
  closeBtn: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: scale(15),
    marginBottom: scale(10),
  },
  headerView: {
    backgroundColor: Global.GlobalColor.lightBlackColor,
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    height: scale(40),
    alignItems: 'flex-start',
    marginHorizontal: scale(20),
    marginTop: scale(14),
  },
  borderView: {
    flexDirection: 'row',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 3,
    marginHorizontal: scale(20),
    marginTop: scale(-8),
    marginVertical: scale(5),
  },
  text: { color: 'white', marginLeft: scale(15), textTransform: 'capitalize' },
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  vatNumber: {
    marginHorizontal: scale(27),
    marginVertical: scale(15),
  },
  subTotal: {
    flexDirection: 'row',
    marginHorizontal: scale(24),
    marginTop: scale(-8),
  },
  chargeView: {
    flexDirection: 'row',
    marginHorizontal: scale(24),
    marginTop: scale(2),
  },
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
    color: Global.GlobalColor.lightBlackColor,
    marginBottom:10
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
  },
  innerCard: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  lightBlueColor: { marginBottom: -8, color: Global.GlobalColor.grayColor },
  cardHeader: {
    height: scale(60),
    backgroundColor: Global.GlobalColor.lightBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Invoicedetails;
