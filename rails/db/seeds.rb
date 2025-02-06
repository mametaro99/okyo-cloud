# 宗派データの作成
sects = Sect.create!([
  { name: "浄土宗", description: "念仏を唱えることを中心とした宗派" },
  { name: "曹洞宗", description: "座禅を重んじる禅宗の一派" },
  { name: "天台宗", description: "法華経を中心とした教えを説く宗派" }
])

# ユーザーデータ（和尚さん）の作成
users = User.create!([
  { email: "monk1@example.com", password: "password", name: "和尚A", sect_id: sects[0].id, location: "京都府", temple_name: "浄光寺" },
  { email: "monk2@example.com", password: "password", name: "和尚B", sect_id: sects[1].id, location: "神奈川県", temple_name: "龍泉寺" },
  { email: "monk3@example.com", password: "password", name: "和尚C", sect_id: sects[2].id, location: "東京都", temple_name: "天台寺" }
])

# お経データの作成
okyos = Okyo.create!([
  { name: "般若心経", description: "智慧の完成を説いたお経", video_url: "pannyashingyou128.mp3", article_url: "https://www.kazoku24.com/column/article/column101/", published: true },
  { name: "三帰礼文", description: "華厳宗や曹洞宗で読まれるお経。三宝(仏陀・法・僧)を拝む文章。", video_url: "https://youtu.be/sample2", article_url: "https://bukyou.homodeusu.com/%E3%80%90%E7%9C%9F%E8%A8%80%E5%AE%97%E3%80%91%E4%B8%89%E5%B8%B0%E7%A4%BC%E6%96%87%E3%83%BB%E5%B8%B0%E7%A4%BC%E6%96%87%EF%BC%88%E3%81%95%E3%82%93%E3%81%8D%E3%82%89%E3%81%84%E3%82%82%E3%82%93%EF%BC%89/", published: true },
  { name: "舎利礼文", description: "『舎利礼文』は、葬儀や枕経などに読誦されます。道元禅師の火葬の際にも読誦されたこともあり、曹洞宗で主に用いられています。その内容は釈迦を慕ってその遺骨を礼拝するお経で、釈迦の本質（法身）は永遠であり、人間界に現われて救いの道を教え、永遠の世界に帰られた。私達も仏の慈悲の力によって悟りの智恵を求める願いを起こし、修行して大智を完成するというものです。", video_url: "https://youtu.be/sample3", article_url: "https://www.houjuzan-manpukuji.com/syariraimon.html", published: true }
])



OkyoPhrase.create!([
  { okyo_id: okyos[0].id, phrase_text: "照見五蘊皆空　度一切苦厄", meaning: "観音菩薩が五蘊（肉体、感覚、イメージ、意思、認識）を見て、それらがすべて空であることを照らし出し、一切の苦しみを除く", reading: "しょうけんごうんかいくう　どいっさいくやく", video_start_time: 20, video_end_time: 25, order: 2 },

  { okyo_id: okyos[0].id, phrase_text: "観自在菩薩　行深般若波羅蜜多時", meaning: "観音菩薩が、 さとりの世界へ到る修行を実践されているとき", reading: "かんじざいぼさつ　ぎょうじんはんにゃはらみったじ", video_start_time: 13, video_end_time: 20, order: 1 },
  
  { okyo_id: okyos[0].id, phrase_text: "舍利子　色不異空　空不異色", meaning: "舎利子よ、カタチあるものには実体がなく、実体がないものもカタチあるものと異ならない", reading: "しゃりし　しきふいくう　くうふいしき", video_start_time: 25, video_end_time: 31, order: 3 },

  { okyo_id: okyos[0].id, phrase_text: "色即是空　空即是色", meaning: "カタチあるものはすべて空であり、空はカタチを含んでいる", reading: "しきそくぜくう　くうそくぜしき", video_start_time: 31, video_end_time: 35, order: 4 },

  { okyo_id: okyos[0].id, phrase_text: "受想行識亦復如是", meaning: "感覚、イメージ、意思、認識などもまた同じように実体がない", reading: "じゅそうぎょうしきやくぶにょぜ", video_start_time: 35, video_end_time: 39, order: 5 },

  { okyo_id: okyos[0].id, phrase_text: "舍利子　是諸法空相", meaning: "舎利子よ、存在するあらゆるものには実体がない空の相がある", reading: "しゃりし　ぜしょほうくうそう", video_start_time: 39, video_end_time: 44, order: 6 },

  { okyo_id: okyos[0].id, phrase_text: "不生不滅　不垢不浄　不増不減", meaning: "それらは生じず滅せず、汚れも浄まりもなく、増えも減りもない", reading: "ふしょう　ふめつ　ふくふじょう　ふぞうふげん", video_start_time: 44, video_end_time: 49, order: 7 },

  { okyo_id: okyos[0].id, phrase_text: "是故空中　無色　無受想行識", meaning: "したがって、空中にはカタチも感覚、イメージ、意思、認識も存在しない", reading: "ぜこくうちゅう　むしき　むじゅそうぎょうしき", video_start_time: 50, video_end_time: 55, order: 8 },

  { okyo_id: okyos[0].id, phrase_text: "無眼耳鼻舌身意　無色声香 味 触 法", meaning: "目・耳・鼻・舌・身体・心がなく、それらがもたらす感覚も存在しない", reading: "むげんにびぜっしん い　むしきしょうこうみそくほう", video_start_time: 55, video_end_time: 63, order: 9 },

  { okyo_id: okyos[0].id, phrase_text: "無眼界　乃至無意識界", meaning: "目に見える世界から意識する感覚に至るまで、すべてが存在しない", reading: "むげんかい　ないしむいしきかい", video_start_time: 63, video_end_time: 67, order: 10 },

  { okyo_id: okyos[0].id, phrase_text: "無無明亦　無無明尽", meaning: "無明（無知）もなく、それが尽きることもない", reading: "むむみょうやく　むむみょうじん", video_start_time: 67, video_end_time: 71, order: 11 },

  { okyo_id: okyos[0].id, phrase_text: "乃至無老死　亦無老死尽", meaning: "老いも死もなく、それが尽きることもない", reading: "ないしむろうし　やくむろうしじん", video_start_time: 71, video_end_time: 77, order: 12 },

  { okyo_id: okyos[0].id, phrase_text: "無苦集滅道　無智亦無得", meaning: "苦しみの原因、滅する方法もなく、知恵も得ることもない", reading: "むくしゅうめつ どう　むちやくむとく", video_start_time: 77, video_end_time: 82, order: 13 },

  { okyo_id: okyos[0].id, phrase_text: "以無所得故　菩提薩埵　依般若波羅蜜多故", meaning: "何も得るものがないからこそ、菩薩は智慧に依り、般若波羅蜜多に依る", reading: "いむしょとくこ　ぼだいさった　えはんにゃはらみったこ", video_start_time: 82, video_end_time: 90, order: 14 },

  { okyo_id: okyos[0].id, phrase_text: "心無罣礙　無罣礙故　無有恐怖", meaning: "心にこだわりがないから、恐れもない", reading: "しんむけいげ　むけいげこ　むうくふ", video_start_time: 90, video_end_time: 97, order: 15 },

  { okyo_id: okyos[0].id, phrase_text: "遠離 一切顛倒夢想　究竟涅槃", meaning: "一切の誤った考えや夢想から遠く離れて、究極の涅槃に至る", reading: "おんりいっさいてんどうむそう　くきょうねはん", video_start_time: 97, video_end_time: 103, order: 16 },

  { okyo_id: okyos[0].id, phrase_text: "三世諸仏　依般若波羅蜜多故", meaning: "過去・現在・未来のすべての仏は、この智慧によってさとりを得た", reading: "さんぜしょぶつ　えはんにゃはらみったこ", video_start_time: 103, video_end_time: 111, order: 17 },

  { okyo_id: okyos[0].id, phrase_text: "得阿耨多羅三藐三菩提", meaning: "完全なさとりを得る", reading: "とくあのくたらさんみゃくさんぼだい", video_start_time: 111, video_end_time: 117, order: 18 },

  { okyo_id: okyos[0].id, phrase_text: "故知般若波羅蜜多", meaning: "だから、般若波羅蜜多を知るべきである", reading: "こちはんにゃはらみった", video_start_time: 117, video_end_time: 120, order: 19 },

  { okyo_id: okyos[0].id, phrase_text: "是大神呪　是大明呪", meaning: "これは偉大な呪文であり、偉大な明らかにする呪文である", reading: "ぜだいじんしゅ　ぜだいみょうしゅ", video_start_time: 120, video_end_time: 123, order: 20 },

  { okyo_id: okyos[0].id, phrase_text: "是無上呪　是無等等呪", meaning: "これが最も高い呪文であり、比類のない呪文である", reading: "ぜむじょうしゅ　ぜむとうどうしゅ", video_start_time: 123, video_end_time: 127, order: 21 },

  { okyo_id: okyos[0].id, phrase_text: "能除一切苦　真実不虚", meaning: "あらゆる苦しみを除くことができ、真実で虚偽はない", reading: "のうじょいっさいく　しんじつふきょ", video_start_time: 127, video_end_time: 131, order: 22 },

  { okyo_id: okyos[0].id, phrase_text: "故説般若波羅蜜多呪", meaning: "それゆえ、般若波羅蜜多の呪文を説く", reading: "こせつはんにゃはらみったしゅ", video_start_time: 131, video_end_time: 136, order: 23 },

  { okyo_id: okyos[0].id, phrase_text: "即説呪曰", meaning: "般若波羅蜜多の呪文は、これであると説かれる", reading: "そくせつしゅわつ", video_start_time: 136, video_end_time: 138, order: 24 },

  { okyo_id: okyos[0].id, phrase_text: "揭諦揭諦　波羅揭諦　波羅僧揭諦　菩提薩婆訶", meaning: "行け、行け、超えて行け、最も向こうに行け、悟りの岸に渡れ、歓喜を持って", reading: "ぎゃていぎゃてい　はらぎゃてい　はらそうぎゃてい　ぼじそわか", video_start_time: 139, video_end_time: 147, order: 25 },

  { okyo_id: okyos[0].id, phrase_text: "般若心経", meaning: "智慧の完成を説いたお経", reading: "はんにゃしんぎょう", video_start_time: 147, video_end_time: 150, order: 26 }
])



OkyoPhrase.create!([
  { okyo_id: okyos[1].id, phrase_text: "自帰依仏", meaning: "私自ら仏様をよりどころとします。", reading: "じきえぶつ", video_start_time: 30, video_end_time: 37, order: 1 },
  { okyo_id: okyos[1].id, phrase_text: "当願衆生", meaning: "当に願わくは衆生と共に", reading: "とうがんしゅじょう", video_start_time: 37, video_end_time: 46, order: 2 },
  { okyo_id: okyos[1].id, phrase_text: "体解大道", meaning: "大道を体解して", reading: "たいげだいどう", video_start_time: 46, video_end_time: 50, order: 3 },
  { okyo_id: okyos[1].id, phrase_text: "発無上意", meaning: "無上意を発さん", reading: "ほつむじょうい", video_start_time: 50, video_end_time: 54, order: 4 },
  { okyo_id: okyos[1].id, phrase_text: "自帰依法", meaning: "自ら法に帰依し奉る", reading: "じきえほう", video_start_time: 54, video_end_time: 60, order: 5 },
  { okyo_id: okyos[1].id, phrase_text: "当願衆生", meaning: "当に願わくは衆生と共に", reading: "とうがんしゅじょう", video_start_time: 61, video_end_time: 67, order: 6 },
  { okyo_id: okyos[1].id, phrase_text: "深入経蔵", meaning: "深く経蔵に入って", reading: "じんにゅうきょうぞう", video_start_time: 67, video_end_time: 71, order: 7 },
  { okyo_id: okyos[1].id, phrase_text: "智慧如海", meaning: "智慧海の如くならん", reading: "ちえにょかい", video_start_time: 71, video_end_time: 74, order: 8 },
  { okyo_id: okyos[1].id, phrase_text: "自帰依僧", meaning: "自ら僧に帰依し奉る", reading: "じきえそう", video_start_time: 75, video_end_time: 84, order: 9 },
  { okyo_id: okyos[1].id, phrase_text: "当願衆生", meaning: "当に願わくは衆生と共に", reading: "とうがんしゅじょう", video_start_time: 84, video_end_time: 90, order: 10 },
  { okyo_id: okyos[1].id, phrase_text: "統理大衆", meaning: "大衆を統理して", reading: "とうりだいしゅう", video_start_time: 90, video_end_time: 96, order: 11 },
  { okyo_id: okyos[1].id, phrase_text: "一切無礙", meaning: "一切無礙ならん", reading: "いっさいむげ", video_start_time: 96, video_end_time: 100, order: 12 }
])



OkyoPhrase.create!([
  { okyo_id: okyos[2].id, phrase_text: "一心頂礼", meaning: "ひたすらに礼拝いたします。", reading: "いっしん・ちょうらい", video_start_time: 18, video_end_time: 21, order: 1 },
  { okyo_id: okyos[2].id, phrase_text: "万徳円満", meaning: "多くの徳を十分に備えた", reading: "まんとく・えんまん", video_start_time: 21, video_end_time: 24, order: 2 },
  { okyo_id: okyos[2].id, phrase_text: "釈迦如来", meaning: "お釈迦さま＝仏さまの", reading: "しゃか・にょらい", video_start_time: 24, video_end_time: 28, order: 3 },
  { okyo_id: okyos[2].id, phrase_text: "真身舎利", meaning: "お体とお骨に対して、", reading: "しんじん・しゃり", video_start_time: 28, video_end_time: 31, order: 4 },
  { okyo_id: okyos[2].id, phrase_text: "本地法身", meaning: "また、その尊い仏さまの", reading: "ほんじ・ほっしん", video_start_time: 31, video_end_time:34, order: 5 },
  { okyo_id: okyos[2].id, phrase_text: "法界塔婆", meaning: "お骨を納めた供養塔に対して礼拝いたします。", reading: "ほっかい・とうば", video_start_time: 34, video_end_time: 37, order: 6 },
  { okyo_id: okyos[2].id, phrase_text: "我等礼敬", meaning: "このように私たちが礼拝いたしますと、", reading: "がとう・らいきょう", video_start_time:37 , video_end_time: 40, order: 7 },
  { okyo_id: okyos[2].id, phrase_text: "為我現身", meaning: "仏さまは私たちのために姿を現し、", reading: "いが・げんしん", video_start_time: 40, video_end_time: 43, order: 8 },
  { okyo_id: okyos[2].id, phrase_text: "入我我入", meaning: "私たちの心に寄り添い、仏さまと私たちは一つになったように感じるのです。", reading: "にゅうが・がにゅう", video_start_time: 43, video_end_time: 46, order: 9 },
  { okyo_id: okyos[2].id, phrase_text: "仏加持故", meaning: "こうして仏さまが守ってくれるように感じるからこそ、", reading: "ぶつが・じこ", video_start_time: 46, video_end_time: 48, order: 10 },
  { okyo_id: okyos[2].id, phrase_text: "我證菩提", meaning: "私たちは大切なものを得ることができ、", reading: "がしょう・ぼだい", video_start_time: 48, video_end_time: 51, order: 11 },
  { okyo_id: okyos[2].id, phrase_text: "以仏神力", meaning: "仏さまの見えない力によって、", reading: "いぶつ・じんりき", video_start_time:51, video_end_time: 54, order: 12 },
  { okyo_id: okyos[2].id, phrase_text: "利益衆生", meaning: "私たちは救われるのです。", reading: "りやく・しゅじょう", video_start_time: 54, video_end_time:57, order: 13 },
  { okyo_id: okyos[2].id, phrase_text: "発菩提心", meaning: "道を求めようと心を起こし、", reading: "ほつ・ぼだいしん", video_start_time: 50, video_end_time: 60, order: 14 },
  { okyo_id: okyos[2].id, phrase_text: "修菩薩行", meaning: "道を求めて行動すれば、", reading: "しゅう・ぼさつぎょう", video_start_time: 60, video_end_time: 63, order: 15 },
  { okyo_id: okyos[2].id, phrase_text: "同入円寂", meaning: "よりどころができて、みんな心やすらかとなることでしょう。", reading: "どうにゅう・えんじゃく", video_start_time: 63, video_end_time: 66, order: 16 },
  { okyo_id: okyos[2].id, phrase_text: "平等大智", meaning: "このように、人々を平等に導く仏さまの智慧（ちえ）に対して、", reading: "びょうどう・だいち", video_start_time: 66, video_end_time: 69, order: 17 },
  { okyo_id: okyos[2].id, phrase_text: "今将頂礼", meaning: "いま、まさに礼拝いたします。", reading: "こんしょう・ちょうらい", video_start_time: 69, video_end_time: 73, order: 18 }
])


# 式典・葬式データの作成
ceremonies = Ceremony.create!([
  { name: "春季法要", event_date: Date.new(2024, 3, 21), user_id: users[0].id, location: "浄光寺", description: "春のお彼岸法要" },
  { name: "施餓鬼法要", event_date: Date.new(2024, 7, 15), user_id: users[1].id, location: "龍泉寺", description: "先祖供養のための法要" }
])

# 式典・葬式用お経グループの作成
CeremonyOkyoGroup.create!([
  { okyo_id: okyos[0].id, ceremony_id: ceremonies[0].id, order: 1 },
  { okyo_id: okyos[1].id, ceremony_id: ceremonies[1].id, order: 1 }
])

# お経と宗派の関連付け
OkyoSectGroup.create!([
  { okyo_id: okyos[0].id, sect_id: sects[0].id },
  { okyo_id: okyos[0].id, sect_id: sects[1].id },
  { okyo_id: okyos[0].id, sect_id: sects[2].id },
  { okyo_id: okyos[1].id, sect_id: sects[1].id },
  { okyo_id: okyos[1].id, sect_id: sects[2].id }

])

puts "Seed data successfully loaded!"