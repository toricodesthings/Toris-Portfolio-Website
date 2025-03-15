// /api/download.js

import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  // Extract query parameters: url, quality, and action
  const { url, quality, action } = req.query;

  // Validate the URL parameter
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid or missing YouTube URL.' });
  }

  try {
    // Retrieve video information
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    const rawTitle = videoDetails.title;
    // Create a safe file name by replacing non-alphanumeric characters
    const safeTitle = rawTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Determine the requested quality; default to "highestvideo"
    const selectedQuality = quality || 'highestvideo';

    // If the action is to return video info, send JSON with metadata
    if (action === 'info') {
      return res.status(200).json({
        title: videoDetails.title,
        lengthSeconds: videoDetails.lengthSeconds,
        author: videoDetails.author.name,
        viewCount: videoDetails.viewCount,
        description: videoDetails.shortDescription,
        thumbnails: videoDetails.thumbnails,
      });
    } else {
      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');

      // Stream the video with the requested quality
      ytdl(url, { quality: selectedQuality }).pipe(res);
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to process the video.' });
  }
}
