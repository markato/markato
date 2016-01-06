// Generated by CoffeeScript 1.10.0
(function() {
  var byline, determineKey, printToken, title;

  window.draw = function(location, song, state) {
    var canvas, cstring, drawKey, i, j, k, key, len, len1, len2, line, ref, ref1, section, token;
    canvas = $(location);
    key = determineKey(song);
    state.originalKey = key;
    drawKey = state.requestedKey != null ? state.requestedKey : state.originalKey;
    $('#currentKey').html(drawKey);
    $('#originalKey').html(state.originalKey);
    $("#transposeToolbar button").removeClass('btn-info');
    $("[data-transposeChord=" + drawKey + "]").addClass('btn-info');
    cstring = '';
    cstring += "<h2>" + (title(song)) + "</h2>";
    cstring += "<h4>" + (byline(song)) + "</h4>";
    ref = song.lyrics;
    for (i = 0, len = ref.length; i < len; i++) {
      section = ref[i];
      if (state.showSections) {
        cstring += "<div class='section-header'>" + section.section + "</div>";
        cstring += "<hr/>";
      }
      cstring += "<div class='section'>";
      ref1 = section.lines;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        line = ref1[j];
        for (k = 0, len2 = line.length; k < len2; k++) {
          token = line[k];
          cstring += printToken(token, state);
        }
        cstring += "<br/>";
      }
      cstring += "</div><br/>";
    }
    canvas.html(cstring);
    return null;
  };

  printToken = function(token, state) {
    var chord, chord_classes, hasAlts, phrase_classes, result, string;
    hasAlts = token.chord.endsWith('\'') ? true : false;
    chord = token.chord == null ? ' ' : token.chord;
    chord = chord.replace(/'/g, '');
    string = token.string === '' ? ' ' : token.string.trim();
    phrase_classes = ['phrase'];
    if (token.wordExtension) {
      phrase_classes.push('join');
    }
    chord_classes = ['chord'];
    if (state.smartMode && !token.exception) {
      chord_classes.push('mute');
    }
    if ((state.requestedKey != null) && chord !== '') {
      chord = transpose(state.originalKey, state.requestedKey, chord);
    }
    chord = chord.replace('#', '&#x266F;').replace('b', '&#x266D;');
    result = '';
    result += "<p class=\"" + (phrase_classes.join(' ')) + "\">";
    if (state.showChords) {
      result += "<span class=\"" + (chord_classes.join(' ')) + "\">" + chord + "</span><br/>";
    }
    result += "<span class='string'>" + string + "</span>";
    result += "</p>";
    return result;
  };

  determineKey = function(song) {
    var key, lastChord, lastLine, lastLines, lastPhrase, lastSection, lastSectionTitle;
    if (song.meta.KEY != null) {
      key = song.meta.KEY;
    } else {
      lastLines = song.lyrics[song.lyrics.length - 1].lines;
      lastLine = lastLines[lastLines.length - 1];
      lastPhrase = lastLine[lastLine.length - 1];
      key = lastPhrase.chord;
      if (key === '') {
        lastSectionTitle = song.sections[song.sections.length - 1];
        lastSection = song.chords[lastSectionTitle];
        lastLine = lastSection[lastSection.length - 1];
        lastChord = lastLine[lastLine.length - 1];
        key = lastChord;
      }
    }
    if (key === '') {
      key = 'C';
    }
    return key;
  };

  title = function(song) {
    if (song.meta.TITLE != null) {
      return song.meta.TITLE;
    } else {
      return '?';
    }
  };

  byline = function(song) {
    if ((song.meta.ARTIST != null) && (song.meta.ALBUM != null)) {
      return song.meta.ARTIST + " — " + song.meta.ALBUM;
    } else if (song.meta.ARTIST != null) {
      return song.meta.ARTIST + " — ?";
    } else if (song.meta.ALBUM != null) {
      return "? — " + song.meta.ALBUM;
    } else {
      return "? — ?";
    }
  };

}).call(this);
