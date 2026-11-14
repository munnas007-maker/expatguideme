/* =========================================================
   ExpatGuideME – shared site behaviour
   Language, dark mode, mobile menu, search, scroll progress,
   back-to-top, cookie banner, Netlify forms, UTM tags,
   copy buttons, "last updated" dates, print helpers.
   Pages listen with ExpatSite.onLang(fn).
   ========================================================= */
(function () {
  "use strict";

  var PREF_KEY = "expatguideme_prefs_v1";
  var THEME_KEY = "expatguideme_theme";
  var COOKIE_KEY = "expatguideme_cookie_ok_v1";

  var LANGS = {
    en: { name: "English", dir: "ltr", locale: "en-GB" },
    ar: { name: "العربية", dir: "rtl", locale: "ar" },
    hi: { name: "हिन्दी", dir: "ltr", locale: "hi-IN" },
    ml: { name: "മലയാളം", dir: "ltr", locale: "ml-IN" },
    ne: { name: "नेपाली", dir: "ltr", locale: "ne-NP" },
    ur: { name: "اردو", dir: "rtl", locale: "ur-PK" },
    bn: { name: "বাংলা", dir: "ltr", locale: "bn-BD" },
    tl: { name: "Tagalog", dir: "ltr", locale: "fil-PH" }
  };

  var S = {
    en: {
      skip: "Skip to content", navHome: "Home", navExchange: "Exchange rate", navSend: "Send money", navContact: "Contact", navPrivacy: "Privacy",
      menu: "Menu", close: "Close", search: "Search", searchPh: "Search tools and guides…",
      noResults: "No results. Try another word.", language: "Language",
      themeDark: "Switch to dark mode", themeLight: "Switch to light mode",
      toTop: "Back to top", contactUs: "Contact us",
      nlTitle: "Get new guides by email", nlText: "One short email when we add a new tool or guide. No spam.",
      nlEmail: "Your email address", nlButton: "Subscribe", sending: "Sending…",
      nlSuccess: "Thank you! You're subscribed.", invalidEmail: "Please enter a valid email address.",
      formRequired: "Please fill in all fields.", formError: "Something went wrong. Please try again.",
      cookieText: "We use your browser's storage to remember your language and settings. Our advertising partners, including Google, may use cookies to show ads.",
      cookieLearn: "Privacy policy", cookieOk: "OK", lastUpdated: "Last updated:",
      disclaimer: "This is an independent website. It is not connected to any government office or bank.",
      copy: "Copy", copied: "Copied ✓", navEos: "End of service", navId: "ID & residency", navFamily: "Family cost", navEmbassy: "Embassy services", navAbout: "About us", navTerms: "Terms of use", navAffiliate: "Affiliate disclosure", footerTools: "Tools", footerSite: "Website", ad: "Advertisement", pfExQ: "What is today's riyal rate to rupee, taka or peso?", pfExA: "This page shows the live market rate from the Saudi riyal, UAE dirham, Kuwaiti dinar, Qatari riyal, Omani rial and Bahraini dinar to your home currency. Whether you search for “aaj ka riyal rate”, “innathe riyal rate”, “ajker riyal rate” or “palitan ng riyal to peso”, the numbers above are today's rate.", pfSendQ: "Which app gives the best riyal rate today for sending money home?", pfSendA: "Choose your route above, for example Saudi Arabia to India, Bangladesh, Pakistan, Nepal or the Philippines. You see the live market rate with its exact update time, and each bank, exchange and wallet with its own rate once our team has checked it in that company's app.", pfEosQ: "How do I use the Saudi end of service calculator?", pfEosA: "Choose Saudi Arabia (or your Gulf country), enter your basic salary, allowances and years of service, and say whether you resigned. The calculator applies Articles 84 and 85 of the Saudi Labor Law and shows your gratuity in seconds.", pfIdQ: "How do I check my iqama expiry date?", pfIdA: "In Saudi Arabia, open the Absher app: your iqama number and expiry date are on the dashboard. For Kuwait use Sahel, for Qatar use Metrash, and for Oman and Bahrain see the guide above. You can also add a renewal reminder to your phone below.", pfFamQ: "How much does it cost to live with family in Saudi Arabia per month?", pfFamA: "It depends on rent, school fees and the number of dependents. Enter your own costs in the calculator above: it adds the Saudi dependent fee of SAR 400 per person per month automatically and shows what is left to save.", pfEmbQ: "How do I renew my passport while working in the Gulf?", pfEmbA: "Choose your nationality and the country you live in above. You will see the official embassy website, where to apply, and links for passport renewal, police certificates and attestation.", popConv: "Popular conversions", sumExQ: "What is today's Gulf currency rate to rupee, taka and peso?", sumExA: "The table shows today's market rate from each Gulf currency to the Indian rupee, Pakistani rupee, Bangladeshi taka, Philippine peso and Nepali rupee. Banks and transfer apps pay slightly less, so use it as a reference and compare providers before you send.", sumSendQ: "How much does my family receive for 1,000 riyals or dirhams?", sumSendA: "At today's market rate, 1,000 in each Gulf currency is worth the amounts in the table. Your family usually receives a little less after the provider's margin and fee, so the comparison below sorts every provider by what actually arrives.", sumEosQ: "How much end of service award do I get in Saudi Arabia?", sumEosA: "Under Articles 84 and 85 of the Saudi Labor Law, the award is half a month's wage for each of the first five years and a full month's wage for each year after that. If you resign, you get one third after 2 years, two thirds after 5 years and the full award after 10 years.", sumIdQ: "Which ID do expats need in each Gulf country, and where do I check it?", sumIdA: "Each Gulf country issues its own residence ID card. The table shows its name and the official app or portal where you can check its status and expiry date.", sumFamQ: "How much is the Saudi dependent fee per year?", sumFamA: "In Saudi Arabia the dependent fee is SAR 400 per family member per month, paid when the Iqama is issued or renewed. The table shows the cost by number of dependents; add rent, school fees and daily costs in the calculator below.", sumEmbQ: "Where do I renew my passport while living in Saudi Arabia?", sumEmbA: "Passport renewal, police certificates and attestation are handled by your country's embassy and its official service centres. The table lists the official websites for Indian, Pakistani and Nepali citizens in Saudi Arabia; choose your country above for the other Gulf states.", thGcc: "Gulf currency", thMarketOn: "Market rate on", thYouSend: "You send", thYears: "Years of service", thAward: "Contract ends (months of wage)", thResign: "You resign (months of wage)", thCountry: "Country", thIdName: "Residence ID", thCheck: "Check it in", thDeps: "Dependents", thMonth: "Per month", thYear: "Per year", thNat: "Nationality", thEmb: "Embassy website", thPass: "Online passport service", cSA: "Saudi Arabia", cKW: "Kuwait", cQA: "Qatar", cOM: "Oman", cBH: "Bahrain", cIN: "India", cPK: "Pakistan", cNP: "Nepal", navApp: "Mobile app", appBar: "The ExpatGuideME app is coming to Android and iPhone.", appBarInstall: "Install now", appBarMore: "Notify me", appClose: "Close", appSoonAndroid: "Coming soon on Android", appSoonIos: "Coming soon on iPhone", appGet: "Get the app", appInstallBtn: "Install the web app", appTitle: "The ExpatGuideME app", appLead: "All our free Gulf expat tools in one app: exchange rates, money transfer comparison, end of service, vacation and family cost calculators, in 8 languages. The Android and iPhone apps are on the way.", appF1: "Today's rates on your home screen", appF2: "Calculators that work without internet", appF3: "Payday and Iqama renewal reminders", appF4: "Your language: 8 languages, including Arabic, Urdu and Bengali", appNotifyTitle: "Get a message when the app launches", appNotifyText: "Leave your email and we will send you one message when the app is in Google Play and the App Store. No spam.", appEmail: "Your email", appNotifyBtn: "Notify me at launch", appNotifyOk: "Thank you! We will email you when the app launches.", appNowTitle: "Use it as an app today", appNowText: "You don't need to wait. Add ExpatGuideME to your home screen and it opens like an app, even without internet for the calculators.", appAndroidHow: "On Android (Chrome): tap Install, or open the ⋮ menu and choose Add to Home screen.", appIosHow: "On iPhone (Safari): tap the Share button, then Add to Home Screen.", appInstalled: "ExpatGuideME is already installed on this device.", offTitle: "You are offline", offText: "This page is not saved on your device yet. The pages you have opened before still work: try the end of service, vacation, family cost or embassy pages.", offRetry: "Try again", navVac: "Vacation & leave", xVac: "Also check your unused vacation cash payout", cAE: "UAE", thDaysYear: "Annual leave per year", sumVacQ: "How many annual leave days do expats get in each Gulf country?", sumVacA: "Saudi Arabia gives 21 days a year, rising to 30 after 5 years with the same employer; Qatar gives 21 days, rising to 28 after 5 years. The UAE, Kuwait, Oman and Bahrain give 30 days a year. These are legal minimums, and unused days must be paid when you leave.", sendVia: "Send via {name} →", affNote: "Some providers are sponsored partners or have partner (“Send via”) links: we may earn a commission at no extra cost to you, and it never changes the order of this table.", affLink: "Affiliate disclosure", appPrivT: "Mobile app launch list", appPrivA: "If you join the app launch list on our Mobile app page, we receive only your email address and your chosen language. We use them solely to tell you when the ExpatGuideME app is available in Google Play and the App Store. We will never sell, rent or share your email address with anyone, and you can ask us to delete it at any time through the contact page.", vacBaseNote: "Kuwait, Oman and Bahrain: the cash value uses your full wage by default. If your contract pays leave on basic salary, switch to “Basic salary only”.", sponsoredBadge: "Sponsored partner", essT: "Expat essentials", essNote: "Sponsored links. We may earn a commission.", esimT: "Mobile data & eSIM", esimD: "Local and roaming eSIM plans for travel home.", insT: "Health insurance", insD: "Compare cover for you and your family.", moveT: "Relocation & shipping", moveD: "Move your belongings between the Gulf and home.", navConsult: "Ask an expert", navPlaybook: "Financial playbook", xConsult: "Not sure your calculation is right? Request a professional review", consentRequired: "Please tick the box to agree before sending.", affSponsT: "Sponsored placements, partner offers and our own guide", affSponsA: "Some money transfer providers may pay to be shown as a “Sponsored partner”. They get a label and a highlighted row, but they stay in the same place in the table, which is always sorted by what your family receives. The “Expat essentials” card contains sponsored links only. The Financial Playbook is our own paid guide, and we say so on its page.", privConsultT: "Expert review requests", privConsultA: "If you request an expert review, we receive your name, email, country, topic and message. We use them only to answer your request and, if you agree on the form, to pass them to one independent advisor who can help. We never sell your details. Do not send ID numbers, passwords or bank details. You can ask us to delete your request at any time through the contact page.", privGuideT: "Playbook waitlist and purchases", privGuideA: "If you join the Financial Playbook waitlist, we use your email only to tell you when the guide is available. Payments are handled by the checkout provider shown at payment; we never see your card details.", navGold: "Gold rate", sumGoldQ: "What is the gold rate per gram in the Gulf today?", sumGoldA: "The table shows this morning's spot gold price per gram in each Gulf currency for 24K, 22K and 21K gold. The live price at the top of the page updates through the day; shop prices add a small premium and making charges.", thPerGram: "Per gram", countryPick: "Your country", rUpdated: "Updated {time}", rFallback: "Live rates could not be loaded. Showing the last saved rates from {time}.", navSim: "SIM & internet", navVisa: "Family & visit visa", bnRates: "Rates", bnSend: "Send", bnGold: "Gold", bnMore: "More", themeLabel: "Dark / light mode", trendTitle: "Trend", trend30: "Last 30 days", trendEcb: "Daily reference rates from the European Central Bank (via frankfurter.app).", trendOwn: "Readings saved every 2 hours since {date}.", trendWait: "Not enough readings yet for a chart. We save one every 2 hours, so it fills in soon.", tHigh: "High", tLow: "Low", tChange: "Change", secPrices: "Prices", secCalc: "Calculator", secTrend: "Trend", secDuty: "India duty", secConvert: "Converter", secRates: "All rates", secFaq: "FAQ", allCur: "1 {cur} in every currency"
    },
    ar: {
      skip: "انتقل إلى المحتوى", navHome: "الرئيسية", navExchange: "سعر الصرف", navSend: "تحويل الأموال", navContact: "اتصل بنا", navPrivacy: "الخصوصية",
      menu: "القائمة", close: "إغلاق", search: "بحث", searchPh: "ابحث في الأدوات والأدلة…",
      noResults: "لا توجد نتائج. جرّب كلمة أخرى.", language: "اللغة",
      themeDark: "التبديل إلى الوضع الداكن", themeLight: "التبديل إلى الوضع الفاتح",
      toTop: "العودة إلى الأعلى", contactUs: "اتصل بنا",
      nlTitle: "احصل على الأدلة الجديدة بالبريد", nlText: "رسالة قصيرة واحدة عند إضافة أداة أو دليل جديد. بلا رسائل مزعجة.",
      nlEmail: "بريدك الإلكتروني", nlButton: "اشترك", sending: "جارٍ الإرسال…",
      nlSuccess: "شكرًا لك! تم اشتراكك.", invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      formRequired: "يرجى تعبئة جميع الحقول.", formError: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      cookieText: "نستخدم تخزين المتصفح لتذكّر لغتك وإعداداتك، وقد يستخدم شركاؤنا في الإعلانات، ومنهم جوجل، ملفات تعريف الارتباط لعرض الإعلانات.",
      cookieLearn: "سياسة الخصوصية", cookieOk: "موافق", lastUpdated: "آخر تحديث:",
      disclaimer: "هذا موقع مستقل، ولا علاقة له بأي جهة حكومية أو بنك.",
      copy: "نسخ", copied: "تم النسخ ✓", navEos: "نهاية الخدمة", navId: "الهوية والإقامة", navFamily: "تكلفة العائلة", navEmbassy: "خدمات السفارات", navAbout: "من نحن", navTerms: "شروط الاستخدام", navAffiliate: "الإفصاح عن روابط الشراكة", footerTools: "الأدوات", footerSite: "الموقع", ad: "إعلان", pfExQ: "كم سعر الريال اليوم مقابل الروبية أو التاكا أو البيزو؟", pfExA: "تعرض هذه الصفحة سعر السوق المباشر من الريال السعودي والدرهم الإماراتي والدينار الكويتي والريال القطري والريال العُماني والدينار البحريني إلى عملة بلدك، والأرقام أعلاه هي سعر اليوم.", pfSendQ: "أي تطبيق يعطي أفضل سعر للريال اليوم لتحويل الأموال؟", pfSendA: "اختر مسارك أعلاه، مثل السعودية إلى الهند أو بنغلاديش أو باكستان أو نيبال أو الفلبين. سترى سعر السوق المباشر مع وقت تحديثه بالضبط، وكل بنك وشركة صرافة ومحفظة بسعرها الخاص بعد أن يتحقق منه فريقنا في تطبيق الجهة.", pfEosQ: "كيف أحسب مكافأة نهاية الخدمة في السعودية؟", pfEosA: "اختر السعودية أو دولتك الخليجية، وأدخل الراتب الأساسي والبدلات وسنوات الخدمة، وحدّد إن كنت قد استقلت. تطبّق الحاسبة المادتين ٨٤ و٨٥ من نظام العمل السعودي وتعرض المكافأة فورًا.", pfIdQ: "كيف أعرف تاريخ انتهاء الإقامة؟", pfIdA: "في السعودية افتح تطبيق أبشر، وستجد رقم الإقامة وتاريخ انتهائها في لوحة المعلومات. وفي الكويت استخدم سهل، وفي قطر مطراش، ولعُمان والبحرين راجع الدليل أعلاه. ويمكنك إضافة تذكير بالتجديد إلى هاتفك.", pfFamQ: "كم تكلفة المعيشة مع العائلة في السعودية شهريًا؟", pfFamA: "يعتمد ذلك على الإيجار ورسوم المدارس وعدد المرافقين. أدخل تكاليفك في الحاسبة أعلاه، وستضيف رسوم المرافقين ٤٠٠ ريال شهريًا عن كل فرد تلقائيًا وتعرض ما يتبقى للادخار.", pfEmbQ: "كيف أجدد جوازي وأنا أعمل في الخليج؟", pfEmbA: "اختر جنسيتك والدولة التي تعيش فيها أعلاه، وسترى موقع السفارة الرسمي ومكان التقديم وروابط تجديد الجواز وشهادة حسن السيرة والتصديق.", popConv: "تحويلات شائعة", sumExQ: "كم سعر العملات الخليجية اليوم مقابل الروبية والتاكا والبيزو؟", sumExA: "يعرض الجدول سعر السوق اليوم من كل عملة خليجية إلى الروبية الهندية والروبية الباكستانية والتاكا البنغلاديشية والبيزو الفلبيني والروبية النيبالية. تعطي البنوك وتطبيقات التحويل سعرًا أقل قليلًا، فاستخدمه مرجعًا وقارن الجهات قبل التحويل.", sumSendQ: "كم تستلم عائلتي مقابل ١٠٠٠ ريال أو درهم؟", sumSendA: "بسعر السوق اليوم، تساوي ١٠٠٠ من كل عملة خليجية المبالغ الموضحة في الجدول. وعادةً تستلم عائلتك أقل قليلًا بعد هامش الجهة ورسومها، لذا ترتّب المقارنة أدناه كل جهة حسب المبلغ الذي يصل فعلًا.", sumEosQ: "كم مكافأة نهاية الخدمة في السعودية؟", sumEosA: "وفق المادتين ٨٤ و٨٥ من نظام العمل السعودي، المكافأة أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة بعدها. وعند الاستقالة تستحق الثلث بعد سنتين، والثلثين بعد خمس سنوات، والمكافأة كاملة بعد عشر سنوات.", sumIdQ: "ما هوية الإقامة في كل دولة خليجية، وأين أتحقق منها؟", sumIdA: "تصدر كل دولة خليجية بطاقة إقامة خاصة بها. يعرض الجدول اسمها والتطبيق أو البوابة الرسمية التي تتحقق فيها من حالتها وتاريخ انتهائها.", sumFamQ: "كم رسوم المرافقين في السعودية سنويًا؟", sumFamA: "في السعودية رسوم المرافقين ٤٠٠ ريال عن كل فرد شهريًا، وتُدفع عند إصدار الإقامة أو تجديدها. يعرض الجدول التكلفة حسب عدد المرافقين، وأضف الإيجار والرسوم المدرسية والمصاريف اليومية في الحاسبة أدناه.", sumEmbQ: "أين أجدد جواز سفري وأنا مقيم في السعودية؟", sumEmbA: "تتولى سفارة بلدك ومراكز خدماتها الرسمية تجديد الجواز وشهادات حسن السيرة والتصديق. يعرض الجدول المواقع الرسمية لمواطني الهند وباكستان ونيبال في السعودية، واختر بلدك أعلاه لبقية دول الخليج.", thGcc: "العملة الخليجية", thMarketOn: "سعر السوق في", thYouSend: "ترسل", thYears: "سنوات الخدمة", thAward: "انتهاء العقد (أجر بالأشهر)", thResign: "الاستقالة (أجر بالأشهر)", thCountry: "الدولة", thIdName: "هوية الإقامة", thCheck: "تحقق منها عبر", thDeps: "المرافقون", thMonth: "شهريًا", thYear: "سنويًا", thNat: "الجنسية", thEmb: "موقع السفارة", thPass: "خدمة الجواز الإلكترونية", cSA: "السعودية", cKW: "الكويت", cQA: "قطر", cOM: "عُمان", cBH: "البحرين", cIN: "الهند", cPK: "باكستان", cNP: "نيبال", navApp: "تطبيق الجوال", appBar: "تطبيق ExpatGuideME قادم قريبًا على أندرويد وآيفون.", appBarInstall: "ثبّته الآن", appBarMore: "أبلغني", appClose: "إغلاق", appSoonAndroid: "قريبًا على أندرويد", appSoonIos: "قريبًا على آيفون", appGet: "حمّل التطبيق", appInstallBtn: "ثبّت تطبيق الويب", appTitle: "تطبيق ExpatGuideME", appLead: "كل أدواتنا المجانية للمقيمين في الخليج في تطبيق واحد: أسعار الصرف، ومقارنة التحويلات، وحاسبات نهاية الخدمة والإجازة وتكلفة العائلة، بثماني لغات. تطبيقا أندرويد وآيفون في الطريق.", appF1: "أسعار اليوم على شاشتك الرئيسية", appF2: "حاسبات تعمل دون إنترنت", appF3: "تذكير بيوم الراتب وتجديد الإقامة", appF4: "لغتك: ثماني لغات منها العربية والأردية والبنغالية", appNotifyTitle: "وصلك إشعار عند إطلاق التطبيق", appNotifyText: "اترك بريدك الإلكتروني وسنرسل لك رسالة واحدة عندما يصبح التطبيق متاحًا في Google Play وApp Store. بلا رسائل مزعجة.", appEmail: "بريدك الإلكتروني", appNotifyBtn: "أبلغني عند الإطلاق", appNotifyOk: "شكرًا لك! سنراسلك عند إطلاق التطبيق.", appNowTitle: "استخدمه كتطبيق اليوم", appNowText: "لا داعي للانتظار. أضف ExpatGuideME إلى شاشتك الرئيسية ليفتح مثل التطبيق، وتعمل الحاسبات حتى دون إنترنت.", appAndroidHow: "على أندرويد (Chrome): اضغط «تثبيت»، أو افتح القائمة ⋮ واختر «إضافة إلى الشاشة الرئيسية».", appIosHow: "على آيفون (Safari): اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».", appInstalled: "ExpatGuideME مثبّت بالفعل على هذا الجهاز.", offTitle: "أنت غير متصل بالإنترنت", offText: "هذه الصفحة غير محفوظة على جهازك بعد. الصفحات التي فتحتها من قبل ما زالت تعمل: جرّب صفحات نهاية الخدمة أو الإجازة أو تكلفة العائلة أو السفارات.", offRetry: "أعد المحاولة", navVac: "الإجازة السنوية", xVac: "تحقّق أيضًا من البدل النقدي لإجازتك غير المستخدمة", cAE: "الإمارات", thDaysYear: "الإجازة السنوية", sumVacQ: "كم يوم إجازة سنوية يستحق المقيم في كل دولة خليجية؟", sumVacA: "تمنح السعودية ٢١ يومًا سنويًا ترتفع إلى ٣٠ بعد ٥ سنوات لدى صاحب العمل نفسه، وتمنح قطر ٢١ يومًا ترتفع إلى ٢٨ بعد ٥ سنوات. أما الإمارات والكويت وعُمان والبحرين فتمنح ٣٠ يومًا سنويًا. هذه حدود دنيا نظامية، ويجب دفع أجر الأيام غير المستخدمة عند ترك العمل.", sendVia: "حوّل عبر {name} ←", affNote: "بعض الجهات شركاء ممولون أو لديها روابط شراكة («حوّل عبر»)، وقد نحصل على عمولة دون أي تكلفة إضافية عليك، ولا يغيّر ذلك أبدًا ترتيب هذا الجدول.", affLink: "الإفصاح عن روابط الشراكة", appPrivT: "قائمة إطلاق تطبيق الجوال", appPrivA: "إذا انضممت إلى قائمة إطلاق التطبيق في صفحة تطبيق الجوال، فإننا نتلقى بريدك الإلكتروني واللغة التي اخترتها فقط، ونستخدمهما حصرًا لإبلاغك عندما يصبح تطبيق ExpatGuideME متاحًا في Google Play وApp Store. لن نبيع بريدك الإلكتروني أو نؤجره أو نشاركه مع أي جهة أبدًا، ويمكنك طلب حذفه في أي وقت عبر صفحة التواصل.", vacBaseNote: "الكويت وعُمان والبحرين: تُحسب القيمة النقدية افتراضيًا على الأجر الكامل. إذا كان عقدك يحسب الإجازة على الراتب الأساسي، فاختر «الراتب الأساسي فقط».", sponsoredBadge: "شريك مموَّل", essT: "أساسيات المقيم", essNote: "روابط ممولة، وقد نحصل على عمولة.", esimT: "بيانات الجوال وشرائح eSIM", esimD: "باقات eSIM محلية وللتجوال عند السفر إلى بلدك.", insT: "التأمين الصحي", insD: "قارن التغطية لك ولعائلتك.", moveT: "النقل والشحن", moveD: "انقل أغراضك بين الخليج وبلدك.", navConsult: "اسأل مختصًا", navPlaybook: "الدليل المالي", xConsult: "لست متأكدًا من صحة حسابك؟ اطلب مراجعة من مختص", consentRequired: "يرجى وضع علامة الموافقة قبل الإرسال.", affSponsT: "المواضع الممولة وعروض الشركاء ودليلنا الخاص", affSponsA: "قد تدفع بعض شركات التحويل لتظهر بوصف «شريك مموَّل»، فتحصل على علامة وصف مميز، لكنها تبقى في مكانها نفسه في الجدول الذي يُرتَّب دائمًا حسب ما تستلمه عائلتك. وبطاقة «أساسيات المقيم» تحتوي على روابط ممولة فقط. أما الدليل المالي فهو دليلنا المدفوع، ونوضح ذلك في صفحته.", privConsultT: "طلبات مراجعة المختص", privConsultA: "إذا طلبت مراجعة من مختص، نتلقى اسمك وبريدك ودولتك والموضوع ورسالتك، ونستخدمها فقط للرد على طلبك، وإذا وافقت في النموذج نمررها إلى مستشار مستقل واحد يمكنه المساعدة. لا نبيع بياناتك أبدًا. لا ترسل أرقام الهوية أو كلمات المرور أو البيانات البنكية، ويمكنك طلب حذف طلبك في أي وقت عبر صفحة التواصل.", privGuideT: "قائمة انتظار الدليل والمشتريات", privGuideA: "إذا انضممت إلى قائمة انتظار الدليل المالي، نستخدم بريدك فقط لإبلاغك عند توفره. تتولى جهة الدفع الظاهرة عند الشراء معالجة المدفوعات، ولا نطّلع أبدًا على بيانات بطاقتك.", navGold: "سعر الذهب", sumGoldQ: "كم سعر غرام الذهب في الخليج اليوم؟", sumGoldA: "يعرض الجدول سعر الذهب الفوري لصباح اليوم للغرام بكل عملة خليجية لعيارات ٢٤ و٢٢ و٢١. ويتحدّث السعر المباشر أعلى الصفحة خلال اليوم، وتضيف المحلات هامشًا صغيرًا وأجور المصنعية.", thPerGram: "للغرام", countryPick: "دولتك", rUpdated: "آخر تحديث: {time}", rFallback: "تعذّر تحميل الأسعار المباشرة. تُعرض آخر أسعار محفوظة من {time}.", navSim: "الشرائح والإنترنت", navVisa: "تأشيرة العائلة والزيارة", bnRates: "الأسعار", bnSend: "تحويل", bnGold: "الذهب", bnMore: "المزيد", themeLabel: "الوضع الداكن / الفاتح", trendTitle: "الاتجاه", trend30: "آخر 30 يومًا", trendEcb: "أسعار مرجعية يومية من البنك المركزي الأوروبي (عبر frankfurter.app).", trendOwn: "قراءات محفوظة كل ساعتين منذ {date}.", trendWait: "لا توجد قراءات كافية للرسم بعد. نحفظ قراءة كل ساعتين، وسيكتمل قريبًا.", tHigh: "الأعلى", tLow: "الأدنى", tChange: "التغيّر", secPrices: "الأسعار", secCalc: "الحاسبة", secTrend: "الاتجاه", secDuty: "جمارك الهند", secConvert: "المحوّل", secRates: "كل الأسعار", secFaq: "الأسئلة", allCur: "1 {cur} مقابل كل العملات"
    },
    hi: {
      skip: "मुख्य सामग्री पर जाएँ", navHome: "होम", navExchange: "एक्सचेंज रेट", navSend: "पैसे भेजें", navContact: "संपर्क", navPrivacy: "गोपनीयता",
      menu: "मेनू", close: "बंद करें", search: "खोजें", searchPh: "टूल और गाइड खोजें…",
      noResults: "कोई परिणाम नहीं। कोई दूसरा शब्द आज़माएँ।", language: "भाषा",
      themeDark: "डार्क मोड चालू करें", themeLight: "लाइट मोड चालू करें",
      toTop: "ऊपर जाएँ", contactUs: "संपर्क करें",
      nlTitle: "नई गाइड ईमेल पर पाएँ", nlText: "नया टूल या गाइड जुड़ने पर एक छोटा ईमेल। कोई स्पैम नहीं।",
      nlEmail: "आपका ईमेल पता", nlButton: "सब्सक्राइब करें", sending: "भेजा जा रहा है…",
      nlSuccess: "धन्यवाद! आपका सब्सक्रिप्शन हो गया।", invalidEmail: "कृपया सही ईमेल पता लिखें।",
      formRequired: "कृपया सभी जानकारी भरें।", formError: "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।",
      cookieText: "हम आपकी भाषा और सेटिंग्स याद रखने के लिए ब्राउज़र स्टोरेज का उपयोग करते हैं। Google समेत हमारे विज्ञापन पार्टनर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग कर सकते हैं।",
      cookieLearn: "गोपनीयता नीति", cookieOk: "ठीक है", lastUpdated: "आख़िरी अपडेट:",
      disclaimer: "यह एक स्वतंत्र वेबसाइट है। इसका किसी सरकारी विभाग या बैंक से कोई संबंध नहीं है।",
      copy: "कॉपी करें", copied: "कॉपी हो गया ✓", navEos: "सर्विस समाप्ति", navId: "आईडी और रेज़िडेंसी", navFamily: "परिवार का ख़र्च", navEmbassy: "दूतावास सेवाएँ", navAbout: "हमारे बारे में", navTerms: "उपयोग की शर्तें", navAffiliate: "एफ़िलिएट जानकारी", footerTools: "टूल", footerSite: "वेबसाइट", ad: "विज्ञापन", pfExQ: "आज का रियाल रेट (aaj ka riyal rate) क्या है?", pfExA: "यह पेज सऊदी रियाल, यूएई दिरहम, कुवैती दीनार, क़तरी रियाल, ओमानी रियाल और बहरीनी दीनार से भारतीय रुपये और दूसरी मुद्राओं का लाइव मार्केट रेट दिखाता है। ऊपर दिए नंबर आज का रेट हैं।", pfSendQ: "घर पैसे भेजने के लिए आज सबसे अच्छा रियाल रेट कौन-सा ऐप देता है?", pfSendA: "ऊपर अपना रूट चुनें, जैसे सऊदी अरब से भारत, बांग्लादेश, पाकिस्तान, नेपाल या फ़िलीपींस। आपको लाइव मार्केट रेट उसके सटीक अपडेट समय के साथ दिखेगा, और हर बैंक, एक्सचेंज और वॉलेट का अपना रेट, जब हमारी टीम उसे उस कंपनी के ऐप में जाँच लेती है।", pfEosQ: "सऊदी एंड ऑफ़ सर्विस का हिसाब (end of service hisab) कैसे निकालें?", pfEosA: "सऊदी अरब या अपना खाड़ी देश चुनें, बेसिक सैलरी, अलाउंस और सर्विस के साल डालें, और बताएँ कि इस्तीफ़ा दिया या नहीं। कैलकुलेटर सऊदी लेबर लॉ की धारा 84 और 85 लागू करके तुरंत ग्रेच्युटी दिखाता है।", pfIdQ: "इक़ामा की एक्सपायरी डेट कैसे चेक करें?", pfIdA: "सऊदी अरब में Absher ऐप खोलें, डैशबोर्ड पर इक़ामा नंबर और एक्सपायरी डेट दिखती है। कुवैत में Sahel, क़तर में Metrash, और ओमान व बहरीन के लिए ऊपर की गाइड देखें। आप फ़ोन में रिमाइंडर भी जोड़ सकते हैं।", pfFamQ: "सऊदी में परिवार के साथ रहने का महीने का ख़र्च कितना है?", pfFamA: "यह किराया, स्कूल फ़ीस और डिपेंडेंट की संख्या पर निर्भर है। ऊपर कैलकुलेटर में अपने ख़र्च डालें, यह हर व्यक्ति के लिए SAR 400 महीना डिपेंडेंट फ़ीस अपने-आप जोड़ता है और बचत दिखाता है।", pfEmbQ: "खाड़ी में रहते हुए पासपोर्ट रिन्यू कैसे करें?", pfEmbA: "ऊपर अपनी नागरिकता और रहने का देश चुनें। आपको दूतावास की आधिकारिक वेबसाइट, आवेदन की जगह और पासपोर्ट, पुलिस सर्टिफ़िकेट व सत्यापन के लिंक दिखेंगे।", popConv: "लोकप्रिय कन्वर्ज़न", sumExQ: "आज खाड़ी की मुद्राओं का रुपये, टका और पेसो में रेट क्या है?", sumExA: "टेबल हर खाड़ी मुद्रा से भारतीय रुपया, पाकिस्तानी रुपया, बांग्लादेशी टका, फ़िलीपीनी पेसो और नेपाली रुपये का आज का मार्केट रेट दिखाती है। बैंक और ट्रांसफ़र ऐप थोड़ा कम देते हैं, इसलिए इसे संदर्भ मानें और भेजने से पहले सेवाओं की तुलना करें।", sumSendQ: "1,000 रियाल या दिरहम पर परिवार को कितना मिलेगा?", sumSendA: "आज के मार्केट रेट पर हर खाड़ी मुद्रा के 1,000 की क़ीमत टेबल में दी गई है। सेवा के मार्जिन और फ़ीस के बाद परिवार को आम तौर पर थोड़ा कम मिलता है, इसलिए नीचे की तुलना हर सेवा को असल में पहुँचने वाली रक़म के क्रम में दिखाती है।", sumEosQ: "सऊदी अरब में एंड ऑफ़ सर्विस कितना मिलता है?", sumEosA: "सऊदी लेबर लॉ की धारा 84 और 85 के अनुसार, पहले पाँच साल के हर साल के लिए आधे महीने का वेतन और उसके बाद हर साल के लिए पूरे महीने का वेतन मिलता है। इस्तीफ़ा देने पर 2 साल बाद एक-तिहाई, 5 साल बाद दो-तिहाई और 10 साल बाद पूरी रक़म मिलती है।", sumIdQ: "हर खाड़ी देश में कौन-सा आईडी चाहिए और उसे कहाँ चेक करें?", sumIdA: "हर खाड़ी देश अपना रेज़िडेंस आईडी कार्ड जारी करता है। टेबल में उसका नाम और वह आधिकारिक ऐप या पोर्टल है जहाँ आप उसकी स्थिति और एक्सपायरी डेट देख सकते हैं।", sumFamQ: "सऊदी में डिपेंडेंट फ़ीस साल की कितनी है?", sumFamA: "सऊदी अरब में डिपेंडेंट फ़ीस हर परिवार सदस्य के लिए SAR 400 महीना है, जो इक़ामा बनने या रिन्यू होने पर दी जाती है। टेबल डिपेंडेंट की संख्या के हिसाब से ख़र्च दिखाती है; किराया, स्कूल फ़ीस और रोज़ का ख़र्च नीचे कैलकुलेटर में जोड़ें।", sumEmbQ: "सऊदी में रहते हुए पासपोर्ट कहाँ रिन्यू करें?", sumEmbA: "पासपोर्ट रिन्यूअल, पुलिस सर्टिफ़िकेट और सत्यापन आपके देश का दूतावास और उसके आधिकारिक सेवा केंद्र करते हैं। टेबल में सऊदी में भारतीय, पाकिस्तानी और नेपाली नागरिकों के लिए आधिकारिक वेबसाइटें हैं; दूसरे खाड़ी देशों के लिए ऊपर अपना देश चुनें।", thGcc: "खाड़ी मुद्रा", thMarketOn: "मार्केट रेट, तारीख़", thYouSend: "आप भेजते हैं", thYears: "सर्विस के साल", thAward: "कॉन्ट्रैक्ट ख़त्म (महीनों का वेतन)", thResign: "इस्तीफ़ा (महीनों का वेतन)", thCountry: "देश", thIdName: "रेज़िडेंस आईडी", thCheck: "यहाँ चेक करें", thDeps: "डिपेंडेंट", thMonth: "हर महीने", thYear: "हर साल", thNat: "नागरिकता", thEmb: "दूतावास वेबसाइट", thPass: "ऑनलाइन पासपोर्ट सेवा", cSA: "सऊदी अरब", cKW: "कुवैत", cQA: "क़तर", cOM: "ओमान", cBH: "बहरीन", cIN: "भारत", cPK: "पाकिस्तान", cNP: "नेपाल", navApp: "मोबाइल ऐप", appBar: "ExpatGuideME ऐप जल्द ही Android और iPhone पर आ रहा है।", appBarInstall: "अभी इंस्टॉल करें", appBarMore: "मुझे बताएँ", appClose: "बंद करें", appSoonAndroid: "जल्द ही Android पर", appSoonIos: "जल्द ही iPhone पर", appGet: "ऐप पाएँ", appInstallBtn: "वेब ऐप इंस्टॉल करें", appTitle: "ExpatGuideME ऐप", appLead: "खाड़ी प्रवासियों के लिए हमारे सारे मुफ़्त टूल एक ऐप में: एक्सचेंज रेट, ट्रांसफ़र तुलना, एंड ऑफ़ सर्विस, छुट्टी और परिवार ख़र्च कैलकुलेटर, 8 भाषाओं में। Android और iPhone ऐप रास्ते में हैं।", appF1: "होम स्क्रीन पर आज के रेट", appF2: "बिना इंटरनेट चलने वाले कैलकुलेटर", appF3: "सैलरी के दिन और इक़ामा रिन्यूअल के रिमाइंडर", appF4: "आपकी भाषा: अरबी, उर्दू और बांग्ला समेत 8 भाषाएँ", appNotifyTitle: "ऐप लॉन्च होने पर सूचना पाएँ", appNotifyText: "अपना ईमेल दें, ऐप Google Play और App Store पर आते ही हम एक संदेश भेजेंगे। कोई स्पैम नहीं।", appEmail: "आपका ईमेल", appNotifyBtn: "लॉन्च पर बताएँ", appNotifyOk: "धन्यवाद! ऐप लॉन्च होने पर हम आपको ईमेल करेंगे।", appNowTitle: "आज ही ऐप की तरह इस्तेमाल करें", appNowText: "इंतज़ार की ज़रूरत नहीं। ExpatGuideME को होम स्क्रीन पर जोड़ें, यह ऐप की तरह खुलेगा और कैलकुलेटर बिना इंटरनेट भी चलेंगे।", appAndroidHow: "Android (Chrome) पर: Install दबाएँ, या ⋮ मेन्यू खोलकर Add to Home screen चुनें।", appIosHow: "iPhone (Safari) पर: Share बटन दबाएँ, फिर Add to Home Screen चुनें।", appInstalled: "ExpatGuideME इस डिवाइस पर पहले से इंस्टॉल है।", offTitle: "आप ऑफ़लाइन हैं", offText: "यह पेज अभी आपके डिवाइस पर सेव नहीं है। पहले खोले गए पेज अब भी चलते हैं: एंड ऑफ़ सर्विस, छुट्टी, परिवार ख़र्च या दूतावास पेज आज़माएँ।", offRetry: "फिर कोशिश करें", navVac: "छुट्टी कैलकुलेटर", xVac: "बची छुट्टियों का नक़द भुगतान भी देखें", cAE: "यूएई", thDaysYear: "हर साल की छुट्टी", sumVacQ: "हर खाड़ी देश में प्रवासियों को कितनी सालाना छुट्टी मिलती है?", sumVacA: "सऊदी अरब हर साल 21 दिन देता है, जो उसी नियोक्ता के साथ 5 साल बाद 30 हो जाते हैं; क़तर 21 दिन देता है, जो 5 साल बाद 28 हो जाते हैं। यूएई, कुवैत, ओमान और बहरीन हर साल 30 दिन देते हैं। ये क़ानूनी न्यूनतम हैं, और नौकरी छोड़ने पर बची छुट्टियों का भुगतान ज़रूरी है।", sendVia: "{name} से भेजें →", affNote: "कुछ सेवाएँ प्रायोजित पार्टनर हैं या उनके पार्टनर (“… से भेजें”) लिंक हैं: आपको कोई अतिरिक्त ख़र्च नहीं, हमें कमीशन मिल सकता है, और इससे इस टेबल का क्रम कभी नहीं बदलता।", affLink: "एफ़िलिएट जानकारी", appPrivT: "मोबाइल ऐप लॉन्च सूची", appPrivA: "अगर आप मोबाइल ऐप पेज पर ऐप लॉन्च सूची में जुड़ते हैं, तो हमें सिर्फ़ आपका ईमेल पता और चुनी गई भाषा मिलती है। हम इनका उपयोग केवल यह बताने के लिए करते हैं कि ExpatGuideME ऐप Google Play और App Store पर कब उपलब्ध है। हम आपका ईमेल कभी किसी को बेचेंगे, किराए पर देंगे या साझा नहीं करेंगे, और आप संपर्क पेज से कभी भी इसे हटाने को कह सकते हैं।", vacBaseNote: "कुवैत, ओमान और बहरीन: नक़द मूल्य डिफ़ॉल्ट रूप से पूरे वेतन पर है। अगर आपका कॉन्ट्रैक्ट छुट्टी का भुगतान बेसिक पर करता है, तो “सिर्फ़ बेसिक सैलरी” चुनें।", sponsoredBadge: "प्रायोजित पार्टनर", essT: "प्रवासी ज़रूरतें", essNote: "प्रायोजित लिंक। हमें कमीशन मिल सकता है।", esimT: "मोबाइल डेटा और eSIM", esimD: "घर जाते समय के लिए लोकल और रोमिंग eSIM प्लान।", insT: "हेल्थ इंश्योरेंस", insD: "अपने और परिवार के लिए कवर की तुलना करें।", moveT: "शिफ़्टिंग और शिपिंग", moveD: "खाड़ी और घर के बीच सामान भेजें।", navConsult: "विशेषज्ञ से पूछें", navPlaybook: "फ़ाइनेंशियल प्लेबुक", xConsult: "हिसाब सही है या नहीं, पक्का नहीं? विशेषज्ञ से जाँच करवाएँ", consentRequired: "भेजने से पहले सहमति वाले बॉक्स पर टिक करें।", affSponsT: "प्रायोजित स्थान, पार्टनर ऑफ़र और हमारी अपनी गाइड", affSponsA: "कुछ मनी ट्रांसफ़र सेवाएँ “प्रायोजित पार्टनर” दिखने के लिए भुगतान कर सकती हैं। उन्हें एक लेबल और हाइलाइट की हुई पंक्ति मिलती है, पर टेबल में उनकी जगह वही रहती है, जो हमेशा परिवार को मिलने वाली रक़म के क्रम में होती है। “प्रवासी ज़रूरतें” कार्ड में सिर्फ़ प्रायोजित लिंक हैं। फ़ाइनेंशियल प्लेबुक हमारी अपनी पेड गाइड है, और यह उसके पेज पर साफ़ लिखा है।", privConsultT: "विशेषज्ञ जाँच के अनुरोध", privConsultA: "अगर आप विशेषज्ञ जाँच का अनुरोध करते हैं, तो हमें आपका नाम, ईमेल, देश, विषय और संदेश मिलता है। हम इनका उपयोग सिर्फ़ आपके अनुरोध का जवाब देने के लिए करते हैं और, अगर आप फ़ॉर्म पर सहमति दें, तो मदद कर सकने वाले एक स्वतंत्र सलाहकार को भेजते हैं। हम आपकी जानकारी कभी नहीं बेचते। आईडी नंबर, पासवर्ड या बैंक विवरण न भेजें। आप संपर्क पेज से कभी भी अपना अनुरोध हटाने को कह सकते हैं।", privGuideT: "प्लेबुक प्रतीक्षा सूची और ख़रीद", privGuideA: "अगर आप फ़ाइनेंशियल प्लेबुक की प्रतीक्षा सूची में जुड़ते हैं, तो हम आपका ईमेल सिर्फ़ यह बताने के लिए उपयोग करते हैं कि गाइड कब उपलब्ध है। भुगतान, भुगतान के समय दिखने वाली चेकआउट सेवा संभालती है; हम आपके कार्ड का विवरण कभी नहीं देखते।", navGold: "सोने का भाव", sumGoldQ: "आज खाड़ी में सोने का प्रति ग्राम भाव क्या है?", sumGoldA: "टेबल हर खाड़ी मुद्रा में 24K, 22K और 21K सोने का आज सुबह का स्पॉट भाव प्रति ग्राम दिखाती है। पेज के ऊपर का लाइव भाव दिन भर अपडेट होता है; दुकानें थोड़ा प्रीमियम और मेकिंग चार्ज जोड़ती हैं।", thPerGram: "प्रति ग्राम", countryPick: "आपका देश", rUpdated: "अपडेट: {time}", rFallback: "लाइव रेट लोड नहीं हो सके। {time} के सहेजे गए आख़िरी रेट दिखाए जा रहे हैं।", navSim: "सिम और इंटरनेट", navVisa: "फ़ैमिली और विज़िट वीज़ा", bnRates: "रेट", bnSend: "भेजें", bnGold: "सोना", bnMore: "और", themeLabel: "डार्क / लाइट मोड", trendTitle: "रुझान", trend30: "पिछले 30 दिन", trendEcb: "यूरोपियन सेंट्रल बैंक के रोज़ाना संदर्भ रेट (frankfurter.app के ज़रिए)।", trendOwn: "{date} से हर 2 घंटे में सहेजे गए रेट।", trendWait: "चार्ट के लिए अभी पर्याप्त रीडिंग नहीं हैं। हम हर 2 घंटे में एक सहेजते हैं, जल्द ही भर जाएगा।", tHigh: "सबसे ऊँचा", tLow: "सबसे नीचा", tChange: "बदलाव", secPrices: "भाव", secCalc: "कैलकुलेटर", secTrend: "रुझान", secDuty: "भारत ड्यूटी", secConvert: "कन्वर्टर", secRates: "सभी रेट", secFaq: "सवाल", allCur: "1 {cur} हर मुद्रा में"
    },
    ml: {
      skip: "പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക", navHome: "ഹോം", navExchange: "വിനിമയ നിരക്ക്", navSend: "പണം അയക്കൽ", navContact: "ബന്ധപ്പെടുക", navPrivacy: "സ്വകാര്യത",
      menu: "മെനു", close: "അടയ്ക്കുക", search: "തിരയുക", searchPh: "ടൂളുകളും ഗൈഡുകളും തിരയുക…",
      noResults: "ഫലങ്ങളൊന്നുമില്ല. മറ്റൊരു വാക്ക് ശ്രമിക്കുക.", language: "ഭാഷ",
      themeDark: "ഡാർക്ക് മോഡിലേക്ക് മാറുക", themeLight: "ലൈറ്റ് മോഡിലേക്ക് മാറുക",
      toTop: "മുകളിലേക്ക് പോകുക", contactUs: "ബന്ധപ്പെടുക",
      nlTitle: "പുതിയ ഗൈഡുകൾ ഇമെയിലിൽ ലഭിക്കാൻ", nlText: "പുതിയ ടൂളോ ഗൈഡോ ചേർക്കുമ്പോൾ ഒരു ചെറിയ ഇമെയിൽ മാത്രം. സ്പാം ഇല്ല.",
      nlEmail: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം", nlButton: "സബ്സ്ക്രൈബ് ചെയ്യുക", sending: "അയക്കുന്നു…",
      nlSuccess: "നന്ദി! നിങ്ങൾ സബ്സ്ക്രൈബ് ചെയ്തു.", invalidEmail: "ശരിയായ ഇമെയിൽ വിലാസം നൽകുക.",
      formRequired: "എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക.", formError: "എന്തോ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",
      cookieText: "നിങ്ങളുടെ ഭാഷയും ക്രമീകരണങ്ങളും ഓർത്തുവയ്ക്കാൻ ഞങ്ങൾ ബ്രൗസർ സ്റ്റോറേജ് ഉപയോഗിക്കുന്നു. Google ഉൾപ്പെടെയുള്ള ഞങ്ങളുടെ പരസ്യ പങ്കാളികൾ പരസ്യങ്ങൾ കാണിക്കാൻ കുക്കികൾ ഉപയോഗിച്ചേക്കാം.",
      cookieLearn: "സ്വകാര്യതാ നയം", cookieOk: "ശരി", lastUpdated: "അവസാനം പുതുക്കിയത്:",
      disclaimer: "ഇതൊരു സ്വതന്ത്ര വെബ്സൈറ്റാണ്. ഏതെങ്കിലും സർക്കാർ വകുപ്പുമായോ ബാങ്കുമായോ ഇതിന് ബന്ധമില്ല.",
      copy: "കോപ്പി ചെയ്യുക", copied: "കോപ്പി ചെയ്തു ✓", navEos: "സർവീസ് ആനുകൂല്യം", navId: "ഐഡി, റെസിഡൻസി", navFamily: "കുടുംബച്ചെലവ്", navEmbassy: "എംബസി സേവനങ്ങൾ", navAbout: "ഞങ്ങളെക്കുറിച്ച്", navTerms: "ഉപയോഗ നിബന്ധനകൾ", navAffiliate: "അഫിലിയേറ്റ് വെളിപ്പെടുത്തൽ", footerTools: "ടൂളുകൾ", footerSite: "വെബ്സൈറ്റ്", ad: "പരസ്യം", pfExQ: "ഇന്നത്തെ റിയാൽ റേറ്റ് (innathe riyal rate) എത്ര?", pfExA: "സൗദി റിയാൽ, യുഎഇ ദിർഹം, കുവൈത്ത് ദിനാർ, ഖത്തർ റിയാൽ, ഒമാൻ റിയാൽ, ബഹ്‌റൈൻ ദിനാർ എന്നിവയിൽ നിന്ന് ഇന്ത്യൻ രൂപയിലേക്കും മറ്റ് കറൻസികളിലേക്കുമുള്ള ലൈവ് മാർക്കറ്റ് നിരക്ക് ഈ പേജിൽ കാണാം. മുകളിലെ സംഖ്യകളാണ് ഇന്നത്തെ നിരക്ക്.", pfSendQ: "നാട്ടിലേക്ക് പണം അയക്കാൻ ഇന്ന് മികച്ച റിയാൽ റേറ്റ് ഏത് ആപ്പിൽ?", pfSendA: "മുകളിൽ നിങ്ങളുടെ റൂട്ട് തിരഞ്ഞെടുക്കുക, ഉദാഹരണം സൗദി അറേബ്യയിൽ നിന്ന് ഇന്ത്യ, ബംഗ്ലാദേശ്, പാകിസ്ഥാൻ, നേപ്പാൾ അല്ലെങ്കിൽ ഫിലിപ്പീൻസ്. തത്സമയ മാർക്കറ്റ് നിരക്ക് കൃത്യമായ പുതുക്കിയ സമയത്തോടെ കാണാം; ഓരോ ബാങ്കിന്റെയും എക്സ്ചേഞ്ചിന്റെയും വാലറ്റിന്റെയും സ്വന്തം നിരക്ക് ഞങ്ങളുടെ ടീം ആ കമ്പനിയുടെ ആപ്പിൽ പരിശോധിച്ച ശേഷം കാണിക്കും.", pfEosQ: "സൗദി എൻഡ് ഓഫ് സർവീസ് കണക്ക് (end of service calculation) എങ്ങനെ?", pfEosA: "സൗദി അറേബ്യ അല്ലെങ്കിൽ നിങ്ങളുടെ ഗൾഫ് രാജ്യം തിരഞ്ഞെടുത്ത്, ബേസിക് ശമ്പളം, അലവൻസുകൾ, സർവീസ് വർഷങ്ങൾ എന്നിവ നൽകി, രാജിവച്ചോ എന്ന് തിരഞ്ഞെടുക്കുക. സൗദി തൊഴിൽ നിയമത്തിലെ ആർട്ടിക്കിൾ 84, 85 പ്രകാരം ഗ്രാറ്റുവിറ്റി ഉടൻ കാണിക്കും.", pfIdQ: "ഇഖാമ കാലാവധി എങ്ങനെ പരിശോധിക്കാം?", pfIdA: "സൗദിയിൽ Absher ആപ്പ് തുറക്കുക, ഡാഷ്ബോർഡിൽ ഇഖാമ നമ്പറും കാലാവധിയും കാണാം. കുവൈത്തിൽ Sahel, ഖത്തറിൽ Metrash, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവയ്ക്ക് മുകളിലെ ഗൈഡ് നോക്കുക. ഫോണിൽ ഓർമ്മപ്പെടുത്തലും ചേർക്കാം.", pfFamQ: "സൗദിയിൽ കുടുംബത്തോടൊപ്പം താമസിക്കാൻ മാസം എത്ര ചെലവാകും?", pfFamA: "വാടക, സ്കൂൾ ഫീസ്, ഡിപെൻഡന്റുകളുടെ എണ്ണം എന്നിവ അനുസരിച്ചിരിക്കും. മുകളിലെ കാൽക്കുലേറ്ററിൽ നിങ്ങളുടെ ചെലവുകൾ നൽകുക; ഓരോരുത്തർക്കും മാസം SAR 400 ഡിപെൻഡന്റ് ഫീസ് സ്വയം ചേർത്ത് സമ്പാദ്യം കാണിക്കും.", pfEmbQ: "ഗൾഫിൽ ജോലി ചെയ്യുമ്പോൾ പാസ്പോർട്ട് എങ്ങനെ പുതുക്കാം?", pfEmbA: "മുകളിൽ നിങ്ങളുടെ പൗരത്വവും താമസിക്കുന്ന രാജ്യവും തിരഞ്ഞെടുക്കുക. എംബസിയുടെ ഔദ്യോഗിക വെബ്സൈറ്റ്, അപേക്ഷിക്കേണ്ട സ്ഥലം, പാസ്പോർട്ട്, പോലീസ് സർട്ടിഫിക്കറ്റ്, അറ്റസ്റ്റേഷൻ ലിങ്കുകൾ എന്നിവ കാണാം.", popConv: "ജനപ്രിയ കൺവേർഷനുകൾ", sumExQ: "ഇന്ന് ഗൾഫ് കറൻസികളുടെ രൂപ, ടാക്ക, പെസോ നിരക്ക് എത്ര?", sumExA: "ഓരോ ഗൾഫ് കറൻസിയിൽ നിന്നും ഇന്ത്യൻ രൂപ, പാകിസ്ഥാൻ രൂപ, ബംഗ്ലാദേശ് ടാക്ക, ഫിലിപ്പീൻ പെസോ, നേപ്പാൾ രൂപ എന്നിവയിലേക്കുള്ള ഇന്നത്തെ മാർക്കറ്റ് നിരക്ക് പട്ടികയിൽ കാണാം. ബാങ്കുകളും ട്രാൻസ്ഫർ ആപ്പുകളും അൽപം കുറവ് നൽകും; അതിനാൽ ഇത് റഫറൻസായി എടുത്ത് അയക്കുന്നതിന് മുമ്പ് സേവനങ്ങൾ താരതമ്യം ചെയ്യുക.", sumSendQ: "1,000 റിയാലിനോ ദിർഹത്തിനോ കുടുംബത്തിന് എത്ര കിട്ടും?", sumSendA: "ഇന്നത്തെ മാർക്കറ്റ് നിരക്കിൽ ഓരോ ഗൾഫ് കറൻസിയിലെയും 1,000-ന്റെ മൂല്യം പട്ടികയിലുണ്ട്. സേവനദാതാവിന്റെ മാർജിനും ഫീസും കഴിഞ്ഞ് കുടുംബത്തിന് സാധാരണയായി അൽപം കുറവായിരിക്കും ലഭിക്കുക; അതിനാൽ താഴെയുള്ള താരതമ്യം യഥാർത്ഥത്തിൽ എത്തുന്ന തുകയനുസരിച്ച് ഓരോ സേവനവും ക്രമീകരിക്കുന്നു.", sumEosQ: "സൗദിയിൽ എൻഡ് ഓഫ് സർവീസ് എത്ര ലഭിക്കും?", sumEosA: "സൗദി തൊഴിൽ നിയമത്തിലെ ആർട്ടിക്കിൾ 84, 85 പ്രകാരം ആദ്യ അഞ്ച് വർഷങ്ങളിൽ ഓരോ വർഷത്തിനും അര മാസത്തെ ശമ്പളവും അതിനുശേഷം ഓരോ വർഷത്തിനും ഒരു മാസത്തെ ശമ്പളവും ലഭിക്കും. രാജിവച്ചാൽ 2 വർഷത്തിന് ശേഷം മൂന്നിലൊന്നും 5 വർഷത്തിന് ശേഷം മൂന്നിൽ രണ്ടും 10 വർഷത്തിന് ശേഷം മുഴുവനും ലഭിക്കും.", sumIdQ: "ഓരോ ഗൾഫ് രാജ്യത്തും ഏത് ഐഡി വേണം, എവിടെ പരിശോധിക്കാം?", sumIdA: "ഓരോ ഗൾഫ് രാജ്യവും സ്വന്തം റെസിഡൻസ് ഐഡി കാർഡ് നൽകുന്നു. അതിന്റെ പേരും നില, കാലാവധി എന്നിവ പരിശോധിക്കാവുന്ന ഔദ്യോഗിക ആപ്പോ പോർട്ടലോ പട്ടികയിൽ കാണാം.", sumFamQ: "സൗദിയിൽ ഡിപെൻഡന്റ് ഫീസ് വർഷത്തിൽ എത്ര?", sumFamA: "സൗദിയിൽ ഡിപെൻഡന്റ് ഫീസ് ഓരോ കുടുംബാംഗത്തിനും മാസം SAR 400 ആണ്, ഇഖാമ എടുക്കുമ്പോഴോ പുതുക്കുമ്പോഴോ അടയ്ക്കണം. ഡിപെൻഡന്റുകളുടെ എണ്ണമനുസരിച്ചുള്ള ചെലവ് പട്ടികയിലുണ്ട്; വാടക, സ്കൂൾ ഫീസ്, ദൈനംദിന ചെലവുകൾ താഴെയുള്ള കാൽക്കുലേറ്ററിൽ ചേർക്കുക.", sumEmbQ: "സൗദിയിൽ താമസിക്കുമ്പോൾ പാസ്പോർട്ട് എവിടെ പുതുക്കാം?", sumEmbA: "പാസ്പോർട്ട് പുതുക്കൽ, പോലീസ് സർട്ടിഫിക്കറ്റ്, അറ്റസ്റ്റേഷൻ എന്നിവ നിങ്ങളുടെ രാജ്യത്തിന്റെ എംബസിയും അതിന്റെ ഔദ്യോഗിക സേവന കേന്ദ്രങ്ങളുമാണ് ചെയ്യുന്നത്. സൗദിയിലെ ഇന്ത്യൻ, പാകിസ്ഥാനി, നേപ്പാളി പൗരന്മാർക്കുള്ള ഔദ്യോഗിക വെബ്സൈറ്റുകൾ പട്ടികയിലുണ്ട്; മറ്റ് ഗൾഫ് രാജ്യങ്ങൾക്ക് മുകളിൽ നിങ്ങളുടെ രാജ്യം തിരഞ്ഞെടുക്കുക.", thGcc: "ഗൾഫ് കറൻസി", thMarketOn: "മാർക്കറ്റ് നിരക്ക്, തീയതി", thYouSend: "നിങ്ങൾ അയക്കുന്നത്", thYears: "സർവീസ് വർഷങ്ങൾ", thAward: "കരാർ അവസാനിച്ചാൽ (മാസ ശമ്പളം)", thResign: "രാജിവച്ചാൽ (മാസ ശമ്പളം)", thCountry: "രാജ്യം", thIdName: "റെസിഡൻസ് ഐഡി", thCheck: "പരിശോധിക്കാൻ", thDeps: "ഡിപെൻഡന്റുകൾ", thMonth: "മാസം", thYear: "വർഷം", thNat: "പൗരത്വം", thEmb: "എംബസി വെബ്സൈറ്റ്", thPass: "ഓൺലൈൻ പാസ്പോർട്ട് സേവനം", cSA: "സൗദി അറേബ്യ", cKW: "കുവൈത്ത്", cQA: "ഖത്തർ", cOM: "ഒമാൻ", cBH: "ബഹ്‌റൈൻ", cIN: "ഇന്ത്യ", cPK: "പാകിസ്ഥാൻ", cNP: "നേപ്പാൾ", navApp: "മൊബൈൽ ആപ്പ്", appBar: "ExpatGuideME ആപ്പ് ഉടൻ Android-ലും iPhone-ലും വരുന്നു.", appBarInstall: "ഇപ്പോൾ ഇൻസ്റ്റാൾ ചെയ്യൂ", appBarMore: "എന്നെ അറിയിക്കൂ", appClose: "അടയ്ക്കുക", appSoonAndroid: "ഉടൻ Android-ൽ", appSoonIos: "ഉടൻ iPhone-ൽ", appGet: "ആപ്പ് നേടൂ", appInstallBtn: "വെബ് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ", appTitle: "ExpatGuideME ആപ്പ്", appLead: "ഗൾഫ് പ്രവാസികൾക്കുള്ള ഞങ്ങളുടെ എല്ലാ സൗജന്യ ടൂളുകളും ഒരു ആപ്പിൽ: വിനിമയ നിരക്കുകൾ, ട്രാൻസ്ഫർ താരതമ്യം, എൻഡ് ഓഫ് സർവീസ്, ലീവ്, കുടുംബച്ചെലവ് കാൽക്കുലേറ്ററുകൾ, 8 ഭാഷകളിൽ. Android, iPhone ആപ്പുകൾ വരുന്നു.", appF1: "ഹോം സ്ക്രീനിൽ ഇന്നത്തെ നിരക്കുകൾ", appF2: "ഇന്റർനെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കുന്ന കാൽക്കുലേറ്ററുകൾ", appF3: "ശമ്പള ദിവസം, ഇഖാമ പുതുക്കൽ ഓർമ്മപ്പെടുത്തലുകൾ", appF4: "നിങ്ങളുടെ ഭാഷ: അറബി, ഉർദു, ബംഗ്ല ഉൾപ്പെടെ 8 ഭാഷകൾ", appNotifyTitle: "ആപ്പ് ലോഞ്ച് ചെയ്യുമ്പോൾ അറിയിപ്പ് നേടൂ", appNotifyText: "നിങ്ങളുടെ ഇമെയിൽ നൽകൂ; ആപ്പ് Google Play-യിലും App Store-ലും എത്തുമ്പോൾ ഒരു സന്ദേശം മാത്രം അയക്കും. സ്പാം ഇല്ല.", appEmail: "നിങ്ങളുടെ ഇമെയിൽ", appNotifyBtn: "ലോഞ്ചിൽ അറിയിക്കൂ", appNotifyOk: "നന്ദി! ആപ്പ് ലോഞ്ച് ചെയ്യുമ്പോൾ ഞങ്ങൾ ഇമെയിൽ അയക്കും.", appNowTitle: "ഇന്നുതന്നെ ആപ്പായി ഉപയോഗിക്കൂ", appNowText: "കാത്തിരിക്കേണ്ട. ExpatGuideME ഹോം സ്ക്രീനിൽ ചേർക്കൂ; അത് ആപ്പ് പോലെ തുറക്കും, കാൽക്കുലേറ്ററുകൾ ഇന്റർനെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കും.", appAndroidHow: "Android-ൽ (Chrome): Install അമർത്തുക, അല്ലെങ്കിൽ ⋮ മെനു തുറന്ന് Add to Home screen തിരഞ്ഞെടുക്കുക.", appIosHow: "iPhone-ൽ (Safari): Share ബട്ടൺ അമർത്തി Add to Home Screen തിരഞ്ഞെടുക്കുക.", appInstalled: "ExpatGuideME ഈ ഉപകരണത്തിൽ ഇതിനകം ഇൻസ്റ്റാൾ ചെയ്തിട്ടുണ്ട്.", offTitle: "നിങ്ങൾ ഓഫ്‌ലൈനാണ്", offText: "ഈ പേജ് ഇതുവരെ ഉപകരണത്തിൽ സേവ് ചെയ്തിട്ടില്ല. മുമ്പ് തുറന്ന പേജുകൾ ഇപ്പോഴും പ്രവർത്തിക്കും: എൻഡ് ഓഫ് സർവീസ്, ലീവ്, കുടുംബച്ചെലവ്, എംബസി പേജുകൾ നോക്കൂ.", offRetry: "വീണ്ടും ശ്രമിക്കുക", navVac: "ലീവ് കാൽക്കുലേറ്റർ", xVac: "ഉപയോഗിക്കാത്ത ലീവിന്റെ പണവും പരിശോധിക്കൂ", cAE: "യുഎഇ", thDaysYear: "വർഷം ലഭിക്കുന്ന ലീവ്", sumVacQ: "ഓരോ ഗൾഫ് രാജ്യത്തും പ്രവാസികൾക്ക് എത്ര വാർഷിക ലീവ് ലഭിക്കും?", sumVacA: "സൗദി വർഷം 21 ദിവസം നൽകുന്നു, ഒരേ തൊഴിലുടമയുടെ കീഴിൽ 5 വർഷത്തിന് ശേഷം 30 ആകും; ഖത്തർ 21 ദിവസം, 5 വർഷത്തിന് ശേഷം 28. യുഎഇ, കുവൈത്ത്, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവ വർഷം 30 ദിവസം നൽകുന്നു. ഇവ നിയമപരമായ കുറഞ്ഞ അവകാശങ്ങളാണ്; ജോലി വിടുമ്പോൾ ബാക്കി ദിവസങ്ങൾക്ക് പണം നൽകണം.", sendVia: "{name} വഴി അയക്കൂ →", affNote: "ചില സേവനങ്ങൾ സ്പോൺസേർഡ് പാർട്ണർമാരാണ് അല്ലെങ്കിൽ പാർട്ണർ (“… വഴി അയക്കൂ”) ലിങ്കുകളുണ്ട്: നിങ്ങൾക്ക് അധിക ചെലവില്ലാതെ ഞങ്ങൾക്ക് കമ്മീഷൻ ലഭിച്ചേക്കാം, ഇത് ഈ പട്ടികയുടെ ക്രമം ഒരിക്കലും മാറ്റില്ല.", affLink: "അഫിലിയേറ്റ് വെളിപ്പെടുത്തൽ", appPrivT: "മൊബൈൽ ആപ്പ് ലോഞ്ച് ലിസ്റ്റ്", appPrivA: "മൊബൈൽ ആപ്പ് പേജിലെ ലോഞ്ച് ലിസ്റ്റിൽ ചേർന്നാൽ, നിങ്ങളുടെ ഇമെയിൽ വിലാസവും തിരഞ്ഞെടുത്ത ഭാഷയും മാത്രമേ ഞങ്ങൾക്ക് ലഭിക്കൂ. ExpatGuideME ആപ്പ് Google Play-യിലും App Store-ലും ലഭ്യമാകുമ്പോൾ അറിയിക്കാൻ മാത്രമാണ് ഇവ ഉപയോഗിക്കുന്നത്. നിങ്ങളുടെ ഇമെയിൽ ഒരിക്കലും വിൽക്കുകയോ വാടകയ്ക്ക് നൽകുകയോ ആരുമായും പങ്കിടുകയോ ചെയ്യില്ല; കോൺടാക്റ്റ് പേജ് വഴി എപ്പോൾ വേണമെങ്കിലും അത് നീക്കം ചെയ്യാൻ ആവശ്യപ്പെടാം.", vacBaseNote: "കുവൈത്ത്, ഒമാൻ, ബഹ്‌റൈൻ: പണമൂല്യം സ്ഥിരമായി മുഴുവൻ ശമ്പളത്തിലാണ്. നിങ്ങളുടെ കരാർ ലീവ് ബേസിക് ശമ്പളത്തിലാണ് നൽകുന്നതെങ്കിൽ “ബേസിക് ശമ്പളം മാത്രം” തിരഞ്ഞെടുക്കുക.", sponsoredBadge: "സ്പോൺസേർഡ് പാർട്ണർ", essT: "പ്രവാസി ആവശ്യങ്ങൾ", essNote: "സ്പോൺസേർഡ് ലിങ്കുകൾ. ഞങ്ങൾക്ക് കമ്മീഷൻ ലഭിച്ചേക്കാം.", esimT: "മൊബൈൽ ഡാറ്റ, eSIM", esimD: "നാട്ടിലേക്കുള്ള യാത്രയ്ക്ക് ലോക്കൽ, റോമിംഗ് eSIM പ്ലാനുകൾ.", insT: "ആരോഗ്യ ഇൻഷുറൻസ്", insD: "നിങ്ങൾക്കും കുടുംബത്തിനുമുള്ള കവർ താരതമ്യം ചെയ്യൂ.", moveT: "ഷിഫ്റ്റിംഗ്, ഷിപ്പിംഗ്", moveD: "ഗൾഫിനും നാട്ടിനുമിടയിൽ സാധനങ്ങൾ അയക്കൂ.", navConsult: "വിദഗ്ധനോട് ചോദിക്കൂ", navPlaybook: "സാമ്പത്തിക പ്ലേബുക്ക്", xConsult: "കണക്ക് ശരിയാണോ എന്ന് ഉറപ്പില്ലേ? വിദഗ്ധ പരിശോധന ആവശ്യപ്പെടൂ", consentRequired: "അയക്കുന്നതിന് മുമ്പ് സമ്മതത്തിനുള്ള ബോക്സിൽ ടിക്ക് ചെയ്യുക.", affSponsT: "സ്പോൺസേർഡ് സ്ഥാനങ്ങൾ, പാർട്ണർ ഓഫറുകൾ, ഞങ്ങളുടെ സ്വന്തം ഗൈഡ്", affSponsA: "ചില മണി ട്രാൻസ്ഫർ സേവനങ്ങൾ “സ്പോൺസേർഡ് പാർട്ണർ” ആയി കാണിക്കാൻ പണം നൽകിയേക്കാം. അവർക്ക് ഒരു ലേബലും ഹൈലൈറ്റ് ചെയ്ത വരിയും ലഭിക്കും, എന്നാൽ കുടുംബത്തിന് ലഭിക്കുന്ന തുകയനുസരിച്ച് എപ്പോഴും ക്രമീകരിക്കുന്ന പട്ടികയിൽ അവരുടെ സ്ഥാനം മാറില്ല. “പ്രവാസി ആവശ്യങ്ങൾ” കാർഡിൽ സ്പോൺസേർഡ് ലിങ്കുകൾ മാത്രമാണ്. സാമ്പത്തിക പ്ലേബുക്ക് ഞങ്ങളുടെ സ്വന്തം പണമടച്ചുള്ള ഗൈഡാണ്, അത് അതിന്റെ പേജിൽ വ്യക്തമാക്കിയിട്ടുണ്ട്.", privConsultT: "വിദഗ്ധ പരിശോധന അപേക്ഷകൾ", privConsultA: "വിദഗ്ധ പരിശോധന ആവശ്യപ്പെട്ടാൽ നിങ്ങളുടെ പേര്, ഇമെയിൽ, രാജ്യം, വിഷയം, സന്ദേശം എന്നിവ ഞങ്ങൾക്ക് ലഭിക്കും. നിങ്ങളുടെ അപേക്ഷയ്ക്ക് മറുപടി നൽകാനും, ഫോമിൽ സമ്മതിച്ചാൽ സഹായിക്കാൻ കഴിയുന്ന ഒരു സ്വതന്ത്ര ഉപദേഷ്ടാവിന് കൈമാറാനും മാത്രമാണ് ഇവ ഉപയോഗിക്കുന്നത്. നിങ്ങളുടെ വിവരങ്ങൾ ഒരിക്കലും വിൽക്കില്ല. ഐഡി നമ്പർ, പാസ്‌വേഡ്, ബാങ്ക് വിവരങ്ങൾ അയക്കരുത്. കോൺടാക്റ്റ് പേജ് വഴി എപ്പോൾ വേണമെങ്കിലും അപേക്ഷ നീക്കം ചെയ്യാൻ ആവശ്യപ്പെടാം.", privGuideT: "പ്ലേബുക്ക് വെയിറ്റ്‌ലിസ്റ്റ്, വാങ്ങലുകൾ", privGuideA: "സാമ്പത്തിക പ്ലേബുക്ക് വെയിറ്റ്‌ലിസ്റ്റിൽ ചേർന്നാൽ, ഗൈഡ് ലഭ്യമാകുമ്പോൾ അറിയിക്കാൻ മാത്രം നിങ്ങളുടെ ഇമെയിൽ ഉപയോഗിക്കും. പണമടയ്ക്കുമ്പോൾ കാണിക്കുന്ന ചെക്ക്ഔട്ട് സേവനമാണ് പേയ്‌മെന്റ് കൈകാര്യം ചെയ്യുന്നത്; നിങ്ങളുടെ കാർഡ് വിവരങ്ങൾ ഞങ്ങൾ ഒരിക്കലും കാണില്ല.", navGold: "സ്വർണവില", sumGoldQ: "ഇന്ന് ഗൾഫിൽ സ്വർണം ഗ്രാമിന് എത്ര? (innathe gold rate)", sumGoldA: "ഓരോ ഗൾഫ് കറൻസിയിലും 24K, 22K, 21K സ്വർണത്തിന്റെ ഇന്ന് രാവിലത്തെ സ്പോട്ട് വില ഗ്രാമിന് പട്ടികയിൽ കാണാം. പേജിന് മുകളിലെ ലൈവ് വില ദിവസം മുഴുവൻ പുതുക്കും; കടകൾ ചെറിയ പ്രീമിയവും പണിക്കൂലിയും ചേർക്കും.", thPerGram: "ഗ്രാമിന്", countryPick: "നിങ്ങളുടെ രാജ്യം", rUpdated: "പുതുക്കിയത്: {time}", rFallback: "തത്സമയ നിരക്കുകൾ ലോഡ് ചെയ്യാനായില്ല. {time}-ന് സേവ് ചെയ്ത അവസാന നിരക്കുകളാണ് കാണിക്കുന്നത്.", navSim: "സിം & ഇന്റർനെറ്റ്", navVisa: "ഫാമിലി & വിസിറ്റ് വിസ", bnRates: "നിരക്ക്", bnSend: "അയക്കുക", bnGold: "സ്വർണം", bnMore: "കൂടുതൽ", themeLabel: "ഡാർക്ക് / ലൈറ്റ് മോഡ്", trendTitle: "ട്രെൻഡ്", trend30: "കഴിഞ്ഞ 30 ദിവസം", trendEcb: "യൂറോപ്യൻ സെൻട്രൽ ബാങ്കിന്റെ ദിവസേനയുള്ള റഫറൻസ് നിരക്കുകൾ (frankfurter.app വഴി).", trendOwn: "{date} മുതൽ ഓരോ 2 മണിക്കൂറിലും സേവ് ചെയ്ത നിരക്കുകൾ.", trendWait: "ചാർട്ടിന് ഇനിയും ആവശ്യത്തിന് റീഡിങ്ങുകളില്ല. ഓരോ 2 മണിക്കൂറിലും ഒന്ന് സേവ് ചെയ്യുന്നു, ഉടൻ നിറയും.", tHigh: "ഉയർന്നത്", tLow: "താഴ്ന്നത്", tChange: "മാറ്റം", secPrices: "വില", secCalc: "കാൽക്കുലേറ്റർ", secTrend: "ട്രെൻഡ്", secDuty: "ഇന്ത്യ ഡ്യൂട്ടി", secConvert: "കൺവെർട്ടർ", secRates: "എല്ലാ നിരക്കും", secFaq: "ചോദ്യങ്ങൾ", allCur: "1 {cur} എല്ലാ കറൻസികളിലും"
    },
    ne: {
      skip: "मुख्य सामग्रीमा जानुहोस्", navHome: "गृहपृष्ठ", navExchange: "विनिमय दर", navSend: "पैसा पठाउनुहोस्", navContact: "सम्पर्क", navPrivacy: "गोपनीयता",
      menu: "मेनु", close: "बन्द गर्नुहोस्", search: "खोज्नुहोस्", searchPh: "टुल र गाइडहरू खोज्नुहोस्…",
      noResults: "कुनै नतिजा भेटिएन। अर्को शब्द प्रयास गर्नुहोस्।", language: "भाषा",
      themeDark: "डार्क मोडमा बदल्नुहोस्", themeLight: "लाइट मोडमा बदल्नुहोस्",
      toTop: "माथि जानुहोस्", contactUs: "सम्पर्क गर्नुहोस्",
      nlTitle: "नयाँ गाइडहरू इमेलमा पाउनुहोस्", nlText: "नयाँ टुल वा गाइड थपिँदा एउटा छोटो इमेल मात्र। स्प्याम छैन।",
      nlEmail: "तपाईंको इमेल ठेगाना", nlButton: "सदस्यता लिनुहोस्", sending: "पठाउँदै…",
      nlSuccess: "धन्यवाद! तपाईंको सदस्यता भयो।", invalidEmail: "कृपया सही इमेल ठेगाना लेख्नुहोस्।",
      formRequired: "कृपया सबै विवरण भर्नुहोस्।", formError: "केही गडबड भयो। कृपया फेरि प्रयास गर्नुहोस्।",
      cookieText: "हामी तपाईंको भाषा र सेटिङहरू सम्झन ब्राउजर स्टोरेज प्रयोग गर्छौं। Google सहित हाम्रा विज्ञापन साझेदारहरूले विज्ञापन देखाउन कुकीज प्रयोग गर्न सक्छन्।",
      cookieLearn: "गोपनीयता नीति", cookieOk: "ठीक छ", lastUpdated: "पछिल्लो अपडेट:",
      disclaimer: "यो एक स्वतन्त्र वेबसाइट हो। यसको कुनै पनि सरकारी कार्यालय वा बैंकसँग सम्बन्ध छैन।",
      copy: "कपी गर्नुहोस्", copied: "कपी भयो ✓", navEos: "सेवा समाप्ति", navId: "परिचयपत्र र रेसिडेन्सी", navFamily: "परिवार खर्च", navEmbassy: "दूतावास सेवा", navAbout: "हाम्रोबारे", navTerms: "प्रयोगका सर्तहरू", navAffiliate: "एफिलिएट जानकारी", footerTools: "टुलहरू", footerSite: "वेबसाइट", ad: "विज्ञापन", pfExQ: "आजको रियाल रेट (aajko riyal rate) कति छ?", pfExA: "यो पृष्ठले साउदी रियाल, युएई दिरहम, कुवेती दिनार, कतारी रियाल, ओमानी रियाल र बहराइनी दिनारबाट नेपाली रुपैयाँ र अन्य मुद्राको प्रत्यक्ष बजार दर देखाउँछ। माथिका अंक आजको दर हुन्।", pfSendQ: "घर पैसा पठाउन आज कुन एपले राम्रो रियाल रेट दिन्छ?", pfSendA: "माथि आफ्नो रुट छान्नुहोस्, जस्तै साउदी अरबबाट भारत, बंगलादेश, पाकिस्तान, नेपाल वा फिलिपिन्स। लाइभ बजार दर यसको ठ्याक्कै अपडेट समयसहित देखिन्छ, र हरेक बैंक, एक्सचेन्ज र वालेटको आफ्नै दर हाम्रो टिमले त्यो कम्पनीको एपमा जाँचेपछि देखिन्छ।", pfEosQ: "साउदीमा सेवा समाप्ति (end of service) कसरी हिसाब गर्ने?", pfEosA: "साउदी अरब वा आफ्नो खाडी देश छान्नुहोस्, आधारभूत तलब, भत्ता र सेवा वर्ष राख्नुहोस्, र राजीनामा दिनुभएको हो कि होइन छान्नुहोस्। क्यालकुलेटरले साउदी श्रम कानुनको धारा ८४ र ८५ लागू गरी तुरुन्तै ग्र्याच्युटी देखाउँछ।", pfIdQ: "इकामाको म्याद कसरी जाँच्ने?", pfIdA: "साउदीमा Absher एप खोल्नुहोस्, ड्यासबोर्डमा इकामा नम्बर र म्याद देखिन्छ। कुवेतमा Sahel, कतारमा Metrash, र ओमान तथा बहराइनका लागि माथिको गाइड हेर्नुहोस्। फोनमा रिमाइन्डर पनि थप्न सक्नुहुन्छ।", pfFamQ: "साउदीमा परिवारसँग बस्न महिनाको कति खर्च लाग्छ?", pfFamA: "यो भाडा, स्कूल शुल्क र आश्रितको सङ्ख्यामा भर पर्छ। माथिको क्यालकुलेटरमा आफ्नो खर्च राख्नुहोस्; यसले हरेक व्यक्तिका लागि मासिक SAR 400 आश्रित शुल्क आफैँ जोड्छ र बचत देखाउँछ।", pfEmbQ: "खाडीमा काम गर्दा राहदानी कसरी नवीकरण गर्ने?", pfEmbA: "माथि आफ्नो नागरिकता र बस्ने देश छान्नुहोस्। दूतावासको आधिकारिक वेबसाइट, आवेदन दिने ठाउँ, र राहदानी, प्रहरी प्रमाणपत्र र प्रमाणीकरणका लिङ्क देखिन्छन्।", popConv: "लोकप्रिय रूपान्तरण", sumExQ: "आज खाडी मुद्राको रुपैयाँ, टाका र पेसोमा दर कति छ?", sumExA: "तालिकाले हरेक खाडी मुद्राबाट भारतीय रुपैयाँ, पाकिस्तानी रुपैयाँ, बंगलादेशी टाका, फिलिपिनी पेसो र नेपाली रुपैयाँको आजको बजार दर देखाउँछ। बैंक र ट्रान्सफर एपले अलि कम दिन्छन्, त्यसैले यसलाई सन्दर्भ मानेर पठाउनुअघि सेवाहरू तुलना गर्नुहोस्।", sumSendQ: "१,००० रियाल वा दिरहममा परिवारले कति पाउँछ?", sumSendA: "आजको बजार दरमा हरेक खाडी मुद्राको १,००० बराबर रकम तालिकामा छ। सेवाको मार्जिन र शुल्कपछि परिवारले प्रायः अलि कम पाउँछ, त्यसैले तलको तुलनाले वास्तवमा पुग्ने रकमअनुसार हरेक सेवा मिलाउँछ।", sumEosQ: "साउदी अरबमा सेवा समाप्ति रकम कति पाइन्छ?", sumEosA: "साउदी श्रम कानुनको धारा ८४ र ८५ अनुसार, पहिलो पाँच वर्षको हरेक वर्षका लागि आधा महिनाको तलब र त्यसपछिको हरेक वर्षका लागि पूरा महिनाको तलब पाइन्छ। राजीनामा दिँदा २ वर्षपछि एक तिहाइ, ५ वर्षपछि दुई तिहाइ र १० वर्षपछि पूरै रकम पाइन्छ।", sumIdQ: "हरेक खाडी देशमा कुन परिचयपत्र चाहिन्छ र कहाँ जाँच्ने?", sumIdA: "हरेक खाडी देशले आफ्नै रेसिडेन्स परिचयपत्र जारी गर्छ। तालिकामा त्यसको नाम र स्थिति तथा म्याद जाँच्न सकिने आधिकारिक एप वा पोर्टल छ।", sumFamQ: "साउदीमा आश्रित शुल्क वर्षमा कति हुन्छ?", sumFamA: "साउदी अरबमा आश्रित शुल्क हरेक परिवार सदस्यका लागि मासिक SAR 400 हो, जुन इकामा बनाउँदा वा नवीकरण गर्दा तिरिन्छ। तालिकाले आश्रितको सङ्ख्याअनुसार खर्च देखाउँछ; भाडा, स्कूल शुल्क र दैनिक खर्च तलको क्यालकुलेटरमा थप्नुहोस्।", sumEmbQ: "साउदीमा बस्दा राहदानी कहाँ नवीकरण गर्ने?", sumEmbA: "राहदानी नवीकरण, प्रहरी प्रमाणपत्र र प्रमाणीकरण तपाईंको देशको दूतावास र यसका आधिकारिक सेवा केन्द्रले गर्छन्। तालिकामा साउदीमा रहेका भारतीय, पाकिस्तानी र नेपाली नागरिकका लागि आधिकारिक वेबसाइट छन्; अन्य खाडी देशका लागि माथि आफ्नो देश छान्नुहोस्।", thGcc: "खाडी मुद्रा", thMarketOn: "बजार दर, मिति", thYouSend: "तपाईं पठाउनुहुन्छ", thYears: "सेवा वर्ष", thAward: "सम्झौता सकिँदा (महिनाको तलब)", thResign: "राजीनामा दिँदा (महिनाको तलब)", thCountry: "देश", thIdName: "रेसिडेन्स परिचयपत्र", thCheck: "यहाँ जाँच्नुहोस्", thDeps: "आश्रित", thMonth: "मासिक", thYear: "वार्षिक", thNat: "नागरिकता", thEmb: "दूतावास वेबसाइट", thPass: "अनलाइन राहदानी सेवा", cSA: "साउदी अरब", cKW: "कुवेत", cQA: "कतार", cOM: "ओमान", cBH: "बहराइन", cIN: "भारत", cPK: "पाकिस्तान", cNP: "नेपाल", navApp: "मोबाइल एप", appBar: "ExpatGuideME एप चाँडै Android र iPhone मा आउँदैछ।", appBarInstall: "अहिले इन्स्टल गर्नुहोस्", appBarMore: "मलाई जानकारी दिनुहोस्", appClose: "बन्द गर्नुहोस्", appSoonAndroid: "चाँडै Android मा", appSoonIos: "चाँडै iPhone मा", appGet: "एप लिनुहोस्", appInstallBtn: "वेब एप इन्स्टल गर्नुहोस्", appTitle: "ExpatGuideME एप", appLead: "खाडीका प्रवासीका लागि हाम्रा सबै निःशुल्क टुल एउटै एपमा: विनिमय दर, ट्रान्सफर तुलना, सेवा समाप्ति, बिदा र परिवार खर्च क्यालकुलेटर, ८ भाषामा। Android र iPhone एप आउँदैछन्।", appF1: "होम स्क्रिनमा आजको दर", appF2: "इन्टरनेटबिना चल्ने क्यालकुलेटर", appF3: "तलब दिन र इकामा नवीकरणको रिमाइन्डर", appF4: "तपाईंको भाषा: अरबी, उर्दू र बंगाली सहित ८ भाषा", appNotifyTitle: "एप सुरु हुँदा सूचना पाउनुहोस्", appNotifyText: "आफ्नो इमेल दिनुहोस्; एप Google Play र App Store मा आएपछि हामी एउटा मात्र सन्देश पठाउँछौं। स्पाम छैन।", appEmail: "तपाईंको इमेल", appNotifyBtn: "सुरु हुँदा जानकारी दिनुहोस्", appNotifyOk: "धन्यवाद! एप सुरु हुँदा हामी इमेल पठाउनेछौं।", appNowTitle: "आजै एपजस्तै प्रयोग गर्नुहोस्", appNowText: "पर्खनु पर्दैन। ExpatGuideME होम स्क्रिनमा थप्नुहोस्; यो एपजस्तै खुल्छ र क्यालकुलेटर इन्टरनेटबिना पनि चल्छन्।", appAndroidHow: "Android (Chrome) मा: Install थिच्नुहोस्, वा ⋮ मेनु खोलेर Add to Home screen छान्नुहोस्।", appIosHow: "iPhone (Safari) मा: Share बटन थिचेर Add to Home Screen छान्नुहोस्।", appInstalled: "ExpatGuideME यो उपकरणमा पहिले नै इन्स्टल छ।", offTitle: "तपाईं अफलाइन हुनुहुन्छ", offText: "यो पृष्ठ अझै तपाईंको उपकरणमा सेभ भएको छैन। पहिले खोलेका पृष्ठ अझै चल्छन्: सेवा समाप्ति, बिदा, परिवार खर्च वा दूतावास पृष्ठ प्रयास गर्नुहोस्।", offRetry: "फेरि प्रयास गर्नुहोस्", navVac: "बिदा क्यालकुलेटर", xVac: "प्रयोग नगरिएको बिदाको नगद पनि हेर्नुहोस्", cAE: "युएई", thDaysYear: "वार्षिक बिदा", sumVacQ: "हरेक खाडी देशमा प्रवासीले कति वार्षिक बिदा पाउँछन्?", sumVacA: "साउदीले वर्षमा २१ दिन दिन्छ, एउटै रोजगारदातासँग ५ वर्षपछि ३० हुन्छ; कतारले २१ दिन दिन्छ, ५ वर्षपछि २८। युएई, कुवेत, ओमान र बहराइनले वर्षमा ३० दिन दिन्छन्। यी कानुनी न्यूनतम हुन्, र काम छाड्दा बाँकी दिनको भुक्तानी गर्नुपर्छ।", sendVia: "{name} बाट पठाउनुहोस् →", affNote: "केही सेवा प्रायोजित साझेदार हुन् वा तिनका साझेदार (“… बाट पठाउनुहोस्”) लिङ्क छन्: तपाईंलाई थप खर्चबिना हामीले कमिसन पाउन सक्छौं, र यसले यो तालिकाको क्रम कहिल्यै बदल्दैन।", affLink: "एफिलिएट जानकारी", appPrivT: "मोबाइल एप सुरुवात सूची", appPrivA: "मोबाइल एप पृष्ठमा एप सुरुवात सूचीमा जोडिनुभयो भने हामीले तपाईंको इमेल ठेगाना र छानिएको भाषा मात्र पाउँछौं। ExpatGuideME एप Google Play र App Store मा उपलब्ध हुँदा जानकारी दिन मात्र हामी यसको प्रयोग गर्छौं। तपाईंको इमेल कहिल्यै बेच्ने, भाडामा दिने वा कसैसँग साझा गर्ने छैनौं, र सम्पर्क पृष्ठबाट जुनसुकै बेला हटाउन भन्न सक्नुहुन्छ।", vacBaseNote: "कुवेत, ओमान र बहराइन: नगद मूल्य पूर्वनिर्धारित रूपमा पूरा तलबमा हुन्छ। तपाईंको सम्झौताले बिदा आधारभूत तलबमा दिन्छ भने “आधारभूत तलब मात्र” छान्नुहोस्।", sponsoredBadge: "प्रायोजित साझेदार", essT: "प्रवासीका आवश्यकता", essNote: "प्रायोजित लिङ्क। हामीले कमिसन पाउन सक्छौं।", esimT: "मोबाइल डाटा र eSIM", esimD: "घर जाँदाका लागि स्थानीय र रोमिङ eSIM प्लान।", insT: "स्वास्थ्य बीमा", insD: "आफू र परिवारका लागि बीमा तुलना गर्नुहोस्।", moveT: "सरसामान सार्ने र ढुवानी", moveD: "खाडी र घरबीच सामान पठाउनुहोस्।", navConsult: "विज्ञलाई सोध्नुहोस्", navPlaybook: "वित्तीय प्लेबुक", xConsult: "हिसाब ठीक छ कि छैन निश्चित हुनुहुन्न? विज्ञबाट जाँच गराउनुहोस्", consentRequired: "पठाउनुअघि सहमतिको बाकसमा टिक लगाउनुहोस्।", affSponsT: "प्रायोजित स्थान, साझेदार प्रस्ताव र हाम्रो आफ्नै गाइड", affSponsA: "केही मनी ट्रान्सफर सेवाले “प्रायोजित साझेदार” देखिन भुक्तानी गर्न सक्छन्। तिनले लेबल र हाइलाइट गरिएको पङ्क्ति पाउँछन्, तर परिवारले पाउने रकमअनुसार सधैँ मिलाइने तालिकामा तिनको स्थान उही रहन्छ। “प्रवासीका आवश्यकता” कार्डमा प्रायोजित लिङ्क मात्र छन्। वित्तीय प्लेबुक हाम्रो आफ्नै सशुल्क गाइड हो, र यो कुरा त्यसको पृष्ठमा लेखिएको छ।", privConsultT: "विज्ञ जाँचका अनुरोध", privConsultA: "विज्ञ जाँचको अनुरोध गर्नुभयो भने हामीले तपाईंको नाम, इमेल, देश, विषय र सन्देश पाउँछौं। तपाईंको अनुरोधको जवाफ दिन र फारममा सहमति दिनुभयो भने मद्दत गर्न सक्ने एक स्वतन्त्र सल्लाहकारलाई पठाउन मात्र हामी यसको प्रयोग गर्छौं। तपाईंको विवरण कहिल्यै बेच्दैनौं। परिचयपत्र नम्बर, पासवर्ड वा बैंक विवरण नपठाउनुहोस्। सम्पर्क पृष्ठबाट जुनसुकै बेला अनुरोध हटाउन भन्न सक्नुहुन्छ।", privGuideT: "प्लेबुक प्रतीक्षा सूची र खरिद", privGuideA: "वित्तीय प्लेबुकको प्रतीक्षा सूचीमा जोडिनुभयो भने गाइड उपलब्ध हुँदा जानकारी दिन मात्र तपाईंको इमेल प्रयोग गर्छौं। भुक्तानी गर्दा देखिने चेकआउट सेवाले भुक्तानी सम्हाल्छ; हामी तपाईंको कार्ड विवरण कहिल्यै देख्दैनौं।", navGold: "सुनको भाउ", sumGoldQ: "आज खाडीमा सुनको प्रति ग्राम भाउ कति छ?", sumGoldA: "तालिकाले हरेक खाडी मुद्रामा 24K, 22K र 21K सुनको आज बिहानको स्पट भाउ प्रति ग्राम देखाउँछ। पृष्ठको माथिको लाइभ भाउ दिनभर अपडेट हुन्छ; पसलले थोरै प्रिमियम र बनाउने ज्याला थप्छन्।", thPerGram: "प्रति ग्राम", countryPick: "तपाईंको देश", rUpdated: "अपडेट: {time}", rFallback: "लाइभ दरहरू लोड हुन सकेनन्। {time} मा सुरक्षित गरिएका पछिल्ला दरहरू देखाइँदैछन्।", navSim: "सिम र इन्टरनेट", navVisa: "पारिवारिक र भिजिट भिसा", bnRates: "दर", bnSend: "पठाउनुहोस्", bnGold: "सुन", bnMore: "थप", themeLabel: "डार्क / लाइट मोड", trendTitle: "प्रवृत्ति", trend30: "पछिल्लो ३० दिन", trendEcb: "युरोपेली केन्द्रीय बैंकका दैनिक सन्दर्भ दर (frankfurter.app मार्फत)।", trendOwn: "{date} देखि हरेक २ घण्टामा सुरक्षित दरहरू।", trendWait: "चार्टका लागि अझै पर्याप्त रिडिङ छैन। हामी हरेक २ घण्टामा एउटा सुरक्षित गर्छौँ, छिट्टै भरिन्छ।", tHigh: "उच्च", tLow: "न्यून", tChange: "परिवर्तन", secPrices: "मूल्य", secCalc: "क्यालकुलेटर", secTrend: "प्रवृत्ति", secDuty: "भारत भन्सार", secConvert: "कन्भर्टर", secRates: "सबै दर", secFaq: "प्रश्न", allCur: "1 {cur} हरेक मुद्रामा"
    },
    ur: {
      skip: "مواد پر جائیں", navHome: "ہوم", navExchange: "شرحِ تبادلہ", navSend: "رقم بھیجیں", navContact: "رابطہ", navPrivacy: "رازداری",
      menu: "مینو", close: "بند کریں", search: "تلاش", searchPh: "ٹولز اور گائیڈز تلاش کریں…",
      noResults: "کوئی نتیجہ نہیں ملا۔ کوئی اور لفظ آزمائیں۔", language: "زبان",
      themeDark: "ڈارک موڈ پر جائیں", themeLight: "لائٹ موڈ پر جائیں",
      toTop: "اوپر جائیں", contactUs: "ہم سے رابطہ کریں",
      nlTitle: "نئی گائیڈز ای میل پر حاصل کریں", nlText: "نیا ٹول یا گائیڈ شامل ہونے پر صرف ایک مختصر ای میل۔ کوئی اسپام نہیں۔",
      nlEmail: "آپ کا ای میل ایڈریس", nlButton: "سبسکرائب کریں", sending: "بھیجا جا رہا ہے…",
      nlSuccess: "شکریہ! آپ نے سبسکرائب کر لیا ہے۔", invalidEmail: "براہِ کرم درست ای میل ایڈریس لکھیں۔",
      formRequired: "براہِ کرم تمام خانے پُر کریں۔", formError: "کچھ غلط ہو گیا۔ براہِ کرم دوبارہ کوشش کریں۔",
      cookieText: "ہم آپ کی زبان اور سیٹنگز یاد رکھنے کے لیے براؤزر اسٹوریج استعمال کرتے ہیں۔ Google سمیت ہمارے اشتہاری شراکت دار اشتہارات دکھانے کے لیے کوکیز استعمال کر سکتے ہیں۔",
      cookieLearn: "رازداری کی پالیسی", cookieOk: "ٹھیک ہے", lastUpdated: "آخری اپ ڈیٹ:",
      disclaimer: "یہ ایک آزاد ویب سائٹ ہے۔ اس کا کسی سرکاری دفتر یا بینک سے کوئی تعلق نہیں۔",
      copy: "کاپی کریں", copied: "کاپی ہو گیا ✓", navEos: "اختتامِ ملازمت", navId: "شناختی کارڈ و اقامہ", navFamily: "خاندانی خرچ", navEmbassy: "سفارت خانے کی خدمات", navAbout: "ہمارے بارے میں", navTerms: "استعمال کی شرائط", navAffiliate: "ایفیلیئٹ انکشاف", footerTools: "ٹولز", footerSite: "ویب سائٹ", ad: "اشتہار", pfExQ: "آج کا ریال ریٹ (aaj ka riyal rate) کیا ہے؟", pfExA: "یہ صفحہ سعودی ریال، اماراتی درہم، کویتی دینار، قطری ریال، عمانی ریال اور بحرینی دینار سے پاکستانی روپے اور دیگر کرنسیوں کا لائیو مارکیٹ ریٹ دکھاتا ہے۔ اوپر دیے گئے نمبر آج کا ریٹ ہیں۔", pfSendQ: "گھر رقم بھیجنے کے لیے آج سب سے اچھا ریال ریٹ کون سی ایپ دیتی ہے؟", pfSendA: "اوپر اپنا روٹ منتخب کریں، جیسے سعودی عرب سے بھارت، بنگلہ دیش، پاکستان، نیپال یا فلپائن۔ آپ کو لائیو مارکیٹ ریٹ اس کے درست اپڈیٹ وقت کے ساتھ نظر آئے گا، اور ہر بینک، ایکسچینج اور والیٹ کا اپنا ریٹ، جب ہماری ٹیم اسے اس کمپنی کی ایپ میں چیک کر لے۔", pfEosQ: "سعودی اختتامِ ملازمت کا حساب (end of service calculator) کیسے نکالیں؟", pfEosA: "سعودی عرب یا اپنا خلیجی ملک چنیں، بنیادی تنخواہ، الاؤنسز اور ملازمت کے سال لکھیں، اور بتائیں کہ استعفیٰ دیا یا نہیں۔ کیلکولیٹر سعودی لیبر لا کی دفعہ 84 اور 85 لاگو کر کے فوراً گریجویٹی دکھاتا ہے۔", pfIdQ: "اقامہ کی میعاد کیسے چیک کریں؟", pfIdA: "سعودی عرب میں Absher ایپ کھولیں، ڈیش بورڈ پر اقامہ نمبر اور میعاد نظر آتی ہے۔ کویت میں Sahel، قطر میں Metrash، اور عمان و بحرین کے لیے اوپر کی گائیڈ دیکھیں۔ آپ فون میں یاد دہانی بھی شامل کر سکتے ہیں۔", pfFamQ: "سعودی عرب میں خاندان کے ساتھ رہنے کا ماہانہ خرچ کتنا ہے؟", pfFamA: "یہ کرایہ، اسکول فیس اور ڈیپنڈنٹس کی تعداد پر منحصر ہے۔ اوپر کیلکولیٹر میں اپنے اخراجات درج کریں؛ یہ ہر فرد کے لیے ماہانہ SAR 400 ڈیپنڈنٹ فیس خود شامل کرتا ہے اور بچت دکھاتا ہے۔", pfEmbQ: "خلیج میں کام کرتے ہوئے پاسپورٹ کی تجدید کیسے کریں؟", pfEmbA: "اوپر اپنی شہریت اور رہائش کا ملک چنیں۔ آپ کو سفارت خانے کی سرکاری ویب سائٹ، درخواست کی جگہ، اور پاسپورٹ، پولیس سرٹیفکیٹ اور تصدیق کے لنکس نظر آئیں گے۔", popConv: "مقبول کنورژنز", sumExQ: "آج خلیجی کرنسیوں کا روپے، ٹکا اور پیسو میں ریٹ کیا ہے؟", sumExA: "ٹیبل ہر خلیجی کرنسی سے بھارتی روپے، پاکستانی روپے، بنگلہ دیشی ٹکا، فلپائنی پیسو اور نیپالی روپے کا آج کا مارکیٹ ریٹ دکھاتی ہے۔ بینک اور ٹرانسفر ایپس تھوڑا کم دیتی ہیں، اس لیے اسے حوالہ سمجھیں اور بھیجنے سے پہلے سروسز کا موازنہ کریں۔", sumSendQ: "1,000 ریال یا درہم پر خاندان کو کتنا ملے گا؟", sumSendA: "آج کے مارکیٹ ریٹ پر ہر خلیجی کرنسی کے 1,000 کی قیمت ٹیبل میں دی گئی ہے۔ سروس کے مارجن اور فیس کے بعد خاندان کو عموماً کچھ کم ملتا ہے، اس لیے نیچے کا موازنہ ہر سروس کو اصل میں پہنچنے والی رقم کی ترتیب سے دکھاتا ہے۔", sumEosQ: "سعودی عرب میں اختتامِ ملازمت کی رقم کتنی ملتی ہے؟", sumEosA: "سعودی لیبر لا کی دفعہ 84 اور 85 کے مطابق پہلے پانچ سال کے ہر سال کے لیے آدھے مہینے کی تنخواہ اور اس کے بعد ہر سال کے لیے پورے مہینے کی تنخواہ ملتی ہے۔ استعفیٰ دینے پر 2 سال بعد ایک تہائی، 5 سال بعد دو تہائی اور 10 سال بعد پوری رقم ملتی ہے۔", sumIdQ: "ہر خلیجی ملک میں کون سا شناختی کارڈ چاہیے اور اسے کہاں چیک کریں؟", sumIdA: "ہر خلیجی ملک اپنا رہائشی شناختی کارڈ جاری کرتا ہے۔ ٹیبل میں اس کا نام اور وہ سرکاری ایپ یا پورٹل ہے جہاں آپ اس کی حیثیت اور میعاد دیکھ سکتے ہیں۔", sumFamQ: "سعودی عرب میں ڈیپنڈنٹ فیس سالانہ کتنی ہے؟", sumFamA: "سعودی عرب میں ڈیپنڈنٹ فیس ہر فیملی ممبر کے لیے ماہانہ SAR 400 ہے، جو اقامہ بنواتے یا تجدید کرواتے وقت ادا کی جاتی ہے۔ ٹیبل ڈیپنڈنٹس کی تعداد کے حساب سے خرچ دکھاتی ہے؛ کرایہ، اسکول فیس اور روزمرہ اخراجات نیچے کیلکولیٹر میں شامل کریں۔", sumEmbQ: "سعودی عرب میں رہتے ہوئے پاسپورٹ کہاں سے تجدید کروائیں؟", sumEmbA: "پاسپورٹ کی تجدید، پولیس سرٹیفکیٹ اور تصدیق آپ کے ملک کا سفارت خانہ اور اس کے سرکاری سروس سینٹر کرتے ہیں۔ ٹیبل میں سعودی عرب میں بھارتی، پاکستانی اور نیپالی شہریوں کے لیے سرکاری ویب سائٹس ہیں؛ دوسرے خلیجی ممالک کے لیے اوپر اپنا ملک چنیں۔", thGcc: "خلیجی کرنسی", thMarketOn: "مارکیٹ ریٹ، تاریخ", thYouSend: "آپ بھیجتے ہیں", thYears: "ملازمت کے سال", thAward: "معاہدہ ختم (مہینوں کی تنخواہ)", thResign: "استعفیٰ (مہینوں کی تنخواہ)", thCountry: "ملک", thIdName: "رہائشی شناختی کارڈ", thCheck: "یہاں چیک کریں", thDeps: "ڈیپنڈنٹس", thMonth: "ماہانہ", thYear: "سالانہ", thNat: "شہریت", thEmb: "سفارت خانے کی ویب سائٹ", thPass: "آن لائن پاسپورٹ سروس", cSA: "سعودی عرب", cKW: "کویت", cQA: "قطر", cOM: "عمان", cBH: "بحرین", cIN: "بھارت", cPK: "پاکستان", cNP: "نیپال", navApp: "موبائل ایپ", appBar: "ExpatGuideME ایپ جلد Android اور iPhone پر آ رہی ہے۔", appBarInstall: "ابھی انسٹال کریں", appBarMore: "مجھے بتائیں", appClose: "بند کریں", appSoonAndroid: "جلد Android پر", appSoonIos: "جلد iPhone پر", appGet: "ایپ حاصل کریں", appInstallBtn: "ویب ایپ انسٹال کریں", appTitle: "ExpatGuideME ایپ", appLead: "خلیج میں رہنے والوں کے لیے ہمارے تمام مفت ٹولز ایک ایپ میں: ایکسچینج ریٹ، ٹرانسفر موازنہ، اختتامِ ملازمت، چھٹی اور خاندانی خرچ کیلکولیٹر، 8 زبانوں میں۔ Android اور iPhone ایپس راستے میں ہیں۔", appF1: "ہوم اسکرین پر آج کے ریٹ", appF2: "انٹرنیٹ کے بغیر چلنے والے کیلکولیٹر", appF3: "تنخواہ کے دن اور اقامہ تجدید کی یاد دہانی", appF4: "آپ کی زبان: عربی، اردو اور بنگالی سمیت 8 زبانیں", appNotifyTitle: "ایپ لانچ ہونے پر اطلاع پائیں", appNotifyText: "اپنا ای میل دیں، ایپ Google Play اور App Store پر آتے ہی ہم ایک پیغام بھیجیں گے۔ کوئی اسپام نہیں۔", appEmail: "آپ کا ای میل", appNotifyBtn: "لانچ پر بتائیں", appNotifyOk: "شکریہ! ایپ لانچ ہونے پر ہم آپ کو ای میل کریں گے۔", appNowTitle: "آج ہی ایپ کی طرح استعمال کریں", appNowText: "انتظار کی ضرورت نہیں۔ ExpatGuideME کو ہوم اسکرین پر شامل کریں، یہ ایپ کی طرح کھلے گا اور کیلکولیٹر انٹرنیٹ کے بغیر بھی چلیں گے۔", appAndroidHow: "Android (Chrome) پر: Install دبائیں، یا ⋮ مینو کھول کر Add to Home screen چنیں۔", appIosHow: "iPhone (Safari) پر: Share بٹن دبائیں، پھر Add to Home Screen چنیں۔", appInstalled: "ExpatGuideME اس ڈیوائس پر پہلے سے انسٹال ہے۔", offTitle: "آپ آف لائن ہیں", offText: "یہ صفحہ ابھی آپ کی ڈیوائس پر محفوظ نہیں۔ پہلے کھولے گئے صفحات اب بھی چلتے ہیں: اختتامِ ملازمت، چھٹی، خاندانی خرچ یا سفارت خانے کے صفحات آزمائیں۔", offRetry: "دوبارہ کوشش کریں", navVac: "چھٹی کیلکولیٹر", xVac: "باقی چھٹیوں کی نقد ادائیگی بھی دیکھیں", cAE: "امارات", thDaysYear: "سالانہ چھٹی", sumVacQ: "ہر خلیجی ملک میں تارکینِ وطن کو کتنی سالانہ چھٹی ملتی ہے؟", sumVacA: "سعودی عرب سالانہ 21 دن دیتا ہے جو ایک ہی آجر کے ساتھ 5 سال بعد 30 ہو جاتے ہیں؛ قطر 21 دن دیتا ہے جو 5 سال بعد 28 ہو جاتے ہیں۔ امارات، کویت، عمان اور بحرین سالانہ 30 دن دیتے ہیں۔ یہ قانونی کم از کم ہیں، اور ملازمت چھوڑنے پر باقی دنوں کی ادائیگی لازم ہے۔", sendVia: "{name} سے بھیجیں ←", affNote: "کچھ سروسز اسپانسر پارٹنر ہیں یا ان کے پارٹنر (“… سے بھیجیں”) لنکس ہیں: آپ پر کوئی اضافی خرچ نہیں، ہمیں کمیشن مل سکتا ہے، اور اس سے اس ٹیبل کی ترتیب کبھی نہیں بدلتی۔", affLink: "ایفیلیئٹ انکشاف", appPrivT: "موبائل ایپ لانچ فہرست", appPrivA: "اگر آپ موبائل ایپ صفحے پر ایپ لانچ فہرست میں شامل ہوتے ہیں تو ہمیں صرف آپ کا ای میل پتہ اور منتخب زبان ملتی ہے۔ ہم انہیں صرف یہ بتانے کے لیے استعمال کرتے ہیں کہ ExpatGuideME ایپ Google Play اور App Store پر کب دستیاب ہے۔ ہم آپ کا ای میل کبھی کسی کو فروخت، کرائے پر یا شیئر نہیں کریں گے، اور آپ رابطہ صفحے سے کسی بھی وقت اسے حذف کرنے کا کہہ سکتے ہیں۔", vacBaseNote: "کویت، عمان اور بحرین: نقد قیمت بطورِ طے شدہ پوری تنخواہ پر ہے۔ اگر آپ کا معاہدہ چھٹی بنیادی تنخواہ پر دیتا ہے تو “صرف بنیادی تنخواہ” چنیں۔", sponsoredBadge: "اسپانسر پارٹنر", essT: "تارکینِ وطن کی ضروریات", essNote: "اسپانسر لنکس۔ ہمیں کمیشن مل سکتا ہے۔", esimT: "موبائل ڈیٹا اور eSIM", esimD: "گھر جاتے وقت کے لیے لوکل اور رومنگ eSIM پلان۔", insT: "ہیلتھ انشورنس", insD: "اپنے اور خاندان کے لیے کور کا موازنہ کریں۔", moveT: "سامان کی منتقلی اور شپنگ", moveD: "خلیج اور گھر کے درمیان سامان بھیجیں۔", navConsult: "ماہر سے پوچھیں", navPlaybook: "مالی پلے بک", xConsult: "یقین نہیں کہ حساب درست ہے؟ ماہر سے جائزہ لیں", consentRequired: "بھیجنے سے پہلے رضامندی کے خانے پر نشان لگائیں۔", affSponsT: "اسپانسر جگہیں، پارٹنر آفرز اور ہماری اپنی گائیڈ", affSponsA: "کچھ منی ٹرانسفر سروسز “اسپانسر پارٹنر” کے طور پر دکھائی دینے کے لیے ادائیگی کر سکتی ہیں۔ انہیں ایک لیبل اور نمایاں قطار ملتی ہے، مگر ٹیبل میں ان کی جگہ وہی رہتی ہے، جو ہمیشہ خاندان کو ملنے والی رقم کی ترتیب سے ہوتی ہے۔ “تارکینِ وطن کی ضروریات” کارڈ میں صرف اسپانسر لنکس ہیں۔ مالی پلے بک ہماری اپنی ادائیگی والی گائیڈ ہے، اور یہ اس کے صفحے پر واضح لکھا ہے۔", privConsultT: "ماہر جائزے کی درخواستیں", privConsultA: "اگر آپ ماہر کے جائزے کی درخواست کرتے ہیں تو ہمیں آپ کا نام، ای میل، ملک، موضوع اور پیغام ملتا ہے۔ ہم انہیں صرف آپ کی درخواست کا جواب دینے کے لیے استعمال کرتے ہیں اور، اگر آپ فارم پر رضامندی دیں، تو مدد کر سکنے والے ایک آزاد مشیر کو بھیجتے ہیں۔ ہم آپ کی معلومات کبھی فروخت نہیں کرتے۔ شناختی نمبر، پاس ورڈ یا بینک تفصیلات نہ بھیجیں۔ آپ رابطہ صفحے سے کسی بھی وقت اپنی درخواست حذف کرنے کا کہہ سکتے ہیں۔", privGuideT: "پلے بک ویٹنگ لسٹ اور خریداری", privGuideA: "اگر آپ مالی پلے بک کی ویٹنگ لسٹ میں شامل ہوتے ہیں تو ہم آپ کا ای میل صرف یہ بتانے کے لیے استعمال کرتے ہیں کہ گائیڈ کب دستیاب ہے۔ ادائیگی، ادائیگی کے وقت دکھائی دینے والی چیک آؤٹ سروس سنبھالتی ہے؛ ہم آپ کے کارڈ کی تفصیلات کبھی نہیں دیکھتے۔", navGold: "سونے کا ریٹ", sumGoldQ: "آج خلیج میں سونے کا فی گرام ریٹ کیا ہے؟", sumGoldA: "ٹیبل ہر خلیجی کرنسی میں 24K، 22K اور 21K سونے کا آج صبح کا اسپاٹ ریٹ فی گرام دکھاتی ہے۔ صفحے کے اوپر لائیو ریٹ دن بھر اپڈیٹ ہوتا ہے؛ دکانیں تھوڑا پریمیم اور بنوائی شامل کرتی ہیں۔", thPerGram: "فی گرام", countryPick: "آپ کا ملک", rUpdated: "اپ ڈیٹ: {time}", rFallback: "لائیو ریٹ لوڈ نہیں ہو سکے۔ {time} کے محفوظ شدہ آخری ریٹ دکھائے جا رہے ہیں۔", navSim: "سم اور انٹرنیٹ", navVisa: "فیملی اور وزٹ ویزا", bnRates: "ریٹ", bnSend: "بھیجیں", bnGold: "سونا", bnMore: "مزید", themeLabel: "ڈارک / لائٹ موڈ", trendTitle: "رجحان", trend30: "پچھلے 30 دن", trendEcb: "یورپی مرکزی بینک کے روزانہ حوالہ ریٹ (frankfurter.app کے ذریعے)۔", trendOwn: "{date} سے ہر 2 گھنٹے میں محفوظ کیے گئے ریٹ۔", trendWait: "چارٹ کے لیے ابھی کافی ریڈنگز نہیں۔ ہم ہر 2 گھنٹے میں ایک محفوظ کرتے ہیں، جلد مکمل ہو جائے گا۔", tHigh: "سب سے زیادہ", tLow: "سب سے کم", tChange: "تبدیلی", secPrices: "قیمتیں", secCalc: "کیلکولیٹر", secTrend: "رجحان", secDuty: "بھارت ڈیوٹی", secConvert: "کنورٹر", secRates: "تمام ریٹ", secFaq: "سوالات", allCur: "1 {cur} ہر کرنسی میں"
    },
    bn: {
      skip: "মূল লেখায় যান", navHome: "হোম", navExchange: "বিনিময় হার", navSend: "টাকা পাঠান", navContact: "যোগাযোগ", navPrivacy: "গোপনীয়তা",
      menu: "মেনু", close: "বন্ধ করুন", search: "খুঁজুন", searchPh: "টুল ও গাইড খুঁজুন…",
      noResults: "কিছু পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।", language: "ভাষা",
      themeDark: "ডার্ক মোডে যান", themeLight: "লাইট মোডে যান",
      toTop: "উপরে যান", contactUs: "আমাদের সাথে যোগাযোগ করুন",
      nlTitle: "নতুন গাইড ইমেইলে পান", nlText: "নতুন টুল বা গাইড যোগ হলে শুধু একটি ছোট ইমেইল। কোনো স্প্যাম নয়।",
      nlEmail: "আপনার ইমেইল ঠিকানা", nlButton: "সাবস্ক্রাইব করুন", sending: "পাঠানো হচ্ছে…",
      nlSuccess: "ধন্যবাদ! আপনি সাবস্ক্রাইব করেছেন।", invalidEmail: "দয়া করে সঠিক ইমেইল ঠিকানা লিখুন।",
      formRequired: "দয়া করে সব ঘর পূরণ করুন।", formError: "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।",
      cookieText: "আপনার ভাষা ও সেটিংস মনে রাখতে আমরা ব্রাউজারের স্টোরেজ ব্যবহার করি। Google সহ আমাদের বিজ্ঞাপন অংশীদাররা বিজ্ঞাপন দেখাতে কুকি ব্যবহার করতে পারে।",
      cookieLearn: "গোপনীয়তা নীতি", cookieOk: "ঠিক আছে", lastUpdated: "সর্বশেষ আপডেট:",
      disclaimer: "এটি একটি স্বাধীন ওয়েবসাইট। কোনো সরকারি দপ্তর বা ব্যাংকের সাথে এর কোনো সম্পর্ক নেই।",
      copy: "কপি করুন", copied: "কপি হয়েছে ✓", navEos: "চাকরি শেষের পাওনা", navId: "আইডি ও আকামা", navFamily: "পরিবারের খরচ", navEmbassy: "দূতাবাস সেবা", navAbout: "আমাদের সম্পর্কে", navTerms: "ব্যবহারের শর্তাবলি", navAffiliate: "অ্যাফিলিয়েট তথ্য", footerTools: "টুলস", footerSite: "ওয়েবসাইট", ad: "বিজ্ঞাপন", pfExQ: "আজকের সৌদি রিয়াল রেট (ajker saudi riyal rate) কত?", pfExA: "এই পেজে সৌদি রিয়াল, আমিরাতি দিরহাম, কুয়েতি দিনার, কাতারি রিয়াল, ওমানি রিয়াল ও বাহরাইনি দিনার থেকে বাংলাদেশি টাকা ও অন্যান্য মুদ্রার লাইভ মার্কেট রেট দেখা যায়। ওপরের সংখ্যাগুলোই আজকের রেট।", pfSendQ: "দেশে টাকা পাঠাতে আজ কোন অ্যাপ সবচেয়ে ভালো রিয়াল রেট দেয়?", pfSendA: "ওপরে আপনার রুট বেছে নিন, যেমন সৌদি আরব থেকে ভারত, বাংলাদেশ, পাকিস্তান, নেপাল বা ফিলিপাইন। লাইভ মার্কেট রেট তার সঠিক হালনাগাদ সময়সহ দেখবেন, আর প্রতিটি ব্যাংক, এক্সচেঞ্জ ও ওয়ালেটের নিজস্ব রেট দেখাবে আমাদের টিম ওই কোম্পানির অ্যাপে যাচাই করার পরে।", pfEosQ: "সৌদিতে চাকরি শেষের পাওনা (end of service) কীভাবে হিসাব করব?", pfEosA: "সৌদি আরব বা আপনার উপসাগরীয় দেশ বেছে নিন, মূল বেতন, ভাতা ও চাকরির বছর লিখুন, এবং পদত্যাগ করেছেন কি না বেছে নিন। ক্যালকুলেটর সৌদি শ্রম আইনের ধারা ৮৪ ও ৮৫ প্রয়োগ করে সঙ্গে সঙ্গে গ্র্যাচুইটি দেখায়।", pfIdQ: "আকামার মেয়াদ কীভাবে চেক করব?", pfIdA: "সৌদিতে Absher অ্যাপ খুলুন, ড্যাশবোর্ডে আকামা নম্বর ও মেয়াদ দেখা যায়। কুয়েতে Sahel, কাতারে Metrash, আর ওমান ও বাহরাইনের জন্য ওপরের গাইড দেখুন। ফোনে রিমাইন্ডারও যোগ করতে পারেন।", pfFamQ: "সৌদিতে পরিবার নিয়ে থাকতে মাসে কত খরচ হয়?", pfFamA: "এটা ভাড়া, স্কুল ফি ও ডিপেন্ডেন্টের সংখ্যার ওপর নির্ভর করে। ওপরের ক্যালকুলেটরে নিজের খরচ লিখুন; এটি প্রতিজনের জন্য মাসে SAR 400 ডিপেন্ডেন্ট ফি নিজেই যোগ করে এবং সঞ্চয় দেখায়।", pfEmbQ: "উপসাগরীয় দেশে কাজ করার সময় পাসপোর্ট কীভাবে নবায়ন করব?", pfEmbA: "ওপরে আপনার নাগরিকত্ব ও যে দেশে থাকেন তা বেছে নিন। দূতাবাসের অফিসিয়াল ওয়েবসাইট, আবেদনের জায়গা, এবং পাসপোর্ট, পুলিশ সনদ ও সত্যায়নের লিংক দেখতে পাবেন।", popConv: "জনপ্রিয় রূপান্তর", sumExQ: "আজ উপসাগরীয় মুদ্রার রুপি, টাকা ও পেসো রেট কত?", sumExA: "টেবিলে প্রতিটি উপসাগরীয় মুদ্রা থেকে ভারতীয় রুপি, পাকিস্তানি রুপি, বাংলাদেশি টাকা, ফিলিপাইনের পেসো ও নেপালি রুপির আজকের মার্কেট রেট দেখানো হয়েছে। ব্যাংক ও ট্রান্সফার অ্যাপ একটু কম দেয়, তাই এটিকে রেফারেন্স ধরে পাঠানোর আগে সেবাগুলো তুলনা করুন।", sumSendQ: "১,০০০ রিয়াল বা দিরহামে পরিবার কত টাকা পাবে?", sumSendA: "আজকের মার্কেট রেটে প্রতিটি উপসাগরীয় মুদ্রার ১,০০০-এর মূল্য টেবিলে আছে। সেবাদাতার মার্জিন ও ফির পর পরিবার সাধারণত একটু কম পায়, তাই নিচের তুলনা আসলে কত পৌঁছায় সেই ক্রমে প্রতিটি সেবা সাজায়।", sumEosQ: "সৌদি আরবে চাকরি শেষের পাওনা কত পাওয়া যায়?", sumEosA: "সৌদি শ্রম আইনের ধারা ৮৪ ও ৮৫ অনুযায়ী প্রথম পাঁচ বছরের প্রতি বছরের জন্য অর্ধ মাসের বেতন এবং এরপর প্রতি বছরের জন্য পুরো এক মাসের বেতন পাওয়া যায়। পদত্যাগ করলে ২ বছর পর এক-তৃতীয়াংশ, ৫ বছর পর দুই-তৃতীয়াংশ এবং ১০ বছর পর পুরো পাওনা পাওয়া যায়।", sumIdQ: "প্রতিটি উপসাগরীয় দেশে কোন আইডি লাগে এবং কোথায় চেক করব?", sumIdA: "প্রতিটি উপসাগরীয় দেশ নিজস্ব রেসিডেন্স আইডি কার্ড দেয়। টেবিলে তার নাম এবং যে অফিসিয়াল অ্যাপ বা পোর্টালে এর অবস্থা ও মেয়াদ দেখা যায় তা আছে।", sumFamQ: "সৌদিতে ডিপেন্ডেন্ট ফি বছরে কত?", sumFamA: "সৌদি আরবে ডিপেন্ডেন্ট ফি প্রতি পরিবার-সদস্যের জন্য মাসে SAR 400, যা আকামা করার বা নবায়নের সময় দিতে হয়। টেবিলে ডিপেন্ডেন্টের সংখ্যা অনুযায়ী খরচ দেখানো হয়েছে; ভাড়া, স্কুল ফি ও দৈনন্দিন খরচ নিচের ক্যালকুলেটরে যোগ করুন।", sumEmbQ: "সৌদিতে থেকে পাসপোর্ট কোথায় নবায়ন করব?", sumEmbA: "পাসপোর্ট নবায়ন, পুলিশ সনদ ও সত্যায়ন আপনার দেশের দূতাবাস ও তার অফিসিয়াল সেবা কেন্দ্র করে। টেবিলে সৌদিতে থাকা ভারতীয়, পাকিস্তানি ও নেপালি নাগরিকদের অফিসিয়াল ওয়েবসাইট আছে; অন্য উপসাগরীয় দেশের জন্য ওপরে আপনার দেশ বেছে নিন।", thGcc: "উপসাগরীয় মুদ্রা", thMarketOn: "মার্কেট রেট, তারিখ", thYouSend: "আপনি পাঠান", thYears: "চাকরির বছর", thAward: "চুক্তি শেষ (মাসের বেতন)", thResign: "পদত্যাগ (মাসের বেতন)", thCountry: "দেশ", thIdName: "রেসিডেন্স আইডি", thCheck: "কোথায় চেক করবেন", thDeps: "ডিপেন্ডেন্ট", thMonth: "মাসে", thYear: "বছরে", thNat: "নাগরিকত্ব", thEmb: "দূতাবাসের ওয়েবসাইট", thPass: "অনলাইন পাসপোর্ট সেবা", cSA: "সৌদি আরব", cKW: "কুয়েত", cQA: "কাতার", cOM: "ওমান", cBH: "বাহরাইন", cIN: "ভারত", cPK: "পাকিস্তান", cNP: "নেপাল", navApp: "মোবাইল অ্যাপ", appBar: "ExpatGuideME অ্যাপ শিগগিরই Android ও iPhone-এ আসছে।", appBarInstall: "এখনই ইনস্টল করুন", appBarMore: "আমাকে জানান", appClose: "বন্ধ করুন", appSoonAndroid: "শিগগিরই Android-এ", appSoonIos: "শিগগিরই iPhone-এ", appGet: "অ্যাপ নিন", appInstallBtn: "ওয়েব অ্যাপ ইনস্টল করুন", appTitle: "ExpatGuideME অ্যাপ", appLead: "উপসাগরীয় প্রবাসীদের জন্য আমাদের সব ফ্রি টুল এক অ্যাপে: বিনিময় হার, ট্রান্সফার তুলনা, চাকরি শেষের পাওনা, ছুটি ও পরিবারের খরচ ক্যালকুলেটর, ৮টি ভাষায়। Android ও iPhone অ্যাপ আসছে।", appF1: "হোম স্ক্রিনে আজকের রেট", appF2: "ইন্টারনেট ছাড়াই চলে এমন ক্যালকুলেটর", appF3: "বেতনের দিন ও আকামা নবায়নের রিমাইন্ডার", appF4: "আপনার ভাষা: আরবি, উর্দু ও বাংলাসহ ৮টি ভাষা", appNotifyTitle: "অ্যাপ চালু হলে খবর পান", appNotifyText: "আপনার ইমেইল দিন; অ্যাপ Google Play ও App Store-এ এলে আমরা একটি মাত্র বার্তা পাঠাব। কোনো স্প্যাম নয়।", appEmail: "আপনার ইমেইল", appNotifyBtn: "চালু হলে জানান", appNotifyOk: "ধন্যবাদ! অ্যাপ চালু হলে আমরা আপনাকে ইমেইল করব।", appNowTitle: "আজই অ্যাপের মতো ব্যবহার করুন", appNowText: "অপেক্ষার দরকার নেই। ExpatGuideME হোম স্ক্রিনে যোগ করুন; এটি অ্যাপের মতো খুলবে এবং ক্যালকুলেটর ইন্টারনেট ছাড়াও চলবে।", appAndroidHow: "Android-এ (Chrome): Install চাপুন, বা ⋮ মেনু খুলে Add to Home screen বেছে নিন।", appIosHow: "iPhone-এ (Safari): Share বোতাম চেপে Add to Home Screen বেছে নিন।", appInstalled: "ExpatGuideME এই ডিভাইসে আগেই ইনস্টল করা আছে।", offTitle: "আপনি অফলাইনে আছেন", offText: "এই পেজটি এখনো আপনার ডিভাইসে সংরক্ষিত হয়নি। আগে খোলা পেজগুলো এখনো চলে: চাকরি শেষের পাওনা, ছুটি, পরিবারের খরচ বা দূতাবাস পেজ দেখুন।", offRetry: "আবার চেষ্টা করুন", navVac: "ছুটির ক্যালকুলেটর", xVac: "না নেওয়া ছুটির নগদ টাকাও দেখুন", cAE: "আমিরাত", thDaysYear: "বছরে ছুটি", sumVacQ: "প্রতিটি উপসাগরীয় দেশে প্রবাসীরা বছরে কত দিন ছুটি পান?", sumVacA: "সৌদি আরব বছরে ২১ দিন দেয়, একই নিয়োগকর্তার অধীনে ৫ বছর পর ৩০ দিন; কাতার ২১ দিন দেয়, ৫ বছর পর ২৮। আমিরাত, কুয়েত, ওমান ও বাহরাইন বছরে ৩০ দিন দেয়। এগুলো আইনি ন্যূনতম, আর চাকরি ছাড়লে বাকি দিনের টাকা দিতে হয়।", sendVia: "{name} দিয়ে পাঠান →", affNote: "কিছু সেবা স্পনসর পার্টনার বা তাদের পার্টনার (“… দিয়ে পাঠান”) লিংক আছে: আপনার কোনো বাড়তি খরচ ছাড়াই আমরা কমিশন পেতে পারি, আর এতে এই টেবিলের ক্রম কখনো বদলায় না।", affLink: "অ্যাফিলিয়েট তথ্য", appPrivT: "মোবাইল অ্যাপ লঞ্চ তালিকা", appPrivA: "মোবাইল অ্যাপ পেজে অ্যাপ লঞ্চ তালিকায় যোগ দিলে আমরা শুধু আপনার ইমেইল ঠিকানা ও বেছে নেওয়া ভাষা পাই। ExpatGuideME অ্যাপ Google Play ও App Store-এ এলে জানানোর জন্যই কেবল এগুলো ব্যবহার করি। আপনার ইমেইল কখনো বিক্রি, ভাড়া বা কারও সঙ্গে শেয়ার করব না, আর যোগাযোগ পেজ থেকে যেকোনো সময় মুছে ফেলতে বলতে পারেন।", vacBaseNote: "কুয়েত, ওমান ও বাহরাইন: নগদ মূল্য ডিফল্টভাবে পূর্ণ বেতনে। আপনার চুক্তিতে ছুটির টাকা মূল বেতনে হলে “শুধু মূল বেতন” বেছে নিন।", sponsoredBadge: "স্পনসর পার্টনার", essT: "প্রবাসীর প্রয়োজনীয় সেবা", essNote: "স্পনসর লিংক। আমরা কমিশন পেতে পারি।", esimT: "মোবাইল ডেটা ও eSIM", esimD: "দেশে যাওয়ার জন্য লোকাল ও রোমিং eSIM প্ল্যান।", insT: "স্বাস্থ্য বিমা", insD: "আপনার ও পরিবারের জন্য কভার তুলনা করুন।", moveT: "মালপত্র স্থানান্তর ও শিপিং", moveD: "উপসাগরীয় দেশ ও দেশের মধ্যে মালপত্র পাঠান।", navConsult: "বিশেষজ্ঞকে জিজ্ঞেস করুন", navPlaybook: "আর্থিক প্লেবুক", xConsult: "হিসাব ঠিক আছে কি না নিশ্চিত নন? বিশেষজ্ঞ দিয়ে যাচাই করান", consentRequired: "পাঠানোর আগে সম্মতির ঘরে টিক দিন।", affSponsT: "স্পনসর স্থান, পার্টনার অফার ও আমাদের নিজস্ব গাইড", affSponsA: "কিছু মানি ট্রান্সফার সেবা “স্পনসর পার্টনার” হিসেবে দেখানোর জন্য অর্থ দিতে পারে। তারা একটি লেবেল ও হাইলাইট করা সারি পায়, কিন্তু পরিবার কত পাবে সেই অনুযায়ী সাজানো টেবিলে তাদের জায়গা একই থাকে। “প্রবাসীর প্রয়োজনীয় সেবা” কার্ডে শুধু স্পনসর লিংক আছে। আর্থিক প্লেবুক আমাদের নিজস্ব পেইড গাইড, এবং তা এর পেজে স্পষ্ট লেখা আছে।", privConsultT: "বিশেষজ্ঞ যাচাইয়ের অনুরোধ", privConsultA: "বিশেষজ্ঞ যাচাইয়ের অনুরোধ করলে আমরা আপনার নাম, ইমেইল, দেশ, বিষয় ও বার্তা পাই। শুধু আপনার অনুরোধের উত্তর দিতে এবং ফর্মে সম্মতি দিলে সাহায্য করতে পারেন এমন একজন স্বাধীন পরামর্শদাতাকে পাঠাতে এগুলো ব্যবহার করি। আপনার তথ্য কখনো বিক্রি করি না। আইডি নম্বর, পাসওয়ার্ড বা ব্যাংকের তথ্য পাঠাবেন না। যোগাযোগ পেজ থেকে যেকোনো সময় অনুরোধ মুছে ফেলতে বলতে পারেন।", privGuideT: "প্লেবুকের অপেক্ষা তালিকা ও কেনাকাটা", privGuideA: "আর্থিক প্লেবুকের অপেক্ষা তালিকায় যোগ দিলে গাইড পাওয়া গেলে জানাতেই কেবল আপনার ইমেইল ব্যবহার করি। পেমেন্টের সময় দেখানো চেকআউট সেবা পেমেন্ট পরিচালনা করে; আমরা কখনো আপনার কার্ডের তথ্য দেখি না।", navGold: "সোনার দাম", sumGoldQ: "আজ উপসাগরীয় দেশে সোনার প্রতি গ্রাম দাম কত?", sumGoldA: "টেবিলে প্রতিটি উপসাগরীয় মুদ্রায় 24K, 22K ও 21K সোনার আজ সকালের স্পট দাম প্রতি গ্রাম দেখানো হয়েছে। পেজের ওপরের লাইভ দাম সারাদিন আপডেট হয়; দোকান সামান্য প্রিমিয়াম ও মজুরি যোগ করে।", thPerGram: "প্রতি গ্রাম", countryPick: "আপনার দেশ", rUpdated: "আপডেট: {time}", rFallback: "লাইভ রেট লোড করা যায়নি। {time}-এর সংরক্ষিত সর্বশেষ রেট দেখানো হচ্ছে।", navSim: "সিম ও ইন্টারনেট", navVisa: "ফ্যামিলি ও ভিজিট ভিসা", bnRates: "রেট", bnSend: "পাঠান", bnGold: "সোনা", bnMore: "আরও", themeLabel: "ডার্ক / লাইট মোড", trendTitle: "প্রবণতা", trend30: "গত ৩০ দিন", trendEcb: "ইউরোপীয় কেন্দ্রীয় ব্যাংকের দৈনিক রেফারেন্স রেট (frankfurter.app এর মাধ্যমে)।", trendOwn: "{date} থেকে প্রতি ২ ঘণ্টায় সংরক্ষিত রেট।", trendWait: "চার্টের জন্য এখনও যথেষ্ট রিডিং নেই। আমরা প্রতি ২ ঘণ্টায় একটি সংরক্ষণ করি, শিগগিরই পূর্ণ হবে।", tHigh: "সর্বোচ্চ", tLow: "সর্বনিম্ন", tChange: "পরিবর্তন", secPrices: "দাম", secCalc: "ক্যালকুলেটর", secTrend: "প্রবণতা", secDuty: "ভারতের শুল্ক", secConvert: "কনভার্টার", secRates: "সব রেট", secFaq: "প্রশ্ন", allCur: "1 {cur} প্রতিটি মুদ্রায়"
    },
    tl: {
      skip: "Pumunta sa nilalaman", navHome: "Home", navExchange: "Palitan ng pera", navSend: "Magpadala ng pera", navContact: "Makipag-ugnayan", navPrivacy: "Privacy",
      menu: "Menu", close: "Isara", search: "Maghanap", searchPh: "Maghanap ng tools at gabay…",
      noResults: "Walang nahanap. Subukan ang ibang salita.", language: "Wika",
      themeDark: "Lumipat sa dark mode", themeLight: "Lumipat sa light mode",
      toTop: "Bumalik sa itaas", contactUs: "Makipag-ugnayan sa amin",
      nlTitle: "Kunin ang mga bagong gabay sa email", nlText: "Isang maikling email lang kapag may bagong tool o gabay. Walang spam.",
      nlEmail: "Ang iyong email address", nlButton: "Mag-subscribe", sending: "Ipinapadala…",
      nlSuccess: "Salamat! Naka-subscribe ka na.", invalidEmail: "Pakilagay ang tamang email address.",
      formRequired: "Pakisagutan ang lahat ng field.", formError: "May nagkamali. Pakisubukang muli.",
      cookieText: "Ginagamit namin ang storage ng iyong browser para tandaan ang iyong wika at settings. Maaaring gumamit ng cookies ang aming mga advertising partner, kasama ang Google, para magpakita ng ads.",
      cookieLearn: "Privacy policy", cookieOk: "OK", lastUpdated: "Huling update:",
      disclaimer: "Ito ay isang independiyenteng website. Hindi ito konektado sa anumang opisina ng gobyerno o bangko.",
      copy: "Kopyahin", copied: "Nakopya ✓", navEos: "End of service", navId: "ID at residency", navFamily: "Gastos ng pamilya", navEmbassy: "Serbisyo ng embahada", navAbout: "Tungkol sa amin", navTerms: "Mga tuntunin", navAffiliate: "Affiliate disclosure", footerTools: "Tools", footerSite: "Website", ad: "Advertisement", pfExQ: "Magkano ang palitan ng riyal to peso today?", pfExA: "Ipinapakita ng page na ito ang live market rate mula sa Saudi riyal, UAE dirham, Kuwaiti dinar, Qatari riyal, Omani rial at Bahraini dinar papuntang Philippine peso at iba pang pera. Ang mga numero sa itaas ay ang rate ngayong araw.", pfSendQ: "Aling app ang may pinakamagandang riyal to peso rate ngayon para magpadala?", pfSendA: "Piliin ang ruta mo sa itaas, halimbawa Saudi Arabia papuntang India, Bangladesh, Pakistan, Nepal o Pilipinas. Makikita mo ang live market rate kasama ang eksaktong oras ng update, at ang sariling rate ng bawat bangko, exchange at wallet kapag nasuri na ito ng aming team sa app ng company.", pfEosQ: "Paano gamitin ang Saudi end of service calculator?", pfEosA: "Piliin ang Saudi Arabia o ang Gulf country mo, ilagay ang basic salary, allowances at taon ng serbisyo, at sabihin kung nag-resign ka. Ginagamit ng calculator ang Articles 84 at 85 ng Saudi Labor Law at ipinapakita agad ang gratuity mo.", pfIdQ: "Paano i-check ang expiry ng iqama ko?", pfIdA: "Sa Saudi Arabia, buksan ang Absher app: nasa dashboard ang iqama number at expiry date. Sa Kuwait gamitin ang Sahel, sa Qatar ang Metrash, at para sa Oman at Bahrain tingnan ang gabay sa itaas. Puwede ka ring magdagdag ng renewal reminder sa phone mo.", pfFamQ: "Magkano ang buwanang gastos kung kasama ang pamilya sa Saudi?", pfFamA: "Depende ito sa upa, school fees at bilang ng dependents. Ilagay ang sarili mong gastos sa calculator sa itaas: awtomatiko nitong idinadagdag ang Saudi dependent fee na SAR 400 bawat tao bawat buwan at ipinapakita ang maiipon mo.", pfEmbQ: "Paano mag-renew ng passport habang nagtatrabaho sa Gulf?", pfEmbA: "Piliin ang nasyonalidad mo at ang bansang tinitirhan mo sa itaas. Makikita mo ang opisyal na website ng embahada, kung saan mag-a-apply, at mga link para sa passport renewal, police certificate at attestation.", popConv: "Mga sikat na conversion", sumExQ: "Magkano ang palitan ngayon ng Gulf currency sa rupee, taka at peso?", sumExA: "Ipinapakita ng table ang market rate ngayon mula sa bawat Gulf currency papuntang Indian rupee, Pakistani rupee, Bangladeshi taka, Philippine peso at Nepali rupee. Medyo mas mababa ang ibinibigay ng mga bangko at remittance app, kaya gamitin ito bilang batayan at ikumpara muna bago magpadala.", sumSendQ: "Magkano ang matatanggap ng pamilya ko sa 1,000 riyal o dirham?", sumSendA: "Sa market rate ngayon, nasa table ang halaga ng 1,000 ng bawat Gulf currency. Kadalasan medyo mas mababa ang natatanggap ng pamilya pagkatapos ng margin at fee ng provider, kaya inaayos ng comparison sa ibaba ang bawat provider ayon sa talagang darating.", sumEosQ: "Magkano ang end of service benefit sa Saudi Arabia?", sumEosA: "Ayon sa Articles 84 at 85 ng Saudi Labor Law, kalahating buwang sahod para sa bawat isa sa unang limang taon, at isang buong buwang sahod para sa bawat taon pagkatapos noon. Kung nag-resign ka, one third pagkatapos ng 2 taon, two thirds pagkatapos ng 5 taon at buo pagkatapos ng 10 taon.", sumIdQ: "Anong ID ang kailangan sa bawat Gulf country at saan ito iche-check?", sumIdA: "May sariling residence ID card ang bawat Gulf country. Nasa table ang pangalan nito at ang opisyal na app o portal kung saan makikita ang status at expiry date.", sumFamQ: "Magkano ang Saudi dependent fee bawat taon?", sumFamA: "Sa Saudi Arabia, SAR 400 bawat miyembro ng pamilya bawat buwan ang dependent fee, binabayaran kapag ini-issue o nire-renew ang Iqama. Ipinapakita ng table ang gastos ayon sa bilang ng dependents; idagdag ang upa, school fees at pang-araw-araw na gastos sa calculator sa ibaba.", sumEmbQ: "Saan magre-renew ng passport habang nakatira sa Saudi Arabia?", sumEmbA: "Ang embahada ng bansa mo at ang mga opisyal na service center nito ang humahawak ng passport renewal, police certificate at attestation. Nasa table ang mga opisyal na website para sa mga mamamayan ng India, Pakistan at Nepal sa Saudi Arabia; piliin ang bansa mo sa itaas para sa ibang Gulf country.", thGcc: "Gulf currency", thMarketOn: "Market rate noong", thYouSend: "Ipapadala mo", thYears: "Taon ng serbisyo", thAward: "Natapos ang kontrata (buwan ng sahod)", thResign: "Nag-resign (buwan ng sahod)", thCountry: "Bansa", thIdName: "Residence ID", thCheck: "I-check sa", thDeps: "Dependents", thMonth: "Bawat buwan", thYear: "Bawat taon", thNat: "Nasyonalidad", thEmb: "Website ng embahada", thPass: "Online passport service", cSA: "Saudi Arabia", cKW: "Kuwait", cQA: "Qatar", cOM: "Oman", cBH: "Bahrain", cIN: "India", cPK: "Pakistan", cNP: "Nepal", navApp: "Mobile app", appBar: "Darating na ang ExpatGuideME app sa Android at iPhone.", appBarInstall: "I-install ngayon", appBarMore: "Abisuhan ako", appClose: "Isara", appSoonAndroid: "Malapit na sa Android", appSoonIos: "Malapit na sa iPhone", appGet: "Kunin ang app", appInstallBtn: "I-install ang web app", appTitle: "Ang ExpatGuideME app", appLead: "Lahat ng libreng tools namin para sa mga OFW sa Gulf sa isang app: exchange rates, paghahambing ng padala, end of service, bakasyon at family cost calculators, sa 8 wika. Paparating na ang Android at iPhone apps.", appF1: "Rates ngayon sa home screen mo", appF2: "Mga calculator na gumagana kahit walang internet", appF3: "Paalala sa sahod at pag-renew ng Iqama", appF4: "Wika mo: 8 wika, kasama ang Tagalog at Arabic", appNotifyTitle: "Maabisuhan kapag na-launch ang app", appNotifyText: "Iwan ang email mo at magpapadala kami ng isang mensahe kapag nasa Google Play at App Store na ang app. Walang spam.", appEmail: "Email mo", appNotifyBtn: "Abisuhan ako sa launch", appNotifyOk: "Salamat! Ie-email ka namin kapag na-launch na ang app.", appNowTitle: "Gamitin na parang app ngayon", appNowText: "Hindi mo kailangang maghintay. Idagdag ang ExpatGuideME sa home screen at bubukas ito na parang app, at gumagana ang mga calculator kahit walang internet.", appAndroidHow: "Sa Android (Chrome): i-tap ang Install, o buksan ang ⋮ menu at piliin ang Add to Home screen.", appIosHow: "Sa iPhone (Safari): i-tap ang Share button, tapos Add to Home Screen.", appInstalled: "Naka-install na ang ExpatGuideME sa device na ito.", offTitle: "Offline ka", offText: "Hindi pa naka-save sa device mo ang page na ito. Gumagana pa rin ang mga page na nabuksan mo na: subukan ang end of service, bakasyon, family cost o embassy pages.", offRetry: "Subukan ulit", navVac: "Vacation at leave", xVac: "Tingnan din ang cash para sa hindi nagamit na bakasyon", cAE: "UAE", thDaysYear: "Leave bawat taon", sumVacQ: "Ilang araw ng annual leave ang nakukuha ng OFW sa bawat Gulf country?", sumVacA: "Ang Saudi Arabia ay nagbibigay ng 21 araw bawat taon, nagiging 30 pagkatapos ng 5 taon sa iisang employer; ang Qatar ay 21 araw, nagiging 28 pagkatapos ng 5 taon. Ang UAE, Kuwait, Oman at Bahrain ay 30 araw bawat taon. Pinakamababang karapatan ito ayon sa batas, at dapat bayaran ang hindi nagamit na araw pag-alis mo.", sendVia: "Magpadala sa {name} →", affNote: "Ang ilang provider ay sponsored partner o may partner link (“Magpadala sa”): maaari kaming kumita ng komisyon nang walang dagdag na gastos sa iyo, at hindi nito kailanman binabago ang ayos ng table na ito.", affLink: "Affiliate disclosure", appPrivT: "Listahan para sa app launch", appPrivA: "Kapag sumali ka sa app launch list sa Mobile app page, ang email address at piniling wika mo lang ang natatanggap namin. Ginagamit lang namin ito para sabihan ka kapag available na ang ExpatGuideME app sa Google Play at App Store. Hindi namin kailanman ibebenta, ipapaupa o ibabahagi ang email mo kaninuman, at puwede mo itong ipabura anumang oras sa contact page.", vacBaseNote: "Kuwait, Oman at Bahrain: buong sahod ang default na batayan ng cash value. Kung basic salary ang batayan ng leave sa kontrata mo, piliin ang “Basic salary lang”.", sponsoredBadge: "Sponsored partner", essT: "Mga kailangan ng expat", essNote: "Mga sponsored link. Maaari kaming kumita ng komisyon.", esimT: "Mobile data at eSIM", esimD: "Local at roaming eSIM plans para sa pag-uwi.", insT: "Health insurance", insD: "Ikumpara ang coverage para sa iyo at sa pamilya mo.", moveT: "Relocation at shipping", moveD: "Ipadala ang mga gamit mo sa pagitan ng Gulf at Pilipinas.", navConsult: "Magtanong sa eksperto", navPlaybook: "Financial playbook", xConsult: "Hindi sigurado kung tama ang computation mo? Magpa-review sa eksperto", consentRequired: "Pakilagyan ng tsek ang kahon para pumayag bago ipadala.", affSponsT: "Mga sponsored na puwesto, partner offer at sarili naming gabay", affSponsA: "Ang ilang money transfer provider ay maaaring magbayad para maipakita bilang “Sponsored partner”. May label at naka-highlight na row sila, pero hindi nagbabago ang puwesto nila sa table, na laging nakaayos ayon sa matatanggap ng pamilya mo. Puro sponsored link ang laman ng card na “Mga kailangan ng expat”. Ang Financial Playbook ay sarili naming bayad na gabay, at nakasulat ito sa page nito.", privConsultT: "Mga request para sa expert review", privConsultA: "Kapag nag-request ka ng expert review, natatanggap namin ang pangalan, email, bansa, paksa at mensahe mo. Ginagamit lang namin ito para sagutin ang request mo at, kung pumayag ka sa form, ipasa sa isang independent advisor na makakatulong. Hindi namin kailanman ibebenta ang detalye mo. Huwag magpadala ng ID number, password o bank details. Puwede mong ipabura ang request mo anumang oras sa contact page.", privGuideT: "Playbook waitlist at pagbili", privGuideA: "Kapag sumali ka sa Financial Playbook waitlist, ginagamit lang namin ang email mo para sabihan ka kapag available na ang gabay. Ang checkout provider na makikita sa pagbabayad ang humahawak ng bayad; hindi namin kailanman nakikita ang card details mo.", navGold: "Presyo ng ginto", sumGoldQ: "Magkano ang ginto bawat gramo sa Gulf ngayon?", sumGoldA: "Ipinapakita ng table ang spot na presyo ng ginto ngayong umaga bawat gramo sa bawat Gulf currency para sa 24K, 22K at 21K. Nag-a-update buong araw ang live na presyo sa itaas; nagdadagdag ang mga tindahan ng maliit na premium at making charge.", thPerGram: "Bawat gramo", countryPick: "Bansa mo", rUpdated: "Na-update: {time}", rFallback: "Hindi ma-load ang live rates. Ipinapakita ang huling naka-save na rates mula {time}.", navSim: "SIM at internet", navVisa: "Family at visit visa", bnRates: "Rates", bnSend: "Padala", bnGold: "Ginto", bnMore: "Iba pa", themeLabel: "Dark / light mode", trendTitle: "Takbo ng presyo", trend30: "Huling 30 araw", trendEcb: "Araw-araw na reference rate mula sa European Central Bank (sa frankfurter.app).", trendOwn: "Mga reading na naka-save bawat 2 oras mula {date}.", trendWait: "Kulang pa ang reading para sa chart. Nagse-save kami bawat 2 oras, kaya mapupuno ito agad.", tHigh: "Pinakamataas", tLow: "Pinakamababa", tChange: "Pagbabago", secPrices: "Presyo", secCalc: "Calculator", secTrend: "Takbo", secDuty: "India duty", secConvert: "Converter", secRates: "Lahat ng rate", secFaq: "FAQ", allCur: "1 {cur} sa bawat currency"
    }
  };

  /* Search index: every live page and section. Add new pages here. */
  var SEARCH = [
    {
      url: "/",
      t: { en: "Home", ar: "الرئيسية", hi: "होम", ml: "ഹോം", ne: "गृहपृष्ठ", ur: "ہوم", bn: "হোম", tl: "Home" },
      d: {
        en: "Simple guides and free tools for expats in the Gulf",
        ar: "أدلة بسيطة وأدوات مجانية للمقيمين في الخليج",
        hi: "खाड़ी में रहने वाले प्रवासियों के लिए आसान गाइड और मुफ़्त टूल",
        ml: "ഗൾഫിലെ പ്രവാസികൾക്ക് ലളിതമായ ഗൈഡുകളും സൗജന്യ ടൂളുകളും",
        ne: "खाडीमा बस्ने प्रवासीहरूका लागि सजिलो गाइड र निःशुल्क टुलहरू",
        ur: "خلیج میں رہنے والے تارکینِ وطن کے لیے آسان گائیڈز اور مفت ٹولز",
        bn: "উপসাগরীয় দেশের প্রবাসীদের জন্য সহজ গাইড ও ফ্রি টুল",
        tl: "Simpleng gabay at libreng tools para sa mga OFW sa Gulf"
      },
      k: "home expat gulf guide tools saudi kuwait qatar oman bahrain"
    },
    {
      url: "/exchange-rate.html",
      t: { en: "Exchange rate today", ar: "سعر الصرف اليوم", hi: "आज का एक्सचेंज रेट", ml: "ഇന്നത്തെ വിനിമയ നിരക്ക്", ne: "आजको विनिमय दर", ur: "آج کی شرحِ تبادلہ", bn: "আজকের বিনিময় হার", tl: "Palitan ng pera ngayon" },
      d: {
        en: "Riyal and dinar to rupee, taka, peso and more",
        ar: "الريال والدينار إلى الروبية والتاكا والبيزو وغيرها",
        hi: "रियाल और दीनार से रुपया, टका, पेसो और अन्य",
        ml: "റിയാൽ, ദിനാർ എന്നിവ രൂപ, ടാക്ക, പെസോ തുടങ്ങിയവയിലേക്ക്",
        ne: "रियाल र दिनारबाट रुपैयाँ, टाका, पेसो र अन्य मुद्रामा",
        ur: "ریال اور دینار سے روپیہ، ٹکا، پیسو اور دیگر کرنسیاں",
        bn: "রিয়াল ও দিনার থেকে টাকা, রুপি, পেসো ও অন্যান্য মুদ্রা",
        tl: "Riyal at dinar papuntang peso, rupee, taka at iba pa"
      },
      k: "riyal to peso palitan ngayon innathe riyal rate aaj ka riyal rate ajker riyal rate exchange rate currency converter convert riyal rial dinar rupee rupiah taka peso pound dollar euro sar kwd qar omr bhd inr pkr bdt npr lkr php idr egp usd gbp eur remittance send money transfer صرف ريال دينار روبية रुपया रियाल दीनार विनिमय रुपैयाँ രൂപ റിയാൽ"
    },
    {
      url: "/send-money.html",
      t: { en: "Best way to send money home", ar: "أفضل طريقة لتحويل الأموال", hi: "घर पैसे भेजने का सबसे अच्छा तरीका", ml: "നാട്ടിലേക്ക് പണം അയക്കാൻ മികച്ച വഴി", ne: "घर पैसा पठाउने उत्तम तरिका", ur: "گھر رقم بھیجنے کا بہترین طریقہ", bn: "দেশে টাকা পাঠানোর সেরা উপায়", tl: "Pinakamurang paraan magpadala ng pera" },
      d: {
        en: "Compare STC Bank, urpay, Tahweel Al Rajhi, Enjaz, LuLu Money, Al Mulla, BFC and more",
        ar: "قارن بين خدمات التحويل في السعودية والكويت وقطر وعُمان والبحرين",
        hi: "सऊदी, कुवैत, क़तर, ओमान और बहरीन की ट्रांसफ़र सेवाओं की तुलना",
        ml: "സൗദി, കുവൈത്ത്, ഖത്തർ, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവിടങ്ങളിലെ സേവനങ്ങൾ താരതമ്യം ചെയ്യുക",
        ne: "साउदी, कुवेत, कतार, ओमान र बहराइनका सेवाहरूको तुलना",
        ur: "سعودی، کویت، قطر، عمان اور بحرین کی ترسیلِ زر سروسز کا موازنہ",
        bn: "সৌদি, আমিরাত, কুয়েত, কাতার, ওমান ও বাহরাইনের রেমিট্যান্স রেট তুলনা",
        tl: "Ikumpara ang remittance rates mula Saudi, UAE, Kuwait, Qatar, Oman at Bahrain"
      },
      k: "palitan ng riyal to peso today padala philippines ajker saudi riyal rate bangladesh taka rate send money home remittance transfer compare cheapest app bank exchange stc bank stc pay urpay tahweel al rajhi enjaz albilad western union al mulla lulu money lulu exchange bfc global pay hawala تحويل حوالة पैसे भेजें പണം അയക്കൽ पैसा पठाउने"
    },
    {
      url: "/end-of-service.html",
      t: { en: "End-of-service benefit calculator", ar: "حاسبة مكافأة نهاية الخدمة", hi: "एंड-ऑफ़-सर्विस बेनिफ़िट कैलकुलेटर", ml: "എൻഡ് ഓഫ് സർവീസ് ആനുകൂല്യ കാൽക്കുലേറ്റർ", ne: "सेवा समाप्ति सुविधा क्यालकुलेटर", ur: "اختتامِ ملازمت فائدہ کیلکولیٹر", bn: "চাকরি শেষের পাওনা ক্যালকুলেটর", tl: "End-of-service benefit calculator" },
      d: {
        en: "Gratuity for Saudi Arabia, UAE, Kuwait, Qatar, Oman and Bahrain",
        ar: "مكافأة نهاية الخدمة في السعودية والإمارات والكويت وقطر وعُمان والبحرين",
        hi: "सऊदी, यूएई, कुवैत, क़तर, ओमान और बहरीन की ग्रेच्युटी",
        ml: "സൗദി, യുഎഇ, കുവൈത്ത്, ഖത്തർ, ഒമാൻ, ബഹ്‌റൈൻ ഗ്രാറ്റുവിറ്റി",
        ne: "साउदी, युएई, कुवेत, कतार, ओमान र बहराइनको ग्र्याच्युटी",
        ur: "سعودی، امارات، کویت، قطر، عمان اور بحرین کی گریجویٹی",
        bn: "সৌদি, আমিরাত, কুয়েত, কাতার, ওমান ও বাহরাইনের গ্র্যাচুইটি",
        tl: "Gratuity sa Saudi, UAE, Kuwait, Qatar, Oman at Bahrain"
      },
      k: "end of service benefit gratuity eosb esb indemnity final settlement resign resignation termination calculator article 84 85 labour law labor law مكافأة نهاية الخدمة ग्रेच्युटी ഗ്രാറ്റുവിറ്റി ग्र्याच्युटी"
    },
    {
      url: "/family-visa.html",
      t: {"en": "Family visa & visit visa guide for the Gulf", "ar": "دليل تأشيرة العائلة وتأشيرة الزيارة في الخليج", "hi": "खाड़ी में फ़ैमिली वीज़ा और विज़िट वीज़ा गाइड", "ml": "ഗൾഫിലെ ഫാമിലി വിസ, വിസിറ്റ് വിസ ഗൈഡ്", "ne": "खाडीमा पारिवारिक भिसा र भिजिट भिसा गाइड", "ur": "خلیج میں فیملی ویزا اور وزٹ ویزا گائیڈ", "bn": "উপসাগরীয় দেশে ফ্যামিলি ভিসা ও ভিজিট ভিসা গাইড", "tl": "Gabay sa family visa at visit visa sa Gulf"},
      d: {"en": "How to bring your family to Saudi Arabia, the UAE, Qatar, Kuwait, Oman or Bahrain: who can apply, the documents, the", "ar": "كيف تستقدم عائلتك إلى السعودية أو الإمارات أو قطر أو الكويت أو عُمان أو البحرين: من يحق له التقديم، والمستندات،", "hi": "सऊदी अरब, यूएई, क़तर, कुवैत, ओमान या बहरीन में परिवार को कैसे बुलाएँ: कौन आवेदन कर सकता है, ज़रूरी दस्तावेज़, स्टेप और", "ml": "സൗദി അറേബ്യ, യുഎഇ, ഖത്തർ, കുവൈത്ത്, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവിടങ്ങളിലേക്ക് കുടുംബത്തെ എങ്ങനെ കൊണ്ടുവരാം: ആർക്കൊക്കെ", "ne": "साउदी अरब, यूएई, कतार, कुवेत, ओमान वा बहराइनमा परिवार कसरी ल्याउने: को आवेदन दिन सक्छ, कागजात, चरणहरू र सरकारी शुल्क,", "ur": "سعودی عرب، امارات، قطر، کویت، عمان یا بحرین میں اپنے خاندان کو کیسے بلائیں: کون درخواست دے سکتا ہے، دستاویزات، مراحل", "bn": "সৌদি আরব, আমিরাত, কাতার, কুয়েত, ওমান বা বাহরাইনে পরিবার আনবেন কীভাবে: কে আবেদন করতে পারেন, কাগজপত্র, ধাপ ও সরকারি ফি,", "tl": "Paano dalhin ang pamilya mo sa Saudi Arabia, UAE, Qatar, Kuwait, Oman o Bahrain: sino ang puwedeng mag-apply, mga"},
      k: "family visa visit visa family visit dependent visa residence visa bring family wife children parents saudi family visit visa mofa absher uae family residence icp gdrfa qatar family visa metrash kuwait family visa oman family joining visa rop bahrain family visa npra requirements documents fees salary how to apply تأشيرة زيارة عائلية تأشيرة عائلة استقدام العائلة फ़ैमिली वीज़ा विज़िट वीज़ा ഫാമിലി വിസ വിസിറ്റ് വിസ فیملی ویزا وزٹ ویزا ফ্যামিলি ভিসা"
    },
    {
      url: "/sim-internet.html",
      t: {"en": "SIM card & internet offers in the Gulf", "ar": "عروض شرائح الجوال والإنترنت في الخليج", "hi": "खाड़ी में सिम कार्ड और इंटरनेट ऑफ़र", "ml": "ഗൾഫിലെ സിം കാർഡ്, ഇന്റർനെറ്റ് ഓഫറുകൾ", "ne": "खाडीमा सिम कार्ड र इन्टरनेट अफरहरू", "ur": "خلیج میں سم کارڈ اور انٹرنیٹ آفرز", "bn": "উপসাগরীয় দেশে সিম কার্ড ও ইন্টারনেট অফার", "tl": "Mga alok sa SIM card at internet sa Gulf"},
      d: {"en": "Every mobile and internet company in Saudi Arabia, the UAE, Qatar, Kuwait, Oman and Bahrain on one page: prepaid and", "ar": "جميع شركات الاتصالات والإنترنت في السعودية والإمارات وقطر والكويت وعُمان والبحرين في صفحة واحدة: باقات الدفع المسبق", "hi": "सऊदी अरब, यूएई, क़तर, कुवैत, ओमान और बहरीन की हर मोबाइल और इंटरनेट कंपनी एक पेज पर: प्रीपेड और पोस्टपेड सिम प्लान, डेटा", "ml": "സൗദി അറേബ്യ, യുഎഇ, ഖത്തർ, കുവൈത്ത്, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവിടങ്ങളിലെ എല്ലാ മൊബൈൽ, ഇന്റർനെറ്റ് കമ്പനികളും ഒരു പേജിൽ:", "ne": "साउदी अरब, यूएई, कतार, कुवेत, ओमान र बहराइनका सबै मोबाइल र इन्टरनेट कम्पनी एउटै पृष्ठमा: प्रिपेड र पोस्टपेड सिम प्लान,", "ur": "سعودی عرب، امارات، قطر، کویت، عمان اور بحرین کی ہر موبائل اور انٹرنیٹ کمپنی ایک صفحے پر: پری پیڈ اور پوسٹ پیڈ سم پلان،", "bn": "সৌদি আরব, আমিরাত, কাতার, কুয়েত, ওমান ও বাহরাইনের সব মোবাইল ও ইন্টারনেট কোম্পানি এক পাতায়: প্রিপেইড ও পোস্টপেইড সিম", "tl": "Lahat ng mobile at internet company sa Saudi Arabia, UAE, Qatar, Kuwait, Oman at Bahrain sa iisang pahina: prepaid at"},
      k: "sim card internet offers prepaid postpaid data package mobile plan stc mobily zain salam etisalat e& du virgin ooredoo vodafone omantel batelco beyon home internet fiber 5g recharge best sim for expats شريحة باقة انترنت عروض سوا सिम कार्ड इंटरनेट प्लान സിം ഇന്റർനെറ്റ് ഓഫർ ریچارج سم پیکج সিম অফার"
    },
    {
      url: "/gold-rate.html",
      t: {"en": "Gold rate today & India customs duty", "ar": "سعر الذهب اليوم والجمارك الهندية", "hi": "आज का सोने का भाव और भारत कस्टम ड्यूटी", "ml": "ഇന്നത്തെ സ്വർണവിലയും കസ്റ്റംസ് ഡ്യൂട്ടിയും", "ne": "आजको सुनको भाउ र भारत भन्सार", "ur": "آج سونے کا ریٹ اور بھارت کسٹم ڈیوٹی", "bn": "আজকের সোনার দাম ও ভারতের কাস্টমস শুল্ক", "tl": "Presyo ng ginto ngayon at India customs duty"},
      d: {"en": "24K, 22K, 21K per gram in 6 Gulf currencies, sovereign price and duty-free gold to India", "ar": "عيار ٢٤ و٢٢ و٢١ للغرام بست عملات خليجية، وسعر الجنيه والذهب المعفى إلى الهند", "hi": "6 खाड़ी मुद्राओं में 24K, 22K, 21K प्रति ग्राम, सॉवरेन भाव और भारत ड्यूटी-फ़्री सोना", "ml": "6 ഗൾഫ് കറൻസികളിൽ 24K, 22K, 21K ഗ്രാം വില, പവൻ വില, നാട്ടിലേക്ക് ഡ്യൂട്ടി ഫ്രീ സ്വർണം", "ne": "6 खाडी मुद्रामा 24K, 22K, 21K प्रति ग्राम, सभरेन भाउ र भारत शुल्कमुक्त सुन", "ur": "6 خلیجی کرنسیوں میں 24K، 22K، 21K فی گرام، ساورن ریٹ اور بھارت ڈیوٹی فری سونا", "bn": "৬টি উপসাগরীয় মুদ্রায় 24K, 22K, 21K প্রতি গ্রাম, সভরেন দাম ও ভারতে শুল্কমুক্ত সোনা", "tl": "24K, 22K, 21K bawat gramo sa 6 na Gulf currency, sovereign price at duty-free na ginto sa India"},
      k: "gold rate today gold price per gram 24k 22k 21k 18k saudi uae dubai qatar kuwait oman bahrain sovereign pavan pawan gold rate innathe gold rate aaj ka sone ka bhav sona rate customs duty gold india how much gold can i carry to india duty free gold سعر الذهب اليوم ذهب عيار 21 سعر الجرام सोने का भाव സ്വർണവില പവൻ সোনার দাম سونے کا ریٹ presyo ng ginto presyo ng ginto ngayon सुनको भाउ आजको सुनको मूल्य सुन तोला tola gold rate bhori ভরি আজকের সোনার দাম سونے کی قیمت تولہ ഇന്നത്തെ സ്വർണവില 22 കാരറ്റ് 22 कैरेट सोना سعر الذهب في السعودية سعر الذهب في الإمارات xau spot gold"
    },
    {
      url: "/vacation-calculator.html",
      t: {"en": "Annual leave & vacation calculator", "ar": "حاسبة الإجازة السنوية", "hi": "वार्षिक छुट्टी कैलकुलेटर", "ml": "വാർഷിക ലീവ് കാൽക്കുലേറ്റർ", "ne": "वार्षिक बिदा क्यालकुलेटर", "ur": "سالانہ چھٹی کیلکولیٹر", "bn": "বার্ষিক ছুটির ক্যালকুলেটর", "tl": "Annual leave at vacation calculator"},
      d: {"en": "Leave days, 2-year vacation balance and leave salary for all 6 GCC countries", "ar": "أيام الإجازة ورصيد إجازة السنتين وراتب الإجازة لدول الخليج الست", "hi": "छुट्टी के दिन, 2 साल की छुट्टी का बैलेंस और लीव सैलरी, सभी 6 खाड़ी देश", "ml": "ലീവ് ദിവസങ്ങൾ, 2 വർഷ വെക്കേഷൻ ബാലൻസ്, ലീവ് സാലറി, 6 ഗൾഫ് രാജ്യങ്ങൾ", "ne": "बिदा दिन, २ वर्षको बिदा बाँकी र बिदाको तलब, ६ खाडी देश", "ur": "چھٹی کے دن، 2 سال کی چھٹی کا بیلنس اور لیو سیلری، تمام 6 خلیجی ممالک", "bn": "ছুটির দিন, ২ বছরের ছুটির ব্যালান্স ও ছুটির বেতন, ৬টি উপসাগরীয় দেশ", "tl": "Araw ng leave, 2-taong vacation balance at leave salary sa 6 na GCC country"},
      k: "annual leave vacation calculator leave salary leave encashment unused leave 2 year vacation 21 days 30 days article 109 110 111 112 article 29 chutti hisab kitab chhutti saudi 2 year vacation days leave salary calculation ksa إجازة سنوية حاسبة الإجازة راتب الإجازة छुट्टी हिसाब ലീവ് സാലറി വെക്കേഷൻ ছুটির হিসাব چھٹی حساب bakasyon"
    },
    {
      url: "/id-residency.html",
      t: { en: "ID card & residency guide", ar: "دليل الهوية والإقامة", hi: "आईडी कार्ड और रेज़िडेंसी गाइड", ml: "ഐഡി കാർഡ്, റെസിഡൻസി ഗൈഡ്", ne: "परिचयपत्र र रेसिडेन्सी गाइड", ur: "شناختی کارڈ اور اقامہ گائیڈ", bn: "আইডি কার্ড ও আকামা গাইড", tl: "Gabay sa ID card at residency" },
      d: {
        en: "Iqama, Civil ID, QID, Resident Card and CPR: check, renew, fees",
        ar: "الإقامة والبطاقة المدنية وبطاقة المقيم: الاستعلام والتجديد والرسوم",
        hi: "इक़ामा, सिविल आईडी, क्यूआईडी, रेज़िडेंट कार्ड, सीपीआर: जाँच, नवीनीकरण, फ़ीस",
        ml: "ഇഖാമ, സിവിൽ ഐഡി, ക്യുഐഡി, റസിഡന്റ് കാർഡ്, സിപിആർ: പരിശോധന, പുതുക്കൽ, ഫീസ്",
        ne: "इकामा, सिभिल आईडी, क्यूआईडी, रेसिडेन्ट कार्ड, सीपीआर: जाँच, नवीकरण, शुल्क",
        ur: "اقامہ، سول آئی ڈی، کیو آئی ڈی، ریزیڈنٹ کارڈ، سی پی آر: چیک، تجدید، فیس",
        bn: "আকামা, সিভিল আইডি, কিউআইডি, রেসিডেন্ট কার্ড, সিপিআর: যাচাই, নবায়ন, ফি",
        tl: "Iqama, Civil ID, QID, Resident Card, CPR: check, renew, fees"
      },
      k: "iqama civil id qid resident card cpr residence permit renew renewal check expiry fee fine absher muqeem sahel paci metrash rop iga lmra إقامة البطاقة المدنية इक़ामा ഇഖാമ इकामा اقامہ"
    },
    {
      url: "/family-cost.html",
      t: { en: "Family monthly cost calculator", ar: "حاسبة تكلفة العائلة الشهرية", hi: "परिवार का मासिक ख़र्च कैलकुलेटर", ml: "കുടുംബത്തിന്റെ മാസച്ചെലവ് കാൽക്കുലേറ്റർ", ne: "परिवारको मासिक खर्च क्यालकुलेटर", ur: "خاندان کا ماہانہ خرچ کیلکولیٹر", bn: "পরিবারের মাসিক খরচ ক্যালকুলেটর", tl: "Calculator ng buwanang gastos ng pamilya" },
      d: {
        en: "Rent, school, dependent fees and bills: what is left to save",
        ar: "الإيجار والمدارس ورسوم المرافقين والفواتير: ما يتبقى للادخار",
        hi: "किराया, स्कूल, डिपेंडेंट फ़ीस और बिल: बचत कितनी बचेगी",
        ml: "വാടക, സ്കൂൾ, ഡിപെൻഡന്റ് ഫീസ്, ബില്ലുകൾ: എത്ര ബാക്കി",
        ne: "भाडा, स्कूल, आश्रित शुल्क र बिल: कति बचत हुन्छ",
        ur: "کرایہ، اسکول، ڈیپنڈنٹ فیس اور بل: بچت کتنی ہوگی",
        bn: "ভাড়া, স্কুল, ডিপেন্ডেন্ট ফি ও বিল: সঞ্চয়ের জন্য কত থাকে",
        tl: "Upa, school, dependent fee at bills: magkano ang maiipon"
      },
      k: "family cost budget monthly expenses rent school fees dependent levy dependant fee utilities groceries savings salary calculator ميزانية تكلفة العائلة बजट ख़र्च ബജറ്റ് ചെലവ് बजेट खर्च بجٹ خرچ"
    },
    {
      url: "/embassy-services.html",
      t: { en: "Embassy services guide", ar: "دليل خدمات السفارات", hi: "दूतावास सेवाएँ गाइड", ml: "എംബസി സേവന ഗൈഡ്", ne: "दूतावास सेवा गाइड", ur: "سفارت خانے کی خدمات کی گائیڈ", bn: "দূতাবাস সেবা গাইড", tl: "Gabay sa serbisyo ng embahada" },
      d: {
        en: "Passport renewal, PCC, OCI, NICOP and attestation for Indians, Pakistanis and Nepalis",
        ar: "تجديد الجواز وشهادة حسن السيرة والتصديق للهنود والباكستانيين والنيباليين",
        hi: "भारतीय, पाकिस्तानी और नेपाली नागरिकों के लिए पासपोर्ट, पीसीसी, ओसीआई और सत्यापन",
        ml: "ഇന്ത്യ, പാകിസ്ഥാൻ, നേപ്പാൾ പൗരന്മാർക്ക് പാസ്പോർട്ട്, പിസിസി, ഒസിഐ, അറ്റസ്റ്റേഷൻ",
        ne: "भारतीय, पाकिस्तानी र नेपालीका लागि राहदानी, प्रहरी प्रमाणपत्र र प्रमाणीकरण",
        ur: "بھارتی، پاکستانی اور نیپالی شہریوں کے لیے پاسپورٹ، پی سی سی، نائیکوپ اور تصدیق",
        bn: "ভারত, পাকিস্তান ও নেপালের নাগরিকদের পাসপোর্ট, পিসিসি ও সত্যায়ন",
        tl: "Passport, PCC, OCI, NICOP at attestation"
      },
      k: "embassy consulate passport renewal pcc police clearance oci nicop pak id attestation vfs bls madad india pakistan nepal سفارة جواز दूतावास पासपोर्ट എംബസി പാസ്പോർട്ട് दूतावास राहदानी سفارت خانہ پاسپورٹ"
    },
    {
      url: "/about.html",
      t: { en: "About us", ar: "من نحن", hi: "हमारे बारे में", ml: "ഞങ്ങളെക്കുറിച്ച്", ne: "हाम्रोबारे", ur: "ہمارے بارے میں", bn: "আমাদের সম্পর্কে", tl: "Tungkol sa amin" },
      d: {
        en: "Who runs ExpatGuideME and how we check information",
        ar: "من يدير الموقع وكيف نتحقق من المعلومات",
        hi: "ExpatGuideME कौन चलाता है और जानकारी कैसे जाँची जाती है",
        ml: "ExpatGuideME ആരാണ് നടത്തുന്നത്, വിവരങ്ങൾ എങ്ങനെ പരിശോധിക്കുന്നു",
        ne: "ExpatGuideME कसले चलाउँछ र जानकारी कसरी जाँचिन्छ",
        ur: "ExpatGuideME کون چلاتا ہے اور معلومات کیسے جانچی جاتی ہیں",
        bn: "ExpatGuideME কে চালায় এবং তথ্য কীভাবে যাচাই করা হয়",
        tl: "Sino ang nagpapatakbo ng ExpatGuideME at paano namin sinusuri ang impormasyon"
      },
      k: "about who team mission editorial sources independent من نحن हमारे बारे में ഞങ്ങളെക്കുറിച്ച് हाम्रोबारे ہمارے بارے میں"
    },
    {
      url: "/terms.html",
      t: { en: "Terms of use", ar: "شروط الاستخدام", hi: "उपयोग की शर्तें", ml: "ഉപയോഗ നിബന്ധനകൾ", ne: "प्रयोगका सर्तहरू", ur: "استعمال کی شرائط", bn: "ব্যবহারের শর্তাবলি", tl: "Mga tuntunin ng paggamit" },
      d: {
        en: "Rules for using this website",
        ar: "قواعد استخدام هذا الموقع",
        hi: "इस वेबसाइट के उपयोग के नियम",
        ml: "ഈ വെബ്സൈറ്റ് ഉപയോഗിക്കാനുള്ള നിയമങ്ങൾ",
        ne: "यो वेबसाइट प्रयोग गर्ने नियम",
        ur: "اس ویب سائٹ کے استعمال کے اصول",
        bn: "এই ওয়েবসাইট ব্যবহারের নিয়ম",
        tl: "Mga patakaran sa paggamit ng website"
      },
      k: "terms conditions terms of use legal disclaimer شروط शर्तें നിബന്ധനകൾ सर्त شرائط"
    },
    {
      url: "/affiliate-disclosure.html",
      t: { en: "Affiliate disclosure", ar: "الإفصاح عن روابط الشراكة", hi: "एफ़िलिएट जानकारी", ml: "അഫിലിയേറ്റ് വെളിപ്പെടുത്തൽ", ne: "एफिलिएट जानकारी", ur: "ایفیلیئٹ انکشاف", bn: "অ্যাফিলিয়েট তথ্য", tl: "Affiliate disclosure" },
      d: {
        en: "How we earn money from ads and partner links",
        ar: "كيف نكسب من الإعلانات وروابط الشراكة",
        hi: "हम विज्ञापन और पार्टनर लिंक से कैसे कमाते हैं",
        ml: "പരസ്യങ്ങളിൽ നിന്നും പങ്കാളി ലിങ്കുകളിൽ നിന്നും ഞങ്ങൾ എങ്ങനെ വരുമാനം നേടുന്നു",
        ne: "हामी विज्ञापन र साझेदार लिङ्कबाट कसरी कमाउँछौं",
        ur: "ہم اشتہارات اور پارٹنر لنکس سے کیسے کماتے ہیں",
        bn: "বিজ্ঞাপন ও অংশীদার লিংক থেকে আমরা কীভাবে আয় করি",
        tl: "Paano kami kumikita sa ads at partner links"
      },
      k: "affiliate disclosure partner sponsored commission advertising ads إفصاح एफ़िलिएट അഫിലിയേറ്റ് एफिलिएट ایفیلیئٹ"
    },
    {
      url: "/exchange-rate.html#faq",
      t: { en: "Exchange rate questions (FAQ)", ar: "أسئلة عن سعر الصرف", hi: "एक्सचेंज रेट से जुड़े सवाल", ml: "വിനിമയ നിരക്ക്: പതിവ് ചോദ്യങ്ങൾ", ne: "विनिमय दरसम्बन्धी प्रश्नहरू", ur: "شرحِ تبادلہ کے سوالات", bn: "বিনিময় হার নিয়ে প্রশ্ন", tl: "Mga tanong sa palitan ng pera" },
      d: {
        en: "Bank rates, daily updates, the riyal's dollar peg",
        ar: "أسعار البنوك والتحديث اليومي وربط الريال بالدولار",
        hi: "बैंक रेट, रोज़ाना अपडेट, रियाल और डॉलर",
        ml: "ബാങ്ക് നിരക്ക്, ദിവസേന പുതുക്കൽ, റിയാലും ഡോളറും",
        ne: "बैंक दर, दैनिक अपडेट, रियाल र डलर",
        ur: "بینک ریٹ، روزانہ اپ ڈیٹ، ریال اور ڈالر",
        bn: "ব্যাংক রেট, প্রতিদিনের আপডেট, রিয়াল ও ডলার",
        tl: "Bank rate, araw-araw na update, riyal at dolyar"
      },
      k: "faq question bank margin fee peg pegged dollar update updated official"
    },
    {
      url: "/#faq",
      t: { en: "About ExpatGuideME (FAQ)", ar: "عن الموقع (أسئلة شائعة)", hi: "ExpatGuideME के बारे में (सवाल)", ml: "ExpatGuideME നെക്കുറിച്ച് (ചോദ്യങ്ങൾ)", ne: "ExpatGuideME बारे (प्रश्नहरू)", ur: "ExpatGuideME کے بارے میں (سوالات)", bn: "ExpatGuideME সম্পর্কে প্রশ্ন", tl: "Mga tanong tungkol sa ExpatGuideME" },
      d: {
        en: "Is it free, which languages and countries",
        ar: "هل الموقع مجاني، وما اللغات والدول",
        hi: "क्या यह मुफ़्त है, कौन-सी भाषाएँ और देश",
        ml: "സൗജന്യമാണോ, ഏതൊക്കെ ഭാഷകളും രാജ്യങ്ങളും",
        ne: "निःशुल्क छ कि, कुन भाषा र देशहरू",
        ur: "کیا یہ مفت ہے، کون سی زبانیں اور ممالک",
        bn: "এটি কি ফ্রি, কোন ভাষা ও দেশ",
        tl: "Libre ba, anong mga wika at bansa"
      },
      k: "faq about free languages countries official government"
    },
    {
      url: "/contact.html",
      t: { en: "Contact us", ar: "اتصل بنا", hi: "संपर्क करें", ml: "ഞങ്ങളെ ബന്ധപ്പെടുക", ne: "सम्पर्क गर्नुहोस्", ur: "ہم سے رابطہ کریں", bn: "যোগাযোগ করুন", tl: "Makipag-ugnayan sa amin" },
      d: {
        en: "Send a message, report a mistake, request a guide",
        ar: "أرسل رسالة أو أبلغ عن خطأ أو اطلب دليلًا",
        hi: "संदेश भेजें, गलती बताएँ, गाइड माँगें",
        ml: "സന്ദേശം അയക്കുക, തെറ്റ് അറിയിക്കുക, ഗൈഡ് ആവശ്യപ്പെടുക",
        ne: "सन्देश पठाउनुहोस्, गल्ती जानकारी दिनुहोस्, गाइड माग्नुहोस्",
        ur: "پیغام بھیجیں، غلطی بتائیں، نئی گائیڈ کی درخواست کریں",
        bn: "বার্তা পাঠান, ভুল জানান, নতুন গাইডের অনুরোধ করুন",
        tl: "Magpadala ng mensahe, mag-report ng mali, humiling ng gabay"
      },
      k: "contact email message help mistake feedback request"
    },
    {
      url: "/privacy.html",
      t: { en: "Privacy policy", ar: "سياسة الخصوصية", hi: "गोपनीयता नीति", ml: "സ്വകാര്യതാ നയം", ne: "गोपनीयता नीति", ur: "رازداری کی پالیسی", bn: "গোপনীয়তা নীতি", tl: "Privacy policy" },
      d: {
        en: "What we store and why",
        ar: "ما الذي نحفظه ولماذا",
        hi: "हम क्या सहेजते हैं और क्यों",
        ml: "ഞങ്ങൾ എന്ത് സൂക്ഷിക്കുന്നു, എന്തിന്",
        ne: "हामी के राख्छौं र किन",
        ur: "ہم کیا محفوظ کرتے ہیں اور کیوں",
        bn: "আমরা কী সংরক্ষণ করি এবং কেন",
        tl: "Ano ang iniimbak namin at bakit"
      },
      k: "privacy cookies data storage newsletter policy"
    }
  ];

  /* ---------- Helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function storeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function prefs() { try { return JSON.parse(storeGet(PREF_KEY)) || {}; } catch (e) { return {}; } }
  function savePref(k, v) { var p = prefs(); p[k] = v; storeSet(PREF_KEY, JSON.stringify(p)); }
  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- Language ---------- */
  /* Each language has its own address: English at the root, others under /xx/. */
  var PAGE_LANG = document.documentElement.getAttribute("data-page-lang");
  var EN_ONLY = document.documentElement.hasAttribute("data-en-only");
  var NO_NAV = !!window.__EXPAT_NO_NAV || !PAGE_LANG || EN_ONLY;

  function pagePath() {
    var p = location.pathname || "/";
    var m = /^\/([a-z]{2})(\/.*)?$/.exec(p);
    if (m && LANGS[m[1]] && m[1] !== "en") p = m[2] || "/";
    return p;
  }
  function langUrl(l, path) {
    var p = path || pagePath();
    return (l === "en" ? "" : "/" + l) + (p.charAt(0) === "/" ? p : "/" + p);
  }
  function href(path) {
    if (!path || path.charAt(0) !== "/" || NO_NAV) return path;
    return langUrl(lang, path);
  }

  function detectLang() {
    if (PAGE_LANG && LANGS[PAGE_LANG]) {
      var saved0 = prefs().lang;
      if (PAGE_LANG === "en" && !NO_NAV && !EN_ONLY && saved0 && saved0 !== "en" && LANGS[saved0]) {
        try { location.replace(langUrl(saved0) + location.search + location.hash); } catch (e) {}
      }
      return PAGE_LANG;
    }
    var saved = prefs().lang;
    if (LANGS[saved]) return saved;
    var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").toLowerCase();
    var code = nav.split("-")[0];
    return LANGS[code] ? code : "en";
  }

  var lang = detectLang();
  var listeners = [];

  function t(key) { return (S[lang] && S[lang][key]) || S.en[key] || ""; }

  function formatDate(iso) {
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    try {
      return new Intl.DateTimeFormat(LANGS[lang].locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC", numberingSystem: "latn" }).format(d);
    } catch (e) {
      return iso;
    }
  }

  /* Exact rate timestamps: "Nov 14, 2026, 03:02 AM GMT+3" in the visitor's own time zone.
     ts may be an ISO string, a Unix time in seconds, or milliseconds. */
  function stamp(ts) {
    var d = typeof ts === "number" ? new Date(ts < 1e12 ? ts * 1000 : ts) : new Date(ts);
    if (!ts || isNaN(d.getTime())) return "";
    var loc = lang === "en" ? "en-US" : (lang === "tl" ? "fil" : lang);
    var o = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" };
    try { return new Intl.DateTimeFormat(loc + "-u-nu-latn", o).format(d); }
    catch (e) { return d.toISOString().slice(0, 16).replace("T", " ") + " UTC"; }
  }
  /* Fill a status element: "Updated <time>", or a visible warning when showing saved data. */
  function rateNote(el, ts, fallback) {
    if (!el) return;
    el.classList.toggle("rate-warn", !!fallback);
    el.setAttribute("role", fallback ? "alert" : "status");
    el.textContent = ts ? t(fallback ? "rFallback" : "rUpdated").replace("{time}", stamp(ts)) : "";
  }
  /* Elements baked at build time: <time data-ts="ISO" [data-ts-label="key"]> */
  function renderStamps(root) {
    root.querySelectorAll("[data-ts]").forEach(function (el) {
      var s = stamp(el.getAttribute("data-ts"));
      if (s) el.textContent = t(el.getAttribute("data-ts-label") || "rUpdated").replace("{time}", s);
    });
  }


  /* ---------- Trend charts (Chart.js, loaded only when a chart is shown) ---------- */
  var chartLib = null, histP = null;
  var CHART_SRC = "https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.js";
  var USD_PEG = { SAR: 3.75, AED: 3.6725, QAR: 3.64, OMR: 0.3845, BHD: 0.376, USD: 1 };
  var ECB = { INR: 1, PHP: 1, IDR: 1, EUR: 1, GBP: 1, NPR: 1 };
  function loadChart() {
    if (!chartLib) chartLib = new Promise(function (ok, no) {
      if (window.Chart) return ok(window.Chart);
      var sc = document.createElement("script"); sc.src = CHART_SRC; sc.async = true;
      sc.onload = function () { window.Chart ? ok(window.Chart) : no(); }; sc.onerror = no;
      document.head.appendChild(sc);
    });
    return chartLib;
  }
  function history() {
    if (!histP) histP = fetch("/data/history.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).catch(function () { return { points: [] }; });
    return histP;
  }
  /* Series for a currency pair: ECB daily rates for pegged Gulf currencies, otherwise our own 2-hourly readings. */
  function pairSeries(from, to) {
    var days = 30, cutoff = Date.now() - days * 86400000;
    var own = function () {
      return history().then(function (h) {
        var pts = (h.points || []).filter(function (p) { return p.r && p.r[from] && p.r[to] && p.t * 1000 >= cutoff; })
          .map(function (p) { return { t: p.t * 1000, v: (to === "USD" ? 1 : p.r[to]) / (from === "USD" ? 1 : p.r[from]) }; });
        var dedup = []; pts.forEach(function (p) { if (!dedup.length || dedup[dedup.length - 1].t !== p.t) dedup.push(p); });
        return { pts: dedup, src: "own", since: dedup.length ? dedup[0].t : null };
      });
    };
    if (USD_PEG[from] && ECB[to]) {
      var iso = function (t) { return new Date(t).toISOString().slice(0, 10); };
      var ecbTo = to === "NPR" ? "INR" : to;
      return fetch("https://api.frankfurter.app/" + iso(cutoff) + ".." + iso(Date.now()) + "?from=USD&to=" + ecbTo)
        .then(function (r) { return r.json(); }).then(function (d) {
          var pts = Object.keys(d.rates || {}).sort().map(function (k) {
            var v = d.rates[k][ecbTo] / USD_PEG[from]; if (to === "NPR") v *= 1.6;
            return { t: Date.parse(k + "T12:00:00Z"), v: v };
          });
          return pts.length >= 2 ? { pts: pts, src: "ecb" } : own();
        }).catch(own);
    }
    return own();
  }
  function goldSeries(cur, karat) {
    var cutoff = Date.now() - 30 * 86400000, f = (karat || 24) / 24;
    return history().then(function (h) {
      var pts = [];
      (h.points || []).forEach(function (p) {
        var t = p.gt ? Date.parse(p.gt) : p.t * 1000;
        if (!p.g || !p.r || !(cur === "USD" || p.r[cur]) || t < cutoff) return;
        if (pts.length && pts[pts.length - 1].t === t) return;
        pts.push({ t: t, v: p.g / 31.1035 * f * (cur === "USD" ? 1 : p.r[cur]) });
      });
      return { pts: pts, src: "own", since: pts.length ? pts[0].t : null };
    });
  }
  /* Draw a trend into box: canvas + high / low / change + source line. */
  function trendChart(box, data, opts) {
    opts = opts || {};
    var dec = opts.decimals != null ? opts.decimals : 4;
    box.innerHTML = "";
    var note = document.createElement("p"); note.className = "trend-note";
    if (!data || data.pts.length < 2) {
      note.textContent = t("trendWait"); box.appendChild(note); return Promise.resolve();
    }
    var vals = data.pts.map(function (p) { return p.v; });
    var hi = Math.max.apply(null, vals), lo = Math.min.apply(null, vals), ch = (vals[vals.length - 1] / vals[0] - 1) * 100;
    var stats = document.createElement("div"); stats.className = "trend-stats";
    var fmtN = function (v) { return v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
    [[t("tHigh"), fmtN(hi)], [t("tLow"), fmtN(lo)], [t("tChange"), (ch >= 0 ? "+" : "") + ch.toFixed(2) + "%"]].forEach(function (x, i) {
      var s = document.createElement("span"); if (i === 2) s.className = ch >= 0 ? "up" : "down";
      var b = document.createElement("b"); b.textContent = x[0]; s.appendChild(b); s.appendChild(document.createTextNode(" " + x[1])); stats.appendChild(s);
    });
    var wrap = document.createElement("div"); wrap.className = "trend-canvas"; var cv = document.createElement("canvas");
    cv.setAttribute("role", "img"); cv.setAttribute("aria-label", (opts.label || "") + " " + t("trend30"));
    wrap.appendChild(cv); box.appendChild(stats); box.appendChild(wrap);
    note.textContent = data.src === "ecb" ? t("trendEcb") : t("trendOwn").replace("{date}", stamp(data.since));
    box.appendChild(note);
    return loadChart().then(function (Chart) {
      var css = getComputedStyle(document.body), accent = css.getPropertyValue("--accent").trim() || "#0b6e4f";
      var ink = css.getPropertyValue("--muted").trim() || "#5c6b80", line = css.getPropertyValue("--line").trim() || "#e3e8ef";
      var loc = lang === "en" ? "en-US" : (lang === "tl" ? "fil" : lang);
      var short = data.pts.length > 40 && data.src === "own";
      var labels = data.pts.map(function (p) {
        try { return new Intl.DateTimeFormat(loc + "-u-nu-latn", short ? { day: "numeric", month: "short", hour: "2-digit" } : { day: "numeric", month: "short" }).format(new Date(p.t)); }
        catch (e) { return new Date(p.t).toISOString().slice(5, 10); }
      });
      if (box._chart) box._chart.destroy();
      box._chart = new Chart(cv, {
        type: "line",
        data: { labels: labels, datasets: [{ data: vals, borderColor: accent, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.25, fill: true,
          backgroundColor: function (c) { var a = c.chart.chartArea; if (!a) return "transparent"; var g = c.chart.ctx.createLinearGradient(0, a.top, 0, a.bottom); g.addColorStop(0, accent + "33"); g.addColorStop(1, accent + "00"); return g; } }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: "index", intersect: false },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return " " + fmtN(c.parsed.y); } } } },
          scales: { x: { ticks: { color: ink, maxTicksLimit: 5, maxRotation: 0 }, grid: { display: false } },
                    y: { ticks: { color: ink, maxTicksLimit: 5, callback: function (v) { return fmtN(v); } }, grid: { color: line } } } }
      });
    }).catch(function () { wrap.remove(); });
  }

  /* Section tabs: highlight the section on screen, smooth-jump on tap */
  function initSecTabs() {
    document.querySelectorAll("[data-sec-tabs]").forEach(function (nav) {
      var links = [].slice.call(nav.querySelectorAll("a[href^='#']"));
      var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
      function mark(id) { links.forEach(function (a) { var on = a.getAttribute("href") === "#" + id; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }
      links.forEach(function (a) {
        a.addEventListener("click", function (e) {
          var el = document.getElementById(a.getAttribute("href").slice(1)); if (!el) return;
          e.preventDefault(); var y = el.getBoundingClientRect().top + window.scrollY - (nav.getBoundingClientRect().bottom - nav.getBoundingClientRect().top) - (document.querySelector(".site-header") || nav).offsetHeight - 8;
          window.scrollTo({ top: y, behavior: "smooth" }); mark(el.id);
        });
      });
      // Highlight the last section whose top has passed just below the tab bar
      var ticking = false;
      function onScroll() {
        ticking = false;
        var line = nav.getBoundingClientRect().bottom + 24, cur = secs[0];
        secs.forEach(function (s) { if (s && s.getBoundingClientRect().top <= line) cur = s; });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1] || cur;
        if (cur) mark(cur.id);
      }
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      onScroll();
    });
  }

  function applyLang() {
    var root = document.documentElement;
    root.lang = lang;
    root.dir = LANGS[lang].dir;

    document.querySelectorAll("[data-s]").forEach(function (el) { el.textContent = t(el.getAttribute("data-s")); });
    document.querySelectorAll("[data-s-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-s-ph"))); });
    document.querySelectorAll("[data-s-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-s-aria"));
      el.setAttribute("aria-label", v);
      el.setAttribute("title", v);
    });

    document.querySelectorAll(".langs button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var cur = $("langCurrent");
    if (cur) cur.textContent = LANGS[lang].name;

    renderStamps(document);

    document.querySelectorAll(".last-updated[data-updated]").forEach(function (el) {
      var iso = el.getAttribute("data-updated");
      el.textContent = t("lastUpdated") + " ";
      var time = document.createElement("time");
      time.setAttribute("datetime", iso);
      time.textContent = formatDate(iso);
      el.appendChild(time);
    });

    updateThemeButton();
    updateMenuLabel();
    updateCookieOffset();
    if (searchOpen) renderSearch();

    listeners.forEach(function (fn) { try { fn(lang); } catch (e) { if (window.console) console.error(e); } });
  }

  function setLang(l) {
    if (!LANGS[l] || l === lang) return;
    savePref("lang", l);
    if (EN_ONLY && !window.__EXPAT_NO_NAV) {
      location.href = langUrl(l, "/exchange-rate.html");
      return;
    }
    if (!NO_NAV) {
      snapshotInputs();
      var q = searchOpen && $("searchInput") ? $("searchInput").value.trim() : "";
      var search = location.search;
      if (q) {
        var sp = new URLSearchParams(location.search); sp.set("q", q); search = "?" + sp.toString();
      }
      location.href = langUrl(l) + search + location.hash;
      return;
    }
    lang = l;
    applyLang();
  }

  /* ---------- Theme ---------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }

  function updateThemeButton() {
    var btn = $("themeToggle");
    if (!btn) return;
    var dark = currentTheme() === "dark";
    var label = dark ? t("themeLight") : t("themeDark");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0f141a" : "#ffffff");
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storeSet(THEME_KEY, next);
    updateThemeButton();
  }

  /* ---------- Mobile menu ---------- */
  function menuOpen() { var n = $("siteNav"); return !!(n && n.classList.contains("open")); }

  function updateMenuLabel() {
    var btn = $("menuToggle");
    if (!btn) return;
    var label = menuOpen() ? t("close") : t("menu");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }

  function setMenu(open) {
    var nav = $("siteNav"), btn = $("menuToggle");
    if (!nav || !btn) return;
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.querySelectorAll("[data-open-menu]").forEach(function (x) { x.setAttribute("aria-expanded", open ? "true" : "false"); });
    updateMenuLabel();
  }

  /* ---------- Language popover ---------- */
  function setLangMenu(open) {
    var list = $("langList"), btn = $("langToggle");
    if (!list || !btn) return;
    list.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var active = list.querySelector("button.active") || list.querySelector("button");
      if (active) active.focus();
    }
  }

  /* ---------- Search ---------- */
  var searchOpen = false;
  var lastFocus = null;
  var activeIndex = -1;

  function haystack(entry) {
    var parts = [entry.k, entry.url];
    Object.keys(entry.t).forEach(function (l) { parts.push(entry.t[l]); });
    Object.keys(entry.d).forEach(function (l) { parts.push(entry.d[l]); });
    return parts.join(" ").toLowerCase();
  }

  function searchEntries(query) {
    var q = query.trim().toLowerCase();
    if (!q) return SEARCH.slice();
    var words = q.split(/\s+/);
    var scored = [];
    SEARCH.forEach(function (entry) {
      var hay = haystack(entry);
      var title = (entry.t[lang] || entry.t.en).toLowerCase();
      var score = 0;
      var all = words.every(function (w) {
        if (hay.indexOf(w) === -1) return false;
        score += title.indexOf(w) !== -1 ? 3 : 1;
        return true;
      });
      if (all) scored.push({ entry: entry, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.map(function (s) { return s.entry; });
  }

  function renderSearch() {
    var input = $("searchInput"), list = $("searchResults");
    if (!input || !list) return;
    var results = searchEntries(input.value);
    list.innerHTML = "";
    activeIndex = results.length ? 0 : -1;
    if (!results.length) {
      var empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = t("noResults");
      list.appendChild(empty);
      return;
    }
    results.forEach(function (entry, i) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = href(entry.url);
      if (i === 0) a.className = "active";
      var strong = document.createElement("strong");
      strong.textContent = entry.t[lang] || entry.t.en;
      var small = document.createElement("small");
      small.textContent = entry.d[lang] || entry.d.en;
      a.appendChild(strong);
      a.appendChild(small);
      a.addEventListener("click", function () { closeSearch(false); });
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function moveActive(step) {
    var links = $("searchResults").querySelectorAll("a");
    if (!links.length) return;
    activeIndex = (activeIndex + step + links.length) % links.length;
    links.forEach(function (a, i) { a.classList.toggle("active", i === activeIndex); });
    links[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function openSearch() {
    var overlay = $("searchOverlay"), input = $("searchInput");
    if (!overlay || !input) return;
    lastFocus = document.activeElement;
    setMenu(false);
    setLangMenu(false);
    overlay.hidden = false;
    searchOpen = true;
    document.body.style.overflow = "hidden";
    input.value = "";
    renderSearch();
    input.focus();
  }

  function closeSearch(restoreFocus) {
    var overlay = $("searchOverlay");
    if (!overlay || !searchOpen) return;
    overlay.hidden = true;
    searchOpen = false;
    document.body.style.overflow = "";
    if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- Scroll: progress bar + back to top ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var bar = $("scrollProgress");
      if (bar) bar.style.transform = "scaleX(" + ratio + ")";
      var top = $("toTop");
      if (top) top.hidden = window.scrollY < 400;
    });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    var main = $("main");
    if (main) main.focus({ preventScroll: true });
  }

  /* ---------- Cookie banner ---------- */
  /* Keeps floating buttons clear of the cookie banner and of the
     "Powered by Netlify" badge that Netlify adds bottom-right. */
  function hostBadgePresent() {
    if (document.querySelector('script[src*="/.netlify/scripts/hud"]')) return true;
    var frames = document.querySelectorAll("body > iframe");
    for (var i = 0; i < frames.length; i++) {
      var st = frames[i].getAttribute("style") || "";
      if (/position:\s*fixed/.test(st) && /bottom:\s*0/.test(st) && /right:\s*0/.test(st)) return true;
    }
    return false;
  }

  function updateCookieOffset() {
    var banner = $("cookieBanner");
    var h = banner && !banner.hidden ? banner.offsetHeight + 12 : 0;
    document.body.style.setProperty("--cookie-h", h + "px");
    document.body.style.setProperty("--nl-badge", hostBadgePresent() ? "60px" : "0px");
  }

  function initCookie() {
    var banner = $("cookieBanner"), ok = $("cookieOk");
    window.addEventListener("resize", updateCookieOffset);
    window.addEventListener("load", updateCookieOffset);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateCookieOffset);
    if (window.MutationObserver) {
      new MutationObserver(function (list) {
        for (var i = 0; i < list.length; i++) { if (list[i].addedNodes.length) { updateCookieOffset(); return; } }
      }).observe(document.body, { childList: true });
    }
    if (!banner || !ok) { updateCookieOffset(); return; }
    if (window.ResizeObserver) new ResizeObserver(updateCookieOffset).observe(banner);
    if (storeGet(COOKIE_KEY) === "1") { banner.hidden = true; updateCookieOffset(); return; }
    banner.hidden = false;
    updateCookieOffset();
    ok.addEventListener("click", function () {
      storeSet(COOKIE_KEY, "1");
      banner.hidden = true;
      updateCookieOffset();
    });
  }

  /* ---------- Netlify forms (newsletter, contact) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function initForms() {
    document.querySelectorAll("form[data-ajax]").forEach(function (form) {
      var msg = form.querySelector(".form-msg");
      var submit = form.querySelector('[type="submit"]');
      var success = form.getAttribute("data-success") ? $(form.getAttribute("data-success")) : null;

      function setMsg(key) { if (msg) msg.textContent = key ? t(key) : ""; }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        setMsg("");

        var hp = form.querySelector('[name="bot-field"]');
        var hp2 = form.querySelector('[name="_honey"]');
        if ((hp && hp.value) || (hp2 && hp2.value)) return;

        var fields = form.querySelectorAll("input[required], textarea[required], select[required]");
        for (var i = 0; i < fields.length; i++) {
          var f = fields[i];
          if (f.type === "checkbox") { if (!f.checked) { setMsg("consentRequired"); f.focus(); return; } continue; }
          if (!f.value.trim()) { setMsg("formRequired"); f.focus(); return; }
          if (f.type === "email" && !EMAIL_RE.test(f.value.trim())) { setMsg("invalidEmail"); f.focus(); return; }
        }

        var label = submit ? submit.innerHTML : "";
        if (submit) {
          submit.disabled = true;
          submit.innerHTML = "";
          var sp = document.createElement("span");
          sp.className = "spinner";
          sp.setAttribute("aria-hidden", "true");
          submit.appendChild(sp);
          submit.appendChild(document.createTextNode(" " + t("sending")));
        }

        var meta = document.querySelector('meta[name="form-endpoint"]');
        var endpoint = meta ? meta.getAttribute("content") : "";
        var req;
        if (endpoint) {
          // Static hosting: send the form as JSON to the form-to-email endpoint (FormSubmit).
          var data = {};
          new FormData(form).forEach(function (v, k) { if (k !== "bot-field" && k !== "form-name") data[k] = v; });
          var fname = form.getAttribute("name") || "form";
          var hpv = form.querySelector('[name="bot-field"]');
          data._honey = "";
          delete data._next;
          if (data.email) data._replyto = data.email;
          data._subject = "ExpatGuideME " + fname + " (" + (lang || "en") + ")" + (data.name ? " from " + data.name : "");
          data.form = fname;
          data.page = location.pathname;
          data._template = "table";
          data._captcha = "false";
          req = fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
            .then(function (res) {
              if (!res.ok) throw new Error("HTTP " + res.status);
              return res.json().catch(function () { return {}; });
            })
            .then(function (j) { if (j && (j.success === false || j.success === "false")) throw new Error(j.message || "rejected"); return { ok: true }; });
        } else {
          req = fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
        }
        req
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + (res.status || ""));
            form.hidden = true;
            if (success) {
              success.hidden = false;
              success.focus();
            }
          })
          .catch(function () {
            setMsg("formError");
          })
          .then(function () {
            if (submit) {
              submit.disabled = false;
              submit.innerHTML = label;
              applyLangToNode(submit);
            }
          });
      });
    });
  }

  function applyLangToNode(node) {
    var nodes = [node].concat(Array.prototype.slice.call(node.querySelectorAll("[data-s]")));
    nodes.forEach(function (el) { if (el.hasAttribute && el.hasAttribute("data-s")) el.textContent = t(el.getAttribute("data-s")); });
  }

  /* ---------- UTM tags on outbound links ---------- */
  function pageSlug() {
    var p = location.pathname.replace(/^\/+|\/+$/g, "").replace(/\.html$/, "");
    return p || "home";
  }

  function tagLink(a) {
    var href = a.getAttribute("href");
    if (!href || !/^https?:\/\//i.test(href)) return;
    var url;
    try { url = new URL(href); } catch (e) { return; }
    var host = url.hostname.replace(/^www\./, "");
    if (host === location.hostname.replace(/^www\./, "") || /(^|\.)expatguideme\.com$/.test(host) || /\.netlify\.app$/.test(host)) return;
    var sponsored = /(^|\s)sponsored(\s|$)/.test(a.getAttribute("rel") || "");
    if (!sponsored && !url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "expatguideme");
      url.searchParams.set("utm_medium", "referral");
      url.searchParams.set("utm_campaign", pageSlug());
      a.setAttribute("href", url.toString());
    }
    var rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    if (rel.indexOf("noopener") === -1) rel.push("noopener");
    a.setAttribute("rel", rel.join(" "));
  }

  function tagOutbound(root) {
    (root || document).querySelectorAll("a[href]").forEach(tagLink);
  }

  /* ---------- Copy buttons ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function initCopy() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-copy]") : null;
      if (!btn) return;
      var text = btn.getAttribute("data-copy-text");
      if (!text) {
        var target = $(btn.getAttribute("data-copy"));
        text = target ? target.textContent.trim() : "";
      }
      if (!text) return;
      var label = btn.querySelector("[data-s]");
      copyText(text).then(function () {
        if (label) {
          label.textContent = t("copied");
          setTimeout(function () { label.textContent = t("copy"); }, 1600);
        }
      }, function () {});
    });
  }

  /* ---------- Print: open FAQ answers ---------- */
  var openedForPrint = [];
  function beforePrint() {
    openedForPrint = [];
    document.querySelectorAll("details:not([open])").forEach(function (d) { d.open = true; openedForPrint.push(d); });
  }
  function afterPrint() {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
  }

  /* ---------- Wire up ---------- */
  /* ---------- Country (Gulf country the visitor lives in) ---------- */
  var CC = { sa: "🇸🇦", ae: "🇦🇪", qa: "🇶🇦", kw: "🇰🇼", om: "🇴🇲", bh: "🇧🇭" };
  var CC_NAME = { sa: "cSA", ae: "cAE", qa: "cQA", kw: "cKW", om: "cOM", bh: "cBH" };
  // Time zone tells us the Gulf country without any IP lookup or third-party request.
  var TZ_CC = { "Asia/Riyadh": "sa", "Asia/Dubai": "ae", "Asia/Qatar": "qa", "Asia/Kuwait": "kw", "Asia/Muscat": "om", "Asia/Bahrain": "bh" };
  var countryListeners = [];
  function detectCountry() {
    try { return TZ_CC[Intl.DateTimeFormat().resolvedOptions().timeZone] || ""; } catch (e) { return ""; }
  }
  function hasCountry() { return !!CC[prefs().country]; }
  function country() { var p = prefs().country; return CC[p] ? p : (detectCountry() || "sa"); }
  function updateCountryUI() {
    var cc = country(), f = $("countryFlag"), list = $("countryList");
    if (f) f.textContent = CC[cc];
    if (list) list.querySelectorAll("button[data-cc]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-cc") === cc); b.setAttribute("aria-pressed", String(b.getAttribute("data-cc") === cc)); });
  }
  function setCountry(cc, silent) {
    if (!CC[cc]) return;
    var changed = prefs().country !== cc;
    savePref("country", cc);
    updateCountryUI();
    if (!silent && changed) countryListeners.forEach(function (fn) { try { fn(cc); } catch (e) { if (window.console) console.error(e); } });
  }
  function setCountryMenu(open) {
    var list = $("countryList"), btn = $("countryToggle");
    if (!list || !btn) return;
    list.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var a = list.querySelector("button.active") || list.querySelector("button"); if (a) a.focus(); }
  }
  function initCountry() {
    var btn = $("countryToggle");
    if (btn) btn.addEventListener("click", function () { setLangMenu(false); setCountryMenu($("countryList").hidden); });
    document.querySelectorAll("#countryList button[data-cc]").forEach(function (b) {
      b.addEventListener("click", function () { setCountry(b.getAttribute("data-cc")); setCountryMenu(false); if (btn) btn.focus(); });
    });
    document.addEventListener("click", function (e) { var m = document.querySelector(".country-menu"); if (m && !m.contains(e.target)) setCountryMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && $("countryList") && !$("countryList").hidden) { setCountryMenu(false); if (btn) btn.focus(); } });
    updateCountryUI();
  }

  /* ---------- Keep what the visitor typed when switching language ---------- */
  var STATE_KEY = "egm-carry";
  function snapshotInputs() {
    var data = {};
    document.querySelectorAll("main input[id], main select[id], main textarea[id]").forEach(function (el) {
      if (el.type === "hidden" || el.type === "password" || el.type === "email" || el.name === "bot-field" || el.name === "_honey") return;
      if (el.closest("form[data-ajax]")) return; // never carry personal form data
      data[el.id] = el.type === "checkbox" || el.type === "radio" ? !!el.checked : el.value;
    });
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify({ path: pagePath(), data: data })); } catch (e) {}
  }
  function restoreInputs() {
    var snap = null;
    try { snap = JSON.parse(sessionStorage.getItem(STATE_KEY) || "null"); sessionStorage.removeItem(STATE_KEY); } catch (e) {}
    if (!snap || snap.path !== pagePath() || !snap.data) return;
    Object.keys(snap.data).forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") { if (el.checked !== snap.data[id]) el.click(); return; }
      if (el.value === snap.data[id]) return;
      el.value = snap.data[id];
      el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    });
  }

  /* ---------- App: install prompt, coming-soon bar, offline cache ---------- */
  var installEvt = null;
  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  function refreshInstall() {
    var inst = isStandalone();
    document.querySelectorAll("[data-install]").forEach(function (b) { b.hidden = inst || !installEvt; });
    document.querySelectorAll("[data-install-done]").forEach(function (el) { el.hidden = !inst; });
    var bar = $("appBar");
    if (bar) {
      var btn = bar.querySelector(".app-bar-install");
      if (btn) btn.hidden = !installEvt;
    }
  }
  function doInstall() {
    if (!installEvt) { location.href = href("/mobile-app.html"); return; }
    var ev = installEvt;
    installEvt = null;
    ev.prompt();
    (ev.userChoice || Promise.resolve()).then(function () { refreshInstall(); }, function () {});
  }
  function initApp() {
    window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEvt = e; refreshInstall(); });
    window.addEventListener("appinstalled", function () { installEvt = null; savePref("appBarHidden", Date.now()); var b = $("appBar"); if (b) b.remove(); refreshInstall(); });
    document.addEventListener("click", function (e) { if (e.target.closest("[data-install], .app-bar-install")) { e.preventDefault(); doInstall(); } });
    listeners.push(function (l) { document.querySelectorAll("[data-lang-field]").forEach(function (f) { f.value = l; }); });

    var page = document.body.getAttribute("data-page") || "";
    var hiddenAt = Number(prefs().appBarHidden || 0);
    var small = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    var main = $("main");
    if (main && small && !isStandalone() && page !== "app" && page !== "none" && page !== "notfound" && Date.now() - hiddenAt > 30 * 864e5) {
      var bar = document.createElement("div");
      bar.className = "app-bar";
      bar.id = "appBar";
      bar.setAttribute("role", "region");
      bar.setAttribute("aria-label", "App");
      bar.innerHTML = '<img src="/assets/icon-192.png" alt="" width="34" height="34">' +
        '<p data-s="appBar"></p>' +
        '<button type="button" class="btn btn-primary app-bar-install" hidden data-s="appBarInstall"></button>' +
        '<a class="btn btn-ghost" href="/mobile-app.html" data-s="appBarMore"></a>' +
        '<button type="button" class="icon-btn app-bar-close" data-s-aria="appClose">' + "×" + "</button>";
      var more = bar.querySelector("a");
      more.setAttribute("href", href("/mobile-app.html"));
      bar.querySelector(".app-bar-close").addEventListener("click", function () { savePref("appBarHidden", Date.now()); bar.remove(); });
      main.insertBefore(bar, main.firstChild);
    }
    refreshInstall();

    if ("serviceWorker" in navigator && location.protocol === "https:" && !window.__EXPAT_NO_NAV) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then(function (reg) {
          try { reg.update(); } catch (e) {}
          return navigator.serviceWorker.ready;
        }).then(function (reg) {
          if (!reg.active || lang === "en") return;
          var urls = ["/", "/end-of-service.html", "/vacation-calculator.html", "/family-cost.html", "/embassy-services.html", "/id-residency.html", "/exchange-rate.html"]
            .map(function (p) { return langUrl(lang, p); });
          reg.active.postMessage({ type: "warm", urls: urls });
        }).catch(function () {});
      });
    }
  }

  function openSearchFromUrl() {
    var q = "";
    try { q = new URLSearchParams(location.search).get("q") || ""; } catch (e) {}
    if (!q || !$("searchInput")) return;
    openSearch();
    $("searchInput").value = q;
    renderSearch();
  }

  function init() {
    initSecTabs();
    var themeBtn = $("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    // Bottom bar "More" and the menu's theme item reuse the header buttons
    document.querySelectorAll("[data-open-menu]").forEach(function (b) {
      b.addEventListener("click", function () { setMenu(!menuOpen()); b.setAttribute("aria-expanded", menuOpen() ? "true" : "false"); });
    });
    document.querySelectorAll("[data-theme-proxy]").forEach(function (b) {
      b.addEventListener("click", function () { var t = $("themeToggle"); if (t) t.click(); });
    });
    var menuBtn = $("menuToggle");
    if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!menuOpen()); });
    var nav = $("siteNav");
    if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

    var langBtn = $("langToggle");
    if (langBtn) langBtn.addEventListener("click", function () { setCountryMenu(false); setLangMenu($("langList").hidden); });
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
        setLangMenu(false);
        if (langBtn) langBtn.focus();
      });
    });

    document.addEventListener("click", function (e) {
      var lm = document.querySelector(".lang-menu");
      if (lm && !lm.contains(e.target)) setLangMenu(false);
      var header = document.querySelector(".site-header");
      if (menuOpen() && header && !header.contains(e.target) && !e.target.closest(".bottom-nav")) setMenu(false);
    });

    document.querySelectorAll("[data-open-search]").forEach(function (b) { b.addEventListener("click", openSearch); });
    var sc = $("searchClose");
    if (sc) sc.addEventListener("click", function () { closeSearch(); });
    var overlay = $("searchOverlay");
    if (overlay) overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) closeSearch(); });
    var input = $("searchInput");
    if (input) {
      input.addEventListener("input", renderSearch);
      input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
        else if (e.key === "Enter") {
          var active = $("searchResults").querySelector("a.active");
          if (active) { e.preventDefault(); closeSearch(false); window.location.href = active.href; }
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (searchOpen) { closeSearch(); return; }
        if ($("langList") && !$("langList").hidden) { setLangMenu(false); if (langBtn) langBtn.focus(); return; }
        if (menuOpen()) { setMenu(false); if (menuBtn) menuBtn.focus(); }
        return;
      }
      if (e.key === "/" && !searchOpen) {
        var tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT" && !(document.activeElement && document.activeElement.isContentEditable)) {
          e.preventDefault();
          openSearch();
        }
      }
    });

    window.addEventListener("resize", function () { if (window.innerWidth > 760) setMenu(false); });
    window.addEventListener("scroll", onScroll, { passive: true });
    var toTop = $("toTop");
    if (toTop) toTop.addEventListener("click", scrollToTop);

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    initCookie();
    initForms();
    initCopy();
    initApp();
    initCountry();
    applyLang();
    restoreInputs();
    openSearchFromUrl();
    tagOutbound();
    onScroll();
  }

  window.ExpatSite = {
    lang: function () { return lang; },
    t: t,
    setLang: setLang,
    href: href,
    onLang: function (fn) { listeners.push(fn); fn(lang); },
    tagOutbound: tagOutbound,
    country: country,
    hasCountry: hasCountry,
    setCountry: setCountry,
    onCountry: function (fn) { countryListeners.push(fn); },
    langs: LANGS,
    stamp: stamp,
    pairSeries: pairSeries,
    goldSeries: goldSeries,
    trendChart: trendChart,
    rateNote: rateNote
  };

  init();
})();
