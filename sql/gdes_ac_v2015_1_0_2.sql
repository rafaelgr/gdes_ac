/* Creación de la tabla de relaciones proyecto - trabajador*/
CREATE TABLE `gdes_ac`.`asg_proyecto`( `asgProyectoId` INT(11) NOT NULL AUTO_INCREMENT, `nombre` VARCHAR(255), `proyectoId` INT(11), `trabajadorId` INT(11), PRIMARY KEY (`asgProyectoId`) ); 
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD CONSTRAINT `ref_proyecto` FOREIGN KEY (`proyectoId`) REFERENCES `gdes_ac`.`proyectos`(`proyectoId`), ADD CONSTRAINT `ref_trabajador` FOREIGN KEY (`trabajadorId`) REFERENCES `gdes_ac`.`trabajadores`(`trabajadorId`); 
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD COLUMN `rolId` INT(11) NULL AFTER `trabajadorId`;
ALTER TABLE `gdes_ac`.`asg_proyecto` ADD CONSTRAINT `ref_rol` FOREIGN KEY (`rolId`) REFERENCES `gdes_ac`.`roles`(`rolId`);