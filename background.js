function InstantTranslate() {
}

InstantTranslate.prototype = {

  onInputEntered: function(text) {
    console.log('inputEntered: ' + text);
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
  }

}

var translator = new InstantTranslate();

chrome.omnibox.onInputChanged.addListener(translator.onInputChanged);
chrome.omnibox.onInputEntered.addListener(translator.onInputEntered);