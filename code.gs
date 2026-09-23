const ROOT_NAME = 'NOUN';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('NOUN Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ---------- database (a Google Sheet created automatically on first run) ----------
function db_() {
  const props = PropertiesService.getUserProperties();
  const id = props.getProperty('SS_ID');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  const ss = SpreadsheetApp.create('NOUN Tracker Data');
  const courses = ss.getSheets()[0];
  courses.setName('Courses');
  courses.appendRow(['id', 'level', 'semester', 'code', 'title', 'lecturer']);
  ss.insertSheet('Files').appendRow(['id', 'courseId', 'week', 'name', 'fileId', 'url', 'uploaded']);
  props.setProperty('SS_ID', ss.getId());
  return ss;
}

function rows_(name) {
  const v = db_().getSheetByName(name).getDataRange().getValues();
  const head = v.shift();
  return v.map(r => {
    const o = {};
    head.forEach((k, i) => { o[k] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
}

function delRows_(name, col, val) {
  const sh = db_().getSheetByName(name);
  const v = sh.getDataRange().getValues();
  for (let i = v.length - 1; i >= 1; i--) if (v[i][col] === val) sh.deleteRow(i + 1);
}

// ---------- Drive folders: NOUN / 200 Level / 1st Semester / CIT211 ----------
function sub_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function courseFolder_(c) {
  let f = DriveApp.getRootFolder();
  [ROOT_NAME, c.level + ' Level', c.semester, c.code].forEach(n => { f = sub_(f, n); });
  return f;
}

// ---------- API used by the page ----------
function getData() {
  return { courses: rows_('Courses'), files: rows_('Files') };
}

function addCourse(c) {
  const code = String(c.code).toUpperCase().trim();
  if (!code) throw new Error('Course code is required.');
  db_().getSheetByName('Courses').appendRow([
    Utilities.getUuid(), c.level, c.semester, code,
    String(c.title || '').trim(), String(c.lecturer || '').trim()
  ]);
  return getData();
}

function updateLecturer(courseId, lecturer) {
  const sh = db_().getSheetByName('Courses');
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) {
    if (v[i][0] === courseId) { sh.getRange(i + 1, 6).setValue(String(lecturer).trim()); break; }
  }
  return getData();
}

function deleteCourse(courseId) {
  // Removes the course from the tracker only. Files stay safe in Drive.
  delRows_('Courses', 0, courseId);
  delRows_('Files', 1, courseId);
  return getData();
}

function uploadFile(courseId, week, name, mime, base64) {
  const c = rows_('Courses').find(x => x.id === courseId);
  if (!c) throw new Error('Course not found.');
  const bytes = Utilities.base64Decode(base64);
  const clean = c.code + '_Week' + week + '_' + name;
  const file = courseFolder_(c).createFile(Utilities.newBlob(bytes, mime || 'application/octet-stream', clean));
  db_().getSheetByName('Files').appendRow([
    Utilities.getUuid(), courseId, Number(week), clean, file.getId(), file.getUrl(), new Date()
  ]);
  return getData();
}

function deleteFile(rowId) {
  const rec = rows_('Files').find(x => x.id === rowId);
  if (rec) {
    try { DriveApp.getFileById(rec.fileId).setTrashed(true); } catch (e) {}
    delRows_('Files', 0, rowId);
  }
  return getData();
}
