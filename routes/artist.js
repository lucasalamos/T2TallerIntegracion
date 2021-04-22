const express = require("express");
const router = express.Router();
const Artist = require("../models/artist");
const Album = require("../models/album");
const Track = require("../models/track");
const btoa = require("btoa");

router.get("/", async (req, res) => {
  const artists = await Artist.find();
  res.json(artists);
});

router.get("/:artist_id", async (req, res) => {
  const artist = await Artist.findById(req.params.artist_id);
  res.json(artist);
});

router.get("/:artist_id/albums", async (req, res) => {
  const albums = await Album.find({ artist_id: req.params.artist_id });
  res.json(albums);
});

router.get("/:artist_id/tracks", async (req, res) => {
  const albums_id = [];
  const albums = await Album.find({ artist_id: req.params.artist_id });
  albums.forEach((album) => {
    albums_id.push(album._id);
  });

  const tracks = await Track.find({ album_id: { $in: albums_id } });
  res.json(tracks);
});

router.post("/", async (req, res) => {
  const artist = new Artist({
    _id: btoa(req.body.name),
    name: req.body.name,
    age: req.body.age,
    albums: "/artists/" + btoa(req.body.name) + "/albums",
    tracks: "/artists/" + btoa(req.body.name) + "/tracks",
    self: "/artists/" + btoa(req.body.name),
  });
  await artist.save();
  res.json(artist);
});

router.post("/:artist_id/albums", async (req, res) => {
  const album = new Album({
    _id: btoa(req.body.name),
    artist_id: req.params.artist_id,
    name: req.body.name,
    genre: req.body.genre,
    artist: "/artists/" + req.params.artist_id,
    tracks: "/albums/" + btoa(req.body.name) + "/tracks",
    self: "/albums/" + btoa(req.body.name),
  });
  await album.save();
  res.json(album);
});

router.put("/:artist_id/albums/play", async (req, res) => {
  const albums_id = [];
  const albums = await Album.find({ artist_id: req.params.artist_id });
  albums.forEach((album) => {
    albums_id.push(album._id);
  });
  const tracks = await Track.updateMany(
    { album_id: { $in: albums_id } },
    { $inc: { times_played: 1 } }
  );
  res.json(tracks);
});

router.delete("/:artist_id", async (req, res) => {
  const artist = await Artist.deleteOne({ _id: req.params.artist_id });
  res.json(artist);
});

module.exports = router;
