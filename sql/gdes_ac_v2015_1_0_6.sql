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
CREATE TABLE `gdes_ac`.`conocimientos_categorias`(  
  `conocimientoCategoriaId` INT(11) NOT NULL AUTO_INCREMENT,
  `conocimientoId` INT(11),
  `catConocimientoId` INT(11),
  PRIMARY KEY (`conocimientoCategoriaId`),
  CONSTRAINT `ref2_conocimientos` FOREIGN KEY (`conocimientoId`) REFERENCES `gdes_ac`.`conocimientos`(`conocimientoId`),
  CONSTRAINT `ref2_categorias` FOREIGN KEY (`catConocimientoId`) REFERENCES `gdes_ac`.`catconocimientos`(`catConocimientoId`)
);

CREATE TABLE `gdes_ac`.`conocimientos_habilidades`( 
	`conocimientoHabilidadId` INT(11) NOT NULL AUTO_INCREMENT, 
	`conocimientoId` INT(11), 
	`habilidadId` INT(11), 
	PRIMARY KEY (`conocimientoHabilidadId`), 
	CONSTRAINT `ref3_conocimiento` FOREIGN KEY (`conocimientoId`) REFERENCES `gdes_ac`.`conocimientos`(`conocimientoId`), 
	CONSTRAINT `ref3_habilidad` FOREIGN KEY (`habilidadId`) REFERENCES `gdes_ac`.`habilidades`(`habilidadId`) 
); 

/* Pasar las categorias a la nueva relacion*/
INSERT INTO conocimientos_categorias(conocimientoId, catConocimientoId)
SELECT conocimientoId, catConocimientoId
FROM conocimientos;

ALTER TABLE `gdes_ac`.`conocimientos`   
  DROP COLUMN `catConocimientoId`, 
  DROP INDEX `ref_cat_conocimiento`,
  DROP FOREIGN KEY `ref_cat_conocimiento`;