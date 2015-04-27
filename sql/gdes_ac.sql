/*
SQLyog Community v12.09 (64 bit)
MySQL - 5.6.16 : Database - gdes_ac
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `gdes_ac`;

/*Table structure for table `administradores` */

DROP TABLE IF EXISTS `administradores`;

CREATE TABLE `administradores` (
  `administradorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`administradorId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `administradores` */

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (1,'AdministradorGH','admin','','admin@g.com');

/*Table structure for table `catconocimientos` */

DROP TABLE IF EXISTS `catconocimientos`;

CREATE TABLE `catconocimientos` (
  `catConocimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`catConocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `catconocimientos` */

insert  into `catconocimientos`(`catConocimientoId`,`nombre`) values (7,'Trabajos Aluminio');
insert  into `catconocimientos`(`catConocimientoId`,`nombre`) values (8,'Trabajos Radiológicos');

/*Table structure for table `conocimientos` */

DROP TABLE IF EXISTS `conocimientos`;

CREATE TABLE `conocimientos` (
  `conocimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `catConocimientoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`conocimientoId`),
  KEY `ref_cat_conocimiento` (`catConocimientoId`),
  CONSTRAINT `ref_cat_conocimiento` FOREIGN KEY (`catConocimientoId`) REFERENCES `catconocimientos` (`catConocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `conocimientos` */

insert  into `conocimientos`(`conocimientoId`,`nombre`,`catConocimientoId`) values (3,'Soldadura Tipo 1',7);
insert  into `conocimientos`(`conocimientoId`,`nombre`,`catConocimientoId`) values (4,'Valoración de exposición',8);
insert  into `conocimientos`(`conocimientoId`,`nombre`,`catConocimientoId`) values (5,'Ensamblado estructural',7);

/*Table structure for table `evaluador_trabajador` */

DROP TABLE IF EXISTS `evaluador_trabajador`;

CREATE TABLE `evaluador_trabajador` (
  `evaluadorTrabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `evaluadorId` int(11) NOT NULL,
  `trabajadorId` int(11) NOT NULL,
  PRIMARY KEY (`evaluadorTrabajadorId`),
  UNIQUE KEY `idx_evaluado_duplicado` (`evaluadorId`,`trabajadorId`),
  KEY `ref_trabajador_evaluado` (`trabajadorId`),
  CONSTRAINT `ref_evaluador` FOREIGN KEY (`evaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_trabajador_evaluado` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `evaluador_trabajador` */

/*Table structure for table `proyectos` */

DROP TABLE IF EXISTS `proyectos`;

CREATE TABLE `proyectos` (
  `proyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `fechaFinal` datetime DEFAULT NULL,
  PRIMARY KEY (`proyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `proyectos` */

insert  into `proyectos`(`proyectoId`,`nombre`,`fechaInicio`,`fechaFinal`) values (6,'Desmantelamiento Planta 3425','2015-01-01 00:00:00','2015-12-31 00:00:00');

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `rolId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rolId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `roles` */

insert  into `roles`(`rolId`,`nombre`) values (1,'Jefe de proyecto');
insert  into `roles`(`rolId`,`nombre`) values (2,'Personal asignado');
insert  into `roles`(`rolId`,`nombre`) values (3,'Personal temporal');
insert  into `roles`(`rolId`,`nombre`) values (4,'Becario');

/*Table structure for table `trabajadores` */

DROP TABLE IF EXISTS `trabajadores`;

CREATE TABLE `trabajadores` (
  `trabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `evaluador` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `trabajadores` */

insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`) values (5,'Maria Esquery','2535788996','maria','maria',1);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`) values (6,'Pedro LaGuardia','124558788','pedro','pedro',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
