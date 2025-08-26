const logsDB = {
  logs: require("../model/timeLogs.json"),
  setLogs: function (data) {
    this.logs = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const { Parser } = require("json2csv");

const startTimer = async (req, res) => {
  const { project, note, rate } = req.body;
  const user = req.user;

  if (!project) return res.status(400).json({ message: "Project is required" });

  const lastId =
    logsDB.logs.length > 0
      ? parseInt(logsDB.logs[logsDB.logs.length - 1].id)
      : 0;
  const newId = (lastId + 1).toString();

  const now = new Date();
  const isoStart = now.toISOString();
  const displayStart = isoStart.slice(0, 16).replace("T", " ");

  const newLog = {
    id: newId,
    user,
    project,
    startTime: isoStart,
    startTimeDisplay: displayStart,
    endTime: null,
    endTimeDisplay: null,
    duration: null,
    note: note || "",
    rate: rate || null, // Optional at start
    earnedAmount: null
  };

  logsDB.setLogs([...logsDB.logs, newLog]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "timeLogs.json"),
    JSON.stringify(logsDB.logs, null, 2)
  );

  res.status(201).json({ message: "Time log started", log: newLog });
};

const stopTimer = async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body; // Optional rate when stopping
  const user = req.user;

  const log = logsDB.logs.find(
    (entry) => entry.id === id && entry.user === user
  );

  if (!log) return res.status(404).json({ message: "Log not found" });
  if (log.endTime) return res.status(400).json({ message: "Already stopped" });

  const end = new Date();
  const start = new Date(log.startTime);

  const durationInMinutes = Math.round((end - start) / (1000 * 60));

  log.endTime = end.toISOString();
  log.endTimeDisplay = end.toISOString().slice(0, 16).replace("T", " ");
  log.duration = `${durationInMinutes} minute${
    durationInMinutes !== 1 ? "s" : ""
  }`;

  // Use rate from stop request or stored rate
  const finalRate = rate || log.rate;
  if (finalRate) {
    log.rate = finalRate; // Store latest rate
    const hours = durationInMinutes / 60;
    log.earnedAmount = (hours * finalRate).toFixed(2);
  }

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "timeLogs.json"),
    JSON.stringify(logsDB.logs, null, 2)
  );

  res.json({ message: "Time log stopped", log });
};

// Get all logs for the current user
const getallTime = (req, res) => {
  const user = req.user;

  const userLogs = logsDB.logs.filter(log => log.user === user);
  res.json(userLogs);
};

// Delete a log by ID (only if it belongs to the user)
const deleteTimer = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const logIndex = logsDB.logs.findIndex(
    (log) => log.id === id && log.user === user
  );

  if (logIndex === -1) {
    return res.status(404).json({ message: "Log not found or not yours" });
  }

  logsDB.logs.splice(logIndex, 1);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "timeLogs.json"),
    JSON.stringify(logsDB.logs, null, 2)
  );

  res.json({ message: `Log ${id} deleted successfully` });
};

// export csv
const exportLogsToCSV = (req, res) => {
  const user = req.user;
  const userLogs = logsDB.logs.filter((log) => log.user === user);

  if (userLogs.length === 0) {
    return res.status(404).json({ message: "No logs found to export" });
  }

  try {
    const fields = [
      "id",
      "project",
      "startTimeDisplay",
      "endTimeDisplay",
      "duration",
      "note",
      "rate",
      "earnedAmount",
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(userLogs);

    res.header("Content-Type", "text/csv");
    res.attachment(`timelogs-${user}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not export logs" });
  }
};

// GET total earnings for current user
const getEarningsSummary = (req, res) => {
  const user = req.user;

  // Filter logs for current user and with earnedAmount
  const userLogs = logsDB.logs.filter(
    (log) => log.user === user && log.earnedAmount
  );

  // Calculate total earnings
  const totalEarnings = userLogs.reduce(
    (sum, log) => sum + parseFloat(log.earnedAmount || 0),
    0
  );

  // Breakdown by project
  const projectBreakdown = {};
  userLogs.forEach((log) => {
    if (!projectBreakdown[log.project]) {
      projectBreakdown[log.project] = 0;
    }
    projectBreakdown[log.project] += parseFloat(log.earnedAmount || 0);
  });

  res.json({
    totalEarnings: totalEarnings.toFixed(2),
    projectBreakdown
  });
};

module.exports = {
  startTimer,
  stopTimer,
  getallTime,
  deleteTimer,
  exportLogsToCSV,
  getEarningsSummary
};
