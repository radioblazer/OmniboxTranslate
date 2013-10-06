function InstantTranslate(){
  this.api_key = 'AIzaSyC4AY79SAW4qjeHjnaivowLRM4PS1OpM9w';
  this.api_url = 'https://www.googleapis.com/language/translate/v2';
  this.createContextMenu();
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

    $.ajax({
      url: that.api_url,
      type: "GET",
      dataType: "json",
      data: {
        key: that.api_key,
        source: from,
        target: to,
        q: phrase
      },
      success: function(response) {
        var translation = response.data.translations[0].translatedText;
        that.onSuccess(translation);
      },
      error: function(err) {
        that.onError(err);
      }
  });
},

showNotification: function(msgObj) {
  var message;

  if (msgObj.translation) {
    message = 'Translation copied to clipboard: ' + msgObj.translation;
  } else {
    message = msgObj.error;
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

createContextMenu: function()
{
  var that = this;
  chrome.contextMenus.create({
    title: "Translate to English",
    contexts:["selection"],
    onclick: function(info, tab){
      var to = "en";
      var query = info.selectionText;
      that.translateDetectedLanguage(to, query);
    }
  });
},

translateDetectedLanguage: function(to, phrase) {
    if (!to || !phrase) {
      return this.onError("missing arguments");
    }

    var that = this;

    $.ajax({
      url: that.api_url,
      type: "GET",
      dataType: "json",
      data: {
        key: that.api_key,
        target: to,
        q: phrase
      },
      success: function(response) {
        var translation = response.data.translations[0].translatedText;
        that.onSuccess(translation);
      },
      error: function(err) {
        that.onError(err);
      }
    });
},



onError: function(errorMsg) {
  this.showNotification({
    error: errorMsg
  })
},

onSuccess: function(text) {
  this.copyToClipboard(text);
  this.showNotification({
    translation: text
  });
}
}


var translator = new InstantTranslate();

chrome.omnibox.onInputChanged.addListener(translator.onInputChanged.bind(translator));
chrome.omnibox.onInputEntered.addListener(translator.onInputEntered.bind(translator));
