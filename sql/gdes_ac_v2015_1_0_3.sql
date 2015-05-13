/* Montar la relación con el evaluador en la tabla de asignación de proyectos */
ALTER TABLE `gdes_ac`.`asg_proyectos`   
  ADD COLUMN `evaluadorId` INT(11) NULL AFTER `rolId`;
ALTER TABLE `gdes_ac`.`asg_proyectos`  
  ADD CONSTRAINT `ref_evaluador_proyecto` FOREIGN KEY (`evaluadorId`) REFERENCES `gdes_ac`.`trabajadores`(`trabajadorId`);