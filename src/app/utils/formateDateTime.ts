export const formatDateTime = (isoString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // 👈 This ensures IST
  };
  return new Date(isoString).toLocaleString("en-IN", options);
};
