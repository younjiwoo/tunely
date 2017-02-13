/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


$(document).ready(function() {
  console.log('app.js loaded!');

  $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: renderMultipleAlbums
  });

  $('#album-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/albums', formData, function(album) {
      console.log('album after POST', album);
      renderAlbum(album);  //render the server's response
    });
    $(this).trigger("reset");
  });

  // catch and handle the click on an add song button
  $('#albums').on('click', '.add-song', handleAddSongClick);

  $('#albums').on('click', '.delete-album', handleDeleteAlbumClick);
  $('#albums').on('click', '.edit-album', handleAlbumEditClick);
  $('#albums').on('click', '.save-album', handleSaveChangesClick);

  // save song modal save button
  $('#saveSong').on('click', handleNewSongSubmit);
  $('#albums').on('click', '.edit-songs', handleEditSongsClick);

  // edit songs modal triggers
  $('#editSongsModalBody').on('click', 'button.btn-danger', handleDeleteSongClick);
  $('#editSongsModal').on('click', 'button#editSongsModalSubmit', handleUpdateSongsSave);

});

function handleUpdateSongsSave(event) {
  // build all the songs objects up
  var $modal = $('#editSongsModal');
  if($modal.find('form').length < 1) {
    // if there are no form elements, then there are no songs to update
    $modal.modal('hide');
    return;
  }
  // snag the albumId from the first form object on the modal
  var albumId = $modal.find('form').data('album-id');

  var updatedSongs = [];
  // see https://api.jquery.com/each/
  $modal.find('form').each(function () {
    // in here this is a form element
    var aSong = {};
    aSong._id = $(this).attr('id');
    aSong.name = $(this).find('input.song-name').val();
    aSong.trackNumber = $(this).find('input.song-trackNumber').val();
    console.log('found updated data for song: ', aSong);
    updatedSongs.push(aSong);
  });
  // at this point we should have an array of songs to PUT to the server
  //   this is going to be a lot of requests and after all of them we have to update the page again
  //   maybe we should display a spinner to let the user know the requests are processing ?
  //   but let's just take the easy route - hide the modal and continue processing in the background
  $modal.modal('hide');
  updateMultipleSongs(albumId, updatedSongs);
}

function updateMultipleSongs(albumId, songs) {
  // Now we're getting into tough stuff!
  // We're going to kick off as many PUT requests as we need - 1 per songId
  // We'll keep track of the promises from each and once they are ALL done then
  //   we'll re-render the entire album again.
  // We don't want to re-render BEFORE the PUT requests are complete because the data we fetch back
  //   might not have all the updates in it yet!
  var url = '/api/albums/' + albumId + '/songs/';
  var deferreds = [];

  songs.forEach(function(song) {
    var ajaxCall = $.ajax({
      method: 'PUT',
      url: url + song._id,
      data: song,
      error: function(err) { console.log('Error updating song ', song.name, err); }
    });
    deferreds.push(ajaxCall);
  });

  // wait for all the deferreds then, refetch and re-render the album
  // the .apply here is allowing us to apply the stuff in the promises array
  $.when.apply(null, deferreds).always(function() {
    console.log('all updates sent and received, time to refresh!');
    console.log(arguments);
    fetchAndReRenderAlbumWithId(albumId);
  });
}

function fetchAndReRenderAlbumWithId(albumId) {
  $.get('/api/albums/' + albumId, function(data) {
    // remove the current instance of the album from the page
    $('div[data-album-id=' + albumId + ']').remove();
    // re-render it with the new album data (including songs)
    renderAlbum(data);
  });
}

// when a delete button in the edit songs modal is clicked
function handleDeleteSongClick(e) {
  e.preventDefault();  // this is a form!
  var $thisButton = $(this);
  var songId = $thisButton.data('song-id');
  var albumId = $thisButton.closest('form').data('album-id');

  var url = '/api/albums/' + albumId + '/songs/' + songId;
  console.log('send DELETE ', url);
  $.ajax({
    method: 'DELETE',
    url: url,
    success: handleSongDeleteResponse
  });
}

function handleSongDeleteResponse(data) {
  console.log('handleSongDeleteResponse got ', data);
  var songId = data._id;
  var $formRow = $('form#' + songId);
  // since albumId isn't passed to this function, we'll deduce it from the page
  var albumId = $formRow.data('album-id');
  // remove that song edit form from the page
  $formRow.remove();
  fetchAndReRenderAlbumWithId(albumId);
}

// when edit songs button clicked
function handleEditSongsClick(e) {
  var $albumRow = $(this).closest('.album');
  var albumId = $albumRow.data('album-id');
  console.log('edit songs clicked for ', albumId);
  // seems we need the list of songs here - later, when you see full front-end
  // frameworks, this'll be a little easier, for now - lets request the data we need
  $.get('/api/albums/' + albumId + "/songs", function(songs) {
    console.log('got back songs: ', songs);
    populateEditSongsModal(songs, albumId);
    // fire zee modal!
    $('#editSongsModal').modal();
  });
}

function buildEditSongsForms(songs, albumId) {
  // create a edit form for each song, using the same albumId for all of them
  var songEditFormHtmlStrings = songs.map(function(song){
    return (`
      <form class="form-inline" id="${song._id}" data-album-id="${albumId}" >
        <div class="form-group">
          <input type="text" class="form-control song-trackNumber" value="${song.trackNumber}">
        </div>
        <div class="form-group">
          <input type="text" class="form-control song-name" value="${song.name}">
        </div>
        <div class="form-group">
          <button class="btn btn-danger" data-song-id="${song._id}">x</button>
        </div>
      </form>
    `);
  });

  return songEditFormHtmlStrings.join(""); // combine all the forms into a single string
}

// takes an array of songs and generates an EDIT form for them
function populateEditSongsModal(songs, albumId) {
  var editSongsFormsHtml = buildEditSongsForms(songs, albumId);
  // find the modal's body and replace it with the generated html
  $('#editSongsModalBody').html(editSongsFormsHtml);
}

// when the edit button for an album is clicked
function handleAlbumEditClick(e) {
  var $albumRow = $(this).closest('.album');
  var albumId = $albumRow.data('album-id');
  console.log('edit album', albumId);

  // show the save changes button
  $albumRow.find('.save-album').toggleClass('hidden');
  // hide the edit button
  $albumRow.find('.edit-album').toggleClass('hidden');

  // get the album name and replace its field with an input element
  var albumName = $albumRow.find('span.album-name').text();
  $albumRow.find('span.album-name').html('<input class="edit-album-name" value="' + albumName + '"></input>');

  // get the artist name and replace its field with an input element
  var artistName = $albumRow.find('span.artist-name').text();
  $albumRow.find('span.artist-name').html('<input class="edit-artist-name" value="' + artistName + '"></input>');

  // get the releasedate and replace its field with an input element
  var releaseDate = $albumRow.find('span.album-releaseDate').text();
  $albumRow.find('span.album-releaseDate').html('<input class="edit-album-releaseDate" value="' + releaseDate + '"></input>');
}

// after editing an album, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var albumId = $(this).parents('.album').data('album-id'); // $(this).closest would have worked fine too
  var $albumRow = $('[data-album-id=' + albumId + ']');

  var data = {
    name: $albumRow.find('.edit-album-name').val(),
    artistName: $albumRow.find('.edit-artist-name').val(),
    releaseDate: $albumRow.find('.edit-album-releaseDate').val()
  };
  console.log('PUTing data for album', albumId, 'with data', data);

  $.ajax({
    method: 'PUT',
    url: '/api/albums/' + albumId,
    data: data,
    success: handleAlbumUpdatedResponse
  });
}

function handleAlbumUpdatedResponse(data) {
  console.log('response to update', data);

  var albumId = data._id;
  // scratch this album from the page
  $('[data-album-id=' + albumId + ']').remove();
  // and then re-draw it with the updates ;-)
  renderAlbum(data);

  // BONUS: scroll the change into view ;-)
  $('[data-album-id=' + albumId + ']')[0].scrollIntoView();
}

// when a delete button for an album is clicked
function handleDeleteAlbumClick(e) {
  var albumId = $(this).parents('.album').data('album-id');
  console.log('someone wants to delete album id=' + albumId );
  $.ajax({
    url: '/api/albums/' + albumId,
    method: 'DELETE',
    success: handleDeleteAlbumSuccess
  });
}

// callback after DELETE /api/albums/:id
function handleDeleteAlbumSuccess(data) {
  var deletedAlbumId = data._id;
  console.log('removing the following album from the page:', deletedAlbumId);
  $('div[data-album-id=' + deletedAlbumId + ']').remove();
}

function renderMultipleAlbums(albums) {
  albums.forEach(function(album) {
    renderAlbum(album);
  });
}

function renderSong(song){
  return `<span>&ndash; (${song.trackNumber}) ${song.name} &ndash;</span>`
}

function renderAlbum(album) {
  console.log('rendering album', album);

  album.songsHtml = album.songs.map(renderSong).join("");


  var albumHtml = (`
    <div class="row album" data-album-id="${album._id}">

      <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
          <div class="panel-body">


          <!-- begin album internal row -->
            <div class='row'>
              <div class="col-md-3 col-xs-12 thumbnail album-art">
                <img src="images/800x800.png" alt="album image">
              </div>

              <div class="col-md-9 col-xs-12">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h4 class='inline-header'>Album Name:</h4>
                    <span class='album-name'>${album.name}</span>
                  </li>

                  <li class="list-group-item">
                    <h4 class='inline-header'>Artist Name:</h4>
                    <span class='artist-name'>${album.artistName}</span>
                  </li>

                  <li class="list-group-item">
                    <h4 class='inline-header'>Released date:</h4>
                    <span class='album-releaseDate'>${album.releaseDate}</span>
                  </li>

                  <li class="list-group-item">
                    <h4 class="inline-header">Songs:</h4>
                    ${album.songsHtml}
                  </li>

                </ul>
              </div>

            </div>
            <!-- end of album internal row -->

            <div class='panel-footer'>
              <div class='panel-footer'>
                <button class='btn btn-primary add-song'>Add Song</button>
                <button class='btn btn-danger delete-album'>Delete Album</button>
                <button class='btn btn-info edit-album'>Edit Album</button>
                <button class='btn btn-success save-album hidden'>Save Changes</button>
                <button class='btn btn-info edit-songs'>Edit Songs</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- end one album -->
  `);
  $('#albums').prepend(albumHtml);
}

// when the add song button is clicked, display the modal
function handleAddSongClick(e) {
  console.log('add-song clicked!');
  var currentAlbumId = $(this).closest('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
  console.log('id',currentAlbumId);
  $('#songModal').data('album-id', currentAlbumId);
  $('#songModal').modal();  // display the modal!
}

// when the song modal submit button is clicked:
function handleNewSongSubmit(e) {
  e.preventDefault();
  var $modal = $('#songModal');
  var $songNameField = $modal.find('#songName');
  var $trackNumberField = $modal.find('#trackNumber');
  // get data from modal fields
  // note the server expects the keys to be 'name', 'trackNumber' so we use those.
  var dataToPost = {
    name: $songNameField.val(),
    trackNumber: $trackNumberField.val()
  };
  var albumId = $modal.data('albumId');
  console.log('retrieved songName:', songName, ' and trackNumber:', trackNumber, ' for album w/ id: ', albumId);
  // POST to SERVER
  var songPostToServerUrl = '/api/albums/'+ albumId + '/songs';
  $.post(songPostToServerUrl, dataToPost, function(data) {
    console.log('received data from post to /songs:', data);
    // clear form
    $songNameField.val('');
    $trackNumberField.val('');

    // close modal
    $modal.modal('hide');
    // update the correct album to show the new song
    fetchAndReRenderAlbumWithId(albumId);
  }).error(function(err) {
    console.log('post to /api/albums/:albumId/songs resulted in error', err);
  });
}
