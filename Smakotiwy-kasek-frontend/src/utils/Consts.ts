export const API_BASE_URL = "http://192.168.0.16:8080/api";
export const SOCKET_BASE_URL = "http://192.168.0.16:8080/socket";

export const ACCESS_TOKEN = "accessToken";
export const CART = "cart";

export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

export const ITEM_NAME_MIN_LENGTH = 2;
export const ITEM_NAME_MAX_LENGTH = 40;

export const ITEM_DESCRIPTION_MIN_LENGTH = 2;
export const ITEM_DESCRIPTION_MAX_LENGTH = 200;

export const POST_CODE_LENGTH = 6;

export const PHONE_LENGTH = 9;

export const LOGOUT_SUCCESS = "Wylogowano pomyślnie!";
export const LOGOUT_ERROR = "Nie udało się wylogować. Spróbuj jeszcze raz.";

export const LOGIN_SUCCESS = "Zalogowano pomyślnie!";
export const LOGIN_ERROR = "Nie udało się zalogować. Spróbuj jeszcze raz.";
export const LOGIN_ERROR_INCORRECT = "Nie udało się zalogować. Podany login lub hasło są niepoprawne.";

export const MENU_ERROR = "Nie udało się załadować danych z serwera.";

export const MEAL_SUCCESS = "Posiłek utworzono pomyślnie!";
export const MEAL_ERROR = "Nie udało się zapisać posiłku. Spróbuj jeszcze raz.";
export const MEAL_DELETED_ERROR = "Nie udało się zapisać posiłku. Spróbuj jeszcze raz.";

export const INGREDIENT_SUCCESS = "Składnik utworzono pomyślnie!";

export const IMAGE_SUCCESS = "Zdjęcie dodano pomyślnie!";
export const IMAGE_ERROR = "Nie udało się usunąć zdjęcia. Spróbuj jeszcze raz.";

export const HISTORY_ERROR = "Nie udało się załadować historii zamówień. Spróbuj jeszcze raz.";

export const EMPLOYEE_ERROR = "Nie udało się załadować danych o użytkownikach. Spróbuj jeszcze raz.";

export const CART_SUCCESS = "Przedmiot dodano do koszyka!";

export const USER_SUCCESS = "Użytkownika utworzono pomyślnie!";

export const MSG_USERNAME_1 = "Nazwa użytkownika nie może być pusta!";
export const MSG_USERNAME_2 = "Nazwa użytkownika nie może zawierać tylko białych znaków (np. spacje)!";
export const MSG_USERNAME_3 = `Nazwa użytkownika musi mieć minimum ${USERNAME_MIN_LENGTH} znaków!`;
export const MSG_USERNAME_4 = `Nazwa użytkownika musi mieć maksimum ${USERNAME_MAX_LENGTH} znaków!`;

export const MSG_CITY_1 = "Miejscowość nie może być pusta!";
export const MSG_CITY_2 = "Miejscowość nie może zawierać tylko białych znaków (np. spacje)!";

export const MSG_POST_CODE_1 = "Kod pocztowy nie może być pusty!";
export const MSG_POST_CODE_2 = "Kod pocztowy nie może zawierać tylko białych znaków (np. spacje)!";
export const MSG_POST_CODE_3 = `Kod pocztowy musi mieć ${POST_CODE_LENGTH} znaków!`;

export const MSG_STREET_1 = "Ulica nie może być pusta!";
export const MSG_STREET_2 = "Ulica nie może zawierać tylko białych znaków (np. spacje)!";

export const MSG_EMAIL_1 = "Adres e-mail nie może być pusty!";
export const MSG_EMAIL_2 = "Adres e-mail nie może zawierać tylko białych znaków (np. spacja)!";
export const MSG_EMAIL_3 = `Adres e-mail musi mieć maksimum ${EMAIL_MAX_LENGTH} znaków!`;
export const MSG_EMAIL_4 = "Podana wartośc nie jest prawidłowym adresem e-mail!";

export const MSG_ROLE_1 = "Użytkownik musi mieć zdefiniowane role!";

export const MSG_PASSWORD_1 = "Hasło nie może być puste!";
export const MSG_PASSWORD_2 = "Hasło nie może zawierać tylko białych znaków (np. sapcje)!";
export const MSG_PASSWORD_3 = `Hasło musi mieć minimum ${PASSWORD_MIN_LENGTH} znaków!`;
export const MSG_PASSWORD_4 = `Hasło musi mieć maksimum ${PASSWORD_MAX_LENGTH} znaków!`;

export const MSG_NAME_1 = "Nazwa nie może być pusta!";
export const MSG_NAME_2 = "Nazwa nie może zawierać tylko białych znaków (np. sapcje)!";
export const MSG_NAME_3 = `Nazwa musi mieć minimum ${ITEM_NAME_MIN_LENGTH} znaków!`;
export const MSG_NAME_4 = `Nazwa musi mieć maksimum ${ITEM_NAME_MAX_LENGTH} znaków!`;

export const MSG_DESCRIPTION_1 = "Opis nie może być pusty!";
export const MSG_DESCRIPTION_2 = "Opis nie może zawierać tylko białych znaków (np. sapcje)!";
export const MSG_DESCRIPTION_3 = `Opis musi mieć minimum ${ITEM_DESCRIPTION_MIN_LENGTH} znaków!`;
export const MSG_DESCRIPTION_4 = `Opis musi mieć maksimum ${ITEM_DESCRIPTION_MAX_LENGTH} znaków!`;

export const MSG_IMAGE_1 = "Zdjęcie jest wymagane!";
export const MSG_IMAGE_2 = "Zdjęcie z taką nazwą już istnieje! Zmień nazwę pliku i spróbuj ponownie.";

export const MSG_PRICE_1 = "Cena produktu jest wymagana!";

export const MSG_QUANTITY_1 = "Ilość produktu jest wymagana!";

export const MSG_CATEGORY_1 = "Kategoria produktu jest wymagana!";

export const MSG_INGREDIENTS_1 = "Składniki produktu są wymagane!";

export const MSG_MEALS_1 = "Posiłki zestawu są wymagane!";

export const MSG_PHONE_1 = "Numer telefonu nie może być pusty!";
export const MSG_PHONE_2 = "Numer telefonu nie może zawierać tylko białych znaków (np. spacje)!";
export const MSG_PHONE_3 = `Numer telefonu musi mieć ${PHONE_LENGTH} cyfr!`;
