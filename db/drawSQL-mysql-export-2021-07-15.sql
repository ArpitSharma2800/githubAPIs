CREATE TABLE `completed`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `query` VARCHAR(255) NOT NULL,
    `cursor` VARCHAR(255) NOT NULL,
    `lastPage` ENUM('true', 'false') NOT NULL,
    `limitremaining` INT NOT NULL,
    `nodeCount` INT NOT NULL
);
CREATE TABLE `uncompleted`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `query` VARCHAR(255) NOT NULL
);