SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `simulator` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `simulator` ;

-- -----------------------------------------------------
-- Table `simulator`.`product_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`product_type` (
  `id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `ingredients` VARCHAR(255) NOT NULL,
  `time_to_cold` TIME NOT NULL,
  `price` DOUBLE NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `creation_time` TIMESTAMP NOT NULL,
  `product_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_product_type_idx` (`product_type_id` ASC),
  CONSTRAINT `fk_product_product_type`
    FOREIGN KEY (`product_type_id`)
    REFERENCES `simulator`.`product_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`resource_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`resource_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `purchase_price` DOUBLE NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`resources`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`resources` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `durability` DATE NOT NULL,
  `amount` INT NOT NULL,
  `resource_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_resources_resource_type1_idx` (`resource_type_id` ASC),
  CONSTRAINT `fk_resources_resource_type1`
    FOREIGN KEY (`resource_type_id`)
    REFERENCES `simulator`.`resource_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`cash`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`cash` (
  `id` INT NOT NULL,
  `transfer` DOUBLE NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `simulator`.`human_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`human_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`human`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`human` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `gender` VARCHAR(45) NOT NULL,
  `human_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_human_human_type1_idx` (`human_type_id` ASC),
  CONSTRAINT `fk_human_human_type1`
    FOREIGN KEY (`human_type_id`)
    REFERENCES `simulator`.`human_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`room_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`room_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`room` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `size` VARCHAR(45) NOT NULL,
  `room_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_room_room_type1_idx` (`room_type_id` ASC),
  CONSTRAINT `fk_room_room_type1`
    FOREIGN KEY (`room_type_id`)
    REFERENCES `simulator`.`room_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`equipment_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`equipment_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`equipment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`equipment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `size` VARCHAR(45) NOT NULL,
  `equipment_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_equipment_equipment_type1_idx` (`equipment_type_id` ASC),
  CONSTRAINT `fk_equipment_equipment_type1`
    FOREIGN KEY (`equipment_type_id`)
    REFERENCES `simulator`.`equipment_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`room_has_equipment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`room_has_equipment` (
  `room_id` INT NOT NULL,
  `equipment_id` INT NOT NULL,
  PRIMARY KEY (`room_id`, `equipment_id`),
  INDEX `fk_room_has_equipment_equipment1_idx` (`equipment_id` ASC),
  CONSTRAINT `fk_room_has_equipment_room1`
    FOREIGN KEY (`room_id`)
    REFERENCES `simulator`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_room_has_equipment_equipment1`
    FOREIGN KEY (`equipment_id`)
    REFERENCES `simulator`.`equipment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
