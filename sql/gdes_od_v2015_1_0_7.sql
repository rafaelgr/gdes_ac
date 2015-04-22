/* Modificaciones en la tabla trabajadores  */
ALTER TABLE `gdes_od`.`trabajadores` ADD COLUMN `login` VARCHAR(255) NULL AFTER `dni`, ADD COLUMN `password` VARCHAR(255) NULL AFTER `login`, ADD COLUMN `evaluador` BOOL NULL AFTER `password`; 
/* Tabla que relaciona trabajadores con evaluadores*/
CREATE TABLE `gdes_od`.`evaluador_trabajador`( `evaluadorTrabajadorId` INT(11) NOT NULL AUTO_INCREMENT, `evaluadorId` INT(11), `trabajadorId` INT(11), PRIMARY KEY (`evaluadorTrabajadorId`) ); 
ALTER TABLE `gdes_od`.`evaluador_trabajador` CHANGE `evaluadorId` `evaluadorId` INT(11) NOT NULL, CHANGE `trabajadorId` `trabajadorId` INT(11) NOT NULL; 
ALTER TABLE `gdes_od`.`evaluador_trabajador` ADD UNIQUE INDEX `idx_evaluado_duplicado` (`evaluadorId`, `trabajadorId`); 
/* Claves referenciales */
ALTER TABLE `gdes_od`.`evaluador_trabajador` ADD CONSTRAINT `ref_evaluador` FOREIGN KEY (`evaluadorId`) REFERENCES `gdes_od`.`trabajadores`(`trabajadorId`), ADD CONSTRAINT `ref_trabajador_evaluado` FOREIGN KEY (`trabajadorId`) REFERENCES `gdes_od`.`trabajadores`(`trabajadorId`); 
/* Evitar duplicidad de objetivos */
ALTER TABLE `gdes_od`.`asg_objetivos` ADD UNIQUE INDEX `idx_asgobjetivos_duplicados` (`asgTrabajadorId`, `objetivoId`); 