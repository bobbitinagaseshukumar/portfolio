import { useState, useEffect } from 'react';
import { personalData, projectsData, skillsData, experienceData } from '../config/portfolioData';

export const usePortfolioData = () => {
  const [data, setData] = useState({
    personal: personalData,
    projects: projectsData,
    skills: skillsData,
    experience: experienceData,
    education: [],
    documents: [],
    settings: {
      siteName: "Kumar Portfolio",
      heroRevealText: "Kumar",
      loadingScreenText: "Loading..."
    }
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const fetchPortfolioData = () => {
    fetch(`${backendUrl}/api/public/portfolio`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          const d = resData.data;
          setData({
            personal: {
              ...personalData,
              name: d.profile?.displayName || d.profile?.fullName || personalData.name,
              title: d.profile?.developerTitle || '',
              headline: d.profile?.shortIntro || '',
              about: d.profile?.biography || '',
              location: d.profile?.location || 'India',
              email: d.profile?.email || 'nagaseshukumarbobbiti@gmail.com',
              phone: d.profile?.phone || '',
              college: d.profile?.collegeName || '',
              degree: d.profile?.degree || '',
              branch: d.profile?.branch || '',
              socials: {
                github: d.profile?.githubUrl || '',
                linkedin: d.profile?.linkedinUrl || '',
                twitter: d.profile?.twitterUrl || '',
                instagram: ''
              }
            },
            projects: d.projects || [],
            skills: d.skills && d.skills.length > 0
              ? [
                  {
                    category: 'Core Technologies',
                    skills: d.skills.map((s) => ({ name: s.name, level: s.proficiency }))
                  }
                ]
              : [],
            experience: d.experiences || [],
            education: d.education || [],
            documents: d.documents || [],
            settings: d.settings || {}
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPortfolioData();

    // Instant real-time synchronization on window focus (switching tabs from admin to public site)
    window.addEventListener('focus', fetchPortfolioData);

    // Periodic sync poll every 8 seconds
    const interval = setInterval(fetchPortfolioData, 8000);

    return () => {
      window.removeEventListener('focus', fetchPortfolioData);
      clearInterval(interval);
    };
  }, []);

  return data;
};
