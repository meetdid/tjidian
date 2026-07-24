const express = require('express');
const router = express.Router();
const store = require('./store');

function requireAuth(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

router.get('/login', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: '后台登录 - 天津机电服务中心',
    error: null,
    layout: false,
  });
});

router.post('/login', (req, res) => {
  const settings = store.getSettings();
  const { username, password } = req.body;
  
  if (username === settings.adminUser && password === settings.adminPass) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', {
      title: '后台登录 - 天津机电服务中心',
      error: '用户名或密码错误',
      layout: false,
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

router.get('/', requireAuth, (req, res) => {
  const settings = store.getSettings();
  const services = store.getServices();
  const cases = store.getCases();
  const articles = store.getArticles();
  const appointments = store.getAppointments();
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  
  res.render('admin/index', {
    title: '管理后台 - 天津机电服务中心',
    settings,
    stats: {
      services: services.length,
      cases: cases.length,
      articles: articles.length,
      appointments: appointments.length,
      pendingAppointments: pendingAppointments.length,
    },
  });
});

// Services management
router.get('/services', requireAuth, (req, res) => {
  const services = store.getServices().sort((a, b) => a.sort - b.sort);
  res.render('admin/services', { title: '服务项目管理', services });
});

router.get('/services/add', requireAuth, (req, res) => {
  res.render('admin/service-form', { title: '添加服务项目', service: null, error: null });
});

router.post('/services/add', requireAuth, (req, res) => {
  const { name, slug, icon, summary, description, content, sort } = req.body;
  if (!name || !slug) {
    return res.render('admin/service-form', { title: '添加服务项目', service: req.body, error: '请填写名称和slug' });
  }
  store.addService({
    name, slug, icon: icon || '', summary: summary || '',
    description: description || '', content: content || '',
    sort: parseInt(sort) || 0,
  });
  res.redirect('/admin/services');
});

router.get('/services/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const service = store.getServices().find(s => s.id === id);
  if (!service) return res.redirect('/admin/services');
  res.render('admin/service-form', { title: '编辑服务项目', service, error: null });
});

router.post('/services/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, slug, icon, summary, description, content, sort } = req.body;
  store.updateService(id, {
    name, slug, icon: icon || '', summary: summary || '',
    description: description || '', content: content || '',
    sort: parseInt(sort) || 0,
  });
  res.redirect('/admin/services');
});

router.post('/services/delete/:id', requireAuth, (req, res) => {
  store.deleteService(parseInt(req.params.id));
  res.redirect('/admin/services');
});

// Cases management
router.get('/cases', requireAuth, (req, res) => {
  const cases = store.getCases();
  res.render('admin/cases', { title: '案例管理', cases });
});

router.get('/cases/add', requireAuth, (req, res) => {
  res.render('admin/case-form', { title: '添加案例', caseItem: null, error: null });
});

router.post('/cases/add', requireAuth, (req, res) => {
  const { title, slug, category, categoryName, deviceType, faultSymptom, repairProcess, result, district, keywords, description } = req.body;
  if (!title || !slug) {
    return res.render('admin/case-form', { title: '添加案例', caseItem: req.body, error: '请填写标题和slug' });
  }
  store.addCase({
    title, slug, category: category || 'plc', categoryName: categoryName || '',
    deviceType: deviceType || '', faultSymptom: faultSymptom || '',
    repairProcess: repairProcess || '', result: result || '',
    image: '', district: district || '', keywords: keywords || '', description: description || '',
  });
  res.redirect('/admin/cases');
});

router.get('/cases/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const caseItem = store.getCases().find(c => c.id === id);
  if (!caseItem) return res.redirect('/admin/cases');
  res.render('admin/case-form', { title: '编辑案例', caseItem, error: null });
});

router.post('/cases/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, slug, category, categoryName, deviceType, faultSymptom, repairProcess, result, district, keywords, description } = req.body;
  store.updateCase(id, {
    title, slug, category: category || 'plc', categoryName: categoryName || '',
    deviceType: deviceType || '', faultSymptom: faultSymptom || '',
    repairProcess: repairProcess || '', result: result || '',
    district: district || '', keywords: keywords || '', description: description || '',
  });
  res.redirect('/admin/cases');
});

router.post('/cases/delete/:id', requireAuth, (req, res) => {
  store.deleteCase(parseInt(req.params.id));
  res.redirect('/admin/cases');
});

// Articles management
router.get('/articles', requireAuth, (req, res) => {
  const articles = store.getArticles();
  res.render('admin/articles', { title: '文章管理', articles });
});

router.get('/articles/add', requireAuth, (req, res) => {
  res.render('admin/article-form', { title: '添加文章', article: null, error: null });
});

router.post('/articles/add', requireAuth, (req, res) => {
  const { title, slug, category, categoryName, summary, content, keywords, description, author } = req.body;
  if (!title || !slug) {
    return res.render('admin/article-form', { title: '添加文章', article: req.body, error: '请填写标题和slug' });
  }
  store.addArticle({
    title, slug, category: category || 'knowledge', categoryName: categoryName || '',
    summary: summary || '', content: content || '',
    keywords: keywords || '', description: description || '',
    author: author || '管理员', views: 0,
  });
  res.redirect('/admin/articles');
});

router.get('/articles/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const article = store.getArticles().find(a => a.id === id);
  if (!article) return res.redirect('/admin/articles');
  res.render('admin/article-form', { title: '编辑文章', article, error: null });
});

router.post('/articles/edit/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, slug, category, categoryName, summary, content, keywords, description, author } = req.body;
  store.updateArticle(id, {
    title, slug, category: category || 'knowledge', categoryName: categoryName || '',
    summary: summary || '', content: content || '',
    keywords: keywords || '', description: description || '',
    author: author || '管理员',
  });
  res.redirect('/admin/articles');
});

router.post('/articles/delete/:id', requireAuth, (req, res) => {
  store.deleteArticle(parseInt(req.params.id));
  res.redirect('/admin/articles');
});

// Appointments management
router.get('/appointments', requireAuth, (req, res) => {
  const status = req.query.status || null;
  const appointments = store.getAppointments(status);
  res.render('admin/appointments', { title: '预约管理', appointments, currentStatus: status });
});

router.post('/appointments/status/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  store.updateAppointment(id, { status: status || 'pending' });
  res.redirect('/admin/appointments');
});

router.post('/appointments/delete/:id', requireAuth, (req, res) => {
  store.deleteAppointment(parseInt(req.params.id));
  res.redirect('/admin/appointments');
});

// Settings management
router.get('/settings', requireAuth, (req, res) => {
  const settings = store.getSettings();
  res.render('admin/settings', { title: '网站设置', settings, error: null, success: null });
});

router.post('/settings', requireAuth, (req, res) => {
  store.updateSettings(req.body);
  res.render('admin/settings', { title: '网站设置', settings: store.getSettings(), error: null, success: '设置保存成功' });
});

module.exports = router;
