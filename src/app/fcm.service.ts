import { Injectable } from '@angular/core';
import { Push, PushObject } from '@ionic-native/push/ngx';
import { Platform } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  api: PushObject;

  constructor(
    // public firebaseMessaging: FirebaseMessaging,
    // public afs: AngularFirestore,
    // private db: AngularFireDatabase,
    private platform: Platform,
    private user: UserService,
    private push: Push
  ) {
  }

  initialize() {
    this.api = this.push.init({
      "android": {
        "senderID": "***REMOVED***"
      },
      "ios": {
        "sound": true,
        "badge": true,
        "alert": true
      },
    });

    this.api.on("registration").subscribe(data => {
      this.saveTokenToFirebase(data.registrationId);
    });

    this.api.on("error").subscribe(error => {
      console.error("notification error", error.message);
    });
  }

  // Save the token to firebase
  async saveTokenToFirebase(token) {
    this.user.setAttrs(
      {type: "mobile", platform: this.platform.is("android") ? "android" : "ios"}, 
      `/fcmTokens/${token}`
    );
  }

  // Listen to incoming FCM messages
  onNotification() {
    return this.api.on("notification");
  }
}
