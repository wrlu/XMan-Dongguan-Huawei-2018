var st = require("showdown-table");
var express = require('express');
var fs = require("fs");
var showdown = require('showdown');
var cheerio = require('cheerio');
var moment = require('moment');
var mysort = require('./mysort');

var start_year = 2016;
var converter = new showdown.Converter({
  extension: ['table']
});
var prefix = {
  'TEST': 'This is a test blog system'
};

var filename = Array();
var time = Array();
var type = Array();
var type1 = Array();
var time1 = Array();
var friendlink = Array();
var friendname = Array();
var article_per_page = 10;
var maxpage = 0;

var tagbackground = ['#8B5A2B', '#8B7E66', '#BC8F8F', '#7D9EC0', '#53868B', '#636363', '#CD8162', '#CD3278', '#8FBC8F', '#698B69', '#CD3700', '#EE0000'];

var typelist = ['Web', 'Writeup', 'Language', 'Vulnerable'];
var whole_typelist = [].concat(typelist);
whole_typelist.push('Other');
var keyword = [['php', 'js', 'sql', 'web', 'xss', 'csrf', 'ssrf', 'ctf', 'jsp', '文件上传', 'dns', 'node'], ['writeup', 'ctf', '思路整理'], ['php', 'python', 'perl', 'js', 'java', 'jsp', 'flask', 'selenium', 'API', 'node'], ['漏洞', '分析', 'CVE'], ];

var app = express();

app.set("view engine", 'ejs');　

app.get("/static/(*)",
function(req, res) {
  if (req.path.indexOf("../") >0 ||req.path.indexOf("..%2f") > 0) {
    res.set(prefix);
    res.send("Error！");
    res.end();
  } else {
    res.sendFile(__dirname + req.path);
  }
});

app.get("/article/(*)",
function(req, res) {

  path = req.params[0];
  switch (req.path.split('/')[2]) {
  case "uploads":
    return res.redirect("/" + path);
    break;
  case "static":
    return res.redirect("/" + path);
    break;
  default:
    break;
  }
  res.set(prefix);
  if (!fs.existsSync('uploads/' + path + ".md")) {
    return res.redirect("/404");
  }
  text = fs.readFileSync('uploads/' + path + ".md").toString();
  html = converter.makeHtml(text);
  var $ = cheerio.load(html);
  var len = $('img').length;
  for (var i = 0; i < len; i++) {
    if ($('img').eq(i).attr('src').match(/http[s]{0,1}/g) != null) {
      $('img').eq(i).before("<br>");
      $('img').eq(i).after("<br>");
      $('img').eq(i).attr('style', "max-width:100%;height:auto;");
      $('img').eq(i).attr('data-action', "zoom");
      continue;
    }
    ori = $('img').eq(i).attr('src');
    $('img').eq(i).attr('src', './uploads/' + ori);
    $('img').eq(i).before("<br>");
    $('img').eq(i).after("<br>");
    $('img').eq(i).attr('style', "max-width:100%;height:auto;");
    $('img').eq(i).attr('data-action', "zoom");
  }
  var len = $('p').length;
  for (var i = 0; i < len; i++) {
    $('p').eq(i).attr('style', "max-width:100%;height:auto;")
  }
  var len = $('code').length;
  for (var i = 0; i < len; i++) {
    $('code').eq(i).attr('style', "max-width:100%;height:auto;")
  }
  html = $.html();
  res.render("article.ejs", {
    article: html,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/",
function(req, res) {
  res.set(prefix);
  res.render("start.ejs", {});
});

app.get("/index",
function(req, res) {

  res.set(prefix);
  res.render("index.ejs", {
    filename: filename,
    maxpage: maxpage,
    page: 1,
    time: time,
    type: type,
    tagbackground: tagbackground,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/index/(*)",
function(req, res) {
  res.set(prefix);
  var path = req.params[0];
  switch (req.path.split('/')[2]) {
  case "uploads":
    return res.redirect("/" + path);
    break;
  case "static":
    return res.redirect("/" + path);
    break;
  default:
    break;
  }
  page = parseInt(path);
  if (page > maxpage || page < 1) return res.redirect('/404');
  res.render("index.ejs", {
    filename: filename,
    page: page,
    maxpage: maxpage,
    time: time,
    type: type,
    tagbackground: tagbackground,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/time",
function(req, res) {
  res.set(prefix);
  res.render("time.ejs", {
    filename: filename,
    time: time,
    time1: time1,
    start_year: start_year,
    type: type,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/category",
function(req, res) {
  res.set(prefix);
  res.render("category.ejs", {
    typelist: whole_typelist,
    tagbackground: tagbackground,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/category/(*)",
function(req, res) {
  res.set(prefix);

  var path = req.params[0];
  var param = req.query[0];
  mysort.logs(param,res);
  switch (req.path.split('/')[2]) {
  case "uploads":
    return res.redirect("/" + path);
    break;
  case "static":
    return res.redirect("/" + path);
    break;
  default:
    break;
  }
  if (whole_typelist.indexOf(path) < 0) {
    return res.redirect("/404");
  }
  res.render("category_sub.ejs", {
    current_tag: path,
    typelist: type1[whole_typelist.indexOf(path)],
    filename: filename,
    time: time,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/friendlink",
function(req, res) {
  res.set(prefix);
  res.render("friendlink.ejs", {
    friendlink: friendlink,
    friendname: friendname,
    tagbackground: tagbackground,
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
})

app.get("/uploads/(*)",
function(req, res) {
  res.replace("../","");
  if (req.path.indexOf("images") < 0) {
    res.set(prefix);
    res.send("Error！");
    res.end();
  } else if (req.path.indexOf('\\.md') > 0) {
    res.set(prefix);
    res.send("Error！");
    res.end();
  } else {
    res.set({
      "Content-Type": "images/jpeg"
    });
    text = fs.readFileSync(__dirname + decodeURIComponent(req.path));
    res.send(text);
    res.end();
  }
});

app.get("/about",
function(req, res) {
  res.set(prefix);
  res.render("about.ejs", {
    article_count: filename.length,
    type_count: whole_typelist.length,
  });
});

app.get("/(*)",
function(req, res) {
  res.render('404.ejs');
});
app.use(function(err, req, res, next) {
  if (err) {
    res.status(500);
    try {
      return res.json("error!!! emmm?????");
    } catch(e) {
      console.error('500 set header after send');
    }
  }
});
var server = app.listen(20001, '0.0.0.0',
function() {
  var host = server.address().address;
  var port = server.address().port;
  var dir = fs.readdirSync('./uploads/');
  for (var i = 0; i < dir.length; i++) {
    var tmp = fs.statSync("./uploads/" + dir[i]);
    if (tmp.isFile()) {
      filename.push(dir[i]);
      time.push(tmp['mtime']);
    }
  }

  maxpage = Math.ceil(filename.length / article_per_page);
  var flag = 0;

  for (var i = 0; i < filename.length; i++) {
    var tmp = Array();
    flag = 0;
    for (var j = 0; j < typelist.length; j++) {
      for (var k = 0; k < keyword[j].length; k++) {
        var reg = new RegExp(keyword[j][k], "i");
        if (reg.test(filename[i])) {

          flag = 1;
          tmp.push(typelist[j]);
          break;
        }
      }
    }
    if (flag == 0) {
      tmp.push('Other');
    }
    type.push(tmp);
  }
  mysort.mysort(time, type, filename);
  for (var i = 0; i < whole_typelist.length + 1; i++) {
    type1.push([]);
  }
  for (var i = 0; i < type.length; i++) {

    for (var j = 0; j < type[i].length; j++) {
      type1[whole_typelist.indexOf(type[i][j])].push(filename[i]);
    }
  }

  for (var i = 0; i < filename.length; i++) {
    var tmp_year = time[i].getFullYear() - start_year;
    var tmp_month = time[i].getMonth();
    if (time1[tmp_year] == null) {
      time1[tmp_year] = [];
    }
    if (time1[tmp_year][tmp_month] == null) {
      time1[tmp_year][tmp_month] = [];
    }
    time1[tmp_year][tmp_month].push(filename[i]);

    time[i] = moment(time[i]).format('YYYY-MM-DD HH:mm:ss');
  }

  var text = fs.readFileSync('friendlink.txt').toString().split('\n');

  for (var i = 0; i < text.length - 1; i++) {
    friendname[i] = text[i].split(' ')[0];
    friendlink[i] = text[i].split(' ')[1];
  }

  console.log("Listening: http://%s:%s", host, port);
})
