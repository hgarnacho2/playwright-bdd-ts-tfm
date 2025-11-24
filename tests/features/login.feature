@login @regresion
Feature: Login de Usuario
  Como usuario del sistema
  Quiero poder iniciar sesión
  Para acceder a la zona privada

  Background:
    Given Estoy en la pagina de login

  @positive
  Scenario: Login exitoso con credenciales válidas
    When Introduzco el usuario "user" y la contraseña "password"
    And Acepto los terminos de uso
    And Hago click en el boton "Entrar"
    Then Deberia ser redirigido a la zona privada
    And Deberia ver el mensaje de bienvenida "Bienvenido, user!"
    And Deberia ver la lista de productos
    And La URL deberia contener "private.html"

  @negative
  Scenario Outline: Login fallido con credenciales inválidas
    When Introduzco el usuario "<usuario>" y la contraseña "<contraseña>"
    And Acepto los terminos de uso
    And Hago click en el boton "Entrar"
    Then Deberia permanecer en la pagina de login
    And Deberia ver el mensaje de error "<mensaje_error>"
    And La URL deberia contener "login.html"

    Examples:
      | usuario      | contraseña   | mensaje_error                     |
      | admin        | password     | Usuario o contraseña incorrectos  |
      | user         | 123456       | Usuario o contraseña incorrectos  |
      | incorrecto   | incorrecto   | Usuario o contraseña incorrectos  |

  @negative
  Scenario: Login fallido sin aceptar términos de uso
    When Introduzco el usuario "user" y la contraseña "password"
    And No acepto los terminos de uso
    And Hago click en el boton "Entrar"
    Then Deberia permanecer en la pagina de login

  @security
  Scenario: Acceso directo a zona privada sin autenticación
    When Intento acceder directamente a la zona privada
    Then Deberia ser redirigido a la pagina de login
    And Deberia ver una alerta indicando que debo iniciar sesion
