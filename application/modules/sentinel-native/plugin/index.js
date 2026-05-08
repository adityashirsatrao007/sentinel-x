const { withAndroidManifest } = require("@expo/config-plugins");

const withSentinelNative = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    const mainApplication = androidManifest.application[0];

    // Ensure services array exists
    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    // Add NotificationListenerService
    mainApplication.service.push({
      $: {
        "android:name": "ai.sentinelx.nativemodule.NotificationService",
        "android:permission": "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "android.service.notification.NotificationListenerService",
              },
            },
          ],
        },
      ],
    });

    // Ensure receivers array exists
    if (!mainApplication.receiver) {
      mainApplication.receiver = [];
    }

    // Add SMSReceiver
    mainApplication.receiver.push({
      $: {
        "android:name": "ai.sentinelx.nativemodule.SMSReceiver",
        "android:exported": "true",
        "android:permission": "android.permission.BROADCAST_SMS",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "android.provider.Telephony.SMS_RECEIVED",
              },
            },
          ],
        },
      ],
    });

    return config;
  });
};

module.exports = withSentinelNative;
