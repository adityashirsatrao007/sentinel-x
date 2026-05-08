package ai.sentinelx.nativemodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Settings
import androidx.core.app.NotificationManagerCompat

class SentinelNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SentinelNative")

    Events("onSMSReceived", "onNotificationReceived", "onCallStateChanged")

    Function("isNotificationListenerEnabled") {
      val context = appContext.reactContext ?: return@Function false
      val packageName = context.packageName
      val flat = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners")
      return@Function flat?.contains(packageName) == true
    }

    Function("requestNotificationListenerPermission") {
      val context = appContext.reactContext ?: return@Function
      val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }

    AsyncFunction("startMonitoring") {
      NotificationService.listener = { app, title, body ->
        sendEvent("onNotificationReceived", mapOf(
          "appName" to app,
          "title" to title,
          "content" to body
        ))
      }
    }
  }
}
