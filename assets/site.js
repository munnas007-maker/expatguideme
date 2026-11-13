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
    ne: { name: "नेपाली", dir: "ltr", locale: "ne-NP" }
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
      cookieText: "We use your browser's storage to remember your language and settings. Ads may use cookies in future.",
      cookieLearn: "Privacy policy", cookieOk: "OK", lastUpdated: "Last updated:",
      disclaimer: "This is an independent website. It is not connected to any government office or bank.",
      copy: "Copy", copied: "Copied ✓"
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
      cookieText: "نستخدم تخزين المتصفح لتذكّر لغتك وإعداداتك، وقد تستخدم الإعلانات ملفات تعريف الارتباط مستقبلًا.",
      cookieLearn: "سياسة الخصوصية", cookieOk: "موافق", lastUpdated: "آخر تحديث:",
      disclaimer: "هذا موقع مستقل، ولا علاقة له بأي جهة حكومية أو بنك.",
      copy: "نسخ", copied: "تم النسخ ✓"
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
      cookieText: "हम आपकी भाषा और सेटिंग्स याद रखने के लिए ब्राउज़र स्टोरेज का उपयोग करते हैं। भविष्य में विज्ञापन कुकीज़ का उपयोग कर सकते हैं।",
      cookieLearn: "गोपनीयता नीति", cookieOk: "ठीक है", lastUpdated: "आख़िरी अपडेट:",
      disclaimer: "यह एक स्वतंत्र वेबसाइट है। इसका किसी सरकारी विभाग या बैंक से कोई संबंध नहीं है।",
      copy: "कॉपी करें", copied: "कॉपी हो गया ✓"
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
      cookieText: "നിങ്ങളുടെ ഭാഷയും ക്രമീകരണങ്ങളും ഓർത്തുവയ്ക്കാൻ ഞങ്ങൾ ബ്രൗസർ സ്റ്റോറേജ് ഉപയോഗിക്കുന്നു. ഭാവിയിൽ പരസ്യങ്ങൾ കുക്കികൾ ഉപയോഗിച്ചേക്കാം.",
      cookieLearn: "സ്വകാര്യതാ നയം", cookieOk: "ശരി", lastUpdated: "അവസാനം പുതുക്കിയത്:",
      disclaimer: "ഇതൊരു സ്വതന്ത്ര വെബ്സൈറ്റാണ്. ഏതെങ്കിലും സർക്കാർ വകുപ്പുമായോ ബാങ്കുമായോ ഇതിന് ബന്ധമില്ല.",
      copy: "കോപ്പി ചെയ്യുക", copied: "കോപ്പി ചെയ്തു ✓"
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
      cookieText: "हामी तपाईंको भाषा र सेटिङहरू सम्झन ब्राउजर स्टोरेज प्रयोग गर्छौं। भविष्यमा विज्ञापनले कुकीज प्रयोग गर्न सक्छन्।",
      cookieLearn: "गोपनीयता नीति", cookieOk: "ठीक छ", lastUpdated: "पछिल्लो अपडेट:",
      disclaimer: "यो एक स्वतन्त्र वेबसाइट हो। यसको कुनै पनि सरकारी कार्यालय वा बैंकसँग सम्बन्ध छैन।",
      copy: "कपी गर्नुहोस्", copied: "कपी भयो ✓"
    }
  };

  /* Search index: every live page and section. Add new pages here. */
  var SEARCH = [
    {
      url: "/",
      t: { en: "Home", ar: "الرئيسية", hi: "होम", ml: "ഹോം", ne: "गृहपृष्ठ" },
      d: {
        en: "Simple guides and free tools for expats in the Gulf",
        ar: "أدلة بسيطة وأدوات مجانية للمقيمين في الخليج",
        hi: "खाड़ी में रहने वाले प्रवासियों के लिए आसान गाइड और मुफ़्त टूल",
        ml: "ഗൾഫിലെ പ്രവാസികൾക്ക് ലളിതമായ ഗൈഡുകളും സൗജന്യ ടൂളുകളും",
        ne: "खाडीमा बस्ने प्रवासीहरूका लागि सजिलो गाइड र निःशुल्क टुलहरू"
      },
      k: "home expat gulf guide tools saudi kuwait qatar oman bahrain"
    },
    {
      url: "/exchange-rate.html",
      t: { en: "Exchange rate today", ar: "سعر الصرف اليوم", hi: "आज का एक्सचेंज रेट", ml: "ഇന്നത്തെ വിനിമയ നിരക്ക്", ne: "आजको विनिमय दर" },
      d: {
        en: "Riyal and dinar to rupee, taka, peso and more",
        ar: "الريال والدينار إلى الروبية والتاكا والبيزو وغيرها",
        hi: "रियाल और दीनार से रुपया, टका, पेसो और अन्य",
        ml: "റിയാൽ, ദിനാർ എന്നിവ രൂപ, ടാക്ക, പെസോ തുടങ്ങിയവയിലേക്ക്",
        ne: "रियाल र दिनारबाट रुपैयाँ, टाका, पेसो र अन्य मुद्रामा"
      },
      k: "exchange rate currency converter convert riyal rial dinar rupee rupiah taka peso pound dollar euro sar kwd qar omr bhd inr pkr bdt npr lkr php idr egp usd gbp eur remittance send money transfer صرف ريال دينار روبية रुपया रियाल दीनार विनिमय रुपैयाँ രൂപ റിയാൽ"
    },
    {
      url: "/send-money.html",
      t: { en: "Best way to send money home", ar: "أفضل طريقة لتحويل الأموال", hi: "घर पैसे भेजने का सबसे अच्छा तरीका", ml: "നാട്ടിലേക്ക് പണം അയക്കാൻ മികച്ച വഴി", ne: "घर पैसा पठाउने उत्तम तरिका" },
      d: {
        en: "Compare STC Bank, urpay, Tahweel Al Rajhi, Enjaz, LuLu Money, Al Mulla, BFC and more",
        ar: "قارن بين خدمات التحويل في السعودية والكويت وقطر وعُمان والبحرين",
        hi: "सऊदी, कुवैत, क़तर, ओमान और बहरीन की ट्रांसफ़र सेवाओं की तुलना",
        ml: "സൗദി, കുവൈത്ത്, ഖത്തർ, ഒമാൻ, ബഹ്‌റൈൻ എന്നിവിടങ്ങളിലെ സേവനങ്ങൾ താരതമ്യം ചെയ്യുക",
        ne: "साउदी, कुवेत, कतार, ओमान र बहराइनका सेवाहरूको तुलना"
      },
      k: "send money home remittance transfer compare cheapest app bank exchange stc bank stc pay urpay tahweel al rajhi enjaz albilad western union al mulla lulu money lulu exchange bfc global pay hawala تحويل حوالة पैसे भेजें പണം അയക്കൽ पैसा पठाउने"
    },
    {
      url: "/end-of-service.html",
      t: { en: "End-of-service benefit calculator", ar: "حاسبة مكافأة نهاية الخدمة", hi: "एंड-ऑफ़-सर्विस बेनिफ़िट कैलकुलेटर", ml: "എൻഡ് ഓഫ് സർവീസ് ആനുകൂല്യ കാൽക്കുലേറ്റർ", ne: "सेवा समाप्ति सुविधा क्यालकुलेटर" },
      d: {
        en: "Gratuity for Saudi Arabia, UAE, Kuwait, Qatar, Oman and Bahrain",
        ar: "مكافأة نهاية الخدمة في السعودية والإمارات والكويت وقطر وعُمان والبحرين",
        hi: "सऊदी, यूएई, कुवैत, क़तर, ओमान और बहरीन की ग्रेच्युटी",
        ml: "സൗദി, യുഎഇ, കുവൈത്ത്, ഖത്തർ, ഒമാൻ, ബഹ്‌റൈൻ ഗ്രാറ്റുവിറ്റി",
        ne: "साउदी, युएई, कुवेत, कतार, ओमान र बहराइनको ग्र्याच्युटी"
      },
      k: "end of service benefit gratuity eosb esb indemnity final settlement resign resignation termination calculator article 84 85 labour law labor law مكافأة نهاية الخدمة ग्रेच्युटी ഗ്രാറ്റുവിറ്റി ग्र्याच्युटी"
    },
    {
      url: "/exchange-rate.html#faq",
      t: { en: "Exchange rate questions (FAQ)", ar: "أسئلة عن سعر الصرف", hi: "एक्सचेंज रेट से जुड़े सवाल", ml: "വിനിമയ നിരക്ക്: പതിവ് ചോദ്യങ്ങൾ", ne: "विनिमय दरसम्बन्धी प्रश्नहरू" },
      d: {
        en: "Bank rates, daily updates, the riyal's dollar peg",
        ar: "أسعار البنوك والتحديث اليومي وربط الريال بالدولار",
        hi: "बैंक रेट, रोज़ाना अपडेट, रियाल और डॉलर",
        ml: "ബാങ്ക് നിരക്ക്, ദിവസേന പുതുക്കൽ, റിയാലും ഡോളറും",
        ne: "बैंक दर, दैनिक अपडेट, रियाल र डलर"
      },
      k: "faq question bank margin fee peg pegged dollar update updated official"
    },
    {
      url: "/#faq",
      t: { en: "About ExpatGuideME (FAQ)", ar: "عن الموقع (أسئلة شائعة)", hi: "ExpatGuideME के बारे में (सवाल)", ml: "ExpatGuideME നെക്കുറിച്ച് (ചോദ്യങ്ങൾ)", ne: "ExpatGuideME बारे (प्रश्नहरू)" },
      d: {
        en: "Is it free, which languages and countries",
        ar: "هل الموقع مجاني، وما اللغات والدول",
        hi: "क्या यह मुफ़्त है, कौन-सी भाषाएँ और देश",
        ml: "സൗജന്യമാണോ, ഏതൊക്കെ ഭാഷകളും രാജ്യങ്ങളും",
        ne: "निःशुल्क छ कि, कुन भाषा र देशहरू"
      },
      k: "faq about free languages countries official government"
    },
    {
      url: "/contact.html",
      t: { en: "Contact us", ar: "اتصل بنا", hi: "संपर्क करें", ml: "ഞങ്ങളെ ബന്ധപ്പെടുക", ne: "सम्पर्क गर्नुहोस्" },
      d: {
        en: "Send a message, report a mistake, request a guide",
        ar: "أرسل رسالة أو أبلغ عن خطأ أو اطلب دليلًا",
        hi: "संदेश भेजें, गलती बताएँ, गाइड माँगें",
        ml: "സന്ദേശം അയക്കുക, തെറ്റ് അറിയിക്കുക, ഗൈഡ് ആവശ്യപ്പെടുക",
        ne: "सन्देश पठाउनुहोस्, गल्ती जानकारी दिनुहोस्, गाइड माग्नुहोस्"
      },
      k: "contact email message help mistake feedback request"
    },
    {
      url: "/privacy.html",
      t: { en: "Privacy policy", ar: "سياسة الخصوصية", hi: "गोपनीयता नीति", ml: "സ്വകാര്യതാ നയം", ne: "गोपनीयता नीति" },
      d: {
        en: "What we store and why",
        ar: "ما الذي نحفظه ولماذا",
        hi: "हम क्या सहेजते हैं और क्यों",
        ml: "ഞങ്ങൾ എന്ത് സൂക്ഷിക്കുന്നു, എന്തിന്",
        ne: "हामी के राख्छौं र किन"
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
  function detectLang() {
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
    lang = l;
    savePref("lang", l);
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
      a.href = entry.url;
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
        if (hp && hp.value) return;

        var fields = form.querySelectorAll("input[required], textarea[required]");
        for (var i = 0; i < fields.length; i++) {
          var f = fields[i];
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

        var body = new URLSearchParams(new FormData(form)).toString();
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
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
    if (!url.searchParams.has("utm_source")) {
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
  function init() {
    var themeBtn = $("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    var menuBtn = $("menuToggle");
    if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!menuOpen()); });
    var nav = $("siteNav");
    if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

    var langBtn = $("langToggle");
    if (langBtn) langBtn.addEventListener("click", function () { setLangMenu($("langList").hidden); });
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
      if (menuOpen() && header && !header.contains(e.target)) setMenu(false);
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
    applyLang();
    tagOutbound();
    onScroll();
  }

  window.ExpatSite = {
    lang: function () { return lang; },
    t: t,
    setLang: setLang,
    onLang: function (fn) { listeners.push(fn); fn(lang); },
    tagOutbound: tagOutbound,
    langs: LANGS
  };

  init();
})();
