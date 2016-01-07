// Generated by CoffeeScript 1.10.0
(function() {
  var generateAltsModal, initAlts, location, refresh, replacements, state;

  location = '#canvas';

  state = {
    showChords: true,
    showLyrics: true,
    showRepeats: false,
    showAlts: true,
    showSections: true,
    smartMode: true,
    requestedKey: null
  };

  replacements = null;

  initAlts = function(obj) {
    var chord, i, len, ref;
    replacements = {};
    ref = _.keys(obj);
    for (i = 0, len = ref.length; i < len; i++) {
      chord = ref[i];
      replacements[chord] = null;
    }
    return replacements;
  };

  refresh = function() {
    var file;
    file = parser.parseString($('#input').val());
    if (_.isNull(replacements)) {
      replacements = initAlts(file.alts);
    }
    state.replacements = replacements;
    draw(location, file, state);
    return $('.alts').click(function() {
      var chord;
      chord = _.unescape($(this).attr('data-chord'));
      $('#alternatesModal .modal-body').html(generateAltsModal(file.alts, chord));
      if (_.isNull(state.replacements[chord])) {
        $('#resetChord').addClass('btn-info');
      } else {
        $("#alternatesModal .modal-body [data-index=" + state.replacements[chord] + "]").addClass('btn-info');
      }
      $('#alternatesModal').modal('show');
      return $('#alternatesModal button').click(function() {
        var index;
        chord = $(this).attr('data-chord');
        index = $(this).attr('data-index');
        replacements[chord] = index != null ? index : null;
        state.replacements = replacements;
        $('#alternatesModal').modal('hide');
        return refresh();
      });
    });
  };

  $(function() {
    $('#input').val(window.example);
    refresh();
    $('#input').keyup(refresh);
    $('#transposeUp').click(function() {
      state.requestedKey = createNote($('#currentKey').html()).sharp().clean().name;
      return refresh();
    });
    $('#transposeDown').click(function() {
      state.requestedKey = createNote($('#currentKey').html()).flat().clean().name;
      return refresh();
    });
    $('#transposeReset').click(function() {
      state.requestedKey = null;
      $('#transposeModal').modal('hide');
      return refresh();
    });
    $('#transposeToolbar button').click(function() {
      var clickedChord;
      clickedChord = $(this).attr('data-transposeChord');
      state.requestedKey = clickedChord;
      $('#transposeModal').modal('hide');
      return refresh();
    });
    $("[name='toggle-chords']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showChords = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-lyrics']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showLyrics = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-muted']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.smartMode = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-section']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showSections = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-alts']").on('switchChange.bootstrapSwitch', function(event, bool) {
      state.showAlts = bool ? true : false;
      return refresh();
    });
    $("[name='toggle-edit']").on('switchChange.bootstrapSwitch', function(event, bool) {
      if (bool) {
        $('#input').parent().show();
      } else {
        $('#input').parent().hide();
      }
      if (bool) {
        $('#output').addClass('col-sm-6');
      } else {
        $('#output').removeClass('col-sm-6');
      }
      return refresh();
    });
    return $("input.bs").bootstrapSwitch();
  });

  generateAltsModal = function(alts, chord) {
    var fstring, i, index, len, printChord, ref, rep;
    printChord = chord.replace(/'/g, '');
    fstring = '';
    fstring += "    <button type='button' class='btn btn-lg btn-link' disabled='disabled'>Replace</button>";
    fstring += "    <button type='button' class='btn btn-lg btn-default' id='resetChord' data-chord='" + (_.escape(chord)) + "'>" + printChord + "</button>";
    fstring += "    <button type='button' class='btn btn-lg btn-link' disabled='disabled'>with</button>";
    ref = alts[chord];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      rep = ref[index];
      fstring += "  <button type='button' class='btn btn-lg btn-default' data-chord='" + (_.escape(chord)) + "' data-index='" + index + "'>" + rep + "</button>";
    }
    return fstring;
  };

}).call(this);
