const Mopidy = require('mopidy');
const _ = require('lodash');
const SpotifyWebApi = require('spotify-web-api-node');
const { clientId, clientSecret } = require('../spotify_cred/cred.json');

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    console.log('The access token expires in ' + data.body.expires_in);
    console.log('The access token is ' + data.body.access_token);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch(err => console.log('Something went wrong when retrieving an access token', err));

const getUri = data => {
  let uri = _.get(data, 'body.tracks.items[0].uri');
  if (!uri)
   uri = _.get(data, 'body.tracks.items[0].uri');
  if (!uri) throw new Error('Cannot fing uri of tracks');
  return uri;
};

const playMusic = (req, res) => {
  const play = () => {
    const album = _.get(req.body.nlp, 'entities.album[0].raw', null);
    const song = _.get(req.body.nlp, 'entities.song[0].raw', null);
    let musician = _.get(req.body.nlp, 'entities.musician[0].raw', null);
    if (!musician) {
      musician = _.get(req.body.nlp, 'entities.person[0].raw', null);
    }
    const tracksString = song ? `track:${song}` : '';
    const artistString = musician ? `artist:${musician}` : '';
    const albumString = album ? `artist:${album}` : '';
    const searchString = `${artistString} ${tracksString} ${albumString}`;

    return spotifyApi
      .searchTracks(searchString)
      .then(getUri)
      .then(mopidy.library.lookup)
      .then(playlist => playlist)
      .then(mopidy.tracklist.add)
      .then(musicTrack => musicTrack[0])
      .then(mopidy.playback.play)
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };

  const mopidy = new Mopidy({
    webSocketUrl: 'ws://localhost:6680/mopidy/ws/',
  });
  mopidy.on('state:online', play);
  res.send();
};

const musicStyle = (req, res) => {
  const play = () => {
    const category = _.get(req.body.nlp, 'entities.genre[0].raw', null);

    return spotifyApi
      .searchTracks(`category:${category}`)
      .then(data => {
        if (data.body.tracks.items.length > 0) {
          return mopidy.library
            .lookup(data.body.tracks.items[0].uri)
            .then(playlist =>
              mopidy.tracklist
                .add(playlist)
                .then(musicTrack => mopidy.playback.play(musicTrack[0]))
            );
        } else {
          return spotifyApi
            .getPlaylistsForCategory(category)
            .then(result =>
              spotifyApi
                .searchTracks(result.body.playlists.items[0].name)
                .then(tracksResult =>
                  mopidy.library
                    .lookup(tracksResult.body.tracks.items[0].uri)
                    .then(playlist =>
                      mopidy.tracklist
                        .add(playlist)
                        .then(musicTrack => mopidy.playback.play(musicTrack[0]))
                    )
                    .catch(err => console.error(err))
                )
                .catch(err => console.error(err))
            )
            .catch(err => console.log('Something went wrong!', err));
        }
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
  };
  const mopidy = new Mopidy({
    webSocketUrl: 'ws://localhost:6680/mopidy/ws/',
  });
  mopidy.on('state:online', play);
  res.send();
};

module.exports = {
  musicStyle,
  playMusic,
};
