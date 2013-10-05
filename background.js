function InstantTranslate(){

}

InstantTranslate.prototype = {

  onInputEntered: function(text) {
    var params = text.split(' ');

    if (!params || params.length < 3) {
      return this.onError();
    }

    var from = params[0],
      to = params[1];

    // if we can avoid having to split the query let's do that instead
    var query = params.splice(2).join(' ');
  },

  onInputChanged: function(text, suggest) {
    console.log('inputChanged: ' + text);
  },

  copyToClipboard: function(str, mimetype) {
    document.oncopy = function(event) {
      event.clipboardData.setData(mimetype, str);
      event.preventDefault();
    };
    document.execCommand("Copy", false, null);
  },

  translate: function(from, to, phrase){
  	var key = ' ';
  	var query = 'https://www.googleapis.com/language/translate/v2?key=' + key +
  				'&source=' + from +
  				'&target=' + to +
  				'callback=translateText&q=' + phrase;

  },
  translateText: function(response){
  	var translated = response.data.translations[0].translatedText;
  	console.log(translated);
  }

}

function showNotification() {
  chrome.notifications.clear('successPopup', function() {
    chrome.notifications.create('successPopup', {
      type: 'basic',
      title: 'InstantTranslate',
      message: 'Translation copied to clipboard',
      iconUrl: 'logo48.png'
    }, function(id) {});
  });
}

var translator = new InstantTranslate();

chrome.omnibox.onInputChanged.addListener(translator.onInputChanged.bind(translator));
chrome.omnibox.onInputEntered.addListener(translator.onInputEntered.bind(translator));