
import { BrandOption, CarBrandCategory, CurrencyOption } from './types';

export const EXPORT_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: '美元 (USD)', symbol: '$' },
  { code: 'CNY', name: '人民币 (CNY)', symbol: '¥' },
  { code: 'RUB', name: '俄罗斯卢布 (RUB)', symbol: '₽' },
  { code: 'AED', name: '阿联酋迪拉姆 (AED)', symbol: 'د.إ' },
  { code: 'EUR', name: '欧元 (EUR)', symbol: '€' },
  { code: 'KZT', name: '哈萨克斯坦坚戈 (KZT)', symbol: '₸' },
  { code: 'UZS', name: '乌兹别克斯坦苏姆 (UZS)', symbol: 'лв' },
  { code: 'SAR', name: '沙特里亚尔 (SAR)', symbol: '﷼' },
  { code: 'EGP', name: '埃及镑 (EGP)', symbol: '£' },
  { code: 'ETB', name: '埃塞俄比亚比尔 (ETB)', symbol: 'Br' },
];

export const CHINA_EXPORT_PORTS = [
  "-- 沿海主要枢纽港口 (Sea Ports) --",
  "上海港 (Shanghai - 海通/外高桥)",
  "天津港 (Tianjin - 新港/滚装码头)",
  "广州港 (Guangzhou - 南沙/新沙码头)",
  "深圳港 (Shenzhen - 蛇口/盐田/赤湾)",
  "连云港 (Lianyungang)",
  "宁波舟山港 (Ningbo-Zhoushan)",
  "青岛港 (Qingdao)",
  "厦门港 (Xiamen)",
  "大连港 (Dalian)",
  "钦州港 (Qinzhou)",
  "烟台港 (Yantai)",
  "太仓港 (Taicang)",
  "-- 陆路出口口岸 (Land Ports) --",
  "霍尔果斯 (Khorgos - 新疆/中亚陆运)",
  "阿拉山口 (Alashankou - 新疆/铁路)",
  "喀什 (Kashgar - 新疆/南亚/中亚)",
  "满洲里 (Manzhouli - 内蒙古/俄罗斯)",
  "二连浩特 (Erenhot - 内蒙古/蒙古)",
  "绥芬河 (Suifenhe - 黑龙江/俄远东)",
  "凭祥 (Pingxiang - 广西/东南亚)",
  "瑞丽 (Ruili - 云南/缅甸)",
];

export const GLOBAL_DESTINATION_PORTS = [
  "-- 几内亚 (Guinea - 重点) --",
  "科纳克里港 (Conakry) - 几内亚",
  "卡姆萨尔港 (Kamsar) - 几内亚",
  "博凯 (Boke) - 几内亚",
  "维多利亚 (Victoria) - 几内亚",
  
  "-- 西非地区 (West Africa) --",
  "拉各斯 (Apapa/Tin Can, Lagos) - 尼日利亚",
  "阿比让 (Abidjan) - 科特迪瓦",
  "达喀尔 (Dakar) - 塞内加尔",
  "特马 (Tema) - 加纳",
  "洛美 (Lome) - 多哥",
  "科托努 (Cotonou) - 贝宁",
  "杜阿拉 (Douala) - 喀麦隆",
  "弗里敦 (Freetown) - 塞拉利昂",
  "蒙罗维亚 (Monrovia) - 利比里亚",
  "班珠尔 (Banjul) - 冈比亚",
  "努瓦克肖特 (Nouakchott) - 毛里塔尼亚",

  "-- 北非地区 (North Africa) --",
  "亚历山大 (Alexandria) - 埃及",
  "塞得港 (Port Said) - 埃及",
  "苏科纳 (Sokhna) - 埃及",
  "达米埃塔 (Damietta) - 埃及",
  "卡萨布兰卡 (Casablanca) - 摩洛哥",
  "丹吉尔 (Tangier Med) - 摩洛哥",
  "阿尔及尔 (Algiers) - 阿尔及利亚",
  "奥兰 (Oran) - 阿尔及利亚",
  "突尼斯 (Tunis/La Goulette) - 突尼斯",
  "米苏拉塔 (Misrata) - 利比亚",
  "班加西 (Benghazi) - 利比亚",
  "的黎波里 (Tripoli) - 利比亚",

  "-- 东非及南非 (East & South Africa) --",
  "吉布提 (Djibouti) - 吉布提",
  "蒙巴萨 (Mombasa) - 肯尼亚",
  "达累斯萨拉姆 (Dar es Salaam) - 坦桑尼亚",
  "德班 (Durban) - 南非",
  "伊丽莎白港 (Port Elizabeth) - 南非",
  "开普敦 (Cape Town) - 南非",
  "罗安达 (Luanda) - 安哥拉",
  "洛比托 (Lobito) - 安哥拉",
  "马普托 (Maputo) - 莫桑比克",
  "贝拉 (Beira) - 莫桑比克",
  "鲸湾港 (Walvis Bay) - 纳米比亚",
  "塔马塔夫 (Toamasina) - 马达加斯加",
  "摩加迪沙 (Mogadishu) - 索马里",
  "苏丹港 (Port Sudan) - 苏丹",

  "-- 中东地区 (Middle East) --",
  "杰贝阿里 (Jebel Ali, Dubai) - 阿联酋",
  "哈利法港 (Khalifa, Abu Dhabi) - 阿联酋",
  "沙迦 (Sharjah) - 阿联酋",
  "吉达 (Jeddah) - 沙特阿拉伯",
  "达曼 (Dammam) - 沙特阿拉伯",
  "利雅得 (Riyadh Dry Port) - 沙特阿拉伯",
  "多哈 (Hamad, Doha) - 卡塔尔",
  "阿卡巴 (Aqaba) - 约旦",
  "科威特港 (Shuaiba/Shuwaikh) - 科威特",
  "马斯喀特 (Muscat) - 阿曼",
  "索哈 (Sohar) - 阿曼",
  "萨拉拉 (Salalah) - 阿曼",
  "巴林 (Hidd, Bahrain) - 巴林",
  "乌姆卡斯尔 (Umm Qasr) - 伊拉克",
  "阿巴斯港 (Bandar Abbas) - 伊朗",
  "贝鲁特 (Beirut) - 黎巴嫩",

  "-- 中亚及内陆 (Central Asia - 陆运/多式联运) --",
  "塔什干 (Tashkent) - 乌兹别克斯坦",
  "撒马尔罕 (Samarkand) - 乌兹别克斯坦",
  "安集延 (Andijan) - 乌兹别克斯坦",
  "阿拉木图 (Almaty) - 哈萨克斯坦",
  "阿斯塔纳 (Astana) - 哈萨克斯坦",
  "阿克套 (Aktau) - 哈萨克斯坦",
  "比什凯克 (Bishkek) - 吉尔吉斯斯坦",
  "奥什 (Osh) - 吉尔吉斯斯坦",
  "杜尚别 (Dushanbe) - 塔吉克斯坦",
  "阿什哈巴德 (Ashgabat) - 土库曼斯坦",
  "土库曼巴希 (Turkmenbashi) - 土库曼斯坦",
  "乌兰巴托 (Ulaanbaatar) - 蒙古",

  "-- 俄罗斯及东欧 (Russia & CIS) --",
  "莫斯科 (Moscow) - 俄罗斯",
  "圣彼得堡 (St. Petersburg) - 俄罗斯",
  "新西伯利亚 (Novosibirsk) - 俄罗斯",
  "海参崴 (Vladivostok) - 俄罗斯",
  "新罗西斯克 (Novorossiysk) - 俄罗斯",
  "波季 (Poti) - 格鲁吉亚",
  "巴统 (Batumi) - 格鲁吉亚",
  "巴库 (Baku) - 阿塞拜疆",
  "埃里温 (Yerevan) - 亚美尼亚",
  "明斯克 (Minsk) - 白俄罗斯",

  "-- 南亚及东南亚 (South & SE Asia) --",
  "卡拉奇 (Karachi) - 巴基斯坦",
  "瓜达尔 (Gwadar) - 巴基斯坦",
  "科伦坡 (Colombo) - 斯里兰卡",
  "孟买 (Nhava Sheva/Mumbai) - 印度",
  "钦奈 (Chennai) - 印度",
  "吉大港 (Chittagong) - 孟加拉国",
  "曼谷 (Bangkok) - 泰国",
  "林查班 (Laem Chabang) - Thailand",
  "胡志明 (Ho Chi Minh) - 越南",
  "马尼拉 (Manila) - 菲律宾",
  "雅加达 (Jakarta) - 印度尼西亚",
  "巴生港 (Port Klang) - 马来西亚",
  "新加坡 (Singapore)",
];

export const CHINA_REGIONS = [
  { province: '直辖市', cities: ['北京市', '上海市', '天津市', '重庆市'] },
  { province: '浙江省', cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'] },
  { province: '江苏省', cities: ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'] },
  { province: '广东省', cities: ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'] },
  { province: '四川省', cities: ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市'] },
  { province: '湖北省', cities: ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市'] },
  { province: '湖南省', cities: ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市'] },
  { province: '山东省', cities: ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'] },
  { province: '福建省', cities: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'] },
  { province: '安徽省', cities: ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'] },
  { province: '河南省', cities: ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'] },
  { province: '河北省', cities: ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'] },
  { province: '辽宁省', cities: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'] },
  { province: '陕西省', cities: ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'] },
  { province: '江西省', cities: ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'] },
  { province: '云南省', cities: ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市'] },
  { province: '贵州省', cities: ['贵阳市', '六盘水市', '尊义市', '安顺市', '毕节市', '铜仁市'] },
  { province: '山西省', cities: ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'] },
  { province: '吉林省', cities: ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市'] },
  { province: '黑龙江省', cities: ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市'] },
  { province: '广西壮族自治区', cities: ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'] },
  { province: '海南省', cities: ['海口市', '三亚市', '三沙市', '儋州市'] },
  { province: '甘肃省', cities: ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市'] },
  { province: '青海省', cities: ['西宁市', '海东市'] },
  { province: '内蒙古自治区', cities: ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市'] },
  { province: '宁夏回族自治区', cities: ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'] },
  { province: '新疆维吾尔自治区', cities: ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市'] },
];

export const CAR_BRANDS: BrandOption[] = [
  // Hot Brands (热门)
  { value: 'BYD', label: '比亚迪 (BYD)', category: CarBrandCategory.HOT },
  { value: 'Tesla', label: '特斯拉 (Tesla)', category: CarBrandCategory.HOT },
  { value: 'Toyota', label: '丰田 (Toyota)', category: CarBrandCategory.HOT },
  { value: 'Volkswagen', label: '大众 (Volkswagen)', category: CarBrandCategory.HOT },
  { value: 'Geely', label: '吉利 (Geely)', category: CarBrandCategory.HOT },
  { value: 'Chery', label: '奇瑞 (Chery)', category: CarBrandCategory.HOT },
  { value: 'LiAuto', label: '理想 (Li Auto)', category: CarBrandCategory.HOT },
  { value: 'Zeekr', label: '极氪 (Zeekr)', category: CarBrandCategory.HOT },
  { value: 'Aito', label: '问界 (AITO)', category: CarBrandCategory.HOT },
  { value: 'Xiaomi', label: '小米 (Xiaomi)', category: CarBrandCategory.HOT },
  { value: 'Wuling', label: '五菱 (Wuling)', category: CarBrandCategory.HOT },

  // A
  { value: 'Audi', label: '奥迪 (Audi)', category: CarBrandCategory.A },
  { value: 'Avatr', label: '阿维塔 (Avatr)', category: CarBrandCategory.A },
  { value: 'Arcfox', label: '极狐 (Arcfox)', category: CarBrandCategory.A },
  { value: 'Acura', label: '讴歌 (Acura)', category: CarBrandCategory.A },
  { value: 'AlfaRomeo', label: '阿尔法·罗密欧 (Alfa Romeo)', category: CarBrandCategory.A },
  { value: 'AstonMartin', label: '阿斯顿·马丁 (Aston Martin)', category: CarBrandCategory.A },
  
  // B
  { value: 'BMW', label: '宝马 (BMW)', category: CarBrandCategory.B },
  { value: 'Benz', label: '奔驰 (Mercedes-Benz)', category: CarBrandCategory.B },
  { value: 'Buick', label: '别克 (Buick)', category: CarBrandCategory.B },
  { value: 'Baojun', label: '宝骏 (Baojun)', category: CarBrandCategory.B },
  { value: 'Bentley', label: '宾利 (Bentley)', category: CarBrandCategory.B },
  { value: 'Bestune', label: '奔腾 (Bestune)', category: CarBrandCategory.B },
  { value: 'Beijing', label: '北京 (Beijing)', category: CarBrandCategory.B },
  { value: 'Baic', label: '北汽 (BAIC)', category: CarBrandCategory.B },
  { value: 'Borgward', label: '宝沃 (Borgward)', category: CarBrandCategory.B },

  // C
  { value: 'Changan', label: '长安 (Changan)', category: CarBrandCategory.C },
  { value: 'Chevrolet', label: '雪佛兰 (Chevrolet)', category: CarBrandCategory.C },
  { value: 'Cadillac', label: '凯迪拉克 (Cadillac)', category: CarBrandCategory.C },
  { value: 'Citroen', label: '雪铁龙 (Citroen)', category: CarBrandCategory.C },
  { value: 'ChanganOshan', label: '长安欧尚 (Oshan)', category: CarBrandCategory.C },

  // D
  { value: 'Dongfeng', label: '东风 (Dongfeng)', category: CarBrandCategory.D },
  { value: 'Denza', label: '腾势 (Denza)', category: CarBrandCategory.D },
  { value: 'Deepal', label: '深蓝 (Deepal)', category: CarBrandCategory.D },
  { value: 'Dodge', label: '道奇 (Dodge)', category: CarBrandCategory.D },
  { value: 'Ds', label: 'DS', category: CarBrandCategory.D },

  // F
  { value: 'Ford', label: '福特 (Ford)', category: CarBrandCategory.F },
  { value: 'Foton', label: '福田 (Foton)', category: CarBrandCategory.F },
  { value: 'Ferrari', label: '法拉利 (Ferrari)', category: CarBrandCategory.F },
  { value: 'Fiat', label: '菲亚特 (Fiat)', category: CarBrandCategory.F },
  { value: 'Faw', label: '一汽 (FAW)', category: CarBrandCategory.F },

  // G
  { value: 'GAC', label: '广汽 (GAC)', category: CarBrandCategory.G },
  { value: 'GreatWall', label: '长城 (Great Wall)', category: CarBrandCategory.G },
  { value: 'Genesis', label: '捷尼赛思 (Genesis)', category: CarBrandCategory.G },
  { value: 'Geely', label: '吉利 (Geely)', category: CarBrandCategory.G },
  { value: 'Gmc', label: 'GMC', category: CarBrandCategory.G },
  { value: 'Gonzo', label: '广汽传祺 (Trumpchi)', category: CarBrandCategory.G },

  // H
  { value: 'Honda', label: '本田 (Honda)', category: CarBrandCategory.H },
  { value: 'Hongqi', label: '红旗 (Hongqi)', category: CarBrandCategory.H },
  { value: 'Hyundai', label: '现代 (Hyundai)', category: CarBrandCategory.H },
  { value: 'Haval', label: '哈弗 (Haval)', category: CarBrandCategory.H },
  { value: 'HiPhi', label: '高合 (HiPhi)', category: CarBrandCategory.H },
  { value: 'Hozon', label: '哪吒 (Neta)', category: CarBrandCategory.H },
  { value: 'Haima', label: '海马 (Haima)', category: CarBrandCategory.H },

  // J
  { value: 'Jetour', label: '捷途 (Jetour)', category: CarBrandCategory.J },
  { value: 'Jeep', label: '吉普 (Jeep)', category: CarBrandCategory.J },
  { value: 'Jac', label: '江淮 (JAC)', category: CarBrandCategory.J },
  { value: 'Jmc', label: '江铃 (JMC)', category: CarBrandCategory.J },
  { value: 'Jetta', label: '捷达 (Jetta)', category: CarBrandCategory.J },
  { value: 'Jaguar', label: '捷豹 (Jaguar)', category: CarBrandCategory.J },

  // K
  { value: 'Kia', label: '起亚 (Kia)', category: CarBrandCategory.K },
  { value: 'Koenigsegg', label: '科尼赛克 (Koenigsegg)', category: CarBrandCategory.K },

  // L
  { value: 'Leapmotor', label: '零跑 (Leapmotor)', category: CarBrandCategory.L },
  { value: 'LynkCo', label: '领克 (Lynk & Co)', category: CarBrandCategory.L },
  { value: 'Lexus', label: '雷克萨斯 (Lexus)', category: CarBrandCategory.L },
  { value: 'LandRover', label: '路虎 (Land Rover)', category: CarBrandCategory.L },
  { value: 'Lotus', label: '路特斯 (Lotus)', category: CarBrandCategory.L },
  { value: 'Lamborghini', label: '兰博基尼 (Lamborghini)', category: CarBrandCategory.L },
  { value: 'Lincoln', label: '林肯 (Lincoln)', category: CarBrandCategory.L },
  { value: 'Lixiang', label: '理想 (Li Auto)', category: CarBrandCategory.L },
  { value: 'Lifan', label: '力帆 (Lifan)', category: CarBrandCategory.L },

  // M
  { value: 'Mazda', label: '马自达 (Mazda)', category: CarBrandCategory.M },
  { value: 'MG', label: '名爵 (MG)', category: CarBrandCategory.M },
  { value: 'Maserati', label: '玛莎拉蒂 (Maserati)', category: CarBrandCategory.M },
  { value: 'McLaren', label: '迈凯伦 (McLaren)', category: CarBrandCategory.M },
  { value: 'Mini', label: 'MINI', category: CarBrandCategory.M },
  { value: 'Mitsubishi', label: '三菱 (Mitsubishi)', category: CarBrandCategory.M },

  // N
  { value: 'NIO', label: '蔚来 (NIO)', category: CarBrandCategory.N },
  { value: 'Nissan', label: '日产 (Nissan)', category: CarBrandCategory.N },
  { value: 'Neta', label: '哪吒 (Neta)', category: CarBrandCategory.N },

  // O
  { value: 'Ora', label: '欧拉 (Ora)', category: CarBrandCategory.O },
  { value: 'Opel', label: '欧宝 (Opel)', category: CarBrandCategory.O },

  // P
  { value: 'Porsche', label: '保时捷 (Porsche)', category: CarBrandCategory.P },
  { value: 'Peugeot', label: '标致 (Peugeot)', category: CarBrandCategory.P },
  { value: 'Polestar', label: '极星 (Polestar)', category: CarBrandCategory.P },

  // Q
  { value: 'Qoros', label: '观致 (Qoros)', category: CarBrandCategory.Q },

  // R
  { value: 'Roewe', label: '荣威 (Roewe)', category: CarBrandCategory.R },
  { value: 'RollsRoyce', label: '劳斯莱斯 (Rolls-Royce)', category: CarBrandCategory.R },
  { value: 'Renault', label: '雷诺 (Renault)', category: CarBrandCategory.R },
  { value: 'Radar', label: '雷达 (Radar)', category: CarBrandCategory.R },

  // S
  { value: 'SAIC', label: '上汽 (SAIC)', category: CarBrandCategory.S },
  { value: 'Skoda', label: '斯柯达 (Skoda)', category: CarBrandCategory.S },
  { value: 'Subaru', label: '斯巴鲁 (Subaru)', category: CarBrandCategory.S },
  { value: 'Suzuki', label: '铃木 (Suzuki)', category: CarBrandCategory.S },
  { value: 'Smart', label: 'smart', category: CarBrandCategory.S },
  { value: 'Seres', label: '赛力斯 (Seres)', category: CarBrandCategory.S },
  { value: 'Swm', label: '斯威 (SWM)', category: CarBrandCategory.S },
  { value: 'Soueast', label: '东南 (Soueast)', category: CarBrandCategory.S },

  // T
  { value: 'Tank', label: '坦克 (Tank)', category: CarBrandCategory.T },
  { value: 'Tesla', label: '特斯拉 (Tesla)', category: CarBrandCategory.T },

  // V
  { value: 'Volvo', label: '沃尔沃 (Volvo)', category: CarBrandCategory.V },
  { value: 'Voyah', label: '岚图 (Voyah)', category: CarBrandCategory.V },
  { value: 'Volkswagen', label: '大众 (Volkswagen)', category: CarBrandCategory.V },

  // W
  { value: 'Wuling', label: '五菱 (Wuling)', category: CarBrandCategory.W },
  { value: 'Wey', label: '魏牌 (WEY)', category: CarBrandCategory.W },
  { value: 'Weltmeister', label: '威马 (Weltmeister)', category: CarBrandCategory.W },

  // X
  { value: 'Xiaomi', label: '小米 (Xiaomi)', category: CarBrandCategory.X },
  { value: 'Xpeng', label: '小鹏 (Xpeng)', category: CarBrandCategory.X },

  // Y
  { value: 'Yudo', label: '云度 (Yudo)', category: CarBrandCategory.Y },
  { value: 'Yangwang', label: '仰望 (Yangwang)', category: CarBrandCategory.Y },

  // Z
  { value: 'Zeekr', label: '极氪 (Zeekr)', category: CarBrandCategory.Z },
  { value: 'Zhidou', label: '知豆 (Zhidou)', category: CarBrandCategory.Z },
  { value: 'Zotye', label: '众泰 (Zotye)', category: CarBrandCategory.Z },
];

export const SORTED_CATEGORIES = [
  CarBrandCategory.HOT,
  ...Object.values(CarBrandCategory).filter(c => c !== CarBrandCategory.HOT).sort()
];
