<?php
/*onesingal config*/

add_filter('onesignal_send_notification', 'onesignal_send_notification_filter', 10, 4);

function onesignal_send_notification_filter($fields, $new_status, $old_status, $post)
{
  // Change the notification's title, message, and URL
  if($post->post_type == "product"){
	  $fields['headings'] = array("en" => "New Product on WooIonic");
  	$fields['contents'] = array("en" => $post->post_title . " is launched. Check it out.");
  }
  
  //$fields['headings'] = array("en" => "English notification message title");
  //$fields['contents'] = array("en" => "English notification message body");
  //$fields['url'] = null;
  unset($fields['url']);  

  //$fields['data'] = array("id" => $post->ID);

  // Send to additional platforms (e.g. Android and iOS)
  $fields['isAndroid'] = true;
  //$fields['isIos'] = true;
  
  // Prevent the notification from being sent to certain platforms
  //$fields['isFirefox'] = false;
  
  // Schedule the notification to be sent in the future
  //$fields['send_after'] = "Sept 24 2018 14:00:00 GMT-0700";
  
  // Schedule the notification to be delivered at the specific hour of the destination timezone
  //$fields['delayed_option'] = 'timezone';
  //$fields['delivery_time_of_day'] = '9:00AM';
  
  // Add web push action buttons (different action buttons are used for Android and iOS)
  //$fields['web_buttons'] = array(
  //  "id" => "like-button",
  //  "text" => "Like",
  //  "icon" => "http://i.imgur.com/N8SN8ZS.png",
  //  "url" => "https://example.com"
  //);
  
  // Cancel the notification from being sent
  //  $fields['do_send_notification'] = false;
  
  return $fields;
}

?>