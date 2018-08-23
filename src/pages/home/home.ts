import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {
  sub?: Subscription;
  isSpeechSupported = false;
  color: string = 'red';
  matches: string[] = [];
  langs: string[] = [];

  constructor(public navCtrl: NavController,
              public speechRecognition: SpeechRecognition) {

  }

  async ngOnInit() {
    let isSupported = await this.speechRecognition.isRecognitionAvailable();
    console.log({isSupported});
    if (isSupported) {
      this.isSpeechSupported = true;
      if (!(await this.speechRecognition.hasPermission())) {
        await this.speechRecognition.requestPermission()
      }
      this.langs = await this.speechRecognition.getSupportedLanguages();
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    if (this.isSpeechSupported) {
      this.speechRecognition.stopListening()
    }
  }

  speak() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    this.sub = this.speechRecognition.startListening().subscribe(
      matches => this.onListenText(matches)
    )
  }

  onListenText(matches: string[]) {
    this.matches = matches;
    if (matches.length == 0) {
      return
    }
    this.color = matches[0].replace(/ /g, '');
    if (this.color.endsWith('color')) {
      this.color = this.color.replace(/color$/, '');
    }
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }
}
