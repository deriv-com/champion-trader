/**
 * Format a date string or timestamp to display format (e.g., "06 Mar 2025")
 * @param dateInput Date string or timestamp
 * @returns Formatted date string
 */
export const formatDate = (dateInput: string | number): string => {
  if (!dateInput) return "";
  
  try {
    const date = typeof dateInput === 'number' 
      ? new Date(dateInput) 
      : new Date(dateInput);
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateInput);
  }
};

/**
 * Format a date string or timestamp to GMT time format (e.g., "05:19:29 GMT")
 * @param dateInput Date string or timestamp
 * @returns Formatted GMT time string
 */
export const formatGMTTime = (dateInput: string | number): string => {
  if (!dateInput) return "";
  
  // If the input already contains "GMT", just return it as is
  if (typeof dateInput === 'string' && dateInput.includes('GMT')) {
    return dateInput;
  }
  
  try {
    const date = typeof dateInput === 'number' 
      ? new Date(dateInput) 
      : new Date(dateInput);
    
    // Extract just the time part (HH:MM:SS)
    const timeString = date.toTimeString().split(' ')[0];
    return `${timeString} GMT`;
  } catch (error) {
    console.error('Error formatting GMT time:', error);
    
    // If the input is a string that already contains a time format, try to extract it
    if (typeof dateInput === 'string') {
      const timeMatch = dateInput.match(/(\d{2}:\d{2}:\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]} GMT`;
      }
    }
    
    return String(dateInput);
  }
};
