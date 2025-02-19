export const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 0) return "in the future?";
  
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "less than a minute ago";
    if (diffMin < 60) return `${diffMin} minute(s) ago`;
  
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hour(s) ago`;
  
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays} day(s) ago`;
  
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} week(s) ago`;
  
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month(s) ago`;
  
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year(s) ago`;
};