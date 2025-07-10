-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movie_booking
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code_booking` varchar(255) DEFAULT NULL,
  `date_booking` date DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `booking_status_id` bigint(20) DEFAULT NULL,
  `showtime_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `discount_amount` int(11) DEFAULT NULL,
  `original_amount` int(11) DEFAULT NULL,
  `promotion_code` varchar(255) DEFAULT NULL,
  `promotion_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm3d0q9s1hos02eamx9wrsupaq` (`booking_status_id`),
  KEY `FKqpvw4sqntugqnqtrwkimyqe4w` (`showtime_id`),
  KEY `FKkgseyy7t56x7lkjgu3wah5s3t` (`user_id`),
  KEY `FK_booking_promotion` (`promotion_id`),
  CONSTRAINT `FK7d0wevq4etncm2qopykiylt2m` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
  CONSTRAINT `FK_booking_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
  CONSTRAINT `FKkgseyy7t56x7lkjgu3wah5s3t` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKm3d0q9s1hos02eamx9wrsupaq` FOREIGN KEY (`booking_status_id`) REFERENCES `booking_status` (`id`),
  CONSTRAINT `FKqpvw4sqntugqnqtrwkimyqe4w` FOREIGN KEY (`showtime_id`) REFERENCES `showtime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (3,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(6,'6HKBKMHY','2025-06-21','20250621093210',140000,3,1,2,NULL,NULL,NULL,NULL),(7,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(8,'7WJEI6ZW','2025-06-21','20250621094736',210000,3,2,2,NULL,NULL,NULL,NULL),(9,'954YAXDG','2025-06-21','20250621094857',140000,3,3,2,NULL,NULL,NULL,NULL),(10,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(11,'5XP33F6Q','2025-06-21','20250621103927',210000,3,1,2,NULL,NULL,NULL,NULL),(13,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(14,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(15,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(16,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(17,NULL,'2025-06-21',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(18,'97BPJXC5','2025-06-21','20250621104646',140000,3,1,2,NULL,NULL,NULL,NULL),(20,NULL,'2025-06-24',NULL,NULL,3,1,2,NULL,NULL,NULL,NULL),(21,'XGQZ75B7','2025-06-24','20250624223306',140000,3,1,2,NULL,NULL,NULL,NULL),(22,'780AMXGX','2025-06-27','20250627153626',63000,3,1,5,7000,70000,NULL,1),(23,NULL,'2025-07-01',NULL,NULL,3,1,5,NULL,NULL,NULL,NULL),(24,NULL,'2025-07-01','20250701124426',168000,3,1,5,42000,210000,NULL,3),(26,'0GPHEQVA','2025-07-09','20250709113410',70000,3,1,2,NULL,NULL,NULL,NULL),(27,'510I3XMA','2025-07-09','20250709113759',63000,3,1,2,7000,70000,NULL,1),(28,NULL,'2025-07-09',NULL,NULL,3,2,2,NULL,NULL,NULL,NULL),(29,'Y2RC3LVE','2025-07-09','20250709124230',70000,3,1,2,NULL,NULL,NULL,NULL),(31,NULL,'2025-07-10',NULL,NULL,1,1,2,NULL,NULL,NULL,NULL),(32,NULL,'2025-07-10',NULL,NULL,1,1,2,NULL,NULL,NULL,NULL),(33,'QM4VHJRP','2025-07-10','20250710094844',126000,3,3,2,14000,140000,NULL,1),(34,NULL,'2025-07-10','20250710184227',70000,1,2,2,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_seat`
--

DROP TABLE IF EXISTS `booking_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_seat` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `price` int(11) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `seat_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3gcy7w2me25kc4qp8nobmg4q6` (`booking_id`),
  KEY `FK3y806wtfhomwvu02t1u7u2136` (`seat_id`),
  CONSTRAINT `FK3gcy7w2me25kc4qp8nobmg4q6` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  CONSTRAINT `FK3y806wtfhomwvu02t1u7u2136` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_seat`
--

LOCK TABLES `booking_seat` WRITE;
/*!40000 ALTER TABLE `booking_seat` DISABLE KEYS */;
INSERT INTO `booking_seat` VALUES (9,70000,6,39),(10,70000,6,38),(11,70000,8,36),(12,70000,8,20),(13,70000,8,28),(14,70000,9,10),(15,70000,9,9),(16,70000,11,27),(17,70000,11,29),(18,70000,11,43),(21,70000,18,56),(22,70000,18,71),(25,70000,21,26),(26,70000,21,11),(27,70000,22,89),(28,70000,24,13),(29,70000,24,9),(30,70000,24,7),(34,70000,26,19),(35,70000,27,66),(36,70000,29,14),(40,70000,33,42),(41,70000,33,41),(42,70000,34,10);
/*!40000 ALTER TABLE `booking_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_status`
--

DROP TABLE IF EXISTS `booking_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_status`
--

LOCK TABLES `booking_status` WRITE;
/*!40000 ALTER TABLE `booking_status` DISABLE KEYS */;
INSERT INTO `booking_status` VALUES (1,'Pending'),(2,'Confirmed'),(3,'Seen');
/*!40000 ALTER TABLE `booking_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kind_of_film`
--

DROP TABLE IF EXISTS `kind_of_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kind_of_film` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kind_of_film`
--

LOCK TABLES `kind_of_film` WRITE;
/*!40000 ALTER TABLE `kind_of_film` DISABLE KEYS */;
INSERT INTO `kind_of_film` VALUES (1,'Hành động'),(2,'Hài hước'),(3,'Tình cảm - Lãng mạn'),(4,'Kinh dị'),(5,'Tâm lý'),(6,'Phiêu lưu'),(7,'Viễn tưởng'),(8,'Hoạt hình'),(9,'Gia đình'),(10,'Chiến tranh'),(11,'Học đường'),(12,'Tài liệu'),(13,'Tâm linh'),(14,'Hình sự - Trinh thám'),(15,'Hồi hộp');
/*!40000 ALTER TABLE `kind_of_film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kind_of_movie`
--

DROP TABLE IF EXISTS `kind_of_movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kind_of_movie` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `kind_of_film_id` bigint(20) NOT NULL,
  `movie_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKaupy2vsmnyfhnypkb6clsrwdg` (`kind_of_film_id`),
  KEY `FKr2j4033iqbyd4vkg7kdr12x4` (`movie_id`),
  CONSTRAINT `FKaupy2vsmnyfhnypkb6clsrwdg` FOREIGN KEY (`kind_of_film_id`) REFERENCES `kind_of_film` (`id`),
  CONSTRAINT `FKr2j4033iqbyd4vkg7kdr12x4` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kind_of_movie`
--

LOCK TABLES `kind_of_movie` WRITE;
/*!40000 ALTER TABLE `kind_of_movie` DISABLE KEYS */;
INSERT INTO `kind_of_movie` VALUES (1,4,1),(2,4,2),(3,4,3),(4,3,4),(5,2,4),(6,2,5),(7,3,5),(8,2,6),(9,3,6),(10,4,7),(11,13,7),(12,5,8),(13,9,8),(14,5,9),(15,9,9),(16,4,10),(17,8,11),(18,6,11),(19,1,12),(20,15,12),(22,6,12);
/*!40000 ALTER TABLE `kind_of_movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `actor` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `duration_movie` varchar(255) DEFAULT NULL,
  `name_movie` varchar(255) DEFAULT NULL,
  `release_date` varchar(255) DEFAULT NULL,
  `studio` varchar(255) DEFAULT NULL,
  `trailer` varchar(255) DEFAULT NULL,
  `status_movie_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4ygi2iee6iokm84k6dayard3d` (`status_movie_id`),
  CONSTRAINT `FK4ygi2iee6iokm84k6dayard3d` FOREIGN KEY (`status_movie_id`) REFERENCES `status_film` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES (1,'Huỳnh Tú Uyên, Trần Vân Anh, Trần Phong, Nam Nam, Vương Thanh Tùng, Hồ Quang Mẫn, Nguyễn Trung Huy, Hoa Thảo, Raman Quốc Cường','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/4/0/406x600-silent.jpg','Lấy cảm hứng từ trò chơi quen thuộc Năm Mười, câu chuyện xoay quanh một nhóm bạn cùng nhau đi nghỉ dưỡng tại Đà Lạt. Chuyến đi tưởng như chữa lành bỗng nhiên trở thành tai hoạ khi họ cùng chơi trò Năm Mười và một bí mật kinh hoàng năm xưa được hé lộ.','Tấn Hoàng Thông','80','Năm Mười','30/05/2025','Investra','http://youtube.com/watch?v=UQIBqQjXYbo&t=91s',2),(2,'Karen Nguyễn, Kay Trần, Thanh Duy, Nguyên Thảo, Lâm Hoàng Oanh, Mạc Trung Kiên, Nguyễn Hữu Tiến,...','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/_/d_i_y_h_-_payoff_poster_-_kc_06062025.jpg','Tú liên tục rơi vào vòng xoáy kỳ lạ khi những người cô quen biết dường như đã trở thành một người khác. Tình cờ một thế giới bí ẩn nằm sâu dưới đáy hồ mở ra, nơi bản sao tà ác của con người được hình thành và nuôi dưỡng bởi chấp niệm chưa được hóa giải củ','Trần Hữu Tấn','98','Dưới Đáy Hồ','06/06/2025','Production Q và HK Film','https://youtu.be/aDpPc-sMThQ',2),(3,'Quốc Trường, Mạc Đăng Khoa, Phương Thanh','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/u/t/utlan_firtlook_simple_layers_cmyk_1_.jpg','Sau sự ra đi của cha, Lan (Phương Thanh) về một vùng quê và ở đợ cho nhà ông Danh (Mạc Văn Khoa) - một người đàn ông góa vợ, không con cái. Ngay sau khi bước chân vào căn nhà, Lan phải đối mặt với hàng loạt hiện tượng kỳ dị và những cái chết bí ẩn liên tụ','Trần Trọng Dần','123','Út Lan: Oán Linh Giữ Của','20/06/2025','Nhà sản xuất phim kinh dị Việt Nam','https://www.youtube.com/watch?v=W3q2kI2q7Yc',2),(4,'Trấn Thành, Lê Giang, Lê Dương Bảo Lâm, Uyển Ân,...','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495btbt.jpg','Bộ tứ báo thủ bao gồm Chét-Xi-Cà, Dì Bốn, Cậu Mười Một, Con Kiều chính thức xuất hiện cùng với phi vụ báo thế kỉ. Nghe nói kế hoạch tiếp theo là ở Đà Lạt, liệu bốn báo thủ sẽ quậy Tết tung nóc cỡ nào?','Trấn Thành','132','Bộ Tứ Báo Thủ','29/01/2025','rấn Thành Films, Trấn Thành Town và Galaxy Studio','https://youtu.be/njfAWzmF6oY',3),(5,'Kaity Nguyễn, Trần Ngọc Vàng, Thanh Sơn','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/m/a/main_social_1_.jpg','Yêu Nhầm Bạn Thân kể câu chuyện tình yêu lãng mạn giữa khung cảnh tuyệt đẹp của Việt Nam, từ bờ cát trắng miền Trung đến núi rừng Tây Bắc. Bình An (Kaity Nguyễn), cô gái sống hết mình vì tình yêu, đang hạnh phúc bên bạn trai Vũ Trần (Thanh Sơn), một đạo d','Nguyễn Quang Dũng - Diệp Thế Vinh','106','Yêu Nhầm Bạn Thân','29/01/2025','HK Film, Galaxy Studio, KAT House và Trấn Thành Town','https://youtu.be/81v_4Fi-DGQ',3),(6,'Thu Trang, Đoàn Thiên Ân, Lê Xuân Tiền, Ma Ran Đô,...','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/n/_/n_h_n_b_c_t_-_payoff_poster_social_-_kc_m_ng_1_t_t_2025.jpg','Câu chuyện xoay quanh Vân - cô gái bán bánh mì vô tình gặp phải hai chàng trai trong một tai nạn nhỏ. Làm thế nào khi tiếng sét ái tình đánh một lúc cả ba người? Liệu giữa một chàng trai chững chạc, nam tính và một chàng trai đôi chút ngông nghênh, cool n','Thu Trang','100','Nụ Hôn Bạc Tỷ','29/01/2025','Công ty TNHH MTV Ngôi Sao Cineplex BHD Việt Nam','https://youtu.be/wr6MeifZCUs',3),(7,'Quang Tuấn, Khả Như, NSƯT Phú Đôn, Vân Dung, NSND Thanh Nam, Hoàng Mèo, Thanh Tân, Trung Ruồi, Kiều Chi,…','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/q/u/qu_nh_p_tr_ng_-_payoff_poster_-_kc_07032025_1_.jpg','Phim lấy cảm hứng từ câu chuyện có thật và “truyền thuyết kinh dị nhất về người chết sống lại” - Ở một ngôi làng vùng cao, cặp vợ chồng Quang và Như sống bằng nghề mai táng. Cuộc sống yên bình của họ bị xáo trộn khi phát hiện một cỗ quan tài vô chủ trên m','Pom Nguyễn','121','Quỷ Nhập Tràng','07/03/2025','Công ty TNHH AMF','https://youtu.be/fQKxDM-hxoU',3),(8,'Huỳnh Lập, Phương Mỹ Chi, NSƯT Hạnh Thuý, NSƯT Huỳnh Đông, Puka, Đào Anh Tuấn, Trung Dân, Kiều Linh, Lê Nam, Chí Tâm, Thanh Thức, Trác Thuý Miêu, Mai Thế Hiệp, NS Mạnh Dung, NSƯT Thanh Dậu, NS Thanh Hiền, Nguyễn Anh Tú,…','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/a/payoff_poster_ngt_master_sneak-2_1_.jpg','Nhà Gia Tiên xoay quanh câu chuyện đa góc nhìn về các thế hệ khác nhau trong một gia đình, có hai nhân vật chính là Gia Minh (Huỳnh Lập) và Mỹ Tiên (Phương Mỹ Chi). Trở về căn nhà gia tiên để quay các video “triệu view” trên mạng xã hội, Mỹ Tiên - một nhà','Huỳnh Lập','117','Nhà Gia Tiên\n','21/02/2025','17 Production','https://youtu.be/wfPTz0A23ns',2),(9,'NSƯT Kim Phương, Long Đẹp Trai, NSƯT Tuyết Thu, Quách Ngọc Tuyên, Đoàn Thế Vinh, Hồng Thu, Yuno Bigboi, Anh Tú Wilson, Bảo Ngọc, Tín Nguyễn, Hồ Đông Quan, Cherry Hải My, Rio Hạo Nhiên,…','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/l/m/lm8_-_470x700.jpg','Một bộ phim về sự khác biệt quan điểm giữa ba thế hệ ông bà cha mẹ con cháu. Ai cũng đúng ở góc nhìn của mình nhưng đứng trước hoài bão của tuổi trẻ, cuối cùng thì ai sẽ là người phải nghe theo người còn lại? Và nếu ước mơ của những đứa trẻ bị cho là viển','Lý Hải','135','Lật Mặt 8: Vòng Tay Trắng','30/04/2025','Lý Hải Production','https://youtu.be/hUlBTt3NyGI',1),(10,'Quốc Huy, Đinh Ngọc Diệp, Quốc Anh, Minh Anh, Anh Phạm,','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/t/ttk_poster_official_fa_1638x2048px_1_.jpg','Thám Tử Kiên là một nhân vật được yêu thích trong tác phẩm điện của ăn khách của NGƯỜI VỢ CUỐI CÙNG của Victor Vũ, Thám Tử Kiên: Kỳ Không Đầu sẽ là một phim Victor Vũ trở về với thể loại sở trường Kinh Dị - Trinh Thám sau những tác phẩm tình cảm lãng mạn ','Victor Vũ','131','Thám Tử Kiên: Kỳ Án Không Đầu','28/04/2025','Galaxy Studio và November Films','https://youtu.be/QiXNbEKF3U0',1),(11,'Wasabi Mizuta, Megumi Ôhara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki,...','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg','Thông qua món bảo bối mới của Doraemon, cả nhóm bạn bước thế giới trong một bức tranh nổi tiếng và bắt gặp cô bạn bí ẩn tên Claire. Với lời mời của Claire, cả nhóm cùng đến thăm vương quốc Artoria, nơi ẩn giấu một viên ngọc quý mang tên Artoria Blue đang ','Yukiyo Teramoto','105','Phim Điện Ảnh Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh','23/05/2025','Shin-Ei Animation, TV Asahi và ADK','https://youtu.be/Bz0zCdNBj1Q',1),(12,'Tom Cruise','https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/m/i/mi8_poster_470x700_1.jpg','Cuộc đời là tất thảy những lựa chọn. Tom Cruise thủ vai Ethan Hunt trở lại trong Nhiệm Vụ: Bất Khả Thi – Nghiệp Báo Cuối Cùng.','Christopher McQuarrie','168','Nhiệm vụ: Bất khả thi - Nghiệp báo cuối cùng','30/05/2025','Paramount Pictures','https://youtu.be/no2HdwAX8jI',1);
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_user`
--

DROP TABLE IF EXISTS `pending_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `card_id` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `gender` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmytt1m8uftte2v2p2kv5cgl1l` (`email`),
  UNIQUE KEY `UKcsw8ejily03onmxkpyb4s0kco` (`verification_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_user`
--

LOCK TABLES `pending_user` WRITE;
/*!40000 ALTER TABLE `pending_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('PERCENTAGE','FIXED_AMOUNT') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_active_dates` (`is_active`,`start_date`,`end_date`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'WELCOME10','Chào mừng khách hàng mới','Giảm 10% cho đơn hàng đầu tiên','PERCENTAGE',10.00,50000.00,30000.00,100,3,'2025-01-01 00:00:00','2025-12-31 23:59:59',1,'2025-06-27 08:28:42','2025-07-10 02:48:44',_binary '\0'),(2,'SAVE50K','Giảm 50K','Giảm 50,000 VND cho đơn hàng từ 200,000 VND','FIXED_AMOUNT',50000.00,200000.00,NULL,50,0,'2025-01-01 00:00:00','2025-12-31 23:59:59',1,'2025-06-27 08:28:42','2025-07-01 23:07:24',_binary '\0'),(3,'STUDENT30','Ưu đãi sinh viên','Giảm 20% dành cho sinh viên','PERCENTAGE',30.00,100000.00,30000.00,200,3,'2024-12-31 10:00:00','2025-12-31 09:59:00',1,'2025-06-27 08:28:42','2025-07-10 02:35:38',_binary '\0'),(4,'WEEKEND15','Cuối tuần vui vẻ','Giảm 15% cho vé cuối tuần','PERCENTAGE',15.00,80000.00,40000.00,3,0,'2024-12-31 17:00:00','2025-12-31 16:59:00',0,'2025-06-27 08:28:42','2025-07-10 02:37:52',_binary ''),(5,'WELCOME2024','Chào mừng khách hàng mới','Giảm 50,000 VNĐ cho lần đặt vé đầu tiên','FIXED_AMOUNT',500000.00,70000.00,0.00,1,0,'2025-07-01 22:22:00','2025-07-08 22:22:00',0,'2025-07-01 22:28:18','2025-07-03 04:40:56',_binary '');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `sentiment` varchar(255) DEFAULT NULL,
  `sentiment_core` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `movie_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKovijrmb7g6cvqvlgr25vb8r98` (`user_id`,`movie_id`),
  KEY `FK3porbhr60s155pxy7h6q8r1de` (`movie_id`),
  CONSTRAINT `FK3porbhr60s155pxy7h6q8r1de` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`),
  CONSTRAINT `FKsdlcf7wf8l1k0m00gik0m6b1m` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'hhhhhhhhhhhhhhh','2025-07-08 22:58:38.000000',5,'positive',0.7,'2025-07-08 22:58:38.000000',11,2),(3,'phim rất hay nha','2025-07-08 23:03:29.000000',1,'negative',0.3,'2025-07-10 09:55:41.000000',12,2),(4,'oke đó hihihi','2025-07-08 23:09:28.000000',5,'positive',0.8,'2025-07-08 23:09:28.000000',12,5);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ROLE_USER'),(2,'ROLE_ADMIN');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `price_couple_seat` int(11) NOT NULL,
  `price_normal_seat` int(11) NOT NULL,
  `quantity_couple_seat` int(11) NOT NULL,
  `quantity_normal_seat` int(11) NOT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `total_seats` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'Phòng thoải mái',85000,70000,8,90,'Phòng 1',1,98),(2,'Phòng đẹp, 3D',75000,65000,8,99,'Phòng 2',1,107);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `seat_column` int(11) NOT NULL,
  `seat_number` varchar(255) DEFAULT NULL,
  `seat_row` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd7f42843rt05tt66t6vcb7s9u` (`room_id`),
  CONSTRAINT `FKd7f42843rt05tt66t6vcb7s9u` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat`
--

LOCK TABLES `seat` WRITE;
/*!40000 ALTER TABLE `seat` DISABLE KEYS */;
INSERT INTO `seat` VALUES (1,'Ghế thường',70000,1,'A1','A',0,1),(2,'Ghế thường',70000,2,'A2','A',0,1),(3,'Ghế thường',70000,3,'A3','A',0,1),(4,'Ghế thường',70000,4,'A4','A',0,1),(5,'Ghế thường',70000,5,'A5','A',0,1),(6,'Ghế thường',70000,6,'A6','A',0,1),(7,'Ghế thường',70000,7,'A7','A',0,1),(8,'Ghế thường',70000,8,'A8','A',0,1),(9,'Ghế thường',70000,9,'A9','A',0,1),(10,'Ghế thường',70000,10,'A10','A',0,1),(11,'Ghế thường',70000,11,'A11','A',0,1),(12,'Ghế thường',70000,12,'A12','A',0,1),(13,'Ghế thường',70000,13,'A13','A',0,1),(14,'Ghế thường',70000,14,'A14','A',0,1),(15,'Ghế thường',70000,15,'A15','A',0,1),(16,'Ghế thường',70000,1,'B1','B',0,1),(17,'Ghế thường',70000,2,'B2','B',0,1),(18,'Ghế thường',70000,3,'B3','B',0,1),(19,'Ghế thường',70000,4,'B4','B',0,1),(20,'Ghế thường',70000,5,'B5','B',0,1),(21,'Ghế thường',70000,6,'B6','B',0,1),(22,'Ghế thường',70000,7,'B7','B',0,1),(23,'Ghế thường',70000,8,'B8','B',0,1),(24,'Ghế thường',70000,9,'B9','B',0,1),(25,'Ghế thường',70000,10,'B10','B',0,1),(26,'Ghế thường',70000,11,'B11','B',0,1),(27,'Ghế thường',70000,12,'B12','B',0,1),(28,'Ghế thường',70000,13,'B13','B',0,1),(29,'Ghế thường',70000,14,'B14','B',0,1),(30,'Ghế thường',70000,15,'B15','B',0,1),(31,'Ghế thường',70000,1,'C1','C',0,1),(32,'Ghế thường',70000,2,'C2','C',0,1),(33,'Ghế thường',70000,3,'C3','C',0,1),(34,'Ghế thường',70000,4,'C4','C',0,1),(35,'Ghế thường',70000,5,'C5','C',0,1),(36,'Ghế thường',70000,6,'C6','C',0,1),(37,'Ghế thường',70000,7,'C7','C',0,1),(38,'Ghế thường',70000,8,'C8','C',0,1),(39,'Ghế thường',70000,9,'C9','C',0,1),(40,'Ghế thường',70000,10,'C10','C',0,1),(41,'Ghế thường',70000,11,'C11','C',0,1),(42,'Ghế thường',70000,12,'C12','C',0,1),(43,'Ghế thường',70000,13,'C13','C',0,1),(44,'Ghế thường',70000,14,'C14','C',0,1),(45,'Ghế thường',70000,15,'C15','C',0,1),(46,'Ghế thường',70000,1,'D1','D',0,1),(47,'Ghế thường',70000,2,'D2','D',0,1),(48,'Ghế thường',70000,3,'D3','D',0,1),(49,'Ghế thường',70000,4,'D4','D',0,1),(50,'Ghế thường',70000,5,'D5','D',0,1),(51,'Ghế thường',70000,6,'D6','D',0,1),(52,'Ghế thường',70000,7,'D7','D',0,1),(53,'Ghế thường',70000,8,'D8','D',0,1),(54,'Ghế thường',70000,9,'D9','D',0,1),(55,'Ghế thường',70000,10,'D10','D',0,1),(56,'Ghế thường',70000,11,'D11','D',0,1),(57,'Ghế thường',70000,12,'D12','D',0,1),(58,'Ghế thường',70000,13,'D13','D',0,1),(59,'Ghế thường',70000,14,'D14','D',0,1),(60,'Ghế thường',70000,15,'D15','D',0,1),(61,'Ghế thường',70000,1,'E1','E',0,1),(62,'Ghế thường',70000,2,'E2','E',0,1),(63,'Ghế thường',70000,3,'E3','E',0,1),(64,'Ghế thường',70000,4,'E4','E',0,1),(65,'Ghế thường',70000,5,'E5','E',0,1),(66,'Ghế thường',70000,6,'E6','E',0,1),(67,'Ghế thường',70000,7,'E7','E',0,1),(68,'Ghế thường',70000,8,'E8','E',0,1),(69,'Ghế thường',70000,9,'E9','E',0,1),(70,'Ghế thường',70000,10,'E10','E',0,1),(71,'Ghế thường',70000,11,'E11','E',0,1),(72,'Ghế thường',70000,12,'E12','E',0,1),(73,'Ghế thường',70000,13,'E13','E',0,1),(74,'Ghế thường',70000,14,'E14','E',0,1),(75,'Ghế thường',70000,15,'E15','E',0,1),(76,'Ghế thường',70000,1,'F1','F',0,1),(77,'Ghế thường',70000,2,'F2','F',0,1),(78,'Ghế thường',70000,3,'F3','F',0,1),(79,'Ghế thường',70000,4,'F4','F',0,1),(80,'Ghế thường',70000,5,'F5','F',0,1),(81,'Ghế thường',70000,6,'F6','F',0,1),(82,'Ghế thường',70000,7,'F7','F',0,1),(83,'Ghế thường',70000,8,'F8','F',0,1),(84,'Ghế thường',70000,9,'F9','F',0,1),(85,'Ghế thường',70000,10,'F10','F',0,1),(86,'Ghế thường',70000,11,'F11','F',0,1),(87,'Ghế thường',70000,12,'F12','F',0,1),(88,'Ghế thường',70000,13,'F13','F',0,1),(89,'Ghế thường',70000,14,'F14','F',0,1),(90,'Ghế thường',70000,15,'F15','F',0,1),(91,'Ghế đôi',85000,1,'H1','H',0,1),(92,'Ghế đôi',85000,2,'H2','H',0,1),(93,'Ghế đôi',85000,3,'H3','H',0,1),(94,'Ghế đôi',85000,4,'H4','H',0,1),(95,'Ghế đôi',85000,5,'H5','H',0,1),(96,'Ghế đôi',85000,1,'I1','I',0,1),(97,'Ghế đôi',85000,2,'I2','I',0,1),(98,'Ghế đôi',85000,3,'I3','I',0,1),(99,'Ghế thường',65000,1,'A1','A',0,2),(100,'Ghế thường',65000,2,'A2','A',0,2),(101,'Ghế thường',65000,3,'A3','A',0,2),(102,'Ghế thường',65000,4,'A4','A',0,2),(103,'Ghế thường',65000,5,'A5','A',0,2),(104,'Ghế thường',65000,6,'A6','A',0,2),(105,'Ghế thường',65000,7,'A7','A',0,2),(106,'Ghế thường',65000,8,'A8','A',0,2),(107,'Ghế thường',65000,9,'A9','A',0,2),(108,'Ghế thường',65000,10,'A10','A',0,2),(109,'Ghế thường',65000,11,'A11','A',0,2),(110,'Ghế thường',65000,12,'A12','A',0,2),(111,'Ghế thường',65000,13,'A13','A',0,2),(112,'Ghế thường',65000,14,'A14','A',0,2),(113,'Ghế thường',65000,15,'A15','A',0,2),(114,'Ghế thường',65000,1,'B1','B',0,2),(115,'Ghế thường',65000,2,'B2','B',0,2),(116,'Ghế thường',65000,3,'B3','B',0,2),(117,'Ghế thường',65000,4,'B4','B',0,2),(118,'Ghế thường',65000,5,'B5','B',0,2),(119,'Ghế thường',65000,6,'B6','B',0,2),(120,'Ghế thường',65000,7,'B7','B',0,2),(121,'Ghế thường',65000,8,'B8','B',0,2),(122,'Ghế thường',65000,9,'B9','B',0,2),(123,'Ghế thường',65000,10,'B10','B',0,2),(124,'Ghế thường',65000,11,'B11','B',0,2),(125,'Ghế thường',65000,12,'B12','B',0,2),(126,'Ghế thường',65000,13,'B13','B',0,2),(127,'Ghế thường',65000,14,'B14','B',0,2),(128,'Ghế thường',65000,15,'B15','B',0,2),(129,'Ghế thường',65000,1,'C1','C',0,2),(130,'Ghế thường',65000,2,'C2','C',0,2),(131,'Ghế thường',65000,3,'C3','C',0,2),(132,'Ghế thường',65000,4,'C4','C',0,2),(133,'Ghế thường',65000,5,'C5','C',0,2),(134,'Ghế thường',65000,6,'C6','C',0,2),(135,'Ghế thường',65000,7,'C7','C',0,2),(136,'Ghế thường',65000,8,'C8','C',0,2),(137,'Ghế thường',65000,9,'C9','C',0,2),(138,'Ghế thường',65000,10,'C10','C',0,2),(139,'Ghế thường',65000,11,'C11','C',0,2),(140,'Ghế thường',65000,12,'C12','C',0,2),(141,'Ghế thường',65000,13,'C13','C',0,2),(142,'Ghế thường',65000,14,'C14','C',0,2),(143,'Ghế thường',65000,15,'C15','C',0,2),(144,'Ghế thường',65000,1,'D1','D',0,2),(145,'Ghế thường',65000,2,'D2','D',0,2),(146,'Ghế thường',65000,3,'D3','D',0,2),(147,'Ghế thường',65000,4,'D4','D',0,2),(148,'Ghế thường',65000,5,'D5','D',0,2),(149,'Ghế thường',65000,6,'D6','D',0,2),(150,'Ghế thường',65000,7,'D7','D',0,2),(151,'Ghế thường',65000,8,'D8','D',0,2),(152,'Ghế thường',65000,9,'D9','D',0,2),(153,'Ghế thường',65000,10,'D10','D',0,2),(154,'Ghế thường',65000,11,'D11','D',0,2),(155,'Ghế thường',65000,12,'D12','D',0,2),(156,'Ghế thường',65000,13,'D13','D',0,2),(157,'Ghế thường',65000,14,'D14','D',0,2),(158,'Ghế thường',65000,15,'D15','D',0,2),(159,'Ghế thường',65000,1,'E1','E',0,2),(160,'Ghế thường',65000,2,'E2','E',0,2),(161,'Ghế thường',65000,3,'E3','E',0,2),(162,'Ghế thường',65000,4,'E4','E',0,2),(163,'Ghế thường',65000,5,'E5','E',0,2),(164,'Ghế thường',65000,6,'E6','E',0,2),(165,'Ghế thường',65000,7,'E7','E',0,2),(166,'Ghế thường',65000,8,'E8','E',0,2),(167,'Ghế thường',65000,9,'E9','E',0,2),(168,'Ghế thường',65000,10,'E10','E',0,2),(169,'Ghế thường',65000,11,'E11','E',0,2),(170,'Ghế thường',65000,12,'E12','E',0,2),(171,'Ghế thường',65000,13,'E13','E',0,2),(172,'Ghế thường',65000,14,'E14','E',0,2),(173,'Ghế thường',65000,15,'E15','E',0,2),(174,'Ghế thường',65000,1,'F1','F',0,2),(175,'Ghế thường',65000,2,'F2','F',0,2),(176,'Ghế thường',65000,3,'F3','F',0,2),(177,'Ghế thường',65000,4,'F4','F',0,2),(178,'Ghế thường',65000,5,'F5','F',0,2),(179,'Ghế thường',65000,6,'F6','F',0,2),(180,'Ghế thường',65000,7,'F7','F',0,2),(181,'Ghế thường',65000,8,'F8','F',0,2),(182,'Ghế thường',65000,9,'F9','F',0,2),(183,'Ghế thường',65000,10,'F10','F',0,2),(184,'Ghế thường',65000,11,'F11','F',0,2),(185,'Ghế thường',65000,12,'F12','F',0,2),(186,'Ghế thường',65000,13,'F13','F',0,2),(187,'Ghế thường',65000,14,'F14','F',0,2),(188,'Ghế thường',65000,15,'F15','F',0,2),(189,'Ghế thường',65000,1,'G1','G',0,2),(190,'Ghế thường',65000,2,'G2','G',0,2),(191,'Ghế thường',65000,3,'G3','G',0,2),(192,'Ghế thường',65000,4,'G4','G',0,2),(193,'Ghế thường',65000,5,'G5','G',0,2),(194,'Ghế thường',65000,6,'G6','G',0,2),(195,'Ghế thường',65000,7,'G7','G',0,2),(196,'Ghế thường',65000,8,'G8','G',0,2),(197,'Ghế thường',65000,9,'G9','G',0,2),(198,'Ghế đôi',75000,1,'H1','H',0,2),(199,'Ghế đôi',75000,2,'H2','H',0,2),(200,'Ghế đôi',75000,3,'H3','H',0,2),(201,'Ghế đôi',75000,4,'H4','H',0,2),(202,'Ghế đôi',75000,5,'H5','H',0,2),(203,'Ghế đôi',75000,1,'I1','I',0,2),(204,'Ghế đôi',75000,2,'I2','I',0,2),(205,'Ghế đôi',75000,3,'I3','I',0,2);
/*!40000 ALTER TABLE `seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `show_time_seat`
--

DROP TABLE IF EXISTS `show_time_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `show_time_seat` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) DEFAULT NULL,
  `lock_expires_at` datetime(6) DEFAULT NULL,
  `locked_at` datetime(6) DEFAULT NULL,
  `locked_by_user_id` bigint(20) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `seat_id` bigint(20) NOT NULL,
  `showtime_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhwacpq2mhk9hpjaw3f7b5icny` (`seat_id`),
  KEY `FKph2vaor7smoihykyivugq1j8w` (`showtime_id`),
  CONSTRAINT `FKhwacpq2mhk9hpjaw3f7b5icny` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`),
  CONSTRAINT `FKph2vaor7smoihykyivugq1j8w` FOREIGN KEY (`showtime_id`) REFERENCES `showtime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=598 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show_time_seat`
--

LOCK TABLES `show_time_seat` WRITE;
/*!40000 ALTER TABLE `show_time_seat` DISABLE KEYS */;
INSERT INTO `show_time_seat` VALUES (1,NULL,NULL,NULL,NULL,70000,0,1,1),(2,NULL,NULL,NULL,NULL,70000,0,2,1),(3,NULL,NULL,NULL,NULL,70000,0,3,1),(4,NULL,NULL,NULL,NULL,70000,0,4,1),(5,NULL,NULL,NULL,NULL,70000,0,5,1),(6,NULL,NULL,NULL,NULL,70000,0,6,1),(7,24,NULL,'2025-07-01 12:40:30.000000',5,70000,2,7,1),(8,NULL,NULL,NULL,NULL,70000,0,8,1),(9,24,NULL,'2025-07-01 12:40:30.000000',5,70000,2,9,1),(10,NULL,NULL,NULL,NULL,70000,0,10,1),(11,21,NULL,'2025-06-24 22:33:02.000000',2,70000,2,11,1),(12,NULL,NULL,NULL,NULL,70000,0,12,1),(13,24,NULL,'2025-07-01 12:40:29.000000',5,70000,2,13,1),(14,29,NULL,'2025-07-09 12:42:29.000000',2,70000,2,14,1),(15,NULL,NULL,NULL,NULL,70000,0,15,1),(16,NULL,NULL,NULL,NULL,70000,0,16,1),(17,NULL,NULL,NULL,NULL,70000,0,17,1),(18,NULL,NULL,NULL,NULL,70000,0,18,1),(19,26,NULL,'2025-07-09 11:34:07.000000',2,70000,2,19,1),(20,NULL,NULL,NULL,NULL,70000,0,20,1),(21,NULL,NULL,NULL,NULL,70000,0,21,1),(22,NULL,NULL,NULL,NULL,70000,0,22,1),(23,NULL,NULL,NULL,NULL,70000,0,23,1),(24,NULL,NULL,NULL,NULL,70000,0,24,1),(25,5,NULL,NULL,0,70000,0,25,1),(26,21,NULL,'2025-06-24 22:33:02.000000',2,70000,2,26,1),(27,11,NULL,'2025-06-21 10:39:24.000000',2,70000,2,27,1),(28,5,NULL,NULL,0,70000,0,28,1),(29,11,NULL,'2025-06-21 10:39:24.000000',2,70000,2,29,1),(30,NULL,NULL,NULL,NULL,70000,0,30,1),(31,NULL,NULL,NULL,NULL,70000,0,31,1),(32,NULL,NULL,NULL,NULL,70000,0,32,1),(33,NULL,NULL,NULL,NULL,70000,0,33,1),(34,NULL,NULL,NULL,NULL,70000,0,34,1),(35,NULL,NULL,NULL,NULL,70000,0,35,1),(36,NULL,NULL,NULL,NULL,70000,0,36,1),(37,NULL,NULL,NULL,NULL,70000,0,37,1),(38,6,NULL,'2025-06-21 09:32:08.000000',2,70000,2,38,1),(39,6,NULL,'2025-06-21 09:32:08.000000',2,70000,2,39,1),(40,NULL,NULL,NULL,NULL,70000,0,40,1),(41,4,NULL,NULL,0,70000,0,41,1),(42,5,NULL,NULL,0,70000,0,42,1),(43,11,NULL,'2025-06-21 10:39:24.000000',2,70000,2,43,1),(44,NULL,NULL,NULL,NULL,70000,0,44,1),(45,NULL,NULL,NULL,NULL,70000,0,45,1),(46,NULL,NULL,NULL,NULL,70000,0,46,1),(47,NULL,NULL,NULL,NULL,70000,0,47,1),(48,NULL,NULL,NULL,NULL,70000,0,48,1),(49,NULL,NULL,NULL,NULL,70000,0,49,1),(50,NULL,NULL,NULL,NULL,70000,0,50,1),(51,NULL,NULL,NULL,NULL,70000,0,51,1),(52,NULL,NULL,NULL,NULL,70000,0,52,1),(53,NULL,NULL,NULL,NULL,70000,0,53,1),(54,NULL,NULL,NULL,NULL,70000,0,54,1),(55,4,NULL,NULL,0,70000,0,55,1),(56,18,NULL,'2025-06-21 10:46:42.000000',2,70000,2,56,1),(57,NULL,NULL,NULL,NULL,70000,0,57,1),(58,NULL,NULL,NULL,NULL,70000,0,58,1),(59,NULL,NULL,NULL,NULL,70000,0,59,1),(60,NULL,NULL,NULL,NULL,70000,0,60,1),(61,NULL,NULL,NULL,NULL,70000,0,61,1),(62,NULL,NULL,NULL,NULL,70000,0,62,1),(63,NULL,NULL,NULL,NULL,70000,0,63,1),(64,NULL,NULL,NULL,NULL,70000,0,64,1),(65,NULL,NULL,NULL,NULL,70000,0,65,1),(66,27,NULL,'2025-07-09 11:37:27.000000',2,70000,2,66,1),(67,NULL,NULL,NULL,NULL,70000,0,67,1),(68,NULL,NULL,NULL,NULL,70000,0,68,1),(69,NULL,NULL,NULL,NULL,70000,0,69,1),(70,NULL,NULL,NULL,NULL,70000,0,70,1),(71,18,NULL,'2025-06-21 10:46:42.000000',2,70000,2,71,1),(72,NULL,NULL,NULL,NULL,70000,0,72,1),(73,NULL,NULL,NULL,NULL,70000,0,73,1),(74,NULL,NULL,NULL,NULL,70000,0,74,1),(75,NULL,NULL,NULL,NULL,70000,0,75,1),(76,NULL,NULL,NULL,NULL,70000,0,76,1),(77,NULL,NULL,NULL,NULL,70000,0,77,1),(78,NULL,NULL,NULL,NULL,70000,0,78,1),(79,NULL,NULL,NULL,NULL,70000,0,79,1),(80,NULL,NULL,NULL,NULL,70000,0,80,1),(81,NULL,NULL,NULL,NULL,70000,0,81,1),(82,NULL,NULL,NULL,NULL,70000,0,82,1),(83,NULL,NULL,NULL,NULL,70000,0,83,1),(84,NULL,NULL,NULL,NULL,70000,0,84,1),(85,NULL,NULL,NULL,NULL,70000,0,85,1),(86,NULL,NULL,NULL,NULL,70000,0,86,1),(87,NULL,NULL,NULL,NULL,70000,0,87,1),(88,NULL,NULL,NULL,NULL,70000,0,88,1),(89,22,NULL,'2025-06-27 15:35:49.000000',5,70000,2,89,1),(90,NULL,NULL,NULL,NULL,70000,0,90,1),(91,NULL,NULL,NULL,NULL,85000,0,91,1),(92,NULL,NULL,NULL,NULL,85000,0,92,1),(93,NULL,NULL,NULL,NULL,85000,0,93,1),(94,NULL,NULL,NULL,NULL,85000,0,94,1),(95,NULL,NULL,NULL,NULL,85000,0,95,1),(96,NULL,NULL,NULL,NULL,85000,0,96,1),(97,NULL,NULL,NULL,NULL,85000,0,97,1),(98,NULL,NULL,NULL,NULL,85000,0,98,1),(99,25,NULL,NULL,0,70000,0,1,2),(100,25,NULL,NULL,0,70000,0,2,2),(101,25,NULL,NULL,0,70000,0,3,2),(102,NULL,NULL,NULL,NULL,70000,0,4,2),(103,NULL,NULL,NULL,NULL,70000,0,5,2),(104,NULL,NULL,NULL,NULL,70000,0,6,2),(105,NULL,NULL,NULL,NULL,70000,0,7,2),(106,NULL,NULL,NULL,NULL,70000,0,8,2),(107,NULL,NULL,NULL,NULL,70000,0,9,2),(108,34,NULL,'2025-07-10 18:42:10.000000',2,70000,2,10,2),(109,NULL,NULL,NULL,NULL,70000,0,11,2),(110,NULL,NULL,NULL,NULL,70000,0,12,2),(111,NULL,NULL,NULL,NULL,70000,0,13,2),(112,NULL,NULL,NULL,NULL,70000,0,14,2),(113,NULL,NULL,NULL,NULL,70000,0,15,2),(114,NULL,NULL,NULL,NULL,70000,0,16,2),(115,NULL,NULL,NULL,NULL,70000,0,17,2),(116,NULL,NULL,NULL,NULL,70000,0,18,2),(117,NULL,NULL,NULL,NULL,70000,0,19,2),(118,8,NULL,'2025-06-21 09:47:35.000000',2,70000,2,20,2),(119,NULL,NULL,NULL,NULL,70000,0,21,2),(120,NULL,NULL,NULL,NULL,70000,0,22,2),(121,NULL,NULL,NULL,NULL,70000,0,23,2),(122,NULL,NULL,NULL,NULL,70000,0,24,2),(123,NULL,NULL,NULL,NULL,70000,0,25,2),(124,NULL,NULL,NULL,NULL,70000,0,26,2),(125,NULL,NULL,NULL,NULL,70000,0,27,2),(126,8,NULL,'2025-06-21 09:47:35.000000',2,70000,2,28,2),(127,NULL,NULL,NULL,NULL,70000,0,29,2),(128,NULL,NULL,NULL,NULL,70000,0,30,2),(129,NULL,NULL,NULL,NULL,70000,0,31,2),(130,NULL,NULL,NULL,NULL,70000,0,32,2),(131,NULL,NULL,NULL,NULL,70000,0,33,2),(132,NULL,NULL,NULL,NULL,70000,0,34,2),(133,NULL,NULL,NULL,NULL,70000,0,35,2),(134,8,NULL,'2025-06-21 09:47:35.000000',2,70000,2,36,2),(135,NULL,NULL,NULL,NULL,70000,0,37,2),(136,NULL,NULL,NULL,NULL,70000,0,38,2),(137,NULL,NULL,NULL,NULL,70000,0,39,2),(138,NULL,NULL,NULL,NULL,70000,0,40,2),(139,NULL,NULL,NULL,NULL,70000,0,41,2),(140,NULL,NULL,NULL,NULL,70000,0,42,2),(141,NULL,NULL,NULL,NULL,70000,0,43,2),(142,NULL,NULL,NULL,NULL,70000,0,44,2),(143,NULL,NULL,NULL,NULL,70000,0,45,2),(144,NULL,NULL,NULL,NULL,70000,0,46,2),(145,NULL,NULL,NULL,NULL,70000,0,47,2),(146,NULL,NULL,NULL,NULL,70000,0,48,2),(147,NULL,NULL,NULL,NULL,70000,0,49,2),(148,NULL,NULL,NULL,NULL,70000,0,50,2),(149,NULL,NULL,NULL,NULL,70000,0,51,2),(150,NULL,NULL,NULL,NULL,70000,0,52,2),(151,NULL,NULL,NULL,NULL,70000,0,53,2),(152,NULL,NULL,NULL,NULL,70000,0,54,2),(153,NULL,NULL,NULL,NULL,70000,0,55,2),(154,NULL,NULL,NULL,NULL,70000,0,56,2),(155,NULL,NULL,NULL,NULL,70000,0,57,2),(156,NULL,NULL,NULL,NULL,70000,0,58,2),(157,NULL,NULL,NULL,NULL,70000,0,59,2),(158,NULL,NULL,NULL,NULL,70000,0,60,2),(159,NULL,NULL,NULL,NULL,70000,0,61,2),(160,NULL,NULL,NULL,NULL,70000,0,62,2),(161,NULL,NULL,NULL,NULL,70000,0,63,2),(162,NULL,NULL,NULL,NULL,70000,0,64,2),(163,NULL,NULL,NULL,NULL,70000,0,65,2),(164,NULL,NULL,NULL,NULL,70000,0,66,2),(165,NULL,NULL,NULL,NULL,70000,0,67,2),(166,NULL,NULL,NULL,NULL,70000,0,68,2),(167,NULL,NULL,NULL,NULL,70000,0,69,2),(168,NULL,NULL,NULL,NULL,70000,0,70,2),(169,NULL,NULL,NULL,NULL,70000,0,71,2),(170,NULL,NULL,NULL,NULL,70000,0,72,2),(171,NULL,NULL,NULL,NULL,70000,0,73,2),(172,NULL,NULL,NULL,NULL,70000,0,74,2),(173,NULL,NULL,NULL,NULL,70000,0,75,2),(174,NULL,NULL,NULL,NULL,70000,0,76,2),(175,NULL,NULL,NULL,NULL,70000,0,77,2),(176,NULL,NULL,NULL,NULL,70000,0,78,2),(177,NULL,NULL,NULL,NULL,70000,0,79,2),(178,NULL,NULL,NULL,NULL,70000,0,80,2),(179,NULL,NULL,NULL,NULL,70000,0,81,2),(180,NULL,NULL,NULL,NULL,70000,0,82,2),(181,NULL,NULL,NULL,NULL,70000,0,83,2),(182,NULL,NULL,NULL,NULL,70000,0,84,2),(183,NULL,NULL,NULL,NULL,70000,0,85,2),(184,NULL,NULL,NULL,NULL,70000,0,86,2),(185,NULL,NULL,NULL,NULL,70000,0,87,2),(186,NULL,NULL,NULL,NULL,70000,0,88,2),(187,NULL,NULL,NULL,NULL,70000,0,89,2),(188,NULL,NULL,NULL,NULL,70000,0,90,2),(189,NULL,NULL,NULL,NULL,85000,0,91,2),(190,NULL,NULL,NULL,NULL,85000,0,92,2),(191,NULL,NULL,NULL,NULL,85000,0,93,2),(192,NULL,NULL,NULL,NULL,85000,0,94,2),(193,NULL,NULL,NULL,NULL,85000,0,95,2),(194,NULL,NULL,NULL,NULL,85000,0,96,2),(195,NULL,NULL,NULL,NULL,85000,0,97,2),(196,NULL,NULL,NULL,NULL,85000,0,98,2),(197,NULL,NULL,NULL,NULL,70000,0,1,3),(198,NULL,NULL,NULL,NULL,70000,0,2,3),(199,NULL,NULL,NULL,NULL,70000,0,3,3),(200,NULL,NULL,NULL,NULL,70000,0,4,3),(201,NULL,NULL,NULL,NULL,70000,0,5,3),(202,NULL,NULL,NULL,NULL,70000,0,6,3),(203,NULL,NULL,NULL,NULL,70000,0,7,3),(204,NULL,NULL,NULL,NULL,70000,0,8,3),(205,9,NULL,'2025-06-21 09:48:54.000000',2,70000,2,9,3),(206,9,NULL,'2025-06-21 09:48:54.000000',2,70000,2,10,3),(207,NULL,NULL,NULL,NULL,70000,0,11,3),(208,NULL,NULL,NULL,NULL,70000,0,12,3),(209,NULL,NULL,NULL,NULL,70000,0,13,3),(210,NULL,NULL,NULL,NULL,70000,0,14,3),(211,NULL,NULL,NULL,NULL,70000,0,15,3),(212,NULL,NULL,NULL,NULL,70000,0,16,3),(213,NULL,NULL,NULL,NULL,70000,0,17,3),(214,NULL,NULL,NULL,NULL,70000,0,18,3),(215,NULL,NULL,NULL,NULL,70000,0,19,3),(216,NULL,NULL,NULL,NULL,70000,0,20,3),(217,NULL,NULL,NULL,NULL,70000,0,21,3),(218,NULL,NULL,NULL,NULL,70000,0,22,3),(219,NULL,NULL,NULL,NULL,70000,0,23,3),(220,NULL,NULL,NULL,NULL,70000,0,24,3),(221,NULL,NULL,NULL,NULL,70000,0,25,3),(222,NULL,NULL,NULL,NULL,70000,0,26,3),(223,NULL,NULL,NULL,NULL,70000,0,27,3),(224,NULL,NULL,NULL,NULL,70000,0,28,3),(225,NULL,NULL,NULL,NULL,70000,0,29,3),(226,NULL,NULL,NULL,NULL,70000,0,30,3),(227,NULL,NULL,NULL,NULL,70000,0,31,3),(228,NULL,NULL,NULL,NULL,70000,0,32,3),(229,NULL,NULL,NULL,NULL,70000,0,33,3),(230,NULL,NULL,NULL,NULL,70000,0,34,3),(231,19,NULL,NULL,0,70000,0,35,3),(232,NULL,NULL,NULL,NULL,70000,0,36,3),(233,NULL,NULL,NULL,NULL,70000,0,37,3),(234,NULL,NULL,NULL,NULL,70000,0,38,3),(235,NULL,NULL,NULL,NULL,70000,0,39,3),(236,NULL,NULL,NULL,NULL,70000,0,40,3),(237,33,NULL,'2025-07-10 09:47:39.000000',2,70000,2,41,3),(238,33,NULL,'2025-07-10 09:47:39.000000',2,70000,2,42,3),(239,NULL,NULL,NULL,NULL,70000,0,43,3),(240,NULL,NULL,NULL,NULL,70000,0,44,3),(241,NULL,NULL,NULL,NULL,70000,0,45,3),(242,NULL,NULL,NULL,NULL,70000,0,46,3),(243,NULL,NULL,NULL,NULL,70000,0,47,3),(244,NULL,NULL,NULL,NULL,70000,0,48,3),(245,NULL,NULL,NULL,NULL,70000,0,49,3),(246,NULL,NULL,NULL,NULL,70000,0,50,3),(247,19,NULL,NULL,0,70000,0,51,3),(248,NULL,NULL,NULL,NULL,70000,0,52,3),(249,NULL,NULL,NULL,NULL,70000,0,53,3),(250,NULL,NULL,NULL,NULL,70000,0,54,3),(251,NULL,NULL,NULL,NULL,70000,0,55,3),(252,NULL,NULL,NULL,NULL,70000,0,56,3),(253,NULL,NULL,NULL,NULL,70000,0,57,3),(254,NULL,NULL,NULL,NULL,70000,0,58,3),(255,NULL,NULL,NULL,NULL,70000,0,59,3),(256,NULL,NULL,NULL,NULL,70000,0,60,3),(257,NULL,NULL,NULL,NULL,70000,0,61,3),(258,NULL,NULL,NULL,NULL,70000,0,62,3),(259,NULL,NULL,NULL,NULL,70000,0,63,3),(260,NULL,NULL,NULL,NULL,70000,0,64,3),(261,NULL,NULL,NULL,NULL,70000,0,65,3),(262,NULL,NULL,NULL,NULL,70000,0,66,3),(263,NULL,NULL,NULL,NULL,70000,0,67,3),(264,NULL,NULL,NULL,NULL,70000,0,68,3),(265,NULL,NULL,NULL,NULL,70000,0,69,3),(266,NULL,NULL,NULL,NULL,70000,0,70,3),(267,30,NULL,NULL,0,70000,0,71,3),(268,30,NULL,NULL,0,70000,0,72,3),(269,30,NULL,NULL,0,70000,0,73,3),(270,NULL,NULL,NULL,NULL,70000,0,74,3),(271,NULL,NULL,NULL,NULL,70000,0,75,3),(272,NULL,NULL,NULL,NULL,70000,0,76,3),(273,NULL,NULL,NULL,NULL,70000,0,77,3),(274,NULL,NULL,NULL,NULL,70000,0,78,3),(275,NULL,NULL,NULL,NULL,70000,0,79,3),(276,NULL,NULL,NULL,NULL,70000,0,80,3),(277,NULL,NULL,NULL,NULL,70000,0,81,3),(278,NULL,NULL,NULL,NULL,70000,0,82,3),(279,NULL,NULL,NULL,NULL,70000,0,83,3),(280,NULL,NULL,NULL,NULL,70000,0,84,3),(281,NULL,NULL,NULL,NULL,70000,0,85,3),(282,NULL,NULL,NULL,NULL,70000,0,86,3),(283,NULL,NULL,NULL,NULL,70000,0,87,3),(284,NULL,NULL,NULL,NULL,70000,0,88,3),(285,NULL,NULL,NULL,NULL,70000,0,89,3),(286,NULL,NULL,NULL,NULL,70000,0,90,3),(287,NULL,NULL,NULL,NULL,85000,0,91,3),(288,NULL,NULL,NULL,NULL,85000,0,92,3),(289,NULL,NULL,NULL,NULL,85000,0,93,3),(290,NULL,NULL,NULL,NULL,85000,0,94,3),(291,NULL,NULL,NULL,NULL,85000,0,95,3),(292,NULL,NULL,NULL,NULL,85000,0,96,3),(293,NULL,NULL,NULL,NULL,85000,0,97,3),(294,NULL,NULL,NULL,NULL,85000,0,98,3),(295,NULL,NULL,NULL,NULL,70000,0,1,4),(296,NULL,NULL,NULL,NULL,70000,0,2,4),(297,NULL,NULL,NULL,NULL,70000,0,3,4),(298,NULL,NULL,NULL,NULL,70000,0,4,4),(299,NULL,NULL,NULL,NULL,70000,0,5,4),(300,NULL,NULL,NULL,NULL,70000,0,6,4),(301,NULL,NULL,NULL,NULL,70000,0,7,4),(302,NULL,NULL,NULL,NULL,70000,0,8,4),(303,NULL,NULL,NULL,NULL,70000,0,9,4),(304,NULL,NULL,NULL,NULL,70000,0,10,4),(305,NULL,NULL,NULL,NULL,70000,0,11,4),(306,NULL,NULL,NULL,NULL,70000,0,12,4),(307,NULL,NULL,NULL,NULL,70000,0,13,4),(308,NULL,NULL,NULL,NULL,70000,0,14,4),(309,NULL,NULL,NULL,NULL,70000,0,15,4),(310,NULL,NULL,NULL,NULL,70000,0,16,4),(311,NULL,NULL,NULL,NULL,70000,0,17,4),(312,NULL,NULL,NULL,NULL,70000,0,18,4),(313,NULL,NULL,NULL,NULL,70000,0,19,4),(314,NULL,NULL,NULL,NULL,70000,0,20,4),(315,NULL,NULL,NULL,NULL,70000,0,21,4),(316,NULL,NULL,NULL,NULL,70000,0,22,4),(317,NULL,NULL,NULL,NULL,70000,0,23,4),(318,NULL,NULL,NULL,NULL,70000,0,24,4),(319,NULL,NULL,NULL,NULL,70000,0,25,4),(320,NULL,NULL,NULL,NULL,70000,0,26,4),(321,NULL,NULL,NULL,NULL,70000,0,27,4),(322,NULL,NULL,NULL,NULL,70000,0,28,4),(323,NULL,NULL,NULL,NULL,70000,0,29,4),(324,NULL,NULL,NULL,NULL,70000,0,30,4),(325,NULL,NULL,NULL,NULL,70000,0,31,4),(326,NULL,NULL,NULL,NULL,70000,0,32,4),(327,NULL,NULL,NULL,NULL,70000,0,33,4),(328,NULL,NULL,NULL,NULL,70000,0,34,4),(329,NULL,NULL,NULL,NULL,70000,0,35,4),(330,NULL,NULL,NULL,NULL,70000,0,36,4),(331,NULL,NULL,NULL,NULL,70000,0,37,4),(332,NULL,NULL,NULL,NULL,70000,0,38,4),(333,NULL,NULL,NULL,NULL,70000,0,39,4),(334,NULL,NULL,NULL,NULL,70000,0,40,4),(335,NULL,NULL,NULL,NULL,70000,0,41,4),(336,NULL,NULL,NULL,NULL,70000,0,42,4),(337,NULL,NULL,NULL,NULL,70000,0,43,4),(338,NULL,NULL,NULL,NULL,70000,0,44,4),(339,NULL,NULL,NULL,NULL,70000,0,45,4),(340,NULL,NULL,NULL,NULL,70000,0,46,4),(341,NULL,NULL,NULL,NULL,70000,0,47,4),(342,NULL,NULL,NULL,NULL,70000,0,48,4),(343,NULL,NULL,NULL,NULL,70000,0,49,4),(344,NULL,NULL,NULL,NULL,70000,0,50,4),(345,NULL,NULL,NULL,NULL,70000,0,51,4),(346,NULL,NULL,NULL,NULL,70000,0,52,4),(347,NULL,NULL,NULL,NULL,70000,0,53,4),(348,NULL,NULL,NULL,NULL,70000,0,54,4),(349,NULL,NULL,NULL,NULL,70000,0,55,4),(350,NULL,NULL,NULL,NULL,70000,0,56,4),(351,NULL,NULL,NULL,NULL,70000,0,57,4),(352,NULL,NULL,NULL,NULL,70000,0,58,4),(353,NULL,NULL,NULL,NULL,70000,0,59,4),(354,NULL,NULL,NULL,NULL,70000,0,60,4),(355,NULL,NULL,NULL,NULL,70000,0,61,4),(356,NULL,NULL,NULL,NULL,70000,0,62,4),(357,NULL,NULL,NULL,NULL,70000,0,63,4),(358,NULL,NULL,NULL,NULL,70000,0,64,4),(359,NULL,NULL,NULL,NULL,70000,0,65,4),(360,NULL,NULL,NULL,NULL,70000,0,66,4),(361,NULL,NULL,NULL,NULL,70000,0,67,4),(362,NULL,NULL,NULL,NULL,70000,0,68,4),(363,NULL,NULL,NULL,NULL,70000,0,69,4),(364,NULL,NULL,NULL,NULL,70000,0,70,4),(365,NULL,NULL,NULL,NULL,70000,0,71,4),(366,NULL,NULL,NULL,NULL,70000,0,72,4),(367,NULL,NULL,NULL,NULL,70000,0,73,4),(368,NULL,NULL,NULL,NULL,70000,0,74,4),(369,NULL,NULL,NULL,NULL,70000,0,75,4),(370,NULL,NULL,NULL,NULL,70000,0,76,4),(371,NULL,NULL,NULL,NULL,70000,0,77,4),(372,NULL,NULL,NULL,NULL,70000,0,78,4),(373,NULL,NULL,NULL,NULL,70000,0,79,4),(374,NULL,NULL,NULL,NULL,70000,0,80,4),(375,NULL,NULL,NULL,NULL,70000,0,81,4),(376,NULL,NULL,NULL,NULL,70000,0,82,4),(377,NULL,NULL,NULL,NULL,70000,0,83,4),(378,NULL,NULL,NULL,NULL,70000,0,84,4),(379,NULL,NULL,NULL,NULL,70000,0,85,4),(380,NULL,NULL,NULL,NULL,70000,0,86,4),(381,NULL,NULL,NULL,NULL,70000,0,87,4),(382,NULL,NULL,NULL,NULL,70000,0,88,4),(383,NULL,NULL,NULL,NULL,70000,0,89,4),(384,NULL,NULL,NULL,NULL,70000,0,90,4),(385,NULL,NULL,NULL,NULL,85000,0,91,4),(386,NULL,NULL,NULL,NULL,85000,0,92,4),(387,NULL,NULL,NULL,NULL,85000,0,93,4),(388,NULL,NULL,NULL,NULL,85000,0,94,4),(389,NULL,NULL,NULL,NULL,85000,0,95,4),(390,NULL,NULL,NULL,NULL,85000,0,96,4),(391,NULL,NULL,NULL,NULL,85000,0,97,4),(392,NULL,NULL,NULL,NULL,85000,0,98,4),(393,NULL,NULL,NULL,NULL,70000,0,1,5),(394,NULL,NULL,NULL,NULL,70000,0,2,5),(395,NULL,NULL,NULL,NULL,70000,0,3,5),(396,NULL,NULL,NULL,NULL,70000,0,4,5),(397,NULL,NULL,NULL,NULL,70000,0,5,5),(398,NULL,NULL,NULL,NULL,70000,0,6,5),(399,NULL,NULL,NULL,NULL,70000,0,7,5),(400,NULL,NULL,NULL,NULL,70000,0,8,5),(401,NULL,NULL,NULL,NULL,70000,0,9,5),(402,NULL,NULL,NULL,NULL,70000,0,10,5),(403,NULL,NULL,NULL,NULL,70000,0,11,5),(404,NULL,NULL,NULL,NULL,70000,0,12,5),(405,NULL,NULL,NULL,NULL,70000,0,13,5),(406,NULL,NULL,NULL,NULL,70000,0,14,5),(407,NULL,NULL,NULL,NULL,70000,0,15,5),(408,NULL,NULL,NULL,NULL,70000,0,16,5),(409,NULL,NULL,NULL,NULL,70000,0,17,5),(410,NULL,NULL,NULL,NULL,70000,0,18,5),(411,NULL,NULL,NULL,NULL,70000,0,19,5),(412,NULL,NULL,NULL,NULL,70000,0,20,5),(413,NULL,NULL,NULL,NULL,70000,0,21,5),(414,NULL,NULL,NULL,NULL,70000,0,22,5),(415,NULL,NULL,NULL,NULL,70000,0,23,5),(416,NULL,NULL,NULL,NULL,70000,0,24,5),(417,NULL,NULL,NULL,NULL,70000,0,25,5),(418,NULL,NULL,NULL,NULL,70000,0,26,5),(419,NULL,NULL,NULL,NULL,70000,0,27,5),(420,NULL,NULL,NULL,NULL,70000,0,28,5),(421,NULL,NULL,NULL,NULL,70000,0,29,5),(422,NULL,NULL,NULL,NULL,70000,0,30,5),(423,NULL,NULL,NULL,NULL,70000,0,31,5),(424,NULL,NULL,NULL,NULL,70000,0,32,5),(425,NULL,NULL,NULL,NULL,70000,0,33,5),(426,NULL,NULL,NULL,NULL,70000,0,34,5),(427,NULL,NULL,NULL,NULL,70000,0,35,5),(428,NULL,NULL,NULL,NULL,70000,0,36,5),(429,NULL,NULL,NULL,NULL,70000,0,37,5),(430,NULL,NULL,NULL,NULL,70000,0,38,5),(431,NULL,NULL,NULL,NULL,70000,0,39,5),(432,NULL,NULL,NULL,NULL,70000,0,40,5),(433,NULL,NULL,NULL,NULL,70000,0,41,5),(434,NULL,NULL,NULL,NULL,70000,0,42,5),(435,NULL,NULL,NULL,NULL,70000,0,43,5),(436,NULL,NULL,NULL,NULL,70000,0,44,5),(437,NULL,NULL,NULL,NULL,70000,0,45,5),(438,NULL,NULL,NULL,NULL,70000,0,46,5),(439,NULL,NULL,NULL,NULL,70000,0,47,5),(440,NULL,NULL,NULL,NULL,70000,0,48,5),(441,NULL,NULL,NULL,NULL,70000,0,49,5),(442,NULL,NULL,NULL,NULL,70000,0,50,5),(443,NULL,NULL,NULL,NULL,70000,0,51,5),(444,NULL,NULL,NULL,NULL,70000,0,52,5),(445,NULL,NULL,NULL,NULL,70000,0,53,5),(446,NULL,NULL,NULL,NULL,70000,0,54,5),(447,NULL,NULL,NULL,NULL,70000,0,55,5),(448,NULL,NULL,NULL,NULL,70000,0,56,5),(449,NULL,NULL,NULL,NULL,70000,0,57,5),(450,NULL,NULL,NULL,NULL,70000,0,58,5),(451,NULL,NULL,NULL,NULL,70000,0,59,5),(452,NULL,NULL,NULL,NULL,70000,0,60,5),(453,NULL,NULL,NULL,NULL,70000,0,61,5),(454,NULL,NULL,NULL,NULL,70000,0,62,5),(455,NULL,NULL,NULL,NULL,70000,0,63,5),(456,NULL,NULL,NULL,NULL,70000,0,64,5),(457,NULL,NULL,NULL,NULL,70000,0,65,5),(458,NULL,NULL,NULL,NULL,70000,0,66,5),(459,NULL,NULL,NULL,NULL,70000,0,67,5),(460,NULL,NULL,NULL,NULL,70000,0,68,5),(461,NULL,NULL,NULL,NULL,70000,0,69,5),(462,NULL,NULL,NULL,NULL,70000,0,70,5),(463,NULL,NULL,NULL,NULL,70000,0,71,5),(464,NULL,NULL,NULL,NULL,70000,0,72,5),(465,NULL,NULL,NULL,NULL,70000,0,73,5),(466,NULL,NULL,NULL,NULL,70000,0,74,5),(467,NULL,NULL,NULL,NULL,70000,0,75,5),(468,NULL,NULL,NULL,NULL,70000,0,76,5),(469,NULL,NULL,NULL,NULL,70000,0,77,5),(470,NULL,NULL,NULL,NULL,70000,0,78,5),(471,NULL,NULL,NULL,NULL,70000,0,79,5),(472,NULL,NULL,NULL,NULL,70000,0,80,5),(473,NULL,NULL,NULL,NULL,70000,0,81,5),(474,NULL,NULL,NULL,NULL,70000,0,82,5),(475,NULL,NULL,NULL,NULL,70000,0,83,5),(476,NULL,NULL,NULL,NULL,70000,0,84,5),(477,NULL,NULL,NULL,NULL,70000,0,85,5),(478,NULL,NULL,NULL,NULL,70000,0,86,5),(479,NULL,NULL,NULL,NULL,70000,0,87,5),(480,NULL,NULL,NULL,NULL,70000,0,88,5),(481,NULL,NULL,NULL,NULL,70000,0,89,5),(482,NULL,NULL,NULL,NULL,70000,0,90,5),(483,NULL,NULL,NULL,NULL,85000,0,91,5),(484,NULL,NULL,NULL,NULL,85000,0,92,5),(485,NULL,NULL,NULL,NULL,85000,0,93,5),(486,NULL,NULL,NULL,NULL,85000,0,94,5),(487,NULL,NULL,NULL,NULL,85000,0,95,5),(488,NULL,NULL,NULL,NULL,85000,0,96,5),(489,NULL,NULL,NULL,NULL,85000,0,97,5),(490,NULL,NULL,NULL,NULL,85000,0,98,5),(491,NULL,NULL,NULL,NULL,65000,0,99,6),(492,NULL,NULL,NULL,NULL,65000,0,100,6),(493,NULL,NULL,NULL,NULL,65000,0,101,6),(494,NULL,NULL,NULL,NULL,65000,0,102,6),(495,NULL,NULL,NULL,NULL,65000,0,103,6),(496,NULL,NULL,NULL,NULL,65000,0,104,6),(497,NULL,NULL,NULL,NULL,65000,0,105,6),(498,NULL,NULL,NULL,NULL,65000,0,106,6),(499,NULL,NULL,NULL,NULL,65000,0,107,6),(500,NULL,NULL,NULL,NULL,65000,0,108,6),(501,NULL,NULL,NULL,NULL,65000,0,109,6),(502,NULL,NULL,NULL,NULL,65000,0,110,6),(503,NULL,NULL,NULL,NULL,65000,0,111,6),(504,NULL,NULL,NULL,NULL,65000,0,112,6),(505,NULL,NULL,NULL,NULL,65000,0,113,6),(506,NULL,NULL,NULL,NULL,65000,0,114,6),(507,NULL,NULL,NULL,NULL,65000,0,115,6),(508,NULL,NULL,NULL,NULL,65000,0,116,6),(509,NULL,NULL,NULL,NULL,65000,0,117,6),(510,NULL,NULL,NULL,NULL,65000,0,118,6),(511,NULL,NULL,NULL,NULL,65000,0,119,6),(512,NULL,NULL,NULL,NULL,65000,0,120,6),(513,NULL,NULL,NULL,NULL,65000,0,121,6),(514,NULL,NULL,NULL,NULL,65000,0,122,6),(515,NULL,NULL,NULL,NULL,65000,0,123,6),(516,NULL,NULL,NULL,NULL,65000,0,124,6),(517,NULL,NULL,NULL,NULL,65000,0,125,6),(518,NULL,NULL,NULL,NULL,65000,0,126,6),(519,NULL,NULL,NULL,NULL,65000,0,127,6),(520,NULL,NULL,NULL,NULL,65000,0,128,6),(521,NULL,NULL,NULL,NULL,65000,0,129,6),(522,NULL,NULL,NULL,NULL,65000,0,130,6),(523,NULL,NULL,NULL,NULL,65000,0,131,6),(524,NULL,NULL,NULL,NULL,65000,0,132,6),(525,NULL,NULL,NULL,NULL,65000,0,133,6),(526,NULL,NULL,NULL,NULL,65000,0,134,6),(527,NULL,NULL,NULL,NULL,65000,0,135,6),(528,NULL,NULL,NULL,NULL,65000,0,136,6),(529,NULL,NULL,NULL,NULL,65000,0,137,6),(530,NULL,NULL,NULL,NULL,65000,0,138,6),(531,NULL,NULL,NULL,NULL,65000,0,139,6),(532,NULL,NULL,NULL,NULL,65000,0,140,6),(533,NULL,NULL,NULL,NULL,65000,0,141,6),(534,NULL,NULL,NULL,NULL,65000,0,142,6),(535,NULL,NULL,NULL,NULL,65000,0,143,6),(536,NULL,NULL,NULL,NULL,65000,0,144,6),(537,NULL,NULL,NULL,NULL,65000,0,145,6),(538,NULL,NULL,NULL,NULL,65000,0,146,6),(539,NULL,NULL,NULL,NULL,65000,0,147,6),(540,NULL,NULL,NULL,NULL,65000,0,148,6),(541,NULL,NULL,NULL,NULL,65000,0,149,6),(542,NULL,NULL,NULL,NULL,65000,0,150,6),(543,NULL,NULL,NULL,NULL,65000,0,151,6),(544,NULL,NULL,NULL,NULL,65000,0,152,6),(545,NULL,NULL,NULL,NULL,65000,0,153,6),(546,NULL,NULL,NULL,NULL,65000,0,154,6),(547,NULL,NULL,NULL,NULL,65000,0,155,6),(548,NULL,NULL,NULL,NULL,65000,0,156,6),(549,NULL,NULL,NULL,NULL,65000,0,157,6),(550,NULL,NULL,NULL,NULL,65000,0,158,6),(551,NULL,NULL,NULL,NULL,65000,0,159,6),(552,NULL,NULL,NULL,NULL,65000,0,160,6),(553,NULL,NULL,NULL,NULL,65000,0,161,6),(554,NULL,NULL,NULL,NULL,65000,0,162,6),(555,NULL,NULL,NULL,NULL,65000,0,163,6),(556,NULL,NULL,NULL,NULL,65000,0,164,6),(557,NULL,NULL,NULL,NULL,65000,0,165,6),(558,NULL,NULL,NULL,NULL,65000,0,166,6),(559,NULL,NULL,NULL,NULL,65000,0,167,6),(560,NULL,NULL,NULL,NULL,65000,0,168,6),(561,NULL,NULL,NULL,NULL,65000,0,169,6),(562,NULL,NULL,NULL,NULL,65000,0,170,6),(563,NULL,NULL,NULL,NULL,65000,0,171,6),(564,NULL,NULL,NULL,NULL,65000,0,172,6),(565,NULL,NULL,NULL,NULL,65000,0,173,6),(566,NULL,NULL,NULL,NULL,65000,0,174,6),(567,NULL,NULL,NULL,NULL,65000,0,175,6),(568,NULL,NULL,NULL,NULL,65000,0,176,6),(569,NULL,NULL,NULL,NULL,65000,0,177,6),(570,NULL,NULL,NULL,NULL,65000,0,178,6),(571,NULL,NULL,NULL,NULL,65000,0,179,6),(572,NULL,NULL,NULL,NULL,65000,0,180,6),(573,NULL,NULL,NULL,NULL,65000,0,181,6),(574,NULL,NULL,NULL,NULL,65000,0,182,6),(575,NULL,NULL,NULL,NULL,65000,0,183,6),(576,NULL,NULL,NULL,NULL,65000,0,184,6),(577,NULL,NULL,NULL,NULL,65000,0,185,6),(578,NULL,NULL,NULL,NULL,65000,0,186,6),(579,NULL,NULL,NULL,NULL,65000,0,187,6),(580,NULL,NULL,NULL,NULL,65000,0,188,6),(581,NULL,NULL,NULL,NULL,65000,0,189,6),(582,NULL,NULL,NULL,NULL,65000,0,190,6),(583,NULL,NULL,NULL,NULL,65000,0,191,6),(584,NULL,NULL,NULL,NULL,65000,0,192,6),(585,NULL,NULL,NULL,NULL,65000,0,193,6),(586,NULL,NULL,NULL,NULL,65000,0,194,6),(587,NULL,NULL,NULL,NULL,65000,0,195,6),(588,NULL,NULL,NULL,NULL,65000,0,196,6),(589,NULL,NULL,NULL,NULL,65000,0,197,6),(590,NULL,NULL,NULL,NULL,75000,0,198,6),(591,NULL,NULL,NULL,NULL,75000,0,199,6),(592,NULL,NULL,NULL,NULL,75000,0,200,6),(593,NULL,NULL,NULL,NULL,75000,0,201,6),(594,NULL,NULL,NULL,NULL,75000,0,202,6),(595,NULL,NULL,NULL,NULL,75000,0,203,6),(596,NULL,NULL,NULL,NULL,75000,0,204,6),(597,NULL,NULL,NULL,NULL,75000,0,205,6);
/*!40000 ALTER TABLE `show_time_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `showtime`
--

DROP TABLE IF EXISTS `showtime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showtime` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `show_date` date DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `movie_id` bigint(20) DEFAULT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8i90asti16tydhva795c3qwj2` (`movie_id`),
  KEY `FK6xi8d7qa7ww5iaypsrc0gjpa8` (`room_id`),
  CONSTRAINT `FK6xi8d7qa7ww5iaypsrc0gjpa8` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  CONSTRAINT `FK8i90asti16tydhva795c3qwj2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showtime`
--

LOCK TABLES `showtime` WRITE;
/*!40000 ALTER TABLE `showtime` DISABLE KEYS */;
INSERT INTO `showtime` VALUES (1,'2025-07-10','2025-07-10 09:34:00.000000',11,1),(2,'2025-07-10','2025-07-10 01:34:00.000000',10,1),(3,'2025-07-10','2025-07-10 05:35:00.000000',12,1),(4,'2025-07-11','2025-07-11 08:20:00.000000',11,1),(5,'2025-07-11','2025-07-11 11:20:00.000000',11,1),(6,'2025-07-11','2025-07-11 10:21:00.000000',11,2);
/*!40000 ALTER TABLE `showtime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_film`
--

DROP TABLE IF EXISTS `status_film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_film` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_film`
--

LOCK TABLES `status_film` WRITE;
/*!40000 ALTER TABLE `status_film` DISABLE KEYS */;
INSERT INTO `status_film` VALUES (1,'active'),(2,'inactive'),(3,'deleted');
/*!40000 ALTER TABLE `status_film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `card_id` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKn82ha3ccdebhokx3a8fgdqeyy` (`role_id`),
  CONSTRAINT `FKn82ha3ccdebhokx3a8fgdqeyy` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Hà Nội','https://canvato.net/2ETUv','123456789','i0zdT','test@example.com',_binary '','Nguyễn Văn A','$2a$10$Lm/qk3./DPAuZHwfK1W3iux6MWUGEF/2R5iGqymQZG/i.C.qsX5B.','0987654321',_binary '',2),(2,'thu duc','data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBIgACEQEDEQH/','','WtI3I','a@gmail.com',_binary '\0','thao','$2a$10$loc9f67zXB7Iw/4KLCKbKOiSBdrqGuPuOdU.HZJ0mOGQwa3/9qk4C','0999876433',_binary '',1),(5,'HN','https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_87.jpg','054203002111','yiMpV','nguyenquyduong0802@gmail.com',_binary '','Nguyễn Quý Dươngg','$2a$10$y022QaJ7xFcOwuDD6lDstu8xiNuWIngV9H8pBsUlc/K/K2XAyRmPC','0234567892',_binary '',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_promotion`
--

DROP TABLE IF EXISTS `user_promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_amount` bigint(20) NOT NULL,
  `final_amount` bigint(20) NOT NULL,
  `original_amount` bigint(20) NOT NULL,
  `used_at` datetime(6) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `promotion_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbii3oiyc79ribujxje7x5hdx7` (`booking_id`),
  KEY `FKc4uk0tmorfjmwpdf9y4m88l7d` (`promotion_id`),
  KEY `FKg9d3ca8jtsx3bw6p1lohmt4ll` (`user_id`),
  CONSTRAINT `FKbii3oiyc79ribujxje7x5hdx7` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  CONSTRAINT `FKc4uk0tmorfjmwpdf9y4m88l7d` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
  CONSTRAINT `FKg9d3ca8jtsx3bw6p1lohmt4ll` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_promotion`
--

LOCK TABLES `user_promotion` WRITE;
/*!40000 ALTER TABLE `user_promotion` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_promotion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-10 18:45:11
