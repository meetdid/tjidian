const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function getFilePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readData(name) {
  const filePath = getFilePath(name);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

function writeData(name, data) {
  const filePath = getFilePath(name);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(i => i.id)) + 1;
}

const store = {
  // Services
  getServices: () => readData('services'),
  getServiceBySlug: (slug) => readData('services').find(s => s.slug === slug),
  addService: (service) => {
    const items = readData('services');
    service.id = getNextId(items);
    service.createdAt = new Date().toISOString();
    items.push(service);
    writeData('services', items);
    return service;
  },
  updateService: (id, data) => {
    const items = readData('services');
    const idx = items.findIndex(s => s.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    writeData('services', items);
    return items[idx];
  },
  deleteService: (id) => {
    const items = readData('services');
    const filtered = items.filter(s => s.id !== id);
    writeData('services', filtered);
    return filtered.length !== items.length;
  },

  // Cases
  getCases: (category = null, limit = null) => {
    let items = readData('cases');
    if (category) {
      items = items.filter(c => c.category === category);
    }
    items = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (limit) items = items.slice(0, limit);
    return items;
  },
  getCaseBySlug: (slug) => readData('cases').find(c => c.slug === slug),
  addCase: (item) => {
    const items = readData('cases');
    item.id = getNextId(items);
    item.createdAt = new Date().toISOString();
    items.push(item);
    writeData('cases', items);
    return item;
  },
  updateCase: (id, data) => {
    const items = readData('cases');
    const idx = items.findIndex(s => s.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    writeData('cases', items);
    return items[idx];
  },
  deleteCase: (id) => {
    const items = readData('cases');
    const filtered = items.filter(s => s.id !== id);
    writeData('cases', filtered);
    return filtered.length !== items.length;
  },

  // Articles / News
  getArticles: (category = null, limit = null) => {
    let items = readData('articles');
    if (category) {
      items = items.filter(a => a.category === category);
    }
    items = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (limit) items = items.slice(0, limit);
    return items;
  },
  getArticleBySlug: (slug) => readData('articles').find(a => a.slug === slug),
  addArticle: (item) => {
    const items = readData('articles');
    item.id = getNextId(items);
    item.createdAt = new Date().toISOString();
    items.push(item);
    writeData('articles', items);
    return item;
  },
  updateArticle: (id, data) => {
    const items = readData('articles');
    const idx = items.findIndex(s => s.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    writeData('articles', items);
    return items[idx];
  },
  deleteArticle: (id) => {
    const items = readData('articles');
    const filtered = items.filter(s => s.id !== id);
    writeData('articles', filtered);
    return filtered.length !== items.length;
  },

  // Appointments / Bookings
  getAppointments: (status = null) => {
    let items = readData('appointments');
    if (status) {
      items = items.filter(a => a.status === status);
    }
    items = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  },
  addAppointment: (item) => {
    const items = readData('appointments');
    item.id = getNextId(items);
    item.createdAt = new Date().toISOString();
    item.status = 'pending';
    items.push(item);
    writeData('appointments', items);
    return item;
  },
  updateAppointment: (id, data) => {
    const items = readData('appointments');
    const idx = items.findIndex(s => s.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    writeData('appointments', items);
    return items[idx];
  },
  deleteAppointment: (id) => {
    const items = readData('appointments');
    const filtered = items.filter(s => s.id !== id);
    writeData('appointments', filtered);
    return filtered.length !== items.length;
  },

  // Site settings / contact info
  getSettings: () => {
    const data = readData('settings');
    if (data.length === 0) return defaultSettings;
    return data[0];
  },
  updateSettings: (data) => {
    const items = readData('settings');
    if (items.length === 0) {
      data.id = 1;
      items.push(data);
    } else {
      items[0] = { ...items[0], ...data, updatedAt: new Date().toISOString() };
    }
    writeData('settings', items);
    return items[0];
  },

  // Districts
  getDistricts: () => readData('districts'),
  getDistrictBySlug: (slug) => readData('districts').find(d => d.slug === slug),
};

const defaultSettings = {
  siteName: '天津机电服务中心',
  siteTitle: '天津机电维修_工业设备维修_PLC维修_变频器维修 - 天津机电服务中心',
  siteKeywords: '天津机电维修,天津设备维修,天津PLC维修,天津变频器维修,天津电机维修,天津自动化维修',
  siteDescription: '天津机电服务中心专注天津地区工业设备维修，提供PLC维修、变频器维修、电机维修、伺服维修、自动化设备维修等服务，快速响应，专业可靠。',
  phone: '138-0000-0000',
  phoneShort: '13800000000',
  wechat: 'tjidian888',
  address: '天津市西青区经济技术开发区',
  email: 'service@tjidian.com',
  workTime: '周一至周日 8:00-20:00',
  adminUser: 'admin',
  adminPass: 'admin123',
  bannerTitle: '天津机电维修服务中心',
  bannerSubtitle: '工业设备维修｜自动化维修｜PLC维修｜变频器维修｜电机维修',
  bannerDesc: '专注天津地区工业设备故障处理，为企业提供快速、专业、可靠的维修服务。',
};

module.exports = store;
