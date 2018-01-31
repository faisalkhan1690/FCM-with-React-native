/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
 import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';


import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//var PushNotification = require('react-native-push-notification');

// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if(notif.local_notification){
      //this is a local notification
    }
    if(notif.opened_from_tray){
      //iOS: app is open/resumed because user clicked banner
      //Android: app is open/resumed because user clicked banner or tapped app icon
    }
    // await someAsyncCall();

    if(Platform.OS ==='ios'){
      //optional
      //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
      //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
      //notif._notificationType is available for iOS platfrom
      alert("check")
      switch(notif._notificationType){
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
          break;
      }
    }
});

FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log(token)
    // fcm token may not be available on first load, catch it here
});

export default class App extends Component {

  componentDidMount() {
    
    FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
        
    FCM.getFCMToken().then(token => {
      console.warn("getFCMToken=>"+token)
    });
        
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      console.warn("notificationListener=>"+JSON.stringify(notif))
      alert("check")
      if(Platform.OS ==='ios'){
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch(notif._notificationType){
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            break;
        }
      }
      // PushNotification.localNotification({
      //   largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      //   smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      //   bigText: "", // (optional) default: "message" prop
      //   subText: "", // (optional) default: none
      //   vibrate: true, // (optional) default: true
      //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   title: "Pin Point Sample", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
      //   message: notif.fcm.body // (required)   
      // });
      
    });
        
    FCM.getInitialNotification().then(notif => {
      console.warn("getInitialNotification=>"+JSON.stringify(notif))
    });

  
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
