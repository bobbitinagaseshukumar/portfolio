import { supabase } from '../config/supabase.js';

export const recordVisitorStats = async (req, res) => {
  try {
    const { deviceType, screenRatio, screenWidth, screenHeight } = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { data, error } = await supabase
      .from('visitor_stats')
      .insert([
        {
          device_type: deviceType || 'desktop',
          screen_ratio: screenRatio || 'unknown',
          screen_width: screenWidth || null,
          screen_height: screenHeight || null,
          user_agent: userAgent
        }
      ]);

    if (error) {
      // Graceful fallback if supabase table isn't created yet
      return res.status(200).json({ success: true, recorded: false });
    }

    return res.status(201).json({ success: true, recorded: true });
  } catch (err) {
    return res.status(200).json({ success: true, recorded: false });
  }
};
