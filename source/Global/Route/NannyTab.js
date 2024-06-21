import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { scale } from '../../Theme/Scalling';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Dashboard from '../../Screen/Nanny/tabscreens/Dashboard';
import Profile from '../../Screen/Nanny/tabscreens/Profile';
import Chat from '../../Screen/Chat';
import Search from '../../Screen/Nanny/tabscreens/Search';
import GlobalAsset from '../../Theme/Assets';
import GlobalColor from '../../Theme/Colors';
import { Badge } from 'react-native-elements';
import { connect, useStore, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import helpers from '../Helper/helper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/Entypo';

const Tab = createBottomTabNavigator();
let intervalId = null;
let counter = 0;
const TabNavigatorNanny = () => {
  const [counters, setConters] = useState(0)
  counter = global.chat_count;

  const navigation = useNavigation()
  const dispatch = useDispatch()
  // alert(counter)
  useEffect(() => {
    intervalId = setInterval(() => {
      notificationcountApi()

    }, 3000);
    notificationcountApi()
    counter = global.chat_count;
    //alert("from tabbbb  " + counter)
    const unsubscribe = navigation.addListener('focus', () => {
      notificationcountApi()

    });
    return () => unsubscribe()
  }, [])
  const notificationcountApi = () => {
    helpers
      .UrlReqAuth('api/user/count_notification')
      .then(res => {
        if (res.status) {
          global.chat_count = parseInt(res.data.unread_chat_message)
          counter = global.chat_count
          setConters(global.chat_count)
          dispatch({ type: "APPS.CHATINCREMENT" })
        }
        else {
          global.chat_count = 0;
          counter = 0
          setConters(0)
          dispatch({ type: "APPS.CHATINCREMENT" })
        }
      })
  }
  return (
    <Tab.Navigator
      tabBarPosition={'bottom'}
      tabBarOptions={{
        style: {
          backgroundColor: '#fff', height: scale(65), paddingVerticle: scale(15),

        },
        showIcon: true,
        showLabel: false,
        tabStyle: {
          height: scale(65),
        },
        indicatorStyle: {
          height: 0,
        },
      }}

      initialRouteName="Dashboard"
      swipeEnabled={false}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
            name={"home"}
            size={30}
            color={focused ? GlobalColor.themePink : GlobalColor.themeBlue}
          />
          ),
          tabBarColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
            name={'search'}
            size={30}
            color={focused ? GlobalColor.themePink : GlobalColor.themeBlue}
          />
          ),
          tabBarColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <>
              {focused ? (
                <View>
                   <Icons
            name={'chat'}
            size={30}
            color={GlobalColor.themePink}
          />
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: -15,
                      height: scale(50),
                    }}>
                    <Badge
                      textStyle={{ color: 'white' }}
                      value={counters}
                      badgeStyle={{ backgroundColor: GlobalColor.themePink, width: scale(20), height: scale(20), borderRadius: scale(20) }}
                      style={{ width: 25, height: 25 }}
                    />
                  </View>
                </View>
              ) : (
                <View >
                  <Icons
            name={'chat'}
            size={30}
            color={GlobalColor.themeBlue}
          />
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: -8,
                      height: scale(50),
                    }}>
                    <Badge
                      textStyle={{ color: 'white' }}
                      value={counters}
                      badgeStyle={{ backgroundColor: GlobalColor.themePink, width: scale(20), height: scale(20), borderRadius: scale(20) }}
                      style={{ width: 25, height: 25 }}
                    />
                  </View>
                </View>
              )}
            </>
          ),
          tabBarColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
            name={'user'}
            size={30}
            color={focused ? GlobalColor.themePink : GlobalColor.themeBlue}
          />
          ),
          tabBarColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
};
const mapStateToProps = state => ({
  chatCount: {
    apps: state.apps.chatCount,
  },
});
const mapDispatchToProps = (dispatch) => {



  dispatch({ type: "APPS.CHATINCREMENT" });

};
export default connect(mapStateToProps, mapDispatchToProps)(TabNavigatorNanny);
