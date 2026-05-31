import creelNormal from "../img/locations/creel-normal.png";
import creelUpside from "../img/locations/creel-upside.png";
import forestNormal from "../img/locations/forest-normal.png";
import forestUpside from "../img/locations/forest-upside.png";
import gateNormal from "../img/locations/gate-normal.png";
import gateUpside from "../img/locations/gate-upside.png";
import labNormal from "../img/locations/lab-normal.png";
import labUpside from "../img/locations/lab-upside.png";
import mallNormal from "../img/locations/mall-normal.png";
import mallUpside from "../img/locations/mall-upside.png";
import schoolNormal from "../img/locations/school-normal.png";
import schoolUpside from "../img/locations/school-upside.png";

export type WorldMode = "normal" | "upside";

export type Location = {
  id: string;
  name: string;
  type: string;
  danger: string;
  caseId: string;
  year: string;
  threatLevel: number;
  relatedCharacters: string[];
  evidence: string[];
  image: {
    normal: string;
    upside: string;
  };
  x: number;
  y: number;
  summary: string;
  hidden: string;
};

export type Character = {
  id: string;
  name: string;
  code: string;
  group: "party" | "lab" | "entity";
  status: string;
  ability: string;
  event: string;
  quote: string;
  hidden: string;
  relations: Array<{
    target: string;
    label: string;
    intensity: "low" | "medium" | "high";
  }>;
};

export type TimelineEvent = {
  season: string;
  year: string;
  title: string;
  tape: string;
  detail: string;
  beats: string[];
};

export const locations: Location[] = [
  {
    id: "lab",
    name: "Hawkins Lab",
    type: "Federal Facility",
    danger: "Severe",
    caseId: "HNL-1983-011",
    year: "1983",
    threatLevel: 86,
    relatedCharacters: ["Eleven", "Vecna", "Demogorgon"],
    evidence: ["儿童实验记录", "裂缝能量读数", "烧毁的监控胶片"],
    image: {
      normal: labNormal,
      upside: labUpside,
    },
    x: 58,
    y: 28,
    summary: "能量异常、儿童实验和第一道裂缝都指向这座封锁建筑。",
    hidden: "墙体温度低于环境 11 度，地下层持续回传倒置世界电磁噪声。",
  },
  {
    id: "mall",
    name: "Starcourt Mall",
    type: "Civilian Zone",
    danger: "Critical",
    caseId: "SCM-1985-RU",
    year: "1985",
    threatLevel: 78,
    relatedCharacters: ["Dustin", "Hopper", "Mind Flayer"],
    evidence: ["俄语无线电片段", "地下电梯蓝图", "损坏的霓虹招牌"],
    image: {
      normal: mallNormal,
      upside: mallUpside,
    },
    x: 75,
    y: 62,
    summary: "霓虹灯、秘密电梯和地下设施把小镇消费中心变成了战场。",
    hidden: "苏联设施残留频道仍在广播，频率与门的脉冲同步。",
  },
  {
    id: "creel",
    name: "Creel House",
    type: "Haunted Site",
    danger: "Vecna",
    caseId: "CRL-1986-001",
    year: "1986",
    threatLevel: 94,
    relatedCharacters: ["Vecna", "Max", "Eleven"],
    evidence: ["破裂座钟", "墙内电流痕迹", "受害者幻觉记录"],
    image: {
      normal: creelNormal,
      upside: creelUpside,
    },
    x: 34,
    y: 44,
    summary: "古老座钟、精神入侵和连续死亡事件在这里形成闭环。",
    hidden: "钟声不是回声，而是目标被标记后的倒计时。",
  },
  {
    id: "school",
    name: "Hawkins High",
    type: "Public School",
    danger: "Elevated",
    caseId: "HHS-1986-SH",
    year: "1986",
    threatLevel: 54,
    relatedCharacters: ["Mike", "Lucas", "Max"],
    evidence: ["体育馆避难名单", "失踪学生档案", "储物柜磁场异常"],
    image: {
      normal: schoolNormal,
      upside: schoolUpside,
    },
    x: 42,
    y: 69,
    summary: "普通校园生活与超自然危机交叠，体育馆曾被改造成避难点。",
    hidden: "储物柜金属面出现短暂镜像，疑似低强度维度渗透。",
  },
  {
    id: "forest",
    name: "Mirkwood Forest",
    type: "Woods",
    danger: "Unknown",
    caseId: "MWF-1983-WB",
    year: "1983",
    threatLevel: 69,
    relatedCharacters: ["Will", "Mike", "Demogorgon"],
    evidence: ["自行车轮印", "指南针偏转报告", "对讲机噪声"],
    image: {
      normal: forestNormal,
      upside: forestUpside,
    },
    x: 22,
    y: 27,
    summary: "失踪、追踪、无线电噪声和第一批目击报告都来自这片林地。",
    hidden: "孢子密度在凌晨三点达到峰值，指南针会同时失效。",
  },
  {
    id: "gate",
    name: "The Gate",
    type: "Rift",
    danger: "Open",
    caseId: "GATE-OPEN",
    year: "Active",
    threatLevel: 99,
    relatedCharacters: ["Eleven", "Vecna", "Hopper"],
    evidence: ["热成像裂缝", "孢子样本", "电网脉冲日志"],
    image: {
      normal: gateNormal,
      upside: gateUpside,
    },
    x: 62,
    y: 51,
    summary: "现实世界与倒置世界之间最危险的接触面。",
    hidden: "裂缝边缘正在学习人类电网的节奏。",
  },
];

export const characters: Character[] = [
  {
    id: "eleven",
    name: "Eleven",
    code: "011",
    group: "lab",
    status: "Active",
    ability: "Telekinesis / Remote Viewing",
    event: "关闭裂缝、对抗 Mind Flayer 与 Vecna。",
    quote: "Friends don't lie.",
    hidden: "她不是武器系统的异常，她是系统失控后的答案。",
    relations: [
      { target: "Mike", label: "情感锚点", intensity: "high" },
      { target: "Hopper", label: "保护者", intensity: "high" },
      { target: "Vecna", label: "001 回声", intensity: "high" },
      { target: "Hawkins Lab", label: "起源地点", intensity: "medium" },
    ],
  },
  {
    id: "mike",
    name: "Mike Wheeler",
    code: "AV-134",
    group: "party",
    status: "Field Lead",
    ability: "Strategy / Loyalty",
    event: "组织小队寻找 Will，并持续连接 Eleven 的人性锚点。",
    quote: "We are not kids anymore.",
    hidden: "情绪波动会影响 011 的稳定性，建议保持通讯开放。",
    relations: [
      { target: "Eleven", label: "信任核心", intensity: "high" },
      { target: "Dustin", label: "战术小队", intensity: "medium" },
      { target: "Hawkins High", label: "避难节点", intensity: "low" },
    ],
  },
  {
    id: "dustin",
    name: "Dustin Henderson",
    code: "HAM-315",
    group: "party",
    status: "Signal Expert",
    ability: "Radio / Logic / Improvisation",
    event: "通过 Cerebro 追踪信号，破解多次通讯困局。",
    quote: "Never tell me the odds.",
    hidden: "他的业余电台数次截获非人类节律，准确率高得不正常。",
    relations: [
      { target: "Mike", label: "小队通信", intensity: "medium" },
      { target: "Starcourt Mall", label: "俄语频道", intensity: "high" },
      { target: "Demogorgon", label: "早期实体样本", intensity: "low" },
    ],
  },
  {
    id: "lucas",
    name: "Lucas Sinclair",
    code: "SLG-083",
    group: "party",
    status: "Active",
    ability: "Tactics / Marksmanship / Ground Truth",
    event: "从最早的霍金斯调查一路参与到 1986 年对抗 Vecna 的行动。",
    quote: "I am right here.",
    hidden: "他是小队里最早意识到危险不能只靠幻想规则解释的人。",
    relations: [
      { target: "Max", label: "守护对象", intensity: "high" },
      { target: "Mike", label: "小队核心", intensity: "medium" },
      { target: "Hawkins High", label: "篮球队冲突", intensity: "medium" },
    ],
  },
  {
    id: "max",
    name: "Max Mayfield",
    code: "RUN-086",
    group: "party",
    status: "Marked",
    ability: "Resistance / Memory Anchor",
    event: "在音乐与记忆中抵抗 Vecna 的精神猎杀。",
    quote: "I am still here.",
    hidden: "Kate Bush 磁带应列为医疗设备，而不是随身物品。",
    relations: [
      { target: "Vecna", label: "被标记目标", intensity: "high" },
      { target: "Creel House", label: "精神攻击源", intensity: "high" },
      { target: "Eleven", label: "救援连接", intensity: "medium" },
    ],
  },
  {
    id: "will",
    name: "Will Byers",
    code: "MIR-083",
    group: "party",
    status: "Resonant",
    ability: "Upside Down Sensitivity / Emotional Signal",
    event: "1983 年失踪事件让小队第一次接触倒置世界。",
    quote: "He's here.",
    hidden: "残留连接没有完全断开，他仍能感知某种来自黑暗中的意志。",
    relations: [
      { target: "Mirkwood Forest", label: "失踪起点", intensity: "high" },
      { target: "Mike", label: "情绪锚点", intensity: "high" },
      { target: "Joyce", label: "家庭信号", intensity: "high" },
      { target: "Vecna", label: "远端感应", intensity: "medium" },
    ],
  },
  {
    id: "nancy",
    name: "Nancy Wheeler",
    code: "INV-086",
    group: "party",
    status: "Investigator",
    ability: "Research / Firearms / Pattern Recognition",
    event: "从 Barb 事件追查到实验室真相，并参与 1986 年 Creel House 行动。",
    quote: "We have a shot.",
    hidden: "她的调查路径经常比官方记录更接近真实事件链。",
    relations: [
      { target: "Jonathan", label: "调查搭档", intensity: "medium" },
      { target: "Steve", label: "战斗同盟", intensity: "medium" },
      { target: "Creel House", label: "Vecna 线索", intensity: "high" },
    ],
  },
  {
    id: "jonathan",
    name: "Jonathan Byers",
    code: "OBS-083",
    group: "party",
    status: "Active",
    ability: "Observation / Photography / Survival",
    event: "记录异常迹象，协助寻找 Will，并保护 Byers 家庭。",
    quote: "Sometimes people don't really say what they're really thinking.",
    hidden: "相机捕捉到的异常光斑与裂缝活动时间高度重合。",
    relations: [
      { target: "Will", label: "兄弟保护", intensity: "high" },
      { target: "Joyce", label: "家庭核心", intensity: "high" },
      { target: "Nancy", label: "调查搭档", intensity: "medium" },
    ],
  },
  {
    id: "steve",
    name: "Steve Harrington",
    code: "BAT-085",
    group: "party",
    status: "Field Support",
    ability: "Close Combat / Protection / Improvised Leadership",
    event: "从 Starcourt 到倒置世界隧道，多次承担前线保护角色。",
    quote: "Always the babysitter.",
    hidden: "非正式监护者角色显著提高了小队低龄成员的生还率。",
    relations: [
      { target: "Dustin", label: "战斗搭档", intensity: "high" },
      { target: "Robin", label: "Scoops 同盟", intensity: "high" },
      { target: "Starcourt Mall", label: "地下行动", intensity: "high" },
    ],
  },
  {
    id: "robin",
    name: "Robin Buckley",
    code: "CRK-085",
    group: "party",
    status: "Codebreaker",
    ability: "Languages / Pattern Logic / Improvisation",
    event: "破解 Starcourt 俄语广播，打开地下设施调查入口。",
    quote: "Platonic with a capital P.",
    hidden: "语言和节奏识别能力可用于追踪异常电台频率。",
    relations: [
      { target: "Steve", label: "Scoops 同盟", intensity: "high" },
      { target: "Nancy", label: "调查拍档", intensity: "medium" },
      { target: "Starcourt Mall", label: "广播源", intensity: "high" },
    ],
  },
  {
    id: "joyce",
    name: "Joyce Byers",
    code: "LGT-083",
    group: "party",
    status: "Signal Hunter",
    ability: "Persistence / Maternal Instinct / Anomaly Detection",
    event: "通过灯光信号确认 Will 仍存活，并持续追查霍金斯异常。",
    quote: "I know what I saw.",
    hidden: "在多数官方记录判定为妄想时，她的判断反而全部指向正确方向。",
    relations: [
      { target: "Will", label: "灯光通讯", intensity: "high" },
      { target: "Hopper", label: "调查搭档", intensity: "high" },
      { target: "Mirkwood Forest", label: "搜寻区域", intensity: "medium" },
    ],
  },
  {
    id: "erica",
    name: "Erica Sinclair",
    code: "NDR-085",
    group: "party",
    status: "Asset",
    ability: "Logic / Infiltration / Negotiation",
    event: "参与 Starcourt 地下设施行动，用冷静判断解决多次现场困局。",
    quote: "You can't spell America without Erica.",
    hidden: "建议所有行动预算预留谈判成本。",
    relations: [
      { target: "Lucas", label: "兄妹战线", intensity: "medium" },
      { target: "Dustin", label: "任务同盟", intensity: "medium" },
      { target: "Starcourt Mall", label: "通风管入口", intensity: "high" },
    ],
  },
  {
    id: "eddie",
    name: "Eddie Munson",
    code: "HFC-086",
    group: "party",
    status: "Fallen",
    ability: "Decoy / Courage / Metal Signal",
    event: "在倒置世界中用音乐牵制实体群，为主行动争取时间。",
    quote: "This is music.",
    hidden: "他的最后行动被错误叙事掩盖，但战术价值极高。",
    relations: [
      { target: "Dustin", label: "Hellfire 连接", intensity: "high" },
      { target: "Hawkins High", label: "错误指控", intensity: "medium" },
      { target: "Vecna", label: "诱敌行动", intensity: "medium" },
    ],
  },
  {
    id: "hopper",
    name: "Jim Hopper",
    code: "HPD-001",
    group: "party",
    status: "Recovered",
    ability: "Protection / Investigation",
    event: "从警长办公室一路追到实验室与俄罗斯设施。",
    quote: "Mornings are for coffee and contemplation.",
    hidden: "创伤后反应严重，但保护性决策成功率极高。",
    relations: [
      { target: "Eleven", label: "收养关系", intensity: "high" },
      { target: "Hawkins Lab", label: "调查入口", intensity: "medium" },
      { target: "The Gate", label: "封锁行动", intensity: "high" },
    ],
  },
  {
    id: "vecna",
    name: "Vecna",
    code: "001",
    group: "entity",
    status: "Hostile",
    ability: "Psychic Invasion / Gate Creation",
    event: "以创伤为入口猎杀目标，并撕开霍金斯。",
    quote: "Your suffering is almost at an end.",
    hidden: "001 不是怪物附属物，他可能是倒置世界组织化的起点。",
    relations: [
      { target: "Eleven", label: "镜像敌手", intensity: "high" },
      { target: "Max", label: "猎杀目标", intensity: "high" },
      { target: "Creel House", label: "钟声坐标", intensity: "high" },
      { target: "The Gate", label: "裂缝制造", intensity: "high" },
    ],
  },
  {
    id: "demogorgon",
    name: "Demogorgon",
    code: "DG-1983",
    group: "entity",
    status: "Predator",
    ability: "Hunting / Dimensional Tracking",
    event: "第一批实体入侵事件的核心生物。",
    quote: "No vocal record.",
    hidden: "会被血液吸引，也会被裂缝中的热源牵引。",
    relations: [
      { target: "Hawkins Lab", label: "突破点", intensity: "medium" },
      { target: "Mirkwood Forest", label: "猎场", intensity: "medium" },
      { target: "Eleven", label: "首次交锋", intensity: "high" },
    ],
  },
];

export const timeline: TimelineEvent[] = [
  {
    season: "Season 1",
    year: "1983",
    title: "The Vanishing of Will Byers",
    tape: "VHS-83-A",
    detail: "Will 的失踪把霍金斯小镇、实验室实验和倒置世界第一次连在一起。",
    beats: [
      "Will 在 Mirkwood 附近失踪，小队开始私下搜索。",
      "Eleven 逃离 Hawkins Lab，并与 Mike、Dustin、Lucas 相遇。",
      "Joyce 通过圣诞灯确认 Will 仍在另一个维度回应。",
      "Nancy 和 Jonathan 追查 Barb 失踪与 Demogorgon 的踪迹。",
      "小队确认倒置世界存在，Eleven 在学校对抗 Demogorgon。",
      "Will 被救回，但倒置世界污染没有真正结束。",
    ],
  },
  {
    season: "Season 2",
    year: "1984",
    title: "The Shadow Monster",
    tape: "VHS-84-MF",
    detail: "倒置世界从单一怪物威胁升级成具有集体意志的入侵网络。",
    beats: [
      "Will 出现倒置世界幻视，并逐渐成为 Mind Flayer 的连接点。",
      "Hopper 收留 Eleven，她开始追寻自己的过去和实验室身份。",
      "Dustin 发现 Dart，随后确认它属于 Demodog 生物链。",
      "Hawkins Lab 地下隧道扩张，小镇被倒置世界生态侵蚀。",
      "Steve、Dustin 和孩子们对抗 Demodog 群。",
      "Eleven 回归霍金斯，关闭实验室裂缝。",
    ],
  },
  {
    season: "Season 3",
    year: "1985",
    title: "The Battle of Starcourt",
    tape: "VHS-85-SC",
    detail: "Starcourt Mall 的霓虹外壳下，苏联设施重新撬开裂缝，Mind Flayer 以肉身形态回归。",
    beats: [
      "Starcourt Mall 改变小镇日常，也隐藏苏联地下设施。",
      "Dustin、Steve、Robin、Erica 破解俄语广播并潜入地下。",
      "Billy 被 Mind Flayer 控制，成为入侵现实世界的代理人。",
      "Mind Flayer 通过受害者肉体组装成巨大实体。",
      "Hopper、Joyce 和 Murray 关闭地下机器。",
      "Starcourt 战役结束，Billy 牺牲，Hopper 被认为死亡，Byers 一家离开霍金斯。",
    ],
  },
  {
    season: "Season 4",
    year: "1986",
    title: "The Curse of Vecna",
    tape: "VHS-86-VC",
    detail: "创伤、座钟和精神入侵串联成新的猎杀方式，Vecna 将霍金斯撕开。",
    beats: [
      "Chrissy 的死亡引发恐慌，Eddie 被误认为凶手。",
      "Max 被 Vecna 标记，小队发现音乐能打破精神猎杀。",
      "Nancy 和 Robin 调查 Creel House，追溯 Henry Creel 的真相。",
      "Eleven 在 Nina 项目中恢复记忆，发现 001、Henry、Vecna 是同一个源头。",
      "俄罗斯线揭示 Hopper 幸存，并与 Joyce、Murray 重逢。",
      "Eddie 和 Dustin 在倒置世界诱敌，Steve、Nancy、Robin 进入核心区域。",
      "Vecna 制造四道裂缝，Max 重伤，霍金斯被撕开。",
    ],
  },
];
