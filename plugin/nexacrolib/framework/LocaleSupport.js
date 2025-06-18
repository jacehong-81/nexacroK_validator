//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.tobesoft.com/legal/nexacro-public-license-readme-1.0.html	
//
//==============================================================================


if (!nexacro.Locale)
{
	nexacro.Locale = function ()
	{
	};

	nexacro.Locale._type_name = "Locale";

	nexacro.Locale._localeInfo_numData = [
		["aa_dj", ".", "", [0, 0], "", "-", 2, 2],
		["aa_er", ".", "", [0, 0], "", "-", 0, 0],
		["aa_et", ".", ",", [3, 3], "", "-", 2, 2],
		["ar_ae", ".", ",", [3], "", "-", 3, 3],
		["ar_in", ".", ",", [3], "", "-", 2, 2],
		["ar", ".", "", [-1], "", "-", 2, 2],
		["as", ".", ",", [3, 2], "", "-", 2, 2],
		["az", ",", ".", [3, 3], "", "-", 2, 2],
		["be", ",", " ", [3, 3], "", "-", 2, 2],
		["br", ",", "", [0, 0], "", "-", 2, 2],
		["ca", ",", ".", [0, 0], "", "-", 2, 2],
		["cs", ",", " ", [3, 3], "", "-", 2, 2],
		["de_ch", ".", "'", [3, 3], "", "-", 2, 2],
		["dz", ".", ",", [3, 2], "", "-", 3, 3],
		["el_cy", ",", ".", [0, 0], "", "-", 4, 4],
		["en_za", ".", " ", [3, 3], "", "-", 2, 2],
		["es_us", ".", ",", [3, 999], "", "-", 2, 2],
		["fa", ".", ",", [3], "", "-", 0, 0],
		["fr_ca", ",", " ", [0, 0], "", "-", 2, 2],
		["fr_ch", ".", "'", [0, 0], "", "-", 2, 2],
		["is", ",", ".", [3, 3], "", "-", 0, 0],
		["ko", ".", ",", [3, 3], "", "-", 0, 0],
		["ru", ",", " ", [3, 3], "", "-", 2, 2],
		["rw", ",", "", [-1], "", "-", 2, 2],
		["sq", ",", ".", [3], "", "-", 3, 3],
	];
	nexacro.Locale._localeInfo_numData2 = [
		["aa_dj", 1, 0, 1, 0, 1, 1],
		["aa_er", 1, 1, 1, 1, 1, 1],
		["ar_ae", 1, 1, 1, 1, 1, 2],
		["ar", 0, 1, 0, 1, 1, 2],
		["az", 0, 1, 0, 1, 1, 1],
		["da", 1, 2, 1, 2, 4, 4],
		["de_be", 1, 1, 1, 1, 4, 4],
		["el_cy", 0, 0, 1, 0, 1, 1],
		["es_hn", 1, 1, 1, 2, 1, 1],
		["fi", 0, 2, 0, 2, 1, 1],
		["he", 1, 1, 1, 1, 2, 2],
		["ja", 1, 0, 1, 0, 4, 4],
		["km", 0, 0, 0, 0, 1, 1],
		["lv", 1, 1, 1, 1, 3, 3],
		["ms", 1, 0, 1, 0, 1, 0],
		["nb", 1, 1, 1, 2, 4, 4],
		["nl", 1, 1, 1, 2, 1, 2],
		["nn", 1, 1, 1, 2, 1, 3],
		["pa_pk", 1, 1, 1, 0, 2, 1],
		["tl", 1, 0, 1, 1, 1, 1],
	];
	nexacro.Locale._localeInfo_curSymbolData = [
		["aa_dj", "DJF ", "$"],
		["aa_er", "ERN ", "$"],
		["aa_et", "ETB ", "$"],
		["af", "ZAR ", "R"],
		["ar_ae", "AED ", "د.إ."],
		["ar_bh", "BHD ", "د.ب."],
		["ar_dz", "DZD ", "د.ج."],
		["ar_eg", "EGP ", "ج.م."],
		["ar_in", "INR ", "₨"],
		["ar_iq", "IQD ", "د.ع."],
		["ar_jo", "JOD ", "د.أ."],
		["ar_kw", "KWD ", "د.ك."],
		["ar_lb", "LBP ", "ل.ل."],
		["ar_ly", "LYD ", "د.ل."],
		["ar_ma", "MAD ", "د.م."],
		["ar_om", "OMR ", "ر.ع."],
		["ar_qa", "QAR ", "ر.ق."],
		["ar", "SAR ", "ريال"],
		["ar_sd", "SDD ", "ج.س."],
		["ar_sy", "SYP ", "ل.س."],
		["ar_tn", "TND ", "د.ت."],
		["ar_ye", "YER ", "ر.ي."],
		["as", "INR ", "ট"],
		["az", "AZM ", "man."],
		["be", "BYR ", "р."],
		["bg", "BGN ", "лв"],
		["bn_bd", "BDT ", "৳"],
		["bn", "INR ", "টাকা"],
		["br", "EUR ", "€"],
		["bs", "BAM ", "KM"],
		["cs", "CZK ", "Kč"],
		["cy", "GBP ", "£"],
		["da", "DKK ", "kr."],
		["de_ch", "CHF ", "Fr."],
		["dz", "BTN ", "དངུལ་ཀྲམ་"],
		["el_cy", "CYP ", "£"],
		["en_au", "AUD ", "$"],
		["en_bw", "BWP ", "Pu"],
		["en_ca", "CAD ", "$"],
		["en_dk", "DKK ", "¤"],
		["en_gh", "GH₵ ", "₵"],
		["en_hk", "HKD ", "HK$"],
		["en_in", "INR ", "₨."],
		["en_jm", "JMD ", "$"],
		["en_nz", "NZD ", "$"],
		["en_ph", "PHP ", "Php"],
		["en_sg", "SGD ", "$"],
		["en", "USD ", "$"],
		["en_zw", "ZWD ", "Z$"],
		["es_419", "XXX ", "¤"],
		["es_ar", "ARS ", "$"],
		["es_bo", "BOB ", "$b"],
		["es_cl", "CLP ", "$"],
		["es_co", "COP ", "$"],
		["es_cr", "CRC ", "₡"],
		["es_do", "DOP ", "RD$"],
		["es_gt", "GTQ ", "Q"],
		["es_hn", "HNL ", "L."],
		["es_mx", "MXN ", "$"],
		["es_ni", "NIO ", "$C"],
		["es_pa", "PAB ", "B/"],
		["es_pe", "PEN ", "S/."],
		["es_py", "PYG ", "Gs"],
		["es_sv", "SVC ", "$"],
		["es_uy", "UYU ", "$U"],
		["es_ve", "VEB ", "Bs."],
		["et", "EEK ", "€"],
		["fa", "IRR ", "ریال"],
		["fr_ch", "CHF ", "fr."],
		["gu", "INR ", "રૂ"],
		["he", "ILS ", "₪"],
		["hi", "INR ", "रू"],
		["hr", "HRK ", "Kn"],
		["hu", "HUF ", "Ft"],
		["hy", "AMD ", "դր."],
		["id", "IDR ", "Rp"],
		["is", "ISK ", "kr."],
		["iw", "ILS ", "שח"],
		["ja", "JPY ", "￥"],
		["ka", "GEL ", "Lari"],
		["kk", "KZT ", "Т"],
		["kl", "DKK ", "kr"],
		["km", "KHR ", "៛"],
		["kn", "INR ", "ರೂ"],
		["ko", "KRW ", "￦"],
		["ku", "TRY ", "YTL"],
		["ky", "KGS ", "сом"],
		["lg", "UGX ", "/-"],
		["lo", "LAK ", "₭"],
		["lt", "LTL ", "Lt"],
		["lv", "LVL ", "Ls"],
		["mg", "MGA ", "AR"],
		["mk", "MKD ", "ден."],
		["ml", "INR ", "ക"],
		["mn", "MNT ", "₮"],
		["mr", "INR ", "रु"],
		["ms", "MYR ", "RM"],
		["mt", "MTL ", "€"],
		["my", "MMK ", "K"],
		["nb", "NOK ", "kr"],
		["om_ke", "KES ", "Ksh"],
		["or", "INR ", "ଟ"],
		["pa", "INR ", "ਰੁ"],
		["pa_pk", "PKR ", "Rs"],
		["pl", "PLN ", "zł"],
		["pt_br", "BRL ", "R$"],
		["ro", "RON ", "lei"],
		["ru", "RUB ", "р."],
		["ru_ua", "UAH ", "гр"],
		["rw", "RWF ", "Frw"],
		["se", "NOK ", " ru"],
		["si", "LKR ", "₨"],
		["sk", "SKK ", "€"],
		["so", "SOS ", "$"],
		["sq", "ALL ", "Lek"],
		["sr", "RSD ", "дин"],
		["sv", "SEK ", "kr"],
		["ta", "INR ", "ரூ"],
		["te", "INR ", "రూ"],
		["tg", "TJS ", "руб"],
		["th", "THB ", "฿"],
		["tl", "PHP ", "PhP"],
		["tr", "TRY ", "TL"],
		["uk", "UAH ", "₴"],
		["uz", "UZS ", "so'm"],
		["vi", "VND ", "₫"],
		["zh", "CNY ", "￥"],
		["zh_tw", "TWD ", "NT$"],
	];
	nexacro.Locale._localeInfo_curData = [
		["aa_dj", ".", " ", [3, 3]],
		["aa_er", ".", ",", [3, 3]],
		["ar_ae", ".", ",", [3]],
		["ar_in", ".", ",", [3, 2]],
		["ar", ".", "", [-1]],
		["bg", ",", " ", [3, 3]],
		["br", ",", " ", [3, 3]],
		["ca_ad", ",", ".", [3, 3]],
		["de_ch", ".", "'", [3, 3]],
		["el_cy", ",", ".", [3]],
		["es_hn", ".", ",", [3, 999]],
		["fa", "٫", "٬", [3]],
		["kk", "-", " ", [3, 3]],
		["nn", ",", " ", [3]],
		["ru", ",", " ", [3, 3]],
	];
	nexacro.Locale._localeInfo_weeknameData = [
		["Acaada", "Etleeni", "Talaata", "Arbaqa", "Kamiisi", "Gumqata", "Sabti"],
		["aca", "etl", "tal", "arb", "kam", "gum", "sab"],
		["Aca", "Etl", "Tal", "Arb", "Kam", "Gum", "Sab"],
		["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"],
		["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa"],
		["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت "],
		["ح", "ن", "ث", "ر", "خ", "ج", "س"],
		["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
		["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعـة", "السبت"],
		["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		["দেওবাৰ", "সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহষ্পতিবাৰ", "শুক্ৰবাৰ", "শনিবাৰ"],
		["দেও", "সোম", "মঙ্গল", "বুধ", "বৃহষ্পতি", "শুক্ৰ", "শনি"],
		["bazar günü", "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə"],
		["baz", "ber", "çax", "çər", "cax", "cüm", "şnb"],
		["Нядзеля", "Панядзелак", "Аўторак", "Серада", "Чацвер", "Пятніца", "Субота"],
		["Няд", "Пан", "Аўт", "Срд", "Чцв", "Пят", "Суб"],
		["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"],
		["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
		["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
		["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"],
		["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"],
		["sul", "lun", "meurzh", "merc'her", "yaou", "gwener", "sadorn"],
		["sul", "lun", "meu", "mer", "yao", "gwe", "sad"],
		["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
		["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
		["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
		["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
		["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
		["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
		["Sul", "Llun", "Mawrth", "Mercher", "Iau", "Gwener", "Sadwrn"],
		["Sul", "Llu", "Maw", "Mer", "Iau", "Gwe", "Sad"],
		["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"],
		["søn", "man", "tir", "ons", "tor", "fre", "lør"],
		["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
		["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
		["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
		["གཟའ་ཟླ་བ་", "གཟའ་མིག་དམར་", "གཟའ་ལྷག་ཕ་", "གཟའ་པུར་བུ་", "གཟའ་པ་སངས་", "གཟའ་སྤེན་ཕ་", "གཟའ་ཉི་མ་"],
		["ཟླ་", "མིར་", "ལྷག་", "པུར་", "སངས་", "སྤེན་", "ཉི་"],
		["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
		["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
		["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
		["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
		["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"],
		["P", "E", "T", "K", "N", "R", "L"],
		["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"],
		["ig.", "al.", "ar.", "az.", "og.", "or.", "lr."],
		["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
		["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
		["su", "ma", "ti", "ke", "to", "pe", "la"],
		["sunnudagur", "mánadagur", "týsdagur", "mikudagur", "hósdagur", "fríggjadagur", "leygardagur"],
		["sun", "mán", "týs", "mik", "hós", "frí", "ley"],
		["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
		["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
		["Snein", "Moandei", "Tiisdei", "Woansdei", "Tongersdei", "Freed", "Sneon"],
		["Sn", "Mo", "Ti", "Wo", "To", "Fr", "Sn"],
		["Dé Domhnaigh", "Dé Luain", "Dé Máirt", "Dé Céadaoin", "Déardaoin", "Dé hAoine", "Dé Sathairn"],
		["Domh", "Luan", "Máirt", "Céad", "Déar", "Aoine", "Sath"],
		["Didòmhnaich", "Diluain", "Dimàirt", "Diciadain", "Diardaoin", "Dihaoine", "Disathairne"],
		["Dido", "Dilu", "Dim", "Dic", "Diar", "Diha", "Disa"],
		["Domingo", "Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado"],
		["Dom", "Lun", "Mar", "Mér", "Xov", "Ven", "Sáb"],
		["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"],
		["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"],
		["Jedoonee", "Jelhein", "Jemayrt", "Jercean", "Jerdein", "Jeheiney", "Jesarn"],
		["Jed", "Jel", "Jem", "Jerc", "Jerd", "Jeh", "Jes"],
		["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
		["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"],
		["रविवार ", "सोमवार ", "मंगलवार ", "बुधवार ", "गुरुवार ", "शुक्रवार ", "शनिवार "],
		["रवि ", "सोम ", "मंगल ", "बुध ", "गुरु ", "शुक्र ", "शनि "],
		["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
		["v", "h", "k", "sze", "cs", "p", "szo"],
		["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"],
		["Կրկ", "Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ"],
		["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		["sunnudagur", "mánudagur", "þriðjudagur", "miðvikudagur", "fimmtudagur", "föstudagur", "laugardagur"],
		["sun", "mán", "þri", "mið", "fim", "fös", "lau"],
		["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
		["dom", "lun", "mar", "mer", "mer", "ven", "sab"],
		["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
		["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
		["日", "月", "火", "水", "木", "金", "土"],
		["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"],
		["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
		["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"],
		["Жк", "Дс", "Сс", "Ср", "Бс", "Жм", "Сн"],
		["sabaat", "ataasinngorneq", "marlunngorneq", "pingasunngorneq", "sisamanngorneq", "tallimanngorneq", "arfininngorneq"],
		["sab", "ata", "mar", "pin", "sis", "tal", "arf"],
		["ថ្ងៃ​អាទិត្យ", "ថ្ងៃ​ច័ន្ទ", "ថ្ងៃ​អង្គារ", "ថ្ងៃ​ពុធ", "ថ្ងៃ​ព្រហស្បតិ៍", "ថ្ងៃ​សុក្រ", "ថ្ងៃ​សៅរ៍"],
		["អា", "ច", "អ", "ពុ", "ព្រ", "សុ", "ស"],
		["ರವಿವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"],
		["ರ", "ಸೋ", "ಮಂ", "ಬು", "ಗು", "ಶು", "ಶ"],
		["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		["일", "월", "화", "수", "목", "금", "토"],
		["yêksêm", "dusêm", "sêsêm", "çarsêm", "pêncsêm", "înî", "sept"],
		["yêk", "dus", "sês", "çar", "pên", "înî", "sep"],
		["De Sul", "De Lun", "De Merth", "De Merher", "De Yow", "De Gwener", "De Sadorn"],
		["Sul", "Lun", "Mth", "Mhr", "Yow", "Gwe", "Sad"],
		["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби"],
		["жк", "дш", "ше", "ша", "бш", "жм", "иш"],
		["Sabiiti", "Balaza", "Lwakubiri", "Lwakusatu", "Lwakuna", "Lwakutaano", "Lwamukaaga"],
		["Sab", "Bal", "Lw2", "Lw3", "Lw4", "Lw5", "Lw6"],
		["ອາທິດ", "ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"],
		["ອາ.", "ຈ.", "ຄ.", "ພ.", "ພຫ.", "ສ.", "ສ."],
		["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
		["Sk", "Pr", "An", "Tr", "Kt", "Pn", "Št"],
		["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena"],
		["Sv", "P ", "O ", "T ", "C ", "Pk", "S "],
		["alahady", "alatsinainy", "talata", "alarobia", "alakamisy", "zoma", "sabotsy"],
		["lhd", "lts", "tlt", "lrb", "lkm", "zom", "sab"],
		["Rātapu", "Mane", "Tūrei", "Wenerei", "Tāite", "Paraire", "Hātarei"],
		["Ta", "Ma", "Tū", "We", "Tāi", "Pa", "Hā"],
		["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
		["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
		["ഞായര്‍", "തിങ്കള്‍", "ചൊവ്വ", "ബുധന്‍", "വ്യാഴം", "വെള്ളി", "ശനി"],
		["ഞാ", "തി", "ചൊ", "ബു", "വ്യാ", "വെ", "ശ"],
		["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"],
		["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"],
		["रविवार", "सोमवार", "मंगळवार", "मंगळवार", "गुरुवार", "शुक्रवार", "शनिवार"],
		["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"],
		["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
		["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
		["il-Ħadd", "it-Tnejn", "it-Tlieta", "l-Erbgħa", "il-Ħamis", "il-Ġimgħa", "is-Sibt"],
		["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib"],
		["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"],
		["နွေ", "လာ", "ဂါ", "ဟူး", "တေး", "သော", "နေ"],
		["आइतबार ", "सोमबार ", "मंगलबार ", "बुधबार ", "बिहिबार ", "शुक्रबार ", "शनिबार "],
		["आइत ", "सोम ", "मंगल ", "बुध ", "बिहि ", "शुक्र ", "शनि "],
		["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
		["zo", "ma", "di", "wo", "do", "vr", "za"],
		["sundag ", "måndag ", "tysdag ", "onsdag ", "torsdag ", "fredag ", "laurdag "],
		["su ", "må ", "ty ", "on ", "to ", "fr ", "lau "],
		["uSonto", "uMvulo", "uLesibili", "lesithathu", "uLesine", "ngoLesihlanu", "umGqibelo"],
		["Son", "Mvu", "Bil", "Tha", "Ne", "Hla", "Gqi"],
		["dimenge", "diluns", "dimars", "dimecres", "dijóus", "divendres", "disabte"],
		["dim", "lun", "mar", "mec", "jóu", "ven", "sab"],
		["Dilbata", "Wiixata", "Qibxata", "Roobii", "Kamiisa", "Jimaata", "Sanbata"],
		["Dil", "Wix", "Qib", "Rob", "Kam", "Jim", "San"],
		["ରବିବାର", "ସୋମବାର", "ମଙ୍ଗଳବାର", "ବୁଧବାର", "ଗୁରୁବାର", "ଶୁକ୍ରବାର", "ଶନିବାର"],
		["ରବି", "ସୋମ", "ମଙ୍ଗଳ", "ବୁଧ", "ଗୁରୁ", "ଶୁକ୍ର", "ଶନି"],
		["ਐਤਵਾਰ ", "ਸੋਮਵਾਰ ", "ਮੰਗਲਵਾਰ ", "ਬੁੱਧਵਾਰ ", "ਵੀਰਵਾਰ ", "ਸ਼ੁੱਕਰਵਾਰ ", "ਸ਼ਨਿੱਚਰਵਾਰ "],
		["ਐਤ ", "ਸੋਮ ", "ਮੰਗਲ ", "ਬੁੱਧ ", "ਵੀਰ ", "ਸ਼ੁੱਕਰ ", "ਸ਼ਨਿੱਚਰ "],
		["اتوار", "پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته"],
		["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"],
		["nie", "pon", "wto", "śro", "czw", "pią", "sob"],
		["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
		["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
		["duminică", "luni", "marţi", "miercuri", "joi", "vineri", "sâmbătă"],
		["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sb"],
		["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
		["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
		["Вск", "Пнд", "Вто", "Срд", "Чтв", "Птн", "Суб"],
		["Ku cyumweru", "Kuwa mbere", "Kuwa kabiri", "Kuwa gatatu", "Kuwa kane", "Kuwa gatanu", "Kuwa gatandatu"],
		["Mwe", "Mbe", "Kab", "Gtu", "Kan", "Gnu", "Gnd"],
		["sotnabeaivi", "vuossárga", "maŋŋebarga", "gaskavahkku", "duorasdat", "bearjadat", "lávvardat"],
		["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"],
		["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"],
		["ඉ", "ස", "අ", "බ", "බ්‍ර", "සි", "සෙ"],
		["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
		["Ne", "Po", "Ut", "St", "Št", "Pi", "So"],
		["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"],
		["ned", "pon", "tor", "sre", "čet", "pet", "sob"],
		["Axad", "Isniin", "Salaaso", "Arbaco", "Khamiis", "Jimco", "Sabti"],
		["axa", "isn", "sal", "arb", "kha", "jim", "sab"],
		["Axa", "Isn", "Sal", "Arb", "Kha", "Jim", "Sab"],
		["e diel ", "e hënë ", "e martë ", "e mërkurë ", "e enjte ", "e premte ", "e shtunë "],
		["Die ", "Hën ", "Mar ", "Mër ", "Enj ", "Pre ", "Sht "],
		["недјеља", "понедељак", "уторак", "сриједа", "четвртак", "петак", "субота"],
		["нед", "пон", "уто", "сри", "чет", "пет", "суб"],
		["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"],
		["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
		["Lisontfo", "uMsombuluko", "Lesibili", "Lesitsatfu", "Lesine", "Lesihlanu", "uMgcibelo"],
		["Son", "Mso", "Bil", "Tsa", "Ne", "Hla", "Mgc"],
		["Sontaha", "Mantaha", "Labobedi", "Laboraro", "Labone", "Labohlano", "Moqebelo"],
		["Son", "Mma", "Bed", "Rar", "Ne", "Hla", "Moq"],
		["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
		["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
		["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
		["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
		["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"],
		["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
		["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
		["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
		["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"],
		["ሰንበ", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"],
		["Linggo", "Lunes", "Martes", "Miyerkoles", "Huwebes", "Biyernes", "Sabado"],
		["Lin", "Lun", "Mar", "Miy", "Huw", "Biy", "Sab"],
		["laTshipi", "Mosupologo", "Labobedi", "Laboraro", "Labone", "Labotlhano", "Lamatlhatso"],
		["Tsh", "Mos", "Bed", "Rar", "Ne", "Tlh", "Mat"],
		["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
		["Paz", "Pzt", "Sal", "Çrş", "Prş", "Cum", "Cts"],
		["Sonto", "Musumbhunuku", "Ravumbirhi", "Ravunharhu", "Ravumune", "Ravuntlhanu", "Mugqivela"],
		["Son", "Mus", "Bir", "Har", "Ne", "Tlh", "Mug"],
		["Якшәмбе", "Дышәмбе", "Сишәмбе", "Чәршәәмбе", "Пәнҗешмбе", "Җомга", "Шимбә"],
		["Якш", "Дыш", "Сиш", "Чәрш", "Пәнҗ", "Җом", "Шим"],
		["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
		["Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
		["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
		["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"],
		["Swondaha", "Musumbuluwo", "Ḽavhuvhili", "Ḽavhuraru", "Ḽavhuṋa", "Ḽavhuṱanu", "Mugivhela"],
		["Swo", "Mus", "Vhi", "Rar", "ṋa", "Ṱan", "Mug"],
		["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
		["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
		["dimegne", "londi", "mårdi", "mierkidi", "djudi", "vénrdi", "semdi"],
		["dim", "lon", "mår", "mie", "dju", "vén", "sem"],
		["iCawa", "uMvulo", "lwesiBini", "lwesiThathu", "ulweSine", "lwesiHlanu", "uMgqibelo"],
		["Caw", "Mvu", "Bin", "Tha", "Sin", "Hla", "Mgq"],
		["זונטיק", "מאָנטיק", "דינסטיק", "מיטװאָך", "דאָנערשטיק", "פֿרײַטיק", "שבת"],
		["זונ'", "מאָנ'", "דינ'", "מיט'", "דאָנ'", "פֿרײַ'", "שבת"],
		["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		["日", "一", "二", "三", "四", "五", "六"],
		["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
	];
	nexacro.Locale._localeInfo_monthnameData = [
		["Qunxa Garablu", "Kudo", "Ciggilta Kudo", "Agda Baxisso", "Caxah Alsa", "Qasa Dirri", "Qado Dirri", "Liiqen", "Waysu", "Diteli", "Ximoli", "Kaxxa Garablu"],
		["qun", "nah", "cig", "agd", "cax", "qas", "qad", "leq", "way", "dit", "xim", "kax"],
		["Qunxa Garablu", "Naharsi Kudo", "Ciggilta Kudo", "Agda Baxisso", "Caxah Alsa", "Qasa Dirri", "Qado Dirri", "Leqeeni", "Waysu", "Diteli", "Ximoli", "Kaxxa Garablu"],
		["Qun", "Nah", "Cig", "Agd", "Cax", "Qas", "Qad", "Leq", "Way", "Dit", "Xim", "Kax"],
		["Qun", "Kud", "Cig", "Agd", "Cax", "Qas", "Qad", "Leq", "Way", "Dit", "Xim", "Kax"],
		["Januarie", "Februarie", "Maart", "April", "Mei", "Junie", "Julie", "Augustus", "September", "Oktober", "November", "Desember"],
		["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
		["يناير", "فبراير", "مارس", "أبريل	", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		["كانون الثاني", "شباط", "آذار", "نيسان", "نوار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
		["ينا	", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
		["كانون الثاني", "شباط", "آذار", "نيسـان", "أيار", "حزيران", "تـمـوز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
		["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		["كانون الثاني", "شباط", "آذار", "نيسان", "نواران", "حزير", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
		["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে", "জুন", "জুলাই", "আগষ্ট", "চেপ্তেম্বৰ", "অক্টোবৰ", "নভেম্বৰ", "ডিচেম্বৰ"],
		["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে", "জুন", "জুলাই", "আগ", "চেপ্তেম্বৰ", "অক্টোবৰ", "নভেম্বৰ", "ডিচেম্বৰ"],
		["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
		["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"],
		["Студзень", "Люты", "Сакавік", "Красавік", "Травень", "Чэрвень", "Ліпень", "Жнівень", "Верасень", "Кастрычнік", "Лістапад", "Снежань"],
		["Стд", "Лют", "Сак", "Крс", "Тра", "Чэр", "Ліп", "Жнв", "Врс", "Кст", "Ліс", "Снж"],
		["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
		["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек"],
		["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
		["জানু", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"],
		["Genver", "C'hwevrer", "Meurzh", "Ebrel", "Mae", "Mezheven", "Gouere", "Eost", "Gwengolo", "Here", "Du", "Kerzu"],
		["Gen ", "C'hw", "Meu ", "Ebr ", "Mae ", "Eve ", "Gou ", "Eos ", "Gwe ", "Her ", "Du  ", "Ker "],
		["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"],
		["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
		["gen", "feb", "mar", "abr", "mai", "jun", "jul", "ago", "set", "oct", "nov", "des"],
		["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
		["led", "úno", "bře", "dub", "kvě", "čen", "čec", "srp", "zář", "říj", "lis", "pro"],
		["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"],
		["Ion", "Chw", "Maw", "Ebr", "Mai", "Meh", "Gor", "Aws", "Med", "Hyd", "Tach", "Rha"],
		["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
		["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
		["Jänner", "Feber", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		["ཟླ་བ་དང་པ་", "ཟླ་བ་གཉིས་པ་", "ཟླ་བ་གསུམ་པ་", "ཟླ་བ་བཞི་པ་", "ཟླ་བ་ལྔ་ཕ་", "ཟླ་བ་དྲུག་པ་", "ཟླ་བ་བདུནཔ་", "ཟླ་བ་བརྒྱད་པ་", "ཟླ་བ་དགུ་པ་", "ཟླ་བ་བཅུ་པ་", "ཟླ་བ་བཅུ་གཅིག་པ་", "ཟླ་བ་བཅུ་གཉིས་པ་"],
		["ཟླ་༡", "ཟླ་༢", "ཟླ་༣", "ཟླ་༤", "ཟླ་༥", "ཟླ་༦", "ཟླ་༧", "ཟླ་༨", "ཟླ་༩", "ཟླ་༡༠", "ཟླ་༡༡", "ཟླ་༡༢"],
		["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
		["Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιούν", "Ιούλ", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ"],
		["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
		["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
		["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
		["jaan ", "veebr", "märts", "apr  ", "mai  ", "juuni", "juuli", "aug  ", "sept ", "okt  ", "nov  ", "dets "],
		["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", "abendua"],
		["urt", "ots", "mar", "api", "mai", "eka", "uzt", "abu", "ira", "urr", "aza", "abe"],
		["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اكتبر", "نوامبر", "دسامبر"],
		["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
		["tammi ", "helmi ", "maalis", "huhti ", "touko ", "kesä  ", "heinä ", "elo   ", "syys  ", "loka  ", "marras", "joulu "],
		["januar", "februar", "mars", "apríl", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
		["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"],
		["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
		["jan", "fév", "mar", "avr", "mai", "jun", "jui", "aoû", "sep", "oct", "nov", "déc"],
		["Janaris", "Febrewaris", "Maart", "April", "Maaie", "Juny", "July", "Augustus", "Septimber", "Oktober", "Novimber", "Desimber"],
		["Jan", "Feb", "Maa", "Apr", "Maa", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		["Eanáir", "Feabhra", "Márta", "Aibreán", "Mí na Bealtaine", "Meith", "Iúil", "Lúnasa", "Meán Fómhair", "Deireadh Fómhair", "Mí na Samhna", "Mí na Nollag"],
		["Ean", "Feabh", "Márta", "Aib", "Beal", "Meith", "Iúil", "Lún", "MFómh", "DFómh", "Samh", "Noll"],
		["Am Faoilteach", "An Gearran", "Am Màrt", "An Giblean", "A' Mhàigh", "An t-Mhìos", "An t-luchar", "An Lùnasdal", "An t-Sultain", "An Damhair", "An t-Samhain", "An Dùbhlachd"],
		["Fao", "Gea", "Màr", "Gib", "Mhà", "OgM", "luc", "Lùn", "Sul", "Dam", "Sam", "Dùb"],
		["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"],
		["Xan", "Feb", "Mar", "Abr", "Mai", "Xuñ", "Xul", "Ago", "Set", "Out", "Nov", "Dec"],
		["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જુન", "જુલાઇ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"],
		["જાન", "ફેબ", "માર", "એપ્ર", "મે", "જુન", "જુલ", "ઓગ", "સપ્ટ", "ઓક્ટ", "નોવ", "ડિસ"],
		["Jerrey-geuree", "Toshiaght-arree", "Mayrnt", "Averil", "Boaldyn", "Mean-souree", "Jerrey-souree", "Luanistyn", "Mean-fouyir", "Jerrey-fouyir", "Mee Houney", "Mee ny Nollick"],
		["J-guer", "T-arree", "Mayrnt", "Avrril", "Boaldyn", "M-souree", "J-souree", "Luanistyn", "M-fouyir", "J-fouyir", "M.Houney", "M.Nollick"],
		["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
		["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"],
		["जनवरी", "फ़रवरी", "मार्च", "अप्रेल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"],
		["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
		["Sij", "Vel", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
		["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
		["jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"],
		["Հունվարի", "Փետրվարի", "Մարտի", "Ապրիլի", "Մայիսի", "Հունիսի", "Հուլիսի", "Օգոստոսի", "Սեպտեմբերի", "Հոկտեմբերի", "Նոյեմբերի", "Դեկտեմբերի"],
		["Հնվ", "Փտր", "Մար", "Ապր", "Մայ", "Հնս", "Հլս", "Օգս", "Սեպ", "Հոկ", "Նմբ", "Դեկ"],
		["Januari", "Pebruari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
		["Jan", "Peb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
		["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember"],
		["jan", "feb", "mar", "apr", "maí", "jún", "júl", "ágú", "sep", "okt", "nóv", "des"],
		["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
		["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
		["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		[" 1月", " 2月", " 3月", " 4月", " 5月", " 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"],
		["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
		["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"],
		["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"],
		["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"],
		["januari", "februari", "martsi", "aprili", "maji", "juni", "juli", "augustusi", "septemberi", "oktoberi", "novemberi", "decemberi"],
		["មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
		["១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩", "១០", "១១", "១២"],
		["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲಾಯಿ", "ಆಗಸ್ತು", "ಸೆಪ್ಟೆಂಬರ", "ಅಕ್ತೂಬರ", "ನವೆಂಬರ", "ದಶಂಬರ"],
		["ಜ", "ಫೆ", "ಮಾ", "ಏ", "ಮೇ", "ಜೂ", "ಜು", "ಆ", "ಸೆ", "ಅ", "ನ", "ದ"],
		["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		[" 1월", " 2월", " 3월", " 4월", " 5월", " 6월", " 7월", " 8월", " 9월", "10월", "11월", "12월"],
		["Çile", "Sibat", "Adar", "Nîsan", "Gulan", "Hezîran", "Tîrmeh", "Tebax", "Îlon", "Cotmeh", "Mijdar", "Kanûn"],
		["Çil", "Sib", "Ada", "Nîs", "Gul", "Hez", "Tîr", "Teb", "Îlo", "Cot", "Mij", "Kan"],
		["Mys Genver", "Mys Whevrel", "Mys Merth", "Mys Ebrel", "Mys Me", "Mys Evan", "Mys Gortheren", "Mye Est", "Mys Gwyngala", "Mys Hedra", "Mys Du", "Mys Kevardhu"],
		["Gen", "Whe", "Mer", "Ebr", "Me", "Evn", "Gor", "Est", "Gwn", "Hed", "Du", "Kev"],
		["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
		["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
		["Janwaliyo", "Febwaliyo", "Marisi", "Apuli", "Maayi", "Juuni", "Julaai", "Agusito", "Sebuttemba", "Okitobba", "Novemba", "Desemba"],
		["Jan", "Feb", "Mar", "Apu", "Maa", "Jun", "Jul", "Agu", "Seb", "Oki", "Nov", "Des"],
		["ມັງກອນ", "ກຸມຟາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"],
		["ມ.ກ.", "ກ.ພ.", "ມ.ນ.", "ມ.ສ.", "ພ.ພ.", "ມິ.ຖ.", "ກ.ລ.", "ສ.ຫ.", "ກ.ຍ.", "ຕ.ລ.", "ພ.ຈ.", "ທ.ວ."],
		["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"],
		["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spa", "Lap", "Grd"],
		["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris"],
		["jan", "feb", "mar", "apr", "mai", "jūn", "jūl", "aug", "sep", "okt", "nov", "dec"],
		["janoary", "febroary", "martsa", "aprily", "mey", "jona", "jolay", "aogositra", "septambra", "oktobra", "novambra", "desambra"],
		["jan", "feb", "mar", "apr", "mey", "jon", "jol", "aog", "sep", "okt", "nov", "des"],
		["Kohi-tātea", "Hui-tanguru", "Poutū-te-rangi", "Paenga-whāwhā", "Haratua", "Pipiri", "Hōngoingoi", "Here-turi-kōkā", "Mahuru", "Whiringa-ā-nuku", "Whiringa-ā-rangi", "Hakihea"],
		["Kohi", "Hui", "Pou", "Pae", "Hara", "Pipi", "Hōngoi", "Here", "Mahu", "Whi-nu", "Whi-ra", "Haki"],
		["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
		["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"],
		["ജനുവരി", "ഫെബ്രുവരി", "മാര്‍ച്ച്", "ഏപ്രില്‍ ", "മെയ്", "ജൂണ്‍", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്റ്റംബര്‍", "ഒക്ടോബര്‍", "നവംബര്‍", "ഡിസംബര്‍"],
		["ജനു", "ഫെബ്", "മാര്‍", "ഏപ്ര", "മെ", "ജൂണ്‍", "ജൂലൈ", "ആഗ്", "സെപ്", "ഒക്ടോ", "നവം", "ഡിസം"],
		["Хулгана сарын", "Үхэр сарын", "Бар сарын", "Туулай сарын", "Луу сарын", "Могой сарын", "Морь сарын", "Хонь сарын", "Бич сарын", "Тахиа сарын", "Нохой сарын", "Гахай сарын"],
		["Хул", "Үхэ", "Бар", "Туу", "Луу", "Мог", "Мор", "Хон", "Бич", "Тах", "Нох", "Гах"],
		["जानेवारी", "फेबृवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ओगस्ट", "सेप्टेंबर", "ओक्टोबर", "नोव्हेंबर", "डिसेंबर"],
		["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
		["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"],
		["Jannar", "Frar", "Marzu", "April", "Mejju", "Ġunju", "Lulju", "Awissu", "Settembru", "Ottubru", "Novembru", "Diċembru "],
		["Jan", "Fra", "Mar", "Apr", "Mej", "Ġun", "Lul", "Awi", "Set", "Ott", "Nov", "Diċ"],
		["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"],
		["ဇန်", "ဖေ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူ", "ဩ", "စက်", "အောက်", "နို", "ဒီ"],
		["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"],
		["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
		["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
		["Janabari", "uFeberbari", "uMatjhi", "u-Apreli", "Meyi", "Juni", "Julayi", "Arhostosi", "Septemba", "Oktoba", "Usinyikhaba", "Disemba"],
		["Jan", "Feb", "Mat", "Apr", "Mey", "Jun", "Jul", "Arh", "Sep", "Okt", "Usi", "Dis"],
		["genièr", "febrièr", "març", "abrial", "mai", "junh", "julhet", "agóst", "setembre", "octobre", "novembre", "decembre"],
		["gen", "feb", "mar", "abr", "mai", "jun", "jul", "agó", "set", "oct", "nov", "dec"],
		["Amajjii", "Guraandhala", "Bitooteessa", "Elba", "Caamsa", "Waxabajjii", "Adooleessa", "Hagayya", "Fuulbana", "Onkololeessa", "Sadaasa", "Muddee"],
		["Ama", "Gur", "Bit", "Elb", "Cam", "Wax", "Ado", "Hag", "Ful", "Onk", "Sad", "Mud"],
		["ଜାନୁଆରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଅପ୍ରେଲ", "ମଇ", "ଜୁନ", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର"],
		["1", "3", "4", "5", "6", "7", "8", "9", "10", "10", "11", "12"],
		["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"],
		["جنوري", "فروري", "مارچ", "اپريل", "مٓی", "جون", "جولاي", "اگست", "ستمبر", "اكتوبر", "نومبر", "دسمبر"],
		["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
		["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"],
		["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
		["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
		["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"],
		["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		["Mutarama", "Gashyantare", "Werurwe", "Mata", "Gicuransi", "Kamena", "Nyakanga", "Kanama", "Nzeli", "Ukwakira", "Ugushyingo", "Ukuboza"],
		["Mut", "Gas", "Wer", "Mat", "Gic", "Kam", "Nya", "Kan", "Nze", "Ukw", "Ugu", "Uku"],
		["ođđajagemánu", "guovvamánu", "njukčamánu", "cuoŋománu", "miessemánu", "geassemánu", "suoidnemánu", "borgemánu", "čakčamánu", "golggotmánu", "skábmamánu", "juovlamánu"],
		["ođđj", "guov", "njuk", "cuoŋ", "mies", "geas", "suoi", "borg", "čakč", "golg", "skáb", "juov"],
		["ජනවාරි", "පෙබරවාලි", "මාර්තු", "අප්‍රියෙල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නෙවැම්බර්", "දෙසැම්බර්"],
		["ජන", "පෙබ", "මාර්", "අප්‍රි", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නෙවැ", "දෙසැ"],
		["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"],
		["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"],
		["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
		["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
		["Bisha Koobaad", "Bisha Labaad", "Bisha Afraad", "Bisha Shanaad", "Bisha Shanaad", "Bisha Lixaad", "Bisha Todobaad", "Bisha Sideedaad", "Bisha Sagaalaad", "Bisha Tobnaad", "Bisha Kow iyo Tobnaad", "Bisha Laba iyo Tobnaad"],
		["kob", "lab", "sad", "afr", "sha", "lix", "tod", "sid", "sag", "tob", "kit", "lit"],
		["Bisha Koobaad", "Bisha Labaad", "Bisha Saddexaad", "Bisha Afraad", "Bisha Shanaad", "Bisha Lixaad", "Bisha Todobaad", "Bisha Sideedaad", "Bisha Sagaalaad", "Bisha Tobnaad", "Bisha Kow iyo Tobnaad", "Bisha Laba iyo Tobnaad"],
		["Kob", "Lab", "Sad", "Afr", "Sha", "Lix", "Tod", "Sid", "Sag", "Tob", "KIT", "LIT"],
		["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"],
		["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj"],
		["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"],
		["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец"],
		["Bhimbidvwane", "iNdlovane", "iNdlovulenkhulu", "Mabasa", "Inkhwenkhweti", "iNhlaba", "Kholwane", "iNgci", "iNyoni", "Impala", "Lweti", "iNgongoni"],
		["Bhi", "Van", "Vul", "Mab", "Khk", "Nhl", "Kho", "Ngc", "Nyo", "Imp", "Lwe", "Ngo"],
		["Pherekgong", "Hlakola", "Tlhakubele", "Mmese", "Motsheanong", "Phupjane", "Phupu", "Phato", "Leotse", "Mphalane", "Pudungwana", "Tshitwe"],
		["Phe", "Hla", "TlH", "Mme", "Mot", "Jan", "Upu", "Pha", "Leo", "Mph", "Pud", "Tsh"],
		["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
		["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"],
		["ஜன", "பிப்", "மார்", "ஏப்", "மே", "ஜூன்", "ஜூலை", "ஆக", "செப்", "அக்", "நவ", "டிச"],
		["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబరు", "అక్టోబరు", "నవంబరు", "డిసెంబరు"],
		["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
		["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
		["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
		["ጥሪ", "ለካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰነ", "ሓምለ", "ነሓሰ", "መስከረም", "ጥቅምቲ", "ሕዳር", "ታሕሳስ"],
		["ጥሪ ", "ለካቲ", "መጋቢ", "ሚያዝ", "ግንቦ", "ሰነ ", "ሓምለ", "ነሓሰ", "መስከ", "ጥቅም", "ሕዳር", "ታሕሳ"],
		["ጃንዩወሪ", "ፌብሩወሪ", "ማርች", "ኤፕረል", "ሜይ", "ጁን", "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክተውበር", "ኖቬምበር", "ዲሴምበር"],
		["ጃንዩ", "ፌብሩ", "ማርች", "ኤፕረ", "ሜይ ", "ጁን ", "ጁላይ", "ኦገስ", "ሴፕቴ", "ኦክተ", "ኖቬም", "ዲሴም"],
		["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Septiyembre", "Oktubre", "Nobiyembre", "Disyembre"],
		["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Sep", "Okt", "Nob", "Dis"],
		["Ferikgong", "Tlhakole", "Mopitlwe", "Moranang", "Motsheganong", "Seetebosigo", "Phukwi", "Phatwe", "Lwetse", "Diphalane", "Ngwanatsele", "Sedimonthole"],
		["Fer", "Tlh", "Mop", "Mor", "Mot", "See", "Phu", "Pha", "Lwe", "Dip", "Ngw", "Sed"],
		["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
		["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
		["Sunguti", "Nyenyenyani", "Nyenyankulu", "Dzivamisoko", "Mudyaxihi", "Khotavuxika", "Mawuwani", "Mhawuri", "Ndzhati", "Nhlangula", "Hukuri", "N'wendzamhala"],
		["Sun", "Yan", "Kul", "Dzi", "Mud", "Kho", "Maw", "Mha", "Ndz", "Nhl", "Huk", "N'w"],
		["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
		["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
		["Phando", "Luhuhi", "Ṱhafamuhwe", "Lambamai", "Shundunthule", "Fulwi", "Fulwana", "Ṱhangule", "Khubvumedzi", "Tshimedzi", "Ḽara", "Nyendavhusiku"],
		["Pha", "Luh", "Fam", "Lam", "Shu", "Lwi", "Lwa", "Ngu", "Khu", "Tsh", "Ḽar", "Nye"],
		["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"],
		["Th01", "Th02", "Th03", "Th04", "Th05", "Th06", "Th07", "Th08", "Th09", "Th10", "Th11", "Th12"],
		["djanvî", "fevrî", "måss", "avri", "may", "djun", "djulete", "awousse", "setimbe", "octôbe", "nôvimbe", "decimbe"],
		["dja", "fev", "mås", "avr", "may", "djn", "djl", "awo", "set", "oct", "nôv", "dec"],
		["eyoMqungu", "eyoMdumba", "eyoKwindla", "uTshazimpuzi", "uCanzibe", "eyeSilimela", "eyeKhala", "eyeThupa", "eyoMsintsi", "eyeDwarha", "eyeNkanga", "eyoMnga"],
		["Mqu", "Mdu", "Kwi", "Tsh", "Can", "Sil", "Kha", "Thu", "Msi", "Dwa", "Nka", "Mng"],
		["יאַנואַר", "פֿעברואַר", "מאַרץ", "אַפּריל", "מײַ", "יוני", "יולי", "אױגוסט", "סעפּטעמבער", "אָקטאָבער", "נאָװעמבער", "דעצעמבער"],
		["יאַנ", "פֿעב", "מאַר", "אַפּר", "מײַ ", "יונ", "יול", "אױג", "סעפּ", "אָקט", "נאָװ", "דעצ"],
		["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	];
	nexacro.Locale._localeInfo_ampmData = [
		["saaku", "carra"],
		["VM", "NM"],
		["ص", "م"],
		["", ""],
		["পূৰ্ব্বাহ্ন", "অপৰাহ্ন"],
		["পূর্বাহ্ণ", "অপরাহ্ণ"],
		[" ", " "],
		["AM", "PM"],
		["ངས་ཆ", "ཕྱི་ཆ"],
		["πμ", "μμ"],
		["સવારે", "સાંજે"],
		["पूर्वाह्न", "अपराह्न"],
		["fh", "eh"],
		["午前", "午後"],
		["ព្រឹក", "ល្ងាច"],
		["ಪೂರ್ವಾಹ್ನ", "ಅಪರಾಹ್ನ"],
		["오전", "오후"],
		["രാവിലെ", "വൈകു"],
		["म.पू.", "म.नं."],
		["နံနက်", "ညနေ"],
		["WD", "WB"],
		["ਸਵੇਰੇ", "ਸ਼ਾਮ"],
		["ص", "ش"],
		["පෙ.ව.", "ප.ව."],
		["subaxnimo", "galabnimo"],
		["PD", "MD"],
		["காலை", "மாலை"],
		["ఉ.", "సా."],
		["ንጉሆ> <U1230ዓተ", "ድሕር> <U1230ዓት"],
		["ÖÖ", "ÖS"],
		["上午", "下午"],
	];
	nexacro.Locale._localeInfo_formatData = [
		"",
		"%d/%m/%Y",
		"%l:%M:%S",
		"%X %p",
		"%a %d %b %Y %r %Z",
		"%a %b %e %r %Z %Y",
		"%A, %B %e, %Y %r %Z",
		"%A, %B %e, %r %Z %Y",
		"%T",
		"%a %d %b %Y %T %Z",
		"%a %b %e %H:%M:%S %Z %Y",
		"%d %B %Y",
		"%Y/%m/%d",
		"%d %b, %Y",
		"%Z %I:%M:%S",
		"%Z %I:%M:%S %p",
		"%d %b, %Y %Z %I:%M:%S %p",
		"%d %B, %Y",
		"%d-%m-%Y",
		"%A %d %B %Y",
		"%I:%M:%S  %Z",
		"%I:%M:%S %p %Z",
		"%A %d %B %Y %I:%M:%S %p %Z",
		"%A %.1d %B %Y",
		"%.1H:%M:%S",
		"%A %.1d %B %Y  %.1H:%M:%S",
		"%d/%B/%Y",
		"%Y-%m-%d",
		"%e-%m-%Y",
		"%I.%M.%S %p",
		"%e %B, %Y %I.%M.%S %p %Z",
		"%Y,%B %d, %A",
		"%d.%m.%Y",
		"%A, %d %B %Y %T",
		"%a %d %b %Y %T",
		"%e %B %Y",
		"%e.%m.%Y",
		"%k,%M,%S",
		"%l,%M,%S",
		"%x (%a) %X %Z",
		"%d %B %Y г.",
		"%e.%n.%Y г.",
		"%A %d %b %Y",
		"%A %d %b %Y %I:%M:%S %p %Z",
		"%Ie%M:%S %p",
		"D'ar %A %d a viz %B %Y",
		"%d/%m/%y",
		"%A, %e / %B / %Y",
		"%H:%M:%S",
		"%I:%M:%S",
		"%a %e. %B %Y, %H:%M:%S %Z",
		"%e. %B %Y",
		"%e.%n.%Y",
		"%d.%m.%y",
		"%l:%M:%S %P %Z",
		"Dydd %A %d mis %B %Y %T %Z",
		"%A, %d. %B %Y",
		"%a %-d. %b %H:%M:%S %Z %Y",
		"པསྱི་ལོ%yཟལ%mཚེས%d",
		"ཆུ་ཚོད%   Hཀསར་མ%Mཀསར་ཆ%S",
		"ཆུ་ཚོད%Iཀསར་མ%Mཀསར་ཆ%S %p",
		"པསྱི་ལོ%yཟལ%mཚེས%dཆུ་ཚོད%Hཀསར་མ%Mཀསར་ཆ%S",
		"%r",
		"%I:%M:%S %p",
		"%A, %e %B %Y",
		"%e/%n/%Y",
		"%B-%d-%y",
		"%Y-%m-%dT%T %Z",
		"%A, %B %d, %Y",
		"%I:%M:%S %Z",
		"%p%I:%M:%S %Z",
		"%A, %B %d, %Y %p%I:%M:%S %Z",
		"%a %e %b %H:%M:%S %Z %Y",
		"%A, %d %B %Y",
		"U0025I:%M:%S %p",
		"%e/%m/%Y",
		"%A, %d %B, %Y",
		"%A, %d %B, %Y %I:%M:%S %p %Z",
		"%A, %B %e,%Y",
		"%n/%e/%Y",
		"%A %d,%B,%Y",
		"%A %d,%B,%Y %I:%M:%S %p %Z",
		"%m/%d/%Y",
		"%A, %B %d , %Y",
		"%A, %d de %B de %Y",
		"%A, %d 'de' %B 'de' %Y",
		"%e. %B %Y.  \a.",
		"%a, %Y.eko %bren %da",
		"%y-%m-%d %T %Z",
		"%A, %Y.eko %B %e",
		"%Oy/%Om/%Od",
		"%OH:%OM:%OS",
		"‫%A %Oe %B %Oy، %OH:%OM:%OS‬",
		"‫%A %Oe %B %Oy، ساعت %OH:%OM:%OS (%Z)‬",
		"%a %e. %Bta %Y %T",
		"%a %-d.%-m.%Y %T %z",
		"%d/%m-%Y",
		"%A %e %B %Y",
		"%d. %m. %y",
		"%d-%m-%y",
		"%I:%M:%S %P",
		"%Z %H:%M:%S %Y %b %d %a",
		"%e. %B %Y.",
		"%e.%n.%Y.",
		"%H.%M.%S",
		"%Y. %b. %e., %A, %H.%M.%S %Z",
		"%Y. %B %e",
		"%Y.%m.%d.",
		"%m/%d/%y",
		"%e %B, %Y",
		"%a %e.%b %Y",
		"%a %e.%b %Y, %T %Z",
		"%A, %e. %B %Y",
		"%Y年%m月%d日",
		"%H時%M分%S秒",
		"%p%I時%M分%S秒",
		"%Y年%m月%d日 %H時%M分%S秒",
		"%Y年%n月%e日",
		"%Y წლის %d %B, %T %Z",
		"%Y წლის %d %m, %A",
		"%e %B %Y %A ж.",
		"%d %b %Y",
		"%A ថ្ងៃ %e ខែ %B ឆ្នាំ  %Y, %H ម៉ោង m នាទី %S វិនាទី​",
		"%a %e %b% %Ey %H:%M%:%S %Z",
		"%Y년 %m월 %d일",
		"%H시 %M분 %S초",
		"%p %I시 %M분 %S초",
		"%x (%a) %r",
		"%Y. %m. %d. (%a) %H:%M:%S %Z",
		"%Y년 %n월 %e일 %A",
		"%A %d %B %Y %T %Z",
		"%a, %e-%b %Y ж, %H:%M:%S %Z",
		"%e-%B %Y-%A ж.",
		"%d/%m/%Ey",
		"%a %e %b %Ey, %H:%M:%S",
		"%a %e %b %Ey %H:%M:%S %Z",
		"%Y.%m.%d",
		"%Y m. %B %d d. %T",
		"%Y 'm'. %B %e 'd'.",
		"%A, %Y. gada %e. %B, plkst. %H un %M",
		"%A, %Y. 'gada' %e. %B",
		"Te %A, te %d o %B, %Y %T %Z",
		"%a, %d %b %Y %T %Z",
		"%a, %d %b %H:%M:%S %Z %Y",
		"%Y %b %d, %a %T",
		"%Z %Y оны %B %e, %a %H:%M:%S",
		"%A, %d ta %b, %Y",
		"%A, %d ta %b, %Y %I:%M:%S %p %Z",
		"%A, %e ta' %B %Y",
		"%OC%Oy %b %Od %A",
		"%OI:%OM:%OS %p",
		"%OC%Oy %b %Od %A %OI:%OM:%OS %p",
		"%OC%Oy %b %Od %A %OI:%OM:%OS %p %Z",
		"%a %d-%m-%Y %T %Z",
		"%e-%n-%Y",
		"%d. %b %Y",
		"kl %H.%M %Z",
		"%d. %b %Y kl %H.%M %Z",
		"%a %-e %b %Y %T %Z",
		"%a %b %-e %H:%M:%S %Z %Y",
		"%Od-%Om-%Oy",
		"%Oe %B %Oy %OI:%OM:%OS %p %Z",
		"%d %B %Y %A",
		"%P %I:%M:%S",
		"و %H:%M:%S %Z ت %d %B %Y",
		"%A, %e 'de' %B 'de' %Y",
		"%a %d %b %Y %T %z",
		"%A %-e %B %Y, %H:%M:%S %z",
		"%e %B %Y %A г.",
		"%a, %b %e. b. %Y %T %Z",
		"%A, %B %d. b. %Y %H:%M:%S %Z",
		"%p %I:%M:%S",
		"%Y-%m-%d %H:%M:%S %z",
		"%Y %B %e වැනි %A %H:%M:%S %z",
		"%e. %n. %Y",
		"%d. %m. %Y",
		"%Y-%b-%d",
		"%I.%M.%S. %Z",
		"%I.%M.%S.%p %Z",
		"%Y-%b-%d %I.%M.%S.%p %Z",
		"%d.%m.%Y.",
		"%A, %d. %B %Y. %T %Z",
		"%a, %e. %b %Y.  %H:%M:%S %Z",
		"%a %e %b %Y %H.%M.%S",
		"'den' %e %B %Y",
		"'de'n %e %B %Y",
		"%B %d %A %Y",
		"%p%I.%M.%S %Z",
		"%B %d %A %Y %p%I.%M.%S %Z",
		"%e %B %Y",
		"%A፡ %B %e መዓልቲ %Y %r %Z",
		"%A፡ %B %e መዓልቲ %r %Z %Y ዓ/ም",
		"%A፣ %B %e መዓልቲ %Y %r %Z",
		"%A፣ %B %e መዓልቲ %r %Z %Y ዓ/ም",
		"%e %B %Y p.",
		"%T, %d %B, %Y yil, %A",
		"%d %B, %Y yil, %A",
		"%I:%M %p",
		"%A, %d %B Năm %Y %T %Z",
		"%A, %d %B năm %Y %T %Z",
		"Li %A %d di %B %Y %T %Z",
		"%H时%M分%S秒",
		"%p %I时%M分%S秒",
		"%Y年%m月%d日 %A %H时%M分%S秒",
		"%Y年 %m月 %d日 %A %H:%M:%S %Z",
		"%Y/%n/%e",
		"%Y年%m月%d日 %A",
		"%I時%M分%S秒 %Z",
		"%Y年%m月%d日 %A %H:%M:%S",
		"%H时%M分%S秒 %Z",
		"%Y年%m月%d日 %H时%M分%S秒 %Z",
		"西元%Y年%m月%d日",
		"%p %I時%M分%S秒",
		"西元%Y年%m月%d日 (%A) %H時%M分%S秒",
	];
	nexacro.Locale._localeInfo_idx = {
		aa_dj: [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 2, 3, 4, 5, 0, 0, 0, 0], aa_er: [1, 1, 1, 1, 0, 2, 2, 2, 3, 3, 0, 1, 2, 3, 6, 7, 0, 0, 0, 0],
		aa_et: [2, 0, 2, 1, 0, 2, 2, 0, 4, 4, 0, 1, 2, 3, 6, 7, 0, 0, 0, 0], af: [2, 0, 3, 1, 3, 4, 4, 5, 6, 6, 1, 1, 8, 0, 9, 10, 11, 12, 0, 0],
		ar_ae: [3, 2, 4, 2, 5, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1], ar_bh: [3, 2, 5, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_dz: [3, 2, 6, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 18, 0, -1], ar_eg: [3, 2, 7, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_in: [4, 1, 8, 3, 7, 6, 6, 7, 8, 8, 2, 19, 20, 21, 22, 0, 0, 0, 0, -1], ar_iq: [3, 2, 9, 2, 7, 6, 6, 9, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_jo: [3, 2, 10, 2, 7, 7, 7, 10, 10, 10, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1], ar_kw: [3, 2, 11, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_lb: [3, 2, 12, 2, 7, 7, 7, 10, 10, 10, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1], ar_ly: [3, 2, 13, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_ma: [3, 2, 14, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 18, 0, -1], ar_om: [3, 2, 15, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_qa: [3, 2, 16, 2, 7, 6, 6, 7, 11, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1], ar: [5, 3, 17, 4, 8, 9, 9, 12, 13, 13, 3, 23, 24, 24, 25, 10, 26, 1, 0, -1],
		ar_sd: [3, 2, 18, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 27, 0, -1], ar_sy: [3, 2, 19, 2, 7, 7, 7, 14, 14, 14, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		ar_tn: [3, 2, 20, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 18, 0, -1], ar_ye: [3, 2, 21, 2, 7, 6, 6, 7, 8, 8, 2, 13, 14, 15, 16, 10, 17, 1, 0, -1],
		as: [6, 1, 22, 3, 10, 11, 11, 15, 16, 16, 4, 28, 29, 29, 30, 0, 31, 18, 0, 0], az: [7, 4, 23, 0, 12, 13, 13, 17, 18, 18, 3, 32, 8, 0, 33, 0, 17, 27, 0, 0],
		be: [8, 4, 24, 0, 14, 15, 15, 19, 20, 20, 3, 32, 8, 0, 34, 10, 35, 32, 0, 0], bg: [8, 4, 25, 5, 16, 17, 17, 21, 22, 22, 3, 36, 37, 38, 39, 10, 40, 41, 1, 0],
		bn_bd: [6, 1, 26, 3, 18, 19, 19, 23, 24, 24, 5, 42, 20, 21, 43, 0, 0, 0, 0, 0], bn: [6, 1, 27, 3, 18, 20, 20, 23, 23, 23, 5, 42, 20, 21, 43, 0, 0, 0, 0, 0],
		br: [9, 4, 28, 6, 21, 22, 22, 25, 26, 26, 6, 32, 8, 44, 45, 0, 0, 0, 0, 0], bs: [9, 1, 29, 6, 23, 24, 24, 27, 28, 28, 3, 32, 8, 0, 34, 0, 0, 0, 0, 0],
		ca_ad: [9, 1, 28, 7, 25, 26, 26, 29, 30, 30, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0], ca: [10, 4, 28, 7, 25, 26, 26, 29, 30, 30, 3, 46, 8, 0, 9, 10, 47, 1, 0, 0],
		ca_fr: [9, 1, 28, 7, 25, 26, 26, 29, 30, 30, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0], ca_it: [9, 1, 28, 7, 25, 26, 26, 29, 30, 30, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0],
		cs: [11, 4, 30, 5, 27, 28, 28, 31, 32, 32, 3, 32, 48, 49, 50, 10, 51, 52, 1, 0], cy: [2, 0, 31, 1, 29, 30, 30, 33, 34, 34, 7, 53, 8, 54, 55, 10, 0, 0, 0, 0],
		da: [7, 5, 32, 7, 31, 32, 32, 35, 36, 36, 3, 18, 8, 0, 9, 10, 51, 18, 0, 0], de_at: [10, 1, 28, 7, 33, 34, 34, 37, 38, 38, 3, 27, 8, 0, 9, 10, 56, 32, 0, 0],
		de_be: [7, 6, 28, 7, 33, 34, 34, 39, 40, 40, 3, 27, 8, 0, 9, 10, 0, 0, 0, 0], de_ch: [12, 6, 33, 8, 33, 34, 34, 39, 40, 40, 3, 27, 8, 0, 9, 10, 56, 32, 0, 0],
		de: [7, 4, 28, 7, 33, 35, 35, 39, 40, 40, 3, 32, 8, 0, 9, 57, 56, 32, 1, 0], de_lu: [7, 4, 28, 7, 33, 35, 35, 39, 40, 40, 3, 27, 8, 0, 9, 10, 56, 32, 0, 0],
		dz: [13, 6, 34, 3, 36, 37, 37, 41, 42, 42, 8, 58, 59, 60, 61, 0, 0, 0, 0, 0], el_cy: [14, 7, 35, 9, 38, 39, 39, 43, 44, 44, 9, 1, 62, 63, 4, 4, 0, 0, 0, 0],
		el: [14, 4, 28, 9, 38, 39, 39, 43, 44, 44, 9, 1, 62, 63, 4, 4, 64, 65, 0, 0], en_au: [2, 0, 36, 1, 40, 9, 9, 45, 13, 13, 7, 46, 8, 63, 9, 10, 64, 65, 0, 0],
		en_bw: [2, 0, 37, 1, 40, 9, 9, 45, 13, 13, 3, 1, 8, 0, 9, 10, 0, 0, 0, 0], en_ca: [2, 0, 38, 1, 40, 9, 9, 45, 13, 13, 7, 46, 62, 63, 4, 10, 66, 1, 0, 0],
		en_dk: [7, 0, 39, 7, 40, 9, 9, 45, 13, 13, 3, 27, 8, 0, 67, 10, 0, 0, 0, 0], en_gb: [2, 0, 31, 1, 40, 9, 9, 45, 13, 13, 7, 46, 8, 54, 9, 10, 11, 1, 0, 0],
		en_gh: [2, 0, 40, 1, 40, 9, 9, 45, 13, 13, 7, 46, 8, 54, 9, 10, 11, 1, 0, 0], en_hk: [4, 0, 41, 2, 40, 9, 9, 45, 13, 13, 7, 68, 69, 70, 71, 0, 0, 0, 0, 0],
		en_ie: [2, 0, 28, 1, 40, 9, 9, 45, 13, 13, 3, 46, 8, 0, 9, 10, 11, 1, 0, 0], en_in: [6, 1, 42, 3, 40, 9, 9, 45, 13, 13, 7, 19, 20, 21, 22, 0, 11, 18, 0, 0],
		en_jm: [2, 0, 43, 1, 40, 9, 9, 45, 13, 13, 7, 1, 62, 63, 4, 72, 73, 65, 0, 0], en_nz: [2, 0, 44, 1, 40, 9, 9, 45, 13, 13, 7, 46, 8, 74, 9, 10, 64, 75, 0, 0],
		en_nl: [2, 0, 28, 1, 40, 9, 9, 45, 13, 13, 7, 1, 62, 63, 4, 72, 73, 65, 0, 0], en_ph: [4, 0, 45, 2, 40, 9, 9, 45, 13, 13, 7, 76, 20, 21, 77, 0, 78, 79, 0, 0],
		en_sg: [4, 0, 46, 2, 40, 9, 9, 45, 13, 13, 7, 80, 20, 21, 81, 0, 64, 75, 0, 0], en: [2, 0, 47, 1, 40, 9, 9, 45, 13, 13, 7, 82, 62, 63, 4, 10, 83, 79, 0, 0],
		en_za: [15, 0, 3, 1, 40, 9, 9, 45, 13, 13, 3, 1, 8, 0, 9, 10, 11, 12, 0, 0], en_zw: [2, 0, 48, 1, 40, 9, 9, 45, 13, 13, 3, 1, 8, 0, 9, 10, 83, 79, 0, 0],
		es_419: [7, 1, 49, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 84, 1, 0, 0], es_ar: [7, 1, 50, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_bo: [10, 1, 51, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_cl: [10, 1, 52, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 18, 0, 0],
		es_co: [10, 1, 53, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_cr: [10, 1, 54, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_do: [0, 1, 55, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_ec: [10, 1, 47, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es: [10, 4, 28, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_gt: [0, 1, 56, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_hn: [2, 8, 57, 10, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_mx: [0, 1, 58, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_ni: [0, 1, 59, 1, 41, 42, 42, 46, 47, 47, 7, 46, 8, 63, 9, 10, 85, 1, 0, 0], es_pa: [0, 1, 60, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_pe: [0, 8, 61, 1, 41, 42, 42, 46, 47, 47, 7, 46, 8, 63, 9, 10, 85, 1, 0, 0], es_pr: [0, 1, 47, 10, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_py: [10, 1, 62, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], es_sv: [0, 1, 63, 10, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_us: [16, 0, 47, 1, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 83, 79, 0, 0], es_uy: [10, 1, 64, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0],
		es_ve: [9, 1, 65, 7, 41, 42, 42, 46, 47, 47, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0], et: [11, 4, 66, 5, 43, 44, 44, 48, 49, 49, 3, 32, 8, 0, 9, 10, 86, 36, 0, 0],
		eu: [10, 4, 28, 7, 45, 46, 46, 50, 51, 51, 3, 87, 8, 0, 88, 10, 89, 12, 0, 0], fa: [17, 4, 67, 11, 47, 47, 47, 52, 52, 52, 3, 90, 91, 0, 92, 93, 0, 0, 0, -1],
		fi: [11, 9, 28, 5, 48, 49, 49, 53, 54, 54, 3, 32, 8, 0, 94, 95, 51, 52, 1, 0], fo: [7, 5, 32, 7, 50, 51, 51, 55, 56, 56, 3, 96, 8, 0, 9, 10, 51, 28, 0, 0],
		fr_be: [10, 8, 28, 7, 52, 53, 53, 57, 58, 58, 3, 46, 8, 0, 9, 10, 97, 75, 0, 0], fr_ca: [18, 4, 38, 6, 52, 53, 53, 57, 58, 58, 3, 27, 8, 0, 9, 10, 35, 27, 0, 0],
		fr_ch: [19, 6, 68, 8, 52, 53, 53, 57, 58, 58, 3, 98, 8, 0, 9, 10, 97, 32, 0, 0], fr: [18, 4, 28, 6, 52, 53, 53, 57, 58, 58, 3, 32, 8, 0, 9, 10, 97, 1, 0, 0],
		fr_lu: [18, 4, 28, 6, 52, 53, 53, 57, 58, 58, 3, 32, 8, 0, 9, 10, 97, 1, 0, 0], fy: [9, 2, 28, 6, 54, 55, 55, 59, 60, 60, 3, 99, 8, 0, 9, 10, 0, 0, 0, 0],
		ga: [2, 0, 28, 1, 56, 57, 57, 61, 62, 62, 3, 53, 8, 0, 9, 10, 0, 0, 0, 0], gd: [2, 0, 31, 1, 58, 59, 59, 63, 64, 64, 3, 46, 8, 0, 9, 0, 0, 0, 0, 0],
		gl: [10, 4, 28, 7, 60, 61, 61, 65, 66, 66, 3, 46, 8, 0, 9, 10, 85, 1, 0, 0], gu: [6, 8, 69, 3, 62, 63, 63, 67, 68, 68, 10, 42, 20, 21, 43, 10, 11, 99, 0, 0],
		gv: [2, 0, 31, 1, 64, 65, 65, 69, 70, 70, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0], he: [2, 10, 70, 1, 66, 67, 67, 71, 72, 72, 7, 46, 48, 100, 101, 10, 19, 1, 0, -1],
		hi: [6, 8, 71, 2, 68, 69, 69, 73, 73, 73, 11, 42, 20, 21, 43, 10, 11, 18, 0, 0], hr: [10, 4, 72, 7, 23, 24, 24, 74, 75, 75, 3, 32, 8, 0, 34, 10, 102, 103, 0, 0],
		hu: [8, 4, 73, 6, 70, 71, 71, 76, 77, 77, 3, 27, 104, 104, 105, 105, 106, 107, 0, 0], hy: [2, 4, 74, 1, 72, 73, 73, 78, 79, 79, 3, 108, 62, 0, 4, 0, 109, 32, 0, 0],
		id: [7, 0, 75, 7, 74, 75, 75, 80, 81, 81, 3, 46, 8, 0, 4, 10, 11, 1, 0, 0], is: [20, 4, 76, 7, 76, 77, 77, 82, 83, 83, 12, 110, 8, 0, 111, 10, 51, 52, 0, 0],
		it_ch: [12, 6, 33, 8, 78, 79, 79, 84, 85, 85, 3, 98, 8, 0, 9, 10, 112, 32, 0, 0], it: [10, 1, 28, 7, 78, 80, 80, 84, 85, 85, 3, 1, 8, 0, 9, 10, 97, 1, 0, 0],
		iw: [2, 10, 77, 1, 66, 67, 67, 71, 72, 72, 7, 46, 48, 100, 101, 10, 0, 0, 0, -1], ja: [17, 11, 78, 2, 81, 82, 82, 86, 87, 87, 13, 113, 114, 115, 116, 0, 117, 12, 0, 0],
		ka: [8, 4, 79, 7, 83, 84, 84, 88, 89, 89, 3, 82, 8, 0, 118, 0, 119, 32, 0, 0], kk: [8, 0, 80, 12, 85, 86, 86, 90, 91, 91, 3, 32, 8, 0, 34, 10, 120, 32, 0, 0],
		kl: [7, 5, 81, 7, 87, 88, 88, 92, 36, 36, 3, 121, 8, 0, 9, 10, 0, 0, 0, 0], km: [4, 12, 82, 0, 89, 90, 90, 93, 94, 94, 14, 35, 48, 63, 122, 123, 0, 0, 0, 0],
		kn: [6, 8, 83, 2, 91, 92, 92, 95, 96, 96, 15, 42, 20, 21, 43, 10, 11, 99, 0, 0], ko: [21, 0, 84, 1, 93, 94, 94, 97, 98, 98, 16, 124, 125, 126, 127, 128, 129, 27, 0, 0],
		ku: [7, 4, 85, 7, 95, 96, 96, 99, 100, 100, 3, 1, 8, 0, 130, 19, 0, 0, 0, 0], kw: [2, 0, 31, 1, 97, 98, 98, 101, 102, 102, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0],
		ky: [8, 4, 86, 12, 99, 100, 100, 103, 104, 104, 3, 32, 8, 0, 34, 131, 132, 53, 0, 0], lg: [2, 12, 87, 1, 101, 102, 102, 105, 106, 106, 3, 46, 8, 0, 9, 10, 0, 0, 0, 0],
		lo: [4, 5, 88, 1, 103, 104, 104, 107, 108, 108, 7, 133, 48, 63, 134, 135, 0, 0, 0, 0], lt: [7, 4, 89, 7, 105, 106, 106, 109, 110, 110, 3, 136, 8, 0, 137, 10, 138, 136, 0, 0],
		lv: [11, 13, 90, 5, 107, 108, 108, 111, 112, 112, 3, 107, 8, 0, 139, 10, 140, 107, 0, 0], mg: [9, 4, 91, 6, 109, 110, 110, 113, 114, 114, 3, 32, 8, 0, 9, 10, 0, 0, 0, 0],
		mi: [2, 0, 44, 1, 111, 112, 112, 115, 116, 116, 3, 46, 8, 0, 141, 0, 0, 0, 0, 0], mk: [7, 4, 92, 7, 113, 114, 114, 117, 118, 118, 3, 32, 8, 0, 142, 143, 73, 32, 0, 0],
		ml: [6, 8, 93, 3, 115, 116, 116, 119, 120, 120, 17, 19, 20, 21, 22, 0, 11, 99, 0, 0], mn: [7, 4, 94, 0, 117, 118, 118, 121, 122, 122, 3, 136, 8, 0, 144, 145, 0, 0, 0, 0],
		mr: [6, 8, 95, 2, 119, 120, 120, 123, 123, 123, 18, 42, 20, 21, 43, 10, 11, 18, 0, 0], ms: [4, 14, 96, 2, 121, 122, 122, 124, 125, 125, 3, 42, 20, 21, 43, 0, 64, 75, 0, 0],
		mt: [4, 0, 97, 2, 123, 124, 124, 126, 127, 127, 3, 146, 20, 21, 147, 10, 148, 1, 0, 0], my: [2, 12, 98, 1, 125, 126, 126, 128, 129, 129, 19, 149, 150, 150, 151, 152, 149, 18, 1, 0],
		nb: [8, 15, 99, 6, 31, 32, 32, 130, 56, 56, 3, 18, 8, 0, 153, 10, 51, 32, 0, 0], ne: [6, 1, 71, 2, 127, 128, 128, 73, 73, 73, 11, 42, 20, 21, 43, 10, 68, 79, 0, 0],
		nl_be: [10, 8, 28, 7, 129, 130, 130, 131, 132, 132, 3, 99, 8, 0, 9, 10, 97, 65, 0, 0], nl: [0, 16, 28, 7, 129, 130, 130, 131, 132, 132, 3, 99, 8, 0, 9, 10, 97, 154, 0, 0],
		nn: [8, 17, 99, 13, 131, 132, 132, 130, 56, 56, 3, 155, 156, 0, 157, 10, 51, 32, 0, 0], no: [7, 11, 99, 7, 31, 32, 32, 130, 56, 56, 3, 18, 8, 0, 153, 10, 0, 0, 0, 0],
		nr: [2, 0, 3, 1, 133, 134, 134, 133, 134, 134, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0], oc: [9, 4, 28, 6, 135, 136, 136, 135, 136, 136, 3, 32, 8, 0, 9, 0, 0, 0, 0, 0],
		om: [2, 0, 2, 1, 137, 138, 138, 137, 138, 138, 20, 1, 2, 3, 6, 7, 0, 0, 0, 0], om_ke: [2, 0, 100, 1, 137, 138, 138, 137, 138, 138, 20, 1, 2, 3, 6, 7, 0, 0, 0, 0],
		or: [6, 8, 101, 3, 139, 140, 140, 139, 140, 140, 7, 160, 150, 150, 161, 0, 11, 99, 0, 0], pa: [6, 8, 102, 2, 141, 142, 142, 141, 141, 141, 21, 42, 20, 21, 43, 10, 162, 99, 0, 0],
		pa_pk: [2, 18, 103, 1, 143, 143, 143, 142, 142, 142, 22, 1, 48, 163, 164, 0, 0, 0, 0, 0], pl: [18, 4, 104, 7, 144, 145, 145, 143, 144, 144, 3, 27, 8, 0, 9, 10, 35, 27, 0, 0],
		pt_br: [10, 1, 105, 7, 146, 147, 147, 145, 146, 146, 3, 18, 8, 0, 9, 10, 165, 1, 0, 0], pt: [10, 4, 28, 7, 146, 147, 147, 147, 146, 146, 3, 18, 8, 0, 9, 10, 165, 18, 0, 0],
		ro: [7, 4, 106, 7, 148, 149, 149, 148, 149, 149, 3, 32, 8, 0, 166, 167, 35, 32, 0, 0], ru: [22, 12, 107, 14, 150, 151, 151, 150, 151, 151, 3, 32, 8, 0, 34, 10, 168, 32, 0, 0],
		ru_ua: [22, 4, 108, 0, 150, 152, 152, 150, 151, 151, 3, 32, 8, 0, 34, 10, 0, 0, 0, 0], rw: [23, 4, 109, 7, 153, 154, 154, 152, 153, 153, 3, 32, 8, 0, 9, 10, 0, 0, 0, 0],
		se: [7, 11, 110, 7, 155, 156, 156, 154, 155, 155, 3, 27, 8, 0, 169, 170, 0, 0, 0, 0], si: [4, 1, 111, 2, 157, 158, 158, 156, 157, 157, 23, 27, 48, 171, 172, 173, 0, 0, 0, 0],
		sk: [11, 4, 112, 5, 159, 160, 160, 158, 159, 159, 3, 32, 48, 49, 50, 10, 35, 174, 0, 0], sl: [10, 4, 28, 7, 161, 162, 162, 160, 161, 161, 3, 175, 8, 0, 9, 10, 35, 52, 0, 0],
		so_dj: [0, 0, 0, 0, 163, 164, 164, 162, 163, 163, 24, 32, 2, 3, 4, 5, 0, 0, 0, 0], so_et: [2, 0, 2, 1, 163, 165, 165, 164, 165, 165, 24, 1, 2, 3, 6, 7, 0, 0, 0, 0],
		so_ke: [2, 0, 2, 1, 163, 165, 165, 164, 165, 165, 24, 1, 2, 3, 6, 7, 0, 0, 0, 0], so: [2, 0, 113, 1, 163, 165, 165, 164, 165, 165, 24, 1, 2, 3, 6, 7, 0, 0, 0, 0],
		sq: [24, 0, 114, 9, 166, 167, 167, 166, 167, 167, 25, 176, 177, 178, 179, 10, 0, 0, 0, 0], sr_me: [9, 4, 28, 7, 168, 169, 169, 168, 169, 169, 3, 180, 8, 8, 181, 182, 0, 0, 0, 0],
		sr: [9, 4, 115, 7, 170, 171, 171, 168, 169, 169, 3, 180, 8, 8, 181, 182, 0, 0, 0, 0], ss: [2, 0, 3, 1, 172, 173, 173, 170, 171, 171, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0],
		st: [2, 0, 3, 1, 174, 175, 175, 172, 173, 173, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0], sv_fi: [11, 9, 28, 5, 176, 177, 177, 174, 36, 36, 3, 27, 104, 0, 183, 10, 184, 52, 1, 0],
		sv: [8, 4, 116, 7, 176, 177, 177, 174, 36, 36, 3, 27, 104, 0, 183, 10, 185, 27, 1, 0], ta: [6, 8, 117, 3, 178, 179, 179, 175, 176, 176, 26, 19, 20, 21, 22, 0, 11, 18, 0, 0],
		te: [6, 8, 118, 3, 180, 181, 181, 177, 177, 177, 27, 186, 187, 187, 188, 0, 11, 99, 0, 0], tg: [7, 4, 119, 0, 150, 151, 151, 178, 151, 151, 3, 32, 8, 0, 34, 0, 0, 0, 0, 0],
		th: [4, 11, 120, 2, 182, 183, 183, 179, 180, 180, 7, 133, 48, 63, 134, 135, 189, 65, 0, 0], ti_er: [1, 1, 1, 1, 184, 185, 185, 181, 182, 182, 28, 1, 2, 3, 190, 191, 0, 0, 0, 0],
		ti: [2, 0, 2, 1, 184, 185, 185, 183, 184, 184, 28, 1, 2, 3, 192, 193, 0, 0, 0, 0], tl: [2, 19, 121, 1, 186, 187, 187, 185, 186, 186, 7, 108, 62, 63, 4, 0, 0, 0, 0, 0],
		tn: [2, 0, 3, 1, 188, 189, 189, 187, 188, 188, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0], tr_cy: [7, 4, 85, 7, 190, 191, 191, 189, 190, 190, 29, 18, 8, 63, 9, 10, 0, 0, 0, 0],
		tr: [7, 4, 122, 7, 190, 191, 191, 189, 190, 190, 29, 18, 8, 63, 9, 10, 162, 32, 0, 0], ts: [2, 0, 3, 1, 192, 193, 193, 191, 192, 192, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0],
		tt: [22, 4, 107, 6, 194, 195, 195, 178, 151, 151, 3, 32, 8, 0, 34, 0, 35, 32, 0, 0], uk: [8, 12, 123, 6, 196, 197, 197, 193, 194, 194, 3, 32, 8, 0, 34, 10, 194, 32, 0, 0],
		ur: [2, 18, 103, 1, 143, 143, 143, 142, 142, 142, 22, 1, 48, 163, 164, 0, 0, 0, 0, -1], uz: [2, 0, 124, 1, 198, 199, 199, 195, 196, 196, 3, 46, 8, 0, 195, 196, 0, 0, 0, 0],
		ve: [2, 0, 3, 1, 200, 201, 201, 197, 198, 198, 3, 1, 8, 0, 9, 10, 0, 0, 0, 0], vi: [7, 4, 125, 7, 202, 203, 203, 199, 200, 200, 7, 1, 8, 197, 198, 199, 11, 1, 0, 0],
		wa: [10, 4, 28, 7, 204, 205, 205, 201, 202, 202, 7, 1, 48, 63, 200, 0, 0, 0, 0, 0], xh: [2, 0, 3, 1, 206, 207, 207, 203, 204, 204, 3, 1, 8, 0, 158, 159, 0, 0, 0, 0],
		yi: [2, 10, 47, 1, 208, 209, 209, 205, 206, 206, 7, 46, 48, 100, 101, 0, 0, 0, 0, 0], zh: [4, 11, 126, 2, 210, 211, 211, 207, 87, 87, 30, 113, 201, 202, 203, 204, 117, 205, 0, 0],
		zh_hk: [4, 0, 41, 2, 210, 211, 211, 207, 86, 86, 30, 206, 207, 171, 208, 10, 117, 65, 0, 0], zh_sg: [4, 0, 46, 2, 210, 210, 210, 207, 207, 207, 30, 113, 209, 0, 210, 0, 117, 65, 0, 0],
		zh_tw: [4, 0, 127, 2, 212, 211, 211, 207, 87, 87, 30, 211, 114, 212, 213, 10, 117, 205, 0, 0],
	};
	nexacro.Locale._locale_ref = {
		aa_dj: "aa_dj", aa_er: "aa_er", aa_et: "aa_et", af: "af", af_za: "af", ar_ae: "ar_ae", ar_bh: "ar_bh", ar_dz: "ar_dz", ar_eg: "ar_eg", ar_in: "ar_in",
		ar_iq: "ar_iq", ar_jo: "ar_jo", ar_kw: "ar_kw", ar_lb: "ar_lb", ar_ly: "ar_ly", ar_ma: "ar_ma", ar_om: "ar_om", ar_qa: "ar_qa", ar: "ar", ar_sa: "ar",
		ar_sd: "ar_sd", ar_sy: "ar_sy", ar_tn: "ar_tn", ar_ye: "ar_ye", as: "as", as_in: "as", az: "az", az_az: "az", be: "be", be_by: "be",
		bg: "bg", bg_bg: "bg", bn_bd: "bn_bd", bn: "bn", bn_in: "bn", br: "br", br_fr: "br", bs: "bs", bs_ba: "bs", ca_ad: "ca_ad",
		ca: "ca", ca_es: "ca", ca_fr: "ca_fr", ca_it: "ca_it", cs: "cs", cs_cz: "cs", cy: "cy", cy_gb: "cy", da: "da", da_dk: "da",
		de_at: "de_at", de_be: "de_be", de_ch: "de_ch", de: "de", de_de: "de", de_lu: "de_lu", dz: "dz", dz_bt: "dz", el_cy: "el_cy", el: "el",
		el_gr: "el", en_au: "en_au", en_bw: "en_bw", en_ca: "en_ca", en_dk: "en_dk", en_gb: "en_gb", en_gh: "en_gh", en_hk: "en_hk", en_ie: "en_ie", en_in: "en_in",
		en_jm: "en_jm", en_nz: "en_nz", en_nl: "en_nl", en_ph: "en_ph", en_sg: "en_sg", en: "en", en_us: "en", en_za: "en_za", en_zw: "en_zw", es_419: "es_419",
		es_ar: "es_ar", es_bo: "es_bo", es_cl: "es_cl", es_co: "es_co", es_cr: "es_cr", es_do: "es_do", es_ec: "es_ec", es: "es", es_es: "es", es_gt: "es_gt",
		es_hn: "es_hn", es_mx: "es_mx", es_ni: "es_ni", es_pa: "es_pa", es_pe: "es_pe", es_pr: "es_pr", es_py: "es_py", es_sv: "es_sv", es_us: "es_us", es_uy: "es_uy",
		es_ve: "es_ve", et: "et", et_ee: "et", eu: "eu", eu_es: "eu", fa: "fa", fa_ir: "fa", fi: "fi", fi_fi: "fi", fo: "fo",
		fo_fo: "fo", fr_be: "fr_be", fr_ca: "fr_ca", fr_ch: "fr_ch", fr: "fr", fr_fr: "fr", fr_lu: "fr_lu", fy: "fy", fy_nl: "fy", ga: "ga",
		ga_ie: "ga", gd: "gd", gd_gb: "gd", gl: "gl", gl_es: "gl", gu: "gu", gu_in: "gu", gv: "gv", gv_gb: "gv", he: "he",
		he_il: "he", hi: "hi", hi_in: "hi", hr: "hr", hr_hr: "hr", hu: "hu", hu_hu: "hu", hy: "hy", hy_am: "hy", id: "id",
		id_id: "id", is: "is", is_is: "is", it_ch: "it_ch", it: "it", it_it: "it", iw: "iw", iw_il: "iw", ja: "ja", ja_jp: "ja",
		ka: "ka", ka_ge: "ka", kk: "kk", kk_kz: "kk", kl: "kl", kl_gl: "kl", km: "km", km_kh: "km", kn: "kn", kn_in: "kn",
		ko: "ko", ko_kr: "ko", ku: "ku", ku_tr: "ku", kw: "kw", kw_gb: "kw", ky: "ky", ky_kg: "ky", lg: "lg", lg_ug: "lg",
		lo: "lo", lo_la: "lo", lt: "lt", lt_lt: "lt", lv: "lv", lv_lv: "lv", mg: "mg", mg_mg: "mg", mi: "mi", mi_nz: "mi",
		mk: "mk", mk_mk: "mk", ml: "ml", ml_in: "ml", mn: "mn", mn_mn: "mn", mr: "mr", mr_in: "mr", ms: "ms", ms_my: "ms",
		mt: "mt", mt_mt: "mt", my: "my", my_mm: "my", nb: "nb", nb_no: "nb", ne: "ne", ne_np: "ne", nl_be: "nl_be", nl: "nl",
		nl_nl: "nl", nn: "nn", nn_no: "nn", no: "no", no_no: "no", nr: "nr", nr_za: "nr", oc: "oc", oc_fr: "oc", om: "om",
		om_et: "om", om_ke: "om_ke", or: "or", or_in: "or", pa: "pa", pa_in: "pa", pa_pk: "pa_pk", pl: "pl", pl_pl: "pl", pt_br: "pt_br",
		pt: "pt", pt_pt: "pt", ro: "ro", ro_ro: "ro", ru: "ru", ru_ru: "ru", ru_ua: "ru_ua", rw: "rw", rw_rw: "rw", se: "se",
		se_no: "se", si: "si", si_lk: "si", sk: "sk", sk_sk: "sk", sl: "sl", sl_si: "sl", so_dj: "so_dj", so_et: "so_et", so_ke: "so_ke",
		so: "so", so_so: "so", sq: "sq", sq_al: "sq", sr_me: "sr_me", sr: "sr", sr_rs: "sr", ss: "ss", ss_za: "ss", st: "st",
		st_za: "st", sv_fi: "sv_fi", sv: "sv", sv_se: "sv", ta: "ta", ta_in: "ta", te: "te", te_in: "te", tg: "tg", tg_tj: "tg",
		th: "th", th_th: "th", ti_er: "ti_er", ti: "ti", ti_et: "ti", tl: "tl", tl_ph: "tl", tn: "tn", tn_za: "tn", tr_cy: "tr_cy",
		tr: "tr", tr_tr: "tr", ts: "ts", ts_za: "ts", tt: "tt", tt_ru: "tt", uk: "uk", uk_ua: "uk", ur: "ur", ur_pk: "ur",
		uz: "uz", uz_uz: "uz", ve: "ve", ve_za: "ve", vi: "vi", vi_vn: "vi", wa: "wa", wa_be: "wa", xh: "xh", xh_za: "xh",
		yi: "yi", yi_us: "yi", zh: "zh", zh_cn: "zh", zh_hk: "zh_hk", zh_sg: "zh_sg", zh_tw: "zh_tw",
	};

	nexacro.Locale.getLocaleInfo = function (loc_id, default_flag)
	{
		if (loc_id)
		{
			loc_id = loc_id.toLowerCase().replace(/-/g, "_");
			var ref_id = nexacro.Locale._locale_ref[loc_id];
			if (ref_id) 
			{
				var locale = nexacro.Locale[ref_id];
				if (locale)
					return locale;
				locale = nexacro.Locale._makeLocaleInfo(ref_id);
				return locale;
			}
			if (default_flag)
			{
				return nexacro.Locale.getLocaleInfo("en");
			}
			else
			{
				return nexacro.Locale.getLocaleInfo(nexacro._getLocale(), true);
			}
		}
		// return systemlocale??
		return nexacro.Locale.getLocaleInfo(nexacro._getLocale());
	};

	nexacro.Locale._makeLocaleInfo = function (loc_id)
	{
		var idx_arr = nexacro.Locale._localeInfo_idx[loc_id];
		if (idx_arr)
		{
			var loc = {};
			// numBase
			var data = nexacro.Locale._localeInfo_numData[idx_arr[0]];
			loc.decimal_point = data[1];
			loc.thousands_sep = data[2];
			loc.grouping = data[3];
			loc.positive_sign = data[4];
			loc.negative_sign = data[5];
			loc.int_frac_digits = data[6];
			loc.frac_digits = data[7];
			// numOpt
			data = nexacro.Locale._localeInfo_numData2[idx_arr[1]];
			loc.p_cs_precedes = data[1];
			loc.p_sep_by_space = data[2];
			loc.n_cs_precedes = data[3];
			loc.n_sep_by_space = data[4];
			loc.p_sign_posn = data[5];
			loc.n_sign_posn = data[6];

			// curSym
			data = nexacro.Locale._localeInfo_curSymbolData[idx_arr[2]];
			loc.int_curr_symbol = data[1];
			loc.currency_symbol = data[2];
			// curOpt
			data = nexacro.Locale._localeInfo_curData[idx_arr[3]];
			loc.mon_decimal_point = data[1];
			loc.mon_thousands_sep = data[2];
			loc.mon_grouping = data[3];

			// weekdayName
			loc.weekday_names_long = nexacro.Locale._localeInfo_weeknameData[idx_arr[4]];
			loc.weekday_names_short = nexacro.Locale._localeInfo_weeknameData[idx_arr[5]];
			loc.weekday_names_narrow = nexacro.Locale._localeInfo_weeknameData[idx_arr[6]];
			// monthName
			loc.month_names_long = nexacro.Locale._localeInfo_monthnameData[idx_arr[7]];
			loc.month_names_short = nexacro.Locale._localeInfo_monthnameData[idx_arr[8]];
			loc.month_names_narrow = nexacro.Locale._localeInfo_monthnameData[idx_arr[9]];
			// ampmName
			loc.ampm = nexacro.Locale._localeInfo_ampmData[idx_arr[10]];

			// format
			loc.date_format = nexacro.Locale._localeInfo_formatData[idx_arr[11]];
			loc.time_format = nexacro.Locale._localeInfo_formatData[idx_arr[12]];
			loc.time_format_ampm = nexacro.Locale._localeInfo_formatData[idx_arr[13]];
			loc.date_time_format = nexacro.Locale._localeInfo_formatData[idx_arr[14]];
			loc.full_date_time_format = nexacro.Locale._localeInfo_formatData[idx_arr[15]];
			loc.longdate_format = nexacro.Locale._localeInfo_formatData[idx_arr[16]];
			loc.shortdate_format = nexacro.Locale._localeInfo_formatData[idx_arr[17]];

			//
			loc.first_weekday = idx_arr[18];
			loc.direction = idx_arr[19] < 0 ? "rtl" : "ltr";

			return loc;
		}
		return null;
	};

	nexacro.Locale._replaceLocaleDigits = function (locale, str)
	{
		var locale_info = nexacro.Locale.getLocaleInfo(locale);

		if (locale_info.locale_digits)
		{
			var locale_digits = locale_info.locale_digits;

			str = str.replace(/0/g, locale_digits[0]);
			str = str.replace(/1/g, locale_digits[1]);
			str = str.replace(/2/g, locale_digits[2]);
			str = str.replace(/3/g, locale_digits[3]);
			str = str.replace(/4/g, locale_digits[4]);
			str = str.replace(/5/g, locale_digits[5]);
			str = str.replace(/6/g, locale_digits[6]);
			str = str.replace(/7/g, locale_digits[7]);
			str = str.replace(/8/g, locale_digits[8]);
			str = str.replace(/9/g, locale_digits[9]);
		}
		return str;
	};

	nexacro.Locale._makeDateMaskString = function (locale, opt)
	{
		var locale_info = nexacro.Locale.getLocaleInfo(locale);
		var format_string = "";

		if (opt == "SHORTDATE")
		{
			format_string = locale_info.shortdate_format;
		}
		else if (opt == "LONGDATE")
		{
			format_string = locale_info.longdate_format;
		}

		if (format_string == "")
			return "yyyy-MM-dd";

		//u200f
		//long/short month,weekday -> unable mask format
		format_string = format_string.replace(/%a/g, "ddd");
		format_string = format_string.replace(/%A/g, "dddd");
		format_string = format_string.replace(/%b/g, "MMMM");
		format_string = format_string.replace(/%B/g, "MMMM");

		//date
		format_string = format_string.replace(/%y/g, "yy");
		format_string = format_string.replace(/%Y/g, "yyyy");
		format_string = format_string.replace(/%n/g, "M");
		format_string = format_string.replace(/%m/g, "MM");
		format_string = format_string.replace(/%d/g, "dd");
		format_string = format_string.replace(/%e/g, "d");

		return format_string;
	};

	nexacro.Locale._makeDateMaskStringFromIntl = function (locale, opt)
	{
		switch (opt)
		{
			case "SHORTDATE":
				opt = "short";
				break;
			case "MEDIUMDATE":
				opt = "medium";
				break;
			case "LONGDATE":
				opt = "long";
				break;
			case "FULLDATE":
				opt = "full";
				break;
			default:
				return "";
		}

		if (!locale)
			locale = nexacro._getLocale();

		locale = locale.replace(/_/g, "-");

		var locale_info = nexacro.Locale.getLocaleInfo(locale);
		var date = new Date(Date.UTC(1234, 5 - 1, 6, 7, 8, 9, 0));
		var format_string = new Intl.DateTimeFormat(locale, { dateStyle: opt }).format(date);

		format_string = format_string.replace("1234", "yyyy");
		format_string = format_string.replace("34", "yy");
		format_string = format_string.replace("05", "MM");
		format_string = format_string.replace("5", "M");
		format_string = format_string.replace("06", "dd");
		format_string = format_string.replace("6", "d");

		if (format_string.indexOf(locale_info.weekday_names_long[6]) >= 0)
		{
			var dd = "dddd";
			if (locale_info.weekday_names_long[6] == locale_info.weekday_names_short[6])
			{
				if (opt == "medium" || opt == "short")
					dd = "ddd";
			}
			else if (locale_info.weekday_names_long[6] == locale_info.weekday_names_narrow[6])
			{
				if (opt == "medium" || opt == "short")
					dd = "ddd";
			}

			format_string = format_string.replace(locale_info.weekday_names_long[6], dd);
		}
		else if (format_string.indexOf(locale_info.weekday_names_short[6]) >= 0)
		{
			format_string = format_string.replace(locale_info.weekday_names_short[6], "ddd");
		}
		else if (format_string.indexOf(locale_info.weekday_names_narrow[6]) >= 0)
		{
			format_string = format_string.replace(locale_info.weekday_names_narrow[6], "ddd");
		}

		if (format_string.indexOf(locale_info.month_names_long[4]) >= 0)
		{
			var MM = "MMMM";
			if (locale_info.month_names_long[4] == locale_info.month_names_short[4])
			{
				if (opt == "medium" || opt == "short")
					MM = "MMM";
			}
			else if (locale_info.month_names_long[4] == locale_info.month_names_narrow[4])
			{
				if (opt == "medium" || opt == "short")
					MM = "MMM";
			}

			format_string = format_string.replace(locale_info.month_names_long[4], MM);
		}
		else if (format_string.indexOf(locale_info.month_names_short[4]) >= 0)
		{
			format_string = format_string.replace(locale_info.month_names_short[4], "MMM");
		}
		else if (format_string.indexOf(locale_info.month_names_narrow[4]) >= 0)
		{
			format_string = format_string.replace(locale_info.month_names_narrow[4], "MMM");
		}

		return format_string;
	};

	nexacro.Locale._makeTimeMaskString = function (locale, opt)
	{
		var locale_info = nexacro.Locale.getLocaleInfo(locale);
		var format_string = "";

		if (opt == "SHORTTIME")
		{
			format_string = locale_info.time_format;

			var ampmpos = format_string.indexOf("%p");

			if (ampmpos >= 0)
			{
				if (format_string.indexOf("%p") > 8)
					format_string = "%I:%M %p";
				else
					format_string = "%p %I:%M";
			}
			else
			{
				format_string = "%H:%M";
			}
		}
		else if (opt == "LONGTIME")
		{
			format_string = locale_info.time_format;
		}
		else if (opt == "LONGTIME_AMPM")
		{
			format_string = locale_info.time_format_ampm;
		}

		if (format_string == "")
			return "HH:mm";

		//u200f
		//long/short month,weekday -> unable mask format

		//date
		format_string = format_string.replace(/%H/g, "HH");
		format_string = format_string.replace(/%I/g, "hh");
		format_string = format_string.replace(/%p/g, "aa");
		format_string = format_string.replace(/%M/g, "mm");
		format_string = format_string.replace(/%S/g, "ss");

		return format_string;
	};

	nexacro.Locale._makeTimeMaskStringFromIntl = function (locale, opt)
	{
		switch (opt)
		{
			case "SHORTTIME":
				opt = "short";
				break;
			case "MEDIUMTIME":
			case "LONGTIME":
			case "FULLTIME":
				opt = "medium";
				break;
			default:
				return "";
		}

		if (!locale)
			locale = nexacro._getLocale();

		locale = locale.replace(/_/g, "-");

		var locale_info = nexacro.Locale.getLocaleInfo(locale);
		var date = new Date(Date.UTC(1234, 5 - 1, 6, 7, 8, 9, 0));
		var format_string = new Intl.DateTimeFormat(locale, { timeStyle: opt, timeZone: 'UTC' }).format(date);

		var ampm = nexacro.Locale._getAmPm(locale);

		if (format_string.indexOf(ampm[0]) >= 0 || format_string.indexOf(ampm[1]) >= 0)
		{
			format_string = format_string.replace(ampm[0], "aa");
			format_string = format_string.replace(ampm[1], "aa");
			format_string = format_string.replace("07", "hh");
			format_string = format_string.replace("7", "h");
		}
		else
		{
			format_string = format_string.replace("07", "HH");
			format_string = format_string.replace("7", "H");
		}

		format_string = format_string.replace("08", "mm");
		format_string = format_string.replace("8", "m");
		format_string = format_string.replace("09", "ss");
		format_string = format_string.replace("9", "s");
		format_string = format_string.replace("000", "sss");

		return format_string;
	};

	nexacro.Locale._getAmPm = function (locale)
	{
		var locale_info = nexacro.Locale.getLocaleInfo(locale);
		if (locale_info.ampm[0] == "")
			return ["AM", "PM"];

		return locale_info.ampm;
	}

	nexacro.Locale._default_longdate_format = "\u0025\u0064\u0020\u0025\u0042\u0020\u0025\u0059";
	nexacro.Locale._default_shortdate_format = "\u0025\u0064\u002F\u0025\u006D\u002F\u0025\u0059";

	nexacro._getFormattedString = function (value_str, decimal_point, thousands_sep, grouping, frac_digits, use_fraction_digits)
	{
		//cvt string : int_cvt, dec_part
		// 1. 정수와 소수로 분리.
		//var [int_str, dec_str] = value_str.split(".");
		var value_arr = value_str.split(".");
		var int_str = value_arr[0];
		var dec_str = value_arr[1];

		if (!int_str)
		{
			int_str = "";
		}
		if (!dec_str)
		{
			dec_str = "";
		}

		var locale_string = "";
		var grouping_value;

		if (!decimal_point)
		{
			decimal_point = ".";
		}

		if (!thousands_sep)
		{
			thousands_sep = ",";
		}

		if (grouping && grouping.length > 0)
		{
			grouping_value = grouping[0];
		}

		if (grouping_value <= 0)
		{
			grouping_value = 3;
		}

		if (int_str.length > grouping_value && grouping_value > 0)
		{
			locale_string = thousands_sep + int_str.substr(int_str.length - grouping_value, grouping_value) + locale_string;
			int_str = int_str.slice(0, int_str.length - grouping_value);
		}

		// apply thousand separator 
		if (grouping.length > 1)
		{
			grouping_value = grouping[1];
		}

		if (grouping_value <= 0)
		{
			grouping_value = 3;
		}

		if (grouping_value > 0)
		{
			while (int_str.length > grouping_value)
			{
				locale_string = thousands_sep + int_str.substr(int_str.length - grouping_value, grouping_value) + locale_string;
				int_str = int_str.slice(0, int_str.length - grouping_value);
			}
		}

		locale_string = int_str + locale_string;

		// set decimal point
		if (use_fraction_digits)
		{
			var i = dec_str.length;
			var fraction_string = "";
			while (i < frac_digits)
			{
				fraction_string = fraction_string + "0";
				i++;
			}

			dec_str = dec_str + fraction_string;
			dec_str = dec_str.slice(0, frac_digits);
		}

		if (dec_str)
		{
			locale_string = locale_string + decimal_point + dec_str;
		}

		return locale_string;
	};

	nexacro.makeLocaleFormatString = function (obj, locale)
	{
		if ((typeof obj == "number") || (obj instanceof Number))
		{
			return (new nexacro.Number(obj)).formatString(locale);
		}
		else if (obj instanceof nexacro.Number)
		{
			return obj.formatString(locale);
		}
		else if (obj instanceof Date)
		{
			return (new nexacro.Date(obj)).formatString(locale);
		}
		else if (obj instanceof nexacro.Date)
		{
			return obj.formatString(locale);
		}
		else if (obj instanceof nexacro.Decimal)
		{
			return obj.formatString(locale);
		}

		return obj.toLocaleString(locale);
	};

	nexacro._setLocale = function (v)
	{
		nexacro._locale = v;
	};

}


