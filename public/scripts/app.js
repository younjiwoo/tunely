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

  // save song modal save button
  $('#saveSong').on('click', handleNewSongSubmit);

  // delete album when its delete button is clicked
  $('#albums').on('click', '.delete-album', handleDeleteAlbumClick);

  $('#albums').on('click', '.edit-album', handleAlbumEditClick);
  $('#albums').on('click', '.save-album', handleSaveChangesClick);
});

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
    $.get('/api/albums/' + albumId, function(data) {
      // remove the current instance of the album from the page
      $('[data-album-id=' + albumId + ']').remove();
      // re-render it with the new album data (including songs)
      renderAlbum(data);
    });
  }).error(function(err) {
    console.log('post to /api/albums/:albumId/songs resulted in error', err);
  });
}
