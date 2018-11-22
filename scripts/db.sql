create database lth;

use lth;

create table users (
	id int unsigned primary key auto_increment unique,
	username varchar(255) not null unique,
	firstname varchar(255) not null,
	lastname varchar(255) not null,
	email varchar(255) not null unique,
	password varchar(255) not null,
    active bit default 1 not null,
    create_at date,
    update_at date
);

create table admin_users (
	id int unsigned primary key auto_increment unique,
	firstname varchar(255) not null,
	lastname varchar(255) not null,
	email varchar(255) not null unique,
	password varchar(255) not null,
    active bit default 1 not null,
    create_at date,
    update_at date
);

create table courses (
	id int unsigned primary key auto_increment unique,
    title varchar(255) not null,
    price float(10,2) not null default 0,
    author int unsigned not null,
    active bit default 1 not null,
    alias varchar(255) not null unique,
    create_at date,
    update_at date,
    
    foreign key (author) references admin_users(id)
);

create table videos (
	id int unsigned primary key auto_increment unique,
    course_id int unsigned not null,
    title varchar(255) not null,
    url varchar(255) not null,
    active bit default 1 not null,
    alias varchar(255) not null unique,
    create_at date,
    update_at date,
    
    foreign key (course_id) references courses(id)
);

create table purchased_courses(
	id int unsigned primary key auto_increment unique,
    user_id  int unsigned not null,
    course_id int unsigned not null,
    create_at date,
    active bit default 1 not null,
    
    foreign key (user_id) references admin_users(id),
    foreign key (course_id) references courses(id)
);

create table problems (
	id int unsigned primary key auto_increment unique,
    author int unsigned not null,
    title varchar(255) not null,
    dir varchar(255) not null,
    active bit default 1 not null,
    alias varchar(255) not null unique,
    create_at date,
    update_at date,
    
    foreign key (author) references admin_users(id)
);

create table tried_problems (
	id int unsigned primary key auto_increment unique,
    user_id int unsigned not null,
    problem_id int unsigned not null,
    percent float (5,2) not null,
    code_url varchar(255) not null,
    create_at date,
    
    foreign key (user_id) references users(id),
    foreign key (problem_id) references problems(id)
);

#Stored Procedures.
delimiter &&
create procedure create_user(
	username varchar(255),
	firstname varchar(255),
	lastname varchar(255),
	email varchar(255),
	password varchar(255)
)
begin
	declare un varchar(255);
    declare em varchar(255);
    
    select users.username into un from users where users.username = username;
    select users.email into em from users where users.email = email;
    
    if (un is not null ) then
		select
			0 as success,
			"Username already in use." as message;
	elseif (em is not null) then
		select
			0 as success,
            "E-Mail already in use." as message;
	else
	
		insert into users (username, firstname, lastname, email, password, create_at, update_at)
		values (username, firstname, lastname, email, password, curdate(), curdate());
        
        select 
			1 as success,
			"Done." as message,
            last_insert_id() as id;
	end if;
end &&
#delimiter &&
create procedure create_admin_user(
	firstname varchar(255),
	lastname varchar(255),
	email varchar(255),
	password varchar(255)
)
begin
    declare em varchar(255);
    
    select admin_users.email into em from admin_users where admin_users.email = email;
    
	if (em is not null) then
		select
			0 as success,
            "E-Mail already in use." as message;
	else
		insert into admin_users (firstname, lastname, email, password, create_at, update_at)
		values (firstname, lastname, email, password, curdate(), curdate());
        
        select 
			1 as success,
			"Done." as message,
            last_insert_id() as id;
	end if;
end &&

create procedure create_course(
	title varchar(255),
    price float (10,2),
    author int unsigned,
    alias varchar(255)
)
begin
	insert into courses (title, price, author, alias, create_at, update_at)
    values (title, price, author, alias, curdate(), curdate());
    select 
		1 as success,
        "done" as message,
        last_insert_id() as id;
end &&
# delimiter &&
create procedure create_video (
	course varchar(255),
    title varchar(255),
    url varchar(255),
    alias varchar(255)
)
begin 
	declare course_id int unsigned;
    select courses.id into course_id from courses where courses.alias = course;
    
    if (course_id is null) then
		select
			0 as success,
			"Course missing" as message;
	else    
		insert into videos (course_id, title, url, alias, create_at, update_at)
		values (course_id, title, url, alias, curdate(), curdate());
		select 
			1 as success,
			"done" as message,
			last_insert_id() as id;
	end if;
end &&

create procedure register_purchased_course(
	user int unsigned,
    course int unsigned
)
begin
	declare exist int unsigned;
    select id into exist from purchased_course where user_id = user and course_id = course;
    
    if (exist is not null) then
		select 
			0 as success,
            "This user already had this course." as message;
    else
		insert into purchased_course (user_id, course_id, create_at, update_at)
		values (user, course, curdate(), curdate());
		select 
			1 as success,
			"done" as message,
            last_insert_id() as id;
	end if;
end &&

create procedure create_problem (
	author int unsigned,
    title varchar(255),
    dir varchar(255),
    alias varchar(255)
)
begin
	insert into problems (author, title, dir, alias, create_at, update_at)
    values (author, title, dir, alias, curdate(), curdate());
    select 
		1 as success,
        "done" as message,
        last_insert_id() as id;
end &&

create procedure register_tried_problem (
	user int unsigned,
    problem int unsigned,
    percent float(5, 2)
)
begin
	insert into tried_problems (user_id, problem_id, percent, create_at)
    values (user_id, problem_id, percent, curdate());
    select 
		1 as success,
        "done" as message,
        last_insert_id() as id;
end &&
#drop database lth;