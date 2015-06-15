/* Version 2015.1.0.7 */
CREATE TABLE `gdes_ac`.`empresas`(  
  `empresaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`empresaId`)
);
ALTER TABLE `gdes_ac`.`trabajadores`   
  ADD COLUMN `empresaId` INT(11) NULL AFTER `idioma`,
  ADD CONSTRAINT `ref_empresa` FOREIGN KEY (`empresaId`) REFERENCES `gdes_ac`.`empresas`(`empresaId`);