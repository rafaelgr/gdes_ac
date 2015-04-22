/* Posibles propietarios de objetivos ()*/
ALTER TABLE `gdes_od`.`objetivos` ADD COLUMN `trabajadorId` INT(11) NULL AFTER `tipoId`; 
ALTER TABLE `gdes_od`.`objetivos` CHANGE `trabajadorId` `evaluadorId` INT(11) NULL; 
ALTER TABLE `gdes_od`.`objetivos` ADD CONSTRAINT `ref_evaluadores` FOREIGN KEY (`evaluadorId`) REFERENCES `gdes_od`.`trabajadores`(`trabajadorId`); 