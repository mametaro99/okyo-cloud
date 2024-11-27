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
  { name: "般若心経", description: "智慧の完成を説いたお経", video_url: "https://youtu.be/sample1", article_url: "https://blog.example.com/sample1", published: true },
  { name: "観音経", description: "観音菩薩の慈悲を説いたお経", video_url: "https://youtu.be/sample2", article_url: "https://blog.example.com/sample2", published: true }
])



OkyoPhrase.create!([
  { okyo_id: okyos[0].id, phrase_text: "照見五蘊皆空　度一切苦厄", meaning: "観音菩薩が五蘊（肉体、感覚、イメージ、意思、認識）を見て、それらがすべて空であることを照らし出し、一切の苦しみを除く", reading: "しょうけんごうんかいくう　どいっさいくやく", video_start_time: 0, video_end_time: 0, order: 2 },

  { okyo_id: okyos[0].id, phrase_text: "観自在菩薩　行深般若波羅蜜多時", meaning: "観音菩薩が、 さとりの世界へ到る修行を実践されているとき", reading: "かんじざいぼさつ　ぎょうじんはんにゃはらみったじ", video_start_time: 0, video_end_time: 0, order: 1 },
  
  { okyo_id: okyos[0].id, phrase_text: "舍利子　色不異空　空不異色", meaning: "舎利子よ、カタチあるものには実体がなく、実体がないものもカタチあるものと異ならない", reading: "しゃりし　しきふいくう　くうふいしき", video_start_time: 0, video_end_time: 0, order: 3 },

  { okyo_id: okyos[0].id, phrase_text: "色即是空　空即是色", meaning: "カタチあるものはすべて空であり、空はカタチを含んでいる", reading: "しきそくぜくう　くうそくぜしき", video_start_time: 0, video_end_time: 0, order: 4 },

  { okyo_id: okyos[0].id, phrase_text: "受想行識亦復如是", meaning: "感覚、イメージ、意思、認識などもまた同じように実体がない", reading: "じゅそうぎょうしきやくぶにょぜ", video_start_time: 0, video_end_time: 0, order: 5 },

  { okyo_id: okyos[0].id, phrase_text: "舍利子　是諸法空相", meaning: "舎利子よ、存在するあらゆるものには実体がない空の相がある", reading: "しゃりし　ぜしょほうくうそう", video_start_time: 0, video_end_time: 0, order: 6 },

  { okyo_id: okyos[0].id, phrase_text: "不生不滅　不垢不浄　不増不減", meaning: "それらは生じず滅せず、汚れも浄まりもなく、増えも減りもない", reading: "ふしょう　ふめつ　ふくふじょう　ふぞうふげん", video_start_time: 0, video_end_time: 0, order: 7 },

  { okyo_id: okyos[0].id, phrase_text: "是故空中　無色　無受想行識", meaning: "したがって、空中にはカタチも感覚、イメージ、意思、認識も存在しない", reading: "ぜこくうちゅう　むしき　むじゅそうぎょうしき", video_start_time: 0, video_end_time: 0, order: 8 },

  { okyo_id: okyos[0].id, phrase_text: "無眼耳鼻舌身意　無色声香 味 触 法", meaning: "目・耳・鼻・舌・身体・心がなく、それらがもたらす感覚も存在しない", reading: "むげんにびぜっしん い　むしきしょうこうみそくほう", video_start_time: 0, video_end_time: 0, order: 9 },

  { okyo_id: okyos[0].id, phrase_text: "無眼界　乃至無意識界", meaning: "目に見える世界から意識する感覚に至るまで、すべてが存在しない", reading: "むげんかい　ないしむいしきかい", video_start_time: 0, video_end_time: 0, order: 10 },

  { okyo_id: okyos[0].id, phrase_text: "無無明亦　無無明尽", meaning: "無明（無知）もなく、それが尽きることもない", reading: "むむみょうやく　むむみょうじん", video_start_time: 0, video_end_time: 0, order: 11 },

  { okyo_id: okyos[0].id, phrase_text: "乃至無老死　亦無老死尽", meaning: "老いも死もなく、それが尽きることもない", reading: "ないしむろうし　やくむろうしじん", video_start_time: 0, video_end_time: 0, order: 12 },

  { okyo_id: okyos[0].id, phrase_text: "無苦集滅道　無智亦無得", meaning: "苦しみの原因、滅する方法もなく、知恵も得ることもない", reading: "むくしゅうめつ どう　むちやくむとく", video_start_time: 0, video_end_time: 0, order: 13 },

  { okyo_id: okyos[0].id, phrase_text: "以無所得故　菩提薩埵　依般若波羅蜜多故", meaning: "何も得るものがないからこそ、菩薩は智慧に依り、般若波羅蜜多に依る", reading: "いむしょとくこ　ぼだいさった　えはんにゃはらみったこ", video_start_time: 0, video_end_time: 0, order: 14 },

  { okyo_id: okyos[0].id, phrase_text: "心無罣礙　無罣礙故　無有恐怖", meaning: "心にこだわりがないから、恐れもない", reading: "しんむけいげ　むけいげこ　むうくふ", video_start_time: 0, video_end_time: 0, order: 15 },

  { okyo_id: okyos[0].id, phrase_text: "遠離 一切顛倒夢想　究竟涅槃", meaning: "一切の誤った考えや夢想から遠く離れて、究極の涅槃に至る", reading: "おんりいっさいてんどうむそう　くきょうねはん", video_start_time: 0, video_end_time: 0, order: 16 },

  { okyo_id: okyos[0].id, phrase_text: "三世諸仏　依般若波羅蜜多故", meaning: "過去・現在・未来のすべての仏は、この智慧によってさとりを得た", reading: "さんぜしょぶつ　えはんにゃはらみったこ", video_start_time: 0, video_end_time: 0, order: 17 },

  { okyo_id: okyos[0].id, phrase_text: "得阿耨多羅三藐三菩提", meaning: "完全なさとりを得る", reading: "とくあのくたらさんみゃくさんぼだい", video_start_time: 0, video_end_time: 0, order: 18 },

  { okyo_id: okyos[0].id, phrase_text: "故知般若波羅蜜多", meaning: "だから、般若波羅蜜多を知るべきである", reading: "こちはんにゃはらみった", video_start_time: 0, video_end_time: 0, order: 19 },

  { okyo_id: okyos[0].id, phrase_text: "是大神呪　是大明呪", meaning: "これは偉大な呪文であり、偉大な明らかにする呪文である", reading: "ぜだいじんしゅ　ぜだいみょうしゅ", video_start_time: 0, video_end_time: 0, order: 20 },

  { okyo_id: okyos[0].id, phrase_text: "是無上呪　是無等等呪", meaning: "これが最も高い呪文であり、比類のない呪文である", reading: "ぜむじょうしゅ　ぜむとうどうしゅ", video_start_time: 0, video_end_time: 0, order: 21 },

  { okyo_id: okyos[0].id, phrase_text: "能除一切苦　真実不虚", meaning: "あらゆる苦しみを除くことができ、真実で虚偽はない", reading: "のうじょいっさいく　しんじつふきょ", video_start_time: 0, video_end_time: 0, order: 22 },

  { okyo_id: okyos[0].id, phrase_text: "故説般若波羅蜜多呪", meaning: "それゆえ、般若波羅蜜多の呪文を説く", reading: "こせつはんにゃはらみったしゅ", video_start_time: 0, video_end_time: 0, order: 23 },

  { okyo_id: okyos[0].id, phrase_text: "般若波羅蜜多呪　即説呪曰", meaning: "般若波羅蜜多の呪文は、これであると説かれる", reading: "はんにゃはらみったしゅ　そくせつしゅわつ", video_start_time: 0, video_end_time: 0, order: 24 },

  { okyo_id: okyos[0].id, phrase_text: "揭諦揭諦　波羅揭諦　波羅僧揭諦　菩提薩婆訶", meaning: "行け、行け、超えて行け、最も向こうに行け、悟りの岸に渡れ、歓喜を持って", reading: "けいだいけいだい　はらけいだい　はらそうけいだい　ぼだいさっぱか", video_start_time: 0, video_end_time: 0, order: 25 }
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
  { okyo_id: okyos[1].id, sect_id: sects[2].id }
])

puts "Seed data successfully loaded!"