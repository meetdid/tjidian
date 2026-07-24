const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Services
const services = [
  {
    id: 1,
    name: 'PLC维修',
    slug: 'plc-weixiu',
    icon: 'plc',
    summary: 'PLC故障检测、程序恢复、模块维修。',
    description: '专业维修西门子、三菱、欧姆龙、AB等品牌PLC。涵盖CPU模块、IO模块、电源模块、通讯模块等故障维修。支持程序备份与恢复、程序解密、程序修改等服务。',
    content: `<h2>PLC维修服务范围</h2>
<p>我们提供全系列PLC维修服务，包括但不限于以下品牌和类型：</p>
<h3>西门子PLC维修</h3>
<ul>
<li>S7-200/S7-200SMART系列</li>
<li>S7-300/S7-400系列</li>
<li>S7-1200/S7-1500系列</li>
<li>LOGO!系列</li>
</ul>
<h3>三菱PLC维修</h3>
<ul>
<li>FX系列（FX3U/FX3G/FX5U等）</li>
<li>Q系列/QnA系列</li>
<li>L系列</li>
</ul>
<h3>常见故障</h3>
<ul>
<li>电源指示灯不亮、无法开机</li>
<li>程序丢失、无法下载程序</li>
<li>IO点损坏、输入输出无响应</li>
<li>通讯故障、无法联网</li>
<li>指示灯闪烁、报错代码</li>
</ul>`,
    sort: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: '变频器维修',
    slug: 'bianpinqi-weixiu',
    icon: 'inverter',
    summary: '各种品牌变频器故障处理。',
    description: '专业维修西门子、ABB、施耐德、台达、汇川等品牌变频器。覆盖通用型、风机水泵型、注塑机专用等各类型变频器维修。',
    content: `<h2>变频器维修服务</h2>
<p>我们拥有专业的变频器维修检测设备，可快速定位故障并修复。</p>
<h3>维修品牌</h3>
<ul>
<li>西门子变频器（MM440/430/420，G120，G130等）</li>
<li>ABB变频器（ACS510/550/800/880等）</li>
<li>施耐德变频器（ATV312/ATV61/ATV71等）</li>
<li>台达/汇川/英威腾/森兰等国产品牌</li>
</ul>
<h3>常见故障</h3>
<ul>
<li>过流、过压、欠压、过热报警</li>
<li>无显示、烧保险丝</li>
<li>输出电压不平衡</li>
<li>电机抖动、无法启动</li>
<li>通讯故障</li>
</ul>`,
    sort: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: '电机维修',
    slug: 'dianji-weixiu',
    icon: 'motor',
    summary: '工业电机检测、维修、更换。',
    description: '三相异步电机、伺服电机、步进电机、直流电机等各类工业电机专业维修。提供绕组重绕、轴承更换、转子修复、动平衡校正等服务。',
    content: `<h2>电机维修服务</h2>
<p>专业维修各类工业电机，拥有多年电机维修经验。</p>
<h3>维修类型</h3>
<ul>
<li>三相异步电动机维修</li>
<li>伺服电机维修</li>
<li>步进电机维修</li>
<li>直流电机维修</li>
<li>减速电机维修</li>
</ul>
<h3>服务内容</h3>
<ul>
<li>电机绕组重绕</li>
<li>轴承更换</li>
<li>转子修复</li>
<li>电机动平衡校正</li>
<li>绝缘处理</li>
<li>电机更换选型</li>
</ul>`,
    sort: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: '伺服维修',
    slug: 'sifu-weixiu',
    icon: 'servo',
    summary: '伺服驱动器、伺服电机维修。',
    description: '专业维修安川、松下、三菱、台达、汇川等品牌伺服驱动器和伺服电机。提供编码器更换、磁钢修复、绕组重绕等服务。',
    content: `<h2>伺服系统维修</h2>
<p>专业维修各类品牌伺服驱动器和伺服电机。</p>
<h3>维修品牌</h3>
<ul>
<li>安川伺服（∑-7/∑-5/∑-V等系列）</li>
<li>松下伺服（A5/A6/MHMF等系列）</li>
<li>三菱伺服（MR-JE/MR-J4/MR-J3等）</li>
<li>台达/汇川等国产伺服</li>
</ul>
<h3>常见故障</h3>
<ul>
<li>伺服报警（过流、过压、过载、编码器异常等）</li>
<li>伺服电机抖动、定位不准</li>
<li>编码器损坏、报警</li>
<li>磁钢退磁、转子异响</li>
</ul>`,
    sort: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: '配电柜维修',
    slug: 'peidiangui-weixiu',
    icon: 'panel',
    summary: '控制柜、电气线路故障处理。',
    description: '专业维修各类配电柜、控制柜、电气箱。提供线路检修、元器件更换、柜内改造、故障排查等服务。',
    content: `<h2>配电柜维修服务</h2>
<p>提供各类工业配电柜、控制柜的维修和改造服务。</p>
<h3>服务内容</h3>
<ul>
<li>配电柜故障排查与维修</li>
<li>电气线路检修与改造</li>
<li>接触器/断路器/继电器更换</li>
<li>PLC控制柜维修</li>
<li>变频控制柜维修</li>
<li>配电柜除尘与维护</li>
</ul>`,
    sort: 5,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    name: '空压机维修',
    slug: 'kongyaji-weixiu',
    icon: 'compressor',
    summary: '工业空压设备维护。',
    description: '螺杆式空压机、活塞式空压机专业维修保养。提供机头大修、保养、故障维修等服务。',
    content: `<h2>空压机维修保养</h2>
<p>专业维修各类工业空压机，提供定期保养服务。</p>
<h3>维修类型</h3>
<ul>
<li>螺杆式空压机维修</li>
<li>活塞式空压机维修</li>
<li>空压机保养</li>
<li>空压机主机大修</li>
</ul>
<h3>常见故障</h3>
<ul>
<li>空压机不启动、跳机</li>
<li>排气量不足、压力上不去</li>
<li>油温过高、高温报警</li>
<li>异响、振动大</li>
</ul>`,
    sort: 6,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 7,
    name: '水泵维修',
    slug: 'shuibeng-weixiu',
    icon: 'pump',
    summary: '工业水泵、电机故障维修。',
    description: '离心泵、潜水泵、管道泵等各类工业水泵维修。提供机械密封更换、叶轮修复、电机维修等服务。',
    content: `<h2>水泵维修服务</h2>
<p>专业维修各类工业水泵及配套电机。</p>
<h3>维修类型</h3>
<ul>
<li>离心泵维修</li>
<li>潜水泵维修</li>
<li>管道泵维修</li>
<li>真空泵维修</li>
<li>污水泵维修</li>
</ul>
<h3>常见故障</h3>
<ul>
<li>水泵不出水、流量不足</li>
<li>电机烧坏、漏电跳闸</li>
<li>机械密封漏水</li>
<li>异响振动大</li>
</ul>`,
    sort: 7,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 8,
    name: '自动化设备维修',
    slug: 'zidonghua-weixiu',
    icon: 'auto',
    summary: '生产线设备故障处理。',
    description: '自动化生产线、流水线、机械手、非标自动化设备等维修。提供设备改造、程序修改、工艺优化等服务。',
    content: `<h2>自动化设备维修</h2>
<p>提供各类自动化生产线和设备的维修改造服务。</p>
<h3>维修范围</h3>
<ul>
<li>自动化生产线维修</li>
<li>流水线设备维修</li>
<li>工业机械手维修</li>
<li>非标自动化设备维修</li>
<li>包装设备维修</li>
</ul>
<h3>服务内容</h3>
<ul>
<li>设备故障维修</li>
<li>设备程序修改</li>
<li>设备升级改造</li>
<li>设备保养维护</li>
<li>工艺优化</li>
</ul>`,
    sort: 8,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 9,
    name: '数控设备维修',
    slug: 'shukong-weixiu',
    icon: 'cnc',
    summary: '数控机床、电气系统维修。',
    description: '数控机床、加工中心、数控车床等设备维修。提供系统维修、伺服维修、主轴维修、机床改造等服务。',
    content: `<h2>数控设备维修</h2>
<p>专业维修各类数控机床和加工中心。</p>
<h3>维修类型</h3>
<ul>
<li>数控车床维修</li>
<li>加工中心维修</li>
<li>数控铣床维修</li>
<li>数控磨床维修</li>
<li>电火花/线切割维修</li>
</ul>
<h3>维修内容</h3>
<ul>
<li>数控系统维修（发那科/西门子/三菱等）</li>
<li>伺服驱动器/伺服电机维修</li>
<li>主轴维修</li>
<li>机床电气线路维修</li>
<li>机床精度恢复</li>
</ul>`,
    sort: 9,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Cases
const cases = [
  {
    id: 1,
    title: '天津某汽车零部件厂西门子S7-300 PLC维修',
    slug: 'tianjin-qiche-lingjianchang-s7300-plc-weixiu',
    category: 'plc',
    categoryName: 'PLC维修案例',
    deviceType: '西门子S7-300 PLC',
    faultSymptom: 'PLC突然停机，SF指示灯亮红灯，无法与上位机通讯，生产线停摆。',
    repairProcess: '工程师现场检测，发现CPU模块SF灯亮，诊断缓冲区报IO错误。逐一排查后发现一块32点数字量输入模块烧毁。更换备用模块并重新下载程序后恢复正常。',
    result: '4小时内完成维修，生产线恢复运行，为客户避免了巨额停产损失。',
    image: '',
    district: '西青区',
    keywords: '西门子PLC维修,天津PLC维修,S7-300维修',
    description: '天津西青区某汽车零部件厂西门子S7-300 PLC故障维修案例，4小时快速修复生产线。',
    createdAt: '2024-03-15T00:00:00.000Z',
  },
  {
    id: 2,
    title: '天津某印刷厂ABB变频器过热报警维修',
    slug: 'tianjin-yinshuachang-abb-bianpinqi-guore-weixiu',
    category: 'inverter',
    categoryName: '变频器维修案例',
    deviceType: 'ABB ACS510 75kW变频器',
    faultSymptom: '变频器运行中频繁报过热故障，停机冷却后可再运行一段时间，但故障反复出现。',
    repairProcess: '拆机检查发现散热片积尘严重，散热风扇转速变慢。清理散热片灰尘，更换散热风扇，检测驱动板和IGBT正常，装机测试运行稳定。',
    result: '变频器恢复正常运行，过热报警消除，建议客户每季度清理一次散热片。',
    image: '',
    district: '东丽区',
    keywords: 'ABB变频器维修,天津变频器维修,ACS510维修',
    description: '天津东丽区某印刷厂ABB ACS510变频器过热报警维修案例。',
    createdAt: '2024-04-20T00:00:00.000Z',
  },
  {
    id: 3,
    title: '天津某食品厂55kW三相电机烧毁维修',
    slug: 'tianjin-shipinchang-dianji-shaohui-weixiu',
    category: 'motor',
    categoryName: '电机维修案例',
    deviceType: '55kW三相异步电动机',
    faultSymptom: '电机突然跳闸，无法启动，有焦糊味，绝缘电阻接近零。',
    repairProcess: '拆解电机检测，发现定子绕组烧毁严重。对定子进行绕组重绕，更换前后轴承，做动平衡校正，浸漆烘干后装机测试。',
    result: '电机修复完成，各项参数检测合格，运行平稳，振动噪音正常。',
    image: '',
    district: '津南区',
    keywords: '电机维修,天津电机维修,三相电机绕组重绕',
    description: '天津津南区某食品厂55kW三相电机烧毁维修，绕组重绕修复。',
    createdAt: '2024-05-10T00:00:00.000Z',
  },
  {
    id: 4,
    title: '天津某电子厂松下伺服报警编码器故障维修',
    slug: 'tianjin-dianzichang-songxia-sifu-bianmaqi-weixiu',
    category: 'servo',
    categoryName: '伺服维修案例',
    deviceType: '松下A6 2kW伺服电机',
    faultSymptom: '伺服驱动器报编码器异常，电机无法启动，设备停机。',
    repairProcess: '检测确认伺服电机编码器损坏。更换同型号编码器，调试零点，驱动器试运行正常。',
    result: '伺服系统恢复正常运行，定位精度符合要求。',
    image: '',
    district: '滨海新区',
    keywords: '松下伺服维修,天津伺服维修,编码器故障',
    description: '天津滨海新区某电子厂松下伺服电机编码器故障维修案例。',
    createdAt: '2024-06-05T00:00:00.000Z',
  },
  {
    id: 5,
    title: '天津某机械加工厂数控车床系统故障维修',
    slug: 'tianjin-jixiejiagongchang-shukongchechuang-weixiu',
    category: 'cnc',
    categoryName: '数控维修案例',
    deviceType: '发那科0i-TF数控车床',
    faultSymptom: '数控系统开机黑屏，无显示，无法进入系统。',
    repairProcess: '检测发现系统电源模块损坏，主板供电异常。更换电源模块，重新启动系统，恢复系统参数。',
    result: '数控系统恢复正常，机床加工精度检测合格。',
    image: '',
    district: '北辰区',
    keywords: '数控维修,天津数控维修,发那科系统维修',
    description: '天津北辰区某机械加工厂发那科数控车床系统故障维修。',
    createdAt: '2024-07-12T00:00:00.000Z',
  },
  {
    id: 6,
    title: '天津某制药厂自动化生产线故障维修',
    slug: 'tianjin-zhiyaochang-zidonghua-shengchanxian-weixiu',
    category: 'auto',
    categoryName: '自动化维修案例',
    deviceType: '药品包装自动化生产线',
    faultSymptom: '生产线输送线突然停止，触摸屏报警，包装工序中断。',
    repairProcess: '现场排查发现输送电机变频器通讯中断，PLC与变频器之间的PROFINET通讯模块故障。更换通讯模块，重新配置网络参数后恢复。',
    result: '2小时内修复生产线，避免了整批药品报废损失。',
    image: '',
    district: '武清区',
    keywords: '自动化维修,天津自动化维修,生产线维修',
    description: '天津武清区某制药厂自动化包装生产线故障维修案例。',
    createdAt: '2024-08-20T00:00:00.000Z',
  },
];

// Articles
const articles = [
  {
    id: 1,
    title: '天津PLC维修多少钱？影响PLC维修价格的因素分析',
    slug: 'tianjin-plc-weixiu-duoshaoqian',
    category: 'knowledge',
    categoryName: '维修知识',
    summary: '很多天津工厂客户咨询PLC维修多少钱。本文从故障类型、品牌型号、维修难度等方面详细分析PLC维修价格的影响因素。',
    content: `<h2>天津PLC维修多少钱？</h2>
<p>很多天津地区的工厂设备管理人员在PLC出现故障时，都会问一个问题：PLC维修多少钱？其实，PLC维修的价格受多个因素影响，下面我们来详细分析。</p>
<h3>1. 品牌和型号</h3>
<p>不同品牌的PLC维修价格差异较大。一般来说，进口品牌（西门子、三菱、AB等）的维修费用高于国产品牌；高端大型PLC的维修费用高于小型PLC。</p>
<h3>2. 故障类型</h3>
<ul>
<li><strong>电源故障</strong>：相对简单，费用较低</li>
<li><strong>IO模块损坏</strong>：更换元器件，费用中等</li>
<li><strong>CPU故障</strong>：难度大，费用较高</li>
<li><strong>通讯故障</strong>：视情况而定</li>
<li><strong>程序问题</strong>：需要恢复程序或重新编程</li>
</ul>
<h3>3. 是否上门服务</h3>
<p>上门维修需要支付工程师上门费用和差旅费。送修相对便宜一些。对于天津本地客户，我们提供快速上门服务。</p>
<h3>4. 紧急程度</h3>
<p>普通维修按正常流程，费用较低。加急维修需要工程师加班处理，会有加急费用。</p>
<h3>总结建议</h3>
<p>建议客户在咨询时提供PLC品牌型号、故障现象等详细信息，我们可以给出更准确的报价。天津机电服务中心提供透明合理的报价，先检测后报价，客户同意再维修。</p>`,
    keywords: '天津PLC维修多少钱,PLC维修价格,天津PLC维修',
    description: '详细分析天津PLC维修价格的影响因素，帮助客户了解PLC维修费用构成。',
    author: '天津机电服务中心',
    views: 1256,
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: '变频器故障原因分析及常见故障处理方法',
    slug: 'bianpinqi-guzhang-yuanyin-fenxi',
    category: 'fault',
    categoryName: '设备故障',
    summary: '变频器是工业生产中常用的设备，但也经常出现各种故障。本文总结了变频器常见故障的原因和处理方法。',
    content: `<h2>变频器常见故障原因分析</h2>
<p>变频器在工业生产中应用广泛，由于运行环境复杂，经常会出现各种故障。了解常见故障原因有助于快速排查问题。</p>
<h3>1. 过流故障（OC）</h3>
<p><strong>原因：</strong></p>
<ul>
<li>负载侧短路</li>
<li>电机绝缘损坏</li>
<li>加速时间设置过短</li>
<li>变频器功率选型过小</li>
<li>IGBT模块损坏</li>
</ul>
<p><strong>处理：</strong>检查负载、电机绝缘、调整加速时间、更换大功率变频器。</p>
<h3>2. 过压故障（OV）</h3>
<p><strong>原因：</strong></p>
<ul>
<li>电网电压过高</li>
<li>减速时间过短</li>
<li>负载惯量过大</li>
<li>制动电阻配置不当</li>
</ul>
<p><strong>处理：</strong>检查电网电压、延长减速时间、配置制动单元和制动电阻。</p>
<h3>3. 过热故障（OH）</h3>
<p><strong>原因：</strong></p>
<ul>
<li>散热风扇损坏</li>
<li>散热片积尘严重</li>
<li>环境温度过高</li>
<li>过载运行</li>
</ul>
<p><strong>处理：</strong>更换风扇、清理散热片、改善通风条件、检查负载情况。</p>
<h3>4. 欠压故障（UV）</h3>
<p><strong>原因：</strong></p>
<ul>
<li>电网电压过低</li>
<li>输入缺相</li>
<li>整流桥损坏</li>
<li>滤波电容老化</li>
</ul>
<p><strong>处理：</strong>检查电网电压、检查输入电源、检测整流桥和电容。</p>`,
    keywords: '变频器故障,变频器维修,过流过压故障',
    description: '变频器常见故障原因分析及处理方法，包括过流、过压、过热、欠压等故障。',
    author: '天津机电服务中心',
    views: 986,
    createdAt: '2024-04-10T00:00:00.000Z',
  },
  {
    id: 3,
    title: '电机烧毁如何判断？电机烧坏的原因和预防措施',
    slug: 'dianji-shaohui-zheme-panduan',
    category: 'knowledge',
    categoryName: '维修知识',
    summary: '电机烧毁是工业生产中常见故障。本文教您如何判断电机是否烧毁，分析电机烧毁的常见原因，并给出预防措施。',
    content: `<h2>电机烧毁如何判断？</h2>
<p>电机是工业生产的核心设备，电机烧毁会导致生产线停机，造成严重损失。那么如何判断电机是否烧毁呢？</p>
<h3>一、电机烧毁的判断方法</h3>
<h4>1. 直观判断</h4>
<ul>
<li>闻到明显的焦糊味</li>
<li>电机外壳有烟熏痕迹</li>
<li>电机内部有发黑、变色现象</li>
</ul>
<h4>2. 绝缘电阻测量</h4>
<p>使用摇表（兆欧表）测量电机绕组对地绝缘电阻：</p>
<ul>
<li>正常：绝缘电阻应大于0.5MΩ</li>
<li>受潮：0.1-0.5MΩ，需烘干处理</li>
<li>烧毁：接近0MΩ，绕组已损坏</li>
</ul>
<h4>3. 三相电阻测量</h4>
<p>正常三相绕组电阻应基本平衡，偏差不超过5%。如果某相电阻明显偏小或偏大，可能绕组存在短路或断路。</p>
<h3>二、电机烧毁的常见原因</h3>
<ul>
<li><strong>缺相运行</strong>：三相电缺一相，电流增大烧毁绕组</li>
<li><strong>过载运行</strong>：长期超载，温度过高绝缘老化</li>
<li><strong>轴承损坏</strong>：轴承抱死导致电机堵转</li>
<li><strong>进水受潮</strong>：绝缘降低导致短路</li>
<li><strong>电源电压异常</strong>：电压过高或过低</li>
<li><strong>频繁启停</strong>：启动电流大，累积热量</li>
</ul>
<h3>三、预防措施</h3>
<ul>
<li>安装缺相保护、过载保护</li>
<li>定期检查电机轴承、补充润滑脂</li>
<li>保持电机清洁干燥，做好防水防潮</li>
<li>定期测量绝缘电阻</li>
<li>合理选型，避免长期过载</li>
</ul>`,
    keywords: '电机烧毁判断,电机烧坏原因,电机维修',
    description: '详细介绍电机烧毁的判断方法、原因分析和预防措施。',
    author: '天津机电服务中心',
    views: 1532,
    createdAt: '2024-05-20T00:00:00.000Z',
  },
  {
    id: 4,
    title: '工业设备日常维护方法和保养要点',
    slug: 'gongye-shebei-richang-weihu-fangfa',
    category: 'tech',
    categoryName: '行业技术',
    summary: '工业设备的日常维护保养非常重要，可以延长设备使用寿命，减少故障停机。本文分享工业设备日常维护的方法和要点。',
    content: `<h2>工业设备日常维护方法</h2>
<p>俗话说"七分养，三分修"，工业设备的日常维护保养非常重要。做好日常维护可以有效延长设备使用寿命，减少故障停机时间。</p>
<h3>1. 电气设备日常维护</h3>
<h4>配电柜/控制柜</h4>
<ul>
<li>每日巡检：检查指示灯、仪表是否正常</li>
<li>每周检查：柜内温度、散热风扇运行情况</li>
<li>每月保养：除尘清洁、紧固接线端子</li>
<li>每季度：检查元器件老化情况</li>
</ul>
<h4>变频器</h4>
<ul>
<li>保持散热片清洁，定期除尘</li>
<li>检查散热风扇运行是否正常</li>
<li>检查变频器运行参数（电流、电压、温度）</li>
<li>每年做一次全面检测和保养</li>
</ul>
<h4>电机</h4>
<ul>
<li>定期检查轴承温度和噪音</li>
<li>定期补充或更换润滑脂</li>
<li>测量绝缘电阻</li>
<li>检查接线端子紧固情况</li>
</ul>
<h3>2. 日常维护注意事项</h3>
<ul>
<li>维护作业前必须断电，挂牌上锁</li>
<li>使用合格的工具和检测仪器</li>
<li>做好维护记录，建立设备档案</li>
<li>关键设备应有备品备件</li>
<li>发现异常及时处理，避免小问题变成大故障</li>
</ul>
<h3>3. 建议</h3>
<p>对于天津地区的企业，如果没有专业的电气维护人员，可以考虑与专业维修公司签订年度维保协议，定期上门保养，确保设备稳定运行。</p>`,
    keywords: '工业设备维护,设备保养,日常维护方法',
    description: '工业设备日常维护保养方法和要点，延长设备使用寿命，减少故障停机。',
    author: '天津机电服务中心',
    views: 876,
    createdAt: '2024-06-15T00:00:00.000Z',
  },
  {
    id: 5,
    title: '天津变频器维修厂家哪家好？如何选择靠谱的维修公司',
    slug: 'tianjin-bianpinqi-weixiu-najiahao',
    category: 'knowledge',
    categoryName: '维修知识',
    summary: '天津变频器维修厂家众多，如何选择一家靠谱的维修公司呢？本文从技术实力、服务质量、价格透明等方面给出建议。',
    content: `<h2>天津变频器维修厂家怎么选？</h2>
<p>天津作为工业城市，变频器维修厂家很多，但质量参差不齐。那么如何选择一家靠谱的变频器维修公司呢？</p>
<h3>1. 看技术实力</h3>
<ul>
<li>是否有专业的检测设备</li>
<li>工程师的维修经验如何</li>
<li>能否维修多种品牌和型号</li>
<li>是否有电路板级维修能力</li>
</ul>
<h3>2. 看服务质量</h3>
<ul>
<li>响应速度：能否快速上门</li>
<li>维修周期：多久能修好</li>
<li>保修政策：维修后质保多久</li>
<li>售后跟进：维修后是否跟进使用情况</li>
</ul>
<h3>3. 看价格透明</h3>
<ul>
<li>是否先检测后报价</li>
<li>报价是否明细清晰</li>
<li>检测是否收费</li>
<li>是否有隐形消费</li>
</ul>
<h3>4. 看口碑信誉</h3>
<ul>
<li>公司成立时间</li>
<li>服务过的客户案例</li>
<li>客户评价如何</li>
<li>是否有长期合作伙伴</li>
</ul>
<h3>总结</h3>
<p>选择变频器维修公司，不能只看价格，更要综合考虑技术实力、服务质量和口碑信誉。天津机电服务中心专注工业设备维修多年，服务天津地区众多工厂企业，值得信赖。</p>`,
    keywords: '天津变频器维修,变频器维修厂家,维修公司选择',
    description: '如何选择靠谱的天津变频器维修厂家，从技术、服务、价格、口碑等方面分析。',
    author: '天津机电服务中心',
    views: 1105,
    createdAt: '2024-07-05T00:00:00.000Z',
  },
  {
    id: 6,
    title: 'PLC常见故障及处理方法汇总',
    slug: 'plc-changjian-guzhang-chuli-fangfa',
    category: 'fault',
    categoryName: '设备故障',
    summary: 'PLC是工业自动化的核心，但也会出现各种故障。本文汇总了PLC常见故障现象及对应的处理方法。',
    content: `<h2>PLC常见故障及处理方法</h2>
<p>PLC作为工业自动化的核心控制设备，其稳定运行至关重要。以下汇总了PLC常见故障及处理方法。</p>
<h3>一、电源故障</h3>
<p><strong>现象：</strong>PLC电源指示灯不亮，无法开机。</p>
<p><strong>原因及处理：</strong></p>
<ul>
<li>外部电源异常 → 检查供电电压</li>
<li>保险丝熔断 → 更换保险丝，排查短路原因</li>
<li>电源模块损坏 → 维修或更换电源模块</li>
<li>接线松动 → 紧固接线端子</li>
</ul>
<h3>二、程序故障</h3>
<p><strong>现象：</strong>程序丢失、无法下载、运行异常。</p>
<p><strong>原因及处理：</strong></p>
<ul>
<li>电池没电 → 更换电池，重新下载程序</li>
<li>存储卡故障 → 更换存储卡</li>
<li>程序出错 → 检查程序逻辑，重新下载</li>
</ul>
<h3>三、IO故障</h3>
<p><strong>现象：</strong>输入点无信号、输出点无动作。</p>
<p><strong>原因及处理：</strong></p>
<ul>
<li>外部传感器/执行器故障 → 检查现场设备</li>
<li>接线松动 → 检查接线</li>
<li>IO点损坏 → 更换IO模块或备用点</li>
</ul>
<h3>四、通讯故障</h3>
<p><strong>现象：</strong>PLC无法与上位机或其他设备通讯。</p>
<p><strong>原因及处理：</strong></p>
<ul>
<li>通讯线损坏 → 更换通讯线</li>
<li>通讯参数设置错误 → 检查通讯参数</li>
<li>通讯模块损坏 → 维修或更换通讯模块</li>
</ul>`,
    keywords: 'PLC故障,PLC维修,PLC常见问题',
    description: 'PLC常见故障汇总及处理方法，包括电源故障、程序故障、IO故障、通讯故障等。',
    author: '天津机电服务中心',
    views: 1450,
    createdAt: '2024-08-10T00:00:00.000Z',
  },
];

// Districts
const districts = [
  { id: 1, name: '和平区', slug: 'heping' },
  { id: 2, name: '河东区', slug: 'hedong' },
  { id: 3, name: '河西区', slug: 'hexi' },
  { id: 4, name: '南开区', slug: 'nankai' },
  { id: 5, name: '河北区', slug: 'hebei' },
  { id: 6, name: '红桥区', slug: 'hongqiao' },
  { id: 7, name: '东丽区', slug: 'dongli' },
  { id: 8, name: '西青区', slug: 'xiqing' },
  { id: 9, name: '津南区', slug: 'jinnan' },
  { id: 10, name: '北辰区', slug: 'beichen' },
  { id: 11, name: '武清区', slug: 'wuqing' },
  { id: 12, name: '宝坻区', slug: 'baodi' },
  { id: 13, name: '静海区', slug: 'jinghai' },
  { id: 14, name: '宁河区', slug: 'ninghe' },
  { id: 15, name: '蓟州区', slug: 'jizhou' },
  { id: 16, name: '滨海新区', slug: 'binhai' },
];

// Settings
const settings = [
  {
    id: 1,
    siteName: '天津机电服务中心',
    siteTitle: '天津机电维修_工业设备维修_PLC维修_变频器维修 - 天津机电服务中心',
    siteKeywords: '天津机电维修,天津设备维修,天津PLC维修,天津变频器维修,天津电机维修,天津自动化维修',
    siteDescription: '天津机电服务中心专注天津地区工业设备维修，提供PLC维修、变频器维修、电机维修、伺服维修、自动化设备维修等服务，快速响应，专业可靠。',
    phone: '138-2020-8888',
    phoneShort: '13820208888',
    wechat: 'tjidian888',
    address: '天津市西青经济技术开发区',
    email: 'service@tjidian.com',
    workTime: '周一至周日 8:00-20:00',
    adminUser: 'admin',
    adminPass: 'admin123',
    bannerTitle: '天津机电维修服务中心',
    bannerSubtitle: '工业设备维修｜自动化维修｜PLC维修｜变频器维修｜电机维修',
    bannerDesc: '专注天津地区工业设备故障处理，为企业提供快速、专业、可靠的维修服务。',
  },
];

function writeJSON(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), 'utf-8');
}

writeJSON('services', services);
writeJSON('cases', cases);
writeJSON('articles', articles);
writeJSON('districts', districts);
writeJSON('settings', settings);
writeJSON('appointments', []);

console.log('Seed data created successfully!');
