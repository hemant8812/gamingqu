/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: gamingqu
-- ------------------------------------------------------
-- Server version	10.11.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Account`
--

DROP TABLE IF EXISTS `Account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Account` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL,
  `oauth_token_secret` varchar(191) DEFAULT NULL,
  `oauth_token` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `Account_userId_idx` (`userId`),
  CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Account`
--

LOCK TABLES `Account` WRITE;
/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES
('cml8ck85h00005go514ty6rq1','G8792','oauth','google','102132473445899172972',NULL,'ya29.a0AQvPyIOITzAXaU_YBhNqJiQRt2W-v05grM0vAs3FiHxhcrSGzvbrSUG6cd9riDsR1pseXhnW-DqyV8LZ25V9_l_LPIh2BJJHlSag7Sj8SWU9addZ1TLIh5Ll5nBZ0WVf1D26fnFk3zaDOs92fO766jtCYpjB9blQIc-rBXl9vxEMta_gel_YlWb38XgSJ9szgbkjMexIhI5pAdiGt98FqeohfIqD65rskskWUGyc4BuzHvJFNuH3F-DA_6OR3Ebs3X3-wTX85mnop1IIjjRTMJoGNbfhaCgYKAYoSARQSFQHGX2MinTIJUMsma1P2qTCCJV8utA0291',1779394613,'Bearer','openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile','eyJhbGciOiJSUzI1NiIsImtpZCI6IjQxYjJlMTFmZjljYTI2ZTc4YzAyNWE5ZDRhNDI5Y2IwNjAxMzk1NmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDIxMzI0NzM0NDU4OTkxNzI5NzIiLCJlbWFpbCI6ImJvb3N0aW5ncXVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJlYkJuWTRkbWVxWlRVQjlLR1JhR213IiwibmFtZSI6IkJvb3N0aW5ncXUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWVLMTBLM1o2V1Azc0tubHptZi1Qem1JRXJQUGRVNXVwZk1NMWUxZl9aZkpjSlp3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkJvb3N0aW5ncXUiLCJpYXQiOjE3NzkzOTEwMTQsImV4cCI6MTc3OTM5NDYxNH0.Q-wD3yzWh5jNHUAF-5itYaDAQQn3Bb_40zuje_V3MYQombNgDDQjfDdSSLk7Ykq4SA1IzaYayrMHc0KbAIq5Xeuob-VwlNTn8TuQaJPwS0JaJ1jA42_uWz5docsHFfQtvkFvVpFzpz1Jbe53U0SRpsMhK-wKbrU5bERVQIwW2zT11FhL89GiZJd26dBUFjAt37EcfTPqSLC1j1JlVCQKm9Kz56bEUnbltSAY0zgFHRQronkLgy1IRfSGqYokK7tT_19ovzKb51JRFc8uULrc6uHzhjAVcaCNHwV3BN84uEscAGinWDo_HBfkvRhWmUovL_lbB-9rSIwU_OS_CYbp5w',NULL,NULL,NULL),
('cmlpgwg5m00000go5k1x05nxb','G1699','oauth','google','108196266417191942826',NULL,'ya29.a0AQvPyIP_qf76fi0hcC0IZ5gXW3z8KxZcFnobsoIwEtxGc8GddcaYA7HeltR1tFqOGCGJgBQK-B3Jc04vlsKJcuOV3SFyjbuj29gpUWmznr1KbC0sEOXueJMvAADSoacZJyZqI45Abfu1uSOMjUTMa-vUJrU1bHZphysKk5InbmzqsEHcdvBP6c-CKk5DWvR6Dzt0aR6OLf-4kpV9Ku6xcySgtmyXOwnnCSG4GqbHr9eE9H_AR4AgcYhTXfaiKcvTs3ZfYwV9beVPBWL_bxfGqzh5I7waCgYKAU4SARMSFQHGX2MimeFu8zhP6JaFz7ro8SlDhA0290',1779872879,'Bearer','https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid','eyJhbGciOiJSUzI1NiIsImtpZCI6IjQxYjJlMTFmZjljYTI2ZTc4YzAyNWE5ZDRhNDI5Y2IwNjAxMzk1NmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgxOTYyNjY0MTcxOTE5NDI4MjYiLCJlbWFpbCI6InEuYWxsb25lQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiQkN6U3RYOGctWFBpX1R3TEhoYm04ZyIsIm5hbWUiOiJQYXltZW50IEdhbWluZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJUmZOSnBwak1qLTBUZG4zSHRPWi1rQjZQNC1MR3JNTUZjN1lRQmlSOHVWUGctbExibD1zOTYtYyIsImdpdmVuX25hbWUiOiJQYXltZW50IiwiZmFtaWx5X25hbWUiOiJHYW1pbmciLCJpYXQiOjE3Nzk4NjkyODAsImV4cCI6MTc3OTg3Mjg4MH0.WZTDfDNOa83ttcMDTXuRoEbIpwynu0g6iDHIToiF-2vf4D4H3HvqbXDOBmZWB-aX8-Zu6U42wlW53QTtVvGC7Z0JmybnfCcAXdn2_m8fuodDI4NMFFKiNOMu8gH7hrowTKdrl2Eprzb0-gzq3crav3pALYGIBSQ5OJdLoTp5FCR98i5MVLm27kUT0wOyIgSkLDb6RjwPzqlcrZ_cdO-YxCukh4wwTVtAUs3ZNpKihQBIHMROQNG13jKSLF9oM8jLGBoWUxHjdWsd_NEOeBsG5w2d4S-WpCGfmF6SMnGKfDDjs251AI2l_o5kge2ke-HlQhnF4OBV0qvnEFwdsN_vxw',NULL,NULL,NULL),
('cmlq70fjm00010go5okzbyygb','G3200','oauth','google','106427211773571938409',NULL,'ya29.A0ATkoCc6OUcUpPTvnV1tuQ4GDD6ggO6ZzFH2zX8-LtLd53-AANb01GrbUR3OLBz98jpK50grI0uHHZPaPYK4LSsfaMBTWvxgPd_elg6yAsSo3imOiOzaVomFrAxBkse1KJjSBllV13CWEcdapH5eL8R1kjPfkQD72zrJj13xZCpVSJuJaDemJ_Hw5zLDFAwyOfp18_bjDntl0lFUosZjCoNMls4qv8uU12gsb8qhhX79hnHYM9_d92QUigCcDRecO1-kHZ-D3A6qylmM1xTVqulhqU2QtaCgYKAdISARYSFQHGX2Mixya-bOwCDzXpGIVP_jK27A0291',1771311535,'Bearer','openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile','eyJhbGciOiJSUzI1NiIsImtpZCI6ImM4MTZkMzM3YjgzNjVhMDZhODUxYWQ4MDAxNmMxNzEwOTk0OTI2MDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDY0MjcyMTE3NzM1NzE5Mzg0MDkiLCJlbWFpbCI6InBvd2VybGV2ZWxpbmcyMDI1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTnRaQUdfYzNONlVFYXdRWTlocDBvdyIsIm5hbWUiOiJSZXN0dSBBcmlhZGkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSTNGcjZDdk83RHpQUTVuUXVGbkxCR01pbkN6OFJ2SlRuSk5XX255RV8wNFRhSm93PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlc3R1IiwiZmFtaWx5X25hbWUiOiJBcmlhZGkiLCJpYXQiOjE3NzEzMDc5MzYsImV4cCI6MTc3MTMxMTUzNn0.IInSNHHLSj8oWN1BW0yz5qRIOfsH1xzJwJDqVg9F93ZpE8K-CbaqtXUz9-ChBhRGg7Q0S0oeVKqwEnTRO1gEiN0vGqrjV-ERzkKEziYIpovl3T8T2HY2C96hs-H5poZ2E4kSDw_g0uIWX0jamJhe-2vS89HHgbkTgK6maiiJ_3bI9SI1gvT9iweuYpGINjX8APeS6SUt4eGgS8jULV5Ypprnl6aR69F97LShRhdEj84hpnSbJSgSsH4NtSzAb7eDPJPPQoaKufAcoH7VZAQqgn2LLrzlrBDByX5KrsiuJpkXZQ0oS2ZCTxebCvOAcuGgQVk4GH2yfqYBw-1F6R-P6w',NULL,NULL,NULL),
('cmlt7jsf300002zo5hwyi6gxh','G6912','oauth','google','103797535211134236047',NULL,'ya29.A0ATkoCc4bg5xpoYMqHXla5ncY7TznpH_Z2Zi3WtZsavFJD2noN6hHDP6jkD4c-AA8JMIP1dc12D_50CkxGTf5KosLNCPsmsQeurS68DRGO_FhJuvxQRZBBQPmjas8xnKtiAInBhiiga4_z9ccaLVp2z52iWj9Q6Ha6fQE4AUKvNyTSXIO8-0D6MvOl6VTeMkDpKB5JST4_LakThcY_SEcoFvhB7pHLy2YTHZiWFJRuMPGmGaMRU1zOdWaiqLivnB_Uz-zqhMX2u4OzjbXzHQ_EJ0ID69E1QaCgYKAaMSARESFQHGX2MiW_a9j77HuZUSSuTKXkk-Fg0293',1771493837,'Bearer','https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid','eyJhbGciOiJSUzI1NiIsImtpZCI6ImM4MTZkMzM3YjgzNjVhMDZhODUxYWQ4MDAxNmMxNzEwOTk0OTI2MDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM3OTc1MzUyMTExMzQyMzYwNDciLCJlbWFpbCI6InB0Lmlub3Zhc2lkaWdpdGFsYXNpYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImVwTXBiSTBiZXVVdTc2c21JX3BUSnciLCJuYW1lIjoiSU5PVkFTSSBESUdJVEFMIEFTSUEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTDJjckNhSHVxNlQtNVU5Z3VFeHo1Tzk3QlItbTN1SFQ5b3Y2ZU5oQXB0MTB6NUd5cz1zOTYtYyIsImdpdmVuX25hbWUiOiJJTk9WQVNJIERJR0lUQUwgQVNJQSIsImlhdCI6MTc3MTQ5MDIzOCwiZXhwIjoxNzcxNDkzODM4fQ.SB4xACb9hcz9EESh7ObJCd9tH0CL3mZ1JnxO79GSUuRfIr4uIvLvKXET0iFQ6OhZGNDvY_DHwu7J1WMOIqMB-YVLav03AWY-tXpDec4u7UHsMhWz4q8MPtgtnFHDiF3t6E64vICxtsytMoSe-cNQtu4S6sGP7rSYKrF_nZ_xP0ArV9nzKmnv_EumwgqL9pUGfpsNlIRXkb-X97J3xwEANkiNrCc0UPRL_z8G7e8V_xRZjHn-_IDX8yQ8r08vW0YwRbIz0nyyHww_6-gMzYgD_Ii7gsDSJW2NjglT-DDpXk2flqySLh6NmT2WcIwjggM_imeVjoIHMPxp9iBp9R7nPQ',NULL,NULL,NULL),
('cmm7nyoux0000c7o5pjx6i457','G8751','oauth','google','117634402719227289755',NULL,'ya29.A0ATkoCc5CktIXegslgcWhJAEmAS9N0NKPgfarcRMo55mQ9215aZWX9a7wQD7nuFot9kzmHJJ2cU3j5rlCv5Kv0PGHZGhr1PMY7SRiRk5WE2oLgpkmWYx12s4Um54Pzszk728tH0N--Ld4Tr81e5GY-MSa8Fx49c6vjXBo5fW1t5IPxce7I3qapiBy1yOuWa1mSZ4N6X-S8YvKzNs_o5NnlulgrOzS1nJoUFNv3RvQW6IDPgAcW3o9KXBBSOxQ4VAPrhT-CIgzSiEEq8Qi7W0FeKPAZpgqaCgYKAYcSARASFQHGX2Mi8eJKhV8IOEBICj6NlB9k7w0291',1772383648,'Bearer','https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email','eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1MDdmNTFhZjJhMTYyNDY3MDc0ODQ2NzRhNDJhZTNjMmI2MjMxOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc2MzQ0MDI3MTkyMjcyODk3NTUiLCJlbWFpbCI6ImNlY2VwaWxoYW1tYXVsYW5hcHBnQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiMkhEUnl0WGM4MzlkMUlJZTh3S3UtQSIsIm5hbWUiOiJDZWNlcCBpbGhhbSBNYXVsYW5hcHBnIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lmTEh2Q3pNaVFSY09rWlNZcTdtbFVUR1lmSFVYX0lETm5Ya3VoS3J0NE9QR3lpbVU9czk2LWMiLCJnaXZlbl9uYW1lIjoiQ2VjZXAgaWxoYW0iLCJmYW1pbHlfbmFtZSI6Ik1hdWxhbmFwcGciLCJpYXQiOjE3NzIzODAwNTAsImV4cCI6MTc3MjM4MzY1MH0.Uryg_DMtfoWhu0P-cg6kb1UiJCtaOfZouRCngVIkHK2w4vVNsC45eIUz7Om63-RxyX9NXo_3F3_Ix5dZ-Yyw_KdGRslXgGVA8gIk-nczKIvvhnJp9Z6UIoz_8ct-bZ9DwxLRMaJ5YQeQztLaHjYZB8EK5u2gGdS26M9k4S0G1SJ7J1N_yb3IYUKc4bT90wgrzwV77K9YwkbYk19mfT4XVaqej477fukkqFhnkf5x92HZclP_yGsDpWQM12uZxvA9O-iK6yoqgk_82QWrx8BrcatSnkttMmo93n_GHsRpyG4fPVrFDvYG4e8__-DH_RCmh4wQOQkqmSgV4LNhL8mf_w',NULL,NULL,NULL),
('cmpnrtdcy000095o5hx5wo868','G8830','oauth','google','113990991884373571130',NULL,'ya29.a0AQvPyIPn7DTEHy0Orti4_jdniJsLmP70Vtcmufw3-J8tPbYKotXHmzGu1VJW79pFUh1_HNFm-BcrDr3v1JcnjPRKu-4112ANS39hJhAh5VJZUkP3DzH5BsX4mnh7UqQk65bZ_nH93mLR32n0G5dKqNU_xGZACWpre8bZb2DFm0BDbJWJBAL1frRyQ9HG_r7csm4jPk5ersIBxq9E9_yhhtLLXmswmCLZoIbayzsEOqqLFJUFqUKs4OLnFyZKq6DlK9ZrlfjIJE0H9YaMzlY0psJv75cYaCgYKAaQSARASFQHGX2MioBbylQZ3qyZSFSuAEpoZNw0291',1779872277,'Bearer','https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid','eyJhbGciOiJSUzI1NiIsImtpZCI6IjQxYjJlMTFmZjljYTI2ZTc4YzAyNWE5ZDRhNDI5Y2IwNjAxMzk1NmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NTUwMjc5OTc4MjctNnBoZGJicnUzcGRzcHU5MjBja2FndGw4YzNwdmhudnMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5OTA5OTE4ODQzNzM1NzExMzAiLCJlbWFpbCI6ImdhbWVyaGFidjJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJVMjlLdVNybE5DcENucVI3Z2ZONWR3IiwibmFtZSI6IkdhbWVyaGFiIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0syYUlwVkk2TEdTTGM2c20tcEhBVi00V0docW9ISF8zd05kckVPLWlfbE1DN0o2NDQ9czk2LWMiLCJnaXZlbl9uYW1lIjoiR2FtZXJoYWIiLCJpYXQiOjE3Nzk4Njg2NzgsImV4cCI6MTc3OTg3MjI3OH0.WGzSC4hNZaxx37urHkcadvWldUf-JvjW8Mj5N8PN76dqRO5w7FJvyo7uInW0zXeJPyDvOKZI75q3kpPCPkVUFsRYVzH5FOgfKWvnL30qZKQevF0WvoWddXf3biYM9hcokNJ3I7ndqjo6fL2AcfPvi6d_ikgMae6U_TPfB2HlRJYnpxjX1hfuXnUG_AaGkLJzV38otgMoZ1QdjzzYfuXnvaBw2och0yJSE_nxzbd0B-o_W9vwgesxPP9-q9feY9sZSkBXI7Ukbov8oi-4QXtiIoUYeVHGmEw5bFHcOeHjFFZzdT8_VxVpZdHoKhke9I7w-rxnV-tV_iXpvU__88GOZw',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AdminPermission`
--

DROP TABLE IF EXISTS `AdminPermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AdminPermission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(191) NOT NULL,
  `label` varchar(191) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminPermission_key_key` (`key`),
  KEY `AdminPermission_enabled_idx` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminPermission`
--

LOCK TABLES `AdminPermission` WRITE;
/*!40000 ALTER TABLE `AdminPermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `AdminPermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Banner`
--

DROP TABLE IF EXISTS `Banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) DEFAULT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `buttonLink` varchar(191) DEFAULT NULL,
  `buttonImageUrl` varchar(191) DEFAULT NULL,
  `order` int(11) DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Banner_isActive_order_idx` (`isActive`,`order`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banner`
--

LOCK TABLES `Banner` WRITE;
/*!40000 ALTER TABLE `Banner` DISABLE KEYS */;
INSERT INTO `Banner` VALUES
(1,'Burning Crusade Classic Anniversary Edition','Return to Outland and relive the war that changed Azeroth forever.','https://gamingqu.com/burning-crusade-classic-anniversary-edition','/uploads/benner/button-1770228046931.webp',0,1,'2026-02-04 18:00:46.935','2026-02-04 18:00:46.935'),
(2,'Diablo IV','Enter the World of Darkness and Conquer Hell','https://gamingqu.com/diablo-4','/uploads/benner/button-1770321969563.jpg',1,1,'2026-02-05 20:06:09.566','2026-02-05 20:06:09.566'),
(3,'Second Midnight Pre-Expansion','Dive into the second Midnight Pre-Expansion content update filled with class updates','https://gamingqu.com/blog/wow-weekly-second-midnight-pre-expansion-get-cozy-in-the-arcantina-silvermoon-city-tour-and-more','/uploads/benner/button-1771117321692.jpg',2,1,'2026-02-15 01:02:01.806','2026-02-15 01:02:01.806');
/*!40000 ALTER TABLE `Banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BoosterApplication`
--

DROP TABLE IF EXISTS `BoosterApplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BoosterApplication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `discord` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `fullName` varchar(191) DEFAULT NULL,
  `games` text DEFAULT NULL,
  `whatsapp` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `BoosterApplication_userId_status_idx` (`userId`,`status`),
  KEY `BoosterApplication_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `BoosterApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BoosterApplication`
--

LOCK TABLES `BoosterApplication` WRITE;
/*!40000 ALTER TABLE `BoosterApplication` DISABLE KEYS */;
/*!40000 ALTER TABLE `BoosterApplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BoosterPayoutAccount`
--

DROP TABLE IF EXISTS `BoosterPayoutAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BoosterPayoutAccount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `type` enum('BANK','EWALLET','CRYPTO') NOT NULL,
  `providerName` varchar(191) NOT NULL,
  `accountName` varchar(191) NOT NULL,
  `accountRef` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BoosterPayoutAccount_userId_providerName_accountRef_key` (`userId`,`providerName`,`accountRef`),
  KEY `BoosterPayoutAccount_userId_isActive_createdAt_idx` (`userId`,`isActive`,`createdAt`),
  CONSTRAINT `BoosterPayoutAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BoosterPayoutAccount`
--

LOCK TABLES `BoosterPayoutAccount` WRITE;
/*!40000 ALTER TABLE `BoosterPayoutAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `BoosterPayoutAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BoosterWithdrawal`
--

DROP TABLE IF EXISTS `BoosterWithdrawal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BoosterWithdrawal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `accountId` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'USD',
  `status` enum('PENDING','PROCESSING','REJECTED','PAID') NOT NULL DEFAULT 'PENDING',
  `note` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BoosterWithdrawal_userId_status_createdAt_idx` (`userId`,`status`,`createdAt`),
  KEY `BoosterWithdrawal_accountId_idx` (`accountId`),
  CONSTRAINT `BoosterWithdrawal_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `BoosterPayoutAccount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BoosterWithdrawal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BoosterWithdrawal`
--

LOCK TABLES `BoosterWithdrawal` WRITE;
/*!40000 ALTER TABLE `BoosterWithdrawal` DISABLE KEYS */;
/*!40000 ALTER TABLE `BoosterWithdrawal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `gameId` int(11) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  UNIQUE KEY `Category_name_gameId_key` (`name`,`gameId`),
  KEY `Category_gameId_isActive_idx` (`gameId`,`isActive`),
  CONSTRAINT `Category_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES
(1,'Leveling','leveling',1,1,'2026-02-04 15:08:48.183','2026-02-04 15:08:48.183'),
(2,'Dungeons','dungeons',1,1,'2026-02-08 17:07:45.173','2026-02-08 17:07:45.173'),
(3,'PvP','pvp',1,1,'2026-02-12 16:04:13.677','2026-02-12 16:04:13.677'),
(5,'Leveling','leveling-wfqx',2,1,'2026-02-13 18:08:39.220','2026-02-13 18:08:39.220');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmbedCode`
--

DROP TABLE IF EXISTS `EmbedCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EmbedCode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `code` text NOT NULL,
  `placement` enum('HEAD','BODY','FOOTER') NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `EmbedCode_placement_isActive_idx` (`placement`,`isActive`),
  KEY `EmbedCode_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmbedCode`
--

LOCK TABLES `EmbedCode` WRITE;
/*!40000 ALTER TABLE `EmbedCode` DISABLE KEYS */;
INSERT INTO `EmbedCode` VALUES
(1,'Google Analytics','<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-M9WL98344D\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag(\'js\', new Date());\n\n  gtag(\'config\', \'G-M9WL98344D\');\n</script>','HEAD',1,'2026-02-04 21:15:30.167','2026-02-04 21:16:25.510'),
(3,'Tawk Wdget','<!--Start of Tawk.to Script-->\n<script type=\"text/javascript\">\nvar Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();\n(function(){\nvar s1=document.createElement(\"script\"),s0=document.getElementsByTagName(\"script\")[0];\ns1.async=true;\ns1.src=\'https://embed.tawk.to/6983bc45c262251c38f95511/1jgl9es0a\';\ns1.charset=\'UTF-8\';\ns1.setAttribute(\'crossorigin\',\'*\');\ns0.parentNode.insertBefore(s1,s0);\n})();\n</script>\n<!--End of Tawk.to Script-->','HEAD',1,'2026-02-04 21:40:32.462','2026-02-04 21:40:32.462'),
(4,'Google Tag Manager (Head)','<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\nnew Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,\'script\',\'dataLayer\',\'GTM-KQQ4T56Z\');</script>','HEAD',1,'2026-03-05 04:06:48.564','2026-03-05 04:18:58.189'),
(5,'Google Tag Manager (Body)','<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-KQQ4T56Z\"\nheight=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>','BODY',1,'2026-03-05 04:07:10.580','2026-03-05 04:19:10.201');
/*!40000 ALTER TABLE `EmbedCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FooterSetting`
--

DROP TABLE IF EXISTS `FooterSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FooterSetting` (
  `id` varchar(191) NOT NULL DEFAULT 'singleton',
  `disclaimer` text DEFAULT NULL,
  `shortDescription` text DEFAULT NULL,
  `copyright` varchar(191) DEFAULT NULL,
  `legalAddress` varchar(191) DEFAULT NULL,
  `regNumber` varchar(191) DEFAULT NULL,
  `smTelegramUrl` varchar(191) DEFAULT NULL,
  `smYoutubeUrl` varchar(191) DEFAULT NULL,
  `smDiscordUrl` varchar(191) DEFAULT NULL,
  `smFacebookUrl` varchar(191) DEFAULT NULL,
  `navHomeTitle` varchar(191) DEFAULT NULL,
  `navHomeUrl` varchar(191) DEFAULT NULL,
  `navAboutTitle` varchar(191) DEFAULT NULL,
  `navAboutUrl` varchar(191) DEFAULT NULL,
  `navFaqTitle` varchar(191) DEFAULT NULL,
  `navFaqUrl` varchar(191) DEFAULT NULL,
  `navBoosterTitle` varchar(191) DEFAULT NULL,
  `navBoosterUrl` varchar(191) DEFAULT NULL,
  `legal1Title` varchar(191) DEFAULT NULL,
  `legal1Url` varchar(191) DEFAULT NULL,
  `legal2Title` varchar(191) DEFAULT NULL,
  `legal2Url` varchar(191) DEFAULT NULL,
  `legal3Title` varchar(191) DEFAULT NULL,
  `legal3Url` varchar(191) DEFAULT NULL,
  `legal4Title` varchar(191) DEFAULT NULL,
  `legal4Url` varchar(191) DEFAULT NULL,
  `pmVisaUrl` varchar(191) DEFAULT NULL,
  `pmMastercardUrl` varchar(191) DEFAULT NULL,
  `pmGpayUrl` varchar(191) DEFAULT NULL,
  `pmApplePayUrl` varchar(191) DEFAULT NULL,
  `pmPaypalUrl` varchar(191) DEFAULT NULL,
  `pmStripeUrl` varchar(191) DEFAULT NULL,
  `badgeMastercardUrl` varchar(191) DEFAULT NULL,
  `badgeVisaUrl` varchar(191) DEFAULT NULL,
  `badgePciUrl` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FooterSetting_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FooterSetting`
--

LOCK TABLES `FooterSetting` WRITE;
/*!40000 ALTER TABLE `FooterSetting` DISABLE KEYS */;
INSERT INTO `FooterSetting` VALUES
('singleton',NULL,'Your ultimate gaming paradise. Discover the best games and gaming experiences with professional boosting services.',NULL,NULL,NULL,'https://t.me/gamingqu','https://www.youtube.com/@GamingQu','https://discord.gg/gamingqu','https://www.facebook.com/groups/gamingqu','Home','/','About Us','/about','FAQ','/faq','Become a Booster','/booster/apply','Terms And Conditions','/terms','Privacy Policy','/privacy-policy','Refund Policy','/refund-policy','Cookie Policy','/cookie-policy','/uploads/footer/footer-pm-visa-1770207050908.png','/uploads/footer/footer-pm-mastercard-1770207050909.png','/uploads/footer/footer-pm-gpay-1770207050909.png','/uploads/footer/footer-pm-applepay-1770207050910.png','/uploads/footer/footer-pm-paypal-1770207050910.png','/uploads/footer/footer-pm-stripe-1770207050911.webp',NULL,NULL,NULL,1,'2026-02-04 12:10:12.820','2026-02-20 15:25:00.597');
/*!40000 ALTER TABLE `FooterSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Game`
--

DROP TABLE IF EXISTS `Game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `iconUrl` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isHotOffer` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Game_name_key` (`name`),
  UNIQUE KEY `Game_slug_key` (`slug`),
  KEY `Game_isActive_createdAt_idx` (`isActive`,`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Game`
--

LOCK TABLES `Game` WRITE;
/*!40000 ALTER TABLE `Game` DISABLE KEYS */;
INSERT INTO `Game` VALUES
(1,'Burning Crusade Classic Anniversary Edition','burning-crusade-classic-anniversary-edition','/uploads/games/burning-crusade-classic-anniversary-edition-image-1770207841312.jpg','/uploads/games/burning-crusade-classic-anniversary-edition-icon-1770207841318.png','<strong data-start=\"90\" data-end=\"138\">Burning Crusade Classic™ Anniversary Edition</strong> Experience the legend of Outland once again.',1,1,'2026-02-04 12:24:01.320','2026-02-04 12:26:26.790'),
(2,'World of Warcraft Midnight','world-of-warcraft-midnight','/uploads/games/world-of-warcraft-midnight-image-1770227394708.jpg','/uploads/games/world-of-warcraft-midnight-icon-1770226400069.jpg','When the last light fades, the shadows rise.',0,1,'2026-02-04 17:33:20.086','2026-02-04 17:49:54.724'),
(3,'WoW Classic Era','wow-classic-era','/uploads/games/wow-classic-era-image-1770227770672.jpeg','/uploads/games/wow-classic-era-icon-1770227770673.png','Return to a time when adventures were dangerous, friendships mattered, and legends were born.',0,1,'2026-02-04 17:56:10.692','2026-02-04 17:56:10.692'),
(4,'WoW Mists Pandaria','wow-mists-pandaria','/uploads/games/wow-mists-pandaria-image-1770227895565.jpg','/uploads/games/wow-mists-pandaria-icon-1770227895565.png','Journey beyond the mists into a land of wonder, danger, and ancient traditions shaped by balance and honor.',0,1,'2026-02-04 17:58:15.567','2026-02-04 17:58:15.567'),
(5,'Lost Ark','lost-ark','/uploads/games/lost-ark-image-1770321460160.jpg','/uploads/games/lost-ark-icon-1770321460161.png','<strong data-start=\"88\" data-end=\"100\">Lost Ark</strong> is an isometric action MMORPG featuring fast-paced combat',0,1,'2026-02-05 19:57:40.173','2026-02-05 19:57:40.173'),
(6,'Albion','albion','/uploads/games/albion-image-1770321591246.jpg','/uploads/games/albion-icon-1770321591247.png','<strong data-start=\"0\" data-end=\"17\" data-is-only-node=\"\">Albion Online</strong> is a sandbox MMORPG with a player-driven economy',0,1,'2026-02-05 19:59:51.250','2026-02-05 19:59:51.250'),
(7,'Fellowship','fellowship','/uploads/games/fellowship-image-1770321698126.jpg','/uploads/games/fellowship-icon-1770321698125.jpg','<strong data-start=\"0\" data-end=\"14\" data-is-only-node=\"\">Fellowship</strong> is a cooperative action RPG focused on teamwork, fast-paced combat, and challenging encounters in a fantasy world.',0,1,'2026-02-05 20:01:38.128','2026-02-05 20:01:38.128'),
(8,'Diablo 4','diablo-4','/uploads/games/diablo-4-image-1770321799452.jpg','/uploads/games/diablo-4-icon-1770321799453.png','<p><strong>Diablo IV</strong> is an action RPG with dark fantasy themes, brutal combat,&nbsp;</p>',0,1,'2026-02-05 20:03:19.456','2026-02-05 20:03:19.456');
/*!40000 ALTER TABLE `Game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `serviceId` int(11) NOT NULL,
  `serviceSlug` varchar(191) NOT NULL,
  `methodSlug` varchar(191) NOT NULL,
  `items` decimal(10,2) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `boosterPay` decimal(10,2) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'USD',
  `status` enum('CREATED','PENDING','PAID','CANCELED','FAILED') NOT NULL DEFAULT 'CREATED',
  `fulfillmentStatus` enum('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELED') NOT NULL DEFAULT 'PENDING',
  `contactEmail` varchar(191) DEFAULT NULL,
  `contactDiscord` varchar(191) DEFAULT NULL,
  `characterName` varchar(191) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_code_key` (`code`),
  KEY `Order_userId_status_createdAt_idx` (`userId`,`status`,`createdAt`),
  KEY `Order_serviceId_methodSlug_idx` (`serviceId`,`methodSlug`),
  CONSTRAINT `Order_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
INSERT INTO `Order` VALUES
(10,'ORD-137607596-3T6F',NULL,6,'1-90-custom-leveling','paypal',147.32,7.37,154.69,73.66,'USD','PENDING','PENDING','wawan',NULL,NULL,'{\"selectedOptions\":[{\"title\":\"Choose number of characters\",\"values\":[\"1 Character\"]},{\"title\":\"Choose Faction\",\"values\":[\"Alliance\"]},{\"title\":\"Select Character class\",\"values\":[\"Warrior\"]},{\"title\":\"Midnight Additional Options\",\"values\":[\"Loremaster of Midnight\"]},{\"title\":\"Leveling Speed\",\"values\":[\"Normal\"]}],\"range\":{\"from\":80,\"to\":90}}','2026-04-14 03:33:27.974','2026-04-14 03:33:27.974'),
(11,'ORD-137620999-HQ1E',NULL,6,'1-90-custom-leveling','cryptomus',147.32,4.42,151.74,73.66,'USD','CANCELED','PENDING','wawan',NULL,NULL,'{\"selectedOptions\":[{\"title\":\"Choose number of characters\",\"values\":[\"1 Character\"]},{\"title\":\"Choose Faction\",\"values\":[\"Alliance\"]},{\"title\":\"Select Character class\",\"values\":[\"Warrior\"]},{\"title\":\"Midnight Additional Options\",\"values\":[\"Loremaster of Midnight\"]},{\"title\":\"Leveling Speed\",\"values\":[\"Normal\"]}],\"range\":{\"from\":80,\"to\":90}}','2026-04-14 03:33:41.001','2026-04-14 05:34:12.691'),
(12,'ORD-043447935-DQ6Q',NULL,1,'tbc-power-leveling','paypal',150.33,7.52,157.85,75.17,'USD','PENDING','PENDING',NULL,NULL,NULL,'{\"selectedOptions\":[{\"title\":\"Completion Method\",\"values\":[\"Piloted\"]},{\"title\":\"Choose Server\",\"values\":[\"Dreamscythe\"]},{\"title\":\"Select Character class\",\"values\":[\"Hunter\"]},{\"title\":\"Faction\",\"values\":[\"Alliance\"]},{\"title\":\"Leveling Speed\",\"values\":[\"Normal\"]}],\"range\":{\"from\":60,\"to\":70}}','2026-05-17 18:44:08.040','2026-05-17 18:44:08.040'),
(13,'ORD-043455176-X1G1',NULL,1,'tbc-power-leveling','cryptomus',150.33,4.51,154.84,75.17,'USD','CANCELED','PENDING',NULL,NULL,NULL,'{\"selectedOptions\":[{\"title\":\"Completion Method\",\"values\":[\"Piloted\"]},{\"title\":\"Choose Server\",\"values\":[\"Dreamscythe\"]},{\"title\":\"Select Character class\",\"values\":[\"Hunter\"]},{\"title\":\"Faction\",\"values\":[\"Alliance\"]},{\"title\":\"Leveling Speed\",\"values\":[\"Normal\"]}],\"range\":{\"from\":60,\"to\":70}}','2026-05-17 18:44:15.181','2026-05-17 20:46:08.192');
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `content` longtext DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_slug_key` (`slug`),
  KEY `Page_slug_idx` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES
(1,'Cookie Policy','cookie-policy','<p>This Cookie Policy explains how <strong>Gamingqu.com</strong> (\"we,\" \"us,\" or \"our\") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>\n\n<hr>\n\n<h2>1. WHAT ARE COOKIES?</h2>\n<p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>\n<ul>\n  <li><strong>First-party cookies:</strong> Cookies set by the website owner (in this case, Gamingqu).</li>\n  <li><strong>Third-party cookies:</strong> Cookies set by parties other than the website owner. These enable third-party features or functionality (e.g., analytics, payment gateways, live chat).</li>\n</ul>\n\n<h2>2. WHY DO WE USE COOKIES?</h2>\n<p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as \"essential\" or \"strictly necessary\" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.</p>\n\n<h2>3. TYPES OF COOKIES WE USE</h2>\n\n<h3>A. Essential Cookies</h3>\n<p>These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas (e.g., User Dashboard, Admin Panel).</p>\n<ul>\n  <li><strong>Session Cookies:</strong> To keep you logged in while you navigate through different pages.</li>\n  <li><strong>Security Cookies:</strong> To identify and prevent security risks.</li>\n</ul>\n\n<h3>B. Analytics and Customization Cookies</h3>\n<p>These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>\n<ul>\n  <li><strong>Google Analytics:</strong> We use Google Analytics to track website traffic and user behavior anonymously.</li>\n</ul>\n\n<h3>C. Functionality Cookies</h3>\n<p>These cookies allow our Website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features.</p>\n\n<h2>4. HOW CAN YOU CONTROL COOKIES?</h2>\n<p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your browser preferences.</p>\n<ul>\n  <li><strong>Browser Controls:</strong> You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</li>\n  <li><strong>Help Menu:</strong> As the means by which you can refuse cookies varies from browser to browser, you should visit your browser\'s help menu for more information.</li>\n</ul>\n\n<h2>5. UPDATES TO THIS POLICY</h2>\n<p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>\n<p>The date at the top of this Cookie Policy indicates when it was last updated.</p>\n\n<h2>6. CONTACT US</h2>\n<p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>\n<ul>\n  <li><strong>Email:</strong> admin@gamingqu.com</li>\n  <li><strong>WhatsApp:</strong> 085161841094</li>\n  <li><strong>Telegram:</strong> @gamingku</li>\n</ul>',1,'2026-02-05 21:05:08.005','2026-02-05 21:05:08.005'),
(2,'Refund Policy','refund-policy','<p><strong>Gamingqu.com</strong>, we are committed to providing high-quality digital boosting services. However, we understand that circumstances may change. This Refund Policy outlines the conditions under which you may be eligible for a refund, cancellation, or adjustment of your order.</p>\n\n<p>Please read this policy carefully before placing an order. By purchasing our services, you agree to be bound by the terms outlined below.</p>\n\n<hr>\n\n<h2>1. GENERAL REFUND CONDITIONS</h2>\n<p>Refunds are generally available only for services that have not yet been completed. Due to the digital nature of our products (time and effort spent by boosters), completed services are non-refundable.</p>\n<ul>\n  <li><strong>Eligibility:</strong> You are eligible for a refund if the service has not started or is only partially completed.</li>\n  <li><strong>Processing Time:</strong> Refund requests are processed within <strong>24-48 hours</strong>. The funds may take 3-7 business days to appear in your account depending on your payment provider.</li>\n  <li><strong>Payment Method:</strong> Refunds will be issued to the original payment method used during the purchase. If that is not possible, store credit will be offered.</li>\n</ul>\n\n<h2>2. FULL REFUNDS</h2>\n<p>You are entitled to a <strong>100% refund</strong> in the following situations:</p>\n<ul>\n  <li><strong>Service Not Started:</strong> You request a cancellation before the booster has been assigned or before the service has officially commenced.</li>\n  <li><strong>Booster Availability:</strong> We are unable to assign a booster to your order within 48 hours of payment.</li>\n  <li><strong>Order Error:</strong> You placed a duplicate order by mistake and reported it immediately.</li>\n</ul>\n\n<h2>3. PARTIAL REFUNDS</h2>\n<p>If a service has already started but is not yet finished, you may request a partial refund.</p>\n<ul>\n  <li><strong>Calculation:</strong> The refund amount will be calculated based on the progress already made. For example, if you ordered a boost from Rank 1 to Rank 10, and we have reached Rank 5, you will be refunded for the remaining 5 ranks.</li>\n  <li><strong>Cancellation Fee:</strong> A small cancellation fee (10%) may be deducted to compensate the booster for the reserved time slot.</li>\n  <li><strong>Service Paused:</strong> If you wish to pause the service and resume later, we can convert the remaining value into store credit instead of a cash refund.</li>\n</ul>\n\n<h2>4. NON-REFUNDABLE CIRCUMSTANCES</h2>\n<p>We do <strong>NOT</strong> offer refunds in the following cases:</p>\n<ul>\n  <li><strong>Completed Services:</strong> The service has been fully delivered and verified.</li>\n  <li><strong>Account Issues:</strong> Your game account is banned or suspended due to reasons unrelated to our service, or due to your violation of the game\'s Terms of Service prior to our involvement.</li>\n  <li><strong>Buyer\'s Remorse:</strong> You simply changed your mind after the service has been completed.</li>\n  <li><strong>Incorrect Info:</strong> You provided incorrect account credentials or server information, and failed to correct them after multiple attempts by our team to contact you.</li>\n  <li><strong>Interference:</strong> You logged into the account during the boosting process and played ranked matches, disrupting the booster\'s progress (this voids the service guarantee).</li>\n</ul>\n\n<h2>5. DISPUTES AND CHARGEBACKS</h2>\n<p>Unauthorized chargebacks are strictly prohibited.</p>\n<ul>\n  <li>If you open a dispute with your payment provider (e.g., PayPal, Bank) without contacting us first, we reserve the right to <strong>suspend your account</strong> and blacklist you from future services.</li>\n  <li>We will provide all necessary evidence (chat logs, progress screenshots, login logs) to the payment provider to prove that the service was delivered or in progress.</li>\n</ul>\n\n<h2>6. HOW TO REQUEST A REFUND</h2>\n<p>To request a refund or cancellation, please contact our support team immediately with your <strong>Order ID</strong> and the reason for the request.</p>\n<ul>\n  <li><strong>Email:</strong> admin@gamingqu.com</li>\n  <li><strong>WhatsApp:</strong> 085161841094</li>\n  <li><strong>Telegram:</strong> @gamingku</li>\n</ul>\n\n<h2>7. CHANGES TO THIS POLICY</h2>\n<p>Gamingqu.com reserves the right to amend this Refund Policy at any time. Any changes will be effective immediately upon posting on this page.</p>',1,'2026-02-05 21:05:24.442','2026-02-05 21:05:24.442'),
(3,'Privacy Policy','privacy-policy','<p><strong>Gamingqu.com</strong> (\"we,\" \"us,\" or \"our\"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our boosting services. By accessing or using our Service, you agree to the terms of this Privacy Policy.</p>\n\n<hr>\n\n<h2>1. INFORMATION WE COLLECT</h2>\n<p>We collect information that you provide directly to us when you register, place an order, or communicate with us.</p>\n\n<h3>A. Personal Information</h3>\n<ul>\n  <li><strong>Contact Details:</strong> Name, email address, phone number (WhatsApp/Telegram).</li>\n  <li><strong>Account Credentials:</strong> Game account username and password (only for \"Pilot/Account Share\" services).</li>\n  <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us. Note: We do not store your credit card information; payments are processed by secure third-party gateways.</li>\n</ul>\n\n<h3>B. Usage Data</h3>\n<p>We may automatically collect information about how you access and use the Service, including:</p>\n<ul>\n  <li>IP address, browser type, and operating system.</li>\n  <li>Pages viewed, time spent on pages, and clickstream data.</li>\n  <li>Device information used to access the Service.</li>\n</ul>\n\n<h2>2. HOW WE USE YOUR INFORMATION</h2>\n<p>We use the collected data for various purposes:</p>\n<ul>\n  <li><strong>Service Delivery:</strong> To provide and maintain our boosting services, including logging into your game account to complete orders.</li>\n  <li><strong>Communication:</strong> To contact you regarding your order status, updates, or support inquiries via Email, WhatsApp, or Telegram.</li>\n  <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activities.</li>\n  <li><strong>Improvement:</strong> To analyze usage patterns and improve user experience on our website.</li>\n</ul>\n\n<h2>3. ACCOUNT SECURITY &amp; CREDENTIALS</h2>\n<p>We take the security of your game account credentials extremely seriously.</p>\n<ul>\n  <li><strong>Encryption:</strong> Your account details are transmitted securely and are only accessible to the assigned Booster and our Admin team.</li>\n  <li><strong>Limited Access:</strong> Credentials are strictly used for the duration of the boosting service and are deleted from our active records upon order completion.</li>\n  <li><strong>Booster Protocols:</strong> All Boosters are under strict Non-Disclosure Agreements (NDA) prohibiting them from changing settings, spending currency, or communicating with your in-game friends.</li>\n  <li><strong>VPN Usage:</strong> Boosters use VPNs matching your geographical location to minimize the risk of account flagging by game publishers.</li>\n</ul>\n\n<h2>4. SHARING OF INFORMATION</h2>\n<p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.</p>\n<p>We may disclose your personal information only in the following situations:</p>\n<ul>\n  <li><strong>Legal Requirements:</strong> To comply with a legal obligation or protect against legal liability.</li>\n  <li><strong>Service Providers:</strong> To third-party companies (e.g., payment processors) that perform services on our behalf.</li>\n</ul>\n\n<h2>5. COOKIES AND TRACKING</h2>\n<p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>\n<ul>\n  <li><strong>Essential Cookies:</strong> Necessary for the operation of the website (e.g., login sessions).</li>\n  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website.</li>\n</ul>\n<p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>\n\n<h2>6. DATA RETENTION</h2>\n<p>We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>\n\n<h2>7. CHILDREN\'S PRIVACY</h2>\n<p>Our Service does not address anyone under the age of 18 (\"Children\"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.</p>\n\n<h2>8. YOUR DATA RIGHTS</h2>\n<p>Depending on your location, you may have the following rights regarding your data:</p>\n<ul>\n  <li>The right to access, update, or delete the information we have on you.</li>\n  <li>The right of rectification.</li>\n  <li>The right to object.</li>\n  <li>The right of restriction.</li>\n</ul>\n\n<h2>9. THIRD-PARTY LINKS</h2>\n<p>Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party\'s site. We strongly advise you to review the Privacy Policy of every site you visit.</p>\n\n<h2>10. CHANGES TO THIS PRIVACY POLICY</h2>\n<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>\n\n<h2>11. CONTACT US</h2>\n<p>If you have any questions about this Privacy Policy, please contact us:</p>\n<ul>\n  <li><strong>Email:</strong> admin@gamingqu.com</li>\n  <li><strong>WhatsApp:</strong> 085161841094</li>\n  <li><strong>Telegram:</strong> @gamingku</li>\n</ul>',1,'2026-02-05 21:05:40.088','2026-02-05 21:05:40.088'),
(4,'Terms And Conditions','terms','<p>Welcome to <strong>Gamingqu.com</strong>. These Terms and Conditions (\"Terms\") govern your access to and use of the Gamingqu website, services, and applications (collectively, the \"Service\"). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.</p>\n\n<hr>\n\n<h2>1. DEFINITIONS</h2>\n<ul>\n  <li><strong>\"Company\", \"We\", \"Us\", \"Our\"</strong> refers to Gamingqu.com.</li>\n  <li><strong>\"User\", \"You\", \"Client\"</strong> refers to the individual accessing or using the Service.</li>\n  <li><strong>\"Booster\"</strong> refers to the independent professional gamer contracting with Gamingqu to provide in-game services.</li>\n  <li><strong>\"Service\"</strong> refers to the digital boosting, coaching, and account services provided by Gamingqu.</li>\n  <li><strong>\"Order\"</strong> refers to a request for Service placed by the User.</li>\n</ul>\n\n<h2>2. NATURE OF SERVICES</h2>\n<p>Gamingqu acts as an intermediary platform connecting gamers (Clients) with professional players (Boosters) to assist in achieving specific in-game goals.</p>\n<ul>\n  <li><strong>Digital Service:</strong> We provide intangible digital services. No physical products are shipped.</li>\n  <li><strong>No Ownership:</strong> We do not sell the game itself, nor do we claim ownership of any intellectual property related to the games. All game content, characters, and items remain the property of their respective publishers (e.g., Blizzard, Riot Games, Valve).</li>\n</ul>\n\n<h2>3. ELIGIBILITY AND ACCOUNT</h2>\n<p>By using our Service, you represent and warrant that:</p>\n<ul>\n  <li>You are at least 18 years of age.</li>\n  <li>You are not an employee, agent, or affiliated with any game developer or publisher associated with the games we support.</li>\n  <li>You agree to provide accurate information regarding your game account when necessary for the Service.</li>\n</ul>\n\n<h2>4. BOOSTING TERMS &amp; ACCOUNT SAFETY</h2>\n<p>You acknowledge that \"boosting\" (account sharing or duo-playing for rank advancement) may violate the Terms of Service (ToS) of specific game publishers.</p>\n<ul>\n  <li><strong>Risk Acceptance:</strong> While we take strict security measures (VPN usage, offline mode), you acknowledge that any action taken by the game publisher (suspension, ban, rank reset) is beyond our control. Gamingqu is not liable for any such actions.</li>\n  <li><strong>Account Access:</strong> For \"Pilot\" (Account Sharing) services, you must provide temporary access to your account. We strongly recommend changing your password before and after the service.</li>\n  <li><strong>Privacy:</strong> Boosters are strictly prohibited from messaging your friends, spending in-game currency, or changing account settings unless explicitly instructed.</li>\n</ul>\n\n<h2>5. PAYMENTS &amp; PRICING</h2>\n<ul>\n  <li><strong>Prepayment:</strong> Full payment is required before the Service commences.</li>\n  <li><strong>Currency:</strong> All prices are processed in the currency displayed at checkout (USD/EUR).</li>\n  <li><strong>Price Changes:</strong> We reserve the right to modify prices at any time without prior notice.</li>\n</ul>\n\n<h2>6. REFUND AND CANCELLATION POLICY</h2>\n<p>We strive for customer satisfaction. Our refund policy is as follows:</p>\n<ul>\n  <li><strong>Full Refund:</strong> You are entitled to a full refund if the Service has not started within 24 hours of your order.</li>\n  <li><strong>Partial Refund:</strong> If you wish to cancel a Service that is already in progress, you will be refunded for the remaining percentage of the unfinished work.</li>\n  <li><strong>No Refund:</strong> Once a Service is 100% completed, it is considered final and non-refundable.</li>\n  <li><strong>Disputes:</strong> Unauthorized chargebacks or payment disputes will result in an immediate ban from our platform and may be reported to relevant authorities.</li>\n</ul>\n\n<h2>7. INTELLECTUAL PROPERTY</h2>\n<p>Gamingqu is an unofficial fan site and service provider. We are not endorsed by, affiliated with, or sponsored by any game publisher. All game art, screenshots, and trademarks cited on this website are the property of their respective owners and are used for descriptive purposes only.</p>\n\n<h2>8. LIMITATION OF LIABILITY</h2>\n<p>To the maximum extent permitted by law, Gamingqu shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>\n<ul>\n  <li>Your access to or use of or inability to access or use the Service;</li>\n  <li>Any conduct or content of any third party on the Service;</li>\n  <li>Any content obtained from the Service; and</li>\n  <li>Unauthorized access, use, or alteration of your transmissions or content.</li>\n</ul>\n\n<h2>9. INDEMNIFICATION</h2>\n<p>You agree to defend, indemnify, and hold harmless Gamingqu and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney\'s fees), resulting from your use of the Service or a breach of these Terms.</p>\n\n<h2>10. GOVERNING LAW</h2>\n<p>These Terms shall be governed and construed in accordance with the laws of the Republic of Indonesia, without regard to its conflict of law provisions.</p>\n\n<h2>11. CHANGES TO TERMS</h2>\n<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>\n\n<h2>12. CONTACT INFORMATION</h2>\n<p>If you have any questions about these Terms, please contact us:</p>\n<ul>\n  <li><strong>Email:</strong> admin@gamingqu.com</li>\n  <li><strong>WhatsApp:</strong> 085161841094</li>\n  <li><strong>Telegram:</strong> @gamingku</li>\n</ul>',1,'2026-02-05 21:05:59.400','2026-02-05 21:05:59.400');
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerOrderId` varchar(191) DEFAULT NULL,
  `approvalUrl` text DEFAULT NULL,
  `status` enum('CREATED','APPROVAL_REQUIRED','APPROVED','CAPTURED','CANCELED','FAILED') NOT NULL DEFAULT 'CREATED',
  `raw` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Payment_orderId_provider_status_idx` (`orderId`,`provider`,`status`),
  CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES
(10,10,'paypal','0NX5416939472174L','https://www.paypal.com/checkoutnow?token=0NX5416939472174L','APPROVAL_REQUIRED','{\"id\":\"0NX5416939472174L\",\"status\":\"CREATED\",\"links\":[{\"href\":\"https://api.paypal.com/v2/checkout/orders/0NX5416939472174L\",\"rel\":\"self\",\"method\":\"GET\"},{\"href\":\"https://www.paypal.com/checkoutnow?token=0NX5416939472174L\",\"rel\":\"approve\",\"method\":\"GET\"},{\"href\":\"https://api.paypal.com/v2/checkout/orders/0NX5416939472174L\",\"rel\":\"update\",\"method\":\"PATCH\"},{\"href\":\"https://api.paypal.com/v2/checkout/orders/0NX5416939472174L/capture\",\"rel\":\"capture\",\"method\":\"POST\"}]}','2026-04-14 03:33:28.087','2026-04-14 03:33:29.035'),
(11,11,'cryptomus','a54271db-397e-4c4e-a4a6-eaa990c71e7c','https://pay.cryptomus.com/pay/a54271db-397e-4c4e-a4a6-eaa990c71e7c','CANCELED','{\"type\":\"payment\",\"uuid\":\"a54271db-397e-4c4e-a4a6-eaa990c71e7c\",\"order_id\":\"ORD-137620999-HQ1E\",\"amount\":\"151.74000000\",\"payment_amount\":null,\"payment_amount_usd\":\"0.00\",\"merchant_amount\":null,\"commission\":null,\"is_final\":true,\"status\":\"cancel\",\"from\":null,\"wallet_address_uuid\":null,\"network\":null,\"currency\":\"USD\",\"payer_currency\":null,\"payer_amount\":null,\"payer_amount_exchange_rate\":null,\"additional_data\":null,\"transfer_id\":null,\"sign\":\"88afd7791e01850cbcd4d95f8c480f0b\"}','2026-04-14 03:33:41.028','2026-04-14 05:34:12.635'),
(12,12,'paypal','6DH64144N8627281P','https://www.paypal.com/checkoutnow?token=6DH64144N8627281P','APPROVAL_REQUIRED','{\"id\":\"6DH64144N8627281P\",\"status\":\"CREATED\",\"links\":[{\"href\":\"https://api.paypal.com/v2/checkout/orders/6DH64144N8627281P\",\"rel\":\"self\",\"method\":\"GET\"},{\"href\":\"https://www.paypal.com/checkoutnow?token=6DH64144N8627281P\",\"rel\":\"approve\",\"method\":\"GET\"},{\"href\":\"https://api.paypal.com/v2/checkout/orders/6DH64144N8627281P\",\"rel\":\"update\",\"method\":\"PATCH\"},{\"href\":\"https://api.paypal.com/v2/checkout/orders/6DH64144N8627281P/capture\",\"rel\":\"capture\",\"method\":\"POST\"}]}','2026-05-17 18:44:08.168','2026-05-17 18:44:08.968'),
(13,13,'cryptomus','e2da1c4f-2fb1-45d2-b83a-5570fba1675b','https://pay.cryptomus.com/pay/e2da1c4f-2fb1-45d2-b83a-5570fba1675b','CANCELED','{\"type\":\"payment\",\"uuid\":\"e2da1c4f-2fb1-45d2-b83a-5570fba1675b\",\"order_id\":\"ORD-043455176-X1G1\",\"amount\":\"154.84000000\",\"payment_amount\":null,\"payment_amount_usd\":\"0.00\",\"merchant_amount\":null,\"commission\":null,\"is_final\":true,\"status\":\"cancel\",\"from\":null,\"wallet_address_uuid\":null,\"network\":null,\"currency\":\"USD\",\"payer_currency\":null,\"payer_amount\":null,\"payer_amount_exchange_rate\":null,\"additional_data\":null,\"transfer_id\":null,\"sign\":\"b6ca22eedbcfda2a33b0e7942338f526\"}','2026-05-17 18:44:15.200','2026-05-17 20:46:08.146');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PaymentMethod`
--

DROP TABLE IF EXISTS `PaymentMethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PaymentMethod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `iconUrl` varchar(191) DEFAULT NULL,
  `feePercent` decimal(10,4) DEFAULT NULL,
  `feeFixed` decimal(10,2) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PaymentMethod_slug_key` (`slug`),
  KEY `PaymentMethod_isActive_sortOrder_idx` (`isActive`,`sortOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethod`
--

LOCK TABLES `PaymentMethod` WRITE;
/*!40000 ALTER TABLE `PaymentMethod` DISABLE KEYS */;
INSERT INTO `PaymentMethod` VALUES
(1,'Paypal','paypal','/uploads/payment-methods/paypal-icon-1770224527445.png',5.0000,NULL,1,1,'2026-02-04 17:02:07.448','2026-02-04 17:02:07.448'),
(2,'Cryptomus','cryptomus','/uploads/payment-methods/cryptomus-icon-1770224603559.png',3.0000,NULL,1,2,'2026-02-04 17:03:23.561','2026-02-04 17:03:23.561');
/*!40000 ALTER TABLE `PaymentMethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `sourceUrl` text DEFAULT NULL,
  `authorId` varchar(191) DEFAULT NULL,
  `isPublished` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_slug_key` (`slug`),
  KEY `Post_isPublished_createdAt_idx` (`isPublished`,`createdAt`),
  KEY `Post_slug_idx` (`slug`),
  KEY `Post_authorId_fkey` (`authorId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES
(24,'WoW®: Burning Crusade Classic Anniversary Edition Now Live!','wow-burning-crusade-classic-anniversary-edition-now-live','Prepare to tread once again through the Dark Portal and into the fel-scarred realm of Outland!','Prepare to tread once again through the Dark Portal and into the fel-scarred realm of Outland!','/uploads/blog/wow-burning-crusade-classic-anniversary-edition-now-live-776720.jpg','https://worldofwarcraft.blizzard.com/news/24242436','G1699',1,'2026-02-08 15:32:56.750','2026-02-08 15:32:56.750'),
(25,'Log In to Collect the Dark Portal Housing Decor Item','log-in-to-collect-the-dark-portal-housing-decor-item','For a limited time, we’re granting a Dark Portal Housing decor item for all players with an active World of Warcraft subscription or Game Time who log in between now and the Midnight launch.','For a limited time, we’re granting a Dark Portal Housing decor item for all players with an active World of Warcraft subscription or Game Time who log in between now and the Midnight launch.','/uploads/blog/log-in-to-collect-the-dark-portal-housing-decor-item-777055.webp','https://worldofwarcraft.blizzard.com/news/24247152/','G1699',1,'2026-02-08 15:32:57.067','2026-02-08 15:32:57.067'),
(26,'Catch Up on the State of Azeroth in our Recap','catch-up-on-the-state-of-azeroth-in-our-recap','If you missed the State of Azeroth, don’t worry. We’ve got you covered with everything you need to know. From the roadmaps of what’s ahead for modern World of Warcraft and Classic World of Warcraft, t','If you missed the State of Azeroth, don’t worry. We’ve got you covered with everything you need to know. From the roadmaps of what’s ahead for modern World of Warcraft and Classic World of Warcraft, to claiming your own Dark Portal Housing decor item to set up in your own home, it’s all here.','/uploads/blog/catch-up-on-the-state-of-azeroth-in-our-recap-778323.webp','https://worldofwarcraft.blizzard.com/news/24250385/','G1699',1,'2026-02-08 15:32:58.331','2026-02-08 15:32:58.331'),
(27,'Gold is Good During February’s Trading Post: Shop the Anniversary Outlet','gold-is-good-during-february-s-trading-post-shop-the-anniversary-outlet','Join the vendors at the Trading Post to commemorate another year! They’re offering more than just February fare. Visit special Outlet vendors in Dornogal to peruse many discounted and returning items!','Join the vendors at the Trading Post to commemorate another year! They’re offering more than just February fare. Visit special Outlet vendors in Dornogal to peruse many discounted and returning items! Join the celebration with a bang when you earn this month’s reward, the Lively Pack of Lunar Explosives transmog along with earning an additional 500 Trader’s Tender. You’ll look explosive.','/uploads/blog/gold-is-good-during-february-s-trading-post-shop-the-anniversary-outlet-778712.jpg','https://worldofwarcraft.blizzard.com/news/24246205/','G1699',1,'2026-02-08 15:32:58.730','2026-02-08 15:32:58.730'),
(28,'WoW Weekly: Burning Crusade Classic Anniversary, Midnight Story So Far, and More!','wow-weekly-burning-crusade-classic-anniversary-midnight-story-so-far-and-more','Venture once more through the legendary Dark Portal with the Burning Crusade Classic Anniversary, dive into Xal’atath’s dark deeds in The War Within with the Story So Far, and embrace the unwavering r','Venture once more through the legendary Dark Portal with the Burning Crusade Classic Anniversary, dive into Xal’atath’s dark deeds in The War Within with the Story So Far, and embrace the unwavering resolve of Anubisath’s Guardians by donning their regalia. Fresh challenges and new allegiances await you in Azeroth—be sure to check back weekly!','/uploads/blog/wow-weekly-burning-crusade-classic-anniversary-midnight-story-so-far-and-more-780391.jpg','https://worldofwarcraft.blizzard.com/news/24257263/wow-weekly-burning-crusade-classic-anniversary-midnight-story-so-far-and-more','G1699',1,'2026-02-08 15:33:00.399','2026-02-08 15:33:00.399'),
(29,'Hotfixes: February 3, 2026','hotfixes-february-3-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: The War Within, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era','Here you will find a list of hotfixes that address various issues related to World of Warcraft: The War Within, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-3-2026-781270.webp','https://worldofwarcraft.blizzard.com/news/24247515/hotfixes-february-3-2026','G1699',1,'2026-02-08 15:33:01.319','2026-02-08 15:33:01.319'),
(30,'The Second Midnight Pre-Expansion Update Goes Live February 10','the-second-midnight-pre-expansion-update-goes-live-february-10','With the release of the second pre expansion update, we’re rolling out additional class updates and a host of quality of life improvements—including user interface (UI) enhancements to Damage Meters, ','With the release of the second pre expansion update, we’re rolling out additional class updates and a host of quality of life improvements—including user interface (UI) enhancements to Damage Meters, Boss Alerts, and more—as we make our final preparations for the launch of Midnight.','/uploads/blog/the-second-midnight-pre-expansion-update-goes-live-february-10-782212.webp','https://worldofwarcraft.blizzard.com/news/24247153/the-second-midnight-pre-expansion-update-goes-live-february-10','G1699',1,'2026-02-08 15:33:02.216','2026-02-08 15:33:02.216'),
(31,'WoW Midnight™ Presents: Northrend Live at Illuminarium Toronto February 21','wow-midnight-presents-northrend-live-at-illuminarium-toronto-february-21','Canadian adventurers, it\'s time to gather and celebrate the launch of World of Warcraft®: Midnight™! Mark your calendars for an epic community event on Saturday, February 21. Attendance is free, and t','Canadian adventurers, it\'s time to gather and celebrate the launch of World of Warcraft®: Midnight™! Mark your calendars for an epic community event on Saturday, February 21. Attendance is free, and the event will stream live for those who cannot attend in person.','/uploads/blog/wow-midnight-presents-northrend-live-at-illuminarium-toronto-february-21-782871.webp','https://worldofwarcraft.blizzard.com/news/24257259/wow-midnight%E2%84%A2-presents-northrend-live-at-illuminarium-toronto-february-21','G1699',1,'2026-02-08 15:33:02.886','2026-02-08 15:33:02.886'),
(32,'Watch the “Midnight Story So Far” Trailer','watch-the-midnight-story-so-far-trailer','Catch up on Xal’atath’s dark deeds throughout The War Within, from the destruction of Dalaran to the return of the Void Lord Dimensius. Remember: Midnight is coming.','Catch up on Xal’atath’s dark deeds throughout The War Within, from the destruction of Dalaran to the return of the Void Lord Dimensius. Remember: Midnight is coming.','/uploads/blog/watch-the-midnight-story-so-far-trailer-783355.avif','https://worldofwarcraft.blizzard.com/news/24259136/watch-the-midnight-story-so-far-trailer','G1699',1,'2026-02-08 15:33:03.359','2026-02-08 15:33:03.359'),
(33,'Command the Sands with the Anubisath Guardian Pack','command-the-sands-with-the-anubisath-guardian-pack','Bound to ancient duty, Anubisath’s Guardians stand eternal. Embrace their unwavering resolve by donning their regalia.','Bound to ancient duty, Anubisath’s Guardians stand eternal. Embrace their unwavering resolve by donning their regalia.','/uploads/blog/command-the-sands-with-the-anubisath-guardian-pack-783849.avif','https://worldofwarcraft.blizzard.com/news/24257258/command-the-sands-with-the-anubisath-guardian-pack','G1699',1,'2026-02-08 15:33:03.884','2026-02-08 15:33:03.884'),
(34,'Introducing the WoW Ambassador Program: Find Your People','introducing-the-wow-ambassador-program-find-your-people','Designed to empower players to help shape the World of Warcraft community, the WoW Ambassador program opens new opportunities to connect with others, find support among your peers, and make new friend','Designed to empower players to help shape the World of Warcraft community, the WoW Ambassador program opens new opportunities to connect with others, find support among your peers, and make new friends.','/uploads/blog/introducing-the-wow-ambassador-program-find-your-people-784273.webp','https://worldofwarcraft.blizzard.com/news/24244402/introducing-the-wow-ambassador-program-find-your-people','G1699',1,'2026-02-08 15:33:04.280','2026-02-08 15:33:04.280'),
(35,'Watch the Coming Home Cinematic','watch-the-coming-home-cinematic','After a long day of adventure, there’s no place like...well, home.','After a long day of adventure, there’s no place like...well, home.','/uploads/blog/watch-the-coming-home-cinematic-785156.webp','https://worldofwarcraft.blizzard.com/news/24242865/watch-the-coming-home-cinematic','G1699',1,'2026-02-08 15:33:05.175','2026-02-08 15:33:05.175'),
(36,'Make Your Stand During Welcome Back Weekend','make-your-stand-during-welcome-back-weekend','World of Warcraft®: Midnight™ is nearly here and it’s time once again to gather your friends and prepare to embark on new adventures. From January 29 through February 1, we\'re giving all players with ','World of Warcraft®: Midnight™ is nearly here and it’s time once again to gather your friends and prepare to embark on new adventures. From January 29 through February 1, we\'re giving all players with inactive World of Warcraft® accounts full access to return to the game and all your characters without a subscription.','/uploads/blog/make-your-stand-during-welcome-back-weekend-785622.jpg','https://worldofwarcraft.blizzard.com/news/24256618/make-your-stand-during-welcome-back-weekend','G1699',1,'2026-02-08 15:33:05.630','2026-02-08 15:33:05.630'),
(37,'Tune in Now for the State of Azeroth','tune-in-now-for-the-state-of-azeroth','Join Executive Producer Holly Longdale and Senior Game Director Ion Hazzikostas once more on the official World of Warcraft YouTube and Twitch channels as they give you a glimpse into what the future ','Join Executive Producer Holly Longdale and Senior Game Director Ion Hazzikostas once more on the official World of Warcraft YouTube and Twitch channels as they give you a glimpse into what the future holds for Azeroth and more.','/uploads/blog/tune-in-now-for-the-state-of-azeroth-786271.avif','https://worldofwarcraft.blizzard.com/news/24247010/tune-in-now-for-the-state-of-azeroth','G1699',1,'2026-02-08 15:33:06.274','2026-02-08 15:33:06.274'),
(38,'Introducing Azeroth Interiors','introducing-azeroth-interiors','In Midnight, we’ve opened the doors to boundless creativity with the introduction of Housing. To shine a light on this new feature, we’re bringing in some of the biggest creator names and best builder','In Midnight, we’ve opened the doors to boundless creativity with the introduction of Housing. To shine a light on this new feature, we’re bringing in some of the biggest creator names and best builders alike to go head-to-head in a delightful interior design competition!','/uploads/blog/introducing-azeroth-interiors-787018.avif','https://worldofwarcraft.blizzard.com/news/24246295/introducing-azeroth-interiors','G1699',1,'2026-02-08 15:33:07.024','2026-02-08 15:33:07.024'),
(39,'The Winds of Mysterious Fortune are Gusting In','the-winds-of-mysterious-fortune-are-gusting-in','Get satchels chock full of valuable and unique items during the Winds of Mysterious Fortune event and take advantage of the Winds of Mysterious Fortune 20% experience buff—catch up on your alts, finis','Get satchels chock full of valuable and unique items during the Winds of Mysterious Fortune event and take advantage of the Winds of Mysterious Fortune 20% experience buff—catch up on your alts, finish missed content and unlocks, and get ready for the launch of World of Warcraft®: Midnight™.','/uploads/blog/the-winds-of-mysterious-fortune-are-gusting-in-787579.avif','https://worldofwarcraft.blizzard.com/news/24257257/the-winds-of-mysterious-fortune-are-gusting-in','G1699',1,'2026-02-08 15:33:07.584','2026-02-08 15:33:07.584'),
(40,'Experience the Twilight Ascension Pre-Expansion Event','experience-the-twilight-ascension-pre-expansion-event','Travel to the Twilight Highlands to push back the threat of the Twilight\'s Blade cult and stop them from summoning more forces by disrupting their rituals and defeating rare enemies across the highlan','Travel to the Twilight Highlands to push back the threat of the Twilight\'s Blade cult and stop them from summoning more forces by disrupting their rituals and defeating rare enemies across the highlands. Available to characters level 10 and above, you’ll also take on World Quests and reap the rewards of a job well done during this repeatable event.','/uploads/blog/experience-the-twilight-ascension-pre-expansion-event-788051.jpg','https://worldofwarcraft.blizzard.com/news/24247523/experience-the-twilight-ascension-pre-expansion-event','G1699',1,'2026-02-08 15:33:08.068','2026-02-08 15:33:08.068'),
(41,'WoW Weekly: The Midnight Pre-Expansion Content Update is Now Live, and More!','wow-weekly-the-midnight-pre-expansion-content-update-is-now-live-and-more','Fresh challenges and new allegiances await you in Azeroth!','Fresh challenges and new allegiances await you in Azeroth!','/uploads/blog/wow-weekly-the-midnight-pre-expansion-content-update-is-now-live-and-more-788476.webp','https://worldofwarcraft.blizzard.com/news/24257256/wow-weekly-the-midnight-pre-expansion-content-update-is-now-live-and-more','G1699',1,'2026-02-08 15:33:08.485','2026-02-08 15:33:08.485'),
(42,'Warcraft Short Story: \"The Void Between\"','warcraft-short-story-the-void-between','Through the span of their long lives, former Magister Umbric and Grand Magister Rommath forged an unlikely friendship, but a series of trials unlike any other divided them. Join Grand Magister Rommath','Through the span of their long lives, former Magister Umbric and Grand Magister Rommath forged an unlikely friendship, but a series of trials unlike any other divided them. Join Grand Magister Rommath for a special fireside telling of our newest short story and find out if these two old friends can forge a new alliance.','/uploads/blog/warcraft-short-story-the-void-between-788891.avif','https://worldofwarcraft.blizzard.com/news/24256619/warcraft-short-story-the-void-between','G1699',1,'2026-02-08 15:33:08.903','2026-02-08 15:33:08.903'),
(43,'The Midnight Pre-Expansion Content Update Now Live!','the-midnight-pre-expansion-content-update-now-live','Players can explore the new User Interface (UI) updates, experiment with new combat design changes across all classes, walk the path of the Demon Hunter Devourer, and more.','Players can explore the new User Interface (UI) updates, experiment with new combat design changes across all classes, walk the path of the Demon Hunter Devourer, and more.','/uploads/blog/the-midnight-pre-expansion-content-update-now-live-789523.jpg','https://worldofwarcraft.blizzard.com/news/24245217/the-midnight-pre-expansion-content-update-now-live','G1699',1,'2026-02-08 15:33:09.540','2026-02-08 15:33:09.540'),
(44,'What to Tackle in The War Within Before the Launch of Midnight','what-to-tackle-in-the-war-within-before-the-launch-of-midnight','As World of Warcraft: The War Within reaches its zenith, we\'re getting ready to turn the page to the next chapter: Midnight. Before your adventure moves forward, now\'s the perfect time to wrap up acti','As World of Warcraft: The War Within reaches its zenith, we\'re getting ready to turn the page to the next chapter: Midnight. Before your adventure moves forward, now\'s the perfect time to wrap up activities around Khaz Algar—especially those rewards and achievements that either go away or become much harder to earn once the expansion content update launches worldwide on March 2, 2026, at 3:00 pm PST.','/uploads/blog/what-to-tackle-in-the-war-within-before-the-launch-of-midnight-114251.jpg','https://worldofwarcraft.blizzard.com/news/24257262','G1699',1,'2026-02-10 17:55:14.276','2026-02-10 17:55:14.276'),
(45,'Watch the Xal’atath Animation: Supremacy','watch-the-xal-atath-animation-supremacy','Midnight is almost here. Xal’atath has united the warring factions of the Void, unleashing a ravenous army that threatens to consume all of Azeroth.','Midnight is almost here. Xal’atath has united the warring factions of the Void, unleashing a ravenous army that threatens to consume all of Azeroth.','/uploads/blog/watch-the-xal-atath-animation-supremacy-115944.webp','https://worldofwarcraft.blizzard.com/news/24261468/watch-the-xalatath-animation-supremacy','G1699',1,'2026-02-10 17:55:15.953','2026-02-10 17:55:15.953'),
(46,'Second Midnight Pre-Expansion Update Notes','second-midnight-pre-expansion-update-notes','The Second Midnight Pre-Expansion Update arrives to World of Warcraft on February 10!','The Second Midnight Pre-Expansion Update arrives to World of Warcraft on February 10!','/uploads/blog/second-midnight-pre-expansion-update-notes-118541.webp','https://worldofwarcraft.blizzard.com/news/24246298/second-midnight-pre-expansion-update-notes','G1699',1,'2026-02-10 17:55:18.561','2026-02-10 17:55:18.561'),
(47,'Flutter Into the Fight—Love Is in the Air Has Arrived!','flutter-into-the-fight-love-is-in-the-air-has-arrived','Sounds and fragrances of love swirl in the air with a hint of nefarious undertones as a strange love sickness clouds the hearts of the denizens of Azeroth. Uncover the dark secret fueling this plague ','Sounds and fragrances of love swirl in the air with a hint of nefarious undertones as a strange love sickness clouds the hearts of the denizens of Azeroth. Uncover the dark secret fueling this plague of passion.','/uploads/blog/flutter-into-the-fight-love-is-in-the-air-has-arrived-119047.jpg','https://worldofwarcraft.blizzard.com/news/24257260/flutter-into-the-fight-love-is-in-the-air-has-arrived','G1699',1,'2026-02-10 17:55:19.060','2026-02-10 17:55:19.060'),
(48,'The Second Midnight Pre-Expansion Update is Now Live','the-second-midnight-pre-expansion-update-is-now-live','With the release of the second pre expansion update, we’re rolling out additional class updates and a host of quality of life improvements—including user interface (UI) enhancements to Damage Meters, ','With the release of the second pre expansion update, we’re rolling out additional class updates and a host of quality of life improvements—including user interface (UI) enhancements to Damage Meters, Boss Alerts, and more—as we make our final preparations for the launch of Midnight.','/uploads/blog/the-second-midnight-pre-expansion-update-is-now-live-573352.webp','https://worldofwarcraft.blizzard.com/news/24247153/the-second-midnight-pre-expansion-update-is-now-live','G1699',1,'2026-02-11 12:56:13.401','2026-02-11 12:56:13.401'),
(49,'Pull Up a Chair in the Arcantina','pull-up-a-chair-in-the-arcantina','A refuge to the road-weary and those seeking a respite from the trials and travails of an adventurer’s life, the Arcantina serves as a crossway for all kinds. This magical tavern is poised at the cros','A refuge to the road-weary and those seeking a respite from the trials and travails of an adventurer’s life, the Arcantina serves as a crossway for all kinds. This magical tavern is poised at the crossroads of nowhere and everywhere catering to travelers and heroes from all walks of life. Here you’ll reunite with some familiar faces, share stories, and take on new quests that send you all over Azeroth and beyond.','/uploads/blog/pull-up-a-chair-in-the-arcantina-756557.avif','https://worldofwarcraft.blizzard.com/news/24243645/pull-up-a-chair-in-the-arcantina','G1699',1,'2026-02-11 22:42:36.620','2026-02-11 22:42:36.620'),
(50,'Hotfixes: February 12, 2026','hotfixes-february-12-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-12-2026-319522.avif','https://worldofwarcraft.blizzard.com/news/24244470/hotfixes-february-12-2026','G1699',1,'2026-02-13 06:48:39.822','2026-02-13 06:48:39.822'),
(51,'Cuddle Up with the Plushie Decor Pack','cuddle-up-with-the-plushie-decor-pack','Decorate your new home with a pack of eight adorable plushies: four Beloved Lions and four Beloved Wolves. Perfect for shelves, sofas, or cozy corners, they can bring a touch of charm to every room.','Decorate your new home with a pack of eight adorable plushies: four Beloved Lions and four Beloved Wolves. Perfect for shelves, sofas, or cozy corners, they can bring a touch of charm to every room.','/uploads/blog/cuddle-up-with-the-plushie-decor-pack-320507.webp','https://worldofwarcraft.blizzard.com/news/24244447/cuddle-up-with-the-plushie-decor-pack','G1699',1,'2026-02-13 06:48:40.527','2026-02-13 06:48:40.527'),
(52,'Dress for Every Situation with the Updated Transmog System','dress-for-every-situation-with-the-updated-transmog-system','In Midnight the transmogrification system has gotten an overhaul to its functionality. Save your favorite looks to Outfit Slots, style multiple outfits, and dress for the moment anywhere your adventur','In Midnight the transmogrification system has gotten an overhaul to its functionality. Save your favorite looks to Outfit Slots, style multiple outfits, and dress for the moment anywhere your adventures take you in Azeroth.','/uploads/blog/dress-for-every-situation-with-the-updated-transmog-system-321194.jpg','https://worldofwarcraft.blizzard.com/news/24247155/dress-for-every-situation-with-the-updated-transmog-system','G1699',1,'2026-02-13 06:48:41.213','2026-02-13 06:48:41.213'),
(53,'Welcome to Silvermoon City!','welcome-to-silvermoon-city','Take a tour of the gleaming capital city of the sin’dorei, restored to its former glory. From artists practicing their crafts to profession trainers and vendors; adventurers will find just what they n','Take a tour of the gleaming capital city of the sin’dorei, restored to its former glory. From artists practicing their crafts to profession trainers and vendors; adventurers will find just what they need. Whether you’re seeking a respite from the press of the Void or simply passing through, it’s all here.','/uploads/blog/welcome-to-silvermoon-city-660183.jpg','https://worldofwarcraft.blizzard.com/news/24243213/','G1699',1,'2026-02-14 19:17:41.219','2026-02-14 19:17:41.219'),
(54,'WoW Weekly: Second Midnight Pre-Expansion, Get Cozy in the Arcantina, Silvermoon City Tour, and More!','wow-weekly-second-midnight-pre-expansion-get-cozy-in-the-arcantina-silvermoon-city-tour-and-more','Dive into the second Midnight Pre-Expansion content update filled with class updates and a host of quality‑of‑life improvements, prepare to venture into Midnight by tackling last-minute tasks in The W','Dive into the second Midnight Pre-Expansion content update filled with class updates and a host of quality‑of‑life improvements, prepare to venture into Midnight by tackling last-minute tasks in The War Within, learn more about how you can take refuge from the trials and travails of an adventurer’s life in the Arcantina, deck your home out in plushies, and more! Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-second-midnight-pre-expansion-get-cozy-in-the-arcantina-silvermoon-city-tour-and-more-662457.jpg','https://worldofwarcraft.blizzard.com/news/24257265/wow-weekly-second-midnight-pre-expansion-get-cozy-in-the-arcantina-silvermoon-city-tour-and-more','G1699',1,'2026-02-14 19:17:43.129','2026-02-14 19:17:43.129'),
(55,'Warcraft Short Story: \"Legacy of the Amani\"','warcraft-short-story-legacy-of-the-amani','As the daughter of the Amani chieftain, Zul’jarra has spent her life in preparation to shoulder the heavy burden of leadership. When a rival tribe’s leader challenges her claim, Zul’jarra must underta','As the daughter of the Amani chieftain, Zul’jarra has spent her life in preparation to shoulder the heavy burden of leadership. When a rival tribe’s leader challenges her claim, Zul’jarra must undertake a desperate journey to prove herself and face the usurper head-on','/uploads/blog/warcraft-short-story-legacy-of-the-amani-663933.webp','https://worldofwarcraft.blizzard.com/news/24257264/warcraft-short-story-legacy-of-the-amani','G1699',1,'2026-02-14 19:17:43.937','2026-02-14 19:17:43.937'),
(56,'Explore the Zones of Midnight: Eversong Woods','explore-the-zones-of-midnight-eversong-woods','Immerse yourself in a revitalized Eversong Woods. With the Voidstorm looming overhead and renewed with the power of the Sunwell, Eversong Woods is familiar, but changed—filled with wonder and beauty, ','Immerse yourself in a revitalized Eversong Woods. With the Voidstorm looming overhead and renewed with the power of the Sunwell, Eversong Woods is familiar, but changed—filled with wonder and beauty, and a sense that something bigger is unfolding.','/uploads/blog/explore-the-zones-of-midnight-eversong-woods-745982.jpg','https://worldofwarcraft.blizzard.com/news/24263349','G1699',1,'2026-02-17 20:55:46.184','2026-02-17 20:55:46.184'),
(57,'Azeroth Interiors Kicks Off February 17!','azeroth-interiors-kicks-off-february-17','Gather round the hearth and prepare for a show—Azeroth Interiors is here bringing eight duos together for a three-phase Housing design challenge! They’ll develop housing concepts, execute their ideas ','Gather round the hearth and prepare for a show—Azeroth Interiors is here bringing eight duos together for a three-phase Housing design challenge! They’ll develop housing concepts, execute their ideas through building, and take us on a tour of their decorated domiciles on a live broadcast.','/uploads/blog/azeroth-interiors-kicks-off-february-17-746934.avif','https://worldofwarcraft.blizzard.com/news/24244643/azeroth-interiors-kicks-off-february-17','G1699',1,'2026-02-17 20:55:46.952','2026-02-17 20:55:46.952'),
(58,'Discover Dream Homes with Zillow for Warcraft','discover-dream-homes-with-zillow-for-warcraft','Whether you’re looking for a tropical retreat where you can sip Kaja’Cola under the sun, or an idyllic spot where the neighbors are quiet as the grave, Zillow for Warcraft has what you need. Top agent','Whether you’re looking for a tropical retreat where you can sip Kaja’Cola under the sun, or an idyllic spot where the neighbors are quiet as the grave, Zillow for Warcraft has what you need. Top agents on Zillow Bek’tar and Hazyl are on the job, ready to guide you toward listings you won’t want to miss.','/uploads/blog/discover-dream-homes-with-zillow-for-warcraft-747306.avif','https://worldofwarcraft.blizzard.com/news/24250389/discover-dream-homes-with-zillow-for-warcraft','G1699',1,'2026-02-17 20:55:47.310','2026-02-17 20:55:47.310'),
(59,'Explore the Zones of Midnight: Zul’Aman','explore-the-zones-of-midnight-zul-aman','The volatile neighbors to the blood elves, the Amani trolls, reside in their capital of Zul’Aman. They are a proud people who have fought hard for their land and overcome significant hardships and cha','The volatile neighbors to the blood elves, the Amani trolls, reside in their capital of Zul’Aman. They are a proud people who have fought hard for their land and overcome significant hardships and challenges. Comprised of old forests and tall mountains with periodic rainfall, you’ll take a journey deeper into their culture and history as you explore all this zone has to offer.','/uploads/blog/explore-the-zones-of-midnight-zul-aman-197469.avif','https://worldofwarcraft.blizzard.com/news/24263351','G1699',1,'2026-02-18 15:56:37.544','2026-02-18 15:56:37.544'),
(60,'Hotfixes: February 17, 2026','hotfixes-february-17-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-17-2026-198534.avif','https://worldofwarcraft.blizzard.com/news/24244470/hotfixes-february-17-2026','G1699',1,'2026-02-18 15:56:38.597','2026-02-18 15:56:38.597'),
(61,'Watch the Liadrin Animation: All That is Sacred','watch-the-liadrin-animation-all-that-is-sacred','In Azeroth’s darkest hour, Liadrin stands against the Void, knowing that with the Light by her side, darkness will never prevail.','In Azeroth’s darkest hour, Liadrin stands against the Void, knowing that with the Light by her side, darkness will never prevail.','/uploads/blog/watch-the-liadrin-animation-all-that-is-sacred-523384.webp','https://worldofwarcraft.blizzard.com/news/24263350','G1699',1,'2026-02-19 17:52:03.466','2026-02-19 17:52:03.466'),
(62,'Befriend and Unlock the Haranir, a New Allied Race in Midnight!','befriend-and-unlock-the-haranir-a-new-allied-race-in-midnight','Play through the Midnight campaign to earn the trust of a new allied race, the Haranir. You’ll learn about their history along the way and explore the wilds of their home in Harandar.','Play through the Midnight campaign to earn the trust of a new allied race, the Haranir. You’ll learn about their history along the way and explore the wilds of their home in Harandar.','/uploads/blog/befriend-and-unlock-the-haranir-a-new-allied-race-in-midnight-524037.avif','https://worldofwarcraft.blizzard.com/news/24264009/','G1699',1,'2026-02-19 17:52:04.055','2026-02-19 17:52:04.055'),
(63,'Explore the Zones of Midnight: Voidstorm','explore-the-zones-of-midnight-voidstorm','This hostile land is host to Void creatures of all varieties. Everything here is hungry and ready to devour and consume weaker creatures for their power.','This hostile land is host to Void creatures of all varieties. Everything here is hungry and ready to devour and consume weaker creatures for their power.','/uploads/blog/explore-the-zones-of-midnight-voidstorm-524590.png','https://worldofwarcraft.blizzard.com/news/24259138/','G1699',1,'2026-02-19 17:52:04.919','2026-02-19 17:52:04.919'),
(64,'Hunt or Be Hunted with the Prey System in Midnight','hunt-or-be-hunted-with-the-prey-system-in-midnight','Join the hunt when you visit Murder Row in Silvermoon City. Pursue powerful targets throughout the zones of Midnight and reap your rewards.','Join the hunt when you visit Murder Row in Silvermoon City. Pursue powerful targets throughout the zones of Midnight and reap your rewards.','/uploads/blog/hunt-or-be-hunted-with-the-prey-system-in-midnight-525461.jpg','https://worldofwarcraft.blizzard.com/news/24262569/','G1699',1,'2026-02-19 17:52:05.469','2026-02-19 17:52:05.469'),
(65,'Explore the Zones of Midnight: Harandar','explore-the-zones-of-midnight-harandar','The home of the haranir is a fungal jungle where the roots of all the world trees converge. The haranir travel through the rootways to move around the world, observing Azeroth in secret but never inte','The home of the haranir is a fungal jungle where the roots of all the world trees converge. The haranir travel through the rootways to move around the world, observing Azeroth in secret but never intervening openly in the world’s affairs. In the zone lies the Rift of Aln, a primordial wound where the barrier between dreams and reality grow thin.','/uploads/blog/explore-the-zones-of-midnight-harandar-526468.webp','https://worldofwarcraft.blizzard.com/news/24250355/explore-the-zones-of-midnight-harandar','G1699',1,'2026-02-19 17:52:06.473','2026-02-19 17:52:06.473'),
(66,'Unleash Your Skills in Midnight\'s New Delves','unleash-your-skills-in-midnight-s-new-delves','Take on new challenges through ten new Delves and one new seasonal Nemesis Delve alongside a new NPC companion—legendary blood elf rogue Valeera Sanguinar. You’ll experience more of the story of Midni','Take on new challenges through ten new Delves and one new seasonal Nemesis Delve alongside a new NPC companion—legendary blood elf rogue Valeera Sanguinar. You’ll experience more of the story of Midnight interwoven through new quests and even experience the great outdoors—taking the adventure outside for the first time.','/uploads/blog/unleash-your-skills-in-midnight-s-new-delves-615432.jpg','https://worldofwarcraft.blizzard.com/news/24244644/','G1699',1,'2026-02-20 10:16:55.615','2026-02-20 10:16:55.615'),
(67,'Hotfixes: February 19, 2026','hotfixes-february-19-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-19-2026-616058.avif','https://worldofwarcraft.blizzard.com/news/24244470/hotfixes-february-19-2026','G1699',1,'2026-02-20 10:16:56.200','2026-02-20 10:16:56.200'),
(68,'Share Your Azeroth Home with the New Pin-o-Matic Camera','share-your-azeroth-home-with-the-new-pin-o-matic-camera','The Housing feature in Midnight opens the door to express your creativity in Azeroth in new ways — and now there’s a way to capture, share, and discover inspiration on Pinterest with a new in-game fea','The Housing feature in Midnight opens the door to express your creativity in Azeroth in new ways — and now there’s a way to capture, share, and discover inspiration on Pinterest with a new in-game feature. Players can connect their World of Warcraft account to their personal board and share screenshots directly from the game.','/uploads/blog/share-your-azeroth-home-with-the-new-pin-o-matic-camera-616533.jpg','https://worldofwarcraft.blizzard.com/news/24250354/share-your-azeroth-home-with-the-new-pin-o-matic-camera','G1699',1,'2026-02-20 10:16:56.816','2026-02-20 10:16:56.816'),
(69,'Midnight Goes Live March 2 Worldwide: Early Access Goes Live February 26','midnight-goes-live-march-2-worldwide-early-access-goes-live-february-26','Face Xal’atath, the Harbinger and the Void in World of Warcraft®: Midnight™ with Early Access launching on February 26 at 3:00 pm PST. Midnight goes live worldwide March 2 at 3:00 pm PST. Players will','Face Xal’atath, the Harbinger and the Void in World of Warcraft®: Midnight™ with Early Access launching on February 26 at 3:00 pm PST. Midnight goes live worldwide March 2 at 3:00 pm PST. Players will level up to 90 and explore four new and reimagined zones to uncover the heart of Xal\'atath\'s machinations while seeking out new allies among the light and shadows alike.','/uploads/blog/midnight-goes-live-march-2-worldwide-early-access-goes-live-february-26-617640.jpg','https://worldofwarcraft.blizzard.com/news/24264417/midnight-goes-live-march-2-worldwide-early-access-goes-live-february-26','G1699',1,'2026-02-20 10:16:58.254','2026-02-20 10:16:58.254'),
(70,'Midnight Raid Overview and Schedule','midnight-raid-overview-and-schedule','Season one of Midnight begins the week of March 17, and with it, players will take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Ch','Season one of Midnight begins the week of March 17, and with it, players will take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Check out the full release schedule and preview of the bosses you’ll encounter.','/uploads/blog/midnight-raid-overview-and-schedule-618598.webp','https://worldofwarcraft.blizzard.com/news/24264416/midnight-raid-overview-and-schedule','G1699',1,'2026-02-20 10:16:58.642','2026-02-20 10:16:58.642'),
(71,'Support a Streamer and Twitch Drops Ahead!','support-a-streamer-and-twitch-drops-ahead','Earn the Fishmonger May pet by supporting your favorite World of Warcraft channels with the gift of 2 subscriptions on Twitch and collect the Cuddly Alliance Blue Grrgle and Cuddly Horde Red Grrgle pl','Earn the Fishmonger May pet by supporting your favorite World of Warcraft channels with the gift of 2 subscriptions on Twitch and collect the Cuddly Alliance Blue Grrgle and Cuddly Horde Red Grrgle plushies Housing decor items by watching your favorite World of Warcraft Twitch channels when World of Warcraft: Midnight goes live.','/uploads/blog/support-a-streamer-and-twitch-drops-ahead-017571.webp','https://worldofwarcraft.blizzard.com/news/24264010','G1699',1,'2026-02-21 14:10:17.613','2026-02-21 14:10:17.613'),
(72,'Hotfixes: February 20, 2026','hotfixes-february-20-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-20-2026-017989.avif','https://worldofwarcraft.blizzard.com/news/24244470/hotfixes-february-20-2026','G1699',1,'2026-02-21 14:10:18.392','2026-02-21 14:10:18.392'),
(73,'Watch the Arator Animation: Son of Two Worlds','watch-the-arator-animation-son-of-two-worlds','Elf. Human. Mother. Father. Darkness. Light. For Arator, division has defined his entire life; embracing these dualities has given it purpose.','Elf. Human. Mother. Father. Darkness. Light. For Arator, division has defined his entire life; embracing these dualities has given it purpose.','/uploads/blog/watch-the-arator-animation-son-of-two-worlds-219214.avif','https://worldofwarcraft.blizzard.com/news/24263352','G1699',1,'2026-02-24 10:50:19.293','2026-02-24 10:50:19.293'),
(74,'Power Up with New Apex Talents in Midnight','power-up-with-new-apex-talents-in-midnight','In Midnight, players can expand their specializations further with new Apex Talents, taking you deeper into the fantasy of your class. Available beginning at level 81, you’ll unlock the first of these','In Midnight, players can expand their specializations further with new Apex Talents, taking you deeper into the fantasy of your class. Available beginning at level 81, you’ll unlock the first of these and provide your character with an extra boost of power as you take on new challenges.','/uploads/blog/power-up-with-new-apex-talents-in-midnight-220416.jpg','https://worldofwarcraft.blizzard.com/news/24244472/','G1699',1,'2026-02-24 10:50:20.847','2026-02-24 10:50:20.847'),
(75,'Mount Up for the Outland Cup!','mount-up-for-the-outland-cup','Make your way through the Dark Portal to dip, dash, and dive through the skies of Outland in this daring Skyriding racing event available in the shattered remnants of Draenor.','Make your way through the Dark Portal to dip, dash, and dive through the skies of Outland in this daring Skyriding racing event available in the shattered remnants of Draenor.','/uploads/blog/mount-up-for-the-outland-cup-221737.webp','https://worldofwarcraft.blizzard.com/news/24263353/mount-up-for-the-outland-cup','G1699',1,'2026-02-24 10:50:21.809','2026-02-24 10:50:21.809'),
(76,'Class Tuning, Updates, and What to Expect in Midnight','class-tuning-updates-and-what-to-expect-in-midnight','With the official launch of Midnight upon us, we want to take the opportunity to give you a sneak peek at our tuning and class update roadmap as we head into the first season of Midnight.','With the official launch of Midnight upon us, we want to take the opportunity to give you a sneak peek at our tuning and class update roadmap as we head into the first season of Midnight.','/uploads/blog/class-tuning-updates-and-what-to-expect-in-midnight-222607.avif','https://worldofwarcraft.blizzard.com/news/24243864/class-tuning-updates-and-what-to-expect-in-midnight','G1699',1,'2026-02-24 10:50:22.746','2026-02-24 10:50:22.746'),
(77,'Join Arator for a New Journey in Midnight','join-arator-for-a-new-journey-in-midnight','One of the available paths through the Midnight campaign, players will undertake a new questline alongside Arator, son of Turalyon and Alleria Windrunner. At the request of Alonsus Faol, you’ll recrui','One of the available paths through the Midnight campaign, players will undertake a new questline alongside Arator, son of Turalyon and Alleria Windrunner. At the request of Alonsus Faol, you’ll recruit Arator for this continent-spanning adventure to seek out relics of the Light used by priests and paladins at the Sunwell when their reserves run dry.','/uploads/blog/join-arator-for-a-new-journey-in-midnight-224303.avif','https://worldofwarcraft.blizzard.com/news/24264011/join-arator-for-a-new-journey-in-midnight','G1699',1,'2026-02-24 10:50:24.351','2026-02-24 10:50:24.351'),
(78,'Welcome Home: A Returning Player\'s Guide','welcome-home-a-returning-player-s-guide','Adventure awaits you around every turn in World of Warcraft, whether you\'re a seasoned traveler or a newcomer eager to jump into the fray. To help you prepare to forge your own legend in the second ch','Adventure awaits you around every turn in World of Warcraft, whether you\'re a seasoned traveler or a newcomer eager to jump into the fray. To help you prepare to forge your own legend in the second chapter of the Worldsoul Saga, Midnight, there are some key things you should know to make your journey smooth.','/uploads/blog/welcome-home-a-returning-player-s-guide-839745.jpg','https://worldofwarcraft.blizzard.com/news/24263354','G1699',1,'2026-02-26 14:24:00.200','2026-02-26 14:24:00.200'),
(79,'A Look Ahead at Housing in Midnight','a-look-ahead-at-housing-in-midnight','From decor storage to exterior lighting, Endeavors, exporting houses and more, we’re looking into the future of Housing and what you can expect from the launch of Midnight and beyond.','From decor storage to exterior lighting, Endeavors, exporting houses and more, we’re looking into the future of Housing and what you can expect from the launch of Midnight and beyond.','/uploads/blog/a-look-ahead-at-housing-in-midnight-841580.jpg','https://worldofwarcraft.blizzard.com/news/24244406/','G1699',1,'2026-02-26 14:24:02.170','2026-02-26 14:24:02.170'),
(80,'Midnight: Embrace the Void with the Devourer Specialization','midnight-embrace-the-void-with-the-devourer-specialization','Introducing the Devourer Demon Hunter, a third specialization that utilizes the power of the Void. This glaive-wielding, soul-harvesting, and planet crushing spellcaster operates from mid-range with t','Introducing the Devourer Demon Hunter, a third specialization that utilizes the power of the Void. This glaive-wielding, soul-harvesting, and planet crushing spellcaster operates from mid-range with the full suite of mobility you\'d expect from Demon Hunters.','/uploads/blog/midnight-embrace-the-void-with-the-devourer-specialization-843058.jpg','https://worldofwarcraft.blizzard.com/news/24262570/midnight-embrace-the-void-with-the-devourer-specialization','G1699',1,'2026-02-26 14:24:04.522','2026-02-26 14:24:04.522'),
(81,'Hotfixes: February 25, 2026','hotfixes-february-25-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-25-2026-846342.avif','https://worldofwarcraft.blizzard.com/news/24244470/hotfixes-february-25-2026','G1699',1,'2026-02-26 14:24:06.511','2026-02-26 14:24:06.511'),
(82,'New Players Starter Guide: Welcome to World of Warcraft','new-players-starter-guide-welcome-to-world-of-warcraft','If you’re new to World of Warcraft and seeking to start your adventures with us in Azeroth, we can help get you started with our handy starter guide. Welcome! We’re glad you are joining us.','If you’re new to World of Warcraft and seeking to start your adventures with us in Azeroth, we can help get you started with our handy starter guide. Welcome! We’re glad you are joining us.','/uploads/blog/new-players-starter-guide-welcome-to-world-of-warcraft-847556.avif','https://worldofwarcraft.blizzard.com/news/24266319/new-players-starter-guide-welcome-to-world-of-warcraft','G1699',1,'2026-02-26 14:24:07.566','2026-02-26 14:24:07.566'),
(83,'Live, Laugh, and Love Your Way to the March Trading Post','live-laugh-and-love-your-way-to-the-march-trading-post','Whether you’re living your best life (or unlife) in Azeroth, still aglow from the Love is in the Air holiday, or having a good laugh with friends as you go on adventures together, the March Trading po','Whether you’re living your best life (or unlife) in Azeroth, still aglow from the Love is in the Air holiday, or having a good laugh with friends as you go on adventures together, the March Trading post is where it’s at. Take part in a variety of activities to earn the month’s reward— get the Comfy Bel\'ameth Flying Quilt mount hand-woven by Ainderu Summerleaf.','/uploads/blog/live-laugh-and-love-your-way-to-the-march-trading-post-848187.jpg','https://worldofwarcraft.blizzard.com/news/24261471/live-laugh-and-love-your-way-to-the-march-trading-post','G1699',1,'2026-02-26 14:24:08.197','2026-02-26 14:24:08.197'),
(84,'Come Home to Azeroth with Housing in Midnight','come-home-to-azeroth-with-housing-in-midnight','Build, decorate, and personalize your home in Azeroth with the new Housing feature. Players can earn their own house and plot of land, move into a neighborhood with other players, or establish a neigh','Build, decorate, and personalize your home in Azeroth with the new Housing feature. Players can earn their own house and plot of land, move into a neighborhood with other players, or establish a neighborhood with their guild. Boundless self-expression awaits you!','/uploads/blog/come-home-to-azeroth-with-housing-in-midnight-849078.avif','https://worldofwarcraft.blizzard.com/news/24244457/come-home-to-azeroth-with-housing-in-midnight','G1699',1,'2026-02-26 14:24:09.102','2026-02-26 14:24:09.102'),
(85,'Tune in to the Azeroth Interiors Showcase!','tune-in-to-the-azeroth-interiors-showcase','Catch the full stream live on the official World of Warcraft Twitch channel to see how each unique vision is brought to life!','Catch the full stream live on the official World of Warcraft Twitch channel to see how each unique vision is brought to life!','/uploads/blog/tune-in-to-the-azeroth-interiors-showcase-849665.avif','https://worldofwarcraft.blizzard.com/news/24244643/tune-in-to-the-azeroth-interiors-showcase','G1699',1,'2026-02-26 14:24:09.707','2026-02-26 14:24:09.707'),
(86,'Midnight Early Access Now Live!','midnight-early-access-now-live','Face Xal’atath, the Harbinger and the Void in World of Warcraft®: Midnight™ with Early Access. Midnight goes live worldwide March 2 at 3:00 pm PST. Players will level up to 90 and explore four new and','Face Xal’atath, the Harbinger and the Void in World of Warcraft®: Midnight™ with Early Access. Midnight goes live worldwide March 2 at 3:00 pm PST. Players will level up to 90 and explore four new and reimagined zones to uncover the heart of Xal\'atath\'s machinations while seeking out new allies among the light and shadows alike.','/uploads/blog/midnight-early-access-now-live-452263.webp','https://worldofwarcraft.blizzard.com/news/24264417','G1699',1,'2026-02-28 05:44:12.280','2026-02-28 05:44:12.280'),
(87,'Warcraft Short Story: \"The Quiet at the End of Us\"','warcraft-short-story-the-quiet-at-the-end-of-us','As Orweyna grew from seed to sapling in the wilds of Harandar, Amarakk was always at her side—the steady voice of reason who helped ground her wilder impulses. Discover a vibrant tale of friendship, l','As Orweyna grew from seed to sapling in the wilds of Harandar, Amarakk was always at her side—the steady voice of reason who helped ground her wilder impulses. Discover a vibrant tale of friendship, loss, and the lengths friends will travel to save each other.','/uploads/blog/warcraft-short-story-the-quiet-at-the-end-of-us-452607.webp','https://worldofwarcraft.blizzard.com/news/24263356/warcraft-short-story-the-quiet-at-the-end-of-us','G1699',1,'2026-02-28 05:44:12.613','2026-02-28 05:44:12.613'),
(88,'Watch the Arator Cinematic: Immolation','watch-the-arator-cinematic-immolation','When light turns to wrath, only ashes will remain. The story continues after the events of the “Intercession” cinematic. As Arator stands against the forces of the Void, Xal’atath’s insinuations invad','When light turns to wrath, only ashes will remain. The story continues after the events of the “Intercession” cinematic. As Arator stands against the forces of the Void, Xal’atath’s insinuations invade his mind, imparting a grim portent that the Light’s righteous fury, when left unchecked, may prove just as dangerous as the darkness it seeks to destroy.','/uploads/blog/watch-the-arator-cinematic-immolation-453147.jpg','https://worldofwarcraft.blizzard.com/news/24244647/watch-the-arator-cinematic-immolation','G1699',1,'2026-02-28 05:44:13.151','2026-02-28 05:44:13.151'),
(89,'Midnight Content Update Notes','midnight-content-update-notes','Midnight Early Access is now live. Review the latest updates to World of Warcraft.','Midnight Early Access is now live. Review the latest updates to World of Warcraft.','/uploads/blog/midnight-content-update-notes-453446.webp','https://worldofwarcraft.blizzard.com/news/24244646/midnight-content-update-notes','G1699',1,'2026-02-28 05:44:13.453','2026-02-28 05:44:13.453'),
(90,'Support a Streamer and Twitch Drops Now Live!','support-a-streamer-and-twitch-drops-now-live','Earn the Fishmonger May pet by supporting your favorite World of Warcraft channels with the gift of 2 subscriptions on Twitch and collect the Cuddly Alliance Blue Grrgle and Cuddly Horde Red Grrgle pl','Earn the Fishmonger May pet by supporting your favorite World of Warcraft channels with the gift of 2 subscriptions on Twitch and collect the Cuddly Alliance Blue Grrgle and Cuddly Horde Red Grrgle plushies Housing decor items by watching your favorite World of Warcraft Twitch channels when World of Warcraft: Midnight goes live.','/uploads/blog/support-a-streamer-and-twitch-drops-now-live-453816.webp','https://worldofwarcraft.blizzard.com/news/24264010/support-a-streamer-and-twitch-drops-now-live','G1699',1,'2026-02-28 05:44:13.821','2026-02-28 05:44:13.821'),
(91,'Join the Adventure: The WoW Portal Room Welcomes You!','join-the-adventure-the-wow-portal-room-welcomes-you','Are you a new player, returning after a break, or seeking to level up your play style? We invite you to join WoW Portal Room, a Discord server where you can meet just the right people.','Are you a new player, returning after a break, or seeking to level up your play style? We invite you to join WoW Portal Room, a Discord server where you can meet just the right people.','/uploads/blog/join-the-adventure-the-wow-portal-room-welcomes-you-454153.webp','https://worldofwarcraft.blizzard.com/news/24263355/join-the-adventure-the-wow-portal-room-welcomes-you','G1699',1,'2026-02-28 05:44:14.158','2026-02-28 05:44:14.158'),
(92,'Hotfixes: February 28, 2026','hotfixes-february-28-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-february-28-2026-098412.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-february-28-2026','G1699',1,'2026-03-01 09:24:58.457','2026-03-01 09:24:58.457'),
(93,'Hotfixes: March 1, 2026','hotfixes-march-1-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-1-2026-098972.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-1-2026','G1699',1,'2026-03-03 00:01:39.188','2026-03-03 00:01:39.188'),
(94,'World of Warcraft®: Midnight™ Now Live!','world-of-warcraft-midnight-now-live','In Midnight, players experience the next chapter in the Worldsoul Saga. Players will level up to 90 and explore four new and reimagined zones to uncover the heart of Xal\'atath\'s machinations while see','In Midnight, players experience the next chapter in the Worldsoul Saga. Players will level up to 90 and explore four new and reimagined zones to uncover the heart of Xal\'atath\'s machinations while seeking out new allies among the light and shadows alike.','/uploads/blog/world-of-warcraft-midnight-now-live-307573.avif','https://worldofwarcraft.blizzard.com/news/24264417/world-of-warcraft-midnight%E2%84%A2-now-live','G1699',1,'2026-03-04 08:51:48.450','2026-03-04 08:51:48.450'),
(95,'Hotfixes: March 2, 2026','hotfixes-march-2-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-2-2026-309206.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-2-2026','G1699',1,'2026-03-04 08:51:49.291','2026-03-04 08:51:49.291'),
(96,'Error 404 - WoW','error-404-wow','Join thousands of mighty heroes in Azeroth, a world of magic and limitless adventure.','Join thousands of mighty heroes in Azeroth, a world of magic and limitless adventure.','/uploads/blog/error-404-wow-318470.avif','https://worldofwarcraft.blizzard.com//news/24266321','G1699',1,'2026-03-06 05:35:18.595','2026-03-06 05:35:18.595'),
(97,'Hotfixes: March 5, 2026','hotfixes-march-5-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-5-2026-319010.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-5-2026','G1699',1,'2026-03-06 05:35:19.036','2026-03-06 05:35:19.036'),
(98,'Midnight Season 1 Begins March 17!','midnight-season-1-begins-march-17','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of Midnight.','/uploads/blog/midnight-season-1-begins-march-17-319371.webp','https://worldofwarcraft.blizzard.com/news/24266321/midnight-season-1-begins-march-17','G1699',1,'2026-03-06 05:35:19.514','2026-03-06 05:35:19.514'),
(99,'Take on New PvP Challenges in Midnight','take-on-new-pvp-challenges-in-midnight','In Midnight, players can take on new player versus player (PvP) challenges in the Slayer’s Rise battleground, outdoor World PvP objectives in the Voidstorm, and Training Grounds to help you get your P','In Midnight, players can take on new player versus player (PvP) challenges in the Slayer’s Rise battleground, outdoor World PvP objectives in the Voidstorm, and Training Grounds to help you get your PvP legs underneath you.','/uploads/blog/take-on-new-pvp-challenges-in-midnight-320605.jpg','https://worldofwarcraft.blizzard.com/news/24243215/take-on-new-pvp-challenges-in-midnight','G1699',1,'2026-03-06 05:35:23.009','2026-03-06 05:35:23.009'),
(100,'Turn Your Home into a Haven with New Decor Packs','turn-your-home-into-a-haven-with-new-decor-packs','Decorate your new home with two limited-time packs, each filled with everything you need to brighten it inside and out!','Decorate your new home with two limited-time packs, each filled with everything you need to brighten it inside and out!','/uploads/blog/turn-your-home-into-a-haven-with-new-decor-packs-323801.jpg','https://worldofwarcraft.blizzard.com/news/24263357/turn-your-home-into-a-haven-with-new-decor-packs','G1699',1,'2026-03-06 05:35:23.924','2026-03-06 05:35:23.924'),
(101,'Dive into Home Design with Starter Decor Packs','dive-into-home-design-with-starter-decor-packs','Bring big changes or start simple, with two decor packs available to help you get started designing the perfect abode. You’ll have everything you need to help you get started, complete with welcoming ','Bring big changes or start simple, with two decor packs available to help you get started designing the perfect abode. You’ll have everything you need to help you get started, complete with welcoming pieces.','/uploads/blog/dive-into-home-design-with-starter-decor-packs-324983.webp','https://worldofwarcraft.blizzard.com/news/24263358/dive-into-home-design-with-starter-decor-packs','G1699',1,'2026-03-06 05:35:25.872','2026-03-06 05:35:25.872'),
(102,'Cozy Up in Candle-Lit Kobold Rompers','cozy-up-in-candle-lit-kobold-rompers','Embrace your inner Kobold with flickering charm. Whether you prefer a soft, warm glow or a gleam like a bright candle, the ensembles in the Cozy Kobol Collection let you shine underground or above.','Embrace your inner Kobold with flickering charm. Whether you prefer a soft, warm glow or a gleam like a bright candle, the ensembles in the Cozy Kobol Collection let you shine underground or above.','/uploads/blog/cozy-up-in-candle-lit-kobold-rompers-326228.webp','https://worldofwarcraft.blizzard.com/news/24267936/cozy-up-in-candle-lit-kobold-rompers','G1699',1,'2026-03-06 05:35:26.775','2026-03-06 05:35:26.775'),
(103,'Soar in Sky-Bright Style with the Groveglider Collection','soar-in-sky-bright-style-with-the-groveglider-collection','Small paws and big adventures await when you saddle up and embrace sky‑bright charm with every effortless swoop as your Groveglider skitters through the skies. From soft azure hues to deep purple stre','Small paws and big adventures await when you saddle up and embrace sky‑bright charm with every effortless swoop as your Groveglider skitters through the skies. From soft azure hues to deep purple streaks, these mounts let you glide from treetop canopies to the clouds above.','/uploads/blog/soar-in-sky-bright-style-with-the-groveglider-collection-328087.jpg','https://worldofwarcraft.blizzard.com/news/24263359/soar-in-sky-bright-style-with-the-groveglider-collection','G1699',1,'2026-03-06 05:35:29.408','2026-03-06 05:35:29.408'),
(104,'Adventure is Calling You Home with the Midnight Original Soundtrack','adventure-is-calling-you-home-with-the-midnight-original-soundtrack','Embark on an auditory journey through the sounds of the Midnight expansion as you embrace the Light and slip through the shadows of the Void. You’ll rediscover familiar themes and encounter new ones o','Embark on an auditory journey through the sounds of the Midnight expansion as you embrace the Light and slip through the shadows of the Void. You’ll rediscover familiar themes and encounter new ones orchestrated to sweep you away into adventure.','/uploads/blog/adventure-is-calling-you-home-with-the-midnight-original-soundtrack-329766.avif','https://worldofwarcraft.blizzard.com/news/24250356/adventure-is-calling-you-home-with-the-midnight-original-soundtrack','G1699',1,'2026-03-06 05:35:29.845','2026-03-06 05:35:29.845'),
(105,'WoW Weekly: Midnight™ Now Live, Season 1 Begins March 17, New PvP Challenges, and More!','wow-weekly-midnight-now-live-season-1-begins-march-17-new-pvp-challenges-and-more','Adventure is calling you home to help save Azeroth against Xal\'atath\'s continuing threat, prepare for Season 1 looming on the horizon, fill your ears with the sounds of Midnight, and more! Each week m','Adventure is calling you home to help save Azeroth against Xal\'atath\'s continuing threat, prepare for Season 1 looming on the horizon, fill your ears with the sounds of Midnight, and more! Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-midnight-now-live-season-1-begins-march-17-new-pvp-challenges-and-more-597835.webp','https://worldofwarcraft.blizzard.com/news/24267937/wow-weekly-midnight%E2%84%A2-now-live-season-1-begins-march-17-new-pvp-challenges-and-more','G1699',1,'2026-03-08 10:59:57.889','2026-03-08 10:59:57.889'),
(106,'Hotfixes: March 6, 2026','hotfixes-march-6-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-6-2026-598296.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-6-2026','G1699',1,'2026-03-08 10:59:58.405','2026-03-08 10:59:58.405'),
(107,'[Updated March 6] Turn Your Home into a Haven with New Decor Packs','updated-march-6-turn-your-home-into-a-haven-with-new-decor-packs','Decorate your new home with two limited-time packs, each filled with everything you need to brighten it inside and out!','Decorate your new home with two limited-time packs, each filled with everything you need to brighten it inside and out!','/uploads/blog/updated-march-6-turn-your-home-into-a-haven-with-new-decor-packs-598724.jpg','https://worldofwarcraft.blizzard.com/news/24263357/updated-march-6-turn-your-home-into-a-haven-with-new-decor-packs','G1699',1,'2026-03-08 10:59:59.036','2026-03-08 10:59:59.036'),
(108,'Hotfixes: March 9, 2026','hotfixes-march-9-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-9-2026-220804.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-9-2026','G1699',1,'2026-03-10 12:03:41.111','2026-03-10 12:03:41.111'),
(109,'Gear Up With New PvE and PvP Class Sets in Midnight','gear-up-with-new-pve-and-pvp-class-sets-in-midnight','With the launch of the first raids in Midnight and the new PvP season, players can collect stylish new class sets. You’ll look good no matter where you go—and be better equipped for whatever Midnight ','With the launch of the first raids in Midnight and the new PvP season, players can collect stylish new class sets. You’ll look good no matter where you go—and be better equipped for whatever Midnight Season 1 puts in your path.','/uploads/blog/gear-up-with-new-pve-and-pvp-class-sets-in-midnight-893620.jpg','https://worldofwarcraft.blizzard.com/news/24244458','G1699',1,'2026-03-11 13:48:13.869','2026-03-11 13:48:13.869'),
(110,'Hotfixes: March 10, 2026','hotfixes-march-10-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-10-2026-906246.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-10-2026','G1699',1,'2026-03-11 13:48:26.414','2026-03-11 13:48:26.414'),
(111,'Hotfixes: March 11, 2026','hotfixes-march-11-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-11-2026-482052.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-11-2026','G1699',1,'2026-03-12 13:34:42.073','2026-03-12 13:34:42.073'),
(112,'Take a Look Ahead at the 12.0.5 Content Update','take-a-look-ahead-at-the-12-0-5-content-update','In the next Midnight content update, we’re bringing more activities, building on the story, and adding more loot as we continue the efforts to push back the Void. Players will undertake new Void Assau','In the next Midnight content update, we’re bringing more activities, building on the story, and adding more loot as we continue the efforts to push back the Void. Players will undertake new Void Assaults, disrupt powerful Ritual Sites, get a boost with Voidforge, group up for Decor Duels, and more.','/uploads/blog/take-a-look-ahead-at-the-12-0-5-content-update-293357.webp','https://worldofwarcraft.blizzard.com/news/24267938','G1699',1,'2026-03-13 07:34:53.544','2026-03-13 07:34:53.544'),
(113,'Hotfixes: March 12, 2026','hotfixes-march-12-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-12-2026-294055.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-12-2026','G1699',1,'2026-03-13 07:34:54.165','2026-03-13 07:34:54.165'),
(114,'Hotfixes: March 13, 2026','hotfixes-march-13-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-13-2026-453031.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-13-2026','G1699',1,'2026-03-15 12:07:33.057','2026-03-15 12:07:33.057'),
(115,'WoW Weekly: Class Sets in Midnight, a Peek at 12.0.5 Content Update, and More!','wow-weekly-class-sets-in-midnight-a-peek-at-12-0-5-content-update-and-more','Grab onto stylish but fierce PvP and PvE class sets that threaten to give you an extra edge, and take a peek at a wealth of new features and activities coming in the Midnight 12.0.5 content update. Ea','Grab onto stylish but fierce PvP and PvE class sets that threaten to give you an extra edge, and take a peek at a wealth of new features and activities coming in the Midnight 12.0.5 content update. Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-class-sets-in-midnight-a-peek-at-12-0-5-content-update-and-more-455817.webp','https://worldofwarcraft.blizzard.com/news/24267941/wow-weekly-class-sets-in-midnight-a-peek-at-1205-content-update-and-more','G1699',1,'2026-03-15 12:07:35.844','2026-03-15 12:07:35.844'),
(116,'Mists of Pandaria Classic: Escalation Arrives March 31','mists-of-pandaria-classic-escalation-arrives-march-31','Fight back against the aggressive reign of Garrosh Hellscream, once proud Warchief of the Horde. As tensions rise and the fate of Azeroth hangs in the balance, the latest content update—Escalation—unl','Fight back against the aggressive reign of Garrosh Hellscream, once proud Warchief of the Horde. As tensions rise and the fate of Azeroth hangs in the balance, the latest content update—Escalation—unleashes a wave of new features and challenges for heroes across Pandaria and beyond.','/uploads/blog/mists-of-pandaria-classic-escalation-arrives-march-31-718694.jpg','https://worldofwarcraft.blizzard.com/news/24267939','G1699',1,'2026-03-17 17:48:38.726','2026-03-17 17:48:38.726'),
(117,'Adopt Roofus and Support Habitat for Humanity!','adopt-roofus-and-support-habitat-for-humanity','Introducing Roofus, an industrious builder and lovable new companion pet ready to accompany you on all your adventures in both Mists of Pandaria Classic and modern World of Warcraft. By purchasing The','Introducing Roofus, an industrious builder and lovable new companion pet ready to accompany you on all your adventures in both Mists of Pandaria Classic and modern World of Warcraft. By purchasing The Roofus Pack, you’ll be supporting Habitat for Humanity, an organization that has helped provide housing and shelter for more than 65 million people across the globe.','/uploads/blog/adopt-roofus-and-support-habitat-for-humanity-720582.webp','https://worldofwarcraft.blizzard.com/news/24267940/adopt-roofus-and-support-habitat-for-humanity','G1699',1,'2026-03-17 17:48:41.838','2026-03-17 17:48:41.838'),
(118,'Midnight Season 1 Has Begun!','midnight-season-1-has-begun','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of Midnight.','/uploads/blog/midnight-season-1-has-begun-722349.webp','https://worldofwarcraft.blizzard.com/news/24266321/midnight-season-1-has-begun','G1699',1,'2026-03-17 17:48:42.393','2026-03-17 17:48:42.393'),
(119,'Play Midnight for a Classic Anniversary Edition Flying Mount','play-midnight-for-a-classic-anniversary-edition-flying-mount','From now through May 15, earn the menacing Voidfeather Dragonhawk flying mount to carry you through the fel-scarred realm of Outland in Burning Crusade Classic Anniversary Edition after completing the','From now through May 15, earn the menacing Voidfeather Dragonhawk flying mount to carry you through the fel-scarred realm of Outland in Burning Crusade Classic Anniversary Edition after completing the introduction scenario in World of Warcraft: Midnight.','/uploads/blog/play-midnight-for-a-classic-anniversary-edition-flying-mount-812382.avif','https://worldofwarcraft.blizzard.com/news/24267942','G1699',1,'2026-03-18 13:16:52.440','2026-03-18 13:16:52.440'),
(120,'Hotfixes: March 17, 2026','hotfixes-march-17-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-17-2026-812949.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-17-2026','G1699',1,'2026-03-18 13:16:53.045','2026-03-18 13:16:53.045'),
(121,'Voidspire and Dreamrift Raids in Normal, Heroic, and Raid Finder Now Live!','voidspire-and-dreamrift-raids-in-normal-heroic-and-raid-finder-now-live','Players take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Check out the full release schedule and preview of the bosses you’ll enc','Players take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Check out the full release schedule and preview of the bosses you’ll encounter.','/uploads/blog/voidspire-and-dreamrift-raids-in-normal-heroic-and-raid-finder-now-live-813729.webp','https://worldofwarcraft.blizzard.com/news/24264416/voidspire-and-dreamrift-raids-in-normal-heroic-and-raid-finder-now-live','G1699',1,'2026-03-18 13:16:53.918','2026-03-18 13:16:53.918'),
(122,'Hotfixes: March 18, 2026','hotfixes-march-18-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-18-2026-767428.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-18-2026','G1699',1,'2026-03-19 12:36:07.550','2026-03-19 12:36:07.550'),
(123,'Unveiling the AWC & MDI Road to BlizzCon in 2026!','unveiling-the-awc-mdi-road-to-blizzcon-in-2026','Return to the epic action as we unveil the Arena World Championship and Mythic Dungeon International programs for Midnight!','Return to the epic action as we unveil the Arena World Championship and Mythic Dungeon International programs for Midnight!','/uploads/blog/unveiling-the-awc-mdi-road-to-blizzcon-in-2026-768420.avif','https://worldofwarcraft.blizzard.com/news/24247519/unveiling-the-awc-mdi-road-to-blizzcon-in-2026','G1699',1,'2026-03-19 12:36:09.379','2026-03-19 12:36:09.379'),
(124,'Twitch Drop: Get the Cuddly Void Grrgle Housing Decor Item March 26!','twitch-drop-get-the-cuddly-void-grrgle-housing-decor-item-march-26','Watch any eligible World of Warcraft stream on Twitch.tv from March 26 at 3:00 pm PDT until April 23 at 3:00 pm PDT to claim the Cuddly Void Grrgle Housing decor item.','Watch any eligible World of Warcraft stream on Twitch.tv from March 26 at 3:00 pm PDT until April 23 at 3:00 pm PDT to claim the Cuddly Void Grrgle Housing decor item.','/uploads/blog/twitch-drop-get-the-cuddly-void-grrgle-housing-decor-item-march-26-659996.jpg','https://worldofwarcraft.blizzard.com/news/24271368','G1699',1,'2026-03-19 19:47:40.147','2026-03-19 19:47:40.147'),
(125,'Bound Into Cuddly Adventures with the Spring Bloom Pet Pack','bound-into-cuddly-adventures-with-the-spring-bloom-pet-pack','Get a bountiful bundle at a dynamic discount with a Spring Bloom Pet Pack featuring 23 whimsical companions ready to brighten your World of Warcraft adventures. Whether you’re charting new territories','Get a bountiful bundle at a dynamic discount with a Spring Bloom Pet Pack featuring 23 whimsical companions ready to brighten your World of Warcraft adventures. Whether you’re charting new territories or returning to beloved realms, these cheerful pets will happily tag along, bringing spirit and charm into every step of your journey. Don\'t delay, this bundle of cuddly companions is only available for a limited time.','/uploads/blog/bound-into-cuddly-adventures-with-the-spring-bloom-pet-pack-660770.jpg','https://worldofwarcraft.blizzard.com/news/24267944/bound-into-cuddly-adventures-with-the-spring-bloom-pet-pack','G1699',1,'2026-03-19 19:47:40.897','2026-03-19 19:47:40.897'),
(126,'Hotfixes: March 19, 2026','hotfixes-march-19-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-19-2026-376795.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-19-2026','G1699',1,'2026-03-20 11:16:16.827','2026-03-20 11:16:16.827'),
(127,'WoW Weekly: Midnight Season 1, Classic Anniversary Edition, Esports, and More!','wow-weekly-midnight-season-1-classic-anniversary-edition-esports-and-more','Midnight Season 1 is upon us—dive into the Voidspire and Dreamrift raids, tackle new world bosses, Mythic dungeons, delves, and PvP, and chase fresh rewards all season long. Don\'t miss limited-time ex','Midnight Season 1 is upon us—dive into the Voidspire and Dreamrift raids, tackle new world bosses, Mythic dungeons, delves, and PvP, and chase fresh rewards all season long. Don\'t miss limited-time extras like the Roofus charity pet, a new Twitch Drop housing item, and the AWC & MDI road back to BlizzCon. Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-midnight-season-1-classic-anniversary-edition-esports-and-more-923893.webp','https://worldofwarcraft.blizzard.com/news/24267946/wow-weekly-midnight-season-1-classic-anniversary-edition-esports-and-more','G1699',1,'2026-03-23 14:25:24.152','2026-03-23 14:25:24.152'),
(128,'Take Your Turn on the Trial of Style Catwalk','take-your-turn-on-the-trial-of-style-catwalk','Fierce fashionistas and dashing defenders of Azeroth, synchronize your wardrobes and prepare for a battle of fashion. The Trial of Style has arrived, and it’s time to put your transmogrification skill','Fierce fashionistas and dashing defenders of Azeroth, synchronize your wardrobes and prepare for a battle of fashion. The Trial of Style has arrived, and it’s time to put your transmogrification skills to the test.','/uploads/blog/take-your-turn-on-the-trial-of-style-catwalk-924545.jpg','https://worldofwarcraft.blizzard.com/news/24267943/take-your-turn-on-the-trial-of-style-catwalk','G1699',1,'2026-03-23 14:25:24.551','2026-03-23 14:25:24.551'),
(129,'Midnight Season 1 Mythic+ Now Available!','midnight-season-1-mythic-now-available','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of','Enter The Voidspire in Voidstorm, The Dreamrift in Harandar, and March on Quel’Danas in Eversong Woods, undertake Mythic dungeons, face new World bosses, engage in PvP, and more in the first season of Midnight.','/uploads/blog/midnight-season-1-mythic-now-available-735552.webp','https://worldofwarcraft.blizzard.com/news/24266321','G1699',1,'2026-03-24 18:25:35.667','2026-03-24 18:25:35.667'),
(130,'WoW Midnight: The Race to World First Is Upon Us','wow-midnight-the-race-to-world-first-is-upon-us','Azeroth’s bravest champions and fiercest guilds gather for the ultimate test of fortitude and skill, culminating in a baleful face-off against the Crown of the Cosmos, where coordination is law, strat','Azeroth’s bravest champions and fiercest guilds gather for the ultimate test of fortitude and skill, culminating in a baleful face-off against the Crown of the Cosmos, where coordination is law, strategy is survival, and every pull is a wager against the dark and ominous forces that promise certain annihilation.','/uploads/blog/wow-midnight-the-race-to-world-first-is-upon-us-736327.jpg','https://worldofwarcraft.blizzard.com/news/24267945','G1699',1,'2026-03-24 18:25:36.523','2026-03-24 18:25:36.523'),
(131,'Voidspire Mythic and Raid Finder Wing 2 and Dreamrift Mythic difficulties Now LIve!','voidspire-mythic-and-raid-finder-wing-2-and-dreamrift-mythic-difficulties-now-live','Players take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Check out the full release schedule and preview of the bosses you’ll enc','Players take their first steps into the Voidspire and Dreamrift raids with the March on Quel’Danas raid released shortly after. Check out the full release schedule and preview of the bosses you’ll encounter.','/uploads/blog/voidspire-mythic-and-raid-finder-wing-2-and-dreamrift-mythic-difficulties-now-live-737639.webp','https://worldofwarcraft.blizzard.com/news/24264416/voidspire-mythic-and-raid-finder-wing-2-and-dreamrift-mythic-difficulties-now-live','G1699',1,'2026-03-24 18:25:37.757','2026-03-24 18:25:37.757'),
(132,'Watch and Listen to “A Place to Call Home” Featuring AURORA','watch-and-listen-to-a-place-to-call-home-featuring-aurora','We’ve partnered with acclaimed Fontana recording artist AURORA to create a musical tribute to our fondest memories of World of Warcraft, from the first starting zone all the way to Midnight. We hope y','We’ve partnered with acclaimed Fontana recording artist AURORA to create a musical tribute to our fondest memories of World of Warcraft, from the first starting zone all the way to Midnight. We hope you see the Azeroth you call home here, with us.','/uploads/blog/watch-and-listen-to-a-place-to-call-home-featuring-aurora-738748.jpg','https://worldofwarcraft.blizzard.com/news/24244459/watch-and-listen-to-a-place-to-call-home-featuring-aurora','G1699',1,'2026-03-24 18:25:38.822','2026-03-24 18:25:38.822'),
(133,'Hotfixes: March 26, 2026','hotfixes-march-26-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-26-2026-676896.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-26-2026','G1699',1,'2026-03-27 13:37:57.101','2026-03-27 13:37:57.101'),
(134,'Twitch Drop Now Live! Get the Cuddly Void Grrgle Housing Decor Item','twitch-drop-now-live-get-the-cuddly-void-grrgle-housing-decor-item','Watch any eligible World of Warcraft stream on Twitch.tv from March 26 at 3:00 pm PDT until April 23 at 3:00 pm PDT to claim the Cuddly Void Grrgle Housing decor item.','Watch any eligible World of Warcraft stream on Twitch.tv from March 26 at 3:00 pm PDT until April 23 at 3:00 pm PDT to claim the Cuddly Void Grrgle Housing decor item.','/uploads/blog/twitch-drop-now-live-get-the-cuddly-void-grrgle-housing-decor-item-677790.jpg','https://worldofwarcraft.blizzard.com/news/24271368/twitch-drop-now-live-get-the-cuddly-void-grrgle-housing-decor-item','G1699',1,'2026-03-27 13:37:57.838','2026-03-27 13:37:57.838'),
(135,'WoW Weekly: Midnight Season 1, \"A Place to Call Home\", Twitch Drop, and More!','wow-weekly-midnight-season-1-a-place-to-call-home-twitch-drop-and-more','Midnight Season 1 is live—jump into The Voidspire and The Dreamrift now. Kick your feet up and turn up the volume on “A Place to Call Home” with AURORA, grab the Cuddly Void Grrgle Housing decor item ','Midnight Season 1 is live—jump into The Voidspire and The Dreamrift now. Kick your feet up and turn up the volume on “A Place to Call Home” with AURORA, grab the Cuddly Void Grrgle Housing decor item via Twitch Drops, and don’t miss what’s next.','/uploads/blog/wow-weekly-midnight-season-1-a-place-to-call-home-twitch-drop-and-more-303409.webp','https://worldofwarcraft.blizzard.com/news/24272600/wow-weekly-midnight-season-1-a-place-to-call-home-twitch-drop-and-more','G1699',1,'2026-03-29 12:28:23.511','2026-03-29 12:28:23.511'),
(136,'Voidspire Raid Finder Wing 3 and March on Quel\'Danas Normal, Heroic, and Mythic Difficulties Now Live!','voidspire-raid-finder-wing-3-and-march-on-quel-danas-normal-heroic-and-mythic-difficulties-now-live','Take your first steps into the Voidspire, Dreamrift, and March on Quel’Danas raids . Check out the full release schedule and preview of the bosses you’ll encounter.','Take your first steps into the Voidspire, Dreamrift, and March on Quel’Danas raids . Check out the full release schedule and preview of the bosses you’ll encounter.','/uploads/blog/voidspire-raid-finder-wing-3-and-march-on-quel-danas-normal-heroic-and-mythic-difficulties-now-live-004745.webp','https://worldofwarcraft.blizzard.com/news/24264416/','G1699',1,'2026-04-01 11:30:04.990','2026-04-01 11:30:04.990'),
(137,'April’s Trading Post Positively Sprouts with Garden Delights','april-s-trading-post-positively-sprouts-with-garden-delights','April’s Trading post arrives in full bloom, heralding in the rejuvenation of sun-dappled days and tending the garden. Take part in a variety of activities to earn this month’s reward— get the Ensemble','April’s Trading post arrives in full bloom, heralding in the rejuvenation of sun-dappled days and tending the garden. Take part in a variety of activities to earn this month’s reward— get the Ensemble: Forest Dweller\'s Butterfly Attire transmog set.','/uploads/blog/april-s-trading-post-positively-sprouts-with-garden-delights-005474.avif','https://worldofwarcraft.blizzard.com/news/24266706/','G1699',1,'2026-04-01 11:30:05.528','2026-04-01 11:30:05.528'),
(138,'Hotfixes: March 31, 2026','hotfixes-march-31-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-march-31-2026-007295.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-march-31-2026','G1699',1,'2026-04-01 11:30:07.365','2026-04-01 11:30:07.365'),
(139,'Mists of Pandaria Classic: Escalation Now Live!','mists-of-pandaria-classic-escalation-now-live','Fight back against the aggressive reign of Garrosh Hellscream, once proud Warchief of the Horde. As tensions rise and the fate of Azeroth hangs in the balance, the latest content update—Escalation—unl','Fight back against the aggressive reign of Garrosh Hellscream, once proud Warchief of the Horde. As tensions rise and the fate of Azeroth hangs in the balance, the latest content update—Escalation—unleashes a wave of new features and challenges for heroes across Pandaria and beyond.','/uploads/blog/mists-of-pandaria-classic-escalation-now-live-007912.jpg','https://worldofwarcraft.blizzard.com/news/24267939/mists-of-pandaria-classic-escalation-now-live','G1699',1,'2026-04-01 11:30:07.959','2026-04-01 11:30:07.959'),
(140,'Hotfixes: April 2, 2026','hotfixes-april-2-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-april-2-2026-782255.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-april-2-2026','G1699',1,'2026-04-03 15:23:02.789','2026-04-03 15:23:02.789'),
(141,'The 12.0.5 Content Update Goes Live April 21','the-12-0-5-content-update-goes-live-april-21','Engage in new activities, experience more of the story in Midnight, and earn more loot as the efforts to push back the forces of the Void and their agents continue. You’ll undertake new Void Assaults,','Engage in new activities, experience more of the story in Midnight, and earn more loot as the efforts to push back the forces of the Void and their agents continue. You’ll undertake new Void Assaults, disrupt powerful Ritual Sites, get a boost with Voidforge, group up for Decor Duels, and more.','/uploads/blog/the-12-0-5-content-update-goes-live-april-21-480202.jpg','https://worldofwarcraft.blizzard.com/news/24266871','G1699',1,'2026-04-15 15:21:20.275','2026-04-15 15:21:20.275'),
(142,'Explore the Lands, Legends, and Legacy of The Burning Crusade to Midnight','explore-the-lands-legends-and-legacy-of-the-burning-crusade-to-midnight','Join us as we take a closer look at the evolution of the places, faces, and stories that bridge The Burning Crusade and Midnight. We’ll step back through time to trace the threads of these tales—then ','Join us as we take a closer look at the evolution of the places, faces, and stories that bridge The Burning Crusade and Midnight. We’ll step back through time to trace the threads of these tales—then draw them forward from the Void’s shadow to the radiant heart of the Sunwell.','/uploads/blog/explore-the-lands-legends-and-legacy-of-the-burning-crusade-to-midnight-480683.webp','https://worldofwarcraft.blizzard.com/news/24264003/','G1699',1,'2026-04-15 15:21:20.784','2026-04-15 15:21:20.784'),
(143,'Hotfixes: April 14, 2026','hotfixes-april-14-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-april-14-2026-482026.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-april-14-2026','G1699',1,'2026-04-15 15:21:22.084','2026-04-15 15:21:22.084'),
(144,'Mobilize Your Allies and Thwart Incoming Void Assaults','mobilize-your-allies-and-thwart-incoming-void-assaults','In the 12.0.5 content update, players can push back against the Void as they begin powerful Void Strikes and Void Incursions in Eversong Woods and Zul’Aman— for Azeroth, for fun, and for new rewards.','In the 12.0.5 content update, players can push back against the Void as they begin powerful Void Strikes and Void Incursions in Eversong Woods and Zul’Aman— for Azeroth, for fun, and for new rewards.','/uploads/blog/mobilize-your-allies-and-thwart-incoming-void-assaults-482560.webp','https://worldofwarcraft.blizzard.com/news/24266324/mobilize-your-allies-and-thwart-incoming-void-assaults','G1699',1,'2026-04-15 15:21:22.700','2026-04-15 15:21:22.700'),
(145,'Face New Challenges and Disrupt Ritual Sites in 12.0.5','face-new-challenges-and-disrupt-ritual-sites-in-12-0-5','Whether you’re going it solo, or gathering allies to join you, a new challenge awaits at the Ritual Sites in Eversong Woods and Zul’Aman. You’ll put a stop to rituals of power-hungry naga and Twilight','Whether you’re going it solo, or gathering allies to join you, a new challenge awaits at the Ritual Sites in Eversong Woods and Zul’Aman. You’ll put a stop to rituals of power-hungry naga and Twilight’s Blade cultists in small one-to-five-player instances and face new challenges for new rewards.','/uploads/blog/face-new-challenges-and-disrupt-ritual-sites-in-12-0-5-483565.webp','https://worldofwarcraft.blizzard.com/news/24244461/face-new-challenges-and-disrupt-ritual-sites-in-1205','G1699',1,'2026-04-15 15:21:23.575','2026-04-15 15:21:23.575'),
(146,'Check out the World of Warcraft: Midnight Art Blast','check-out-the-world-of-warcraft-midnight-art-blast','Join us in celebrating the artists whose efforts have helped to build the visually stunning World of Warcraft®: Midnight™ in the Blizzard Entertainment World of Warcraft: Midnight Art Blast.','Join us in celebrating the artists whose efforts have helped to build the visually stunning World of Warcraft®: Midnight™ in the Blizzard Entertainment World of Warcraft: Midnight Art Blast.','/uploads/blog/check-out-the-world-of-warcraft-midnight-art-blast-484055.jpg','https://worldofwarcraft.blizzard.com/news/24272607/check-out-the-world-of-warcraft-midnight-art-blast','G1699',1,'2026-04-15 15:21:24.084','2026-04-15 15:21:24.084'),
(147,'WoW Weekly: 12.0.5 Content Update, Midnight Raids and Story Mode, and More!','wow-weekly-12-0-5-content-update-midnight-raids-and-story-mode-and-more','Get ready to flex your muscle in Midnight as the efforts to push back against the Void continue on April 21 with the 12.0.5 content update, Season 1 continues with unlocks for Raid Finder and Story Mo','Get ready to flex your muscle in Midnight as the efforts to push back against the Void continue on April 21 with the 12.0.5 content update, Season 1 continues with unlocks for Raid Finder and Story Mode, join us as we journey through Burning Crusade to Midnight, and much more!','/uploads/blog/wow-weekly-12-0-5-content-update-midnight-raids-and-story-mode-and-more-484446.jpg','https://worldofwarcraft.blizzard.com/news/24272606/wow-weekly-1205-content-update-midnight-raids-and-story-mode-and-more','G1699',1,'2026-04-15 15:21:24.629','2026-04-15 15:21:24.629'),
(148,'March on Quel\'Danas Raid Finder and Story Mode Now Live!','march-on-quel-danas-raid-finder-and-story-mode-now-live','Take your first steps into the Voidspire, Dreamrift, and March on Quel’Danas raids . Check out the full release schedule and preview of the bosses you’ll encounter.','Take your first steps into the Voidspire, Dreamrift, and March on Quel’Danas raids . Check out the full release schedule and preview of the bosses you’ll encounter.','/uploads/blog/march-on-quel-danas-raid-finder-and-story-mode-now-live-485249.webp','https://worldofwarcraft.blizzard.com/news/24264416/march-on-queldanas-raid-finder-and-story-mode-now-live','G1699',1,'2026-04-15 15:21:26.369','2026-04-15 15:21:26.369'),
(149,'The Arena World Championship is now underway!','the-arena-world-championship-is-now-underway','The Arena World Championship makes its resurgence for the first season of Midnight, starting on April 8!','The Arena World Championship makes its resurgence for the first season of Midnight, starting on April 8!','/uploads/blog/the-arena-world-championship-is-now-underway-487443.webp','https://worldofwarcraft.blizzard.com/news/24266796/the-arena-world-championship-is-now-underway','G1699',1,'2026-04-15 15:21:27.456','2026-04-15 15:21:27.456'),
(150,'Spring into Action for Noblegarden April 6–13!','spring-into-action-for-noblegarden-april-6-13','Noblegarden springs to life, so sport your bunny ears and hop to it by hunting for eggs, eating delectable chocolate, and collecting toys, pets, etc.','Noblegarden springs to life, so sport your bunny ears and hop to it by hunting for eggs, eating delectable chocolate, and collecting toys, pets, etc.','/uploads/blog/spring-into-action-for-noblegarden-april-6-13-487925.webp','https://worldofwarcraft.blizzard.com/news/24272601/spring-into-action-for-noblegarden-april-6-13','G1699',1,'2026-04-15 15:21:27.978','2026-04-15 15:21:27.978'),
(151,'WoW Weekly: Midnight, Mists of Pandaria Classic, April Trading Post, and More!','wow-weekly-midnight-mists-of-pandaria-classic-april-trading-post-and-more','Midnight Season 1 raid unlocks continue—dive into the Voidspire March on Quel\'Danas for fresh rewards, fight back against the aggressive reign of Garrosh Hellscream in Mists of Pandaria Classic: Escal','Midnight Season 1 raid unlocks continue—dive into the Voidspire March on Quel\'Danas for fresh rewards, fight back against the aggressive reign of Garrosh Hellscream in Mists of Pandaria Classic: Escalation, April’s Trading Post positively sprouts with garden-themed delights, and more!','/uploads/blog/wow-weekly-midnight-mists-of-pandaria-classic-april-trading-post-and-more-488293.webp','https://worldofwarcraft.blizzard.com/news/24272602/wow-weekly-midnight-mists-of-pandaria-classic-april-trading-post-and-more','G1699',1,'2026-04-15 15:21:28.312','2026-04-15 15:21:28.312'),
(152,'Announcing the World of Warcraft Student Art Contest 2025 Winners!','announcing-the-world-of-warcraft-student-art-contest-2025-winners','The 2025 Student Art Contest has come to an end, and after intense scrutiny and some impassioned deliberation, we’ve identified this year’s winners.','The 2025 Student Art Contest has come to an end, and after intense scrutiny and some impassioned deliberation, we’ve identified this year’s winners.','/uploads/blog/announcing-the-world-of-warcraft-student-art-contest-2025-winners-488794.jpg','https://worldofwarcraft.blizzard.com/news/24272605/announcing-the-world-of-warcraft-student-art-contest-2025-winners','G1699',1,'2026-04-15 15:21:28.862','2026-04-15 15:21:28.862'),
(153,'Hotfixes: April 17, 2026','hotfixes-april-17-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-april-17-2026-642917.jpg','https://worldofwarcraft.blizzard.com/news/24266320/hotfixes-april-17-2026','G1699',1,'2026-04-18 07:34:02.950','2026-04-18 07:34:02.950'),
(154,'WoW Weekly: Midnight 12.0.5, Classic Anniversary Edition, Joyous Journeys, and More!','wow-weekly-midnight-12-0-5-classic-anniversary-edition-joyous-journeys-and-more','Get ready to flex your muscle in Midnight as the efforts to push back against the Void continue on April 21 with the 12.0.5 content update, the Overlords of Outland content update is on the horizon fo','Get ready to flex your muscle in Midnight as the efforts to push back against the Void continue on April 21 with the 12.0.5 content update, the Overlords of Outland content update is on the horizon for Burning Crusade Classic Anniversary Edition, Joyous Journeys comes to Mists of Pandaria Classic, and more.','/uploads/blog/wow-weekly-midnight-12-0-5-classic-anniversary-edition-joyous-journeys-and-more-643400.webp','https://worldofwarcraft.blizzard.com/news/24272610/wow-weekly-midnight-1205-classic-anniversary-edition-joyous-journeys-and-more','G1699',1,'2026-04-18 07:34:03.437','2026-04-18 07:34:03.437'),
(155,'Twitch Drop: Get the Cuddly Pearl Grrgle Housing Decor Item April 23!','twitch-drop-get-the-cuddly-pearl-grrgle-housing-decor-item-april-23','Watch any eligible World of Warcraft stream on Twitch.tv from April 23 at 3:00 pm PDT until May 21 at 3:00 pm PDT to claim the Cuddly Pearl Grrgle Housing decor item.','Watch any eligible World of Warcraft stream on Twitch.tv from April 23 at 3:00 pm PDT until May 21 at 3:00 pm PDT to claim the Cuddly Pearl Grrgle Housing decor item.','/uploads/blog/twitch-drop-get-the-cuddly-pearl-grrgle-housing-decor-item-april-23-643970.avif','https://worldofwarcraft.blizzard.com/news/24266872/twitch-drop-get-the-cuddly-pearl-grrgle-housing-decor-item-april-23','G1699',1,'2026-04-18 07:34:04.173','2026-04-18 07:34:04.173'),
(156,'Power Up With the Voidforge','power-up-with-the-voidforge','Aid domanaar Decimus to build a Voidforge to empower your gear and take your adventures further with the use of Ascendant Voidcores and Nebulous Voidcores.','Aid domanaar Decimus to build a Voidforge to empower your gear and take your adventures further with the use of Ascendant Voidcores and Nebulous Voidcores.','/uploads/blog/power-up-with-the-voidforge-645944.jpg','https://worldofwarcraft.blizzard.com/news/24271858/power-up-with-the-voidforge','G1699',1,'2026-04-18 07:34:06.057','2026-04-18 07:34:06.057'),
(157,'12.0.5 Content Update Notes','12-0-5-content-update-notes','The 12.0.5 content update arrives to World of Warcraft on April 21.','The 12.0.5 content update arrives to World of Warcraft on April 21.','/uploads/blog/12-0-5-content-update-notes-646910.jpg','https://worldofwarcraft.blizzard.com/news/24271855/1205-content-update-notes','G1699',1,'2026-04-18 07:34:07.226','2026-04-18 07:34:07.226'),
(158,'Hunt or be Hunted in Decor Duels','hunt-or-be-hunted-in-decor-duels','Lift your spirits and take a break from all the serious threats the Void and their agents present with a little team vs team hide-and-seek in the 12.0.5 content update. Don the guise of a random Decor','Lift your spirits and take a break from all the serious threats the Void and their agents present with a little team vs team hide-and-seek in the 12.0.5 content update. Don the guise of a random Decor Item or seek them out in this fast-paced duel for fun—and some new rewards.','/uploads/blog/hunt-or-be-hunted-in-decor-duels-647734.jpg','https://worldofwarcraft.blizzard.com/news/24271369/hunt-or-be-hunted-in-decor-duels','G1699',1,'2026-04-18 07:34:07.751','2026-04-18 07:34:07.751'),
(159,'Mists of Pandaria Classic: Expect Joyous Journeys Beginning April 21','mists-of-pandaria-classic-expect-joyous-journeys-beginning-april-21','The mystical lands of Pandaria are swirling with danger. Stalwart champions in World of Warcraft: Mists of Pandaria Classic, take advantage of the Joyous Journeys experience buff to enhance your odyss','The mystical lands of Pandaria are swirling with danger. Stalwart champions in World of Warcraft: Mists of Pandaria Classic, take advantage of the Joyous Journeys experience buff to enhance your odyssey through Azeroth, increasing experience gains by 50% up to level 90!','/uploads/blog/mists-of-pandaria-classic-expect-joyous-journeys-beginning-april-21-648297.webp','https://worldofwarcraft.blizzard.com/news/24272609/mists-of-pandaria-classic-expect-joyous-journeys-beginning-april-21','G1699',1,'2026-04-18 07:34:08.320','2026-04-18 07:34:08.320'),
(160,'WoW BCC Anniversary Edition: Overlords of Outland Arrives May 14','wow-bcc-anniversary-edition-overlords-of-outland-arrives-may-14','The battle for Outland heats up on May 14 as WoW Burning Crusade Classic Anniversary Edition: Overlords of Outland launches globally on all realms at 3:00 PM PDT / 23:00 BST—take the fight to Illidan ','The battle for Outland heats up on May 14 as WoW Burning Crusade Classic Anniversary Edition: Overlords of Outland launches globally on all realms at 3:00 PM PDT / 23:00 BST—take the fight to Illidan Stormrage’s lieutenants, brave two new raids, and chase new rewards across the shattered world of Outland.','/uploads/blog/wow-bcc-anniversary-edition-overlords-of-outland-arrives-may-14-648926.jpg','https://worldofwarcraft.blizzard.com/news/24272608/wow-bcc-anniversary-edition-overlords-of-outland-arrives-may-14','G1699',1,'2026-04-18 07:34:08.994','2026-04-18 07:34:08.994'),
(161,'Twitch Drop Now Live! Get the Cuddly Pearl Grrgle Housing Decor Item','twitch-drop-now-live-get-the-cuddly-pearl-grrgle-housing-decor-item','Watch any eligible World of Warcraft stream on Twitch.tv from April 23 at 3:00 pm PDT until May 21 at 3:00 pm PDT to claim the Cuddly Pearl Grrgle Housing decor item.','Watch any eligible World of Warcraft stream on Twitch.tv from April 23 at 3:00 pm PDT until May 21 at 3:00 pm PDT to claim the Cuddly Pearl Grrgle Housing decor item.','/uploads/blog/twitch-drop-now-live-get-the-cuddly-pearl-grrgle-housing-decor-item-044312.avif','https://worldofwarcraft.blizzard.com/news/24266872/','G1699',1,'2026-04-24 11:27:24.392','2026-04-24 11:27:24.392'),
(162,'Mists of Pandaria Classic: Joyous Journeys is Now Live','mists-of-pandaria-classic-joyous-journeys-is-now-live','The mystical lands of Pandaria are swirling with danger. Stalwart champions in World of Warcraft: Mists of Pandaria Classic, take advantage of the Joyous Journeys experience buff to enhance your odyss','The mystical lands of Pandaria are swirling with danger. Stalwart champions in World of Warcraft: Mists of Pandaria Classic, take advantage of the Joyous Journeys experience buff to enhance your odyssey through Azeroth, increasing experience gains by 50% up to level 90!','/uploads/blog/mists-of-pandaria-classic-joyous-journeys-is-now-live-044967.webp','https://worldofwarcraft.blizzard.com/news/24272609','G1699',1,'2026-04-24 11:27:25.065','2026-04-24 11:27:25.065'),
(163,'A Message Regarding the 12.0.5 Launch','a-message-regarding-the-12-0-5-launch','The 12.0.5 patch launch was not up to our standards, and we know this disrupted your time and caused justified frustration.','The 12.0.5 patch launch was not up to our standards, and we know this disrupted your time and caused justified frustration.','/uploads/blog/a-message-regarding-the-12-0-5-launch-045528.avif','https://worldofwarcraft.blizzard.com/news/24265942/a-message-regarding-the-1205-launch','G1699',1,'2026-04-24 11:27:25.656','2026-04-24 11:27:25.656'),
(164,'Hotfixes: April 23, 2026','hotfixes-april-23-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-april-23-2026-046091.avif','https://worldofwarcraft.blizzard.com/news/24276957/hotfixes-april-23-2026','G1699',1,'2026-04-24 11:27:26.134','2026-04-24 11:27:26.134'),
(165,'The 12.0.5 Content Update Now Live!','the-12-0-5-content-update-now-live','Engage in new activities, experience more of the story in Midnight, and earn more loot as the efforts to push back the forces of the Void and their agents continue. You’ll undertake new Void Assaults,','Engage in new activities, experience more of the story in Midnight, and earn more loot as the efforts to push back the forces of the Void and their agents continue. You’ll undertake new Void Assaults, disrupt powerful Ritual Sites, get a boost with Voidforge, group up for Decor Duels, and more.','/uploads/blog/the-12-0-5-content-update-now-live-048037.jpg','https://worldofwarcraft.blizzard.com/news/24266871/the-1205-content-update-now-live','G1699',1,'2026-04-24 11:27:28.100','2026-04-24 11:27:28.100'),
(166,'BCC Anniversary Edition: Overlords of Outland Arrives May 14','bcc-anniversary-edition-overlords-of-outland-arrives-may-14','Lady Vashj and Kael\'thas Sunstrider, the cunning overlords of Outland, have long served Illidan Stormrage, the Betrayer. Retake Outland on May 14, when Overlords of Outland launches globally on all re','Lady Vashj and Kael\'thas Sunstrider, the cunning overlords of Outland, have long served Illidan Stormrage, the Betrayer. Retake Outland on May 14, when Overlords of Outland launches globally on all realms at 3:00 PM PDT / 23:00 BST.','/uploads/blog/bcc-anniversary-edition-overlords-of-outland-arrives-may-14-427607.jpg','https://worldofwarcraft.blizzard.com/news/24276751','G1699',1,'2026-05-01 11:53:47.649','2026-05-01 11:53:47.649'),
(167,'Transform Your Home With the Cozy Treehouse Retreat Bundle and More!','transform-your-home-with-the-cozy-treehouse-retreat-bundle-and-more','Make your home among the branches of two new home exteriors and a variety of delightful Spring-themed Housing decor items.','Make your home among the branches of two new home exteriors and a variety of delightful Spring-themed Housing decor items.','/uploads/blog/transform-your-home-with-the-cozy-treehouse-retreat-bundle-and-more-428219.webp','https://worldofwarcraft.blizzard.com/news/24271878','G1699',1,'2026-05-01 11:53:48.230','2026-05-01 11:53:48.230'),
(168,'Get Decked Out with Gilnean Flair at May’s Trading Post','get-decked-out-with-gilnean-flair-at-may-s-trading-post','The Gray Skies of Gilneas won’t put a damper on your style when you visit the May Trading Post. Take part in a variety of activities to earn this month’s reward— get the Ensemble: Pyrewood Rebel Stree','The Gray Skies of Gilneas won’t put a damper on your style when you visit the May Trading Post. Take part in a variety of activities to earn this month’s reward— get the Ensemble: Pyrewood Rebel Streetwear transmog set.','/uploads/blog/get-decked-out-with-gilnean-flair-at-may-s-trading-post-428849.jpg','https://worldofwarcraft.blizzard.com/news/24259074','G1699',1,'2026-05-01 11:53:48.862','2026-05-01 11:53:48.862'),
(169,'Azeroth Blossoms Anew: Choose Your Blooming Arboon Mount','azeroth-blossoms-anew-choose-your-blooming-arboon-mount','Climb atop a Blooming Arboon Mount adorned in vibrant fuchsia or warm amber hues to carry you and the strength of the forest wherever they roam.','Climb atop a Blooming Arboon Mount adorned in vibrant fuchsia or warm amber hues to carry you and the strength of the forest wherever they roam.','/uploads/blog/azeroth-blossoms-anew-choose-your-blooming-arboon-mount-429180.jpg','https://worldofwarcraft.blizzard.com/news/24276748','G1699',1,'2026-05-01 11:53:49.195','2026-05-01 11:53:49.195'),
(170,'Hotfixes: April 30, 2026','hotfixes-april-30-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-april-30-2026-429513.avif','https://worldofwarcraft.blizzard.com/news/24276957/hotfixes-april-30-2026','G1699',1,'2026-05-01 11:53:49.520','2026-05-01 11:53:49.520'),
(171,'Take a First Look at the Midnight: Revelations Content Update','take-a-first-look-at-the-midnight-revelations-content-update','In the next content update, take the next step in thwarting the forces of the Void—hunting down their leaders and uncovering new sources of power. Players will also face a new single-boss raid in Spor','In the next content update, take the next step in thwarting the forces of the Void—hunting down their leaders and uncovering new sources of power. Players will also face a new single-boss raid in Sporefall and Turbulent Timeways returns with Dragonflight dungeons and a new slate of rewards.','/uploads/blog/take-a-first-look-at-the-midnight-revelations-content-update-430477.webp','https://worldofwarcraft.blizzard.com/news/24276660/take-a-first-look-at-the-midnight-revelations-content-update','G1699',1,'2026-05-01 11:53:50.485','2026-05-01 11:53:50.485'),
(172,'Adventure with the Orphans of Azeroth During Children\'s Week','adventure-with-the-orphans-of-azeroth-during-children-s-week','Champion the orphaned when you give back to the children of Azeroth during Children\'s Week—take an orphan under your wing and show them what the hero\'s life is like!','Champion the orphaned when you give back to the children of Azeroth during Children\'s Week—take an orphan under your wing and show them what the hero\'s life is like!','/uploads/blog/adventure-with-the-orphans-of-azeroth-during-children-s-week-431366.avif','https://worldofwarcraft.blizzard.com/news/24276749/adventure-with-the-orphans-of-azeroth-during-childrens-week','G1699',1,'2026-05-01 11:53:51.373','2026-05-01 11:53:51.373'),
(173,'WoW Weekly: Midnight 12.0.5 Content Update, Twitch Drops, and Joyous Journeys!','wow-weekly-midnight-12-0-5-content-update-twitch-drops-and-joyous-journeys','Flex your muscle and push back against the Void in the Midnight 12.0.5 content update, Joyous Journeys are alive and well in Mists of Pandaria Classic, and get your Cuddly Pearl Grrgle Housing decor i','Flex your muscle and push back against the Void in the Midnight 12.0.5 content update, Joyous Journeys are alive and well in Mists of Pandaria Classic, and get your Cuddly Pearl Grrgle Housing decor item when you catch participating Twitch streams.','/uploads/blog/wow-weekly-midnight-12-0-5-content-update-twitch-drops-and-joyous-journeys-431756.jpg','https://worldofwarcraft.blizzard.com/news/24276750/wow-weekly-midnight-1205-content-update-twitch-drops-and-joyous-journeys','G1699',1,'2026-05-01 11:53:51.773','2026-05-01 11:53:51.773'),
(174,'Mists of Pandaria Classic: The Siege of Orgrimmar Update Arrives June 2','mists-of-pandaria-classic-the-siege-of-orgrimmar-update-arrives-june-2','Azeroth\'s heroes have stood against the Thunder King, yet a darker storm now gathers in Garrosh Hellscream. With the Vale of Eternal Blossoms corrupted and Orgrimmar in chaos, the Warchief must be sto','Azeroth\'s heroes have stood against the Thunder King, yet a darker storm now gathers in Garrosh Hellscream. With the Vale of Eternal Blossoms corrupted and Orgrimmar in chaos, the Warchief must be stopped before all are dragged into darkness.','/uploads/blog/mists-of-pandaria-classic-the-siege-of-orgrimmar-update-arrives-june-2-361052.webp','https://worldofwarcraft.blizzard.com/news/24264421','G1699',1,'2026-05-17 11:12:41.730','2026-05-17 11:12:41.730'),
(175,'Hotfixes: May 15, 2026','hotfixes-may-15-2026','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and ','Here you will find a list of hotfixes that address various issues related to World of Warcraft: Midnight, Mists of Pandaria Classic, Season of Discovery, Burning Crusade Classic, WoW Classic Era, and Hardcore.','/uploads/blog/hotfixes-may-15-2026-364617.avif','https://worldofwarcraft.blizzard.com/news/24276957/hotfixes-may-15-2026','G1699',1,'2026-05-17 11:12:44.627','2026-05-17 11:12:44.627'),
(176,'WoW Weekly: Classic Anniversary, WoW Ambassadors Discord, Mists of Pandaria Classic, and More!','wow-weekly-classic-anniversary-wow-ambassadors-discord-mists-of-pandaria-classic-and-more','Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-classic-anniversary-wow-ambassadors-discord-mists-of-pandaria-classic-and-more-365559.webp','https://worldofwarcraft.blizzard.com/news/24276960/wow-weekly-classic-anniversary-wow-ambassadors-discord-mists-of-pandaria-classic-and-more','G1699',1,'2026-05-17 11:12:45.583','2026-05-17 11:12:45.583'),
(177,'BCC Anniversary Edition: Overlords of Outland Now Live!','bcc-anniversary-edition-overlords-of-outland-now-live','Lady Vashj and Kael\'thas Sunstrider, the cunning Overlords of Outland, have long served Illidan Stormrage, the Betrayer. As the battle for Outland heats up, it\'s time to bring their wretched rule to a','Lady Vashj and Kael\'thas Sunstrider, the cunning Overlords of Outland, have long served Illidan Stormrage, the Betrayer. As the battle for Outland heats up, it\'s time to bring their wretched rule to an end.','/uploads/blog/bcc-anniversary-edition-overlords-of-outland-now-live-365852.jpg','https://worldofwarcraft.blizzard.com/news/24276751/bcc-anniversary-edition-overlords-of-outland-now-live','G1699',1,'2026-05-17 11:12:45.910','2026-05-17 11:12:45.910'),
(178,'Time is Running Out! Play Midnight for a Classic Anniversary Edition Flying Mount','time-is-running-out-play-midnight-for-a-classic-anniversary-edition-flying-mount','From now through May 17, earn the menacing Voidfeather Dragonhawk flying mount to carry you through the fel-scarred realm of Outland in Burning Crusade Classic Anniversary Edition after completing the','From now through May 17, earn the menacing Voidfeather Dragonhawk flying mount to carry you through the fel-scarred realm of Outland in Burning Crusade Classic Anniversary Edition after completing the introduction scenario in World of Warcraft: Midnight.','/uploads/blog/time-is-running-out-play-midnight-for-a-classic-anniversary-edition-flying-mount-367941.avif','https://worldofwarcraft.blizzard.com/news/24267942/time-is-running-out-play-midnight-for-a-classic-anniversary-edition-flying-mount','G1699',1,'2026-05-17 11:12:48.002','2026-05-17 11:12:48.002'),
(179,'WoW Weekly: Last Chance to Adopt Roofus, Tune in for MDI This Weekend, and More!','wow-weekly-last-chance-to-adopt-roofus-tune-in-for-mdi-this-weekend-and-more','This week, purchase The Roofus Pack to support Habitat for Humanity before it\'s too late, the Groups Stage begins this weekend as Mythic Dungeon International sets off on the road to BlizzCon, and sav','This week, purchase The Roofus Pack to support Habitat for Humanity before it\'s too late, the Groups Stage begins this weekend as Mythic Dungeon International sets off on the road to BlizzCon, and save up to 50% on Burning Crusade Anniversary Packs and Services.','/uploads/blog/wow-weekly-last-chance-to-adopt-roofus-tune-in-for-mdi-this-weekend-and-more-368526.webp','https://worldofwarcraft.blizzard.com/news/24280278/wow-weekly-last-chance-to-adopt-roofus-tune-in-for-mdi-this-weekend-and-more','G1699',1,'2026-05-17 11:12:48.667','2026-05-17 11:12:48.667'),
(180,'Time is Running Out! Adopt Roofus Today and Support Habitat for Humanity','time-is-running-out-adopt-roofus-today-and-support-habitat-for-humanity','Introducing Roofus, an industrious builder and lovable new companion pet ready to accompany you on all your adventures in both Mists of Pandaria Classic and modern World of Warcraft. By purchasing The','Introducing Roofus, an industrious builder and lovable new companion pet ready to accompany you on all your adventures in both Mists of Pandaria Classic and modern World of Warcraft. By purchasing The Roofus Pack, you’ll be supporting Habitat for Humanity, an organization that has helped provide housing and shelter for more than 65 million people across the globe.','/uploads/blog/time-is-running-out-adopt-roofus-today-and-support-habitat-for-humanity-369500.webp','https://worldofwarcraft.blizzard.com/news/24267940/time-is-running-out-adopt-roofus-today-and-support-habitat-for-humanity','G1699',1,'2026-05-17 11:12:49.585','2026-05-17 11:12:49.585'),
(181,'Save up to 50% on Burning Crusade Classic Anniversary Packs and Services','save-up-to-50-on-burning-crusade-classic-anniversary-packs-and-services','Save on Outland Epic and Heroic Packs, Level 58 Character Boosts, and Classic Name Changes through May 18, 2026.','Save on Outland Epic and Heroic Packs, Level 58 Character Boosts, and Classic Name Changes through May 18, 2026.','/uploads/blog/save-up-to-50-on-burning-crusade-classic-anniversary-packs-and-services-370160.jpg','https://worldofwarcraft.blizzard.com/news/24261477/save-up-to-50-on-burning-crusade-classic-anniversary-packs-and-services','G1699',1,'2026-05-17 11:12:50.209','2026-05-17 11:12:50.209'),
(182,'The Mythic Dungeon International Returns!','the-mythic-dungeon-international-returns','The Mythic Dungeon International celebrates its homecoming in the first season of Midnight, starting on May 8!','The Mythic Dungeon International celebrates its homecoming in the first season of Midnight, starting on May 8!','/uploads/blog/the-mythic-dungeon-international-returns-370532.avif','https://worldofwarcraft.blizzard.com/news/24276958/the-mythic-dungeon-international-returns','G1699',1,'2026-05-17 11:12:50.540','2026-05-17 11:12:50.540'),
(183,'WoW Weekly: Classic Anniversary Edition, May\'s Trading Post, Children\'s Week, and More!','wow-weekly-classic-anniversary-edition-may-s-trading-post-children-s-week-and-more','Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','Each week meets you with adventurous discovery and fresh rewards—be sure to check in to learn more about what awaits you in Azeroth.','/uploads/blog/wow-weekly-classic-anniversary-edition-may-s-trading-post-children-s-week-and-more-371572.jpg','https://worldofwarcraft.blizzard.com/news/24276752/wow-weekly-classic-anniversary-edition-mays-trading-post-childrens-week-and-more','G1699',1,'2026-05-17 11:12:51.909','2026-05-17 11:12:51.909'),
(184,'[Shop] Azeroth Blossoms Anew: Choose Your Blooming Arboon Mount','shop-azeroth-blossoms-anew-choose-your-blooming-arboon-mount','Climb atop a Blooming Arboon Mount adorned in vibrant fuchsia or warm amber hues to carry you and the strength of the forest wherever they roam.','Climb atop a Blooming Arboon Mount adorned in vibrant fuchsia or warm amber hues to carry you and the strength of the forest wherever they roam.','/uploads/blog/shop-azeroth-blossoms-anew-choose-your-blooming-arboon-mount-372460.jpg','https://worldofwarcraft.blizzard.com/news/24276748/shop-azeroth-blossoms-anew-choose-your-blooming-arboon-mount','G1699',1,'2026-05-17 11:12:52.491','2026-05-17 11:12:52.491');
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Review`
--

DROP TABLE IF EXISTS `Review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `serviceId` int(11) DEFAULT NULL,
  `orderId` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `title` varchar(191) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `isPublished` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Review_userId_isPublished_createdAt_idx` (`userId`,`isPublished`,`createdAt`),
  KEY `Review_serviceId_idx` (`serviceId`),
  KEY `Review_orderId_idx` (`orderId`),
  CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Review_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Review`
--

LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScraperSource`
--

DROP TABLE IF EXISTS `ScraperSource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScraperSource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `scrapeInterval` int(11) NOT NULL DEFAULT 60,
  `lastRunAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ScraperSource_url_key` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScraperSource`
--

LOCK TABLES `ScraperSource` WRITE;
/*!40000 ALTER TABLE `ScraperSource` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScraperSource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Service`
--

DROP TABLE IF EXISTS `Service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `gameId` int(11) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `price` decimal(10,2) NOT NULL,
  `isHotOffer` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Service_slug_key` (`slug`),
  KEY `Service_gameId_categoryId_idx` (`gameId`,`categoryId`),
  KEY `Service_isActive_createdAt_idx` (`isActive`,`createdAt`),
  KEY `Service_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Service_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES
(1,'TBC Power Leveling','tbc-power-leveling',1,1,'<section class=\"boost-section\">\r\n  <h1>Burning Crusade 20th Anniversary Leveling Boost – Level Faster, Play Smarter</h1>\r\n\r\n  <p>\r\n    Outland is brutal — hostile factions camping quest hubs, confusing quest chains,\r\n    and mobs that hit way harder than you remember. Why waste your time struggling,\r\n    when you can reach max level faster and safer?\r\n  </p>\r\n\r\n  <p>\r\n    That’s exactly why <strong>GamingQu’s Burning Crusade 20th Anniversary Leveling Boost</strong> exists.\r\n  </p>\r\n\r\n  <p>\r\n    Our experienced boosters use a smart combination of three proven leveling methods,\r\n    carefully adjusted to your character and server conditions for maximum efficiency:\r\n  </p>\r\n\r\n  <div class=\"boost-method\">\r\n    <h3>Optimized Questing</h3>\r\n    <p>\r\n      We follow the fastest quest routes only — skipping slow, inefficient chains while\r\n      focusing on high-value quests that deliver solid XP and rewards without unnecessary downtime.\r\n    </p>\r\n  </div>\r\n\r\n  <div class=\"boost-method\">\r\n    <h3>Fast Dungeon Clears</h3>\r\n    <p>\r\n      Dungeon farming is one of the most powerful XP methods in TBC. Our expert groups\r\n      clear dungeons like <strong>Hellfire Ramparts</strong> and <strong>Blood Furnace</strong>\r\n      in as little as <strong>12 minutes per run</strong>, giving you massive XP gains in a short time.\r\n    </p>\r\n  </div>\r\n\r\n  <div class=\"boost-method\">\r\n    <h3>Efficient Mob Grinding</h3>\r\n    <p>\r\n      Perfect for AoE-focused classes or low-population servers. Enjoy nonstop XP farming\r\n      without waiting for respawns or competing with other players for mobs.\r\n    </p>\r\n  </div>\r\n\r\n  <h2>Tailored Leveling, Maximum Results</h2>\r\n  <p>\r\n    Our WoW TBC 20th Anniversary Classic Leveling service dynamically combines these methods\r\n    based on your class, level, and server situation — ensuring the fastest, safest, and\r\n    most efficient leveling experience possible.\r\n  </p>\r\n\r\n  <p>\r\n    We know Outland inside and out — from the very first quest hubs to the most dangerous\r\n    endgame zones. If you choose the questing route, your journey will take you through all key Outland regions:\r\n  </p>\r\n\r\n  <ul class=\"zone-list\">\r\n    <li>Hellfire Peninsula</li>\r\n    <li>Zangarmarsh</li>\r\n    <li>Terokkar Forest</li>\r\n    <li>Nagrand</li>\r\n    <li>Blade’s Edge Mountains</li>\r\n    <li>Netherstorm</li>\r\n    <li>Shadowmoon Valley</li>\r\n  </ul>\r\n</section>','/uploads/services/tbc-power-leveling-1770217969396.webp','[\"Fast 58-70 leveling\",\"Any level range\",\"Highly customizable offer\"]',20.00,1,1,'2026-02-04 15:12:49.402','2026-02-06 06:45:11.275'),
(2,'Profession Kit','profession-kit',1,1,'<h2>Burning Crusade 20th Anniversary Professions Kits Boosting Service</h2>\r\n\r\n<p>\r\nProfessions are incredibly significant in <strong>World of Warcraft Classic</strong>, acting as a key method for gearing up before raids, crafting unique items, and generating Gold.\r\nIf you need a <strong>TBC Classic 20th Anniversary Professions Kits carry</strong>, this service provides a ready-to-use package without the usual farming.\r\n</p>\r\n\r\n<p>\r\nThe downside of professions is that unlocking high-quality craftable items often requires a large time investment to collect resources and level your profession.\r\nOur service removes that grind completely.\r\n</p>\r\n\r\n<p>\r\nWhether you\'re a seasoned veteran or a newcomer to the game, our\r\n<strong>Burning Crusade Anniversary Profession Kits Boosting</strong> ensures you have everything you need to dominate the profession market.\r\nWith our <strong>Burning Crusade Fresh Professions Kits Boost</strong>, we provide a full set of resources for the following professions:\r\n</p>\r\n\r\n<ul>\r\n    <li>Alchemy</li>\r\n    <li>Blacksmithing</li>\r\n    <li>Enchanting</li>\r\n    <li>Engineering</li>\r\n    <li>Leatherworking</li>\r\n    <li>Tailoring</li>\r\n    <li>Jewelcrafting</li>\r\n</ul>','/uploads/services/profession-kit-1770284468680.png','[\"Full 1–375\",\"Fast delivery\",\"Step-by-step leveling guide\"]',5.00,0,1,'2026-02-05 09:41:08.834','2026-02-05 09:41:08.834'),
(3,'Pre-Raid Gear','pre-raid-gear',1,2,'<div class=\"product-description\">\r\n  <h2>Pre-Raid Gear – TNC Anniversary Edition</h2>\r\n  \r\n  <p>\r\n    Celebrate the <strong>TNC Anniversary</strong> with exclusive <strong>Pre-Raid Gear</strong>, \r\n    designed to prepare you for upcoming battles and challenges. This limited-edition gear \r\n    is crafted for players who want to enter raids fully equipped, confident, and ahead of the competition.\r\n  </p>\r\n  \r\n  <h3>Key Features</h3>\r\n  <ul>\r\n    <li><strong>Anniversary Exclusive</strong> – Available only during the TNC Anniversary event</li>\r\n    <li><strong>Pre-Raid Ready</strong> – Optimized gear to boost your performance before entering raids</li>\r\n    <li><strong>Balanced Stats</strong> – Designed to enhance survivability, efficiency, and combat readiness</li>\r\n    <li><strong>Limited Availability</strong> – Once the event ends, this gear may not return</li>\r\n  </ul>\r\n  \r\n  <h3>Why Choose This Gear?</h3>\r\n  <p>\r\n    The Pre-Raid Gear – TNC Anniversary Edition is perfect for players who want to maximize their \r\n    preparation phase. Whether you are a seasoned raider or preparing for your first major encounter, \r\n    this gear gives you the edge you need before the real fight begins.\r\n  </p>\r\n  \r\n  <p>\r\n    <em>Don’t miss the chance to commemorate the TNC Anniversary with gear that represents readiness, \r\n    power, and prestige.</em>\r\n  </p>\r\n</div>','/uploads/services/pre-raid-gear-1770570666986.jpg','[\"Includes 8/8 Dungeon Set 1\",\"All gold, loot\",\"Dungeons completed\"]',10.55,0,1,'2026-02-08 17:10:26.860','2026-02-08 17:14:02.954'),
(4,'Honor Points','honor-points',1,3,'<section class=\"service-description\">\r\n  <h2>Honor Points Farming – Classic Anniversary</h2>\r\n\r\n  <p>\r\n    <strong>Honor Points Farming</strong> in World of Warcraft Classic Anniversary is the fastest and most efficient\r\n    way to gear up your character for PvP content. If you want to compete at the highest level without spending endless\r\n    hours in battlegrounds, this service is the perfect solution.\r\n  </p>\r\n\r\n  <p>\r\n    Our professional PvP players will farm Honor Points on your character safely and efficiently, allowing you to unlock\r\n    powerful PvP gear, ranks, and rewards while you focus on enjoying the game. Ideal for players who value time,\r\n    performance, and consistent results.\r\n  </p>\r\n\r\n  <h3>Why Choose Our Honor Points Farming Service?</h3>\r\n  <ul>\r\n    <li>Fast and efficient Honor Points farming</li>\r\n    <li>Experienced PvP players with deep Classic knowledge</li>\r\n    <li>Secure and confidential account handling</li>\r\n    <li>Optimized farming strategies for maximum Honor gain</li>\r\n    <li>Perfect for ranking up and PvP gear progression</li>\r\n  </ul>\r\n\r\n  <p>\r\n    Whether you are aiming for higher PvP ranks or preparing your character for upcoming battles,\r\n    our <strong>Classic Anniversary Honor Points Farming</strong> service ensures a smooth, reliable,\r\n    and stress-free experience.\r\n  </p>\r\n\r\n  <p>\r\n    <em>Boost your PvP progress, save your time, and dominate the battlefield.</em>\r\n  </p>\r\n</section>','/uploads/services/honor-points-1770912352790.webp','[\"Fast Honor Farming\",\"Safe Account Handling\",\"Experienced PvP Team\"]',23.88,0,1,'2026-02-12 16:05:52.808','2026-02-12 17:27:14.974'),
(5,'Heroic Dungeon','heroic-dungeon',1,2,'<div class=\"service-description\">\r\n  <h2>TBC Anniversary Heroic Dungeons Attunements</h2>\r\n\r\n  <p>\r\n    Unlock access to <strong>Heroic Dungeons</strong> in <strong>World of Warcraft: TBC Anniversary</strong> without the hassle.\r\n    Our Heroic Dungeon Attunement service is designed for players who want fast, safe, and reliable access to endgame content\r\n    without spending countless hours on reputation grinding.\r\n  </p>\r\n\r\n  <p>\r\n    Heroic Dungeons are essential for earning <strong>pre-raid BiS gear</strong>, <strong>Badges of Justice</strong>, and preparing\r\n    your character for high-level raids. With our professional boosting team, we handle all the required reputation farming\r\n    and attunement processes efficiently while keeping your account secure.\r\n  </p>\r\n\r\n  <p>\r\n    Whether you\'re gearing a fresh character or preparing an alt for endgame progression, this service ensures you are fully\r\n    attuned and ready to enter all available Heroic Dungeons in the TBC Anniversary realms.\r\n  </p>\r\n\r\n  <ul>\r\n    <li>Full Heroic Dungeon Attunement completion</li>\r\n    <li>Required reputation farming handled by experts</li>\r\n    <li>Safe, fast, and account-secure boosting</li>\r\n    <li>Ideal for pre-raid gearing and Badge farming</li>\r\n  </ul>\r\n\r\n  <p>\r\n    Save your time, skip the grind, and jump straight into Heroic content with confidence.\r\n    Start your TBC Anniversary journey fully prepared for endgame challenges.\r\n  </p>\r\n</div>','/uploads/services/heroic-dungeon-1770925328713.jpg','[\"Fast Attunement Process\",\"Safe Account Handling\",\"Endgame Ready Access\"]',25.99,0,1,'2026-02-12 19:42:08.728','2026-02-12 19:42:08.728'),
(6,'1-90 Custom Leveling','1-90-custom-leveling',2,5,'<section>\r\n  <h1>The WoW Midnight Leveling</h1>\r\n\r\n  <p>\r\n    <strong>The WoW Midnight Leveling</strong> is a professional power leveling service designed for the latest \r\n    World of Warcraft expansion, <span>Midnight</span>. This service helps players quickly and efficiently \r\n    level up their characters without spending countless hours grinding.\r\n  </p>\r\n\r\n  <h2>Service Highlights</h2>\r\n  <ul>\r\n    <li>Fast and efficient leveling process</li>\r\n    <li>Handled by experienced WoW players</li>\r\n    <li>Safe and secure methods</li>\r\n    <li>Regular progress updates</li>\r\n    <li>Responsive customer support</li>\r\n  </ul>\r\n\r\n  <h2>Service Details</h2>\r\n  <p>\r\n    Leveling is completed using the most effective strategies available in the Midnight expansion, \r\n    including optimized questing routes, dungeon runs, and efficient grinding paths to ensure maximum results.\r\n  </p>\r\n\r\n  <h2>Why Choose Our Service?</h2>\r\n  <p>\r\n    We understand that not every player has the time to grind to max level. \r\n    With <strong>The WoW Midnight Leveling</strong>, you can jump straight into endgame content \r\n    and enjoy everything Azeroth has to offer without the long leveling process.\r\n  </p>\r\n\r\n  <h2>Order Now</h2>\r\n  <p>\r\n    Boost your character today and prepare to conquer the newest challenges in Azeroth!\r\n  </p>\r\n</section>','/uploads/services/1-90-custom-leveling-1771006458004.jpg','[\"Fast Level Progression\",\"Optimized Quest & Dungeon Routes\",\"Safe and Secure Leveling\"]',31.66,0,1,'2026-02-13 18:14:18.110','2026-02-15 00:54:59.659'),
(7,'Arena 2v2','arena-2v2',1,3,'<h2>ARENA 2V2 TBC CLASSIC ANNIVERSARY</h2>\r\n\r\n<p>\r\nOur <strong>Arena 2v2 TBC Classic Anniversary</strong> service helps you increase your Arena rating quickly, safely, and efficiently. \r\nAll matches are completed by experienced professional players using competitive strategies to achieve your desired rating goals.\r\n</p>\r\n\r\n<ul>\r\n<li>✔ Arena 2v2 Rating Push</li>\r\n<li>✔ Professional & Experienced Boosters</li>\r\n<li>✔ Fast Progress & Secure Service</li>\r\n<li>✔ Privacy and Account Safety Guaranteed</li>\r\n</ul>','/uploads/services/arena-2v2-1772125996593.png','[\"Fast and efficient\",\"PvP experience\",\"Safe, private\"]',20.00,0,1,'2026-02-26 17:13:17.087','2026-02-26 17:13:17.087');
/*!40000 ALTER TABLE `Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceDetail`
--

DROP TABLE IF EXISTS `ServiceDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ServiceDetail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceId` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `fieldName` varchar(191) NOT NULL,
  `inputType` enum('select','radio','range','checkbox','input') NOT NULL,
  `displayType` enum('number','text','dual','single') DEFAULT NULL,
  `priceType` enum('fixed','percent') NOT NULL DEFAULT 'fixed',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `range` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`range`)),
  `inputMeta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`inputMeta`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ServiceDetail_serviceId_isActive_sortOrder_idx` (`serviceId`,`isActive`,`sortOrder`),
  CONSTRAINT `ServiceDetail_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceDetail`
--

LOCK TABLES `ServiceDetail` WRITE;
/*!40000 ALTER TABLE `ServiceDetail` DISABLE KEYS */;
INSERT INTO `ServiceDetail` VALUES
(2,1,'Choose Server','choose-server','select',NULL,'fixed',0.00,2,'[{\"label\":\"Dreamscythe\",\"price\":0},{\"label\":\"Nightslayer\",\"price\":0},{\"label\":\"Maladath\",\"price\":0},{\"label\":\"Thunderstrike\",\"price\":0},{\"label\":\"Spineshatter\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-04 16:36:38.630','2026-02-04 16:42:09.194'),
(3,1,'Completion Method','completion-method','radio',NULL,'fixed',0.00,1,'[{\"label\":\"Piloted\",\"price\":0}]',NULL,NULL,1,'2026-02-04 16:38:39.346','2026-02-12 16:11:01.123'),
(4,1,'Select Character class','select-character-class','select',NULL,'fixed',0.00,3,'[{\"label\":\"Hunter\",\"price\":0},{\"label\":\"Druid\",\"price\":0},{\"label\":\"Priest\",\"price\":0},{\"label\":\"Paladin\",\"price\":0},{\"label\":\"Warlock\",\"price\":0},{\"label\":\"Shaman\",\"price\":0},{\"label\":\"Rogue\",\"price\":0},{\"label\":\"Mage\",\"price\":0},{\"label\":\"Warrior\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-04 16:41:11.963','2026-02-04 18:13:21.767'),
(5,1,'Your Current and Desired Level','Level','range','dual','percent',0.00,4,NULL,'{\"min\":1,\"max\":70,\"step\":60,\"dual\":true,\"items\":[{\"min\":1,\"max\":10,\"price\":20},{\"min\":10,\"max\":20,\"price\":30},{\"min\":20,\"max\":30,\"price\":45},{\"min\":30,\"max\":40,\"price\":47},{\"min\":40,\"max\":50,\"price\":60},{\"min\":50,\"max\":60,\"price\":65},{\"min\":1,\"max\":60,\"price\":110.66},{\"min\":50,\"max\":70,\"price\":145},{\"min\":1,\"max\":61,\"price\":115.66},{\"min\":1,\"max\":62,\"price\":120.66},{\"min\":1,\"max\":63,\"price\":125.66},{\"min\":1,\"max\":64,\"price\":130.66},{\"min\":1,\"max\":65,\"price\":135.66},{\"min\":1,\"max\":66,\"price\":145.66},{\"min\":1,\"max\":67,\"price\":165.66},{\"min\":1,\"max\":68,\"price\":185.66},{\"min\":1,\"max\":69,\"price\":210.66},{\"min\":1,\"max\":70,\"price\":230.66},{\"min\":60,\"max\":70,\"price\":130.33},{\"min\":58,\"max\":70,\"price\":140.66}]}','{\"kind\":\"text\",\"required\":true}',1,'2026-02-04 16:42:01.652','2026-03-01 15:24:19.202'),
(6,1,'Faction','faction','radio',NULL,'fixed',0.00,5,'[{\"label\":\"Alliance\",\"price\":0},{\"label\":\"Horde\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-04 16:44:16.638','2026-02-04 16:57:05.942'),
(7,1,'First Profession Kit','first-profession-kit','select',NULL,'fixed',0.00,6,'[{\"label\":\"Alchemy\",\"price\":100},{\"label\":\"Blacksmithing\",\"price\":200},{\"label\":\"Engineering\",\"price\":150},{\"label\":\"Enchanting\",\"price\":150},{\"label\":\"Jewelcrafting\",\"price\":130},{\"label\":\"Leatherworking\",\"price\":100},{\"label\":\"Tailoring\",\"price\":150}]',NULL,NULL,1,'2026-02-04 16:48:16.745','2026-02-04 16:48:16.745'),
(8,1,'Second Profession Kit','second-profession-kit','select',NULL,'fixed',0.00,7,'[{\"label\":\"Alchemy\",\"price\":100},{\"label\":\"Blacksmithing\",\"price\":200},{\"label\":\"Engineering\",\"price\":150},{\"label\":\"Enchanting\",\"price\":150},{\"label\":\"Jewelcrafting\",\"price\":130},{\"label\":\"Leatherworking\",\"price\":100},{\"label\":\"Tailoring\",\"price\":150}]',NULL,NULL,1,'2026-02-04 16:48:16.745','2026-02-04 16:48:16.745'),
(9,1,'Gearing','gearing','select',NULL,'fixed',0.00,8,'[{\"label\":\"Pre-Raid Gear\",\"price\":200},{\"label\":\"Honor PvP Gear\",\"price\":200}]',NULL,NULL,1,'2026-02-04 16:50:47.218','2026-02-04 16:50:47.218'),
(10,1,'Leveling Speed','leveling-speed','radio',NULL,'percent',0.00,9,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":55},{\"label\":\"Super Express\",\"price\":80}]',NULL,NULL,1,'2026-02-04 16:51:45.075','2026-02-04 16:52:57.487'),
(11,1,'Extra services ','extra-services','checkbox',NULL,'fixed',0.00,10,'[{\"label\":\"Karazhan Attunement\",\"price\":50},{\"label\":\"Honor Gear Set Burning Crusade\",\"price\":150},{\"label\":\"All Heroic Dungeons Attunement\",\"price\":100},{\"label\":\"Add Phase 1 All Raids Bundle\",\"price\":750},{\"label\":\"Pre-Raid Gear Burning Crusade\",\"price\":60}]',NULL,NULL,1,'2026-02-04 16:55:59.435','2026-02-04 16:55:59.435'),
(12,2,'Completion Method','completion-method','radio',NULL,'fixed',0.00,1,'[{\"label\":\"In-Game Trade\",\"price\":0},{\"label\":\"Piloted\",\"price\":5}]',NULL,NULL,1,'2026-02-05 18:33:59.493','2026-02-05 18:33:59.493'),
(13,2,'Choose Server','choose-server','select',NULL,'fixed',0.00,2,'[{\"label\":\"Dreamscythe (NA)\",\"price\":2.5},{\"label\":\"Nightslayer (NA)\",\"price\":2.55},{\"label\":\"Thunderstrike (EU)\",\"price\":2.75},{\"label\":\"Spineshatter (EU)\",\"price\":2.75}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-05 18:43:26.638','2026-02-05 18:43:26.638'),
(14,2,'Profession Level','profession-level','radio',NULL,'fixed',0.00,3,'[{\"label\":\"1-300\",\"price\":0},{\"label\":\"300-375\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-05 18:44:46.114','2026-02-05 18:45:23.313'),
(15,2,'Faction','faction','radio',NULL,'fixed',0.00,4,'[{\"label\":\"Alliance\",\"price\":0},{\"label\":\"Horde\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-05 18:45:11.986','2026-02-05 18:45:11.986'),
(16,2,'First Profession Kit','first-profession-kit','select',NULL,'fixed',0.00,5,'[{\"label\":\"Alchemy\",\"price\":100},{\"label\":\"Blacksmithing\",\"price\":200},{\"label\":\"Engineering\",\"price\":150},{\"label\":\"Enchanting\",\"price\":150},{\"label\":\"Jewelcrafting\",\"price\":130},{\"label\":\"Leatherworking\",\"price\":100},{\"label\":\"Tailoring\",\"price\":150}]',NULL,NULL,1,'2026-02-04 16:48:16.745','2026-02-05 18:50:09.878'),
(17,2,'Second Profession Kit','second-profession-kit','select',NULL,'fixed',0.00,6,'[{\"label\":\"Alchemy\",\"price\":100},{\"label\":\"Blacksmithing\",\"price\":200},{\"label\":\"Engineering\",\"price\":150},{\"label\":\"Enchanting\",\"price\":150},{\"label\":\"Jewelcrafting\",\"price\":130},{\"label\":\"Leatherworking\",\"price\":100},{\"label\":\"Tailoring\",\"price\":150}]',NULL,NULL,1,'2026-02-04 16:48:16.745','2026-02-05 18:50:16.367'),
(18,2,'TBC Additional Options','tbc-additional-options','checkbox',NULL,'fixed',0.00,7,'[{\"label\":\"Cooking 300-375\",\"price\":50},{\"label\":\"Frist Aid 300-375\",\"price\":65}]',NULL,NULL,1,'2026-02-05 18:47:45.117','2026-02-05 18:49:58.485'),
(19,2,'Leveling Speed','completion-speed','radio',NULL,'percent',0.00,8,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":50},{\"label\":\"Super Express\",\"price\":75}]',NULL,NULL,1,'2026-02-05 18:48:32.966','2026-02-05 18:49:08.502'),
(20,3,'Completion Method','completion-method','radio',NULL,'fixed',0.00,1,'[{\"label\":\"Piloted\",\"price\":0}]',NULL,NULL,1,'2026-02-08 17:12:03.617','2026-02-08 17:12:03.617'),
(21,3,'Boost Options','boost-options','radio',NULL,'fixed',0.00,2,'[{\"label\":\"Pre-Raid Gear\",\"price\":200},{\"label\":\"Pre-Raid BiS Gear TBC\",\"price\":490.85}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-08 17:13:31.687','2026-02-08 17:13:31.687'),
(22,3,'Choose your Class','choose-your-class','select',NULL,'fixed',0.00,3,'[{\"label\":\"Druid\",\"price\":0},{\"label\":\"Hunter\",\"price\":0},{\"label\":\"Mage\",\"price\":0},{\"label\":\"Paladin\",\"price\":0},{\"label\":\"Priest\",\"price\":0},{\"label\":\"Rogue\",\"price\":0},{\"label\":\"Shaman\",\"price\":0},{\"label\":\"Warlock\",\"price\":0},{\"label\":\"Warrior\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-08 17:15:56.077','2026-02-08 17:15:56.077'),
(23,3,'Completion Speed','completion-speed','radio',NULL,'percent',0.00,4,'[{\"label\":\"Express\",\"price\":50},{\"label\":\"Super Express\",\"price\":75},{\"label\":\"Normal\",\"price\":0}]',NULL,NULL,1,'2026-02-08 17:16:51.682','2026-02-08 17:16:51.682'),
(24,3,'Extra services','extra-services','checkbox',NULL,'fixed',0.00,5,'[{\"label\":\"All Heroic Dungeons Attunement\",\"price\":119},{\"label\":\"Karazhan Attunement\",\"price\":59.55}]',NULL,NULL,1,'2026-02-08 17:18:05.390','2026-02-08 17:18:05.390'),
(25,4,'Completion Method','completion-method','radio',NULL,'fixed',0.00,1,'[{\"label\":\"Piloted\",\"price\":0}]',NULL,NULL,1,'2026-02-12 16:11:37.439','2026-02-12 16:11:37.439'),
(26,4,'Faction','faction','radio',NULL,'fixed',0.00,2,'[{\"label\":\"Alliance\",\"price\":0},{\"label\":\"Horde\",\"price\":0}]',NULL,NULL,1,'2026-02-12 16:12:49.473','2026-02-12 16:12:49.473'),
(27,4,'Select Desired Amount of Honor','Amount of Honor','range','single','percent',5.55,3,NULL,'{\"min\":4000,\"max\":48000,\"step\":1000,\"dual\":false}','{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 16:14:13.381','2026-02-12 17:28:11.985'),
(28,4,'TBC Additional Options','tbc-additional-options','checkbox',NULL,'fixed',0.00,4,'[{\"label\":\"Warsong Gulch Exalted\",\"price\":190.88},{\"label\":\"Alterac Valley Exalted\",\"price\":90.55},{\"label\":\"Arathi Basin Exalted\",\"price\":190.23}]',NULL,NULL,1,'2026-02-12 17:30:21.678','2026-02-12 17:30:21.678'),
(29,4,'Completion Speed','completion-speed','radio',NULL,'percent',0.00,5,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":50},{\"label\":\"Super Express\",\"price\":75}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 17:31:42.106','2026-02-12 17:31:42.106'),
(30,5,'Completion Method','completion-method','radio',NULL,'percent',0.00,1,'[{\"label\":\"Piloted\",\"price\":0},{\"label\":\"Selfplay\",\"price\":30}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 19:43:55.776','2026-02-12 19:45:28.599'),
(31,5,'Choose Faction','choose-faction','radio',NULL,'fixed',0.00,2,'[{\"label\":\"Alliance\",\"price\":0},{\"label\":\"Horde\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 19:46:24.373','2026-02-12 19:46:24.373'),
(32,5,'Additional Options','additional-options','checkbox',NULL,'fixed',0.00,3,'[{\"label\":\"Heroic Hellfire Citadel Attunement\",\"price\":28.33},{\"label\":\"Heroic Tempest Keep Attunement\",\"price\":28.33},{\"label\":\"Heroic Coilfang Reservior Attunement\",\"price\":28.33},{\"label\":\"Heroic Auchindoun Attunement\",\"price\":28.33},{\"label\":\"Heroic Caverns og Time Attunement\",\"price\":28.33}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 19:49:38.403','2026-02-28 18:59:48.258'),
(33,5,'Leveling Speed','leveling-speed','radio',NULL,'percent',0.00,4,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":50},{\"label\":\"Super Express\",\"price\":75}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-12 19:50:42.418','2026-02-12 19:50:42.418'),
(34,6,'Your Current and Desired Level','Level','range','dual','percent',0.00,1,NULL,'{\"min\":1,\"max\":90,\"step\":80,\"dual\":true,\"items\":[{\"min\":1,\"max\":90,\"price\":40},{\"min\":1,\"max\":80,\"price\":15},{\"min\":80,\"max\":90,\"price\":35.66},{\"min\":85,\"max\":90,\"price\":18.66},{\"min\":1,\"max\":10,\"price\":1.33},{\"min\":1,\"max\":20,\"price\":2.99},{\"min\":1,\"max\":30,\"price\":3.11},{\"min\":1,\"max\":40,\"price\":3.55},{\"min\":1,\"max\":50,\"price\":5.11},{\"min\":1,\"max\":60,\"price\":6.11},{\"min\":1,\"max\":70,\"price\":6.77}]}','{\"kind\":\"text\",\"required\":true}',1,'2026-02-13 18:16:49.973','2026-02-15 19:15:13.453'),
(35,6,'Choose number of characters','choose-number-of-characters','select',NULL,'percent',0.00,2,'[{\"label\":\"1 Character\",\"price\":0},{\"label\":\"4 Character\",\"price\":200},{\"label\":\"2 Character\",\"price\":100},{\"label\":\"6 Character\",\"price\":250},{\"label\":\"12 Character\",\"price\":500}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-15 19:18:31.490','2026-02-15 19:18:31.490'),
(36,6,'Choose Faction','choose-faction','radio',NULL,'fixed',0.00,3,'[{\"label\":\"Alliance\",\"price\":0},{\"label\":\"Horde\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-15 19:20:16.191','2026-02-15 19:20:16.191'),
(37,6,'Select Character class','select-character-class','select',NULL,'fixed',0.00,4,'[{\"label\":\"Warrior\",\"price\":0},{\"label\":\"Mage\",\"price\":0},{\"label\":\"Rogue\",\"price\":0},{\"label\":\"Shaman\",\"price\":0},{\"label\":\"Warlock\",\"price\":0},{\"label\":\"Paladin\",\"price\":0},{\"label\":\"Priest\",\"price\":0},{\"label\":\"Druid\",\"price\":0},{\"label\":\"Hunter\",\"price\":0},{\"label\":\"Death Knight\",\"price\":0},{\"label\":\"Demon Hunter\",\"price\":0},{\"label\":\"Evoker\",\"price\":0},{\"label\":\"Monk\",\"price\":0}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-15 19:22:59.635','2026-02-15 19:22:59.635'),
(38,6,'Midnight Additional Options','midnight-additional-options','checkbox',NULL,'fixed',0.00,5,'[{\"label\":\"Loremaster of Midnight\",\"price\":80},{\"label\":\"Midnight Pathfinder\",\"price\":81.22},{\"label\":\"Midnight Glyph Hunter\",\"price\":17.11},{\"label\":\"Midnight Flight Master\",\"price\":22.78},{\"label\":\"Haranir Unlock\",\"price\":85.66},{\"label\":\"Midnight Campaign\",\"price\":40.84}]',NULL,NULL,1,'2026-02-15 19:25:43.528','2026-02-15 19:25:43.528'),
(39,6,'Gearing','gearing','select',NULL,'fixed',0.00,6,'[{\"label\":\"Honor PvP Gear (276 iLvl)\",\"price\":35.55},{\"label\":\"Conquest PvP Gear (289 iLvl)\",\"price\":186.44}]',NULL,NULL,1,'2026-02-15 19:28:00.876','2026-02-15 19:28:00.876'),
(40,6,'Leveling Speed','leveling-speed','radio',NULL,'percent',0.00,7,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":50},{\"label\":\"Super Express\",\"price\":85}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-15 19:28:39.871','2026-02-15 19:28:39.871'),
(41,7,'Completion Method','completion-method','radio',NULL,'percent',0.00,1,'[{\"label\":\"Piloted\",\"price\":0},{\"label\":\"Selfplay\",\"price\":200}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-26 17:15:20.600','2026-02-26 17:15:20.600'),
(43,7,'Completion Speed','completion-speed','radio',NULL,'percent',0.00,3,'[{\"label\":\"Normal\",\"price\":0},{\"label\":\"Express\",\"price\":75},{\"label\":\"Super Express\",\"price\":85}]',NULL,'{\"kind\":\"text\",\"required\":true}',1,'2026-02-26 17:20:00.019','2026-02-26 17:20:00.019'),
(44,7,'TBC PvP Options','tbc-pvp-options','checkbox',NULL,'fixed',0.00,4,'[{\"label\":\"Honor Gear\",\"price\":200}]',NULL,NULL,1,'2026-02-26 17:20:33.551','2026-02-26 17:20:33.551'),
(45,7,'Current and Desired Rank','Current and Desired Rank','range','dual','fixed',0.00,2,NULL,'{\"min\":1500,\"max\":2200,\"step\":50,\"dual\":true,\"items\":[{\"min\":1500,\"max\":2200,\"price\":600.33},{\"min\":1500,\"max\":1550,\"price\":5},{\"min\":1500,\"max\":1600,\"price\":6},{\"min\":1500,\"max\":1650,\"price\":15},{\"min\":1500,\"max\":1700,\"price\":25.33},{\"min\":1500,\"max\":1800,\"price\":80.33},{\"min\":1500,\"max\":1900,\"price\":160.66},{\"min\":1500,\"max\":200,\"price\":260.66},{\"min\":1500,\"max\":2100,\"price\":420.44},{\"min\":200,\"max\":2200,\"price\":350.66},{\"min\":2100,\"max\":2200,\"price\":180.66},{\"min\":1700,\"max\":1900,\"price\":110.66}]}','{\"kind\":\"text\",\"required\":true}',1,'2026-02-28 18:35:42.421','2026-02-28 18:46:44.765');
/*!40000 ALTER TABLE `ServiceDetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  KEY `Session_userId_idx` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `role` enum('MEMBER','BOOSTER','ADMIN','SUPERADMIN') NOT NULL DEFAULT 'MEMBER',
  `isSuspended` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_createdAt_idx` (`createdAt`),
  KEY `User_role_idx` (`role`),
  KEY `User_isSuspended_idx` (`isSuspended`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
('G1699','Restu Ariadi','Gamingqu','q.allone@gmail.com',NULL,NULL,'$2b$10$ExwAsijeG54kHtET/J0sc.SNGTggVYNDWNtMsTjCly0z5xbz/7y6.','SUPERADMIN',0,'2026-02-04 12:06:17.804','2026-02-04 12:06:17.804'),
('G3200','Restu Ariadi','restu-ariadi','powerleveling2025@gmail.com','2026-02-17 05:58:57.425','https://lh3.googleusercontent.com/a/ACg8ocI3Fr6CvO7DzPQ5nQuFnLBGMinCz8RvJTnJNW_nyE_04TaJow=s96-c',NULL,'MEMBER',0,'2026-02-17 05:58:57.025','2026-02-17 05:58:57.510'),
('G6912','INOVASI DIGITAL ASIA','inovasi-digital-asia','pt.inovasidigitalasia@gmail.com','2026-02-19 08:37:18.918','https://lh3.googleusercontent.com/a/ACg8ocL2crCaHuq6T-5U9guExz5O97BR-m3uHT9ov6eNhApt10z5Gys=s96-c',NULL,'MEMBER',0,'2026-02-19 08:37:18.775','2026-02-19 08:37:18.942'),
('G8751','Cecep ilham Maulanappg','cecep-ilham-maulanappg','cecepilhammaulanappg@gmail.com','2026-03-01 11:25:34.439','https://lh3.googleusercontent.com/a/ACg8ocIfLHvCzMiQRcOkZSYq7mlUTGYfHUX_IDNnXkuhKrt4OPGyimU=s96-c',NULL,'ADMIN',0,'2026-03-01 11:25:34.341','2026-03-03 17:53:34.054'),
('G8792','Boostingqu','boostingqu','boostingqu@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocIeK10K3Z6WP3sKnlzmf-PzmIErPPdU5upfMM1e1f_ZfJcJZw=s96-c',NULL,'BOOSTER',0,'2026-02-04 18:14:27.632','2026-02-15 19:33:54.813'),
('G8830','Gamerhab','gamerhab','gamerhabv2@gmail.com','2026-05-27 07:56:50.576','https://lh3.googleusercontent.com/a/ACg8ocK2aIpVI6LGSLc6sm-pHAV-4WGhqoHH_3wNdrEO-i_lMC7J644=s96-c',NULL,'BOOSTER',0,'2026-05-27 07:56:50.424','2026-05-27 07:57:45.669'),
('G8965','hemant','hemant','hemant8502013@gmail.com',NULL,NULL,'$2b$10$9rv.z5x2B5ZcT4TBWSTAB.zn4CEl0PS.pNIpATRVzN.CDbo6NY6HG','SUPERADMIN',0,'2026-05-27 06:31:21.781','2026-05-27 06:31:21.781');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VerificationToken`
--

DROP TABLE IF EXISTS `VerificationToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  UNIQUE KEY `VerificationToken_token_key` (`token`),
  UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VerificationToken`
--

LOCK TABLES `VerificationToken` WRITE;
/*!40000 ALTER TABLE `VerificationToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `VerificationToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Wallet`
--

DROP TABLE IF EXISTS `Wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Wallet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(191) NOT NULL DEFAULT 'USD',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wallet_userId_key` (`userId`),
  KEY `Wallet_userId_idx` (`userId`),
  KEY `Wallet_isActive_idx` (`isActive`),
  CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wallet`
--

LOCK TABLES `Wallet` WRITE;
/*!40000 ALTER TABLE `Wallet` DISABLE KEYS */;
/*!40000 ALTER TABLE `Wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalletTransaction`
--

DROP TABLE IF EXISTS `WalletTransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WalletTransaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `walletId` int(11) NOT NULL,
  `type` enum('CREDIT','DEBIT') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `orderId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `WalletTransaction_walletId_createdAt_idx` (`walletId`,`createdAt`),
  KEY `WalletTransaction_orderId_idx` (`orderId`),
  CONSTRAINT `WalletTransaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `WalletTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalletTransaction`
--

LOCK TABLES `WalletTransaction` WRITE;
/*!40000 ALTER TABLE `WalletTransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `WalletTransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WebsiteSetting`
--

DROP TABLE IF EXISTS `WebsiteSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WebsiteSetting` (
  `id` varchar(191) NOT NULL DEFAULT 'singleton',
  `siteName` varchar(191) NOT NULL DEFAULT 'Gamingqu',
  `tagline` varchar(191) DEFAULT NULL,
  `logoUrl` varchar(191) DEFAULT NULL,
  `faviconUrl` varchar(191) DEFAULT NULL,
  `contactEmail` varchar(191) DEFAULT NULL,
  `contactPhone` varchar(191) DEFAULT NULL,
  `eurPerUsd` decimal(10,4) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `boosterSharePercent` decimal(10,4) DEFAULT NULL,
  `webSharePercent` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WebsiteSetting`
--

LOCK TABLES `WebsiteSetting` WRITE;
/*!40000 ALTER TABLE `WebsiteSetting` DISABLE KEYS */;
INSERT INTO `WebsiteSetting` VALUES
('singleton','Gamingqu','Leveling, Boosting & Winning - Take Your Game to the Next Level','/uploads/branding/site-logo-1770206910019.png','/uploads/branding/site-favicon-1770206910021.png','contact@gamingqu.com','+6281222054811',0.9500,'2026-02-04 12:08:30.032','2026-02-04 23:37:51.783',50.0000,50.0000);
/*!40000 ALTER TABLE `WebsiteSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gamingqu'
--

--
-- Dumping routines for database 'gamingqu'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27  8:18:09
