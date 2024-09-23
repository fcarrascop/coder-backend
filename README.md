# coder-backend

Este es el repositorio del curso de backend de CoderHouse.
La final de este repositorio de la producción del Proyecto final de este curso.

## Proyecto Final
### Objetivo
El objetivo de este proyecto es desarrollar un e-commerce de un rubro a elección. Usando diseño de capas y otros conceptos utilizados en clases.
Algunos puntos que tiene el proyecto es:
- Manejo de sesiones.
- Proceso de compra.
- Arquitectura de proyecto.

## Aplicación
El e-commerce creado lleva el nombre de ["Tienda Genérica"](https://tiendagenerica.up.railway.app/).

La aplicación tiene pantalla de login, en el cual podemos registrarnos (de forma manual o con GitHub), iniciar sesión y recuperar contraseña.
Al recuperar contraseña, podremos usar el email con el que nos registramos. Este nos enviará un link, con límite de tiempo, a donde podremos cambiar nuestra contraseña.

Una vez que nos registramos e iniciamos sesión, nos permitirá hacer compras dentro de nuestra tienda. La sección de "Productos" nos permitirá elegir distintos productos, los cuales se agregará al carro.

Para poder ver los productos que tenemos en el carro, nos vamos a la sección "🛒", donde nos permitirá eliminar productos, limpiar el carro o realizar la compra.
Dentro de esta página, también podremos ver la cantidad de los productos que tenemos, el precio de estos, el costo final de estos, etc.
Cuando realicemos la compra, este nos dará algunos datos de la compra, como por ejemplo:
- El email del comprador.
- El monto final.
- El código de compra.
- La fecha de compra.
Además, se enviará un email al email del comprador, con los datos de la compra.

También tenemos la sección de "Chat", el cual nos permitirá tener un chat dentro de nuestra aplicación.

Finalmente, tenemos la sección de "Perfil", donde tenemos distintas opciones:
- Ver información de nuestro usuario.
- Subir archivos, para poder validar nuestro usuario y poder optar a ser un usuario "Premium".
- Cambiar la contraseña.
- Cerrar la sesión

De forma adicional, se agrega la sección "admin" para los usuarios administradores, en el cual aparecerán todos los usuarios. Dentro de esta pestaña, podremos:
- Eliminar a los usuarios que no han entrado a la página dentro de 2 días.
- Ver todos los usuarios y realizar dos acciones:
	- Editar el rol del usuario.
	- Eliminar el usuario.

## Clonar el proyecto
Aparte de clonar, se necesita un archivo `.env` para poder ejecutar el proyecto de forma integral. Si gustase de ejecutarlo, me puede enviar un email a carrascopatelli.fa@gmail.com.
Si no, puede ver el proyecto funcionando en su [página web](https://tiendagenerica.up.railway.app/).