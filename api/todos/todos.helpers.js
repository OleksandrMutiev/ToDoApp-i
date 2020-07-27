const moment = require("moment");

exports.sortByQuery = query => {
  if (query === "active") {
    return { active: -1 };
  } else if (query === "done") {
    return { active: 1 };
  } else if (query === "deadline_first") {
    return { deadline: 1 };
  } else if (query === "deadline_last") {
    return { deadline: -1 };
  } else if (query === "createdAt_first") {
    return { createdAt: 1 };
  } else if (query === "createdAt_last") {
    return { createdAt: -1 };
  }
};

exports.compareDates = deadline => {
  return (
    moment(deadline) > startOfDay(Date.now()) &&
    moment(deadline) < endOfDay(Date.now())
  );
};

const startOfDay = date => {
  return moment(date)
    .utc()
    .startOf("day")
    .toDate();
};

const endOfDay = date => {
  return moment(date)
    .utc()
    .endOf("day")
    .toDate();
};
