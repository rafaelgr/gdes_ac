/*
SQLyog Community v12.18 (64 bit)
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `administradores` */

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (1,'AdministradorGH','admin','','admin@g.com');

/*Table structure for table `asg_proyectos` */

DROP TABLE IF EXISTS `asg_proyectos`;

CREATE TABLE `asg_proyectos` (
  `asgProyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `proyectoId` int(11) DEFAULT NULL,
  `trabajadorId` int(11) DEFAULT NULL,
  `rolId` int(11) DEFAULT NULL,
  `evaluadorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`asgProyectoId`),
  KEY `ref_proyecto` (`proyectoId`),
  KEY `ref_trabajador` (`trabajadorId`),
  KEY `ref_rol` (`rolId`),
  KEY `ref_evaluador_proyecto` (`evaluadorId`),
  CONSTRAINT `ref_evaluador_proyecto` FOREIGN KEY (`evaluadorId`) REFERENCES `trabajadores` (`trabajadorId`),
  CONSTRAINT `ref_proyecto` FOREIGN KEY (`proyectoId`) REFERENCES `proyectos` (`proyectoId`),
  CONSTRAINT `ref_rol` FOREIGN KEY (`rolId`) REFERENCES `roles` (`rolId`),
  CONSTRAINT `ref_trabajador` FOREIGN KEY (`trabajadorId`) REFERENCES `trabajadores` (`trabajadorId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `asg_proyectos` */

insert  into `asg_proyectos`(`asgProyectoId`,`nombre`,`proyectoId`,`trabajadorId`,`rolId`,`evaluadorId`) values (6,'Maria Esquery [Desmantelamiento Planta 3425]',6,5,1,5);
insert  into `asg_proyectos`(`asgProyectoId`,`nombre`,`proyectoId`,`trabajadorId`,`rolId`,`evaluadorId`) values (7,'Pedro LaGuardia [Desmantelamiento Planta 3425]',6,6,3,5);
insert  into `asg_proyectos`(`asgProyectoId`,`nombre`,`proyectoId`,`trabajadorId`,`rolId`,`evaluadorId`) values (8,'Juan Martin [Central 21]',7,7,2,5);
insert  into `asg_proyectos`(`asgProyectoId`,`nombre`,`proyectoId`,`trabajadorId`,`rolId`,`evaluadorId`) values (9,'Fernando Condren [Central 21]',7,8,4,5);
insert  into `asg_proyectos`(`asgProyectoId`,`nombre`,`proyectoId`,`trabajadorId`,`rolId`,`evaluadorId`) values (10,'Fernando Condren [Central 21]',7,8,1,5);

/*Table structure for table `catconocimientos` */

DROP TABLE IF EXISTS `catconocimientos`;

CREATE TABLE `catconocimientos` (
  `catConocimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`catConocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `catconocimientos` */

insert  into `catconocimientos`(`catConocimientoId`,`nombre`) values (7,'Trabajos Aluminio');
insert  into `catconocimientos`(`catConocimientoId`,`nombre`) values (8,'Trabajos Radiológicos');
insert  into `catconocimientos`(`catConocimientoId`,`nombre`) values (9,'Trabajos peligrosos');

/*Table structure for table `conocimientos` */

DROP TABLE IF EXISTS `conocimientos`;

CREATE TABLE `conocimientos` (
  `conocimientoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`conocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `conocimientos` */

insert  into `conocimientos`(`conocimientoId`,`nombre`) values (3,'Soldadura Tipo 1');
insert  into `conocimientos`(`conocimientoId`,`nombre`) values (4,'Valoración de exposición');
insert  into `conocimientos`(`conocimientoId`,`nombre`) values (5,'Ensamblado estructural');
insert  into `conocimientos`(`conocimientoId`,`nombre`) values (10,'Nuevo 2 categorias');

/*Table structure for table `conocimientos_categorias` */

DROP TABLE IF EXISTS `conocimientos_categorias`;

CREATE TABLE `conocimientos_categorias` (
  `conocimientoCategoriaId` int(11) NOT NULL AUTO_INCREMENT,
  `conocimientoId` int(11) DEFAULT NULL,
  `catConocimientoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`conocimientoCategoriaId`),
  KEY `ref2_conocimientos` (`conocimientoId`),
  KEY `ref2_categorias` (`catConocimientoId`),
  CONSTRAINT `ref2_categorias` FOREIGN KEY (`catConocimientoId`) REFERENCES `catconocimientos` (`catConocimientoId`),
  CONSTRAINT `ref2_conocimientos` FOREIGN KEY (`conocimientoId`) REFERENCES `conocimientos` (`conocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

/*Data for the table `conocimientos_categorias` */

insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (11,3,7);
insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (12,4,7);
insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (13,4,8);
insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (32,5,8);
insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (33,5,9);
insert  into `conocimientos_categorias`(`conocimientoCategoriaId`,`conocimientoId`,`catConocimientoId`) values (34,10,7);

/*Table structure for table `conocimientos_habilidades` */

DROP TABLE IF EXISTS `conocimientos_habilidades`;

CREATE TABLE `conocimientos_habilidades` (
  `conocimientoHabilidadId` int(11) NOT NULL AUTO_INCREMENT,
  `conocimientoId` int(11) DEFAULT NULL,
  `habilidadId` int(11) DEFAULT NULL,
  PRIMARY KEY (`conocimientoHabilidadId`),
  KEY `ref3_conocimiento` (`conocimientoId`),
  KEY `ref3_habilidad` (`habilidadId`),
  CONSTRAINT `ref3_conocimiento` FOREIGN KEY (`conocimientoId`) REFERENCES `conocimientos` (`conocimientoId`),
  CONSTRAINT `ref3_habilidad` FOREIGN KEY (`habilidadId`) REFERENCES `habilidades` (`habilidadId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `conocimientos_habilidades` */

insert  into `conocimientos_habilidades`(`conocimientoHabilidadId`,`conocimientoId`,`habilidadId`) values (3,5,1);
insert  into `conocimientos_habilidades`(`conocimientoHabilidadId`,`conocimientoId`,`habilidadId`) values (4,5,2);

/*Table structure for table `empresas` */

DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
  `empresaId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `empresas` */

insert  into `empresas`(`empresaId`,`nombre`) values (1,'LAI');
insert  into `empresas`(`empresaId`,`nombre`) values (2,'FALCK');

/*Table structure for table `evaluaciones` */

DROP TABLE IF EXISTS `evaluaciones`;

CREATE TABLE `evaluaciones` (
  `evaluacionId` int(11) NOT NULL AUTO_INCREMENT,
  `asgProyectoId` int(11) DEFAULT NULL,
  `conocimientoId` int(11) DEFAULT NULL,
  `dFecha` datetime DEFAULT NULL,
  `hFecha` datetime DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`evaluacionId`),
  KEY `ref_asg_proyectos` (`asgProyectoId`),
  KEY `ref_conocimientos` (`conocimientoId`),
  CONSTRAINT `ref_asg_proyectos` FOREIGN KEY (`asgProyectoId`) REFERENCES `asg_proyectos` (`asgProyectoId`),
  CONSTRAINT `ref_conocimientos` FOREIGN KEY (`conocimientoId`) REFERENCES `conocimientos` (`conocimientoId`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

/*Data for the table `evaluaciones` */

insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (12,7,3,'2015-01-01 00:00:00','2015-12-31 00:00:00','Estos son los comentarios de este tipo');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (17,10,5,'2015-02-01 00:00:00','2015-06-01 00:00:00','Esta es una observacion  especial');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (18,10,4,'2015-02-01 00:00:00','2015-06-01 00:00:00','Esta es una observacion  especial de exposición');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (19,7,5,'2015-01-01 00:00:00','2015-06-13 00:00:00','Tiene una fecha nula (ya no la tiene) ss');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (20,6,4,'2015-01-01 00:00:00','2015-12-31 00:00:00',NULL);
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (21,7,4,'2015-01-01 00:00:00','2015-12-31 00:00:00','Es para comprobar la ruptura en dos categorias');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (22,6,3,'2015-01-04 00:00:00','2015-12-31 00:00:00','Esta es una que me gusta');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (23,9,4,'2015-02-01 00:00:00',NULL,NULL);
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (24,9,5,'2015-02-01 00:00:00','2015-04-10 00:00:00','Estas son algunas');
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (34,8,5,'2015-02-01 00:00:00',NULL,NULL);
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (35,8,4,'2015-02-01 00:00:00',NULL,NULL);
insert  into `evaluaciones`(`evaluacionId`,`asgProyectoId`,`conocimientoId`,`dFecha`,`hFecha`,`observaciones`) values (37,6,5,'2015-01-04 00:00:00','2015-12-31 00:00:00','Este es un commentario');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `evaluador_trabajador` */

/*Table structure for table `habilidades` */

DROP TABLE IF EXISTS `habilidades`;

CREATE TABLE `habilidades` (
  `habilidadId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `servicioId` int(11) DEFAULT NULL,
  PRIMARY KEY (`habilidadId`),
  KEY `ref_servicios` (`servicioId`),
  CONSTRAINT `ref_servicios` FOREIGN KEY (`servicioId`) REFERENCES `servicios` (`servicioId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `habilidades` */

insert  into `habilidades`(`habilidadId`,`nombre`,`servicioId`) values (1,'Preparador de techos2',2);
insert  into `habilidades`(`habilidadId`,`nombre`,`servicioId`) values (2,'Habilidad para S2',3);

/*Table structure for table `proyectos` */

DROP TABLE IF EXISTS `proyectos`;

CREATE TABLE `proyectos` (
  `proyectoId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `fechaInicio` datetime DEFAULT NULL,
  `fechaFinal` datetime DEFAULT NULL,
  PRIMARY KEY (`proyectoId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `proyectos` */

insert  into `proyectos`(`proyectoId`,`nombre`,`fechaInicio`,`fechaFinal`) values (6,'Desmantelamiento Planta 3425','2015-01-01 00:00:00','2015-12-31 00:00:00');
insert  into `proyectos`(`proyectoId`,`nombre`,`fechaInicio`,`fechaFinal`) values (7,'Central 21','2015-02-01 00:00:00',NULL);
insert  into `proyectos`(`proyectoId`,`nombre`,`fechaInicio`,`fechaFinal`) values (8,'Arranque Reactor 67','2016-10-15 00:00:00',NULL);

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

/*Table structure for table `servicios` */

DROP TABLE IF EXISTS `servicios`;

CREATE TABLE `servicios` (
  `servicioId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`servicioId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `servicios` */

insert  into `servicios`(`servicioId`,`nombre`) values (2,'Servicio 1');
insert  into `servicios`(`servicioId`,`nombre`) values (3,'Servicios 2');

/*Table structure for table `trabajadores` */

DROP TABLE IF EXISTS `trabajadores`;

CREATE TABLE `trabajadores` (
  `trabajadorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `evaluador` tinyint(1) DEFAULT NULL,
  `idioma` varchar(255) DEFAULT NULL,
  `empresaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`trabajadorId`),
  KEY `ref_empresa` (`empresaId`),
  CONSTRAINT `ref_empresa` FOREIGN KEY (`empresaId`) REFERENCES `empresas` (`empresaId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `trabajadores` */

insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (5,'Maria Esquery','2535788996','S-1-5-21-3077458779-297755452-906557366-1001','maria',1,'en',1);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (6,'Pedro LaGuardia','124558788','pedro','pedro',NULL,'es',2);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (7,'Juan Martin','45578787','juan','juan',NULL,'en',1);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (8,'Fernando Condren 2','2547885','fernando','fernando',1,NULL,2);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (9,'Juan Pansde','14522',NULL,NULL,NULL,NULL,NULL);
insert  into `trabajadores`(`trabajadorId`,`nombre`,`dni`,`login`,`password`,`evaluador`,`idioma`,`empresaId`) values (10,'Sheldon Cooper','24658789','cooper','cooper',NULL,'es',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
