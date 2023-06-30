CREATE TABLE ReviewServiceDB.Reviews (
    Id char(36) PRIMARY KEY,
    ReviewMessage VARCHAR(2000) NOT NULL,
    Rating float NOT NULL,
    Date datetime NOT NULL, 
    UserEmail varchar(100) NOT NULL,
    UserName varchar(100) NOT NULL,
    Isbn varchar(100) NOT NULL,
    OrganizationName varchar(100) NOT NULL
);