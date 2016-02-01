/* Version 2016.1.0.1 */
ALTER TABLE `gdes_ac`.`proyectos`   
  ADD COLUMN `ocultar` TINYINT(1) NULL AFTER `fechaFinal`;
UPDATE proyectos SET ocultar = 0;
ALTER TABLE `gdes_ac`.`proyectos`   
  ADD COLUMN `empresaId` INT(11) NULL AFTER `ocultar`,
  ADD CONSTRAINT `fx_empresa` FOREIGN KEY (`empresaId`) REFERENCES `gdes_ac`.`empresas`(`empresaId`);  
ALTER TABLE `gdes_ac`.`proyectos`   
  ADD COLUMN `proyectoAx` VARCHAR(255) NULL AFTER `empresaId`;  
ALTER TABLE `gdes_ac`.`proyectos`   
  ADD COLUMN `clienteAx` VARCHAR(255) NULL AFTER `proyectoAx`;
ALTER TABLE `gdes_ac`.`trabajadores` 
  ADD COLUMN `empleadoAx` VARCHAR(255) NULL AFTER `empresaId`;
ALTER TABLE `gdes_ac`.`trabajadores`   
  ADD COLUMN `estado` INT(11) DEFAULT 0  NULL AFTER `empleadoAx`;      
ALTER TABLE `gdes_ac`.`asg_proyectos`   
  ADD COLUMN `fechaInicio` DATETIME NULL AFTER `evaluadorId`,
  ADD COLUMN `fechaFinal` DATETIME NULL AFTER `fechaInicio`;
ALTER TABLE `gdes_ac`.`asg_proyectos`   
  ADD COLUMN `descripcion` VARCHAR(255) NULL AFTER `fechaFinal`;
    