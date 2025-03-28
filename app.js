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
    // Создаем линии треугольника
    const line1 = createLine(point1, point2);
    const line2 = createLine(point2, point3);
    const line3 = createLine(point3, point1);

    // Создаем закрашенный треугольник
    const polygon = BABYLON.MeshBuilder.CreatePolygon("triangle", {
        shape: [
            point1.position,
            point2.position,
            point3.position
        ],
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);

    // Создаем материал для треугольника
    const material = new BABYLON.StandardMaterial("triangleMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1.0); // Голубой цвет
    material.alpha = 0.5; // Полупрозрачность
    material.backFaceCulling = false;
    polygon.material = material;

    return [line1, line2, line3, polygon];
}

// Функция для создания отрезка по введенным координатам
window.createLineFromInputs = function () {
    // Очищаем предыдущие объекты
    clearScene();

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
};

// Функция для создания треугольника по введенным координатам
window.createPlaneFromInputs = function () {
    // Очищаем предыдущие объекты
    clearScene();

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
};

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
};

// Запускаем рендер
engine.runRenderLoop(function () {
    scene.render();
});

// Обработка изменения размера окна
window.addEventListener("resize", function () {
    engine.resize();
}); 