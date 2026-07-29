/* FinTeClub site-wide TR/EN language switch.
   Elements tagged with data-i18n get their text swapped using this dictionary,
   keyed by the original Turkish text. Dynamic (JSON-driven) content can call
   FTC_i18n.t(text) directly and re-render on the "ftc:langchange" event. */
(function () {
    const LANG_KEY = 'finteclub_lang';

    const dict = {
        // Page titles
        "Anasayfa - FinTeClub": "Home - FinTeClub",

        // Navbar
        "Anasayfa": "Home",
        "Duyurular": "Announcements",
        "Hakkımızda": "About Us",
        "Yönetim ve Ekip": "Board & Team",
        "Yönetim Kurulu": "Board of Directors",
        "Denetleme Kurulu": "Supervisory Board",
        "Sosyal Medya Kurulu": "Social Media Committee",
        "Kurumsal İletişim ve Sponsorluk Kurulu": "Corporate Communications & Sponsorship Committee",
        "Etkinlik Kurulu": "Events Committee",
        "Yazılım ve Proje Kurulu": "Software & Projects Committee",
        "Amaç ve Faaliyetler": "Purpose & Activities",
        "Etkinliklerimiz": "Our Events",
        "Sponsorlarımız": "Our Sponsors",
        "İletişim": "Contact",

        // Homepage hero
        "ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ": "ANKARA YILDIRIM BEYAZIT UNIVERSITY",
        "FİNANS VE TEKNOLOJİ KULÜBÜ": "FINANCE AND TECHNOLOGY CLUB",

        // Ask-a-question section
        "Bize Soru Sor": "Ask Us a Question",
        "Finans ve teknoloji dünyası, etkinliklerimiz veya kulübümüz hakkında merak ettiğiniz her şeyi sorabilirsiniz.":
            "You can ask us anything you're curious about regarding the world of finance and technology, our events, or our club.",
        "Ad Soyad": "Full Name",
        "E-posta Adresi": "Email Address",
        "Mesajınız": "Your Message",
        "Gönder": "Send",
        "Gönderiliyor...": "Sending...",
        "Sorunuz başarıyla gönderildi! Teşekkür ederiz.": "Your question was sent successfully! Thank you.",
        "Sorunuz başarıyla iletildi! Teşekkür ederiz.": "Your question was delivered successfully! Thank you.",
        "Gönderilirken bir hata oluştu, lütfen tekrar deneyin.": "Something went wrong while sending, please try again.",

        // Common placeholders
        "Adınız ve Soyadınız": "Your full name",
        "ornek@email.com": "example@email.com",
        "Sorunuzu buraya yazın...": "Type your question here...",

        // Footer / misc common
        "Geç": "Skip",

        // Hakkımızda (About) page
        "Hakkımızda - FinTeClub": "About Us - FinTeClub",
        "Biz Kimiz?": "Who We Are?",
        "FinTeClub, finans ve teknoloji alanlarına ilgi duyan öğrencileri bir araya getirerek onların hem akademik hem de profesyonel gelişimlerine katkı sağlamayı amaçlayan bir öğrenci topluluğudur. Kulüp, yenilikçi bakış açısı ve aktif etkinlik yapısıyla üyelerine değer katmayı hedeflemektedir.":
            "FinTeClub is a student community that aims to bring together students interested in finance and technology and contribute to both their academic and professional development. The club aims to add value to its members through an innovative perspective and an active event structure.",
        "Misyonumuz": "Our Mission",
        "Üyelerimize; nitelikli eğitimler, uygulamalı workshoplar ve sektör profesyonelleri ile etkileşim imkânı sunarak onların akademik ve kariyer gelişimlerine katkı sağlamak.":
            "To contribute to our members' academic and career development by offering quality training, hands-on workshops, and opportunities to interact with industry professionals.",
        "Vizyonumuz": "Our Vision",
        "Finans ve teknoloji alanlarında kendini sürekli geliştiren, yenilikçi düşünen ve sektöre değer katan bireyler yetiştiren öncü bir öğrenci topluluğu olmak.":
            "To be a pioneering student community that raises individuals who continuously develop themselves in finance and technology, think innovatively, and add value to the industry.",
        "Sıkça Sorulan Sorular": "Frequently Asked Questions",
        "FinTeclub nedir ve temel amaçları nelerdir?": "What is FinTeclub and what are its core goals?",
        "FinTeclub, finans ve teknolojiyi (FinTech) bir araya getirerek öğrencilerin bu alanda gelişim göstermesini hedefleyen yenilikçi bir üniversite topluluğudur. Gerçekleştirdiğimiz projeler, eğitimler ve sektör ziyaretleriyle teorik bilgiyi pratik tecrübeye dönüştürmeyi amaçlıyoruz.":
            "FinTeclub is an innovative university community that brings finance and technology (FinTech) together, aiming to help students grow in this field. Through our projects, training sessions, and industry visits, we aim to turn theoretical knowledge into practical experience.",
        "Kulübe katılmak için yazılım veya finans altyapısına sahip olmak şart mı?": "Do I need a software or finance background to join the club?",
        "Kesinlikle hayır! FinTeclub kapılarını öğrenmeye ve kendini geliştirmeye istekli tüm öğrencilere açar. Kulüp içi akran danışmanlığı, mentorluk destekleri ve sıfırdan başlayan eğitim modüllerimiz sayesinde her üye kendi ilgi alanına göre pürüzsüz bir gelişim eğrisi yakalayabilir.":
            "Absolutely not! FinTeclub is open to all students willing to learn and develop themselves. Thanks to our peer mentoring, mentorship support, and beginner-friendly training modules, every member can follow a smooth learning curve based on their own interests.",
        "Düzenlenen etkinlikler ve eğitimler sertifikalı mı, katılım ücretli mi?": "Are the events and training sessions certified, and is there a participation fee?",
        "Kulübümüz tarafından organize edilen tüm temel eğitimler, paneller ve zirveler tamamen ücretsizdir. Belirli teknik eğitimleri ve iş birliği zirvelerini başarıyla tamamlayan katılımcılarımıza, kariyerlerinde fark yaratacak kurumsal onaylı katılım sertifikaları takdim edilmektedir.":
            "All core training sessions, panels, and summits organized by our club are completely free. Participants who successfully complete certain technical training sessions and collaboration summits are awarded corporate-approved certificates of participation that make a difference in their careers.",
        "Sponsorluk, mentorluk veya kurumsal iş birlikleri için nasıl iletişime geçebiliriz?": "How can we get in touch for sponsorship, mentorship, or corporate collaborations?",
        "Topluluğumuzla sponsorluk anlaşmaları yapmak, etkinliklerimize mentor olarak destek vermek veya kurumsal projeler geliştirmek için 'İletişim' sayfamızdaki formları kullanabilir ya da doğrudan yönetim kurulumuzun iletişim kanalları üzerinden bizimle pürüzsüzce koordine olabilirsiniz.":
            "To make sponsorship agreements with our community, support our events as a mentor, or develop corporate projects, you can use the forms on our 'Contact' page or coordinate with us directly through our board's contact channels.",

        // Amaç ve Faaliyetler (Purpose & Activities) page
        "Amaç ve Faaliyetler - FinTeClub": "Purpose & Activities - FinTeClub",
        "Amaç ve Kapsam": "Purpose & Scope",
        "FinTeClub’ın temel amacı, finans ve teknoloji alanlarında farkındalık oluşturmak ve öğrencilerin bu alanlarda kendilerini geliştirmelerine katkı sağlamaktır.":
            "FinTeClub's core purpose is to raise awareness in the fields of finance and technology and to help students develop themselves in these areas.",
        "Teknolojinin finans dünyasını nasıl dönüştürdüğünü inceleyerek, teorik bilgiyi pratik uygulamalarla desteklemeyi ve sektördeki en son gelişmeleri yakından takip etmeyi kendimize görev ediniyoruz.":
            "By examining how technology is transforming the world of finance, we make it our mission to support theoretical knowledge with practical applications and to closely follow the latest developments in the industry.",
        "Faaliyet Alanları": "Areas of Activity",
        "FinTeClub yıl boyunca çeşitli etkinlikler düzenlemektedir:": "FinTeClub organizes various events throughout the year:",
        "Eğitimler ve Atölye Çalışmaları": "Training Sessions & Workshops",
        "Sektör Profesyonelleri ile Söyleşiler": "Talks with Industry Professionals",
        "Teknik Geziler ve Kurum Ziyaretleri": "Technical Trips & Institution Visits",
        "Vaka Analizleri (Case Study)": "Case Studies",
        "Finansal Okuryazarlık Eğitimleri": "Financial Literacy Training",

        // İletişim (Contact) page
        "İletişim - FinTeClub": "Contact - FinTeClub",
        "Hemen üye olmak için üye formunu bağlantıya tıklayarak veya QR kodu kullanarak doldurabilirsiniz.":
            "To become a member right away, you can fill out the membership form by clicking the link or by scanning the QR code.",
        "Üyelik Formunu Doldur": "Fill Out the Membership Form",
        "Tüm soru, görüş ve önerileriniz için ekibimizle iletişime geçebilirsiniz.": "You can reach out to our team with any questions, feedback, or suggestions.",
        "Üye Kayıt Formu": "Member Registration Form",

        // Yönetim ve Ekip (Board & Team) page
        "Yönetim ve Ekip - FinTeClub": "Board & Team - FinTeClub",
        "Kulüp Danışmanı": "Club Advisor",
        "Yönetim Kurulu (Asil)": "Board of Directors (Regular)",
        "Yönetim Kurulu (Yedek Üyeler)": "Board of Directors (Substitute Members)",
        "Denetleme Kurulu (Asil)": "Supervisory Board (Regular)",
        "Denetleme Kurulu (Yedek Üyeler)": "Supervisory Board (Substitute Members)",
        "Ekip bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.": "An error occurred while loading team information. Please refresh the page.",

        // Team member role titles (ekip.json)
        "Başkan": "President",
        "Başkan Yardımcısı": "Vice President",
        "Genel Sekreter": "Secretary General",
        "Denetleme Kurulu Başkanı": "Chair of the Supervisory Board",
        "Denetleme Kurulu Üyesi": "Supervisory Board Member",
        "Kurul Temsilcisi": "Committee Representative",
        "Kurul Üyesi": "Committee Member",
        "Muhasip Üye": "Treasurer",
        "Yedek Üye": "Substitute Member",
        "YK Üyesi ve Etkinlik Kurulu Temsilcisi": "Board Member & Events Committee Representative",
        "YK Üyesi ve KİS Kurulu Temsilcisi": "Board Member & Corporate Communications Committee Representative",
        "YK Üyesi ve SM Kurulu Temsilcisi": "Board Member & Social Media Committee Representative",
        "YK Üyesi ve YP Kurulu Temsilcisi": "Board Member & Software Projects Committee Representative",

        // Etkinliklerimiz (Our Events) page
        "Etkinliklerimiz - FinTeClub": "Our Events - FinTeClub",
        "Detayları İncele →": "See Details →",
        "Daha fazlası →": "Read more →",
        "Daha fazlası": "Read more",
        "HAZİRAN 2026": "JUNE 2026",
        "MAYIS 2026": "MAY 2026",
        "Nisan 2026": "April 2026",
        "NİSAN 2026": "APRIL 2026",
        "10 Nisan Cuma": "Friday, April 10",
        "Tarih: Mayıs 2026": "Date: May 2026",
        "Tarih: HAZİRAN 2026": "Date: JUNE 2026",
        "Tarih: MAYIS 2026": "Date: MAY 2026",
        "Tarih: Nisan 2026": "Date: April 2026",
        "Tarih: NİSAN 2026": "Date: APRIL 2026",
        "Tarih: 10 Nisan Cuma": "Date: Friday, April 10",

        // Event titles
        "Piknik Etkinliği": "Picnic Event",
        "Anıtkabir Ziyareti": "Anıtkabir Visit",
        "Dostluk Maçı": "Friendship Match",
        "AYBÜ Bahar Şenliği": "AYBÜ Spring Festival",
        "BTK Teknik Gezisi": "BTK Technical Trip",
        "Teknopark Ankara Ziyareti": "Teknopark Ankara Visit",
        "Tanışma Etkinliği": "Meet & Greet Event",
        "Fidan Dikme Etkinliği": "Sapling Planting Event",
        "Çorba Etkinliği": "Soup Event",

        // Event descriptions
        "FinTeClub olarak, yoğun geçen akademik dönemin yorgunluğunu atmak ve kulüp içi bağlarimizi güçlendirmek amaciyla Çubuk Karagöl Tabiat Parkı'nda harika bir sosyal etkinlik düzenledik.":
            "As FinTeClub, we organized a wonderful social event at Çubuk Karagöl Nature Park to shake off the fatigue of a busy academic term and strengthen our bonds within the club.",
        "Doğanın ve temiz havanın tadını çıkardığımız bu özel günde, sucuk ekmek partimiz eşliğinde keyifli anlar paylaştık ve gelecek dönem projelerimiz için enerji tazeledik.":
            "On this special day, enjoying nature and fresh air, we shared great moments over a sucuk-bread cookout and recharged our energy for next term's projects.",
        "<strong>Teşekkürlerimizle:</strong><br>Etkinliğimizin eksiksiz ve keyifli geçmesinde emeği olan paydaşlarımıza teşekkür ederiz. Bu güzel günde bizleri yalnız bırakmayan, varlıklarıyla etkinliğimize değer katan tüm kıymetli hocalarımıza ve kulüp üyelerimize katılımları için; etkinliğimize lezzet katan sponsorluk desteği ve katkıları için Muhammet Kasap'a ve Karagöl'e ulaşımımızı güvenle sağlayarak bu organizasyonu mümkün kılan Çubuk Belediyesine destekleri için FinTeClub yönetimi ve ailesi adına sonsuz teşekkürlerimizi sunarız.":
            "<strong>Our Thanks:</strong><br>We thank all the stakeholders whose efforts made our event complete and enjoyable. Our sincere thanks, on behalf of the FinTeClub board and family, go to all our valued advisors and club members for joining us on this beautiful day, to Muhammet Kasap for the sponsorship support that added flavor to our event, and to Çubuk Municipality for safely providing our transportation to Karagöl and making this organization possible.",
        "Birlikte üretiyor, birlikte paylaşıyor ve birlikte büyüyoruz! ✨": "We create together, share together, and grow together! ✨",
        "kulüp büyesinde ki yönetim kurulu ve diğer kurullarımızla birlikte Ulu Önderimiz MUSTAFA KEMAL ATATÜRK'ü Anıtkabir de ziyarette bulunarak Başöğretmenimizi yerinde andık .":
            "Together with our board of directors and other committees, we visited Anıtkabir to commemorate our Great Leader MUSTAFA KEMAL ATATÜRK, our Head Teacher, at his resting place.",
        "Kulübümüz bünyesinde öğrenciler ve öğretmenlerimiz arasında dostluk maçı organize edilmiştir hoş zamanların ve dostluk rekabeti ile mücadele edilen ve karşılaşmalarda galibiyet alan uluslararası öğrencilerimizi tebrik ederiz .":
            "A friendship match was organized between students and our instructors within our club. We had a great time competing in friendly rivalry, and we congratulate our international students who won their matches.",
        "2026 AYBÜ bahar şenliklerimizde FinteClub olarak standımızda öğrencilerimizle ve hocalarımızla keyifli anlar yaşayarak hem kulüp hakkında bilgi vermek hemde kulübümüzü okula tanıtarak şenliğimize renk katmak istedik ve güzel bir bahar şenliği süreci yaşamış olduk":
            "At AYBÜ's 2026 spring festival, we spent enjoyable moments with students and instructors at our FinTeClub booth, aiming to both inform people about the club and introduce it to the school, adding color to the festival and making it a great spring festival experience.",
        "FinTeClub olarak teknoloji ve finans dünyasının dijital altyapısını yerinde incelemek amacıyla Bilgi Teknolojileri ve İletişim Kurumu'na (BTK) verimli bir teknik gezi düzenledik. Sektör profesyonellerinden aldığımız bilgiler ve kurum içi incelemelerle üyelerimizin vizyonunu genişlettik.":
            "As FinTeClub, we organized a productive technical trip to the Information and Communication Technologies Authority (BTK) to examine the digital infrastructure of the technology and finance world firsthand. The insights from industry professionals and our on-site observations broadened our members' vision.",
        "Kulübümüzün yeni üyeleri ile tanışmak için bir tanışma toplantısı düzenledik. Kulübün vizyonu ve misyonu etrafında kenetlenerek güçlü bir döneme harika bir başlangıç yaptık.":
            "We organized a meet & greet to get to know our club's new members. Rallying around the club's vision and mission, we made a great start to a strong term.",
        "Kampüsümüzde düzenlenen ağaç dikme etkinliğine kulüpçe katılmış, fidanlarımızı geleceğe umut olması için toprakla buluşturmuştuk. 🌱":
            "Our club took part in a tree-planting event held on our campus, putting our saplings in the ground as a hope for the future. 🌱",
        "Etkinlikte bizlerle bir araya gelen, çevreye ve geleceğe yönelik bu adımı destekleyen Değerli Rektörümüz Prof. Dr. Ali Cengiz KÖSEOĞLU ile birlikte kampüsümüzü yeşillendirmenin mutluluğunu yaşadık.":
            "We were joined at the event by our esteemed Rector Prof. Dr. Ali Cengiz KÖSEOĞLU, who supported this step towards the environment and the future, and together we enjoyed greening our campus.",
        "Bu güzel organizasyonda emeği geçen herkese teşekkür ederiz. Bugün diktiğimiz her fidan, yarınlarımızın gölgesi olacak! 💚":
            "We thank everyone who contributed to this wonderful organization. Every sapling we planted today will be the shade of our tomorrows! 💚",
        "Çubuk Belediyesi sponsorluğuyla okulumuzda çorba etkinliğimizi düzenledik": "We organized our soup event at our school with the sponsorship of Çubuk Municipality",

        // Duyurular (Announcements) page
        "Duyurular - FinTeClub": "Announcements - FinTeClub",
        "İş Birliği Programı": "Partnership Program",
        "Son Başvuru: 13 Temmuz 2026": "Deadline: July 13, 2026",
        "Son Başvuru: 20 Temmuz 2026": "Deadline: July 20, 2026",
        "18 Haziran 2026": "June 18, 2026",
        "Temmuz–Ağustos 2026": "July–August 2026",
        "24 Haziran 2026": "June 24, 2026",
        "Mayıs 2026": "May 2026",
        "Kasım 2025": "November 2025",

        // Announcement titles
        "AYBÜ Finans ve Bankacılık Bölümünü Tanıyın 2/2": "Get to Know AYBÜ Finance and Banking Department 2/2",
        "AYBÜ Finans ve Bankacılık Bölümünü Tanıyın 1/2": "Get to Know AYBÜ Finance and Banking Department 1/2",
        "🚀 BTK Akademi İş Birliğiyle Yeni Bir Öğrenme Yolculuğu Başlıyor!": "🚀 A New Learning Journey Begins with BTK Akademi Partnership!",
        "🌍 İklim değişikliğine çözüm üretecek fikir senin olabilir! 🇪🇺": "🌍 Your idea could be the solution to climate change! 🇪🇺",
        "👨‍🔬 TÜBİTAK Geleceğin Araştırmacılarını Arıyor! 🚀": "👨‍🔬 TÜBİTAK Is Looking for the Researchers of the Future! 🚀",
        "UTEP Ankara Ziyaretimiz: Gençlerimizin Geleceğine Birlikte Yön Veriyoruz!": "Our UTEP Ankara Visit: Shaping Our Youth's Future Together!",
        "BTK Akademi Şehrinize Geliyor: Yüz Yüze Eğitimler!": "BTK Akademi Is Coming to Your City: In-Person Training!",
        "Dijital Avrupa Programı Ortak Bulma Etkinliği": "Digital Europe Programme Partner Search Event",
        "Çubuk Karagöl Pikniği": "Çubuk Karagöl Picnic",
        "Uluslararası Öğrenci Günü": "International Students' Day",
        "Dostluk Maçları": "Friendship Matches",
        "Teknopark Ankara Teknik Gezisi": "Teknopark Ankara Technical Trip",

        // Announcement descriptions (plain paragraphs)
        "Finans eğitimi yalnızca teorik bilgiyle sınırlı kalmamalı; öğrenciyi gerçek piyasa koşullarına ve değişen mesleki gerekliliklere hazırlamalıdır.":
            "Finance education should not be limited to theoretical knowledge alone; it should prepare students for real market conditions and evolving professional requirements.",
        "BISTLAB, uygulamalı dersler, güncel finans alanları ve sektör deneyimiyle öğrencilerimizin öğrendiklerini pratiğe dönüştürebilecekleri bir eğitim ortamı sunuyoruz.":
            "Through BISTLAB, hands-on courses, current finance topics, and industry experience, we offer our students a learning environment where they can turn what they learn into practice.",
        "Finansı yalnızca öğrenmeyin; analiz edin, uygulayın ve geleceğe taşıyın.": "Don't just learn finance; analyze it, apply it, and carry it into the future.",
        "Doğru bölüm tercihi, mezuniyet sonrasında yalnızca bir diploma değil, farklı kariyer yollarına açılan güçlü bir başlangıç sunmalıdır.":
            "The right department choice should offer, after graduation, not just a diploma but a strong start opening onto different career paths.",
        "Bankacılık, sermaye piyasaları, fintech, denetim ve danışmanlıktan kamu kurumlarına kadar uzanan kariyer seçenekleri; analitik düşünme, İngilizce iletişim ve teknoloji yetkinlikleriyle daha güçlü hâle geliyor.":
            "Career options ranging from banking, capital markets, and fintech to audit, consulting, and public institutions become stronger with analytical thinking, English communication, and technology skills.",
        "Finans dünyasındaki kariyerinizi bugünden şekillendirin.": "Shape your career in the world of finance starting today.",
        "Savunma sanayiine farklı açılardan bakmaya hazır mısınız?": "Are you ready to look at the defense industry from different angles?",
        "Teknolojiyi, insanı, stratejiyi ve geleceği birlikte ele alan bu eğitim serisiyle savunma sanayiini daha yakından tanıyacak, geleceğin yetkinliklerine bir adım daha yaklaşacaksınız.":
            "With this training series that brings together technology, people, strategy, and the future, you'll get to know the defense industry more closely and take one more step toward the skills of the future.",
        "✨ Serüven şimdi başlıyor!": "✨ The adventure starts now!",
        "Avrupa Birliği tarafından finanse edilen EU Climate Ideathon 2026 için başvurular başladı!": "Applications are now open for the EU-funded EU Climate Ideathon 2026!",
        "Türkiye’deki üniversitelerde öğrenim gören 29 yaş altı öğrenciler, ister bireysel ister takım halinde başvurarak iklim krizine yönelik yenilikçi çözümler geliştirme fırsatı yakalayabilir.":
            "Students under 29 studying at universities in Turkey can apply individually or as a team for the chance to develop innovative solutions to the climate crisis.",
        "Program boyunca fikirlerini uzman mentorlarla geliştirebilir, eğitim and mentorluk desteği alabilir, başarılı olman halinde ise çözümünü Antalya’da gerçekleştirilecek COP31 Finali’nde sunma şansı elde edebilirsin. 🌱":
            "Throughout the program you can develop your ideas with expert mentors, receive training and mentorship support, and, if successful, get the chance to present your solution at the COP31 Final in Antalya. 🌱",
        "170 Aday Araştırmacımızdan biri olarak kariyerine TÜBİTAK’ta adım atabilir, geleceğin bilim dünyasında yerini alabilirsin. 👩🏻‍🔬👨‍🔬":
            "As one of our 170 Candidate Researchers, you can start your career at TÜBİTAK and take your place in the science world of the future. 👩🏻‍🔬👨‍🔬",
        "Ankara Yıldırım Beyazıt Üniversitesi’nin değerli akademisyenleri ve öğrencileri, UTEP Ankara Şubemizde Başkanımız Metin Pile’yi ziyaret etti.":
            "Esteemed faculty members and students of Ankara Yıldırım Beyazıt University visited our President Metin Pile at the UTEP Ankara branch.",
        "FinTeclub kulübü olarak gerçekleşen verimli görüşmede; öğrencilerimizin kişisel, akademik ve kariyer gelişimlerine nasıl daha fazla katkı sağlayabileceğimiz üzerine fikir alışverişinde bulunuldu.":
            "In this productive meeting as the FinTeclub club, we exchanged ideas on how we could further contribute to our students' personal, academic, and career development.",
        "Gençlerimizin yanında olmaya, bilgi ve tecrübelerimizi paylaşarak onların geleceğine değer katmaya devam edeceğiz.":
            "We will continue to stand by our youth, sharing our knowledge and experience to add value to their future.",
        "Temmuz–Ağustos 2026 döneminde farklı şehirlerde yapay zekâ, büyük dil modelleri, Microsoft 365 Copilot, Figma, IoT ve İHA alanlarında yüz yüze eğitimler düzenleniyor. Başvuru tarihleri şehir ve eğitime göre değişiyor. Detayları Kariyer Pusulan’daki program sayfasından inceleyip BTK Akademi üzerinden başvurunu tamamlayabilirsin.":
            "In-person training sessions on AI, large language models, Microsoft 365 Copilot, Figma, IoT, and UAVs are being held in different cities during July–August 2026. Application dates vary by city and training. You can review the details on the program page at Kariyer Pusulan and complete your application through BTK Akademi.",
        "📢 DEP4ALL tarafından Dijital Avrupa Programı 10. Çağrı dönemi kapsamında proje hazırlayan kuruluşlara yönelik çevrim içi ortak bulma etkinliği düzenleniyor! Etkinlik kapsamında katılımcılar; potansiyel konsorsiyum ortaklarıyla tanışabilecek, uzmanlık alanlarını ve proje fikirlerini paylaşabilecek, Avrupa çapındaki iş birliği ağlarını genişletebilecek ve farklı ülkelerden paydaşlarla doğrudan bağlantı kurabileceklerdir.":
            "📢 DEP4ALL is organizing an online partner-matching event for organizations preparing projects under the 10th Call of the Digital Europe Programme! Participants will be able to meet potential consortium partners, share their expertise and project ideas, expand their collaboration networks across Europe, and connect directly with stakeholders from different countries.",
        "Kulübümüz üyeleri ve hocalarımızın katılımıyla doğayla iç içe, keyifli anlar paylaştığımız geleneksel Karagöl pikniği etkinliğimiz.":
            "Our traditional Karagöl picnic event, where we share enjoyable moments in nature with our club members and instructors.",
        "Farklı kültürlerden gelen uluslararası öğrencilerimizle bir araya gelerek kültürel etkileşimi ve dostluğu pekiştirdiğimiz özel gün kutlaması.":
            "A special day celebration where we come together with our international students from different cultures to strengthen cultural exchange and friendship.",
        "Öğrencilerimiz ve akademisyenlerimiz arasında sporun birleştirici gücüyle düzenlenen, tatlı rekabetin ve dostluğun kazandığı spor karşılaşmaları.":
            "Sports matches organized between our students and faculty through the unifying power of sport, where friendly rivalry and friendship both come out on top.",
        "Yeni katılan üyelerimizle tanışarak kulübümüzü okula tanıttığımız ve gelecek projelerimizi paylaştığımız samimi sezon başlangıcı buluşması.":
            "A warm season-opening gathering where we get to know our new members, introduce our club to the school, and share our upcoming projects.",
        "Teknoloji ve inovasyon merkezlerini yakından incelemek, profesyonel iş ortamlarını yerinde deneyimlemek amacıyla gerçekleştirdiğimiz teknik gezi.":
            "A technical trip we organized to closely examine technology and innovation centers and experience professional work environments firsthand.",

        // CTA links
        "Instagram Gönderisi": "Instagram Post",
        "BTK Akademi": "BTK Akademi",
        "Savunma Kariyer": "Savunma Kariyer",
        "Başvuru ve Detaylar →": "Application & Details →",
        "Etkinliğe Kayıt Ol →": "Register for the Event →",

        // Rich-text (HTML) blocks
        "<strong>📚 19 başlıktan oluşan bu özel programda;</strong><br>\n                                🔹 Savunma Sanayiine Teknik Bakış<br>\n                                🔹 Savunma Sanayiine Sosyal Bakış<br>\n                                olmak üzere iki farklı perspektif, tek bir amaçta buluşuyor.":
            "<strong>📚 In this special program made up of 19 topics;</strong><br>\n                                🔹 A Technical Look at the Defense Industry<br>\n                                🔹 A Social Look at the Defense Industry<br>\n                                two different perspectives come together in a single purpose.",
        "<strong>🎯 Geleceğin savunma sanayiini birlikte inşa etmeye hazır mısınız?</strong>":
            "<strong>🎯 Are you ready to build the defense industry of the future together?</strong>",
        "<strong>💡 Program boyunca katılımcıları;</strong><br>\n                                ✅ Eğitim ve mentorluk desteği<br>\n                                ✅ Takım çalışması ve fikir geliştirme süreci<br>\n                                ✅ Uzmanlarla networking imkânı<br>\n                                ✅ Katılım belgesi<br>\n                                ✅ Başarılı ekipler için COP31 kapsamında düzenlenecek ulusal finalde sunum yapma fırsatı":
            "<strong>💡 Throughout the program, participants get;</strong><br>\n                                ✅ Training and mentorship support<br>\n                                ✅ A teamwork and idea-development process<br>\n                                ✅ Networking opportunities with experts<br>\n                                ✅ A certificate of participation<br>\n                                ✅ For successful teams, the chance to present at the national final held as part of COP31",
        "<strong>📌 Kimler Başvurabilir?</strong><br>\n                                🎓 Türkiye’deki üniversitelerde öğrenim gören 29 yaş altı öğrenciler<br>\n                                👤 Bireysel veya 👥 takım halinde başvuru yapılabilir.":
            "<strong>📌 Who Can Apply?</strong><br>\n                                🎓 Students under 29 studying at universities in Turkey<br>\n                                👤 You can apply individually or 👥 as a team.",
        "<strong>Programda Seni Neler Bekliyor?</strong><br>\n                                🔎 Türkiye’nin bilimsel ve teknolojik gelişiminde aktif rol alma olanağı,<br>\n                                🤝 Alanında uzman araştırmacılarla birebir çalışma imkanı,<br>\n                                🎓 Mezuniyet sonrası tam zamanlı Araştırmacı olma fırsatı.":
            "<strong>What Awaits You in the Program?</strong><br>\n                                🔎 The chance to take an active role in Turkey's scientific and technological development,<br>\n                                🤝 The opportunity to work one-on-one with expert researchers in the field,<br>\n                                🎓 The chance to become a full-time Researcher after graduation.",
        "<strong>Son başvuru tarihi:</strong><br>\n                                🗓️ 20 Temmuz 2026<br>\n                                ⏰ 17.00":
            "<strong>Application deadline:</strong><br>\n                                🗓️ July 20, 2026<br>\n                                ⏰ 17:00",
        "📌 <strong>Detaylar:</strong> <a href=\"https://www.instagram.com/utepankara/\" target=\"_blank\" style=\"color: #93c5fd; text-decoration: none;\">instagram.com/utepankara</a>":
            "📌 <strong>Details:</strong> <a href=\"https://www.instagram.com/utepankara/\" target=\"_blank\" style=\"color: #93c5fd; text-decoration: none;\">instagram.com/utepankara</a>",
        "🤝 <strong>Ev Sahibi:</strong> UTEP Ankara Şube Başkanı Metin Pile": "🤝 <strong>Host:</strong> Metin Pile, President of UTEP Ankara Branch",
        "🏫 <strong>Katılımcılar:</strong> AYBÜ Akademisyenleri ve FinTeclub Öğrencileri": "🏫 <strong>Participants:</strong> AYBÜ Faculty and FinTeclub Students",
        "📌 <strong>Detaylar:</strong> <a href=\"https://kariyerpusulan.com\" target=\"_blank\" style=\"color: #93c5fd; text-decoration: none;\">kariyerpusulan.com</a>":
            "📌 <strong>Details:</strong> <a href=\"https://kariyerpusulan.com\" target=\"_blank\" style=\"color: #93c5fd; text-decoration: none;\">kariyerpusulan.com</a>",
        "🔎 <strong>Program adı:</strong> BTK Akademi Şehrinize Geliyor: Yüz Yüze Eğitimler": "🔎 <strong>Program name:</strong> BTK Akademi Is Coming to Your City: In-Person Training",
        "👤 <strong>Kanal:</strong> @btkakademi": "👤 <strong>Channel:</strong> @btkakademi",
        "📅 <strong>Tarih:</strong> 24 Haziran 2026": "📅 <strong>Date:</strong> June 24, 2026",
        "🕑 <strong>Saat:</strong> 14.00 – 16.00 (TSİ)": "🕑 <strong>Time:</strong> 14:00 – 16:00 (TRT)",
        "💻 <strong>Platform:</strong> Çevrim içi": "💻 <strong>Platform:</strong> Online",

        // Admin-entered announcement (site-data.json) — currently published item
        "Bankacılık ve Finans Bölümü Tanıtım": "Banking and Finance Department Overview",
        "AYBÜ Finans ve Bankacılık Bölümünü Tanıyın | 4/4 Finans dünyası küreseldir. Bu nedenle güçlü bir finans eğitimi, uluslararası iletişim becerisi ve farklı kültürleri tanıma fırsatıyla desteklenmelidir. İngilizce eğitim, bölüme özel Erasmus+ anlaşmaları ve çok kültürlü kampüs ortamıyla öğrencilerimize sınırların ötesinde düşünebilecekleri bir gelişim alanı sunuyoruz. Küresel finans dünyasına hazırlanırken akademik ve kişisel deneyiminizi uluslararası fırsatlarla güçlendirin. 🔗 aybu.edu.tr/fb  #AYBÜ #FinansVeBankacılık #Erasmus #İngilizceEğitim #UluslararasıEğitim #Tercih2026":
            "Get to Know AYBÜ's Banking and Finance Department | 4/4 The world of finance is global. That's why a strong finance education should be backed by international communication skills and the opportunity to get to know different cultures. With English-language instruction, department-specific Erasmus+ agreements, and a multicultural campus environment, we offer our students a space to grow and think beyond borders. Strengthen your academic and personal experience with international opportunities as you prepare for the global world of finance. 🔗 aybu.edu.tr/fb  #AYBÜ #BankingAndFinance #Erasmus #EnglishEducation #InternationalEducation #Choice2026",

        // Sponsorlarımız (Our Sponsors) page
        "Sponsorlarımız - FinTeClub": "Our Sponsors - FinTeClub",
        "Sponsorumuz": "Our Sponsor",
        "Sponsorumuz / Destekçimiz": "Our Sponsor / Supporter",
        "Destekçimiz": "Our Supporter",
        "SPONSORUMUZ": "OUR SPONSOR",
        "Adres": "Address",
        "Web Sitesi": "Website",
        "Hakkında": "About",
        "FinTeClub etkinliklerine lezzet katan değerli sponsorluk desteği ve katkılarıyla yanımızda.":
            "They stand by us with valuable sponsorship support and contributions that add flavor to FinTeClub events.",

        // Tanışma Etkinliği page (tanisma.html)
        "Tanışma Etkinliği - FinTeClub": "Meet & Greet Event - FinTeClub",
        "Kulübümüzün yeni üyeleri ile tanışmak için bir tanışma toplantısı düzenliyoruz! Etkinlikte kulübümüzün tanıtımı, amacı, çalışma alanları, etkinlikleri ve dönem içerisinde planlanan faaliyetler hakkında bilgilendirme yapılacaktır.":
            "We are organizing a meet & greet to get to know our club's new members! At the event, there will be information about our club's introduction, purpose, areas of work, events, and the activities planned for the term.",

        // Teknopark Ankara Gezisi page (teknopark.html)
        "Teknopark Ankara Gezisi - FinTeClub": "Teknopark Ankara Trip - FinTeClub",
        "Teknopark Ankara Gezisi": "Teknopark Ankara Trip",
        "Rotamız: Teknopark Ankara 🚀 FinTeClub olarak, öğrencilerimizin sektörel vizyonlarını genişletmek ve teknoloji ekosistemini yerinde gözlemlemek amacıyla Teknopark Ankara’ya bir teknik gezi düzenliyoruz! Teorik finans ve teknoloji bilgilerimizi, sahadaki uygulamalarla birleştirmeyi hedeflediğimiz bu etkinlikte; girişimleri tanıma ve profesyonellerle bir araya gelme fırsatı bulacağız!":
            "Our route: Teknopark Ankara 🚀 As FinTeClub, we are organizing a technical trip to Teknopark Ankara to broaden our students' industry vision and observe the technology ecosystem firsthand! In this event, where we aim to combine our theoretical finance and technology knowledge with real-world applications, we'll have the chance to get to know startups and meet professionals!",
        "Tarih: 17 Nisan Cuma": "Date: Friday, April 17",

        // Instagram announcement detail pages
        "AYBÜ Finans ve Bankacılık Bölümünü Tanıyın 1/2 - FinTeClub": "Get to Know AYBÜ Finance and Banking Department 1/2 - FinTeClub",
        "AYBÜ Finans ve Bankacılık Bölümünü Tanıyın 2/2 - FinTeClub": "Get to Know AYBÜ Finance and Banking Department 2/2 - FinTeClub"
    };

    function currentLang() {
        return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'tr';
    }

    function t(text) {
        if (currentLang() !== 'en') return text;
        const key = (text || '').trim();
        return dict[key] || text;
    }

    function applyLang(lang) {
        document.documentElement.lang = lang === 'en' ? 'en' : 'tr';

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            if (!el.dataset.trText) el.dataset.trText = el.textContent.trim();
            el.textContent = lang === 'en' ? (dict[el.dataset.trText] || el.dataset.trText) : el.dataset.trText;
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            if (!el.dataset.trHtml) el.dataset.trHtml = el.innerHTML.trim();
            el.innerHTML = lang === 'en' ? (dict[el.dataset.trHtml] || el.dataset.trHtml) : el.dataset.trHtml;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            if (!el.dataset.trPlaceholder) el.dataset.trPlaceholder = el.getAttribute('placeholder') || '';
            el.setAttribute('placeholder', lang === 'en' ? (dict[el.dataset.trPlaceholder] || el.dataset.trPlaceholder) : el.dataset.trPlaceholder);
        });

        document.querySelectorAll('.lang-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        document.dispatchEvent(new CustomEvent('ftc:langchange', { detail: { lang } }));
    }

    function setLang(lang) {
        localStorage.setItem(LANG_KEY, lang);
        applyLang(lang);
    }

    function initLangSwitch() {
        document.querySelectorAll('.lang-switch .lang-btn').forEach((btn) => {
            btn.addEventListener('click', () => setLang(btn.dataset.lang));
        });
        applyLang(currentLang());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLangSwitch);
    } else {
        initLangSwitch();
    }

    window.FTC_i18n = { t, getLang: currentLang, dict };
})();
