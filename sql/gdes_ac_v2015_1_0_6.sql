/* Version 2015.1.0.5 */
CREATE TABLE `gdes_ac`.`servicios`(  
  `servicioId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`servicioId`)
);

CREATE TABLE `gdes_ac`.`habilidades`(  
  `habilidadId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `servicioId` INT(11),
  PRIMARY KEY (`habilidadId`),
  CONSTRAINT `ref_servicios` FOREIGN KEY (`servicioId`) REFERENCES `gdes_ac`.`servicios`(`servicioId`)
);
