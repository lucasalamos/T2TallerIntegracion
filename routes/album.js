const express = require("express");
const router = express.Router();
const Album = require("../models/album");
const Track = require("../models/track");
const btoa = require("btoa");

router.get("/", async (req, res) => {
  const albums = await Album.find();
  res.json(albums);
});

router.get("/:album_id", async (req, res) => {
  const album = await Album.findById(req.params.album_id);
  res.json(album);
});

router.get("/:album_id/tracks", async (req, res) => {
  const tracks = await Track.find({ album_id: req.params.album_id });
  res.json(tracks);
});

router.post("/:album_id/tracks", async (req, res) => {
  const album = await Album.findById(req.params.album_id);
  const track = new Track({
    _id: btoa(req.body.name),
    album_id: req.params.album_id,
    name: req.body.name,
    duration: req.body.duration,
    times_played: req.body.times_played,
    artist: "/artists/" + album.artist_id,
    album: "/albums/" + req.params.album_id,
    self: "/tracks/" + btoa(req.body.name),
  });
  await track.save();
  res.json(track);
});

router.put("/:album_id/tracks/play", async (req, res) => {
  const tracks = await Track.updateMany(
    { album_id: req.params.album_id },
    { $inc: { times_played: 1 } }
  );
  res.json(tracks);
});

router.delete("/:album_id", async (req, res) => {
  const album = await Album.deleteOne({ _id: req.params.album_id });
  res.json(album);
});

module.exports = router;
