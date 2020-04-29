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
	`landing_page_valid` TINYINT(1) NOT NULL DEFAULT '0',
	`soft_delete` TINYINT(1) NOT NULL DEFAULT '0',
	`date_added` INT(11) NOT NULL,
	`date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name_UNIQUE` (`name`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `sfl_users` (
	`google_id` VARCHAR(40) NOT NULL,
	`email` VARCHAR(50) NOT NULL DEFAULT '0',
	`name` VARCHAR(40) NOT NULL,
	`given_name` VARCHAR(40) NOT NULL,
	`family_name` VARCHAR(40) NOT NULL,
	`picture` VARCHAR(256) NOT NULL,
	`link` VARCHAR(40) NOT NULL,
	`hd` VARCHAR(40) NOT NULL,
	UNIQUE INDEX `google_id` (`google_id`, `email`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `sfl_platform` (
	`id` INT(10) UNSIGNED NOT NULL,
	`name` VARCHAR(45) NOT NULL
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO `sfl_platform` (`id`, `name`) VALUES (1, 'android');
INSERT INTO `sfl_platform` (`id`, `name`) VALUES (2, 'windows');
INSERT INTO `sfl_platform` (`id`, `name`) VALUES (3, 'ios');


CREATE TABLE `sfl_source_type` (
	`id` INT(10) UNSIGNED NOT NULL,
	`name` VARCHAR(45) NOT NULL
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

INSERT INTO `sfl_source_type` (`id`, `name`) VALUES (1, 'sweepstakes');
INSERT INTO `sfl_source_type` (`id`, `name`) VALUES (2, 'VOD');

CREATE TABLE `sfl_advertiser_targeting` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`sfl_advertiser_campaign_id` INT(10) UNSIGNED NOT NULL,
	`position` INT(10) NOT NULL DEFAULT '0',
	`geo` VARCHAR(10) NOT NULL,
	`user` VARCHAR(45) NOT NULL,
	`platform_android` TINYINT(1) NOT NULL DEFAULT '0',
	`platform_ios` TINYINT(1) NOT NULL DEFAULT '0',
	`platform_windows` TINYINT(1) NOT NULL DEFAULT '0',
	`platform_linux` TINYINT(1) NOT NULL DEFAULT '0',
	`source_type_sweepstakes` TINYINT(1) NOT NULL DEFAULT '0',
	`source_type_vod` TINYINT(1) NOT NULL DEFAULT '0',
	`cpc` DECIMAL(16,8) NOT NULL,
	`filter_type_id` TINYINT(3) UNSIGNED NOT NULL,
	`soft_delete` TINYINT(1) NOT NULL DEFAULT '0',
	`date_added` INT(11) NOT NULL,
	`date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	INDEX `sfl_advertiser_campaign_id` (`sfl_advertiser_campaign_id`),
	CONSTRAINT `FK_sfl_advertiser_targeting_sfl_advertiser_campaigns` FOREIGN KEY (`sfl_advertiser_campaign_id`) REFERENCES `sfl_advertiser_campaigns` (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
