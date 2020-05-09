-- roles
INSERT INTO roles(id, name) VALUES (1, 'ADMIN');
INSERT INTO roles(id, name) VALUES (2, 'USER');
INSERT INTO roles(id, name) VALUES (3, 'COOK');
INSERT INTO roles(id, name) VALUES (4, 'PACKAGER');
INSERT INTO roles(id, name) VALUES (5, 'DRIVER');

--admin
INSERT INTO users(id, city, post_code, street, email, password, username) 
  VALUES (1, 'Libiąż', '32-590', '1 Stycznia 8/2', 'grzesiek@fake.mail@.com', 
  '$2a$10$Hi5z3gUdrG8IzcbZnagqMeZgcTQ87nc8zxGsbWqo4/e1SPgMOMs46', 'grzesiek');

-- assign admin and user roles to admin user
INSERT INTO user_roles(user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles(user_id, role_id) VALUES (1, 2);

-- kurczakburger
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (1, current_timestamp, current_timestamp, 'Maka.png', 'Mąka');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (2, current_timestamp, current_timestamp, 'Kurczak.png', 'Kurczak');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (3, current_timestamp, current_timestamp, 'Sos paprykowo-pomidorowy.png', 'Sos paprykowo-pomidorowy');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (4, current_timestamp, current_timestamp, 'Salata krojona.png', 'Sałata krojona');

INSERT INTO meals(id, created_at, updated_at, category, description, image_name, name, price)
	VALUES (1, current_timestamp, current_timestamp, 'BURGERS', 
  'Niepowtarzalny sos paprykowo-pomidorowy, panierowane mięso z kurczaka i krojona sałata... Czy masz już na niego ochotę?', 
  'Kurczakburger.png', 'Kurczakburger', 5);

INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (1, 1);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (1, 2);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (1, 3);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (1, 4);

-- cheeseburger
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (5, current_timestamp, current_timestamp, 'Wolowina.png', 'Wołowina');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (6, current_timestamp, current_timestamp, 'Ser cheddar topiony.png', 'Ser cheddar topiony');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (7, current_timestamp, current_timestamp, 'Ketchup.png', 'Ketchup');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (8, current_timestamp, current_timestamp, 'Pikle.png', 'Pikle');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (9, current_timestamp, current_timestamp, 'Cebula suszona.png', 'Cebula suszona');
INSERT INTO ingredients(id, created_at, updated_at, image_name, name) 
  VALUES (10, current_timestamp, current_timestamp, 'Musztarda.png', 'Musztarda');

INSERT INTO meals(id, created_at, updated_at, category, description, image_name, name, price)
	VALUES (2, current_timestamp, current_timestamp, 'BURGERS', 
  'Dla serowych smakoszy! Gdy do zwykłego hamburgera dodasz ser cheddar, otrzymasz pysznego burgera, który ucieszy każde podniebienie.', 
  'Cheeseburger.png', 'Cheeseburger', 5);

INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 1);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 5);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 6);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 7);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 8);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 9);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (2, 10);

-- mcdouble
INSERT INTO meals(id, created_at, updated_at, category, description, image_name, name, price)
	VALUES (3, current_timestamp, current_timestamp, 'BURGERS', 
  'Koneserzy wołowiny bardzo chętnie wybierają tego burgera. Znajdziesz w nim aż 2 plastry 100% wołowiny, a do tego ser cheddar, cebulę, keczup i musztardę. Na większy apetyt.', 
  'McDouble.png', 'McDouble', 5);

INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 1);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 5);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 6);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 7);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 8);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 9);
INSERT INTO meals_ingredients(meal_id, ingredient_id) VALUES (3, 10);

ALTER SEQUENCE roles_id_seq RESTART WITH 6;
ALTER SEQUENCE users_id_seq RESTART WITH 2;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 11;
ALTER SEQUENCE meals_id_seq RESTART WITH 4;