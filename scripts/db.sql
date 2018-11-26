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
    description text,
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
    description text,
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

#drop procedure create_course
delimiter &&
create procedure create_course(
	title varchar(255),
    description text,
    price float (10,2),
    author int unsigned,
    alias varchar(255)
)
begin
	insert into courses (title, description, price, author, alias, create_at, update_at)
    values (title, description, price, author, alias, curdate(), curdate());
    select 
		1 as success,
        "done" as message,
        last_insert_id() as id;
end &&
# drop procedure create_video;
# delimiter &&
create procedure create_video (
	course varchar(255),
    title varchar(255),
    description text,
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
		insert into videos (course_id, title, description, url, alias, create_at, update_at)
		values (course_id, title, description, url, alias, curdate(), curdate());
		select 
			1 as success,
			"done" as message,
			last_insert_id() as id;
	end if;
end &&

#drop procedure register_purchased_course;
delimiter &&
create procedure register_purchased_course(
	user int unsigned,
    course varchar(255)
)
begin
	declare exist int unsigned;
    declare course_id varchar(255);
    
    select courses.id into course_id from courses where courses.alias = course and courses.active = 1 limit 1;
    select purchased_courses.id into exist from purchased_courses where user_id = user and purchased_courses.course_id = course_id limit 1;
    
    if (course_id is null) then
		select
			0 as sucess,
            "This course doesn't exist." as message;
    elseif (exist is not null) then
		select 
			0 as success,
            "This user already had this course." as message;
    else
		insert into purchased_courses (user_id, course_id, create_at)
		values (user, course_id, curdate());
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

# drop procedure find_courses
/*
* Uso:
* search: Una expresion regular estilo POSIX. Para no restringir la búsqueda, dejar "search" como un string bacío.
* _start: cuantos registros saltar.
* _limit: Cuantos registros tomar.
* _asc: Ascendente [0|1].
*/
delimiter &&
create procedure find_courses(
	search text,
    _start int,
    _limit int,
    _asc bit
)
begin
	if ( _asc = 1 ) then
		select
			courses.title,
            courses.description,
			courses.price,
			courses.alias,
			courses.create_at,
			courses.update_at
		from courses
        where 
			courses.title regexp search and
			courses.active = 1
			order by courses.id asc
			limit _start, _limit;
	else
		select
			courses.title,
            courses.description,
			courses.price,
			courses.alias,
			courses.create_at,
			courses.update_at
		from courses
        where 
			courses.title regexp search and
            courses.active = 1
			order by courses.id desc
			limit _start, _limit;
	end if;
end &&

# drop procedure get_videos
delimiter &&
create procedure get_videos(
	course varchar(255),
    user int,
    _start int,
    _limit int
)
begin
	declare course_id int;
    declare auth int;
    declare auth2 int;
    
    select courses.id into course_id from courses where courses.alias = course limit 1;
    select admin_users.id into auth2 from admin_users where admin_users.id = user;
    select purchased_courses.id into auth 
		from purchased_courses 
			where purchased_courses.user_id = user and 
            purchased_courses.course_id = course_id and 
            purchased_courses.active = 1 limit 1;
    
    if ( (auth is not null) or (auth2 is not null) ) then
		select
			videos.alias,
			videos.title,
			videos.description,
			videos.url,
            videos.create_at,
            videos.update_at
            from videos
            order by videos.id desc
            limit _start, _limit;
	elseif course_id is null then
		select "This course doesn't exist." as message;
	else 
		select "You don't have authorization for this content." as message;
	end if;
end &&

# drop procedure get_video_data;
delimiter &&
create procedure get_video_data(
	video varchar(255),
    user int unsigned
)
begin 
	declare auth int unsigned;
    declare auth2 int unsigned;
    declare vid_exist int unsigned;
    
    select videos.id into vid_exist from videos where videos.alias = video;
    select admin_users.id into auth2 from admin_users where admin_users.id = user;
    select purchased_courses.id into auth
		from
			purchased_courses
            inner join courses 
					on purchased_courses.course_id = courses.id
			inner join videos
					on courses.id = videos.course_id
            where 
				purchased_courses.user_id = user and
				videos.alias = video limit 1;
    
    if (vid_exist is null) then
		select "This video doesn't exist." as message;
    elseif ( (auth is not null) or (auth2 is not null) ) then
		select 
			videos.title,
			videos.description,
			videos.url,
			videos.create_at,
			videos.update_at
			from videos 
			where 
				videos.alias = video and 
				videos.active = 1
			limit 1;
	else
		select "This user isn't authorized for this video." as message;
	end if;
end &&

# drop procedure get_purchased_courses;
delimiter &&
create procedure get_purchased_courses(
	user int unsigned,
    _start int,
    _limit int
)
begin
	select
		courses.title,
        courses.description,
        courses.alias,
        courses.create_at,
        courses.update_at
	from courses
		inner join purchased_courses
				on purchased_courses.course_id = courses.id
		where purchased_courses.user_id = user
        order by purchased_courses.id desc
        limit _start, _limit;
end &&

# drop procedure get_user_by_id;
delimiter &&
create procedure get_user_by_id(
	user int unsigned
)
begin 
	select
		users.firstname,
        users.lastname,
        users.username,
        users.email
        from users
			where users.id = user limit 1;
end &&

#drop database lth;