export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-IN", options);
}

export function sharedOn(dateString) {
    const startDate = new Date(dateString);
    const today = new Date();
  
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    let days = today.getDate() - startDate.getDate();
  
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
  
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    const formatUnit = (value, label) => value === 1 ? `${value} ${label}` : `${value} ${label}s`;
  
    const parts = [];
    if (years > 0) parts.push(formatUnit(years, "year"));
    if (months > 0) parts.push(formatUnit(months, "month"));
    if (days > 0) parts.push(formatUnit(days, "day"));
  
    return parts.length === 0 ? "Today" : `${parts.join(', ')} ago`;
}
