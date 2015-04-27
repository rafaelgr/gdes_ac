/*
SQLyog Community v12.09 (64 bit)
MySQL - 5.6.16 : Database - gdes_od
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `gdes_ac`;

/*Table structure for table `evaluador_trabajador` */

DROP TABLE IF EXISTS `evaluador_trabajador`;

CREATE TABLE `evaluador_trabajador` (
  `evaluadorTrabajadorId` INT(11) NOT NULL AUTO_INCREMENT,
  `evaluadorId` INT(11) NOT NULL,
  `trabajadorId` INT(11) NOT NULL,
  PRIMARY KEY (`evaluadorTrabajadorId`),
  UNIQUE KEY `idx_evaluado_duplicado` (`evaluadorId`,`trabajadorId`),
  KEY `ref_trabajador_evaluado` (`trabajadorId`),
  CONSTRAINT `ref_evaluador` FOREIGN KEY (`evaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_trabajador_evaluado` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
