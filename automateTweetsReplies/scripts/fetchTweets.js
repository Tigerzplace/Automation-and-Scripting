async function getTweets(keyword) {
  var xhr = new XMLHttpRequest();
  var baseUrl =
    "https://x.com/i/api/graphql/Ow4YOCqr4TR1W5vDqb0HAw/SearchTimeline";

  var variables = {
    rawQuery: keyword,
    count: 20,
    querySource: "typed_query",
    product: "Top",
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
    responsive_web_enhance_cards_enabled: false,
  };

  var params = {
    variables: JSON.stringify(variables),
    features: JSON.stringify(features),
  };

  var queryString = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  var fullUrl = `${baseUrl}?${queryString}`;

  xhr.open("GET", fullUrl, true);
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("accept-language", "en-US,en;q=0.6");
  xhr.setRequestHeader(
    "authorization",
    "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
  );
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("priority", "u=1, i");
  xhr.setRequestHeader(
    "x-client-transaction-id",
    "hpY2JpzYMZjlBZl4ctcDkBxH+vARXSZCK58101Ak9dtXQYvaCPFxDX4hCjVWuk62G/H9fIfaPAnsEX0yIZhnBOV8Q0rlhQ"
  );
  xhr.setRequestHeader("x-client-uuid", "ea6cd89c-67cc-430b-bbe0-3b6f4c2358da");
  xhr.setRequestHeader("x-csrf-token", ct0);
  xhr.setRequestHeader("x-twitter-active-user", "yes");
  xhr.setRequestHeader("x-twitter-auth-type", "OAuth2Session");
  xhr.setRequestHeader("x-twitter-client-language", "en");

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject("Request failed. Returned status of " + xhr.status);
        }
      }
    };
    xhr.send(null);
  });
}

async function getCt0FromCookie() {
  var match = document.cookie.match(/(^|;\s*)ct0=([^;]+)/);
  return match ? match[2] : null;
}

const ct0 = await getCt0FromCookie();

console.log(await getTweets("Viral"));
