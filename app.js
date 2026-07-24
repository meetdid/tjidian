const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const store = require('./routes/store');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'tjidian-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.settings = store.getSettings();
  res.locals.services = store.getServices().sort((a, b) => a.sort - b.sort);
  res.locals.districts = store.getDistricts();
  res.locals.currentUrl = req.path;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

const mainRoutes = require('./routes/main');
const adminRoutes = require('./routes/admin');

app.use('/', mainRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  const settings = store.getSettings();
  res.status(404).render('404', {
    title: '页面不存在 - ' + settings.siteName,
    settings: settings,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`天津机电服务中心网站已启动: http://localhost:${PORT}`);
  console.log(`后台管理入口: http://localhost:${PORT}/admin`);
  console.log(`管理员账号: admin / admin123`);
});
