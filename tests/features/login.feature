@login @smoke
Feature: Login de Usuario
  Como usuario del sistema
  Quiero poder iniciar sesión
  Para acceder a la zona privada

  Background:
    Given que estoy en la página de login

  @positive @regresion
  Scenario: Login exitoso con credenciales válidas
    When ingreso el usuario "user_NO_VALIDO" y la contraseña "password"
    And acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería ser redirigido a la zona privada
    And debería ver el mensaje de bienvenida "Bienvenido, user!"
    And debería ver la lista de productos
    And la URL debería contener "private.html"

  @negative @regresion
  Scenario Outline: Login fallido con credenciales inválidas
    When ingreso el usuario "<usuario>" y la contraseña "<contraseña>"
    And acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería permanecer en la página de login
    And debería ver el mensaje de error "<mensaje_error>"
    And la URL debería contener "login.html"

    Examples:
      | usuario      | contraseña   | mensaje_error                     |
      | admin        | password     | Usuario o contraseña incorrectos  |
      | user         | 123456       | Usuario o contraseña incorrectos  |
      | incorrecto   | incorrecto   | Usuario o contraseña incorrectos  |

  @negative @regresion
  Scenario: Login fallido sin aceptar términos de uso
    When ingreso el usuario "user" y la contraseña "password"
    And NO acepto los términos de uso
    And hago clic en el botón "Entrar"
    Then debería permanecer en la página de login

  @security @regresion
  Scenario: Acceso directo a zona privada sin autenticación
    When intento acceder directamente a la zona privada
    Then debería ser redirigido automáticamente al login
    And debería ver una alerta indicando que debo iniciar sesión
