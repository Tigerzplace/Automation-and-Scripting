async function getCt0FromCookie(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        var match = document.cookie.match(/(^|;\s*)ct0=([^;]+)/);
        return match ? match[2] : null;
      }
    }, (results) => {
      if (results && results[0] && results[0].result) {
        resolve(results[0].result);
      } else {
        reject('ct0 token not found');
      }
    });
  });
}

async function getTweets(keyword, ct0){
  var xhr = new XMLHttpRequest();
  var baseUrl = "https://x.com/i/api/graphql/Ow4YOCqr4TR1W5vDqb0HAw/SearchTimeline";

  var variables = {
      rawQuery: keyword,
      count: 20,
      querySource: "typed_query",
      product: "Top"
  };

  var features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false
  };

  var params = {
      variables: JSON.stringify(variables),
      features: JSON.stringify(features)
  };

  var queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
  var fullUrl = `${baseUrl}?${queryString}`;

  xhr.open("GET", fullUrl, true);
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("accept-language", "en-US,en;q=0.6");
  xhr.setRequestHeader("authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("priority", "u=1, i");
  xhr.setRequestHeader("x-client-transaction-id", "hpY2JpzYMZjlBZl4ctcDkBxH+vARXSZCK58101Ak9dtXQYvaCPFxDX4hCjVWuk62G/H9fIfaPAnsEX0yIZhnBOV8Q0rlhQ");
  xhr.setRequestHeader("x-client-uuid", "ea6cd89c-67cc-430b-bbe0-3b6f4c2358da");
  xhr.setRequestHeader("x-csrf-token", ct0);
  xhr.setRequestHeader("x-twitter-active-user", "yes");
  xhr.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
  xhr.setRequestHeader("x-twitter-client-language", "en");

  return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject('Request failed. Returned status of ' + xhr.status);
          }
        }
      };
      xhr.send(null);
    });

}

async function replyToTweet(tweetId, replyText, ct0) {
  var xhr = new XMLHttpRequest();
  var url = "https://x.com/i/api/graphql/BTWYQFqX-WbKZOhykzDpRg/CreateTweet";
  
  var body = JSON.stringify({
    variables: {
      tweet_text: replyText,
      reply: {
        in_reply_to_tweet_id: tweetId,
        exclude_reply_user_ids: []
      },
      dark_request: false,
      media: {
        media_entities: [],
        possibly_sensitive: false
      },
      semantic_annotation_ids: []
    },
    features: {
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      articles_preview_enabled: true,
      rweb_video_timestamps_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_enhance_cards_enabled: false
    },
    queryId: "BTWYQFqX-WbKZOhykzDpRg"
  });
  
  xhr.open("POST", url, true);
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("accept-language", "en-US,en;q=0.6");
  xhr.setRequestHeader(
    "authorization",
    "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
  );
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-twitter-active-user", "yes");
  xhr.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
  xhr.setRequestHeader("x-twitter-client-language", "en");
  xhr.setRequestHeader("x-csrf-token", ct0);
  xhr.setRequestHeader(
    "x-client-transaction-id",
    "RFT05F4a81onx1u6sBXBUt6FODLTn+SA6V33EZLmNxmVg0kYyjOzz7zjyPeUeIx02Zs/vkUVcyX1DYpkTxkoeP9BM2q+Rw"
  );
  xhr.setRequestHeader("x-client-uuid", "ea6cd89c-67cc-430b-bbe0-3b6f4c2358da");

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.send(body);
  });
}

async function automateReplies() {
  chrome.storage.sync.get(['keyword', 'frequency', 'time', 'replies', 'replyText'], async ({ keyword, frequency, time, replies, replyText }) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true, url: "*://*.x.com/*" });
      if (!tab) {
        console.error("No active X.com tab found.");
        return;
      }
      
      const ct0 = await getCt0FromCookie(tab.id);
      if (!ct0) {
        alert("You must be logged in to X.com to use this extension.");
        return;
      }

      const sinceTime = Math.floor(Date.now() / 1000) - (time * 3600);
      const tweetsData = await getTweets(keyword, ct0);
      const tweets = tweetsData?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions[0]?.entries || [];

      const filteredTweets = tweets.filter(entry => {
        const tweet = entry?.content?.itemContent?.tweet_results?.result?.legacy;
        return tweet && new Date(tweet.created_at).getTime() / 1000 >= sinceTime;
      });

      for (let i = 0; i < Math.min(replies, filteredTweets.length); i++) {
        const tweet = filteredTweets[i].content.itemContent.tweet_results.result.legacy;
        await replyToTweet(tweet.id_str, replyText, ct0);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Delay to mimic human behavior
      }
    } catch (error) {
      console.error('Error in automateReplies:', error);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('tweetReplyAlarm', { periodInMinutes: 60 }); // Check every hour
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'tweetReplyAlarm') {
    automateReplies();
  }
});
