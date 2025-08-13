package com.nizcaller

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri

class AnswerCallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "ANSWER_CALL") {
            val openAppIntent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("nizcaller://call?status=answered")
                setPackage(context.packageName)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(openAppIntent)
        }
    }
}
