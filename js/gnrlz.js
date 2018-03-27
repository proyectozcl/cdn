var gbl_gnrlz;
$(function () {
  $('.viewpwd')
    .on('mousedown touchstart', function () { $(this).parent().find('input').prop('type', 'text'); })
    .on('mouseup touchend', function () { $(this).parent().find('input').prop('type', 'password'); });
  $('.spanMsg:not(.abcz)').wrap('<span class="spanMsgWrap"></span>');
  $.ajaxSetup({ contentType: "application/json; charset=utf-8" });
  gbl_gnrlz = true;
  aHashPrev();
});

/* --- */

function aHashPrev() {
  $('a').on('click', function (e) { if ($(this).attr('href') == '#') { e.preventDefault(); } });
}

function clearMsg(idMsg) { $(idMsg ? idMsg : '#spanMsg').not('.msg_fixed').html('&nbsp;').removeClass('inf nce err').fadeTo(0, 1); }
function showMsg(obj) {
  var idMsg = '#spanMsg', msg, cls = 'inf', msDel, fn, spin;
  if (typeof obj === 'string') msg = obj;
  else {
    if (obj.spin != null) spin = obj.spin;
    if (obj.idMsg) idMsg = obj.idMsg;
    if (obj.msDel) msDel = obj.msDel;
    if (obj.cls) cls = obj.cls;
    if (obj.fn) fn = obj.fn;
    msg = obj.msg;
  }

  if ($('#spanMsg').is('.nce, .err')) clearMsg();
  if ((cls == 'inf' && spin != false) || spin) msg += '<i class="fa fa-spinner fa-pulse"></i>';
  $(idMsg).html(msg).removeClass('inf nce err').addClass(cls);
  if (msDel) setTimeout(function () { $(idMsg).fadeTo(500, 0, function () { clearMsg(idMsg); if (fn) fn(); }); }, msDel);
  return false;
}

/* --- */

function valJsonResp(d) {
  if (!valSes(d)) return false;
  if (!valAcc(d)) return false;
  return true;
}
function valSes(d) { return d.ses ? true : showMsg({ msg: d.msg, cls: 'err' }); }
function valAcc(d) { return d.acc ? true : showMsg({ msg: d.msg, cls: 'err' }); }
function valErr(obj) {
  var d = obj.d, msg = d.msg, cls = d.err ? 'err' : obj.fixed ? 'nce fixed' : 'nce', idMsg, msDel, fn, spin;
  if (!d.err && obj.msDel) msDel = obj.msDel;
  if (!d.err && obj.spin) spin = obj.spin;
  if (!d.err && obj.fn) fn = obj.fn;
  if (obj.idMsg) idMsg = obj.idMsg;

  if (obj.idBtnSend) $(obj.idBtnSend).prop('disabled', false);
  if (d.err && d.oResp && d.oResp.idFldErr) focusFldErr(d.oResp.idFldErr);
  showMsg({ msg: msg, cls: cls, idMsg: idMsg, msDel: msDel, fn: fn, spin: spin });
  return d.err;
}
function valErrSrv(e, idBtn, idMsg) {
  if (e.getAllResponseHeaders()) {
    showMsg({ idMsg: idMsg, msg: gbl_strErr, cls: 'err' });
    if (idBtn) $(idBtn).prop('disabled', false);
  }
}

/* --- */

function findInArrObj(arrObj, idKey, idObj) {
  var obj; $.each(arrObj, function () { if (this[idKey] == idObj) { obj = this; return false; } }); return obj;
}
function filterArrObj(arrObj, idKey, arrIdObj) {
  var arr = []; $.each(arrObj, function () { if (isIn(arrIdObj, this[idKey])) arr.push(this); }); return arr;
}
function htmlToText(s) {
  s = s.replace(new RegExp('&amp;', 'g'), '&');
  return s;
}
function strContains(s1, s2) {
  return strNormalize(s1).indexOf(strNormalize(s2)) >= 0 ? true : false;
}
function strMatch(s1, s2) {
  return strNormalize(s1) == strNormalize(s2) ? true : false;
}
function strNormalize(s) {
  s = String(s).toLowerCase();
  s = s.replace(new RegExp('á', 'g'), 'a');
  s = s.replace(new RegExp('é', 'g'), 'e');
  s = s.replace(new RegExp('í', 'g'), 'i');
  s = s.replace(new RegExp('ó', 'g'), 'o');
  s = s.replace(new RegExp('ú', 'g'), 'u');
  return s;
}
function strNorm(s) {
  var s1 = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç';
  var s2 = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc';
  for (var i = 0; i < s1.length; i++) s = s.replace(new RegExp(s1.charAt(i), 'g'), s2.charAt(i));
  return s;
}
function getNomUsr(s1, s2) {
  return strNorm(s1.substr(0, 1) + s2).toLowerCase();
}
function setNomUsr() {
  return $('#txt_nomUsr').val(getNomUsr($('#txt_nomPer').val(), $('#txt_apePat').val()));
}
function strPad(s, p, l) {
  for (var i = 0; i < l; i++) s = String(p) + s;
  return s.substr(s.length - l);
}

/* --- */

function intToStrDate(d, s) {
  d = String(d);
  s = s ? s : '-';
  return d.substr(6, 2) + s + d.substr(4, 2) + s + d.substr(0, 4);
}
function intToDate(obj) {
  var i = obj && obj.i || gbl_date;
  var yyyy = jz.parseInt(jz.left(i, 4)), mm = jz.parseInt(jz.mid(i, 4, 2)), dd = jz.parseInt(jz.right(i, 2));
  if (obj && obj.y) yyyy += obj.y;
  if (obj && obj.m) mm += obj.m;
  if (obj && obj.d) dd += obj.d;
  return new Date(yyyy, mm - 1, dd);
}
function dateToInt(d) {
  return d.getFullYear() + strPad(d.getMonth() + 1, 0, 2) + strPad(d.getDate(), 0, 2);
}
function getDate(d) {
  return jz.right(d, 4) + jz.mid(d, 3, 2) + jz.left(d, 2);
}

/* --- */

function blnToText(v, a) {
  if (!a) a = ['Si', 'No'];
  return v == 1 ? a[0] : a[1];
}
function ifNull(v, n, a) {
  return v == null ? (n == null ? '' : n) : (a == null ? v : a);
}
function isIn(a, v) {
  for (var i in a) if (a[i] == v) return true; return false;
}
function togVal(v, v1, v2) {
  return (v == v1) ? v2 : v1;
}

/* --- */

function getValSpr(nom) {
  $.post('/code/ws_app.asmx/getValSpr', JSON.stringify({ nom: nom }))
  .fail(function (e) { valErrSrv(e); })
  .done(function (d) { getValSpr_clbk(nom, d.d); });
}

var gbl_arrPrm = [];
function getArrPrm(strArr) {
  $.post('/code/ws_app.asmx/getPrmLst', JSON.stringify({ strArr: strArr }))
  .fail(function (e) { valErrSrv(e); })
  .done(function (d) {
    gbl_arrPrm['arr'] = d.d.oResp;
    $.each(d.d.oResp, function () { gbl_arrPrm[this.nomPrm] = this.valPrm; });
    if (typeof getArrPrm_clbk === "function") getArrPrm_clbk();
  });
}

var gbl_AOD = [], gbl_AOD_cnt = 0, gbl_AOD_cnt_clbk = 0;
function getArrObjDataFS(a) { $.each(a, function () { gbl_AOD_cnt++; getObjDataFS(this); }); }
function getObjDataFS(obj) {
  var blnDdl = obj.type != 'arr' ? true : false;
  $.post('/code/ws_app.asmx/ent_sel', JSON.stringify({ ent: obj.ent, ddl: blnDdl, keyPar: obj.keyPar ? obj.keyPar : '' }))
  .fail(function (e) { valErrSrv(e); })
  .done(function (d) {
    gbl_AOD_cnt_clbk++;
    gbl_AOD[obj.name] = d.d.oResp;
    if (obj.type == 'ddl') setDdlFromArr(obj.name, d.d.oResp);
    if (typeof getArrObjDataFS_clbk === "function") getArrObjDataFS_clbk(obj.name);
    if (typeof getArrObjDataFS_clbk_full === "function" && gbl_AOD_cnt == gbl_AOD_cnt_clbk) getArrObjDataFS_clbk_full();
  });
}

function getLstDataFS(obj) {
  if (obj.fnPre) obj.fnPre();
  $.post('/code/ws_app.asmx/ent_sel', JSON.stringify({ ent: obj.ent, ddl: false, keyPar: obj.keyPar ? obj.keyPar : '' }))
  .fail(function (e) { valErrSrv(e); })
  .done(function (d) { obj.fnPst(d.d); });
}

/* --- */

function getQS(s) {
  var arr = location.href.split('?') || null; if (!arr) return;
  if (!jz.instr(arr[1], s + '=')) return; arr = arr[1].split('&');
  var v; $.each(arr, function (i) { if (jz.instr(arr[i], s + '=')) { v = arr[i].split('=')[1]; return false; } }); return v;
}

function cl(s) {
  console.log(s);
}