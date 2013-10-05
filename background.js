function InstantTranslate(){
  this.api_key = 'AIzaSyAan9zXDOxt_kaxwUH2jla-_vMsFUNUEoE';
  this.api_url = 'https://www.googleapis.com/language/translate/v2;';
}

InstantTranslate.prototype = {

  onInputEntered: function(text)
  {
    if (!text || text.length < 7) {
      return this.onError("Invalid input");
    }

    var params = text.split(' ');

    if (!params || params.length < 3) {
      return this.onError("Invalid input");
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
      return this.onError("missing arguments");
    }

    var that = this;

    var request = $.ajax({
      url: "https://www.googleapis.com/language/translate/v2",
      data: {
        key: that.api_key,
        source: from,
        target: to,
        q: phrase
      }
    });

    request.done(function( msg ) {
      that.onSuccess();
    });

    request.fail(function( jqXHR, textStatus ) {
      that.onError(textStatus);
    });
  },

  showNotification: function(err) {
    var message = 'Translation copied to clipboard';

    if (err) {
      message = err;
    }

    chrome.notifications.clear('successPopup', function() {
      chrome.notifications.create('successPopup', {
        type: 'basic',
        title: 'InstantTranslate',
        message: message,
        iconUrl: 'logo48.png'
      }, function(id) {});
    });
  },

  onError: function(errorMsg) {
    this.showNotification(errorMsg)
  },

  onSuccess: function(text) {
    this.copyToClipboard(text);
    this.showNotification();
  }
}


var translator = new InstantTranslate();

chrome.omnibox.onInputChanged.addListener(translator.onInputChanged.bind(translator));
chrome.omnibox.onInputEntered.addListener(translator.onInputEntered.bind(translator));
