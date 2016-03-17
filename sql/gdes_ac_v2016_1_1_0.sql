/* Version 2016.1.1.0 */
CREATE TABLE `gdes_ac`.`areas`(  
  `areaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`areaId`)
);
CREATE TABLE `gdes_ac`.`conocimientos_areas`(  
  `conocimientoAreaId` INT(11) NOT NULL AUTO_INCREMENT,
  `conocimientoId` INT(11),
  `areaId` INT(11),
  PRIMARY KEY (`conocimientoAreaId`),
  CONSTRAINT `ref_areas` FOREIGN KEY (`areaId`) REFERENCES `gdes_ac`.`areas`(`areaId`),
  CONSTRAINT `ref_conocimiento_areas` FOREIGN KEY (`conocimientoId`) REFERENCES `gdes_ac`.`conocimientos`(`conocimientoId`)
);
    