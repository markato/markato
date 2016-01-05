// Generated by CoffeeScript 1.10.0
(function() {
  canvas;
  var alts, byline, determineKey, printToken, title;

  alts = {};

  window.draw = function(location, song, state) {
    var canvas, cstring, i, j, k, key, len, len1, len2, line, ref, ref1, section, token;
    canvas = $(location);
    alts = song.alts;
    key = determineKey(song);
    $('#key').html(key);
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
    var allowable, chord, chord_classes, diff, hasAlts, identifier, phrase_classes, result, string;
    hasAlts = token.chord.endsWith('\'') ? true : false;
    chord = token.chord == null ? ' ' : token.chord;
    chord = chord.replace('#', '&#x266F;');
    chord = chord.replace('b', '&#x266D;');
    chord = chord.replace(/'/g, '');
    string = token.string === '' ? ' ' : token.string.trim();
    phrase_classes = ['phrase'];
    if (token.wordExtension) {
      phrase_classes.push('join');
    }
    chord_classes = ['chord'];
    if (state.showAlts && hasAlts && token.exception && (alts[token.chord] != null)) {
      chord_classes.push('alts');
    }
    if (state.smartMode && !token.exception) {
      chord_classes.push('mute');
    }
    allowable = token.chord.replace(/'/g, '');
    diff = token.chord.length - allowable.length;
    identifier = allowable + diff;
    result = '';
    result += "<p class=\"" + (phrase_classes.join(' ')) + "\">";
    if (state.showChords) {
      result += "<span class=\"" + (chord_classes.join(' ')) + "\" data-id-to=\"" + identifier + "\">" + chord + "</span><br/>";
    }
    result += "<span class='string'>" + string + "</span>";
    result += "</p>";
    if (hasAlts && token.exception && state.showAlts && (alts[token.chord] != null)) {
      result += "<span class='sidebar alts' data-id-from=\"" + identifier + "\">";
      result += "<a>" + chord + "</a> → <a>";
      result += alts[token.chord].join('</a>, <a>');
      result += "</a></span><br/>";
    }
    return result;
  };

  determineKey = function(song) {
    var key, last_chord, last_line, last_lines, last_phrase, last_section, last_section_name;
    key = '';
    if (song.meta.KEY != null) {
      key = song.meta.KEY;
    } else {
      last_lines = song.lyrics[song.lyrics.length - 1].lines;
      last_line = last_lines[last_lines.length - 1];
      last_phrase = last_line[last_line.length - 1];
      key = last_phrase.chord;
      if (key == null) {
        last_section_name = song.sections[song.sections.length - 1];
        last_section = song.chords[last_section_name];
        last_line = last_section[last_section.length - 1];
        last_chord = last_line[last_line.length - 1];
        key = last_chord;
      }
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
