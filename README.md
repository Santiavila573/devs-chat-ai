# Devs-Chat-AI
Chatbot Inteligente para Desarrolladores con React e IA

📌 Descripción
DevBot-AI-Assistant es un chatbot avanzado desarrollado con React y diseñado para ayudar a desarrolladores a resolver errores de código, buscar soluciones en repositorios, y ofrecer recomendaciones para añadir funcionalidades. Utiliza una API key de OpenAI para analizar problemas, generar soluciones, y proporcionar explicaciones detalladas.
El chatbot está optimizado para integrarse con repositorios de GitHub, GitLab o Bitbucket, permitiendo buscar errores similares y soluciones probadas en proyectos existentes. Además, puede sugerir mejoras de código, optimizaciones, y nuevas funcionalidades basadas en las necesidades del usuario.

✨ Características Principales
CaracterísticaDescripciónResolución de erroresAnaliza errores de código y sugiere soluciones basadas en IA y repositorios públicos.Búsqueda en repositoriosBusca errores similares y soluciones en repositorios de GitHub, GitLab, etc.Consultas de códigoResponde preguntas sobre sintaxis, buenas prácticas, y patrones de diseño.Recomendaciones de funcionalidadesSugiere cómo añadir nuevas funcionalidades o mejorar el código existente.Integración con OpenAIUtiliza modelos avanzados de IA para generar respuestas precisas y contextualizadas.Historial de consultasGuarda el historial de conversaciones para referencia futura.Interfaz con ReactDiseño moderno, responsivo y fácil de usar, con componentes reutilizables.

🔧 Tecnologías Utilizadas
TecnologíaDescripciónReactBiblioteca para construir interfaces de usuario dinámicas y escalables.OpenAI APIModelo de lenguaje para analizar errores y generar soluciones.AxiosBiblioteca para realizar llamadas HTTP a la API de OpenAI y repositorios.GitHub APIAPI para buscar errores y soluciones en repositorios públicos.MarkdownFormato para mostrar código y soluciones de manera clara.React RouterManejo de rutas para navegación entre secciones (chat, historial, configuración).

📂 Estructura del Proyecto
 <br>
 <img width="752" height="271" alt="image" src="https://github.com/user-attachments/assets/db61f9cb-3800-43bd-b7ec-bf10f6526087" />

<br>
⚙️ Instalación y Configuración
1. Requisitos previos

Node.js (v18 o superior)
Cuenta en OpenAI para obtener una API key
Cuenta en GitHub (opcional, para búsqueda en repositorios)

2. Clonar el repositorio
 Copygit clone https://github.com/tu-usuario/devbot-ai-assistant.git
cd devbot-ai-assistant/client
3. Instalar dependencias
 Copynpm install
4. Configurar las API keys
Crea un archivo .env en la raíz del proyecto client/ y agrega tus API keys:
 CopyREACT_APP_OPENAI_API_KEY=tu_api_key_de_openai
REACT_APP_GITHUB_API_KEY=tu_api_key_de_github # Opcional
5. Ejecutar la aplicación
 Copynpm start

La aplicación estará disponible en http://localhost:3000.


🎯 Funcionalidades Clave

Resolución de errores: El usuario pega un error de código, y el chatbot analiza el problema, busca soluciones en repositorios, y sugiere correcciones.
Búsqueda en repositorios: El chatbot busca errores similares en repositorios públicos y muestra soluciones probadas.
Consultas de código: Responde preguntas sobre sintaxis, librerías, patrones de diseño, y buenas prácticas.
Recomendaciones de funcionalidades: Sugiere cómo añadir nuevas funcionalidades, optimizar código, o mejorar la arquitectura.
Historial de consultas: Guarda todas las interacciones para referencia futura.
Interfaz intuitiva: Diseño claro y fácil de usar, con soporte para resaltar sintaxis de código.


📊 Ejemplo de Uso

Pegar un error: El usuario pega un error de código en el chat.
Analizar el error: El chatbot analiza el error y busca soluciones en repositorios.
Recibir solución: El chatbot muestra una explicación del error y sugiere correcciones.
Guardar en historial: La consulta se guarda automáticamente para referencia futura.
Consultar repositorios: El chatbot puede mostrar ejemplos de código de repositorios públicos que resuelven problemas similares.


🔗 Integración con la API de OpenAI y GitHub
Para integrar el chatbot con OpenAI y GitHub, puedes usar el siguiente ejemplo en JavaScript:
 Copyimport axios from 'axios';

// Consulta a OpenAI para analizar un error
const consultarOpenAI = async (error) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un asistente para desarrolladores. Analiza el siguiente error y sugiere una solución:' },
        { role: 'user', content: error }
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
};

// Buscar en repositorios de GitHub
const buscarEnGitHub = async (error) => {
  const response = await axios.get(
    `https://api.github.com/search/code?q=${encodeURIComponent(error)}`,
    {
      headers: {
        'Authorization': `token ${process.env.REACT_APP_GITHUB_API_KEY}`,
      },
    }
  );
  return response.data.items;
};

export { consultarOpenAI, buscarEnGitHub };

📝 Contribuciones
¡Las contribuciones son bienvenidas! Para colaborar:

Abrir un issue con la propuesta.
Crear un fork del repositorio.
Enviar un pull request con los cambios.


📜 Licencia
Este proyecto está bajo la licencia Apache 2.0. Consulta el archivo LICENSE para más detalles.

📬 Contacto

Autor: Santiago Avila
<br>
Correo: avilasantiago917@ngmail.com
<br>
Linkedin: https://www.linkedin.com/in/santiago-ávila-301047200


