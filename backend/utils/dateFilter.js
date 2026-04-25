const getDateRange = (range) => {
  const now = new Date();
  let start, end;

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;

    case "weekly": {
      // Week starts on Sunday
      const dayOfWeek = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
      end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 6, 23, 59, 59, 999);
      break;
    }

    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      // day 0 of next month = last day of current month
      end   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "yearly":
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;

    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return { start, end };
};

export default getDateRange;
