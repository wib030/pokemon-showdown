"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var chatlog_exports = {};
__export(chatlog_exports, {
  DatabaseLogSearcher: () => DatabaseLogSearcher,
  FSLogSearcher: () => FSLogSearcher,
  LogReader: () => LogReader,
  LogReaderRoom: () => LogReaderRoom,
  LogSearcher: () => LogSearcher,
  LogViewer: () => LogViewer,
  RipgrepLogSearcher: () => RipgrepLogSearcher,
  Searcher: () => Searcher,
  commands: () => commands,
  pages: () => pages
});
module.exports = __toCommonJS(chatlog_exports);
var import_lib = require("../../lib");
var import_database = require("../../lib/database");
var import_roomlogs = require("../roomlogs");
/**
 * Pokemon Showdown log viewer
 *
 * by Zarel
 * @license MIT
 */
const DAY = 24 * 60 * 60 * 1e3;
const MAX_MEMORY = 67108864;
const MAX_TOPUSERS = 100;
const UPPER_STAFF_ROOMS = ["upperstaff", "adminlog", "slowlog"];
class LogReaderRoom {
  constructor(roomid) {
    this.roomid = roomid;
  }
  async listMonths() {
    if (import_roomlogs.roomlogTable) {
      const dates = await import_roomlogs.roomlogTable.query()`SELECT DISTINCT month FROM roomlog_dates WHERE roomid = ${this.roomid}`;
      return dates.map((x) => x.month);
    }
    try {
      const listing = await Monitor.logPath(`chat/${this.roomid}`).readdir();
      return listing.filter((file) => /^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/.test(file));
    } catch {
      return [];
    }
  }
  async listDays(month) {
    if (import_roomlogs.roomlogTable) {
      const dates = await import_roomlogs.roomlogTable.query()`SELECT DISTINCT date FROM roomlog_dates WHERE roomid = ${this.roomid} AND month = ${month}`;
      return dates.map((x) => x.date);
    }
    try {
      const listing = await Monitor.logPath(`chat/${this.roomid}/${month}`).readdir();
      return listing.filter((file) => file.endsWith(".txt")).map((file) => file.slice(0, -4));
    } catch {
      return [];
    }
  }
  async getLog(day) {
    if (import_roomlogs.roomlogTable) {
      const [dayStart, dayEnd] = LogReader.dayToRange(day);
      const logs = await import_roomlogs.roomlogTable.selectAll(
        ["log", "time"]
      )`WHERE roomid = ${this.roomid} AND time BETWEEN ${dayStart}::int::timestamp AND ${dayEnd}::int::timestamp`;
      return new import_lib.Streams.ObjectReadStream({
        read() {
          for (const { log: log2, time } of logs) {
            this.buf.push(`${Chat.toTimestamp(time).split(" ")[1]} ${log2}`);
          }
          this.pushEnd();
        }
      });
    }
    const month = LogReader.getMonth(day);
    const log = Monitor.logPath(`chat/${this.roomid}/${month}/${day}.txt`);
    if (!await log.exists()) return null;
    return log.createReadStream().byLine();
  }
}
const LogReader = new class {
  async get(roomid) {
    if (import_roomlogs.roomlogTable) {
      if (!await import_roomlogs.roomlogTable.selectOne()`WHERE roomid = ${roomid}`) return null;
    } else {
      if (!await Monitor.logPath(`chat/${roomid}`).exists()) return null;
    }
    return new LogReaderRoom(roomid);
  }
  async list() {
    if (import_roomlogs.roomlogTable) {
      const roomids = await import_roomlogs.roomlogTable.query()`SELECT DISTINCT roomid FROM roomlog_dates`;
      return roomids.map((x) => x.roomid);
    }
    const listing = await Monitor.logPath(`chat`).readdir();
    return listing.filter((file) => /^[a-z0-9-]+$/.test(file));
  }
  async listCategorized(user, opts) {
    const list = await this.list();
    const isUpperStaff = user.can("rangeban");
    const isStaff = user.can("lock");
    const official = [];
    const normal = [];
    const hidden = [];
    const secret = [];
    const deleted = [];
    const personal = [];
    const deletedPersonal = [];
    let atLeastOne = false;
    for (const roomid of list) {
      const room = Rooms.get(roomid);
      const forceShow = room && // you are authed in the room
      (room.auth.has(user.id) && user.can("mute", null, room) || // you are staff and currently in the room
      isStaff && user.inRooms.has(room.roomid));
      if (!isUpperStaff && !forceShow) {
        if (!isStaff) continue;
        if (!room) continue;
        if (!room.checkModjoin(user)) continue;
        if (room.settings.isPrivate === true) continue;
      }
      atLeastOne = true;
      if (roomid.includes("-")) {
        const matchesOpts = opts && roomid.startsWith(`${opts}-`);
        if (matchesOpts || opts === "all" || forceShow) {
          (room ? personal : deletedPersonal).push(roomid);
        }
      } else if (!room) {
        if (opts === "all" || opts === "deleted") deleted.push(roomid);
      } else if (room.settings.section === "official") {
        official.push(roomid);
      } else if (!room.settings.isPrivate) {
        normal.push(roomid);
      } else if (room.settings.isPrivate === "hidden") {
        hidden.push(roomid);
      } else {
        secret.push(roomid);
      }
    }
    if (!atLeastOne) return null;
    return { official, normal, hidden, secret, deleted, personal, deletedPersonal };
  }
  /** @returns [dayStart, dayEnd] as seconds (NOT milliseconds) since Unix epoch */
  dayToRange(day) {
    const nextDay = LogReader.nextDay(day);
    return [
      Math.trunc(new Date(day).getTime() / 1e3),
      Math.trunc(new Date(nextDay).getTime() / 1e3)
    ];
  }
  /** @returns [monthStart, monthEnd] as seconds (NOT milliseconds) since Unix epoch */
  monthToRange(month) {
    const nextMonth = LogReader.nextMonth(month);
    return [
      Math.trunc((/* @__PURE__ */ new Date(`${month}-01`)).getTime() / 1e3),
      Math.trunc((/* @__PURE__ */ new Date(`${nextMonth}-01`)).getTime() / 1e3)
    ];
  }
  getMonth(day) {
    if (!day) day = Chat.toTimestamp(/* @__PURE__ */ new Date()).split(" ")[0];
    return day.slice(0, 7);
  }
  nextDay(day) {
    const nextDay = new Date(new Date(day).getTime() + DAY);
    return nextDay.toISOString().slice(0, 10);
  }
  prevDay(day) {
    const prevDay = new Date(new Date(day).getTime() - DAY);
    return prevDay.toISOString().slice(0, 10);
  }
  nextMonth(month) {
    const nextMonth = new Date((/* @__PURE__ */ new Date(`${month}-15`)).getTime() + 30 * DAY);
    return nextMonth.toISOString().slice(0, 7);
  }
  prevMonth(month) {
    const prevMonth = new Date((/* @__PURE__ */ new Date(`${month}-15`)).getTime() - 30 * DAY);
    return prevMonth.toISOString().slice(0, 7);
  }
  today() {
    return Chat.toTimestamp(/* @__PURE__ */ new Date()).slice(0, 10);
  }
  isMonth(text) {
    return /^[0-9]{4}-(?:0[0-9]|1[0-2])$/.test(text);
  }
  isDay(text) {
    return /^[0-9]{4}-(?:0[0-9]|1[0-2])-(?:[0-2][0-9]|3[0-1])$/.test(text);
  }
}();
const LogViewer = new class {
  async day(roomid, day, opts) {
    const month = LogReader.getMonth(day);
    let buf = `<div class="pad"><p><a roomid="view-chatlog">\u25C2 All logs</a> / <a roomid="view-chatlog-${roomid}">${roomid}</a> /  <a roomid="view-chatlog-${roomid}--${month}">${month}</a> / <strong>${day}</strong></p><small>${opts ? `Options in use: ${opts}` : ""}</small> <hr />`;
    if (!Config.logchat) {
      buf += `<p class="message-error">Chat logs are disabled</p></div>`;
      return this.linkify(buf);
    }
    const roomLog = await LogReader.get(roomid);
    if (!roomLog) {
      buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
      return this.linkify(buf);
    }
    const prevDay = LogReader.prevDay(day);
    const prevRoomid = `view-chatlog-${roomid}--${prevDay}${opts ? `--${opts}` : ""}`;
    buf += `<p><a roomid="${prevRoomid}" class="blocklink" style="text-align:center">\u25B2<br />${prevDay}</a></p><div class="message-log" style="overflow-wrap: break-word">`;
    const stream = await roomLog.getLog(day);
    if (!stream) {
      buf += `<p class="message-error">Room "${roomid}" doesn't have logs for ${day}</p>`;
    } else {
      for await (const line of stream) {
        for (const part of line.split("\n")) {
          buf += this.renderLine(part, opts, { roomid, date: day });
        }
      }
    }
    buf += `</div>`;
    if (day !== LogReader.today()) {
      const nextDay = LogReader.nextDay(day);
      const nextRoomid = `view-chatlog-${roomid}--${nextDay}${opts ? `--${opts}` : ""}`;
      buf += `<p><a roomid="${nextRoomid}" class="blocklink" style="text-align:center">${nextDay}<br />\u25BC</a></p>`;
    }
    buf += `</div>`;
    return this.linkify(buf);
  }
  parseChatLine(line, day) {
    const [timestamp, type, ...rest] = line.split("|");
    if (type === "c:") {
      const [time, username, ...message] = rest;
      return { time: new Date(time), username, message: message.join("|") };
    }
    return { time: new Date(timestamp + day), username: rest[0], message: rest.join("|") };
  }
  renderLine(fullLine, opts, data) {
    if (!fullLine) return ``;
    let timestamp = fullLine.slice(0, 8);
    let line;
    if (/^[0-9:]+$/.test(timestamp)) {
      line = fullLine.charAt(9) === "|" ? fullLine.slice(10) : "|" + fullLine.slice(9);
    } else {
      timestamp = "";
      line = "!NT|";
    }
    if (opts !== "all" && (line.startsWith(`userstats|`) || line.startsWith("J|") || line.startsWith("L|") || line.startsWith("N|"))) return ``;
    const getClass = (name) => {
      const stampNums = toID(timestamp);
      if (toID(opts) === stampNums) name += ` highlighted`;
      return `class="${name}" data-server="${stampNums}"`;
    };
    if (opts === "txt") return import_lib.Utils.html`<div ${getClass("chat")}>${fullLine}</div>`;
    const cmd = line.slice(0, line.indexOf("|"));
    if (opts?.includes("onlychat")) {
      if (cmd !== "c") return "";
      if (opts.includes("txt")) return `<div ${getClass("chat")}>${import_lib.Utils.escapeHTML(fullLine)}</div>`;
    }
    const timeLink = data ? `<a class="subtle" href="/view-chatlog-${data.roomid}--${data.date}--time-${timestamp}">${timestamp}</a>` : timestamp;
    switch (cmd) {
      case "c": {
        const [, name, message] = import_lib.Utils.splitFirst(line, "|", 2);
        if (name.length <= 1) {
          return `<div ${getClass("chat")}><small>[${timeLink}] </small><q>${Chat.formatText(message)}</q></div>`;
        }
        if (message.startsWith(`/log `)) {
          return `<div ${getClass("chat")}><small>[${timeLink}] </small><q>${Chat.formatText(message.slice(5))}</q></div>`;
        }
        if (message.startsWith(`/raw `)) {
          return `<div ${getClass("notice")}>${message.slice(5)}</div>`;
        }
        if (message.startsWith(`/uhtml `) || message.startsWith(`/uhtmlchange `)) {
          if (message.startsWith(`/uhtmlchange `)) return ``;
          if (opts !== "all") return `<div ${getClass("notice")}>[uhtml box hidden]</div>`;
          return `<div ${getClass("notice")}>${message.slice(message.indexOf(",") + 1)}</div>`;
        }
        const group = !name.startsWith(" ") ? name.charAt(0) : ``;
        return `<div ${getClass("chat")}><small>[${timeLink}]` + import_lib.Utils.html` ${group}</small><username>${name.slice(1)}:</username> ` + `<q>${Chat.formatText(message)}</q></div>`;
      }
      case "html":
      case "raw": {
        const [, html] = import_lib.Utils.splitFirst(line, "|", 1);
        return `<div ${getClass("notice")}>${html}</div>`;
      }
      case "uhtml":
      case "uhtmlchange": {
        if (cmd !== "uhtml") return ``;
        const [, , html] = import_lib.Utils.splitFirst(line, "|", 2);
        return `<div ${getClass("notice")}>${html}</div>`;
      }
      case "!NT":
        return `<div ${getClass("chat")}>${import_lib.Utils.escapeHTML(fullLine)}</div>`;
      case "":
        return `<div ${getClass("chat")}><small>[${timeLink}] </small>${import_lib.Utils.escapeHTML(line.slice(1))}</div>`;
      default:
        return `<div ${getClass("chat")}><small>[${timeLink}] </small><code>${"|" + import_lib.Utils.escapeHTML(line)}</code></div>`;
    }
  }
  async month(roomid, month) {
    let buf = `<div class="pad"><p><a roomid="view-chatlog">\u25C2 All logs</a> / <a roomid="view-chatlog-${roomid}">${roomid}</a> / <strong>${month}</strong></p><hr />`;
    if (!Config.logchat) {
      buf += `<p class="message-error">Chat logs are disabled</p></div>`;
      return this.linkify(buf);
    }
    const roomLog = await LogReader.get(roomid);
    if (!roomLog) {
      buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
      return this.linkify(buf);
    }
    const prevMonth = LogReader.prevMonth(month);
    buf += `<p><a roomid="view-chatlog-${roomid}--${prevMonth}" class="blocklink" style="text-align:center">\u25B2<br />${prevMonth}</a></p><div>`;
    const days = await roomLog.listDays(month);
    if (!days.length) {
      buf += `<p class="message-error">Room "${roomid}" doesn't have logs in ${month}</p></div>`;
      return this.linkify(buf);
    } else {
      for (const day of days) {
        buf += `<p>- <a roomid="view-chatlog-${roomid}--${day}">${day}</a> <small>`;
        for (const opt of ["txt", "onlychat", "all", "txt-onlychat"]) {
          buf += ` (<a roomid="view-chatlog-${roomid}--${day}--${opt}">${opt}</a>) `;
        }
        buf += `</small></p>`;
      }
    }
    if (!LogReader.today().startsWith(month)) {
      const nextMonth = LogReader.nextMonth(month);
      buf += `<p><a roomid="view-chatlog-${roomid}--${nextMonth}" class="blocklink" style="text-align:center">${nextMonth}<br />\u25BC</a></p>`;
    }
    buf += `</div>`;
    return this.linkify(buf);
  }
  async room(roomid) {
    let buf = `<div class="pad"><p><a roomid="view-chatlog">\u25C2 All logs</a> / <strong>${roomid}</strong></p><hr />`;
    if (!Config.logchat) {
      buf += `<p class="message-error">Chat logs are disabled</p></div>`;
      return this.linkify(buf);
    }
    const roomLog = await LogReader.get(roomid);
    if (!roomLog) {
      buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
      return this.linkify(buf);
    }
    const months = await roomLog.listMonths();
    if (!months.length) {
      buf += `<p class="message-error">Room "${roomid}" doesn't have logs</p></div>`;
      return this.linkify(buf);
    }
    for (const month of months) {
      buf += `<p>- <a roomid="view-chatlog-${roomid}--${month}">${month}</a></p>`;
    }
    buf += `</div>`;
    return this.linkify(buf);
  }
  async list(user, opts) {
    let buf = `<div class="pad"><p><strong>All logs</strong></p><hr />`;
    const categories = {
      "official": "Official",
      "normal": "Public",
      "hidden": "Hidden",
      "secret": "Secret",
      "deleted": "Deleted",
      "personal": "Personal",
      "deletedPersonal": "Deleted Personal"
    };
    const list = await LogReader.listCategorized(user, opts);
    if (!list) {
      buf += `<p class="message-error">You must be a staff member of a room to view its logs</p></div>`;
      return buf;
    }
    const showPersonalLink = opts !== "all" && user.can("rangeban");
    for (const k in categories) {
      if (!list[k].length && !(["personal", "deleted"].includes(k) && showPersonalLink)) {
        continue;
      }
      buf += `<p>${categories[k]}</p>`;
      if (k === "personal" && showPersonalLink) {
        if (opts !== "help") buf += `<p>- <a roomid="view-chatlog--help">(show all help)</a></p>`;
        if (opts !== "groupchat") buf += `<p>- <a roomid="view-chatlog--groupchat">(show all groupchat)</a></p>`;
      }
      if (k === "deleted" && showPersonalLink) {
        if (opts !== "deleted") buf += `<p>- <a roomid="view-chatlog--deleted">(show deleted)</a></p>`;
      }
      for (const roomid of list[k]) {
        buf += `<p>- <a roomid="view-chatlog-${roomid}">${roomid}</a></p>`;
      }
    }
    buf += `</div>`;
    return this.linkify(buf);
  }
  error(message) {
    return `<div class="pad"><p class="message-error">${message}</p></div>`;
  }
  linkify(buf) {
    return buf.replace(/<a roomid="/g, `<a target="replace" href="/`);
  }
}();
class Searcher {
  constructor() {
    this.roomstatsCache = /* @__PURE__ */ new Map();
  }
  static checkEnabled(user) {
    if (global.Config.disableripgrep) {
      throw new Chat.ErrorMessage("Log searching functionality is currently disabled.");
    }
    if (user && Config.searchlogrank && !Users.globalAuth.atLeast(user, Config.searchlogrank)) {
      throw new Chat.ErrorMessage("Access denied.");
    }
  }
  constructUserRegex(user) {
    const id = toID(user);
    return `.${[...id].join("[^a-zA-Z0-9]*")}[^a-zA-Z0-9]*`;
  }
  renderLinecountResults(results, roomid, month, user) {
    let buf = import_lib.Utils.html`<div class="pad"><h2>Linecounts on `;
    buf += `${roomid}${user ? ` for the user ${user}` : ` (top ${MAX_TOPUSERS})`}</h2>`;
    buf += `<strong>Total lines: {total}</strong><br />`;
    buf += `<strong>Month: ${month}</strong><br />`;
    const nextMonth = LogReader.nextMonth(month);
    const prevMonth = LogReader.prevMonth(month);
    if (Monitor.logPath(`chat/${roomid}/${prevMonth}`).existsSync()) {
      buf += `<small><a roomid="view-roomstats-${roomid}--${prevMonth}${user ? `--${user}` : ""}">Previous month</a></small>`;
    }
    if (Monitor.logPath(`chat/${roomid}/${nextMonth}`).existsSync()) {
      buf += ` <small><a roomid="view-roomstats-${roomid}--${nextMonth}${user ? `--${user}` : ""}">Next month</a></small>`;
    }
    if (!results) {
      buf += "<hr />";
      buf += LogViewer.error(`Logs for month '${month}' do not exist on room ${roomid}.`);
      return buf;
    } else if (user) {
      buf += "<hr /><ol>";
      const sortedDays = import_lib.Utils.sortBy(Object.keys(results));
      let total = 0;
      for (const day of sortedDays) {
        const dayResults = results[day][user];
        if (isNaN(dayResults)) continue;
        total += dayResults;
        buf += `<li>[<a roomid="view-chatlog-${roomid}--${day}">${day}</a>]: `;
        buf += `${Chat.count(dayResults, "lines")}</li>`;
      }
      buf = buf.replace("{total}", `${total}`);
    } else {
      buf += "<hr /><ol>";
      const totalResults = {};
      for (const date of import_lib.Utils.sortBy(Object.keys(results))) {
        for (const userid in results[date]) {
          if (!totalResults[userid]) totalResults[userid] = 0;
          totalResults[userid] += results[date][userid];
        }
      }
      const resultKeys = Object.keys(totalResults);
      const sortedResults = import_lib.Utils.sortBy(resultKeys, (userid) => -totalResults[userid]).slice(0, MAX_TOPUSERS);
      let total = 0;
      for (const userid of sortedResults) {
        total += totalResults[userid];
        buf += `<li><span class="username"><username>${userid}</username></span>: `;
        buf += `${Chat.count(totalResults[userid], "lines")}</li>`;
      }
      buf = buf.replace("{total}", `${total}`);
    }
    buf += `</div>`;
    return LogViewer.linkify(buf);
  }
  async runLinecountSearch(context, roomid, month, user) {
    context.setHTML(
      `<div class="pad"><h2>Searching linecounts on room ${roomid}${user ? ` for the user ${user}` : ""}.</h2></div>`
    );
    context.setHTML(await LogSearcher.searchLinecounts(roomid, month, user));
  }
  async runSearch(context, search, roomid, date, limit) {
    context.title = `[Search] [${roomid}] ${search}`;
    if (!Rooms.Roomlogs.table) {
      throw new Error(`Database logging must be enabled to use this feature.`);
    }
    context.setHTML(
      `<div class="pad"><h2>Running a chatlog search for "${search}" on room ${roomid}` + (date ? date !== "all" ? `, on the date "${date}"` : ", on all dates" : "") + `.</h2></div>`
    );
    const response = await this.searchLogs(roomid, search, limit, date);
    return context.setHTML(response);
  }
  // this would normally be abstract, but it's very difficult with ripgrep
  // so it's easier to just do it the same way for both.
  async roomStats(room, month) {
    const stats = await LogSearcher.activityStats(room, month);
    let buf = `<div class="pad"><h2>Room stats for ${room} [${month}]</h2><hr />`;
    buf += `<strong>Total days with logs: ${stats.average.days}</strong><br />`;
    buf += this.visualizeStats(stats.average);
    buf += `<hr />`;
    buf += `<details class="readmore"><summary><strong>Stats by day</strong></summary>`;
    for (const day of stats.days) {
      buf += `<div class="infobox"><strong><a roomid="view-chatlog-${room}--${day.day}">${day.day}</a></strong><br />`;
      buf += this.visualizeStats(day);
      buf += `</div>`;
    }
    buf += "</details>";
    return LogViewer.linkify(buf);
  }
  visualizeStats(stats) {
    const titles = {
      deadTime: "Average time between lines",
      deadPercent: "Average % of the day spent more than 5 minutes inactive",
      linesPerUser: "Average lines per user",
      averagePresent: "Average users present",
      totalLines: "Average lines per day"
    };
    let buf = `<div class="ladder pad"><table><tr><th>`;
    buf += Object.values(titles).join("</th><th>");
    buf += `</th></tr><tr>`;
    for (const k in titles) {
      buf += `<td>`;
      switch (k) {
        case "deadTime":
          buf += Chat.toDurationString(stats.deadTime, { precision: 2 });
          break;
        case "linesPerUser":
        case "totalLines":
        case "averagePresent":
        case "deadPercent":
          buf += (stats[k] || 0).toFixed(2);
          break;
      }
      buf += `</td>`;
    }
    buf += `</tr></table></div>`;
    return buf;
  }
}
class FSLogSearcher extends Searcher {
  constructor() {
    super();
    this.results = 0;
  }
  searchLogs() {
    throw new Chat.ErrorMessage(`Searching logs is not supported right now. Use database text logging to enable it.`);
  }
  async searchLinecounts(roomid, month, user) {
    const directory = Monitor.logPath(`chat/${roomid}/${month}`);
    if (!directory.existsSync()) {
      return this.renderLinecountResults(null, roomid, month, user);
    }
    const files = await directory.readdir();
    const results = {};
    for (const file of files) {
      const day = file.slice(0, -4);
      const stream = Monitor.logPath(`chat/${roomid}/${month}/${file}`).createReadStream();
      for await (const line of stream.byLine()) {
        const parts = line.split("|").map(toID);
        const id = parts[2];
        if (!id) continue;
        if (parts[1] === "c") {
          if (user && id !== user) continue;
          if (!results[day]) results[day] = {};
          if (!results[day][id]) results[day][id] = 0;
          results[day][id]++;
        }
      }
    }
    return this.renderLinecountResults(results, roomid, month, user);
  }
  async dayStats(room, day) {
    const cached = this.roomstatsCache.get(room + "-" + day);
    if (cached) return cached;
    const results = {
      deadTime: 0,
      deadPercent: 0,
      lines: {},
      users: {},
      days: 1,
      // irrelevant
      linesPerUser: 0,
      totalLines: 0,
      averagePresent: 0,
      day
    };
    const path = Monitor.logPath(`chat/${room}/${LogReader.getMonth(day)}/${day}.txt`);
    if (!path.existsSync()) return false;
    const stream = path.createReadStream();
    let lastTime = new Date(day).getTime();
    let userstatCount = 0;
    const waitIncrements = [];
    for await (const line of stream.byLine()) {
      const [, type, ...rest] = line.split("|");
      switch (type) {
        // the actual info in this is unused, but it may be useful in the future (we use the keys later)
        case "J":
        case "j": {
          if (rest[0]?.startsWith("*")) continue;
          const userid = toID(rest[0]);
          if (!results.users[userid]) {
            results.users[userid] = 0;
          }
          results.users[userid]++;
          break;
        }
        case "c:":
        case "c": {
          const { time, username } = LogViewer.parseChatLine(line, day);
          const curTime = time.getTime();
          if (curTime - lastTime > 5 * 60 * 1e3) {
            waitIncrements.push(curTime - lastTime);
            lastTime = curTime;
          }
          const userid = toID(username);
          if (!results.lines[userid]) results.lines[userid] = 0;
          results.lines[userid]++;
          results.totalLines++;
          break;
        }
        case "userstats": {
          const [rawTotal] = rest;
          const total = parseInt(rawTotal.split(":")[1]);
          results.averagePresent += total;
          userstatCount++;
          break;
        }
      }
    }
    results.deadTime = waitIncrements.length ? this.calculateDead(waitIncrements) : 0;
    results.deadPercent = !results.totalLines ? 100 : waitIncrements.length / results.totalLines * 100;
    results.linesPerUser = results.totalLines / Object.keys(results.users).length || 0;
    results.averagePresent /= userstatCount;
    if (day !== LogReader.today()) {
      this.roomstatsCache.set(room + "-" + day, results);
    }
    return results;
  }
  calculateDead(waitIncrements) {
    let num = 0;
    for (const k of waitIncrements) {
      num += k;
    }
    return num / waitIncrements.length;
  }
  async activityStats(room, month) {
    const collected = {
      deadTime: 0,
      deadPercent: 0,
      lines: {},
      users: {},
      days: 0,
      linesPerUser: 0,
      totalLines: 0,
      averagePresent: 0
    };
    if (!Monitor.logPath(`chat/${room}`).existsSync()) {
      return { days: [], average: collected };
    }
    if (!Monitor.logPath(`chat/${room}/${month}`).existsSync()) {
      return { days: [], average: collected };
    }
    const days = (await Monitor.logPath(`chat/${room}/${month}`).readdir()).map((f) => f.slice(0, -4));
    const stats = [];
    const today = Chat.toTimestamp(/* @__PURE__ */ new Date()).split(" ")[0];
    for (const day of days) {
      if (day === today) {
        continue;
      }
      const curStats = await this.dayStats(room, day);
      if (!curStats) continue;
      stats.push(curStats);
    }
    collected.days = days.length;
    for (const entry of stats) {
      for (const k of ["deadTime", "deadPercent", "linesPerUser", "totalLines", "averagePresent"]) {
        collected[k] += entry[k];
      }
      for (const type of ["lines"]) {
        for (const k in entry[type]) {
          if (!collected[type][k]) collected[type][k] = 0;
          collected[type][k] += entry[type][k];
        }
      }
    }
    for (const k of ["deadTime", "deadPercent", "linesPerUser", "totalLines", "averagePresent"]) {
      collected[k] /= stats.length;
    }
    return { average: collected, days: stats };
  }
}
class RipgrepLogSearcher extends FSLogSearcher {
  async ripgrepSearchMonth(opts) {
    const { search, room: roomid, date: month, args } = opts;
    let results;
    let lineCount = 0;
    if (Config.disableripgrep) {
      return { lineCount: 0, results: [] };
    }
    const resultSep = args?.includes("-m") ? "--" : "\n";
    try {
      const options = [
        "-e",
        search,
        Monitor.logPath(`chat/${roomid}/${month}`).path,
        "-i"
      ];
      if (args) {
        options.push(...args);
      }
      const { stdout } = await import_lib.ProcessManager.exec(["rg", ...options], {
        maxBuffer: MAX_MEMORY,
        cwd: import_lib.FS.ROOT_PATH
      });
      results = stdout.split(resultSep);
    } catch (e) {
      if (e.code !== 1 && !e.message.includes("stdout maxBuffer") && !e.message.includes("No such file or directory")) {
        throw e;
      }
      if (e.stdout) {
        results = e.stdout.split(resultSep);
      } else {
        results = [];
      }
    }
    lineCount += results.length;
    return { results, lineCount };
  }
  async searchLinecounts(room, month, user) {
    const regexString = (user ? `\\|c\\|${this.constructUserRegex(user)}\\|` : `\\|c\\|([^|]+)\\|`) + `(?!\\/uhtml(change)?)`;
    const args = user ? ["--count"] : [];
    args.push(`--pcre2`);
    const { results: rawResults } = await this.ripgrepSearchMonth({
      search: regexString,
      raw: true,
      date: month,
      room,
      args
    });
    const results = {};
    for (const fullLine of rawResults) {
      const [data, line] = fullLine.split(".txt:");
      const date = data.split("/").pop();
      if (!results[date]) results[date] = {};
      if (!toID(date)) continue;
      if (user) {
        if (!results[date][user]) results[date][user] = 0;
        const parsed = parseInt(line);
        results[date][user] += isNaN(parsed) ? 0 : parsed;
      } else {
        const parts = line?.split("|").map(toID);
        if (!parts || parts[1] !== "c") continue;
        const id = parts[2];
        if (!id) continue;
        if (!results[date][id]) results[date][id] = 0;
        results[date][id]++;
      }
    }
    return this.renderLinecountResults(results, room, month, user);
  }
}
class DatabaseLogSearcher extends Searcher {
  async searchLogs(roomid, rawSearch, limit, month) {
    if (!limit) limit = 500;
    if (limit > 5e3) limit = 5e3;
    const search = {};
    const [monthStart, monthEnd] = LogReader.monthToRange(month);
    if (!Rooms.Roomlogs.table) {
      throw new Error(`Database table missing but searchlogs called`);
    }
    const parsedSearch = [];
    for (let part of rawSearch.split(",").map((x) => x.trim())) {
      let negated = false;
      if (part.includes("!=")) {
        negated = true;
        part = part.replace("!=", "=");
      }
      if (["user=", "user:", "user-"].some((x) => part.toLowerCase().startsWith(x))) {
        search.user = [toID(part.slice(5)), negated];
      } else {
        part = part.replace(/[/\\:=!|&?*<->]+/g, " ");
        if (toID(part).length) parsedSearch.push(part);
      }
    }
    const results = await Rooms.Roomlogs.table.selectAll()`
			WHERE ${search.user ? import_database.SQL`userid ${search.user[1] ? import_database.SQL`!=` : import_database.SQL`=`} ${search.user[0]} AND ` : import_database.SQL``} time BETWEEN ${monthStart}::int::timestamp AND ${monthEnd}::int::timestamp AND
			type = ${"c"} AND roomid = ${roomid}
			${parsedSearch.length ? import_database.SQL` AND content @@ plainto_tsquery(${parsedSearch.join(",")})` : import_database.SQL``} LIMIT ${limit}
		`;
    let curDate = "";
    let parsedSearchStr = `"${parsedSearch.join(", ")}" `;
    const argStr = Object.entries(search).map(([key, val]) => `${key}${val[1] ? "!=" : "="}${val[0]}`);
    if (argStr.length) parsedSearchStr += `<small> (arguments: ${argStr})</small>`;
    let buf = import_lib.Utils.html`<div class="pad"><strong>Results on ${roomid} for ${parsedSearchStr} during the month ${month}:</strong>`;
    buf += limit ? ` ${results.length} (capped at ${limit})` : "";
    buf += `<hr />`;
    const searchStr = `search-${import_lib.Dashycode.encode(rawSearch)}--limit-${limit}`;
    const pref = `/join view-chatlog-${roomid}--`;
    buf += `<button class="button" name="send" value="${pref}${LogReader.prevMonth(month)}--${searchStr}">Previous month</button> `;
    buf += `<button class="button" name="send" value="${pref}${LogReader.nextMonth(month)}--${searchStr}">Next month</button>`;
    buf += `<br />`;
    buf += `<div class="pad"><blockquote>`;
    buf += import_lib.Utils.sortBy(results, (line) => -line.time.getTime()).map((resultRow) => {
      let [lineDate, lineTime] = Chat.toTimestamp(resultRow.time).split(" ");
      let line = LogViewer.renderLine(`${lineTime} ${resultRow.log}`, "", {
        roomid,
        date: lineDate
      });
      if (!line) return null;
      line = `<div class="chat chatmessage highlighted">${line}</div>`;
      if (curDate !== lineDate) {
        curDate = lineDate;
        lineDate = `</details><details open><summary>[<a href="view-chatlog-${roomid}--${lineDate}">${lineDate}</a>]</summary>`;
      } else {
        lineDate = "";
      }
      return `${lineDate} ${line}`;
    }).filter(Boolean).join("<hr />");
    if (limit && limit < 5e3) {
      buf += `</details></blockquote><hr /><strong>Capped at ${limit}.</strong><br />`;
      buf += `<button class="button" name="send" value="/sl ${rawSearch},room=${roomid},limit=${limit + 200}">`;
      buf += `View 200 more<br />&#x25bc;</button>`;
      buf += `<button class="button" name="send" value="/sl ${rawSearch},room=${roomid},limit=3000">`;
      buf += `View all<br />&#x25bc;</button></div>`;
    }
    return buf;
  }
  async searchLinecounts(roomid, month, user) {
    user = toID(user);
    if (!Rooms.Roomlogs.table) throw new Error(`Database search made while database is disabled.`);
    const results = {};
    const [monthStart, monthEnd] = LogReader.monthToRange(month);
    const rows = await Rooms.Roomlogs.table.selectAll()`
			WHERE ${user ? import_database.SQL`userid = ${user} AND ` : import_database.SQL``}roomid = ${roomid} AND
			time BETWEEN ${monthStart}::int::timestamp AND ${monthEnd}::int::timestamp AND
			type = ${"c"}
		`;
    for (const row of rows) {
      if (!row.userid) continue;
      const day = Chat.toTimestamp(row.time).split(" ")[0];
      if (!results[day]) results[day] = {};
      if (!results[day][row.userid]) results[day][row.userid] = 0;
      results[day][row.userid]++;
    }
    return this.renderLinecountResults(results, roomid, month, user);
  }
  activityStats(room, month) {
    throw new Chat.ErrorMessage("This is not yet implemented for the new logs database.");
  }
}
const LogSearcher = new (Rooms.Roomlogs.table ? DatabaseLogSearcher : (
  // no db, determine fs reader type.
  Config.chatlogreader === "ripgrep" ? RipgrepLogSearcher : FSLogSearcher
))();
const accessLog = Monitor.logPath(`chatlog-access.txt`).createAppendStream();
const pages = {
  async chatlog(args, user, connection) {
    if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
    let [roomid, date, opts] = import_lib.Utils.splitFirst(args.join("-"), "--", 2);
    if (!roomid || roomid.startsWith("-")) {
      this.title = "[Logs]";
      return LogViewer.list(user, roomid?.slice(1));
    }
    this.title = "[Logs] " + roomid;
    const room = Rooms.get(roomid);
    if (!user.trusted) {
      if (room) {
        this.checkCan("declare", null, room);
      } else {
        throw new Chat.ErrorMessage(`Access denied.`);
      }
    }
    if (!user.can("rangeban")) {
      if (roomid.startsWith("spl") && roomid !== "splatoon") {
        throw new Chat.ErrorMessage("SPL team discussions are super secret.");
      }
      if (roomid.startsWith("wcop")) {
        throw new Chat.ErrorMessage("WCOP team discussions are super secret.");
      }
      if (UPPER_STAFF_ROOMS.includes(roomid) && !user.inRooms.has(roomid)) {
        throw new Chat.ErrorMessage("Upper staff rooms are super secret.");
      }
    }
    if (room) {
      if (!user.can("lock") || room.settings.isPrivate === "hidden" && !room.checkModjoin(user)) {
        if (!room.persist) throw new Chat.ErrorMessage(`Access denied.`);
        this.checkCan("mute", null, room);
      }
    } else {
      this.checkCan("lock");
    }
    void accessLog.writeLine(`${user.id}: <${roomid}> ${date}`);
    if (!date) {
      return LogViewer.room(roomid);
    }
    date = date.trim();
    let search;
    let limit = null;
    if (opts?.startsWith("search-")) {
      let [input, limitString] = opts.split("--limit-");
      input = input.slice(7);
      search = import_lib.Dashycode.decode(input);
      if (search.length < 3) return this.errorReply(`That's too short of a search query.`);
      if (limitString) {
        limit = parseInt(limitString) || null;
      } else {
        limit = 500;
      }
      opts = "";
    }
    const parsedDate = new Date(date);
    const validDateStrings = ["all", "alltime"];
    const validNonDateTerm = search ? validDateStrings.includes(date) : date === "today";
    if (isNaN(parsedDate.getTime()) && !validNonDateTerm) {
      throw new Chat.ErrorMessage(`Invalid date.`);
    }
    const isTime = opts?.startsWith("time-");
    if (isTime && opts) opts = toID(opts.slice(5));
    if (search) {
      if (!/^\d{4}-\d{2}$/.test(date)) {
        throw new Chat.ErrorMessage(`Date must be a month in the YYYY-MM format.`);
      }
      Searcher.checkEnabled(user);
      if (validDateStrings.includes(date)) throw new Chat.ErrorMessage(`Months must be specified for searching.`);
      return LogSearcher.runSearch(this, search, roomid, date, limit);
    } else {
      if (date === "today") {
        this.setHTML(await LogViewer.day(roomid, LogReader.today(), opts));
        if (isTime) this.send(`|scroll|div[data-server="${opts}"]`);
      } else if (date.split("-").length === 3) {
        this.setHTML(await LogViewer.day(roomid, parsedDate.toISOString().slice(0, 10), opts));
        if (isTime) this.send(`|scroll|div[data-server="${opts}"]`);
      } else {
        return LogViewer.month(roomid, parsedDate.toISOString().slice(0, 7));
      }
    }
  },
  roomstats(args, user) {
    Searcher.checkEnabled();
    const room = this.extractRoom();
    if (room) {
      this.checkCan("mute", null, room);
    } else {
      if (!user.can("bypassall")) {
        throw new Chat.ErrorMessage(`You cannot view logs for rooms that no longer exist.`);
      }
    }
    const [, date, target] = import_lib.Utils.splitFirst(args.join("-"), "--", 3).map((item) => item.trim());
    if (isNaN(new Date(date).getTime())) {
      throw new Chat.ErrorMessage(`Invalid date.`);
    }
    if (!LogReader.isMonth(date)) {
      throw new Chat.ErrorMessage(`You must specify an exact month - both a year and a month.`);
    }
    this.title = `[Log Stats] ${date}`;
    return LogSearcher.runLinecountSearch(this, room ? room.roomid : args[0], date, toID(target));
  },
  async logsaccess(query) {
    this.checkCan("rangeban");
    const type = toID(query.shift());
    if (type && !["chat", "battle", "all", "battles"].includes(type)) {
      throw new Chat.ErrorMessage(`Invalid log type.`);
    }
    let title = "";
    switch (type) {
      case "battle":
      case "battles":
        title = "Battlelog access log";
        break;
      case "chat":
        title = "Chatlog access log";
        break;
      default:
        title = "Logs access log";
        break;
    }
    const userid = toID(query.shift());
    let buf = `<div class="pad"><h2>${title}`;
    if (userid) buf += ` for ${userid}`;
    buf += `</h2><hr /><ol>`;
    const accessStream = Monitor.logPath(`chatlog-access.txt`).createReadStream();
    for await (const line of accessStream.byLine()) {
      const [id, rest] = import_lib.Utils.splitFirst(line, ": ");
      if (userid && id !== userid) continue;
      if (type === "battle" && !line.includes("battle-")) continue;
      if (userid) {
        buf += `<li>${rest}</li>`;
      } else {
        buf += `<li><username>${id}</username>: ${rest}</li>`;
      }
    }
    buf += `</ol>`;
    return buf;
  },
  roominfo(query, user) {
    this.checkCan("rangeban");
    const args = import_lib.Utils.splitFirst(query.join("-"), "--", 2);
    const roomid = toID(args.shift());
    if (!roomid) {
      throw new Chat.ErrorMessage(`Specify a room.`);
    }
    const date = args.shift() || LogReader.getMonth();
    this.title = `[${roomid}] Activity Stats (${date})`;
    this.setHTML(`<div class="pad">Collecting stats for ${roomid} in ${date}...</div>`);
    return LogSearcher.roomStats(roomid, date);
  }
};
const commands = {
  chatlogs: "chatlog",
  cl: "chatlog",
  roomlog: "chatlog",
  rl: "chatlog",
  roomlogs: "chatlog",
  chatlog(target, room, user) {
    const [tarRoom, ...opts] = target.split(",");
    const targetRoom = tarRoom ? Rooms.search(tarRoom) : room;
    const roomid = targetRoom ? targetRoom.roomid : target;
    return this.parse(`/join view-chatlog-${roomid}--today${opts ? `--${opts.map(toID).join("--")}` : ""}`);
  },
  chatloghelp() {
    const strings = [
      `/chatlog [optional room], [opts] - View chatlogs from the given room. `,
      `If none is specified, shows logs from the room you're in. Requires: % @ * # ~`,
      `Supported options:`,
      `<code>txt</code> - Do not render logs.`,
      `<code>txt-onlychat</code> - Show only chat lines, untransformed.`,
      `<code>onlychat</code> - Show only chat lines.`,
      `<code>all</code> - Show all lines, including userstats and join/leave messages.`
    ];
    this.runBroadcast();
    return this.sendReplyBox(strings.join("<br />"));
  },
  sl: "searchlogs",
  logsearch: "searchlogs",
  searchlog: "searchlogs",
  searchlogs(target, room) {
    target = target.trim();
    const args = target.split(",").map((item) => item.trim());
    if (!target) return this.parse("/help searchlogs");
    let date = LogReader.getMonth(LogReader.today());
    const searches = [];
    let limit = "500";
    let targetRoom = room?.roomid;
    for (const arg of args) {
      if (arg.startsWith("room=")) {
        targetRoom = arg.slice(5).trim().toLowerCase();
      } else if (arg.startsWith("limit=")) {
        limit = arg.slice(6);
      } else if (arg.startsWith("date=")) {
        date = arg.slice(5);
      } else if (arg.startsWith("user=")) {
        args.push(`user-${toID(arg.slice(5))}`);
      } else {
        searches.push(arg);
      }
    }
    if (!targetRoom) {
      return this.parse(`/help searchlogs`);
    }
    return this.parse(
      `/join view-chatlog-${targetRoom}--${date}--search-${import_lib.Dashycode.encode(searches.join(","))}--limit-${limit}`
    );
  },
  searchlogshelp() {
    const buffer = `<details class="readmore"><summary><code>/searchlogs [arguments]</code>: searches logs in the current room using the <code>[arguments]</code>.</summary>A room can be specified using the argument <code>room=[roomid]</code>. Defaults to the room it is used in.<br />A limit can be specified using the argument <code>limit=[number less than or equal to 3000]</code>. Defaults to 500.<br />A date can be specified in ISO (YYYY-MM-DD) format using the argument <code>date=[month]</code> (for example, <code>date: 2020-05</code>). Defaults to searching all logs.<br />If you provide a user argument in the form <code>user=username</code>, it will search for messages (that match the other arguments) only from that user.<br />Likewise, <code>user!=username</code> will only result in messages not from that user.<br /><strong>All other arguments will be considered part of the search string</strong>(if more than one argument is specified, it searches for lines containing all terms).<br />Requires: % @ # ~</div>`;
    return this.sendReplyBox(buffer);
  },
  topusers: "linecount",
  roomstats: "linecount",
  linecount(target, room, user) {
    const params = target.split(",").map((f) => f.trim());
    const search = {};
    for (const [i, param] of params.entries()) {
      let [key, val] = param.split("=");
      if (!val) {
        switch (i) {
          case 0:
            val = key;
            key = "room";
            break;
          case 1:
            val = key;
            key = "date";
            break;
          case 2:
            val = key;
            key = "user";
            break;
          default:
            return this.parse(`/help linecount`);
        }
      }
      if (!toID(val)) continue;
      key = key.toLowerCase().replace(/ /g, "");
      switch (key) {
        case "room":
        case "roomid":
          const tarRoom = Rooms.search(val);
          if (!tarRoom && !user.can("bypassall")) {
            throw new Chat.ErrorMessage(`Room '${val}' not found.`);
          }
          search.roomid = tarRoom?.roomid || val.toLowerCase().replace(/[^a-z0-9-]/g, "");
          break;
        case "user":
        case "id":
        case "userid":
          search.user = toID(val);
          break;
        case "date":
        case "month":
        case "time":
          if (!LogReader.isMonth(val)) {
            throw new Chat.ErrorMessage(`Invalid date.`);
          }
          search.date = val;
      }
    }
    if (!search.roomid) {
      if (!room) {
        throw new Chat.ErrorMessage(`If you're not specifying a room, you must use this command in a room.`);
      }
      search.roomid = room.roomid;
    }
    if (!search.date) {
      search.date = LogReader.getMonth();
    }
    return this.parse(`/join view-roomstats-${search.roomid}--${search.date}${search.user ? `--${search.user}` : ""}`);
  },
  linecounthelp() {
    return this.sendReplyBox(
      `<code>/linecount OR /roomstats OR /topusers</code> [<code>key=value</code> formatted parameters] - Searches linecounts with the given parameters.<br /><details class="readmore"><summary><strong>Parameters:</strong></summary>- <code>room</code> (aliases: <code>roomid</code>) - Select a room to search. If no room is given, defaults to current room.<br />- <code>date</code> (aliases: <code>month</code>, <code>time</code>) - Select a month to search linecounts on (requires YYYY-MM format). Defaults to current month.<br />- <code>user</code> (aliases: <code>id</code>, <code>userid</code>) - Searches for linecounts only from a given user. If this is not provided, /linecount instead shows line counts for all users from that month.</details>Parameters may also be specified without a [key]. When using this, arguments are provided in the format <code>/linecount [room], [month], [user].</code>. This does not use any defaults.<br />`
    );
  },
  battlelog(target, room, user) {
    this.checkCan("lock");
    target = target.trim();
    if (!target) throw new Chat.ErrorMessage(`Specify a battle.`);
    if (target.startsWith("http://")) target = target.slice(7);
    if (target.startsWith("https://")) target = target.slice(8);
    if (target.startsWith(`${Config.routes.client}/`)) target = target.slice(Config.routes.client.length + 1);
    if (target.startsWith(`${Config.routes.replays}/`)) target = `battle-${target.slice(Config.routes.replays.length + 1)}`;
    if (target.startsWith("psim.us/")) target = target.slice(8);
    return this.parse(`/join view-battlelog-${target}`);
  },
  battleloghelp: [
    `/battlelog [battle link] - View the log of the given [battle link], even if the replay was not saved.`,
    `Requires: % @ ~`
  ],
  gbc: "getbattlechat",
  async getbattlechat(target, room, user) {
    this.checkCan("lock");
    let [roomName, userName] = import_lib.Utils.splitFirst(target, ",").map((f) => f.trim());
    if (!roomName) {
      if (!room) {
        throw new Chat.ErrorMessage(`If you are not specifying a room, use this command in a room.`);
      }
      roomName = room.roomid;
    }
    if (roomName.startsWith("http://")) roomName = roomName.slice(7);
    if (roomName.startsWith("https://")) roomName = roomName.slice(8);
    if (roomName.startsWith(`${Config.routes.client}/`)) {
      roomName = roomName.slice(Config.routes.client.length + 1);
    }
    if (roomName.startsWith(`${Config.routes.replays}/`)) {
      roomName = `battle-${roomName.slice(Config.routes.replays.length + 1)}`;
    }
    if (roomName.startsWith("psim.us/")) roomName = roomName.slice(8);
    const queryStringStart = roomName.indexOf("?");
    if (queryStringStart > -1) {
      roomName = roomName.slice(0, queryStringStart);
    }
    const roomid = roomName.toLowerCase().replace(/[^a-z0-9-]+/g, "");
    if (!roomid) return this.parse("/help getbattlechat");
    const userid = toID(userName);
    if (userName && !userid) throw new Chat.ErrorMessage(`Invalid username.`);
    if (!roomid.startsWith("battle-")) throw new Chat.ErrorMessage(`You must specify a battle.`);
    const tarRoom = Rooms.get(roomid);
    let log;
    if (tarRoom) {
      log = tarRoom.log.log;
    } else if (Rooms.Replays.db) {
      let battleId = roomid.replace("battle-", "");
      if (battleId.endsWith("pw")) {
        battleId = battleId.slice(0, battleId.lastIndexOf("-", battleId.length - 2));
      }
      const replayData = await Rooms.Replays.get(battleId);
      if (!replayData) {
        throw new Chat.ErrorMessage(`No room or replay found for that battle.`);
      }
      log = replayData.log.split("\n");
    } else {
      try {
        const raw = await (0, import_lib.Net)(`https://${Config.routes.replays}/${roomid.slice("battle-".length)}.json`).get();
        const data = JSON.parse(raw);
        log = data.log ? data.log.split("\n") : [];
      } catch {
        throw new Chat.ErrorMessage(`No room or replay found for that battle.`);
      }
    }
    log = log.filter((l) => l.startsWith("|c|"));
    let buf = "";
    let atLeastOne = false;
    let i = 0;
    for (const line of log) {
      const [, , username, message] = import_lib.Utils.splitFirst(line, "|", 3);
      if (userid && toID(username) !== userid) continue;
      i++;
      buf += import_lib.Utils.html`<div class="chat"><span class="username"><username>${username}:</username></span> ${message}</div>`;
      atLeastOne = true;
    }
    if (i > 20) buf = `<details class="readmore">${buf}</details>`;
    if (!atLeastOne) buf = `<br />None found.`;
    this.runBroadcast();
    return this.sendReplyBox(
      import_lib.Utils.html`<strong>Chat messages in the battle '${roomid}'` + (userid ? `from the user '${userid}'` : "") + `</strong>` + buf
    );
  },
  getbattlechathelp: [
    `/getbattlechat [battle link][, username] - Gets all battle chat logs from the given [battle link].`,
    `If a [username] is given, searches only chat messages from the given username.`,
    `Requires: % @ ~`
  ],
  logsaccess(target, room, user) {
    this.checkCan("rangeban");
    const [type, userid] = target.split(",").map(toID);
    return this.parse(`/j view-logsaccess-${type || "all"}${userid ? `-${userid}` : ""}`);
  },
  logsaccesshelp: [
    `/logsaccess [type], [user] - View chatlog access logs for the given [type] and [user].`,
    `If no arguments are given, shows the entire access log.`,
    `Requires: ~`
  ],
  gcsearch: "groupchatsearch",
  async groupchatsearch(target, room, user) {
    this.checkCan("lock");
    target = target.toLowerCase().replace(/[^a-z0-9-]+/g, "");
    if (!target) return this.parse(`/help groupchatsearch`);
    if (target.length < 3) {
      throw new Chat.ErrorMessage(`Too short of a search term.`);
    }
    const files = await Monitor.logPath(`chat`).readdir();
    const buffer = [];
    for (const roomid of files) {
      if (roomid.startsWith("groupchat-") && roomid.includes(target)) {
        buffer.push(roomid);
      }
    }
    import_lib.Utils.sortBy(buffer, (roomid) => !!Rooms.get(roomid));
    return this.sendReplyBox(
      `Groupchats with a roomid matching '${target}': ` + (buffer.length ? buffer.map((id) => `<a href="/view-chatlog-${id}">${id}</a>`).join("; ") : "None found.")
    );
  },
  groupchatsearchhelp: [
    `/groupchatsearch [target] - Searches for logs of groupchats with names containing the [target]. Requires: % @ ~`
  ],
  roomact: "roomactivity",
  roomactivity(target, room, user) {
    this.checkCan("bypassall");
    const [id, date] = target.split(",").map((i) => i.trim());
    if (id) room = Rooms.search(toID(id));
    if (!room) throw new Chat.ErrorMessage(`Either use this command in the target room or specify a room.`);
    return this.parse(`/join view-roominfo-${room}${date ? `--${date}` : ""}`);
  },
  roomactivityhelp: [
    `/roomactivity [room][, date] - View room activity logs for the given room.`,
    `If a date is provided, it searches for logs from that date. Otherwise, it searches the current month.`,
    `Requires: ~`
  ]
};
//# sourceMappingURL=chatlog.js.map
