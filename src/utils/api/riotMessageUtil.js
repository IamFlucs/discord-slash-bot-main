const tierDict = {
    'IRON': 'Iron',
    'BRONZE': 'Bronze',
    'SILVER': 'Silver',
    'GOLD': 'Gold',
    'PLATINUM': 'Platinum',
    'EMERALD': 'Emerald',
    'DIAMOND': 'Diamond',
    'MASTER': 'Master',
    'GRANDMASTER': 'Grandmaster',
    'CHALLENGER': 'Challenger'
};

const tierOrder = {
    'Unranked': 1,
    'IRON': 2,
    'BRONZE': 3,
    'SILVER': 4,
    'GOLD': 5,
    'PLATINUM': 6,
    'EMERALD': 7,
    'DIAMOND': 8,
    'MASTER': 9,
    'GRANDMASTER': 10,
    'CHALLENGER': 11
};

// ID based on custom emojis in discord server used for storage
const tierEmojiDict = {
    'Unranked': '<:unranked:1280220249337237595>',
    'IRON': '<:iron:1258533104436510851>',
    'BRONZE': '<:bronze:1261427394322104442>',
    'SILVER': '<:silver:1261427437615583283>',
    'GOLD': '<:gold:1261427464522039436>',
    'PLATINUM': '<:platinum:1261427498541912156>',
    'EMERALD': '<:emerald:1261427532100669551>',
    'DIAMOND': '<:diamond:1261427563385847940>',
    'MASTER': '<:master:1261427596294623283>',
    'GRANDMASTER': '<:grandmaster:1261427620994613339>',
    'CHALLENGER': '<:challenger:1261427653123244153>'
};

const rankDict = {
    'I': '1',
    'II': '2',
    'III': '3',
    'IV': '4'
}

const rankOrder = {
    'IV': 1,
    'III': 2,
    'II': 3,
    'I': 4
};

const gameTypeDict = {
    '400': '5v5 Normal Draft | <:rift:1261817502284124260> Summoner\'s Rift',
    '420': '5v5 Ranked Solo/duo | <:rift:1261817502284124260> Summoner\'s Rift',
    '430': '5v5 Normal Blind | <:rift:1261817502284124260> Summoner\'s Rift',
    '440': '5v5 Ranked Flex | <:rift:1261817502284124260> Summoner\'s Rift',
    '450': 'Aram | <:aram:1261817500094435498> Howling Abyss',
    '490': 'Normal (Quickplay) | <:rift:1261817502284124260> Summoner\'s Rift',
    '1700': 'Arena | <:arena:1261817501314973777>',
    '1710': 'Arena | <:arena:1261817501314973777>',
}

// const gameCardDict = {
//     '400': '5v5 Normal Draft | <:rift:1261817502284124260> Summoner\'s Rift',
//     '420': '5v5 Ranked Solo/duo | <:rift:1261817502284124260> Summoner\'s Rift',
//     '430': '5v5 Normal Blind | <:rift:1261817502284124260> Summoner\'s Rift',
//     '440': '5v5 Ranked Flex | <:rift:1261817502284124260> Summoner\'s Rift',
//     '450': 'Aram | <:aram:1261817500094435498> Howling Abyss',
//     '490': 'Normal (Quickplay) | <:rift:1261817502284124260> Summoner\'s Rift',
//     '1700': 'Arena | <:arena:1261817501314973777>',
//     '1710': 'Arena | <:arena:1261817501314973777>',
// }

const gameModeDict = {
    'CLASSIC': '<:rift:1261817502284124260>',
    'ARAM': '<:aram:1261817500094435498>',
    'tft': '<:tft:1261817503147884696>',
    'arena': '<:arena:1261817501314973777>',
}

const queueType = {
    '420': 'Solo/Duo',
    '440': 'Flex',
}

const reverseQueueType = {
    'soloq': '420',
    'flex': '440',
}

const regionDict = {
    'EUW1': 'europe',
    'EUN1': 'europe',
    'ME1': 'europe',
    'TR1': 'europe',
    'RU1': 'europe',
    'NA1': 'americas',
    'BR1': 'americas',
    'LA1': 'americas',
    'LA2': 'americas',
    'KR': 'asia',
    'JP1': 'asia',
    'OC1': 'sea',
    'PH2': 'sea',
    'SG2': 'sea',
    'TH2': 'sea',
    'TW2': 'sea',
    'VN2': 'sea',
}

const reverseRegionDict = {
    'europe': 'EUW1',
    'europe': 'EUN1',
    'europe': 'ME1',
    'europe': 'TR1',
    'europe': 'RU1',
    'americas': 'NA1',
    'americas': 'BR1',
    'americas': 'LA1',
    'americas': 'LA2',
    'asia': 'KR',
    'asia': 'JP1',
    'sea': 'OC1',
    'sea': 'PH2',
    'sea': 'SG2',
    'sea': 'TH2',
    'sea': 'TW2',
    'sea': 'VN2',
}

const emblemDict = {
    '0': '<:mastery0:1280969963724603556>',
    '1': '<:mastery1:1277347466206777488>',
    '2': '<:mastery2:1277347037356228761>',
    '3': '<:mastery3:1277347035460145308>',
    '4': '<:mastery4:1277347034654969918>',
    '5': '<:mastery5:1277347033312923688>',
    '6': '<:mastery6:1277347031903637504>',
    '7': '<:mastery7:1277347030846406748>',
    '8': '<:mastery8:1277347028976013412>',
    '9': '<:mastery9:1277347027725975652>',
    '10': '<:mastery10:1277347026639781940>',
}

const championIconDict = {
    'Aatrox': '<:Aatrox:1261656688369598524>',
    'Ahri': '<:Ahri:1261656696070082592>',
    'Akali': '<:Akali:1261656703456247938>',
    'Akshan': '<:Akshan:1261656711094079568>',
    'Alistar': '<:Alistar:1261656718132252693>',
    'Amumu': '<:Amumu:1261656759945265172>',
    'Anivia': '<:Anivia:1261656776802173008>',
    'Annie': '<:Annie:1261656789980545106>',
    'Aphelios': '<:Aphelios:1261656796272136202>',
    'Ashe': '<:Ashe:1261656811946377226>',
    'AurelionSol': '<:AurelionSol:1261656826856996917>',
    'Aurora': '<:Aurora:1281179338246721546>',
    'Azir': '<:Azir:1261656834847146054>',
    'Bard': '<:Bard:1261656842241835030>',
    'BelVeth': '<:Belveth:1261657674718773360>',
    'Blitzcrank': '<:Blitzcrank:1261657725356605440>',
    'Brand': '<:Brand:1261657741886230582>',
    'Braum': '<:Braum:1261657752749477939>',
    'Briar': '<:Briar:1261657852993601607>',
    'Caitlyn': '<:Caitlyn:1261657883972735048>',
    'Camille': '<:Camille:1261657891375419402>',
    'Cassiopeia': '<:Cassiopeia:1261657912162390027>',
    'ChoGath': '<:Chogath:1261657920219648001>',
    'Corki': '<:Corki:1261657931405852702>',
    'Darius': '<:Darius:1261657938389373038>',
    'Diana': '<:Diana:1261657951366549514>',
    'DrMundo': '<:DrMundo:1261658053862756414>',
    'Draven': '<:Draven:1261657969745985617>',
    'Ekko': '<:Ekko:1261658083940110377>',
    'Elise': '<:Elise:1261658119617118248>',
    'Evelynn': '<:Evelynn:1261658130815778828>',
    'Ezreal': '<:Ezreal:1261658140383121509>',
    'Fiddlesticks': '<:Fiddlesticks:1261658154635100200>',
    'Fiora': '<:Fiora:1261658162512138271>',
    'Fizz': '<:Fizz:1261658173295558697>',
    'Galio': '<:Galio:1261658182774816778>',
    'Gangplank': '<:Gangplank:1261658204966752379>',
    'Garen': '<:Garen:1261658214018056302>',
    'Gnar': '<:Gnar:1261658222708789279>',
    'Gragas': '<:Gragas:1261658229482586143>',
    'Graves': '<:Name:1261658238605328396>',
    'Gwen': '<:Gwen:1261658270171398154>',
    'Hecarim': '<:Hecarim:1261658277691920434>',
    'Heimerdinger': '<:Heimerdinger:1261658287795994754>',
    'Hwei': '<:Hwei:1261658452200132699>',
    'Illaoi': '<:Illaoi:1261658512346447893>',
    'Irelia': '<:Irelia:1261658523150974996>',
    'Ivern': '<:Ivern:1261658530729951324>',
    'Janna': '<:Janna:1261658538695196673>',
    'JarvanIV': '<:JarvanIV:1261671449672941660>',
    'Jax': '<:Jax:1261701087283515483>',
    'Jayce': '<:Jayce:1261659521172897793>',
    'Jhin': '<:Jhin:1261659537279160391>',
    'Jinx': '<:Jinx:1261659550608654387>',
    'KaiSa': '<:KaiSa:1261659571651608618>',
    'Kalista': '<:Kalista:1261659585417183347>',
    'Karma': '<:Karma:1261659602831802472>',
    'Karthus': '<:Karthus:1261659615779618836>',
    'Kassadin': '<:Kassadin:1261659630631784511>',
    'Katarina': '<:Katarina:1261659648776470608>',
    'Kayle': '<:Kayle:1261659658616045598>',
    'Kayn': '<:Kayn:1261659696918691920>',
    'Kennen': '<:Kennen:1261659710990585899>',
    'KhaZix': '<:Khazix:1261659719219679366>',
    'Kindred': '<:Kindred:1261659736923832450>',
    'Kled': '<:Kled:1261659749322195044>',
    'KogMaw': '<:KogMaw:1261659764417368196>',
    'KSante': '<:KSante:1261660041816178728>',
    'LeBlanc': '<:Leblanc:1261659776010551296>',
    'LeeSin': '<:LeeSin:1261660098250539039>',
    'Leona': '<:Leona:1261660184074387467>',
    'Lillia': '<:Lillia:1261660194346242242>',
    'Lissandra': '<:Lissandra:1261660208376057936>',
    'Lucian': '<:Lucian:1261660218958549003>',
    'Lulu': '<:Lulu:1261660230148948060>',
    'Lux': '<:Lux:1261660251737034824>',
    'Malphite': '<:Malphite:1261660260242952312>',
    'Malzahar': '<:Malzahar:1261660275438780477>',
    'Maokai': '<:Maokai:1261660284129640482>',
    'MasterYi': '<:MasterYi:1261660293638000690>',
    'Milio': '<:Milio:1261660510269734912>',
    'MissFortune': '<:MissFortune:1261660618042380351>',
    'Mordekaiser': '<:Mordekaiser:1261660637797417011>',
    'Morgana': '<:Morgana:1261660646576095323>',
    'Naafiri': '<:Naafiri:1261660756492025901>',
    'Nami': '<:Nami:1261660779648778321>',
    'Nasus': '<:Nasus:1261660800565772308>',
    'Nautilus': '<:Nautilus:1261660815044513852>',
    'Neeko': '<:Neeko:1261660827661111326>',
    'Nidalee': '<:Nidalee:1261660835483222098>',
    'Nilah': '<:Nilah:1261660924662513724>',
    'Nocturne': '<:Nocturne:1261660967738282077>',
    'Nunu': '<:Nunu:1261661044699562105>',
    'Olaf': '<:Olaf:1261661075779358740>',
    'Orianna': '<:Orianna:1261661089175830549>',
    'Ornn': '<:Ornn:1261661100248666146>',
    'Pantheon': '<:Pantheon:1261661116933865482>',
    'Poppy': '<:Poppy:1261661123757736088>',
    'Pyke': '<:Pyke:1261661131911467028>',
    'Qiyana': '<:Qiyana:1261661142552412170>',
    'Quinn': '<:Quinn:1261661156800725004>',
    'Rakan': '<:Rakan:1261661427723403396>',
    'Rammus': '<:Rammus:1261661440734003242>',
    'RekSai': '<:RekSai:1261661465954226176>',
    'Rell': '<:Rell:1261774246074650675>',
    'Renata': '<:Renata:1261661540852043806>',
    'Renekton': '<:Renekton:1261661581813743698>',
    'Rengar': '<:Rengar:1261661593159204975>',
    'Riven': '<:Riven:1261661600021221386>',
    'Rumble': '<:Rumble:1261661619210027069>',
    'Ryze': '<:Ryze:1261661625761402971>',
    'Samira': '<:Samira:1261661815277096961>',
    'Sejuani': '<:Sejuani:1261661839050149969>',
    'Senna': '<:Senna:1261661846377730078>',
    'Seraphine': '<:Seraphine:1261661976321462385>',
    'Sett': '<:Sett:1261662001206394992>',
    'Shaco': '<:Shaco:1261662008760209488>',
    'Shen': '<:Shen:1261662017887010826>',
    'Shyvana': '<:Shyvana:1261662024346374226>',
    'Singed': '<:Singed:1261662034697785437>',
    'Sion': '<:Sion:1261662041299619901>',
    'Sivir': '<:Sivir:1261662063424569414>',
    'Skarner': '<:Skarner:1261662505810268271>',
    'Smolder': '<:Smolder:1261662586252820491>',
    'Sona': '<:Sona:1261662612010172426>',
    'Soraka': '<:Soraka:1261662621057159198>',
    'Swain': '<:Swain:1261662636605706260>',
    'Sylas': '<:Sylas:1261662645589770270>',
    'Syndra': '<:Syndra:1261662672353755227>',
    'TahmKench': '<:TahmKench:1261662695225036912>',
    'Taliyah': '<:Taliyah:1261662707153637416>',
    'Talon': '<:Talon:1261662741832273950>',
    'Taric': '<:Taric:1261662752607572079>',
    'Teemo': '<:Teemo:1261662758638846052>',
    'Thresh': '<:Thresh:1261662765140148224>',
    'Tristana': '<:Tristana:1261662775994880041>',
    'Trundle': '<:Trundle:1261662788179202079>',
    'Tryndamere': '<:Tryndamere:1261662800288415905>',
    'TwistedFate': '<:TwistedFate:1261662818026127390>',
    'Twitch': '<:Twitch:1261662828671275072>',
    'Udyr': '<:Udyr:1261663087048786052>',
    'Urgot': '<:Urgot:1261663189486141451>',
    'Varus': '<:Varus:1261663198042656820>',
    'Vayne': '<:Vayne:1261663212189778020>',
    'Veigar': '<:Veigar:1261663228010954772>',
    'VelKoz': '<:Velkoz:1261663234277244999>',
    'Vex': '<:Vex:1261663249808490568>',
    'Vi': '<:Vi:1261663256997662761>',
    'Viego': '<:Viego:1261663263528058942>',
    'Viktor': '<:Viktor:1261663272877293640>',
    'Vladimir': '<:Vladimir:1261663294058532906>',
    'Volibear': '<:Volibear:1261704681118367944>',
    'Warwick': '<:Warwick:1261663529824682004>',
    'Wukong': '<:Wukong:1261663541937700965>',
    'Xayah': '<:Xayah:1261663565480202372>',
    'Xerath': '<:Xerath:1261663572677623879>',
    'XinZhao': '<:XinZhao:1261663582865850390>',
    'Yasuo': '<:Yasuo:1261663589216030742>',
    'Yone': '<:Yone:1261774257424437358>',
    'Yorick': '<:Yorick:1261663595562012754>',
    'Yuumi': '<:Yuumi:1261663603035996170>',
    'Zac': '<:Zac:1261663615480500326>',
    'Zed': '<:Zed:1261663623357665350>',
    'Zeri': '<:Zeri:1261663628512329770>',
    'Ziggs': '<:Ziggs:1261663635768610829>',
    'Zilean': '<:Zilean:1261663642412384376>',
    'Zoe': '<:Zoe:1261663650653929473>',
    'Zyra': '<:Zyra:1261663656685342820>',
}

const championIdDict = {
    '1': 'Annie',
    '2': 'Olaf',
    '3': 'Galio',
    '4': 'TwistedFate',
    '5': 'XinZhao',
    '6': 'Urgot',
    '7': 'LeBlanc',
    '8': 'Vladimir',
    '9': 'Fiddlesticks',
    '10': 'Kayle',
    '11': 'MasterYi',
    '12': 'Alistar',
    '13': 'Ryze',
    '14': 'Sion',
    '15': 'Sivir',
    '16': 'Soraka',
    '17': 'Teemo',
    '18': 'Tristana',
    '19': 'Warwick',
    '20': 'Nunu',
    '21': 'MissFortune',
    '22': 'Ashe',
    '23': 'Tryndamere',
    '24': 'Jax',
    '25': 'Morgana',
    '26': 'Zilean',
    '27': 'Singed',
    '28': 'Evelynn',
    '29': 'Twitch',
    '30': 'Karthus',
    '31': 'ChoGath',
    '32': 'Amumu',
    '33': 'Rammus',
    '34': 'Anivia',
    '35': 'Shaco',
    '36': 'DrMundo',
    '37': 'Sona',
    '38': 'Kassadin',
    '39': 'Irelia',
    '40': 'Janna',
    '41': 'Gangplank',
    '42': 'Corki',
    '43': 'Karma',
    '44': 'Taric',
    '45': 'Veigar',
    '48': 'Trundle',
    '50': 'Swain',
    '51': 'Caitlyn',
    '53': 'Blitzcrank',
    '54': 'Malphite',
    '55': 'Katarina',
    '56': 'Nocturne',
    '57': 'Maokai',
    '58': 'Renekton',
    '59': 'JarvanIV',
    '60': 'Elise',
    '61': 'Orianna',
    '62': 'Wukong',
    '63': 'Brand',
    '64': 'LeeSin',
    '67': 'Vayne',
    '68': 'Rumble',
    '69': 'Cassiopeia',
    '72': 'Skarner',
    '74': 'Heimerdinger',
    '75': 'Nasus',
    '76': 'Nidalee',
    '77': 'Udyr',
    '78': 'Poppy',
    '79': 'Gragas',
    '80': 'Pantheon',
    '81': 'Ezreal',
    '82': 'Mordekaiser',
    '83': 'Yorick',
    '84': 'Akali',
    '85': 'Kennen',
    '86': 'Garen',
    '89': 'Leona',
    '90': 'Malzahar',
    '91': 'Talon',
    '92': 'Riven',
    '96': 'KogMaw',
    '98': 'Shen',
    '99': 'Lux',
    '101': 'Xerath',
    '102': 'Shyvana',
    '103': 'Ahri',
    '104': 'Graves',
    '105': 'Fizz',
    '106': 'Volibear',
    '107': 'Rengar',
    '110': 'Varus',
    '111': 'Nautilus',
    '112': 'Viktor',
    '113': 'Sejuani',
    '114': 'Fiora',
    '115': 'Ziggs',
    '117': 'Lulu',
    '119': 'Draven',
    '120': 'Hecarim',
    '121': 'KhaZix',
    '122': 'Darius',
    '126': 'Jayce',
    '127': 'Lissandra',
    '131': 'Diana',
    '133': 'Quinn',
    '134': 'Syndra',
    '136': 'AurelionSol',
    '141': 'Kayn',
    '142': 'Zoe',
    '143': 'Zyra',
    '145': 'KaiSa',
    '147': 'Seraphine',
    '150': 'Gnar',
    '154': 'Zac',
    '157': 'Yasuo',
    '161': 'VelKoz',
    '163': 'Taliyah',
    '164': 'Camille',
    '166': 'Akshan',
    '200': 'BelVeth',
    '201': 'Braum',
    '202': 'Jhin',
    '203': 'Kindred',
    '221': 'Zeri',
    '222': 'Jinx',
    '223': 'TahmKench',
    '233': 'Briar',
    '234': 'Viego',
    '235': 'Senna',
    '236': 'Lucian',
    '238': 'Zed',
    '240': 'Kled',
    '245': 'Ekko',
    '246': 'Qiyana',
    '254': 'Vi',
    '266': 'Aatrox',
    '267': 'Nami',
    '268': 'Azir',
    '350': 'Yuumi',
    '360': 'Samira',
    '412': 'Thresh',
    '420': 'Illaoi',
    '421': 'RekSai',
    '427': 'Ivern',
    '429': 'Kalista',
    '432': 'Bard',
    '497': 'Rakan',
    '498': 'Xayah',
    '516': 'Ornn',
    '517': 'Sylas',
    '518': 'Neeko',
    '523': 'Aphelios',
    '526': 'Rell',
    '555': 'Pyke',
    '711': 'Vex',
    '777': 'Yone',
    '875': 'Sett',
    '876': 'Lillia',
    '887': 'Gwen',
    '888': 'Renata',
    '893': 'Aurora',
    '895': 'Nilah',
    '897': 'KSante',
    '901': 'Smolder',
    '902': 'Milio',
    '910': 'Hwei',
    '950': 'Naafiri'
}

const championRoles = {
    '1': { mid: 0.83, support: 0.17}, // 'Annie'
    '2': { top: 0.86, jungle: 0.14 }, // 'Olaf'
    '3': { mid: 0.89, support: 0.11 }, // 'Galio'
    '4': { mid: 1.0 }, // 'TwistedFate'
    '5': { jungle: 1.0 }, // 'XinZhao'
    '6': { top: 1.0 }, // 'Urgot'
    '7': { mid: 0.88, support: 0.12 }, // 'LeBlanc'
    '8': { mid: 0.51, top: 0.49 }, // 'Vladimir'
    '9': { jungle: 0.83, support: 0.17 }, // 'Fiddlesticks'
    '10': { top: 0.86, mid: 0.14 }, // 'Kayle'
    '11': { jungle: 1.0 }, // 'MasterYi'
    '12': { support: 1.0 }, // 'Alistar'
    '13': { mid: 0.7, top: 0.3 }, // 'Ryze'
    '14': { top: 0.85, mid: 0.15 }, // 'Sion'
    '15': { adc: 1.0 }, // 'Sivir'
    '16': { support: 1.0 }, // 'Soraka'
    '17': { top: 0.76, support: 0.14, jungle: 0.1 }, // 'Teemo'
    '18': { mid: 0.52, adc: 0.48 }, // 'Tristana'
    '19': { jungle: 0.62, top: 0.38 }, // 'Warwick'
    '20': { jungle: 0.84, mid: 0.16 }, // 'Nunu'
    '21': { adc: 1.0 }, // 'MissFortune'
    '22': { adc: 0.9, support: 0.1 }, // 'Ashe'
    '23': { top: 0.88, mid: 0.12 }, // 'Tryndamere'
    '24': { top: 0.9, jungle: 0.1 }, // 'Jax'
    '25': { support: 0.89, jungle: 0.11 }, // 'Morgana'
    '26': { support: 0.9, mid: 0.1 }, // 'Zilean'
    '27': { top: 1.0 }, // 'Singed'
    '28': { jungle: 1.0 }, // 'Evelynn'
    '29': { adc: 0.9, support: 0.7, jungle: 0.3 }, // 'Twitch'
    '30': { jungle: 0.61, mid: 0.2, adc: 0.19 }, // 'Karthus'
    '31': { top: 0.8, mid: 0.2 }, // 'ChoGath'
    '32': { jungle: 0.9, support: 0.1 }, // 'Amumu'
    '33': { jungle: 0.85, top: 0.15 }, // 'Rammus'
    '34': { mid: 0.92, support: 0.08 }, // 'Anivia'
    '35': { jungle: 0.77, support: 0.23 }, // 'Shaco'
    '36': { top: 1.0 }, // 'DrMundo'
    '37': { support: 1.0 }, // 'Sona'
    '38': { mid: 1.0 }, // 'Kassadin'
    '39': { top: 0.52, mid: 0.48 }, // 'Irelia'
    '40': { support: 1.0 }, // 'Janna'
    '41': { top: 0.7, mid: 0.3 }, // 'Gangplank'
    '42': { mid: 0.95, adc: 0.05 }, // 'Corki'
    '43': { support: 0.96, mid: 0.04 }, // 'Karma'
    '44': { support: 1.0 }, // 'Taric'
    '45': { mid: 0.78, adc: 0.12, support: 0.1 }, // 'Veigar'
    '48': { top: 0.85, jungle: 0.15 }, // 'Trundle'
    '50': { support: 0.58, mid: 0.23, adc: 0.19 }, // 'Swain'
    '51': { adc: 1.0 }, // 'Caitlyn'
    '53': { support: 1.0 }, // 'Blitzcrank'
    '54': { top: 0.82, mid: 0.16, support: 0.02 }, // 'Malphite'
    '55': { mid: 1.0 }, // 'Katarina'
    '56': { jungle: 0.95, top: 0.05 }, // 'Nocturne'
    '57': { support: 0.6, jungle: 0.3, top: 0.1 }, // 'Maokai'
    '58': { top: 0.91, mid: 0.09 }, // 'Renekton'
    '59': { jungle: 0.96, support: 0.04 }, // 'JarvanIV'
    '60': { jungle: 1.0 }, // 'Elise'
    '61': { mid: 1.0 }, // 'Orianna'
    '62': { jungle: 0.57, top: 0.43 }, // 'Wukong'
    '63': { jungle: 0.35, support: 0.33, mid: 0.21, adc: 0.11 }, // 'Brand'
    '64': { jungle: 1.0 }, // 'LeeSin'
    '67': { adc: 0.73, top: 0.27 }, // 'Vayne'
    '68': { top: 0.75, jungle: 0.13, mid: 0.12 }, // 'Rumble'
    '69': { mid: 0.68, top: 0.26, adc: 0.06 }, // 'Cassiopeia'
    '72': { jungle: 0.87, top: 0.13 }, // 'Skarner'
    '74': { top: 0.62, mid: 0.2, support: 0.18 }, // 'Heimerdinger'
    '75': { top: 0.73, mid: 0.23, jungle: 0.04 }, // 'Nasus'
    '76': { jungle: 1.0 }, // 'Nidalee'
    '77': { jungle: 0.84, top: 0.16 }, // 'Udyr'
    '78': { support: 0.55, top: 0.3, jungle: 0.15 }, // 'Poppy'
    '79': { top: 0.45, jungle: 0.42, mid: 0.13 }, // 'Gragas'
    '80': { top: 0.41, support: 0.35, mid: 0.16, jungle: 0.08 }, // 'Pantheon'
    '81': { adc: 0.96, mid: 0.04 }, // 'Ezreal'
    '82': { top: 0.93, jungle: 0.05, mid: 0.02 }, // 'Mordekaiser'
    '83': { top: 0.92, jungle: 0.06, mid: 0.02 }, // 'Yorick'
    '84': { mid: 0.71, top: 0.29 }, // 'Akali'
    '85': { top: 0.8, mid: 0.14, support: 0.06 }, // 'Kennen'
    '86': { top: 0.86, mid: 0.14 }, // 'Garen'
    '89': { support: 1.0 }, // 'Leona'
    '90': { mid: 1.0 }, // 'Malzahar'
    '91': { mid: 0.61, jungle: 0.39 }, // 'Talon'
    '92': { top: 1.0 }, // 'Riven'
    '96': { adc: 0.9, mid: 0.1 }, // 'KogMaw'
    '98': { top: 0.82, support: 0.18}, // 'Shen'
    '99': { support: 0.64, mid: 0.36 }, // 'Lux'
    '101': { support: 0.56, mid: 0.44 }, // 'Xerath'
    '102': { jungle: 1.0 }, // 'Shyvana'
    '103': { mid: 1.0 }, // 'Ahri'
    '104': { jungle: 1.0 }, // 'Graves'
    '105': { mid: 1.0 }, // 'Fizz'
    '106': { top: 0.64, jungle: 0.36 }, // 'Volibear'
    '107': { jungle: 0.87, top: 0.13 }, // 'Rengar'
    '110': { adc: 0.88, mid: 0.8, top: 0.4 }, // 'Varus'
    '111': { support: 1.0 }, // 'Nautilus'
    '112': { mid: 1.0 }, // 'Viktor'
    '113': { jungle: 0.93, top: 0.07 }, // 'Sejuani'
    '114': { top: 1.0 }, // 'Fiora'
    '115': { adc: 0.73, mid: 0.27 }, // 'Ziggs'
    '117': { support: 1.0 }, // 'Lulu'
    '119': { adc: 1.0 }, // 'Draven'
    '120': { jungle: 1.0 }, // 'Hecarim'
    '121': { jungle: 1.0 }, // 'KhaZix'
    '122': { top: 1.0 }, // 'Darius'
    '126': { top: 0.76, mid: 0.24 }, // 'Jayce'
    '127': { mid: 0.95, support: 0.05 }, // 'Lissandra'
    '131': { jungle: 0.66, mid: 0.34 }, // 'Diana'
    '133': { top: 0.7, mid: 0.3 }, // 'Quinn'
    '134': { mid: 0.94, adc: 0.04, support: 0.02}, // 'Syndra'
    '136': { mid: 1.0 }, // 'AurelionSol'
    '141': { jungle: 1.0 }, // 'Kayn'
    '142': { mid: 0.79, support: 0.21 }, // 'Zoe'
    '143': { support: 0.79, jungle: 0.21 }, // 'Zyra'
    '145': { adc: 0.98, mid: 0.02 }, // 'KaiSa'
    '147': { support: 0.8, adc: 0.2 }, // 'Seraphine'
    '150': { top: 1.0 }, // 'Gnar'
    '154': { jungle: 0.62, top: 0.25, support: 0.13 }, // 'Zac'
    '157': { mid: 0.81, top: 0.11, adc: 0.08 }, // 'Yasuo'
    '161': { support: 0.67, mid: 0.33 }, // 'VelKoz'
    '163': { jungle: 0.51, mid: 0.49 }, // 'Taliyah'
    '164': { top: 0.87, support: 0.13 }, // 'Camille'
    '166': { mid: 1.0 }, // 'Akshan'
    '200': { jungle: 1.0 }, // 'BelVeth'
    '201': { support: 1.0 }, // 'Braum'
    '202': { adc: 1.0 }, // 'Jhin'
    '203': { jungle: 1.0 }, // 'Kindred'
    '221': { adc: 0.87, mid: 0.13 }, // 'Zeri'
    '222': { adc: 1.0 }, // 'Jinx'
    '223': { top: 0.62, support: 0.38 }, // 'TahmKench'
    '233': { jungle: 1.0 }, // 'Briar'
    '234': { jungle: 1.0 }, // 'Viego'
    '235': { support: 0.99, adc: 0.01 }, // 'Senna'
    '236': { adc: 0.86, mid: 0.14 }, // 'Lucian'
    '238': { mid: 0.83, jungle: 0.17 }, // 'Zed'
    '240': { top: 1.0 }, // 'Kled'
    '245': { jungle: 0.61, mid: 0.39 }, // 'Ekko'
    '246': { mid: 0.79, jungle: 0.21 }, // 'Qiyana'
    '254': { jungle: 1.0 }, // 'Vi'
    '266': { top: 0.97, mid: 0.03 }, // 'Aatrox'
    '267': { support: 1.0 }, // 'Nami'
    '268': { mid: 1.0 }, // 'Azir'
    '350': { support: 1.0 }, // 'Yuumi'
    '360': { adc: 1.0 }, // 'Samira'
    '412': { support: 1.0 }, // 'Thresh'
    '420': { top: 1.0 }, // 'Illaoi'
    '421': { jungle: 1.0 }, // 'RekSai'
    '427': { jungle: 1.0 }, // 'Ivern'
    '429': { adc: 1.0 }, // 'Kalista'
    '432': { support: 1.0 }, // 'Bard'
    '497': { support: 1.0 }, // 'Rakan'
    '498': { adc: 1.0 }, // 'Xayah'
    '516': { top: 1.0 }, // 'Ornn'
    '517': { mid: 0.67 , jungle: 0.19, top: 0.08, support: 0.06 }, // 'Sylas'
    '518': { support: 0.71, mid: 0.29 }, // 'Neeko'
    '523': { adc: 1.0 }, // 'Aphelios'
    '526': { support: 1.0 }, // 'Rell'
    '555': { support: 0.97, mid: 0.03 }, // 'Pyke'
    '711': { mid: 1.0 }, // 'Vex'
    '777': { mid: 0.61, top: 0.39 }, // 'Yone'
    '875': { top: 0.95, mid: 0.05 }, // 'Sett'
    '876': { jungle: 1.0 }, // 'Lillia'
    '887': { top: 0.64, jungle: 0.36 }, // 'Gwen'
    '888': { support: 1.0 }, // 'Renata'
    '893': { mid: 0.65, top: 0.35 }, // 'Aurora'
    '895': { adc: 1.0 }, // 'Nilah'
    '897': { top: 1.0 }, // 'KSante'
    '901': { adc: 0.52, mid: 0.32, top: 0.16 }, // 'Smolder'
    '902': { support: 1.0 }, // 'Milio'
    '910': { mid: 0.79, support: 0.13, adc: 0.08 }, // 'Hwei'
    '950': { mid: 0.83, jungle: 0.09, top: 0.08 }, // 'Naafiri'
}

module.exports = { tierDict, tierOrder, tierEmojiDict, rankDict, rankOrder, gameTypeDict, /*gameCardDict,*/ emblemDict, gameModeDict, queueType, reverseQueueType, regionDict, reverseRegionDict, championIconDict, championIdDict, championRoles };
