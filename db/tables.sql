CREATE TABLE `sfl_advertiser_campaigns` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(128) NOT NULL,
	`user` VARCHAR(40) NOT NULL,
	`status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
	`position` INT(10) NOT NULL,
	`budget_total` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`budget_daily` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`cpc` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`landing_page` TEXT NOT NULL,
	`date_added` INT(11) NOT NULL,
	`date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name_UNIQUE` (`name`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
