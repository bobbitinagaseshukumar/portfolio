import { supabase } from '../config/supabase.js';

export const handleContactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message, screenDevice, screenResolution } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.'
      });
    }

    // Insert into Supabase table
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          subject: subject || 'New Portfolio Message',
          message,
          screen_device: screenDevice || 'unknown',
          screen_resolution: screenResolution || 'unknown',
          status: 'unread'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase contact insert error:', error);
      // Fallback if Supabase is not configured yet so user experience is smooth during development
      return res.status(200).json({
        success: true,
        message: 'Message received (Note: Set SUPABASE credentials in .env to persist to database)',
        data: { name, email, message, receivedAt: new Date() }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Thank you for reaching out.',
      data: data[0]
    });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing your message.'
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
