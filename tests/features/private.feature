@private @regresion
Feature: Página privada - Clubes de Fútbol
  Como usuario autenticado
  Quiero acceder a la zona privada
  Para visualizar y buscar información de clubes de fútbol españoles

  Background:
    Given Estoy en la pagina de login
    When Introduzco el usuario "user" y la contraseña "password"
    And Acepto los terminos de uso
    And Hago click en el boton "Entrar"
    Then Deberia ser redirigido a la zona privada
    And Deberia ver el mensaje de bienvenida "Bienvenido, user!"
    And Deberia ver la lista de productos
    And La URL deberia contener "private.html"

  @filtrar @mostrarTodos @ok
  Scenario: Visualizar la lista de clubes correctamente
    Given Deberia ver la tabla de clubes
    And Deberia ver "Mostrando 1-10 de 25 clubes" en el texto de resultados
    And El boton de cerrar sesion debe estar visible

  @filtrar @filterByName @ok
  Scenario: Buscar clubes por nombre
    When Busco "Real Madrid"
    Then La tabla debe mostrar 1 resultado
    And Deberia ver "Mostrando 1-1 de 1 clubes" en el texto de resultados
    And La tabla debe contener "Real Madrid CF"

  @filtrar @filtrarPorCiudad @ok
  Scenario: Buscar clubes por ciudad
    When Busco "Sevilla"
    Then La tabla debe mostrar 2 resultados
    And Deberia ver "Mostrando 1-2 de 2 clubes" en el texto de resultados    
    And La tabla debe contener "Sevilla FC"
    And La tabla debe contener "Real Betis"

  @logout
  Scenario: Cerrar sesion correctamente
    When Hago click en el boton de cerrar sesion
    Then Deberia ser redirigido a la pagina de login