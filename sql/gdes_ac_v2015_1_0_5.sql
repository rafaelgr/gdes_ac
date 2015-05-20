/* Version 2015.1.0.5 */
/* incluir un campo para identificar el idioma que usa el trabajador */
ALTER TABLE `gdes_ac`.`trabajadores`   
  ADD COLUMN `idioma` VARCHAR(255) NULL AFTER `evaluador`;