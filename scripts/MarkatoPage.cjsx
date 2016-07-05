_ = require 'underscore'
React = require 'react'
ReactDOM = require 'react-dom'
memoize = require 'memoizee'
parser = require './parser'
Markato = require './Markato'
MarkatoNav = require './MarkatoNav'
example = require './example'
storage = require './storage'

parsedCurrentSong = memoize parser.parseString, primitive: true

module.exports = React.createClass
  getInitialState: -> storage.defaults
    songs: [
      name: "I Wanna Hold Your Hand [Example]"
      content: example
    ]
    currentSongIndex: 0

  componentDidMount: ->
    window.onunload = @save

  getSongNames: ->
    _.pluck @state.songs, 'name'

  getCurrentSong: ->
    @state.songs[@state.currentSongIndex]

  setCurrentSong: (song) ->
    songs = @state.songs
    songs[@state.currentSongIndex] = song
    @setState songs: songs

  updateCurrentSong: (content) ->
    song = @getCurrentSong()
    song.content = content
    song.name = @parsedCurrentSong().meta.TITLE if @parsedCurrentSong().meta.TITLE
    @setCurrentSong(song)

  newSongContent: (title) ->
    """
    ##TITLE  #{title}
    ##ARTIST Me
    ##KEY    C

    #VERSE
    """

  newSong: ->
    songs = @state.songs
    title = prompt('Enter a title')
    if title
      songs.push
        name: title
        content: @newSongContent title
      @setState songs: songs, currentSongIndex: songs.length - 1, @save

  deleteSong: ->
    if confirm('Are you sure you want to delete this song?')
      index = @state.currentSongIndex
      songs = @state.songs
      songs.splice index, 1
      @setState songs: songs, currentSongIndex: index - 1, @save

  parsedCurrentSong: ->
    parsedCurrentSong @getCurrentSong().content

  save: ->
    storage.synchronize @state

  handleSongSelect: (index) ->
    =>
      @setState currentSongIndex: index, @save

  render: ->
    <div>
      <MarkatoNav currentSongIndex={@state.currentSongIndex}
                  getSongNames={@getSongNames}
                  handleSongSelect={@handleSongSelect}
                  newSong={@newSong} />
      {<Markato play={@props.play}
                stop={@props.stop}
                save={@save}
                input={@getCurrentSong().content}
                parsedInput={@parsedCurrentSong()}
                handleInput={@updateCurrentSong}
                deleteSong={@deleteSong} /> if @state.songs.length}
    </div>