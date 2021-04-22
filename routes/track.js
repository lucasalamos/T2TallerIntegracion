const express = require("express");
const router = express.Router();
const Track = require("../models/track");
const btoa = require("btoa");

router.get("/", async (req, res) => {
  const tracks = await Track.find();
  res.json(tracks);
});

router.get("/:track_id", async (req, res) => {
  const track = await Track.findById(req.params.track_id);
  res.json(track);
});

router.put("/:track_id/play", async (req, res) => {
  const track = await Track.updateOne(
    { _id: req.params.track_id },
    { $inc: { times_played: 1 } }
  );
  res.json(track);
});

router.delete("/:track_id", async (req, res) => {
  const track = await Track.deleteOne({ _id: req.params.track_id });
  res.json(track);
});

module.exports = router;
