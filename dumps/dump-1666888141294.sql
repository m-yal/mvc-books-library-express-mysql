/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: authors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 49 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: books
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_name` varchar(255) DEFAULT NULL,
  `publish_year` smallint DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `book_description` text,
  `pages` int DEFAULT '0',
  `isbn` varchar(255) DEFAULT '-',
  `is_deleted` tinyint(1) DEFAULT '0',
  `visits` int DEFAULT '0',
  `wants` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 31 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: books_authors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `books_authors` (
  `book_id` int DEFAULT NULL,
  `author_id` int NOT NULL DEFAULT '0',
  KEY `book_id` (`book_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `books_authors_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `books_authors_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sessions_v1
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions_v1` (
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: authors
# ------------------------------------------------------------

INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (1, 'Джордж Орвелл');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (2, 'Тарас Шевченко');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (3, 'Григорій Квітка-Основ\'яненко');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (4, 'Лесь Подерв’янський');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (5, 'Френсіс Бернетт');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (6, 'Данiель Дефо');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (7, 'Джоан Роулінг');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (8, 'Анджей Сапковський');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (9, 'Ден Браун');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (10, 'Ґабріель Ґарсія Маркес');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (11, 'Стівен Кінг');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (12, 'Антуан де Сент-Екзюпері');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (13, 'Ілларіон Павлюк');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (14, 'Вальтер Тевіс');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (15, 'Іван Багряний');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (16, 'Томас Кинилли');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (17, 'Рей Бредбері');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (18, 'Террі Пратчетт');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (19, 'Еріх Марія Ремарк');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (20, 'Рей Бредбері');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (21, 'Данте Аліг\'єрі');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (22, 'Стівен Кінг');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (23, 'Говард Лавкрафт');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (24, 'Еріх Марія Ремарк');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (25, 'Маркус Зузак');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (26, 'adsad asd ad asd a');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (27, 'asd asd');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (28, 'vsdf sd');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (29, 'asdasda dsdsds');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (32, 'asdada');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (33, 'asd asda');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (34, 'asd as');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (35, 'qweqwe rewrw');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (39, 'adadasd');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (40, 'qeqweqw');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (41, 'asd ad');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (42, 'zxczxc cbcvvb');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (46, 'asd as d');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (47, 'qwe asd zxc ');
INSERT INTO
  `authors` (`id`, `author`)
VALUES
  (48, 'qwe asd zxc ');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: books
# ------------------------------------------------------------

INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    1,
    '1984',
    1949,
    '1984.jpg',
    'Незважаючи на художню вигадку, книга настільки реалістична, що перевертає свідомість, причому так, що хочеться перевернути її назад. Сам письменник стверджував, що «найкращі книги говорять тобі те, що ти вже сам знаєш». І роман-утопія «1984» описує речі, про які ми самі здогадувалися, але у існування яких боялися повірити.',
    312,
    '978-966-2355-57-4',
    0,
    9,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    2,
    'Кобзар',
    2015,
    'кобзар.jpg',
    'До збірки, крім основних, увійшли твори, що їх було вилучено у різні часи царською, а згодом радянською цензурою. Наведено також біографічні й бібліографічні відомості та добірку афоризмів поета.',
    352,
    '966-8182-56-1',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    3,
    'Конотопська відьма',
    2017,
    'конотопська_відьма.jpg',
    'До видання увійшли твори видатного українського письменника Г. Квітки-Основ\'яненка, якого відомий літературознавець С. Єфремов назвав батьком української повісті. Добір поданих текстів обумовлений шкільною програмою з української літератури. Розраховано на школярів, вчителів, студентів-філологів, усіх, хто цікавиться творчістю Квітки-Основ\'яненка.',
    203,
    '978-966-03-6195-9',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    4,
    'Павлiк Морозов',
    2013,
    'павлік_морозов.jpg',
    'Лесь Подерв’янський (1952) - скандально відомий український письменник і художник (член спілки художників України), культова фігура київського андерґраунду 70-90-х років ХХ століття. Справжню популярність Лесю Подерв’янському принесли його епатажнi п’єси, що були спочатку записанi на аудiокасетах і СD-дисках, а тепер з його творами можна ознайомитися на сторінках книжок. Читаючи Подерв’янського, ви відкриєте для себе, що його герої, на жаль, не такі вже нереальні, як це може здатися на перший погляд, а тонка іронія та гумор автора дозволять вам ще і ще раз посміхнутися над трагікомізмом нашого життя.',
    126,
    '978-966-03-6327-4',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    5,
    'The Secret Garde',
    1911,
    'the_secret_garden.jpg',
    'arperCollins is proud to present its new range of best-loved, essential classics. Orphaned and sent to live with her uncle in his austere manor on the moors, Mary Lennox is a lonely and unhappy child. A meeting with Dickon, her servant\'s brother begins her adventure and it is through their friendship and her relationship with her troubled hypochondriac cousin Colin that she begins to learn about herself. Their lives all begin to change when a Robin shows Mary the door to a mysterious secret garden.',
    288,
    '978-0-00-735106-0',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    6,
    'Робинзон Крузо',
    1719,
    'робинзон_крузо.jpg',
    'дна из самых известных в мире книг рассказывает об удивительных приключениях моряка, потерпевшего кораблекрушение и волею судьбы выброшенного на берег необитаемого острова. `Робинзон Крузо` Даниэля Дефо - бессмертный гимн человеческому мужеству и смекалке.',
    348,
    '978-966-03-5461-6#978-966-03-5457-9',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    7,
    'Книга Гаррі Поттер і таємна кімната',
    1998,
    'гаррі_потер.jpg',
    'Друга частина пригод Гаррі Поттера від Джоан Роулінг — книга «Гаррі Поттер і таємна кімната»! На вас чекають нові пригоди у світі чарівників, де старі секрети, літаючі автомобілі, грізна верба, дивний щоденник та небезпечні улюбленці Хегріда оживають на сторінках книги!',
    352,
    '978-966-7047-34-4',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    8,
    'Книга Відьмак. Останнє бажання. Книга 1',
    1993,
    'відьмак.jpg',
    'Біловолосий відьмак Ґеральт із Рівії, один з небагатьох представників колись численного цеху захисників людської раси від породжень нелюдського зла, мандрує невеликими королівствами, які можна охопити поглядом з вежі замку, та великими містами, отримуючи платню за те, чого навчений, - знищення віїв і з\'ядарок, стриґ та віпперів. Але є у відьмака і власний кодекс, у якому вбивство - це лише крайня міра, а життя розумне, чим би воно не було, - це все-таки життя. Саме цим він наживає собі нових ворогів, але й знаходить друзів, які колись змінять його долю.',
    288,
    '978-617-12-0499-7, 978-83-7578-063-5',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    9,
    'Код да Вінчі',
    2003,
    'код_да_вінчі.jpg',
    'Ця історія про неймовірне розслідування і приголомшливі відкриття Роберта Ленґдона та Софі Неве, без перебільшення, перевернула світ. Ден Браун створив легенду, в яку повірили всі, — попри відчайдушний опір Ватикану. Скандали навкруг роману, здається, не вгамуються ніколи, чому сприяє недавня його екранізація. А секрет цього величезного успіху полягає в тому, що Денові Брауну вдалося, як нікому до нього, наочно довести, що так звана історія та політика — це тільки ширма, за якою приховані величезні таємниці',
    333,
    '978-617-12-4758-1, 978-0-385-50420-1',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    10,
    'Сто років самотності',
    1967,
    'сто_років_самотності.png',
    'Ґабріель Ґарсія Маркес (1927-2014) – колумбійський журналіст, видавець і політичний діяч, один з найвидатніших письменників ХХ століття. Засновник літературного напряму «магічний реалізм». На початку 1960-х років Маркес переїхав з Колумбії до Мексики, і у 1981 році попросив політичного притулку. У 1982 році йому було присуджено Нобелівську премію з літератури: «за романи та оповідання, в яких фантазія та реальність, поєднуючись, відображають життя і конфлікти цього континенту».',
    416,
    '978-617-551-018-6',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    11,
    'Зелена миля',
    2018,
    'зелена_миля.jpg',
    'Пол Еджкомб — колишній наглядач федеральної в’язниці штату Луїзіана «Холодна гора», а нині — мешканець будинку для літніх людей. Більш ніж півстоліття тому він скоїв те, чого досі не може собі вибачити. І тягар минулого знову й знову повертає його до 1932 року.',
    432,
    '978-617-12-4301-9',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    12,
    'Маленький принц',
    1943,
    'маленький_принц.jpg',
    'Видатний французький письменник Антуан де Сент-Екзюпері був відважним льотчиком. Одного разу на своєму маленькому поштовому літаку він навіть перелетів Атлантичний океан. Це був світовий рекорд. Якось письменник зазнав аварії над Лівійською пустелею. Доки він десять днів ремонтував свій літак, до нього навідувався маленький пустельний лис. Вони заприятелювали. Згодом після тієї пригоди Екзюпері написав свій найгеніальніший твір — казку «Маленький принц»...',
    64,
    '978-617-585-069-5',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    13,
    'Білий попіл',
    2018,
    'білий_попіл.jpg',
    'Приватному детективу Тарасу Білому замовляють розслідувати вбивство панночки. Обвинувачують такого собі семінариста Хому Брута, й справа ніби геть зрозуміла... Втім, хутір, де сталося вбивство, приховує таємницю. І ця таємниця — страшніша за всі оповідки про панночку, яка встала з гробу.',
    352,
    '978-617-679-526-1',
    0,
    1,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    14,
    'Хід королеви',
    1983,
    'хід_королеви.jpg',
    '1950-ті роки. Бет Гармон — звичайна сирота із незвичайним хистом до шахів. Гра — її єдина пристрасть. Доки Бет у грі, доти контролює себе та... згубну жагу до транквілізаторів і алкоголю. Дівчина відчайдушно бажає стати феноменальною шахісткою, але водночас усе дужче хоче втекти подалі від цієї реальності.',
    352,
    '978-617-12-8651-1',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    15,
    'Тигролови',
    1944,
    'тигролови.jpg',
    'У романі відомого українського письменника Івана Багряного «Тигролови» розповідається про жахливі сторінки історії українського народу — сталінські репресії 30-х років ХХ ст. Рекомендовано програмою загальноосвітньої школи з української літератури.',
    292,
    '978-617-629-588-4',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    16,
    'Список Шиндлера',
    2020,
    'список_шиндлера.jpg',
    'В основу роману лягли спогади в`язня краківського гетто, приреченого на смерть і врятованого Шиндлером. Успішний бізнесмен Оскар Шиндлер відкриває в Кракові фабрику з виготовлення посуду. Для нього євреї з гетто і табору Плашув — просто дешева робоча сила. Однак зовсім скоро він відчуває безмежну повагу та співчуття до своїх робітників. Коли людей з Плашува починають перевозити до Аушвіцу, Оскар за допомогою свого друга, Іцхака Штерна, складає список тих, кого він нібито бере на фабрику. До нього увійшли понад тисячу людей, приречених на смерть. Аби врятувати їх, Шиндлер не шкодував ані грошей, ані сил, ані часу.',
    432,
    '78-617-12-7789-2',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    17,
    '451° за Фаренгейтом',
    1953,
    'фаренгейт.jpg',
    'Що трапилося з нашим світом? Чому пожежники спалюють будинки, а не гасять пожежі? Чому люди не читають книги, не ходять пішки і майже не розмовляють одне з одним? Як виглядатиме наша Земля та якими будуть люди, якщо заборонити їм читати книги? Зі сторінок одного з найкращих творів Рея Бредбері ви дізнаєтеся, як люди навчаться зберігати книги для наступних поколінь, хто повстане проти пануючої системи і як зустріч із «чудною» дівчиною Кларіс змінить життя пожежника Ґая Монтеґа…',
    144,
    '978-966-10-5356-3',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    18,
    'Морт',
    1987,
    'морт.jpg',
    'Роман «Морт» відкриває цикл серії «Дискосвіт», у якому головним персонажем є Смерть. Та це не означає, що книжка моторошна, адже у світі Террі Пратчетта Смерть рибалить, філософує, любить кошенят і смачні страви, мріє про відпустку і врешті просто виконує свою роботу: доправляє душі в інший світ. Думки про відпочинок спонукають Смерть обрати собі в підмайстри сільського хлопця Морта.',
    304,
    '978-617-679-483-7',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    19,
    'Три товариші',
    1936,
    'три_товариші.jpg',
    'Один з найкращих світових романів про справжню дружбу і велике кохання... Війна обпекла душі людей, і рани ще не загоїлися. Але все можна подолати, коли поруч є два товариші і кохана.',
    416,
    '978-617-12-8900-0',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    20,
    'Кульбабове вино',
    2015,
    'кульбабове_вино.jpg',
    'Літо у неіснуючому містечку Ґрін Таун 1928 року… Веселі пустощі чотирьох безтурботних хлопчаків… І кульбабове вино, яке готує дідусь… Воно – як чарівна капсула часу, що вбирає у себе досвід минулих літ, воно – як ностальгія за дитинством, у яке зможе хоча б на мить повернутися кожен, хто візьме до рук фантастичну повість Рея Бредбері «Кульбабове вино». Ця книга – острівець, на якому зупиняється час. Її сторінки дихають далекими дитинно-безмежними спогадами – теплими, п’янкими, вічними, проте яких нам не спіймати ніколи.',
    432,
    '978-966-10-2539-3',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    21,
    'Божественна комедія',
    2018,
    'божествення_комедія.jpg',
    'Плід усього життя «Суворого Данта» (так назвав геніального італійця Пушкін), творіння, яке в епоху середньовіччя стало передвісником Відродження, праця, що стоїть у ряду найбільших досягнень людської думки, — так говорили, говорять і говоритимуть про твір, який сам Данте Аліг\'єрі назвав просто «комедією», а його нащадки нарекли «Божественною». У своєму найграндіознішому витворі в символічно-алегоричній формі поет зобразив драматичну долю людської душі: її загибель у пеклі, переродження в чистилищі, тріумф у раю.',
    608,
    '9789660387072',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    22,
    'Сяйво',
    2022,
    'сяйво.jpg',
    'Коли Торранси найнялися доглядати взимку за розкішним готелем, вони й гадки не мали, який невимовний жах чекає на них... Одного разу там скоїлася страшна трагедія: колишній доглядач зарубав сокирою власну родину. Саме тут п’ятирічний Денні дізнався, що він може бачити справжніх мешканців будинку. І це — привиди. Хлопчику, наділеному даром передбачення, відкривається страшна суть речей. Він уже знає, звідки його родині загрожує смерть...',
    640,
    '978-617-12-9331-1',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    23,
    'Говард Філіпс Лавкрафт. Повне зібрання прозових творів (комплект із 3 книг)',
    2018,
    'лавкрафт.png',
    'Говард Філіпс Лавкрафт (1890-1937) - відомий американський письменник, який, написавши величезну кількість оповідань, багато повістей і три романи (не кажучи вже про архів його листування, що вважається найбільшим у світі), на жаль, за життя був майже невідомим і помер у самотності, так і не дочекавшись майбутньої всесвітньої слави свого вагомогу літературного доробку. Проте вже у другій половині ХХ сторіччя творчість Лавкрафта заслужено отримує світову славу і здобуває захоплення мільйонів її поціновувачів.',
    1360,
    '978-966-2355-69-7',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    24,
    'Ніч у Лісабоні',
    2020,
    'ніч_у_лісабоні.jpg',
    '«Життя коротке… Але що ж робить його таким? Усвідомлення того, що воно коротке…» Врятуватися, втекти з Європи якомога далі від нацистів! Їхня остання надія — пароплав до Америки. Але знайти квитки на нього майже неможливо… Дивний незнайомець готовий віддати власні — в обмін на те, що його вислухають. Попереду ніч, сповнена вина й довгих розмов про життя, націю, втрату та справжнє кохання під час війни…',
    288,
    '978-617-12-7129-6',
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `book_name`,
    `publish_year`,
    `image_path`,
    `book_description`,
    `pages`,
    `isbn`,
    `is_deleted`,
    `visits`,
    `wants`
  )
VALUES
  (
    25,
    'Крадійка книжок',
    2020,
    'крадійка_книжок.jpg',
    'Вражаюча історія, яку розповідає... Смерть! До влади в Німеччині прийшли фашисти. Вперше Смерть побачив маленьку Лізель, коли прийшов забрати душу її братика. Він став свідком того, як дівчинка вкрала першу книжку, і зацікавився її долею. Він приходив до її будинку, де, ризикуючи життям, родина переховувала єврея. Він слухав, як Лізель читала книжки під час бомбардувань. Смерть завжди був поруч. Під час останньої зустрічі він розкриє крадійці книжок свою найбільшу таємницю...',
    416,
    '9786171283114',
    0,
    0,
    0
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: books_authors
# ------------------------------------------------------------

INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (1, 1);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (2, 2);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (3, 3);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (4, 4);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (5, 5);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (6, 6);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (7, 7);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (8, 8);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (9, 9);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (10, 10);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (11, 11);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (12, 12);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (13, 13);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (14, 14);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (15, 15);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (16, 16);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (17, 17);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (18, 18);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (19, 19);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (20, 20);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (21, 21);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (22, 22);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (23, 23);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (24, 24);
INSERT INTO
  `books_authors` (`book_id`, `author_id`)
VALUES
  (25, 25);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sessions_v1
# ------------------------------------------------------------

INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('01f203b2-f89a-4203-aabd-99ac74baaa45');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('0620e7b2-087a-4d24-bef1-d2d8185f062d');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('0d964eb1-2beb-4c2c-909a-b438a2083bf6');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('170df685-0e16-4588-8d1d-925d525cb506');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('1b74e4ef-9082-4e1a-9292-c34698fab536');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('1ba3bed6-cb9e-4fe4-b4de-062c0a1a075c');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('21608d03-e092-4c06-9c85-588588a97e77');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('32819569-8dd6-45ae-a5d7-b76c74d27612');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('33d4ec3d-0029-4f0c-b988-6e1acb541dd3');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('40d0d2a7-8c9f-4404-882a-03215105c02e');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('41632a07-a374-43de-94fb-b8f91ea21f67');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('44484f50-eae7-4baf-b567-375e4dfb1935');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('54997163-8455-4000-985e-b3de283ea09f');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('54998d62-d2a7-4ddc-b143-1b9afe3d3edb');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('55bbb0f2-4636-48f4-943d-40af58abe44c');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('5900299c-d44c-4e13-afc4-87c3c9e4bddc');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('5d67dde1-c2c2-49bd-a91a-2dc509743115');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('5e811434-779f-48bc-9b93-2155137e54a3');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('60da939a-c265-4ee6-b4b2-13dfeb1f2ad9');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('63855354-8a10-442f-863a-01136fc4e26e');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('689c1ea8-b31b-4a09-b45a-30bf0007e4b2');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('695307d1-3620-45c0-8284-f494dca49c54');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('7acfdba9-d1a4-467f-87f8-e3e9c7324376');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('7fbd172c-10f6-4763-86c7-ec0fe56e286a');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('836c8f24-73c9-48ef-ab69-5fa60f371a57');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('8681fbe8-2860-46cf-9229-0ee91761e4f0');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('89b35071-d009-4b39-abaa-3829b19bc53a');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('8b83459b-22df-4d12-8b1b-ea4e077e4562');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('9038fbeb-3688-41f0-9e28-844f3f9ea1a9');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('9674e3b5-c398-4978-8be1-280cd6c3dd37');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('9740aea6-d45a-4002-89d9-cb9cea0665a8');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('9760f7f7-b358-41ca-a663-9bf665f304fc');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('9975f837-f0d0-452a-9d1b-ce614046ff9c');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('a1ece34a-65ed-4eb3-bc7b-22890fa5234c');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('a68b906b-5145-4db6-919f-d4c543dda93b');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('ab208a62-f54b-4fe4-985c-52fe06ddb68e');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('b2932f5d-bdc5-47b0-b9c1-8c540d8161bb');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('b40a3ef8-d1d7-437e-af62-7cc69874cc42');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('b6a711d5-8e0f-4332-a5de-8e563d5341ea');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('b72271a8-12d9-4ebc-828d-dd080fd01c37');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('ba5b4775-c120-4776-92bb-d207af3d4caf');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('bbc0a2e1-a4d7-40fd-b304-73fce1fd836f');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('c026c5f7-f1ff-4d96-9d9f-9b6c9dffab08');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('c07a02b7-aa46-41f4-9a7f-119f76c2d709');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('c0d2caa4-9867-4012-bbed-9f0a33ae325c');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('c22e6191-df09-40bf-ad09-47a81bcef32a');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('cf43f9ff-1717-4dab-9a4f-e8f973200a4d');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('cf87877b-6785-42d0-a21a-5110bbbec5f3');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('d42f300b-116f-4dcc-8411-6405bbc218e4');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('d9d5e4b2-73b0-463a-84f7-e7ad263af036');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('dbaed405-b0bb-4b0b-9c3a-557dc53202ab');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('e1330dbb-3841-4482-b986-e78f07a853ff');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('e27275a1-1b49-49bf-a6c8-da75c90525aa');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('e7a5c61f-ffe1-466c-91dc-d51be3cc27ef');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('f226bae3-7e40-48fa-af7e-749d55caa389');
INSERT INTO
  `sessions_v1` (`id`)
VALUES
  ('f831ced6-3503-49cf-b799-1c462e71455f');

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
