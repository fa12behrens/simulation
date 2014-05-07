SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `simulator` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `simulator` ;

-- -----------------------------------------------------
-- Table `simulator`.`product_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`product_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
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
  `id` INT NOT NULL AUTO_INCREMENT,
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
-- Table `simulator`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_type_id` INT NOT NULL,
  `ordered` BIT,
  PRIMARY KEY (`id`),
 INDEX `fk_order_product_type_idx` (`product_type_id` ASC),
  CONSTRAINT `fk_order_product_type`
    FOREIGN KEY (`product_type_id`)
    REFERENCES `simulator`.`product_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `simulator`.`human_has_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`human_has_order` (
  `human_id` INT NOT NULL,
  `order_id` INT NOT NULL,
  PRIMARY KEY (`human_id`, `order_id`),
  INDEX `fk_human_has_order_human_idx` (`human_id` ASC),
  CONSTRAINT `fk_human_has_order_human1`
    FOREIGN KEY (`human_id`)
    REFERENCES `simulator`.`human` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_human_has_order_order1`
    FOREIGN KEY (`order_id`)
    REFERENCES `simulator`.`order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `simulator`.`human_has_product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulator`.`human_has_product` (
  `human_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`human_id`, `product_id`),
  INDEX `fk_human_has_product_human_idx` (`human_id` ASC),
  CONSTRAINT `fk_human_has_product_human1`
    FOREIGN KEY (`human_id`)
    REFERENCES `simulator`.`human` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_human_has_product_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `simulator`.`product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
