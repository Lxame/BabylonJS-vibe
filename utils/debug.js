// Функция для вывода отладочных сообщений
var counter = 0;
export function debugLog(message) {
    const debugDiv = document.getElementById('debugMessages');
    if (debugDiv) {
        counter++;
        const messageElement = document.createElement('div');
        messageElement.textContent = `${counter}. `+message;
        debugDiv.appendChild(messageElement);
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
    console.log(message);
}