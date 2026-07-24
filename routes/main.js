const express = require('express');
const router = express.Router();
const store = require('./store');

router.get('/test', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试页面</title>
</head>
<body>
  <h1 style="color:red;font-size:48px;padding:50px;">测试页面 - 天津机电服务中心</h1>
  <p style="font-size:24px;padding:0 50px;">如果你能看到这段文字，说明服务器运行正常。</p>
</body>
</html>`);
});

router.get('/', (req, res) => {
  const settings = store.getSettings();
  const services = store.getServices().sort((a, b) => a.sort - b.sort);
  const cases = store.getCases(null, 6);
  const articles = store.getArticles(null, 6);
  const districts = store.getDistricts();
  
  res.render('index', {
    title: settings.siteTitle,
    keywords: settings.siteKeywords,
    description: settings.siteDescription,
    settings: settings,
    services: services,
    cases: cases,
    articles: articles,
    districts: districts,
    breadcrumb: null,
  });
});

router.get('/services', (req, res) => {
  const settings = store.getSettings();
  const services = store.getServices().sort((a, b) => a.sort - b.sort);
  
  res.render('services', {
    title: '维修项目 - ' + settings.siteName,
    keywords: '天津机电维修项目,工业设备维修服务,PLC维修,变频器维修',
    description: '天津机电服务中心提供PLC维修、变频器维修、电机维修、伺服维修、自动化设备维修等专业服务。',
    settings: settings,
    services: services,
    breadcrumb: [{ name: '首页', url: '/' }, { name: '维修项目', url: '/services' }],
  });
});

router.get('/service/:slug', (req, res) => {
  const settings = store.getSettings();
  const service = store.getServiceBySlug(req.params.slug);
  if (!service) {
    return res.status(404).render('404', { title: '页面不存在 - ' + settings.siteName, settings });
  }
  const relatedCases = store.getCases(null, 4);
  
  res.render('service-detail', {
    title: service.name + ' - ' + settings.siteName,
    keywords: service.name + ',' + settings.siteKeywords,
    description: service.summary,
    settings: settings,
    service: service,
    relatedCases: relatedCases,
    breadcrumb: [
      { name: '首页', url: '/' },
      { name: '维修项目', url: '/services' },
      { name: service.name, url: '/service/' + service.slug },
    ],
  });
});

router.get('/cases', (req, res) => {
  const settings = store.getSettings();
  const category = req.query.category || null;
  const cases = store.getCases(category);
  const categories = [
    { key: 'plc', name: 'PLC维修案例' },
    { key: 'inverter', name: '变频器维修案例' },
    { key: 'motor', name: '电机维修案例' },
    { key: 'servo', name: '伺服维修案例' },
    { key: 'auto', name: '自动化维修案例' },
    { key: 'cnc', name: '数控维修案例' },
  ];
  
  res.render('cases', {
    title: '维修案例 - ' + settings.siteName,
    keywords: '天津机电维修案例,设备维修案例,PLC维修案例,变频器维修案例',
    description: '天津机电服务中心维修案例展示，包括PLC维修、变频器维修、电机维修等各类工业设备维修案例。',
    settings: settings,
    cases: cases,
    categories: categories,
    currentCategory: category,
    breadcrumb: [{ name: '首页', url: '/' }, { name: '维修案例', url: '/cases' }],
  });
});

router.get('/case/:slug', (req, res) => {
  const settings = store.getSettings();
  const caseItem = store.getCaseBySlug(req.params.slug);
  if (!caseItem) {
    return res.status(404).render('404', { title: '页面不存在 - ' + settings.siteName, settings });
  }
  const relatedCases = store.getCases(caseItem.category, 4).filter(c => c.id !== caseItem.id);
  
  res.render('case-detail', {
    title: caseItem.title + ' - ' + settings.siteName,
    keywords: caseItem.keywords,
    description: caseItem.description,
    settings: settings,
    caseItem: caseItem,
    relatedCases: relatedCases,
    breadcrumb: [
      { name: '首页', url: '/' },
      { name: '维修案例', url: '/cases' },
      { name: caseItem.categoryName, url: '/cases?category=' + caseItem.category },
      { name: caseItem.title, url: '/case/' + caseItem.slug },
    ],
  });
});

router.get('/news', (req, res) => {
  const settings = store.getSettings();
  const category = req.query.category || null;
  const articles = store.getArticles(category);
  const categories = [
    { key: 'knowledge', name: '维修知识' },
    { key: 'fault', name: '设备故障' },
    { key: 'tech', name: '行业技术' },
    { key: 'case', name: '维修案例' },
  ];
  
  res.render('news', {
    title: '行业资讯 - ' + settings.siteName,
    keywords: '天津机电维修资讯,工业设备维修知识,设备故障处理',
    description: '天津机电服务中心行业资讯，分享工业设备维修知识、设备故障处理方法、行业技术动态。',
    settings: settings,
    articles: articles,
    categories: categories,
    currentCategory: category,
    breadcrumb: [{ name: '首页', url: '/' }, { name: '行业资讯', url: '/news' }],
  });
});

router.get('/news/:slug', (req, res) => {
  const settings = store.getSettings();
  const article = store.getArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).render('404', { title: '页面不存在 - ' + settings.siteName, settings });
  }
  const relatedArticles = store.getArticles(article.category, 5).filter(a => a.id !== article.id);
  
  res.render('news-detail', {
    title: article.title + ' - ' + settings.siteName,
    keywords: article.keywords,
    description: article.description,
    settings: settings,
    article: article,
    relatedArticles: relatedArticles,
    breadcrumb: [
      { name: '首页', url: '/' },
      { name: '行业资讯', url: '/news' },
      { name: article.categoryName, url: '/news?category=' + article.category },
      { name: article.title, url: '/news/' + article.slug },
    ],
  });
});

router.get('/district/:slug', (req, res) => {
  const settings = store.getSettings();
  const district = store.getDistrictBySlug(req.params.slug);
  if (!district) {
    return res.status(404).render('404', { title: '页面不存在 - ' + settings.siteName, settings });
  }
  const services = store.getServices().sort((a, b) => a.sort - b.sort);
  const cases = store.getCases(null, 6);
  
  const pageTitle = `天津${district.name}机电维修_${district.name}设备维修_PLC维修 - ${settings.siteName}`;
  const pageKeywords = `天津${district.name}机电维修,${district.name}设备维修,${district.name}PLC维修,${district.name}变频器维修`;
  const pageDescription = `天津机电服务中心覆盖${district.name}，提供${district.name}工业设备维修、PLC维修、变频器维修、电机维修等服务，快速上门，专业可靠。`;
  
  res.render('district', {
    title: pageTitle,
    keywords: pageKeywords,
    description: pageDescription,
    settings: settings,
    district: district,
    services: services,
    cases: cases,
    breadcrumb: [
      { name: '首页', url: '/' },
      { name: '服务区域', url: '/#area' },
      { name: district.name, url: '/district/' + district.slug },
    ],
  });
});

router.get('/about', (req, res) => {
  const settings = store.getSettings();
  
  res.render('about', {
    title: '关于我们 - ' + settings.siteName,
    keywords: '关于天津机电服务中心,天津机电维修公司介绍',
    description: '天津机电服务中心专注天津地区工业设备维修，拥有专业维修团队和丰富经验，为企业提供快速、专业、可靠的维修服务。',
    settings: settings,
    breadcrumb: [{ name: '首页', url: '/' }, { name: '关于我们', url: '/about' }],
  });
});

router.get('/contact', (req, res) => {
  const settings = store.getSettings();
  
  res.render('contact', {
    title: '联系我们 - ' + settings.siteName,
    keywords: '联系天津机电服务中心,天津机电维修电话,维修预约',
    description: '联系天津机电服务中心，维修服务热线，微信预约，在线留言，我们将尽快为您服务。',
    settings: settings,
    success: req.query.success || null,
    breadcrumb: [{ name: '首页', url: '/' }, { name: '联系我们', url: '/contact' }],
  });
});

router.post('/appointment', (req, res) => {
  const { name, phone, company, serviceType, description } = req.body;
  if (!name || !phone) {
    return res.json({ success: false, message: '请填写姓名和电话' });
  }
  
  store.addAppointment({
    name,
    phone,
    company: company || '',
    serviceType: serviceType || '',
    description: description || '',
    source: req.headers.referer || '网站',
  });
  
  res.json({ success: true, message: '预约提交成功，我们会尽快与您联系！' });
});

router.get('/sitemap.xml', (req, res) => {
  const settings = store.getSettings();
  const services = store.getServices();
  const cases = store.getCases();
  const articles = store.getArticles();
  const districts = store.getDistricts();
  const baseUrl = 'https://www.tjidian.com';
  
  let urls = [
    { loc: baseUrl + '/', priority: '1.0', changefreq: 'daily' },
    { loc: baseUrl + '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: baseUrl + '/cases', priority: '0.9', changefreq: 'weekly' },
    { loc: baseUrl + '/news', priority: '0.9', changefreq: 'daily' },
    { loc: baseUrl + '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: baseUrl + '/contact', priority: '0.8', changefreq: 'monthly' },
  ];
  
  services.forEach(s => {
    urls.push({ loc: baseUrl + '/service/' + s.slug, priority: '0.8', changefreq: 'weekly' });
  });
  
  cases.forEach(c => {
    urls.push({ loc: baseUrl + '/case/' + c.slug, priority: '0.7', changefreq: 'monthly' });
  });
  
  articles.forEach(a => {
    urls.push({ loc: baseUrl + '/news/' + a.slug, priority: '0.8', changefreq: 'weekly' });
  });
  
  districts.forEach(d => {
    urls.push({ loc: baseUrl + '/district/' + d.slug, priority: '0.6', changefreq: 'monthly' });
  });
  
  res.setHeader('Content-Type', 'application/xml');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach(u => {
    xml += '  <url>\n';
    xml += '    <loc>' + u.loc + '</loc>\n';
    xml += '    <priority>' + u.priority + '</priority>\n';
    xml += '    <changefreq>' + u.changefreq + '</changefreq>\n';
    xml += '  </url>\n';
  });
  xml += '</urlset>';
  res.send(xml);
});

router.get('/robots.txt', (req, res) => {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://www.tjidian.com/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
});

module.exports = router;
