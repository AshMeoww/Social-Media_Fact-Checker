function getVisiblePosts() {
    let tweets = document.querySelectorAll("[data-testid='tweetText']");
    let posts = [];
    tweets.forEach(tw => posts.push(tw.innerText.trim()));
  
    let articles = document.querySelectorAll("div[role='article']");
    articles.forEach(ar => posts.push(ar.innerText.trim()));
  
    return posts;
  }
  
  let postTexts = getVisiblePosts();
  chrome.runtime.sendMessage({ action: "scanPosts", posts: postTexts });
  