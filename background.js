function InstantTranslate(){
}

InstantTranslate.prototype = {

  onInputEntered: function(text)
  {
    if (!text || text.length < 7) {
      return this.onError();
    }

    var params = text.split(' ');

    if (!params || params.length < 3) {
      return this.onError();
    }

    var from = params[0],
      to = params[1];

    // if we can avoid having to split the query let's do that instead
    var query = params.splice(2).join(' ');

    this.translateText(from, to, query);
  },

  onInputChanged: function(text, suggest)
  {
    console.log('inputChanged: ' + text);
  },

  copyToClipboard: function(str)
  {
    if (!str) {
      return this.onError();
    }

    document.oncopy = function(event) {
      event.clipboardData.setData("text/plain", str);
      event.preventDefault();
    };
    document.execCommand("Copy", false, null);
  },

  translateText: function(from, to, phrase)
  {
    if (!from || !to || !phrase) {
      return this.onError();
    }

    var apiKey = ' ';
    var apiUrl = 'https://www.googleapis.com/language/translate/v2?key=' + apiKey +
      '&source=' + from +
      '&target=' + to +
      'callback=translateText&q=' + phrase;

    $.ajax({
      url: apiUrl,
      dataType: 'jsonp',
      success: function(response){
        var translated = response.data.translations[0].translatedText;
        console.log(translated);
      },
      error: function(){
        console.log("something is fucked up");
      }
    });

    this.copyToClipboard("translated text");
  },

  showNotification: function() {
    chrome.notifications.clear('successPopup', function() {
      chrome.notifications.create('successPopup', {
        type: 'basic',
        title: 'InstantTranslate',
        message: 'Translation copied to clipboard',
        iconUrl: 'logo48.png'
      }, function(id) {});
    });
  },

  onError: function(errMessage) {

  }
}


var translator = new InstantTranslate();

chrome.omnibox.onInputChanged.addListener(translator.onInputChanged.bind(translator));
chrome.omnibox.onInputEntered.addListener(translator.onInputEntered.bind(translator));
