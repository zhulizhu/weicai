#!/usr/bin/env bash
#gulp app
#gulp tpl
ionic build android
#fir build_ipa platforms/ios
fir publish platforms/android/build/outputs/apk/android-debug.apk
#cp ./platforms/ios/fir_build/新宝彩票-0.0.1-build-0.0.1.ipa ~/App/release_app/xbcp/xinbao_nosign.ipa
#cp ./platforms/android/build/outputs/apk/android-armv7-debug.apk ~/App/release_app/xbcp/xinbao.apk
if adb devices | grep "\<device\>"; then
    adb install -r platforms/android/build/outputs/apk/android-debug.apk
fi
