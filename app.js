const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Создаем камеру
const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);

// Добавляем освещение
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Функция для создания координатных осей
function createAxes() {
    const axisLength = 1;

    // Создаем оси
    const xAxis = BABYLON.MeshBuilder.CreateLines("xAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(axisLength, 0, 0)
        ],
        colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)]
    }, scene);

    const yAxis = BABYLON.MeshBuilder.CreateLines("yAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, axisLength, 0)
        ],
        colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)]
    }, scene);

    const zAxis = BABYLON.MeshBuilder.CreateLines("zAxis", {
        points: [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, 0, axisLength)
        ],
        colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)]
    }, scene);
}

// Создаем координатные оси
createAxes();

// Переменные для хранения текущей линии и треугольника
let currentLine = null;
let currentTriangle = null;
let currentPoints = [];
let allLines = []; // Добавляем массив для хранения всех линий

// Функция для создания точки
function createPoint(position) {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
        diameter: 0.2,
        segments: 16
    }, scene);
    sphere.position = position;
    currentPoints.push(sphere);
    return sphere;
}

// Функция для создания линии между двумя точками
function createLine(point1, point2) {
    const points = [point1.position, point2.position];
    const lines = BABYLON.MeshBuilder.CreateLines("lines", {
        points: points,
        updatable: true
    }, scene);
    allLines.push(lines); // Добавляем линию в массив
    return lines;
}

// Функция для создания треугольника по трем точкам
function createTriangle(point1, point2, point3) {
    try {
        debugLog('Creating triangle lines...');
        // Создаем линии треугольника
        const line1 = createLine(point1, point2);
        const line2 = createLine(point2, point3);
        const line3 = createLine(point3, point1);
        debugLog('Triangle lines created');

        debugLog('Creating triangle mesh...');
        // Создаем треугольник с помощью CreateMesh
        const vertices = [
            point1.position.x, point1.position.y, point1.position.z,
            point2.position.x, point2.position.y, point2.position.z,
            point3.position.x, point3.position.y, point3.position.z
        ];

        const indices = [0, 1, 2];

        const vertexData = new BABYLON.VertexData();
        vertexData.positions = vertices;
        vertexData.indices = indices;

        const polygon = new BABYLON.Mesh("triangle", scene);
        vertexData.applyToMesh(polygon);
        polygon.convertToUnIndexedMesh();
        debugLog('Triangle mesh created');

        debugLog('Creating triangle material...');
        // Создаем материал для треугольника
        const material = new BABYLON.StandardMaterial("triangleMaterial", scene);
        material.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1.0); // Голубой цвет
        material.alpha = 0.5; // Полупрозрачность
        material.backFaceCulling = false;
        polygon.material = material;
        debugLog('Triangle material created');

        return [line1, line2, line3, polygon];
    } catch (error) {
        debugLog('Error creating triangle: ' + error.message);
        throw error; // Пробрасываем ошибку дальше
    }
}

// Функция для очистки только линии
function clearLine() {
    if (currentLine) {
        currentLine.dispose();
        currentLine = null;
    }
}

// Функция для очистки только треугольника
function clearTriangle() {
    if (currentTriangle) {
        currentTriangle.forEach(mesh => {
            if (mesh.material) {
                mesh.material.dispose();
            }
            mesh.dispose();
        });
        currentTriangle = null;
    }
}

// Функция для вывода отладочных сообщений
function debugLog(message) {
    const debugDiv = document.getElementById('debugMessages');
    if (debugDiv) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        debugDiv.appendChild(messageElement);
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
    console.log(message); // Также выводим в консоль для удобства
}

// Функция для создания отрезка по введенным координатам
window.createLineFromInputs = function () {
    // Очищаем только линию, если она есть
    clearLine();

    // Получаем значения координат
    const x1 = parseFloat(document.getElementById("line_x1").value) || 0;
    const y1 = parseFloat(document.getElementById("line_y1").value) || 0;
    const z1 = parseFloat(document.getElementById("line_z1").value) || 0;
    const x2 = parseFloat(document.getElementById("line_x2").value) || 0;
    const y2 = parseFloat(document.getElementById("line_y2").value) || 0;
    const z2 = parseFloat(document.getElementById("line_z2").value) || 0;

    // Создаем точки
    const point1 = createPoint(new BABYLON.Vector3(x1, y1, z1));
    const point2 = createPoint(new BABYLON.Vector3(x2, y2, z2));

    // Создаем линию
    currentLine = createLine(point1, point2);

    // Отключаем ввод для линии
    disableLineInputs();
};

// Функция для создания треугольника по введенным координатам
window.createPlaneFromInputs = function () {
    try {
        debugLog('createPlaneFromInputs started');
        // Очищаем только треугольник, если он есть
        clearTriangle();

        // Получаем значения координат
        const x1 = parseFloat(document.getElementById("plane_x1").value) || 0;
        const y1 = parseFloat(document.getElementById("plane_y1").value) || 0;
        const z1 = parseFloat(document.getElementById("plane_z1").value) || 0;
        const x2 = parseFloat(document.getElementById("plane_x2").value) || 0;
        const y2 = parseFloat(document.getElementById("plane_y2").value) || 0;
        const z2 = parseFloat(document.getElementById("plane_z2").value) || 0;
        const x3 = parseFloat(document.getElementById("plane_x3").value) || 0;
        const y3 = parseFloat(document.getElementById("plane_y3").value) || 0;
        const z3 = parseFloat(document.getElementById("plane_z3").value) || 0;

        // Создаем точки
        const point1 = createPoint(new BABYLON.Vector3(x1, y1, z1));
        const point2 = createPoint(new BABYLON.Vector3(x2, y2, z2));
        const point3 = createPoint(new BABYLON.Vector3(x3, y3, z3));

        // Создаем треугольник
        currentTriangle = createTriangle(point1, point2, point3);
        debugLog('Triangle created successfully');

        debugLog('About to disable triangle inputs...');
        // Отключаем ввод для треугольника
        disableTriangleInputs();
        debugLog('Triangle inputs disabled');
    } catch (error) {
        debugLog('Error in createPlaneFromInputs: ' + error.message);
        alert('Error creating triangle: ' + error.message);
    }
};

// Функции для управления состоянием элементов интерфейса
function disableLineInputs() {
    debugLog('disableLineInputs started');
    const lineInputs = ['line_x1', 'line_y1', 'line_z1', 'line_x2', 'line_y2', 'line_z2'];
    lineInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = true;
            input.style.backgroundColor = '#f0f0f0';
        }
    });
    const button = document.querySelector('button[onclick="createLineFromInputs()"]');
    debugLog('Line button found: ' + (button ? 'yes' : 'no'));
    if (button) {
        button.disabled = true;
        button.style.backgroundColor = '#cccccc';
    }
}

function disableTriangleInputs() {
    debugLog('disableTriangleInputs started');
    const triangleInputs = ['plane_x1', 'plane_y1', 'plane_z1', 'plane_x2', 'plane_y2', 'plane_z2', 'plane_x3', 'plane_y3', 'plane_z3'];
    triangleInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = true;
            input.style.backgroundColor = '#f0f0f0';
        }
    });
    const button = document.querySelector('button[onclick="createPlaneFromInputs()"]');
    debugLog('Triangle button found: ' + (button ? 'yes' : 'no'));
    if (button) {
        button.disabled = true;
        button.style.backgroundColor = '#cccccc';
    }
}

function enableAllInputs() {
    const allInputs = document.querySelectorAll('input[type="number"]');
    allInputs.forEach(input => {
        input.disabled = false;
        input.style.backgroundColor = 'white';
    });

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id !== 'clearButton') {
            button.disabled = false;
            if (button.onclick.toString().includes('createLineFromInputs')) {
                button.style.backgroundColor = '#4CAF50';
            } else if (button.onclick.toString().includes('createPlaneFromInputs')) {
                button.style.backgroundColor = '#4CAF50';
            }
        }
    });
}

// Функция для очистки всех объектов в сцене
window.clearScene = function () {
    // Удаляем все линии
    allLines.forEach(line => {
        if (line.material) {
            line.material.dispose();
        }
        line.dispose();
    });
    allLines = [];

    // Удаляем текущую линию
    if (currentLine) {
        currentLine.dispose();
        currentLine = null;
    }

    // Удаляем текущий треугольник
    if (currentTriangle) {
        currentTriangle.forEach(mesh => {
            if (mesh.material) {
                mesh.material.dispose();
            }
            mesh.dispose();
        });
        currentTriangle = null;
    }

    // Удаляем все точки
    currentPoints.forEach(point => {
        if (point.material) {
            point.material.dispose();
        }
        point.dispose();
    });
    currentPoints = [];

    // Включаем все поля ввода
    enableAllInputs();
};

// Запускаем рендер
engine.runRenderLoop(function () {
    scene.render();
});

// Обработка изменения размера окна
window.addEventListener("resize", function () {
    engine.resize();
}); 