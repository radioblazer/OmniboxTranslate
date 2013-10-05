function InstantTranslate() {

}

InstantTranslate.prototype = {

  copy: function(str, mimetype) {
    document.oncopy = function(event) {
      event.clipboardData.setData(mimetype, str);
      event.preventDefault();
    };
    document.execCommand("Copy", false, null);
  }

}

