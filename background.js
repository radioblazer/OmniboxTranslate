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
  },

  onInputChanged: function(text, suggest)
  {
    console.log('inputChanged: ' + text);
  },

  copyToClipboard: function(str)
  {
    if (!str) {
      return onError();
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
      return onError();
    }
    
    var key = ' ';
    var query = 'https://www.googleapis.com/language/translate/v2?key=' + key +
      '&source=' + from +
      '&target=' + to +
      'callback=translateText&q=' + phrase;
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