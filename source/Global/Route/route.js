/* eslint-disable prettier/prettier */
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import Signin from '../../Screen/Signin';
import Signup from '../../Screen/Signup';
import ForgotPassword from '../../Screen/ForgotPassword';
import {createStackNavigator} from '@react-navigation/stack';
import Relogin from '../../Screen/Relogin';
import ClientTab from '../Route/ClientTab';
import Splash from '../../Screen/Splash';
import NannyTab from '../Route/NannyTab';
import ClientProfile from '../../Screen/Client/tabscreens/Profile';
import NannyProfile from '../../Screen/Nanny/tabscreens/Profile';
import Dashboard from '../../Screen/Client/tabscreens/Dashboard';
import CompleteProfile from '../../Screen/Nanny/CompleteProfile';
import Avability from '../../Screen/Nanny/Avability';
import ProfileConfirmation from '../../Screen/Nanny/ProfileConfirmation';
import BookingList from '../../Screen/Nanny/bookings/BookingList';
import NewBooking from '../../Screen/Client/booking/NewBooking';
import Checkin from '../../Screen/Nanny/checkinout/Checkin';
import CompleteBooking from '../../Screen/Nanny/bookings/CompleteBooking';
import NewBookings from '../../Screen/Nanny/bookings/NewBooking';
import Reviews from '../../Screen/Nanny/review/review';
import ReviewClient from '../../Screen/Client/review/review';
import Addchild from '../../Screen/Client/child/Addchild';
import Editchild from '../../Screen/Client/child/Editchild';
import AddAddress from '../../Screen/Client/address/Addbillingaddress';
import EditAddress from '../../Screen/Client/address/Editbillingaddress';
import Removewishlist from '../../Screen/Client/wishlist/Removewishlist';
import Chatdetail from '../../Screen/Chatdetail';
import NotificationChatdetail from '../../Screen/Chatdetail';
import RegularBookingSuccess from '../../Screen/Client/booking/RegularBookingSuccess';
import Jobs from '../../Screen/Client/jobs/Jobs';
import Jobdetail from '../../Screen/Client/jobs/Jobdetail';
import LogDetailNanny from '../../Screen/Nanny/logs/Logdetail';
import LogdetailClient from '../../Screen/Client/logs/Logdetail';
import LogClient from '../../Screen/Client/logs/Logs';
import Invoicedetail from '../../Screen/Client/invoice/Invoicedetails';
import Findnanny from '../../Screen/Client/findnanny/Findnanny';
import Nannylist from '../../Screen/Client/findnanny/Nannylisting';
import PdfView from '../../Screen/PdfView';
import BookingSuccess from '../../Screen/Client/booking/BookingSuccess';
import NotificationClient from '../../Screen/Client/notification/NotificationsClient';
import NotificationDetailClient from '../../Screen/Client/notification/NotificationDetailClient';
import NotificationNanny from '../../Screen/Nanny/notification/NotificationsNanny';
import NotificationDetailNanny from '../../Screen/Nanny/notification/NotificationDetailNanny';
import CheckOut from '../../Screen/Nanny/checkinout/CheckOut';
import Invoice from '../../Screen/Client/invoice/invoice';
import CreateInvoice from '../../Screen/Nanny/invoice/CreateInvoice';
import RequestOtpCode from '../../Screen/RequestOtpCode';
import PaymentScreen from '../../Screen/Payment/PaymentScreen';
import PaymentSuccess from '../../Screen/Payment/PaymentSuccess';
import clientLocation from '../../Screen/Client/location/clientLocation';
import ClientLocationOnMap from '../../Screen/Nanny/bookings/ClientLocationOnMap';
import signupLocation from '../../Screen/Client/location/signupLocation';

const Stack = createStackNavigator();

export const RootNavigators = baseRoute => {
  return (
    <Stack.Navigator initialRouteName={baseRoute}>
      <Stack.Screen
        name="Login"
        component={Signin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClientProfile"
        component={ClientProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NannyProfile"
        component={NannyProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ClientTabb"
        component={ClientTab}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="NannyTabb"
        component={NannyTab}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PdfView"
        component={PdfView}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="completedProfile"
        component={CompleteProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="NannyTab"
        component={NannyTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Relogin"
        component={Relogin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClientTab"
        component={ClientTab}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Avability"
        component={Avability}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileConfirmation"
        component={ProfileConfirmation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookingList"
        component={BookingList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewBooking"
        component={NewBooking}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompleteBooking"
        component={CompleteBooking}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewBookings"
        component={NewBookings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationChatdetail"
        component={NotificationChatdetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReviewClient"
        component={ReviewClient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Checkin"
        component={Checkin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Addchild"
        component={Addchild}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Editchild"
        component={Editchild}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditAddress"
        component={EditAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Removewishlist"
        component={Removewishlist}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chatdetail"
        component={Chatdetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegularBookingSuccess"
        component={RegularBookingSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Jobs"
        component={Jobs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Jobdetail"
        component={Jobdetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogDetailNanny"
        component={LogDetailNanny}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogClient"
        component={LogClient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LogdetailClient"
        component={LogdetailClient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Invoicedetail"
        component={Invoicedetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateInvoice"
        component={CreateInvoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Findnanny"
        component={Findnanny}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Nannylist"
        component={Nannylist}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="BookingSuccess"
        component={BookingSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationClient"
        component={NotificationClient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationDetailClient"
        component={NotificationDetailClient}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationNanny"
        component={NotificationNanny}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationDetailNanny"
        component={NotificationDetailNanny}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Invoice"
        component={Invoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RequestOtpCode"
        component={RequestOtpCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClientLocation"
        component={clientLocation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClientLocationOnMap"
        component={ClientLocationOnMap}
        options={{headerShown: false}}
      />
          <Stack.Screen
        name="SignupLocation"
        component={signupLocation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
