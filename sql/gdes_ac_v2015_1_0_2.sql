/* Creación de la tabla de relaciones proyecto - trabajador*/
CREATE TABLE `gdes_ac`.`asg_proyecto`( `asgProyectoId` INT(11) NOT NULL AUTO_INCREMENT, `nombre` VARCHAR(255), `proyectoId` INT(11), `trabajadorId` INT(11), PRIMARY KEY (`asgProyectoId`) ); 
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD CONSTRAINT `ref_proyecto` FOREIGN KEY (`proyectoId`) REFERENCES `gdes_ac`.`proyectos`(`proyectoId`), ADD CONSTRAINT `ref_trabajador` FOREIGN KEY (`trabajadorId`) REFERENCES `gdes_ac`.`trabajadores`(`trabajadorId`); 
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD COLUMN `rolId` INT(11) NULL AFTER `trabajadorId`;
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD CONSTRAINT `ref_rol` FOREIGN KEY (`rolId`) REFERENCES `gdes_ac`.`roles`(`rolId`);
RENAME TABLE `gdes_ac`.`asg_proyecto` TO `gdes_ac`.`asg_proyectos`;

/* Tabla de evaluaciones */
CREATE TABLE `gdes_ac`.`evaluaciones`(  
  `evaluacionId` INT(11) NOT NULL AUTO_INCREMENT,
  `asgProyectoId` INT(11),
  `conocimientoId` INT(11),
  `dFecha` DATETIME,
  `hFecha` DATETIME,
  `observaciones` TEXT,
  PRIMARY KEY (`evaluacionId`)
);

ALTER TABLE `gdes_ac`.`evaluaciones`  
  ADD CONSTRAINT `ref_asg_proyectos` FOREIGN KEY (`asgProyectoId`) REFERENCES `gdes_ac`.`asg_proyectos`(`asgProyectoId`),
  ADD CONSTRAINT `ref_conocimientos` FOREIGN KEY (`conocimientoId`) REFERENCES `gdes_ac`.`conocimientos`(`conocimientoId`);