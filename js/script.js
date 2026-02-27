// 三体编年史事件数据（来源：三体灰机Wiki）
const CHRONICLE_EVENTS = {"1453": ["5月3日16时高维碎块接触地球，狄奥伦娜接触到高维空间。", "5月28日21时碎块完全离开地球，29日傍晚君士坦丁堡陷落。"], "1922": ["冬季，叶哲泰的岳父（据考证，应为叶企孙）与爱因斯坦在上海南京路散步，有感中国“引力”太重。"], "1947": ["6月，叶文洁出生。"], "1962": ["叶文洁进入清华大学攻读天体物理专业。", "《寂静的春天》在美国出版。"], "1966": ["叶文洁在《天体物理学杂志》上发表《太阳辐射层内可能存在的能量界面和其反射特性》一文。"], "1967": ["叶文洁目睹父亲叶哲泰被清华附中红卫兵批斗致死。同年，叶文洁的妹妹叶文雪死于武斗，叶文洁被分配到内蒙古生产建设兵团。"], "1968": ["红岸基地在中国内蒙古大兴安岭某地建成。"], "1969": ["叶文洁在大兴安岭与记者白沐霖第一次接触《寂静的春天》，并产生了决定她一生的思想。", "叶文洁被白沐霖诬陷，遭到审问，判决前被杨卫宁调入红岸基地。"], "1970": ["夏季，叶文洁发现太阳的能量镜面效应与增益效应。"], "1971": ["叶文洁第一次向太阳发送信号，但未发现回波。"], "1973": ["叶文洁与杨卫宁结婚。"], "1975": ["在半人马座αb星，1379号监听员收到叶文洁在1971年发出的信息，并重复警告不要回答。三体世界得知了人类文明的存在。"], "1979": ["10月21日清晨，叶文洁接收到并译解了三体世界1379号监听员回复的警告信息，并不顾警告再次向三体文明发送信息。", "叶文洁得知红岸基地政委雷志成也收到了三体文明的信息，为保守秘密，她于1979年10月21日下午制造意外杀害了政委雷志成与丈夫杨卫宁。"], "1980": ["1980年前后，罗辑出生。", "6月，杨冬在红岸基地出生，叶文洁被允许到山下齐家屯暂住半年。"], "1982": ["叶哲泰平反，叶文洁回到清华大学教授天体物理。", "叶文洁与母亲和她现在的丈夫会面，不欢而散。随后，叶文洁约见打死父亲的三名红卫兵（还有一人已死于黄河凌汛），三名红卫兵无人忏悔。", "三体第一舰队在距离未知的情况下起航，为三体文明的命运搏一线希望。", "下半年，叶文洁在黄土高原某山区与麦克·伊文斯结识。"], "1983": ["1983年前后，云天明出生在北京。同年，程心出生，随即被遗弃，后被收养。"], "1984": ["三体世界收到了叶文洁在1979年回复的信息，人类文明的位置被确定。", "智子工程启动。"], "1985": ["伊文斯继承45亿美元遗产，并返回中国继续植树。", "叶文洁向伊文斯告知了三体文明的存在。", "第二红岸基地“审判日”号，于英国开始建造。"], "1986": ["程心在北京出生，遭遗弃，被其养母收养。"], "1987": ["红岸计划退出历史舞台，基地被撤销。"], "1988": ["“审判日”号在英国建成。", "伊文斯收到来自三体世界的信息，证实三体远征舰队已朝太阳系进发。", "地球三体组织（ETO）在伊文斯领导下成立，叶文洁成为统帅和精神领袖。", "三体世界建造的用于智子展开的巨型加速器基本建成，进入调试工作。"], "1990": ["三体行星轨道上的巨型加速器完全建成，智子工程正式启动。质子展开前两次失败，第三次获得成功。"], "1991": ["白沐霖于加拿大渥太华因患肺癌去世。"], "1992": ["智子1号竣工，更多智子开始建造。"], "1995": ["智子4号竣工，建立量子感应阵列。"], "1996": ["1996年冬，罗辑与杨冬成为高中同学。", "云天明父母离异。"], "1999": ["罗辑进入大学，攻读天文学专业。"], "2001": ["三体世界将1号、2号智子加速到接近光速，向太阳系发射。"], "2002": ["2002年6月，云天明与程心考入大学（疑为北航），就读航天发动机专业。同年，两人在图书馆楼顶仰望星河，并酝酿了一个美丽的童话。"], "2003": ["三体世界中断与太阳系的所有电磁信号通讯。"], "2004": ["叶文洁从清华大学退休。", "美军入侵委内瑞拉。", "宏原子被丁仪发现。"], "2005": ["第一批两个智子到达太阳系，人类前沿科技被锁死。", "年末，“科学边界”学会成立。"], "2006": ["年初，汪淼与申玉菲结识，收到“科学边界”学会邀请。", "史强涉嫌刑讯逼供使一名嫌疑人致残被公安部门停职，常伟思将其调入地球防务安全部。", "7月，云天明与程心大学毕业，程心于航天八院就读研究生，云天明就业，两人中断联系。", "罗辑入职清华大学教授社会学。", "汪淼于良湘“中华二号”高能加速器工地与杨冬、丁仪结识。"], "2007": ["大批理论科学家自杀。杨冬在得知母亲的秘密后自杀。", "汪淼与史强结识，开始协助调查“科学边界”学会。", "汪淼开始了解三体游戏，并看到智子制造的宇宙背景辐射的倒计时“神迹”。", "ETO在中国的集会被清缴，统帅叶文洁被捕。", "“古筝计划”实施，“审判日”号在通过巴拿马运河时被切割，ETO头目伊文斯阵亡。人类截获并解密ETO与三体世界的信息。至此，人类全面意识到三体文明与智子的存在。", "特别联大召开，改公元纪元为危机纪元，并成立行星防御理事会（PDC），常任理事国包括美、俄、中、英、法、日、德。", "三体文明真相公开后，叶文洁重回红岸遗址观日落后去世。", "人体冬眠技术全面解禁，人类迅速掌握了大幅跨越时间的能力。"], "2008": ["中国海军大校章北海被任命为航母“唐”号政委。", "程心博士毕业，进入长征火箭发动机研制课题组。", "PDC开始制定“面壁计划”。", "在第三届至第五届特别联大之间，国际社会爆发了“技术公有化运动”和逃亡主义有关热点话题"], "2009": ["中国太空军建立，章北海受命加入。", "第六届特别联大通过117号决议，宣布逃亡主义为非法。", "行星防御理事会战略情报局（PIA）成立，托马斯·维德任局长，程心随后调入PIA。", "程心在PIA的第一次会议上提出“阶梯计划”，得益于局长维德的努力，计划在随后召开的PDC常任理事国会议中通过", "第七届特别联大召开，备受关注的人类应对三体危机的计划推出，分别为主流防御计划和面壁计划。", "罗辑在成为面壁者前后遭遇两次刺杀，被史强解救后开始由他负责罗辑的安全并将其送至联合国参加特别联大", "“面壁计划”启动。弗雷德里克·泰勒、曼努尔·雷迪亚兹、比尔·希恩斯和罗辑成为面壁者。ETO的破壁计划随之启动。", "“面壁计划”第一次听证会召开，雷迪亚兹着手准备恒星级核弹计划，泰勒开始准备宏原子敢死队计划，希恩斯开始准备脑科学计划，罗辑则以自己拒绝面壁者使命为由缺席会议。", "罗辑利用面壁者身份移居北欧某地，即罗辑所谓“伊甸园”，并在史强帮助下找到自己的梦中情人庄颜。", "史强因白血病进入冬眠，或由于早年执行清剿ETO集会时受到核辐射导致。", "林格博士与斐兹罗将军通过哈勃二号空间望远镜观测到穿过第一片星际尘埃云的三体舰队，三体入侵被彻底证实，人类仅存的侥幸随之破灭。"], "2010": ["PDC第12次会议通过479号提案，“群星计划”正式启动。", "云天明收到大学同学胡文的赠款，得知自己的绝症治愈无望后，通过“群星计划”为程心购买了DX3906恒星，该星距太阳系286.5光年，视星等5.5。", "云天明进入肺癌晚期，决定安乐死，进行过程中被程心阻止，受邀加入“阶梯计划”。"], "2011": ["距三体世界7光年的一颗智子进入“智子盲区”，此后失去联系", "在“阶梯计划”候选人发言阶段，云天明拒绝对人类利益宣誓，通过了最后的测试。"], "2013": ["“阶梯计划”实施，云天明的大脑被送入太空，后载有云天明大脑的阶梯飞行器因偏航失踪。", "程心作为“阶梯计划”联络员进入冬眠。", "罗辑和庄颜拥有了一个女儿。", "空天飞机投入使用。", "太空电梯开始建设。"], "2014": ["面壁者泰勒被破壁人一号破壁。", "章北海提出'增援未来'计划", "面壁者泰勒与罗辑见面后在伊甸园冰湖中开枪自杀。", "“面壁计划”第89次听证会中，希恩斯与雷迪亚兹选择冬眠20年等待技术进步。", "联合国将庄颜和女儿带走并送入冬眠，以此迫使罗辑工作。", "章北海与丁仪在“高边疆”号上结识，得知可控核聚变的发展受人为限制。", "冬季，罗辑在伊甸园冰湖中悟出“黑暗森林”法则，并将恒星187J3X1的坐标广播作为对自己理论的证实。", "三体第一舰队派出10个水滴，试图抢先封锁太阳的电波放大功能以阻止人类进行广播。"], "2018": ["三体舰队穿过第二片星际尘埃云，人类观测到加速的水滴。", "年初，太空电梯天梯一号和天梯二号投入运行。同年，基点建立在海上的天梯三号也投入运行。", "可控核聚变取得突破。章北海再次与丁仪会面，了解航天系统内情。", "章北海利用陨石子弹在太空刺杀提倡工质飞船的专家，随后加入增援未来特遣队进入冬眠。"], "2021": ["无工质飞船项目启动。"], "2026": ["面壁者希恩斯与雷迪亚兹被唤醒。", "希恩斯发明思想钢印，开办信念中心。"], "2027": ["希恩斯再次冬眠，决定直达末日之战。"], "2029": ["雷迪亚兹主张建造的恒星型氢弹在水星地层实验成功。", "面壁者雷迪亚兹被破壁人二号破壁，伪装“摇篮”系统逃脱，后在委内瑞拉人民的怒火中被飞来的石头砸中死亡。"], "2034": ["大低谷时期开始"], "2037": ["思想钢印被宣布为非法并禁止。"], "2086": ["大低谷时期结束，人口由83亿降至35亿。"], "2111": ["ETO被剿灭，在此前研制出KILLER病毒。"], "2136": ["舰队国际成立，三大太空舰队成为独立国家。"], "2160": ["恒星187J3X1被光粒摧毁。"], "2201": ["关一帆出生"], "2204": ["丁仪苏醒，于北京大学物理系任教。"], "2208": ["三体舰队开始减速，人类观测到三体舰队损失严重。"], "2210": ["人类观测到恒星187J3X1被摧毁，但未引起重视。"], "2211": ["罗辑与希恩斯被唤醒，PDC通过649号提案，“面壁计划”中止。", "希恩斯被妻子山杉惠子以破壁人身份破壁，妻子自杀。ETO彻底退出历史舞台。", "罗辑与之前苏醒的史强重逢，当天遭到KILLER5.2的6起刺杀，被迫移居到地面的新生活五村。", "首个水滴抵达太阳系，林格·斐兹罗监测站观测到水滴开始减速。", "章北海向亚洲舰队报道，成为“自然选择”号执行舰长，受命调查钢印族。", "PIA向太阳系舰队发出水滴攻击的警报，但未受到重视。", "章北海操作自然选择号逃亡。舰队总部派出4艘恒星级战舰追击。", "水滴被激活，丁仪在考察水滴时死亡。", "“末日战役”爆发，人类两千余艘恒星级战舰在40分钟内被水滴摧毁，仅“量子”号与“青铜时代”号逃离。末日战役失败，人类社会陷入恐慌", "水滴开始压制太阳电波放大功能。", "“黑暗战役”爆发，逃亡战舰互相攻击，章北海阵亡。“青铜时代”号与“蓝色空间”号逃逸。", "“面壁计划”重新启动，罗辑恢复面壁者身份。", "罗辑开始领导“雪地”工程。"], "2213": ["“雪地”工程在部署3614枚恒星级核弹后陷入停顿。"], "2214": ["其余9个水滴到达太阳系。", "11月，罗辑在叶文洁和杨冬的墓碑旁与三体世界对决，最终建立威慑。", "三体第一舰队被迫转向，水滴就地隐藏，威慑纪元开启。", "威慑建立后，罗辑将“摇篮”系统上交联合国与舰队国际，18小时后又交还罗辑（此间三体世界没有任何行动，被后世认为是最大失误）。"], "2215": ["“青铜时代”号与“蓝色空间”号收到返航指令。"], "2218": ["三体世界协助人类建造引力波发射系统，罗辑一家团聚。"], "2219": ["极端组织“地球之子”袭击了位于南极的引力波发射台。人类社会决定削减引力波发射系统数量。"], "2220": ["庄颜带着孩子离开了罗辑。"], "2225": ["“青铜时代”号返回地球轨道，全舰乘员因“反人类罪”被捕。"], "2226": ["“青铜时代”号审判后，目标甄别官史耐德向蓝色空间号发出信息：“不要返航，这里不是家”。“蓝色空间”号加速逃离太阳系。", "“万有引力”号会同两个水滴，开始追击“蓝色空间”号。"], "2231": ["地球引力波发射系统拆除结束，仅保留3座在底层深处，至此人类的黑暗森林威慑系统仅剩三座地下发射系统和“万有引力”号飞船。"], "2233": ["反射文化取代地球本土文化，成为文化主流。"], "2248": ["艾AA出生。"], "2264": ["与“万有引力”号随行的水滴进入智子盲区，距太阳系1.3光年。"], "2265": ["“万有引力”号穿过奥尔特星云。"], "2270": ["三体第二舰队起航（配备空间曲率驱动引擎，具备光速航行能力）。"], "2274": ["艾AA利用恒星引力透镜效应发现了DX3906的行星，并因此结识程心。", "程心因DX3906的产权问题被唤醒。出售行星产权后获得巨额财富。后以此成立星环集团。", "维德为执剑人一事密谋射杀程心，程心身中两弹幸存。维德失去右臂，并被逮捕，以谋杀未遂判刑30年，后被减刑至11年，于广播纪元初出狱。", "程心受智子（人造仿生终端）蛊惑后决定参选执剑人。"], "2275": ["程心获选成为执剑人。", "11月18日16时，罗辑向程心移交威慑遥控装置，共在任54年。同时，奥尔特星云外的随行水滴按照预定程序对“蓝色空间”号与追击的“万有引力”号发起攻击，未遂，水滴从内部被摧毁。三体世界未在第一时间得知此结果。地球方面，隐藏在太阳系的八颗水滴开始加速撞向地球上的引力波发射装置。10分钟后，位于地球的三座引力波发射系统遭到摧毁，太阳电波放大功能被压制，至此威慑纪元结束。", "“蓝色空间”号与“万有引力”号全体成员通过全民公投，决定对三体世界实施报复，最终启动了引力波广播。", "威慑后第1~5天，在关一帆一再主张下，“蓝色空间”号与“万有引力”号组织联合考察队进入四维空间，与“墓地”进行对话，揭开了宇宙黑暗真相的一角。", "威慑后第27天，“墓地”湮灭在三维宇宙中。“蓝色空间”号与“万有引力”号200余名成员选择乘独立冬眠飞船返回太阳系，大部分船员继续按原计划驾驶两舰驶向宇宙深处。"], "2276": ["威慑后第60天，全人类开始向澳大利亚与火星的预留地移民。", "地球治安军与地球抵抗组织相继建立。罗辑成为抵抗组织精神领袖，其余6名执剑人候选者也全部参与抵抗运动。", "7月，堪培拉惨案发生，移民洗劫悉尼并与澳大利亚政府发生武装冲突，伤亡人数50余万。", "11月25日，移民完成，澳大利亚共聚集了41.6亿人。", "三体世界开始执行灭绝计划，命令地球治安军摧毁澳大利亚所有生存基础设施。程心因精神打击失明。", "地球得知“万有引力”号已经启动广播，灭绝计划终止，三体第二舰队转向，水滴撤离太阳系。广播纪元开始。", "智子屏蔽技术出现，实现有限空间内制造量子感应盲区。"], "2277": ["程心为治疗失明进入短期冬眠。"], "2278": ["三体世界的一颗母星被光粒摧毁，成为双星系统（包括两大舰队在内，三体文明幸存者不到千分之一）。"], "2282": ["程心苏醒，失明痊愈。", "三体世界的毁灭在地球被观测到，黑暗森林理论得到了最后的证实。", "智子邀请罗辑与程心进行了茶道谈话，为文明的生存寻求出路。", "程心收到云天明的对话邀请，但谈话内容受到苛刻的限制。", "程心与云天明在地日拉格朗日点通过智子进行通讯，云天明讲了三个童话，太阳系人类遂建立了IDC对云天明的童话进行了解读，并解读出了曲率驱动和黑域这两个人类文明生存的计划。"], "2283": ["瓦西里中尉通过林格-斐兹罗深空望远镜发现位于原三体世界的曲率航迹。", "通过太阳系预警系统观察并确认，曲率航迹在宇宙中普遍存在，证明宇宙中存在大量的高级智慧文明。", "光速飞船研究被立法禁止。", "黑暗森林打击误报发生，大量人员伤亡，社会受到极大触动。", "在掩体工程实验中，程心同意将星环集团交与维德接管。十天后，维德成为星环公司总裁。随后程心与艾AA一同进入冬眠。", "掩体工程启动。星环集团开始着手建造星环城作为曲率驱动的研究基地。"], "2300": ["由星环集团建造的环日加速器投入运行。"], "2336": ["掩体太空城初具规模，大部分人类已进入掩体，联邦政府宣布新年后改元为掩体纪元。"], "2337": ["人类为降低光速开始研究黑洞，高way成为该项目首席科学家。"], "2341": ["星环集团宣布开始研制曲率飞船，被联邦政府认为是严重践踏联邦法律的行为，联邦政府开始制裁星环集团。"], "2342": ["高way投入黑洞自杀，项目受挫。"], "2347": ["星环城宣布独立，联邦政府派遣联邦舰队封锁了星环城，冲突升级，星环城危机爆发。程心因此被唤醒。", "程心代表星环集团向联邦政府妥协，维德以反人类罪、战争罪和违反曲率驱动技术禁止法被判处死刑。在一道强激光中，托马斯·维德在万分之一秒内被汽化。时年，维德110岁，程心33岁", "程心唤醒艾AA，在地球上进行了短期的环球旅行，随后再次一同进入冬眠，她们要去到打击后的世界。"], "2380": ["丁仪的学生白Ice苏醒。"], "2382": ["罗辑牵头秘密重启光速飞船计划，在雷迪亚兹炸出的水星基地恢复研究。"], "2398": ["掩体世界收到来自银河系人类简短的引力波信息，来源坐标不明。"], "2399": ["人类制造的第一套曲率引擎（1号引擎）进行了十分钟的光速无人试航。"], "2402": ["1号引擎成功返回，随后引擎被安装到“星环”号上。2号、3号曲率飞船同时向太阳系外外试航，航行时间稍长，两套引擎已航行至奥尔特星云外，预计六年后返回。", "太阳系预警系统发现巨大未知文明飞船掠过奥尔特星云外侧，距太阳最近时仅1.3光年。该飞船飞掠太阳系时曾向太阳系发射了一个不明物体（后得知为二向箔）。为避免造成恐慌，联邦政府掩盖了这一发现。"], "2403": ["歌者收到一个“有诚意”的坐标，发现目标已经被清理后，向与其进行过三次电磁波通信的“弹星者”投掷二向箔。", "不知名文明向太阳系发射的二向箔已经飞抵太阳系内，白Ice乘“启示”号前去调查二向箔，最终被吞没。", "太阳系开始二维化，程心与艾AA苏醒，在冥王星墓碑与罗辑重逢。", "联邦政府在最后一刻宣布废除关于逃亡主义的一切法律，但为时已晚。", "程心与艾AA乘坐唯一一艘曲率飞船“星环”号离开太阳系，罗辑选择与冥王星一同二维化。掩体纪元结束，太阳系人类灭亡。"], "2589": ["银河纪元300年左右，银河系人类拥有了光速航行的能力。"], "2684": ["关一帆苏醒。"], "2689": ["程心与艾AA乘“星环”号飞行52小时（此时间是以飞船为参照系计算的，飞船外的时间是286.5年）后到达DX3906星系，降落于“蓝星”。", "程心、艾AA在“蓝星”与关一帆相遇。", "程心与关一帆前去“灰星”考察，云天明来到“蓝星”。归途时由于云天明使用光速飞船而触发死线，DX3906成为黑域，云天明和艾AA被困在蓝星上，程心和关一帆则被困于亚光速飞行的飞船中。"], "18906418": ["1890万年（以程心所在的以亚光速飞行的飞船为参照系的话约为16天）后，程心与关一帆回到地面，“蓝星”已变成“紫星”，他们发现了云天明留下的礼物——647号小宇宙。", "程心与关一帆进入647号宇宙，与智子重逢。"], "18906419": ["程心开始撰写回忆录《时间之外的往事》。", "这一年，647号小宇宙收到了来自大宇宙的超膜广播，呼吁参与“回归运动”。广播涉及语言157万种，人类与三体文明的存在最终被宇宙铭记。", "程心与关一帆最终决定回归大宇宙，仅留下一个5公斤的生态球以及记录人类与三体文明全部回忆的漂流瓶。"]};

// 三体舰队运行监控系统 - 核心逻辑

// 纪元定义 (根据需求说明)
const ERAS = [
    { name: '公元纪年', start: -Infinity, end: 2007, type: 'normal' },
    // 魔法时代: 1453年5月3日16时 - 1453年5月28日21时
    { 
        name: '魔法时代', 
        start: new Date(1453, 4, 3, 16).getTime(), 
        end: new Date(1453, 4, 28, 21).getTime(), 
        type: 'precise' 
    },
    { name: '黄金时代', start: 1980, end: 2007, type: 'normal' },
    { name: '危机纪元', start: 2007, end: 2214, type: 'normal' },   // XML: 公元2007~2214，208年
    { name: '威慑纪元', start: 2214, end: 2275, type: 'normal' },   // XML: 公元2214~2275，62年
    { name: '威慑后', start: 2275, end: 2276, type: 'normal' },     // XML: 公元2275~2276，2年
    { name: '广播纪元', start: 2276, end: 2336, type: 'normal' },   // XML: 公元2276~2336，61年
    { name: '掩体纪元', start: 2337, end: 2403, type: 'normal' },   // XML: 公元2337~2403，67年
    { name: '银河纪元', start: 2281, end: 2689, type: 'normal' },   // XML: 公元2281~不明
    { name: 'DX3906黑域纪元', start: 2689, end: 18906418, type: 'normal' }, // XML: 公元2689~不明
    { name: '647号宇宙时间线', start: 18906418, end: Infinity, type: 'normal' }, // XML: 公元18906418~不明
];

// 航行常量
const LIGHT_SPEED_KM_S = 299792.458; // 光速 km/s
const TOTAL_DISTANCE_LY = 4.22; // 总距离（光年）
const LY_TO_KM = 9.4607e12; // 1光年 = ? km
const TOTAL_DISTANCE_KM = TOTAL_DISTANCE_LY * LY_TO_KM;
const JOURNEY_START_YEAR = 1982; // 舰队出发年份
const JOURNEY_START_DATE = new Date('1982-01-01T00:00:00');

// 阶段定义 (时间单位: 年)
// 注意: 速度单位 km/s
const PHASES = [
    { 
        name: '加速阶段', 
        duration: 7 / 365.25, // 7天
        startSpeed: 0,
        endSpeed: 12.8 
    },
    { 
        name: '加速阶段', 
        duration: 174.8275, // 缩短后约 174.83年
        startSpeed: 12.8,
        endSpeed: LIGHT_SPEED_KM_S * 0.1 
    },
    { 
        name: '滑行阶段', 
        duration: 50, 
        startSpeed: LIGHT_SPEED_KM_S * 0.1,
        endSpeed: LIGHT_SPEED_KM_S * 0.1 
    },
    { 
        name: '减速阶段', 
        duration: 174.8275, // 缩短后约 174.83年
        startSpeed: LIGHT_SPEED_KM_S * 0.1,
        endSpeed: 0 
    }
];

// 预计算阶段结束时间和距离 (理论值)
let accumulatedTime = 0;
let accumulatedDistance = 0;
const PHASE_META = PHASES.map(phase => {
    const startTime = accumulatedTime;
    const endTime = accumulatedTime + phase.duration;
    
    // 距离积分: d = v0*t + 0.5*a*t^2
    // v(t) = v0 + a*t
    // a = (v1 - v0) / duration
    // convert duration to seconds for physics
    const durationSec = phase.duration * 365.25 * 24 * 3600;
    const accel = (phase.endSpeed - phase.startSpeed) / durationSec; // km/s^2
    
    const distanceKm = phase.startSpeed * durationSec + 0.5 * accel * durationSec * durationSec;
    const distanceLy = distanceKm / LY_TO_KM;

    accumulatedTime = endTime;
    accumulatedDistance += distanceLy;

    return {
        ...phase,
        startTime,
        endTime,
        distanceLy,
        accel
    };
});

// 计算缩放因子: 4.22 / 理论总距离
// 理论总距离大约是 25光年 (如果按0.1c跑200年)
// 为了匹配用户给定的 4.22光年，我们需要缩放距离
const SCALE_FACTOR = TOTAL_DISTANCE_LY / accumulatedDistance;

// 模拟时间逻辑
let IS_SIMULATING = false;
let SIMULATED_YEAR = new Date().getFullYear();
let SIMULATED_TIME_OFFSET = 0; // 毫秒偏移

let CURRENT_SPEED_PERCENT = 0;


function init() {
    updateDashboard();
    setInterval(updateDashboard, 100); // High refresh rate for smooth numbers
    createStars();
    initWarpController();
    initBackgroundRotation();
}

// 背景轮询切换逻辑
function initBackgroundRotation() {
    const bgImages = [
        'assets/images/bg.jpg',
        'assets/images/bg1.jpg',
        'assets/images/0.jpg'
    ];
    
    let currentBgIndex = 0;
    const starfield = document.getElementById('starfield');
    
    if (!starfield) return;

    // 每 3 分钟切换一次 (180000 毫秒)
    setInterval(() => {
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        const nextBg = bgImages[currentBgIndex];
        
        // 预加载图片以确保切换平滑
        const img = new Image();
        img.src = nextBg;
        img.onload = () => {
            // 切换背景，保持原有的 linear-gradient 遮罩
            starfield.style.backgroundImage = `linear-gradient(rgba(10, 14, 23, 0.7), rgba(10, 14, 23, 0.7)), url('${nextBg}')`;
        };
    }, 180000); 
}

let LAST_DISPLAYED_YEAR = null;

function updateDashboard() {
    let now = new Date();
    
    // 如果处于模拟模式，应用偏移量
    if (IS_SIMULATING) {
        now = new Date(now.getTime() + SIMULATED_TIME_OFFSET);
    }
    
    // 1. 更新纪元
    updateEra(now);

    // 2. 更新航行数据
    updateFleetStatus(now);

    // 3. 非穿梭模式下，跟随真实年份显示事件（年份变化时才刷新）
    if (!IS_SIMULATING) {
        const currentYear = now.getFullYear();
        if (currentYear !== LAST_DISPLAYED_YEAR) {
            LAST_DISPLAYED_YEAR = currentYear;
            showChronicleEvents(currentYear);
        }
    }
}

// 初始化时空穿梭控制器
function initWarpController() {
    const panel = document.getElementById('warpController');
    const warpModeBtn = document.getElementById('warpModeBtn');
    const slider = document.getElementById('warpSlider');
    const yearInput = document.getElementById('warpYearInput');
    const resetBtn = document.getElementById('resetTime');
    const warpDisplay = document.getElementById('warpYearDisplay');
    const markersContainer = document.getElementById('eraMarkers');
    
    if (!panel || !slider || !resetBtn || !warpModeBtn) return;

    const totalDuration = PHASE_META[PHASE_META.length-1].endTime;
    const arrivalYear = Math.ceil(JOURNEY_START_YEAR + totalDuration);
    
    const minYear = JOURNEY_START_YEAR;
    const maxYear = arrivalYear;
    slider.min = minYear;
    slider.max = maxYear;
    yearInput.min = minYear;
    yearInput.max = maxYear;

    const updateWarp = (year) => {
        const selectedYear = Math.max(minYear, Math.min(maxYear, parseInt(year)));
        const currentRealDate = new Date();
        const targetDate = new Date(currentRealDate);
        targetDate.setFullYear(selectedYear);
        
        SIMULATED_TIME_OFFSET = targetDate.getTime() - currentRealDate.getTime();
        IS_SIMULATING = true;
        
        warpDisplay.textContent = selectedYear + ' 年';
        slider.value = selectedYear;
        yearInput.value = selectedYear;
        document.body.classList.add('time-warping');
        resetBtn.style.opacity = '1';
        resetBtn.style.pointerEvents = 'auto';
        showChronicleEvents(selectedYear);
    };

    // 暴露给标记点击事件
    window.updateWarpFunction = updateWarp;

    // 滚轮微调：鼠标悬停在 warp 面板时，滚轮每格 ±1 年（按住 Shift 则 ±10 年）
    panel.addEventListener('wheel', (e) => {
        if (!panel.classList.contains('active')) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const direction = e.deltaY > 0 ? 1 : -1; // 向下滚 = 年份增加
        const currentYear = parseInt(slider.value) || minYear;
        updateWarp(currentYear + direction * step);
    }, { passive: false });

    // 1. 点击专门的 WARP MODE 按钮切换显示
    warpModeBtn.addEventListener('click', () => {
        const isActive = panel.classList.toggle('active');
        warpModeBtn.classList.toggle('active', isActive);
    });

    renderEraMarkers(markersContainer, minYear, maxYear);

    slider.addEventListener('input', (e) => updateWarp(e.target.value));
    yearInput.addEventListener('change', (e) => updateWarp(e.target.value));

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发面板切换
        IS_SIMULATING = false;
        SIMULATED_TIME_OFFSET = 0;
        LAST_DISPLAYED_YEAR = null; // 强制下一帧刷新当前年份事件
        const currentYear = new Date().getFullYear();
        slider.value = currentYear;
        yearInput.value = currentYear;
        warpDisplay.textContent = 'REAL-TIME';
        document.body.classList.remove('time-warping');
        resetBtn.style.opacity = '0';
        resetBtn.style.pointerEvents = 'none';
    });
}

function renderEraMarkers(container, minYear, maxYear) {
    if (!container) return;
    container.innerHTML = '';
    
    // 过滤出在航行期间切换的纪元
    const relevantEras = ERAS.filter(era => 
        era.type === 'normal' && era.start > minYear && era.start < maxYear
    );

    let lastPos = -20; // 记录上一个标记的位置百分比
    let staggerLevel = 0; // 0: 正常, 1: staggered, 2: staggered-deep

    relevantEras.forEach((era, index) => {
        const percent = ((era.start - minYear) / (maxYear - minYear)) * 100;
        const marker = document.createElement('div');
        
        // 判定是否重叠（小于 8% 视为拥挤）
        if (percent - lastPos < 8) {
            staggerLevel = (staggerLevel + 1) % 3; // 循环 0, 1, 2
        } else {
            staggerLevel = 0; // 空间足够，回归正常层级
        }

        let className = 'era-marker';
        if (staggerLevel === 1) className += ' staggered';
        if (staggerLevel === 2) className += ' staggered-deep';

        marker.className = className;
        marker.style.left = `${percent}%`;
        marker.title = `点击跳转到 ${era.name} 元年 (${era.start}年)`;
        
        marker.innerHTML = `
            <div class="marker-dot"></div>
            <div class="era-marker-label">${era.name}</div>
        `;

        // 添加点击跳转功能
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            const updateWarp = window.updateWarpFunction; 
            if (updateWarp) updateWarp(era.start);
        });

        container.appendChild(marker);
        lastPos = percent;
    });
}

function updateEra(date) {
    const year = date.getFullYear();
    const timestamp = date.getTime();
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const dateStr = `${month}月${day}日`;

    // 查找所有匹配的纪元
    let activeEras = [];
    for (let i = 0; i < ERAS.length; i++) {
        const era = ERAS[i];
        if (era.type === 'precise') {
            if (timestamp >= era.start && timestamp <= era.end) {
                activeEras.push(era);
            }
        } else {
            if (year >= era.start && (era.end === undefined || year < era.end || era.end === Infinity)) {
                activeEras.push(era);
            }
        }
    }

    if (activeEras.length === 0) activeEras = [ERAS[0]];

    // 格式化纪元名称: A / B
    const eraNames = activeEras.map(e => e.name).join(' / ');
    document.getElementById('eraName').textContent = eraNames;
    
    // 格式化纪元年份: 支持多纪元叠加，同时附上公元年份
    const eraYearParts = activeEras.map(era => {
        let eraYear;
        if (era.type === 'precise') {
            eraYear = '元年';
        } else if (era.start === -Infinity) {
            eraYear = year > 0 ? `${year}年` : `前${Math.abs(year)}年`;
        } else {
            const y = year - era.start + 1;
            eraYear = y === 1 ? '元年' : y + '年';
        }
        return `${era.name}${eraYear}`;
    });

    // 附上公元年份
    const eraYearsHtml = eraYearParts.join('<br>') + `<br><span style="font-size:0.85em;opacity:0.65;letter-spacing:1px;">公元 ${year} 年</span>`;
    
    document.getElementById('eraYearNum').innerHTML = eraYearsHtml;
    document.getElementById('eraDateTime').textContent = `${dateStr} ${timeStr}`;
    document.getElementById('commonYear').textContent = `(参考: 公元 ${year}年${month}月${day}日 ${timeStr})`;
    document.getElementById('commonTime').style.display = 'none';
}

function updateFleetStatus(now) {
    // 计算航行时间 (年)
    const msPerYear = 365.25 * 24 * 3600 * 1000;
    const elapsedMs = now - JOURNEY_START_DATE;
    const elapsedYears = elapsedMs / msPerYear;

    if (elapsedYears < 0) {
        // 还没出发
        updateDisplay(0, 0, 0, '未出发', 0);
        return;
    }

    // 确定当前阶段
    let currentPhase = PHASE_META[PHASE_META.length - 1];
    let phaseIndex = PHASE_META.length - 1;
    let isFinished = false;

    if (elapsedYears >= PHASE_META[PHASE_META.length - 1].endTime) {
        isFinished = true;
    } else {
        for (let i = 0; i < PHASE_META.length; i++) {
            if (elapsedYears < PHASE_META[i].endTime) {
                currentPhase = PHASE_META[i];
                phaseIndex = i;
                break;
            }
        }
    }

    // 计算当前速度和距离
    // 如果已经到达，直接设为结束状态
    if (isFinished) {
        updateDisplay(0, 0, elapsedYears * 0.08, '已到达太阳系', elapsedYears);
        return;
    }

    const timeInPhase = elapsedYears - currentPhase.startTime; // years
    const timeInPhaseSec = timeInPhase * 365.25 * 24 * 3600;
    
    // v = v0 + at
    let currentSpeed = currentPhase.startSpeed + currentPhase.accel * timeInPhaseSec;
    // Clamp speed if beyond phase end (shouldn't happen with logic above unless last phase)
    if (elapsedYears > PHASE_META[PHASE_META.length-1].endTime) {
        currentSpeed = 0;
    }

    // 计算当前累计距离 (理论值)
    let dist = 0; // light years
    for (let i = 0; i < phaseIndex; i++) {
        dist += PHASE_META[i].distanceLy;
    }
    // Add distance in current phase
    // d = v0*t + 0.5*a*t^2
    const distInPhaseKm = currentPhase.startSpeed * timeInPhaseSec + 0.5 * currentPhase.accel * timeInPhaseSec * timeInPhaseSec;
    dist += distInPhaseKm / LY_TO_KM;

    // 应用缩放因子
    const displayDistLy = dist * SCALE_FACTOR;
    
    // 剩余距离
    let remainingLy = TOTAL_DISTANCE_LY - displayDistLy;
    if (remainingLy < 0) remainingLy = 0;

    // 损耗率: 0.08% * 航行年数
    // 增加小数位以显示微小变化，即便每分钟变化微小，但在高精度下可见
    const attrition = elapsedYears * 0.08;

    updateDisplay(currentSpeed, remainingLy, attrition, currentPhase.name, elapsedYears);
}

function updateDisplay(speed, remainingLy, attrition, phaseName, elapsedYears) {
    // 速度
    // Add micro-fluctuation to make it look "alive" (sensor noise)
    const noise = (Math.random() - 0.5) * 0.00001; 
    const displaySpeed = speed > 0 ? speed + noise : speed;
    
    document.getElementById('speedValue').textContent = displaySpeed.toFixed(6) + ' km/s';
    // 光速比例显示（使用真实速度避免噪点抖动）
    const cFrac = speed > 0 ? (speed / LIGHT_SPEED_KM_S) : 0;
    document.getElementById('speedC').textContent = cFrac.toFixed(3) + 'c';
    document.getElementById('speedPhase').textContent = phaseName;
    
    // 进度条 (基于最大速度 0.1c = ~30000)
    const maxSpeed = LIGHT_SPEED_KM_S * 0.1;
    const speedPercent = Math.min(100, (speed / maxSpeed) * 100);
    document.getElementById('speedProgress').style.width = speedPercent + '%';
    CURRENT_SPEED_PERCENT = speedPercent;

    // 距离
    if (remainingLy <= 0) {
        document.getElementById('distanceValue').textContent = '已到达太阳系';
        document.getElementById('distanceKm').textContent = '0.00 km';
    } else {
        document.getElementById('distanceValue').textContent = '距太阳系 ' + remainingLy.toFixed(4) + ' 光年';
        const remainingKm = remainingLy * LY_TO_KM;
        document.getElementById('distanceKm').textContent = remainingKm.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' km';
    }
    
    // 距离进度 (总距离 - 剩余) / 总距离
    const distPercent = Math.min(100, ((TOTAL_DISTANCE_LY - remainingLy) / TOTAL_DISTANCE_LY) * 100);
    document.getElementById('distanceProgress').style.width = distPercent + '%';

    // 损耗 - 恢复正常精度 (例如2位小数)，但底层计算仍然是实时的
    document.getElementById('attritionValue').textContent = attrition.toFixed(2) + '%';
    document.getElementById('attritionDetail').textContent = `${elapsedYears.toFixed(2)} 年`;

    // 预计到达
    const totalDuration = PHASE_META[PHASE_META.length-1].endTime;
    const remainingYears = totalDuration - elapsedYears;
    const arrivalYear = JOURNEY_START_YEAR + totalDuration;
    
    if (remainingYears > 0) {
        // 显示具体的预计到达日期
        const arrivalDate = new Date(JOURNEY_START_DATE.getTime() + totalDuration * 365.25 * 24 * 3600 * 1000);
        const arrivalYearStr = arrivalDate.getFullYear();
        const arrivalMonth = arrivalDate.getMonth() + 1;
        const arrivalDay = arrivalDate.getDate();
        
        document.getElementById('arrivalValue').textContent = `公元 ${arrivalYearStr}年${arrivalMonth}月${arrivalDay}日`;
        // 恢复剩余航程的正常显示精度
        document.getElementById('arrivalDetail').textContent = `剩余航程：${remainingYears.toFixed(2)} 年`;
        const arrivalPercent = (elapsedYears / totalDuration) * 100;
        document.getElementById('arrivalProgress').style.width = arrivalPercent + '%';
    } else {
        document.getElementById('arrivalValue').textContent = '已到达';
        document.getElementById('arrivalDetail').textContent = '航程结束';
        document.getElementById('arrivalProgress').style.width = '100%';
    }
}


function showChronicleEvents(year) {
    const panel = document.getElementById('eventsPanel');
    const list = document.getElementById('eventsList');
    const badge = document.getElementById('eventsYearBadge');
    if (!panel || !list) return;

    const events = CHRONICLE_EVENTS[String(year)];

    badge.textContent = `公元 ${year} 年`;

    if (!events || events.length === 0) {
        list.innerHTML = '<div class="events-empty">◈ 本年度暂无记录事件</div>';
        return;
    }

    list.innerHTML = events.map((e, i) => `
        <div class="event-item" style="animation-delay: ${i * 0.06}s">
            <span class="event-dot">▶</span>
            <span class="event-text">${e}</span>
        </div>
    `).join('');
}

function clearChronicleEvents() {
    const list = document.getElementById('eventsList');
    const badge = document.getElementById('eventsYearBadge');
    if (badge) badge.textContent = '--';
    if (list) list.innerHTML = '<div class="events-empty">◈ 开启时空穿梭后，拖动时间轴查看该年发生的事件</div>';
}

function createStars() {}

document.addEventListener('DOMContentLoaded', init);

 
