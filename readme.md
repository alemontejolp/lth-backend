# Learning To Hack Back-end

## Documentation

API documentation: https://docs.google.com/document/d/1umADzajae5TLxLIr2ciKth0GuhKeneOgKwLodWNdfi4/edit?usp=sharing

Backend documentation: https://docs.google.com/document/d/1Fl7x8Sl9ir2MenfNIVFj8mg_Ni61mmzzWi1gLhuS1G4/edit?usp=sharing

## About

Backend para plataforma de apredizaje y retos sobre programación.

Fue iniciado como proyecto escolar y continuado por gusto. :)

En este sistema, sólo los administradores podrán publicar cursos y vídeos, sin embargo, los usuarios normales podrán hacer todo lo demás.

Este sistema podría interesarle a las escuelas que quieran implementar clases grabadas para que sus estudiantes las vean después si necesitan un pequeño repaso. Los profesores podrían grabar algunas de sus clases y publicarlas en la plataforma después.

Si esta escuela además lleva la carrera o especialidad en programación (o similares), podrían usar el compilador en línea parar dar sus primeros pasos. También podrían organizar concursos gracias al juez que incorpora ( en un futuro ) la plataforma, pudiendo crear problemas y posteriormente concursos con estos.

Además, los propios usuario (estudiantes) podrían crear sus propios problemas y compartirlos con la comunidad estudiantil para que los resuelvan.

Esta fue la idea detrás del proyecto, aunque bien podría ser bifurcado para otra cosa.

Este sistema es sólo el back-end, si quieres acceder al front-end puedes buscar en mis otros respositorios, ahí debe estar con un nombre relacionado. Y si aún no está, pronto estará.

### Base features expected

* Compilación y ejecución de código.
	* Enviar código en C/C++ con su respectiva entrada y devolver la salida. **(Hecho)**.
* Juez en línea (algoritmos).
	* Creación y publicación de problemas para resolver.
	* Envío de soluciones a problemas y ejecución del juez sobre ese problema.
	* Clarificaciones del problema.
	* Ranking del problema.
	* Creación concurso.
		* Asignación de problemas.
		* Asignación de participantes.
		* Establecimiento de fechas de inicio y fin.
	* Eliminación de problema.
	* Eliminación de concurso.
* Cursos.
	* Publicación de curso. **(Hecho)**.
	* Obtener lista de cursos disponibles filtrada por búsqueda y limitada a intervalos por petición. **(Hecho)**.
	* Actualizar datos de un curso.
	* Autorizar curso a un usuario. **(Hecho)**.
	* Cargar vídeos a un curso. **(Hecho)**.
	* Actualización de datos de los vídeos de un curso.
	* Obtener vídeos de un curso.
		* Obtener lista limitada a intervalos. **(Hecho)**.
		* Obtener un sólo vídeo. **(Hecho)**.
	* Obtener lista de cursos autorizador a un usuario filtrada por búsqueda y limitada a intervalos por petición. **(Hecho)**.
	* Eliminar curso.
	* Eliminar vídeo.
* Usuarios.
	* Sistema de autenticación. **(Hecho)**.
	* Personalización de datos de perfil.
	* Creación y edición de publicaciones.
	* Creación y edición de publicaciones de discución.
	* Sistema de seguimiento entre usuarios.
	* Obtención de datos públicos de perfil de usuario.
	* Comentarios en las publicaciones.
	* Eliminar usuario.

## Dependencies

Es necesario que se encuentre instalado en la máquina donde se ejecutará este software el compilador de **g++**. De no ser así los servicios para la compilación del código fuente devolverán errores, debido a que es este el compilador que usa la librería que se encarga de mandar a compilar (Revisar ./lib/build_and_run.js). Concretamente es usado en la función **build**.

Es preferente ejecutar este software en un sistema GNU/Linux, aunque también es posible correrlo sobre Windows.

La razón de esta preferencia es que los comandos usados en la librería build_and_run.js fueron estilo **POSIX**, y sólo fueron probados en Windows 10. Es posible que en otras versiones de Windows los "pipes" ( | ) no funcionen haciendo que la librería falle al ejecutar los programas compilados usando la función **run**.
