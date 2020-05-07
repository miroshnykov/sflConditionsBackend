CREATE TABLE `sfl_traffic_history` (
	`sfl_advertiser_campaign_id` INT(10) UNSIGNED NOT NULL,
	`count_click` INT(10) UNSIGNED NOT NULL,
	`sum_spent` DECIMAL(16,8) UNSIGNED NOT NULL DEFAULT '0.00000000',
	`date_by_days` DATE NOT NULL,
	`date_updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	UNIQUE INDEX `uk_sfl_advertiser_campaign_id` (`sfl_advertiser_campaign_id`, `date_by_days`),
	INDEX `FK_sfl_sfl_traffic_history` (`sfl_advertiser_campaign_id`),
	CONSTRAINT `FK_sfl_sfl_traffic_history` FOREIGN KEY (`sfl_advertiser_campaign_id`) REFERENCES `sfl_advertiser_campaigns` (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
