# 🎬 Portfolio Video Directory

Place all your video files here! 

### Supported Formats:
- `.mp4` (Recommended: H.264 encoded for best mobile/desktop browser compatibility)
- `.webm`
- `.mov`

---

### How to use your uploaded videos in the portfolio:
1. Copy or drop your video file into this folder:
   ```
   frontend/public/videos/your-project-video.mp4
   ```
2. Open `frontend/src/config/portfolioData.js`
3. Set the `video` property of any project to:
   ```javascript
   video: "/videos/your-project-video.mp4"
   ```
4. Tell me: *"I uploaded my video `your-project-video.mp4` for project X, please modify it"*, and I will adjust the layout, dimensions, aspect ratio, autoplay, poster thumbnail, or custom 3D display!

---

### Tips for Best Performance Across Devices:
- **Aspect Ratio**: 
  - `16:9` (1920x1080 or 1280x720) for standard laptop/desktop project demos.
  - `9:16` (1080x1920) for mobile app screen recordings (the portfolio automatically adapts to vertical mobile frames!).
- **Compression**: Keep file size under 15-25MB for quick loading on mobile 4G/5G connections (you can use Handbrake or ffmpeg).
