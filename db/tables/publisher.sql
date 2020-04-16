CREATE TABLE `sfl_publisher_targeting` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `sfl_publisher_campaign_id` INT(10) UNSIGNED NOT NULL,
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
    INDEX `sfl_publisher_campaign_id` (`sfl_publisher_campaign_id`),
    CONSTRAINT `FK_sfl_publisher_targeting_sfl_publisher_campaigns` FOREIGN KEY (`sfl_publisher_campaign_id`) REFERENCES `sfl_publisher_campaigns` (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `sfl_publisher_campaigns` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(128) NOT NULL,
	`user` VARCHAR(40) NOT NULL,
	`status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
	`position` INT(10) NOT NULL,
	`budget_total` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`budget_daily` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`cpc` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
	`date_added` INT(11) NOT NULL,
	`date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name_UNIQUE` (`name`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
