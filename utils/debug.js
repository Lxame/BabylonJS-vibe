// Функция для вывода отладочных сообщений
export function debugLog(message) {
    const debugDiv = document.getElementById('debugMessages');
    if (debugDiv) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        debugDiv.appendChild(messageElement);
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
    console.log(message);
}