/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});

// Event handler registration removed to prevent debug dialog
// If you need command handlers, uncomment and implement:
/*
function action(event: Office.AddinCommands.Event) {
  const message: Office.NotificationMessageDetails = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };
  Office.context.mailbox.item?.notificationMessages.replaceAsync("ActionPerformanceNotification", message);
  event.completed();
}

Office.actions.associate("action", action);
*/
