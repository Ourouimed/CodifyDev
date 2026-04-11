export const formatSmartDate = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTime = (d) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: userTimeZone,
    }).format(d);

  const formatDate = (options) =>
    new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: userTimeZone,
    }).format(date);

  const isSameDay =
    date.toLocaleDateString("en-CA", { timeZone: userTimeZone }) ===
    now.toLocaleDateString("en-CA", { timeZone: userTimeZone });

  const diffTime = now - date;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (isSameDay) {
    return `Today ${formatTime(date)}`;
  }

  if (diffDays < 7) {
    return formatDate({
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    formatDate({
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + `, ${formatTime(date)}`
  );
};